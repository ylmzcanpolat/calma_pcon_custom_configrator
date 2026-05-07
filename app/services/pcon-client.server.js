import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { performance } from "perf_hooks";
import { InsertInfo } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";
import { mapProperties } from "./property-mapper.server.js";
import { buildCartProperties } from "./cart-builder.server.js";
import { GetChoiceListOptions } from "@easterngraphics/wcf/modules/eaiws/basket";
import { buildTextureDescriptor } from "./texture-cache.server.js";
import { buildSubArticleSnapshot } from "./gltf-enricher.server.js";
import { sessionPool } from "./pcon-session-pool.server.js";

/**
 * Faz 0 telemetry: bir EAIWS RPC çağrısının süresini opsiyonel timer'a
 * yazmak için küçük helper. `timer === null` ise davranış aynen değişmez
 * (mevcut caller'lar — örn. `cache-warmer.server.js`, `article-warmer` —
 * timer geçmez ve etkilenmez).
 *
 * Bu helper deliberately `mark()` değil `markRaw()` kullanır; çünkü
 * `pcon-client` içindeki sub-RPC'ler bir HTTP request'in toplam akışında
 * kendi running clock cursor'unu oynatmamalı — caller `timer.mark()`'ları
 * üst seviyede atıyor.
 */
async function _measureRpc(label, timer, fn) {
  if (!timer) return fn();
  const t0 = performance.now();
  try {
    return await fn();
  } finally {
    try {
      timer.markRaw(label, performance.now() - t0);
    } catch {
      // Telemetry asla istek akışını bozmamalı.
    }
  }
}

/**
 * EAIWS bazı durumlarda kendi döndürdüğü dahili/bağımlı değerleri
 * (örn. Numeric/Length tipi property için "_5" gibi placeholder değerler)
 * `setPropertyValue` çağrısında geri kabul etmez ve Java tarafında
 * `NumberFormatException` ya da "unknown property" hatası fırlatır.
 *
 * Bu hatalar tek bir property için lokal hatadır; tüm güncelleme akışını
 * iptal etmemeliyiz. Bu yardımcı, döngü içinde sessizce atlanması
 * gereken hata mesajlarını tespit eder.
 */
export function isSkippablePropertyError(err) {
  const message = err?.message || "";
  return (
    message.includes("unknown property") ||
    message.includes("UnknownPropertyException") ||
    message.includes("value not a number") ||
    message.includes("NumberFormatException") ||
    message.includes("value out of range") ||
    message.includes("value not allowed")
  );
}

/**
 * `PconClient` — Faz 7 itibarıyla artık doğrudan bir `EaiwsSession` tutmuyor.
 *
 * Tüm RPC method'ları `sessionPool.runWithSession[ForItem](timer, fn)`
 * üzerinden bir lease alır; lease.session içindeki EAIWS instance'ında
 * çalışır; `finally` ile session pool'a geri verilir.
 *
 * Geriye uyumluluk
 * ────────────────
 * - Sınıf, `getPconClient()` ve default export aynen korunur.
 * - Her public method **aynı parametre + return shape**'ini sürdürür.
 *   (cache-warmer, route handler'ları, cart-payload helper'ı bu sözleşmeye
 *   güvenir.)
 * - `PCON_SESSION_POOL_SIZE=1` (default) modunda pool tek session tutar
 *   ve davranış bytewise mevcut singleton akışıyla eşdeğerdir.
 *
 * Pool size > 1
 * ─────────────
 * - itemId-bazlı method'lar `runWithSessionForItem(itemId, ...)` ile
 *   sarılır → affinity hit'te aynı session reuse, miss'te route'un
 *   "stale itemId → re-insert" pattern'i devreye girer.
 * - `getArticleData` (yeni article insert) `runWithSession(timer, fn)` ile
 *   sarılı; insert sonrası `lease.currentItemId = itemId` çağrısı
 *   affinity'yi yazar.
 *
 * Telemetri
 * ─────────
 * - `_measureRpc` helper'ı tüm sub-RPC'lerde Faz 0 sözleşmesiyle korunur.
 * - Pool lease/release süreleri `lease.acquire` ve `lease.queueWait`
 *   phase'leri olarak timer'a yazılır (yalnızca timer != null ise).
 */
class PconClient {
  /**
   * @param {string} articleNumber
   * @param {string} [manufacturerId]
   * @param {object} [timer] Faz 0 perf-logger timer (opsiyonel; null/undefined
   *   olduğunda davranış değişmez — geriye uyumlu imza).
   */
  async getArticleData(articleNumber, manufacturerId, timer = null) {
    return sessionPool.runWithSession(timer, async (lease) => {
      const session = lease.session;

      const topFolderId = await _measureRpc(
        "eaiws.getTopFolderId",
        timer,
        () => session.basket.getTopFolderId(),
      );

      const insertInfo = new InsertInfo();
      insertInfo.baseArticleNumber = articleNumber;
      if (manufacturerId) insertInfo.manufacturerId = manufacturerId;

      const itemId = await _measureRpc(
        "eaiws.insertOFMLArticle",
        timer,
        () => session.basket.insertOFMLArticle(topFolderId, null, insertInfo),
      );
      // Affinity yaz: bu itemId'ye ait bir sonraki çağrı aynı session'a
      // (pool size > 1'de) preferred routed olur. Pool size 1'de no-op
      // semantics (tek entry her zaman match).
      lease.currentItemId = itemId;

      const articleData = await _measureRpc(
        "eaiws.getArticleData",
        timer,
        () =>
          session.basket.getArticleData(itemId, {
            fetchCatalogImage: true,
            enableBooleanPropType: true,
          }),
      );

      const tOptions = new GetChoiceListOptions();
      tOptions.enableBooleanPropType = true;
      tOptions.highResPropValueIcons = true;
      tOptions.fetchPropValueImages = true;

      const choiceLists = await _measureRpc(
        "eaiws.getAllChoiceLists",
        timer,
        () => session.basket.getAllChoiceLists(itemId, tOptions),
      );

      const gltfUrl = await _measureRpc(
        "eaiws.getExportedGeometry",
        timer,
        () => session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
      );

      const currency =
        articleData.currency || (await session.basket.getCurrency());

      const properties = await mapProperties(articleData, choiceLists);

      const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

      const cartProperties = buildCartProperties(articleData, choiceLists);

      return {
        itemId,
        price,
        gltfUrl,
        properties,
        currency,
        cartProperties,
        articleNumber: articleData.baseArticleNumber,
        manufacturerId: articleData.manufacturerId,
        seriesId: articleData.seriesId,
        shortText: articleData.shortText,
      };
    });
  }

  /**
   * @param {string} itemId
   * @param {Array<{propClass:string, propName:string, value:any}>} propertyList
   * @param {object} [timer] Faz 0 perf-logger timer (opsiyonel; null/undefined
   *   olduğunda davranış değişmez — `cache-warmer.server.js` mevcut imza ile
   *   çağırmaya devam eder).
   */
  async setPropertyValue(itemId, propertyList, timer = null) {
    return sessionPool.runWithSessionForItem(itemId, timer, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      // Tüm setPropertyValue RPC'lerinin toplam süresini tek bir
      // `eaiws.setProp` phase'i altında raporluyoruz; çünkü dışarıdan
      // bakıldığında bunlar tek bir mantıksal "property apply" adımı.
      const setPropStart = timer ? performance.now() : 0;
      for (const { propClass, propName, value } of propertyList) {
        if (value === null || value === undefined || value === "") {
          continue;
        }

        try {
          await session.basket.setPropertyValue(
            targetItemId,
            propClass,
            propName,
            value,
          );
        } catch (err) {
          if (isSkippablePropertyError(err)) {
            console.warn(
              `[PconClient] Skipping property ${propClass}.${propName}=${value}: ${err.message}`,
            );
            continue;
          }
          throw err;
        }
      }
      if (timer) {
        try {
          timer.markRaw("eaiws.setProp", performance.now() - setPropStart);
        } catch {
          /* telemetry must not throw */
        }
      }

      const articleData = await _measureRpc(
        "eaiws.getArticleData",
        timer,
        () =>
          session.basket.getArticleData(targetItemId, {
            fetchCatalogImage: true,
            fetchCatalogIcon: true,
            enableBooleanPropType: true,
          }),
      );

      const tOptions = new GetChoiceListOptions();
      tOptions.enableBooleanPropType = true;
      tOptions.highResPropValueIcons = true;
      tOptions.fetchPropValueImages = true;

      const choiceLists = await _measureRpc(
        "eaiws.getAllChoiceLists",
        timer,
        () => session.basket.getAllChoiceLists(targetItemId, tOptions),
      );

      console.log("choiceLists", JSON.stringify(choiceLists, null, 2));

      const gltfUrl = await _measureRpc(
        "eaiws.export",
        timer,
        () => session.basket.getExportedGeometry(targetItemId, ["format=GLTF"]),
      );

      const currency =
        articleData.currency || (await session.basket.getCurrency());
      const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

      const properties = await mapProperties(articleData, choiceLists);

      const cartProperties = buildCartProperties(articleData, choiceLists);

      return {
        price,
        gltfUrl,
        properties,
        currency,
        cartProperties,
      };
    });
  }

  /**
   * Faz 2 — Appearance-only property değişimi için light-weight material
   * patch üretir. Mevcut `setPropertyValue`'nun aksine GLB export
   * (`getExportedGeometry`) ÇAĞRILMAZ — bütün performans kazancı buradan.
   *
   * Caller (genellikle `pcon-proxy.api.pcon.update.jsx`) yalnızca
   * `classifyProperties` "appearance" döndüğünde bu method'u çağırmalıdır;
   * geometry/unknown property'leri için mevcut full-GLB yolu (yani
   * `setPropertyValue`) kullanılmaya devam eder.
   *
   * Telemetri: tüm sub-RPC'ler `_measureRpc` ile sarılır; phase isimleri
   * mevcut Faz 0 sözleşmesiyle uyumlu (`eaiws.setProp`, `eaiws.getArticleData`,
   * `eaiws.getAllChoiceLists`). **`eaiws.export` mark'ı YOK** — bu kanıt
   * Server-Timing header'ında doğrudan görülebilir ve "GLB üretmiyor"
   * iddiasını otomatik test edilebilir kılar.
   *
   * @param {string} itemId
   * @param {Array<{propClass:string, propName:string, value:any}>} propertyList
   *   Frontend her zaman tüm property snapshot'ını gönderir; biz hepsini
   *   uygularız (idempotent), sonra `dirtyPropertyIds` üzerinden patch
   *   scope'unu daraltırız.
   * @param {string[]} dirtyPropertyIds Bu request'te değişen property id'leri
   *   (örn. `["DUVAR.KECE_RENK_DUVAR"]`). Patches dizisinin scope'u bunlardır.
   * @param {object} [timer] Faz 0 perf-logger timer (opsiyonel).
   * @returns {Promise<{
   *   type: "material-patch",
   *   patches: Array<{
   *     propClass: string,
   *     propName: string,
   *     value: any,
   *     targetSelectors: Array<string>,
   *     material: {
   *       baseColorTextureUrl: string|null,
   *       baseColorFactor: string|null,
   *       metalness: number,
   *       roughness: number
   *     }
   *   }>,
   *   price: number,
   *   currency: string,
   *   properties: Array,
   *   cartProperties: object|null,
   *   _textureSources: Array<{ hash: string, sourceUrl: string, ext: string }>
   * }>}
   *   `_textureSources`: route'un fire-and-forget `getOrFetchTexture()`
   *   çağırması için; public response'a gönderilmeden önce caller
   *   istediğinde strip edebilir (bu method tarafı sorumluluğu değil).
   *
   *   `targetSelectors`: Faz 4 — frontend MaterialSwapper bu liste üzerinden
   *   mesh'leri resolve eder (`sub:<subArticleId>`). Boş array fallback'i
   *   tetikler (mesh-name pattern veya skip).
   */
  async getMaterialPatch(itemId, propertyList, dirtyPropertyIds, timer = null) {
    return sessionPool.runWithSessionForItem(itemId, timer, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      if (!Array.isArray(dirtyPropertyIds) || dirtyPropertyIds.length === 0) {
        throw new Error(
          "getMaterialPatch requires at least one dirtyPropertyId; caller should fall back to setPropertyValue otherwise.",
        );
      }

      // 1) Property'leri uygula. `setPropertyValue` mevcut method'unun
      //    içeriğini çoğaltıyoruz çünkü o method GLB export de ediyor;
      //    biz GLB'yi atlamak istiyoruz. Loop ve skip semantiği aynı.
      const setPropStart = timer ? performance.now() : 0;
      for (const { propClass, propName, value } of propertyList) {
        if (value === null || value === undefined || value === "") {
          continue;
        }

        try {
          await session.basket.setPropertyValue(
            targetItemId,
            propClass,
            propName,
            value,
          );
        } catch (err) {
          if (isSkippablePropertyError(err)) {
            console.warn(
              `[PconClient.getMaterialPatch] Skipping property ${propClass}.${propName}=${value}: ${err.message}`,
            );
            continue;
          }
          throw err;
        }
      }
      if (timer) {
        try {
          timer.markRaw("eaiws.setProp", performance.now() - setPropStart);
        } catch {
          /* telemetry must not throw */
        }
      }

      // 2) ChoiceLists — değişen property'lerin yeni `currentValue` option'ını
      //    bulmak için. `fetchPropValueImages` + `highResPropValueIcons` =>
      //    `propValue.image` field'ı dolu gelir (texture preview URL).
      const tOptions = new GetChoiceListOptions();
      tOptions.enableBooleanPropType = true;
      tOptions.highResPropValueIcons = true;
      tOptions.fetchPropValueImages = true;

      const choiceLists = await _measureRpc(
        "eaiws.getAllChoiceLists",
        timer,
        () => session.basket.getAllChoiceLists(targetItemId, tOptions),
      );

      // 3) Article data — fiyat + cartProperties için. `setPropertyValue`
      //    ile aynı flag set'i (catalog image dahil); cart-builder'ın
      //    statik portion'unun consistency'si için.
      const articleData = await _measureRpc(
        "eaiws.getArticleData",
        timer,
        () =>
          session.basket.getArticleData(targetItemId, {
            fetchCatalogImage: true,
            fetchCatalogIcon: true,
            enableBooleanPropType: true,
          }),
      );

      // 3.5) Faz 4 — Sub-article snapshot for `targetSelectors` enrichment.
      //
      // Frontend MaterialSwapper patch.targetSelectors üzerinden mesh'leri
      // resolve ediyor. Snapshot'ı burada üretip her patch'e `sub:<id>` listesi
      // iliştiriyoruz. `materials[]` bilgisi şu an Faz 3 enricher'ında boş
      // emit ediliyor (planned for later phase) → mapping bulunamazsa
      // `targetSelectors: []` döner; frontend pconMaterialName / mesh-name
      // pattern fallback'ine düşer ya da (kabul kriteri 4) görsel swap'i
      // atlar ve state-only update yapar.
      //
      // **Fail-soft**: snapshot çağrısı hata verirse `targetSelectors: []`
      // her patch'te garanti edilir; mevcut Faz 2 davranışı (selectors yokken)
      // bytewise korunur.
      let subArticleSnapshot = [];
      try {
        const itemPropsRaw = await _measureRpc(
          "eaiws.getItemProperties",
          timer,
          () =>
            session.basket.getItemProperties([targetItemId], {
              subArticles: true,
            }),
        );
        subArticleSnapshot = buildSubArticleSnapshot(itemPropsRaw);
      } catch (err) {
        console.warn(
          `[PconClient.getMaterialPatch] sub-article snapshot failed: ${err.message}`,
        );
        subArticleSnapshot = [];
      }

      // 4) **`eaiws.export` ÇAĞRILMAZ.** Bu method'un raison d'être'i.

      // 5) Patches'i dirty property'lerden üret. ChoiceList lookup'ı
      //    `propClass.propName` key'ine göre yapılır.
      const choiceMap = new Map();
      for (const cl of choiceLists) {
        choiceMap.set(`${cl.propClass}.${cl.propName}`, cl);
      }

      // ArticleData üzerindeki güncel property değerleri (setPropertyValue
      // sonrası state). Patch'in `value` alanı buradan okunur.
      const propMap = new Map();
      for (const p of articleData.properties || []) {
        propMap.set(`${p.propClass}.${p.propName}`, p);
      }

      const patches = [];
      const textureSources = [];

      for (const id of dirtyPropertyIds) {
        const choice = choiceMap.get(id);
        const prop = propMap.get(id);
        if (!choice || !prop) {
          // Property var olmayabilir veya bu article'da henüz tanımsız.
          // Patch olmadan devam et — caller (route) doluluğu değerlendirir.
          continue;
        }

        const currentValue = prop.value?.value ?? null;
        const option = (choice.values || []).find(
          (v) => v.value === currentValue,
        );

        let baseColorTextureUrl = null;
        const baseColorFactor = null;
        let descriptor = null;
        if (option && option.image) {
          descriptor = buildTextureDescriptor(option.image);
          if (descriptor) {
            baseColorTextureUrl = descriptor.proxyUrl;
            textureSources.push({
              hash: descriptor.hash,
              sourceUrl: descriptor.sourceUrl,
              ext: descriptor.ext,
            });
          }
        }

        // Faz 4 — `targetSelectors` enrichment.
        //
        // Sub-article snapshot'taki her entry'nin `materials[]` listesinde
        // bu patch'in `propClass.propName` key'i varsa, o sub-article'ın
        // ID'sini `sub:<id>` selector olarak ekleriz. Bulunamazsa boş array
        // → frontend pconMaterialName fallback'ine ya da skip'e düşer.
        //
        // Şu an Faz 3 `buildSubArticleSnapshot` `materials: []` döndüğü için
        // pratikte her zaman `targetSelectors: []` olacak; Faz 5 sonrası
        // materials populated olunca otomatik olarak doğru selector'lar
        // emit edilir (sözleşme stabil).
        const matKey = `${prop.propClass}.${prop.propName}`;
        const targetSelectors = [];
        for (const sub of subArticleSnapshot) {
          if (
            sub &&
            Array.isArray(sub.materials) &&
            sub.materials.includes(matKey) &&
            sub.id
          ) {
            targetSelectors.push(`sub:${sub.id}`);
          }
        }

        patches.push({
          propClass: prop.propClass,
          propName: prop.propName,
          value: currentValue,
          targetSelectors,
          material: {
            baseColorTextureUrl,
            // Choice list'te RGB hex alanı yok (BasketTypes.PropertyValue:
            // largeIcon/smallIcon/image/value/text/selectable/surcharge).
            // Bu nedenle texture yoksa factor null — frontend Faz 4 ya
            // single color uygulamayı atlayıp option.icon'a düşer ya da
            // override JSON ile manuel hex sağlar.
            baseColorFactor,
            // Faz 2 default'lar — Faz 4'te per-material override gelebilir.
            metalness: 0,
            roughness: 0.85,
          },
        });
      }

      const currency =
        articleData.currency || (await session.basket.getCurrency());
      const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

      // Frontend Faz 4 in-place apply için tüm property listesi de gerekebilir
      // (örn. UI'ın `currentValue`'yu güncellemesi için). `mapProperties`
      // helper'ı zaten mevcut update path'iyle aynı sözleşmeyi üretir.
      const properties = await mapProperties(articleData, choiceLists);

      // cart-builder DOKUNULMADI — material-patch path'inde de mevcut helper
      // birebir çağrılır. cartProperties statik portion (boş placeholder'lar
      // ile) `cart-payload` endpoint'i tarafından merge'lenir.
      const cartProperties = buildCartProperties(articleData, choiceLists);

      return {
        type: "material-patch",
        patches,
        price,
        currency,
        properties,
        cartProperties,
        _textureSources: textureSources,
      };
    });
  }

  async exportGltf(itemId) {
    return sessionPool.runWithSessionForItem(itemId, null, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      return session.basket.getExportedGeometry(targetItemId, ["format=GLTF"]);
    });
  }

  /**
   * Faz 5 — Bir sub-article'ı bağımsız GLB olarak export et.
   *
   * EAIWS spec'inde `getExportedGeometry(pItemId, pOptions)` herhangi bir
   * basket itemId kabul ediyor; sub-article'ların kendi itemId'leri var
   * (`getAllItems([rootItemId], { subItems: true })` ile elde edilen
   * `BasketItem.itemId` veya `BasketItem.subArticleIds` içerdiği değerler).
   *
   * **PRACTICAL TEST GEREKİR**: Spec'te sub-article-only export'un explicit
   * desteklendiği yazmasa da; itemId bir basket item ise (top-level olmasa
   * bile) RPC çağrısı kabul edilmeli. Eğer reddedilirse `getGeometryDelta`
   * `_fellBackToFullGlb` set ederek caller'ı full-GLB akışına yönlendirir.
   *
   * Telemetry: her çağrı `eaiws.exportSubArticle` phase'i ile timer'a yazılır
   * (caller `_measureRpc` başına ayrı bir mark görmek istiyorsa label'ı
   * dışarıdan suffix'leyebilir; MVP için tek bir label yeter).
   *
   * **Pool note (Faz 7)**: Sub-article export'u top-level article ile
   * AYNI session üzerinde yapılmalı (article state). Bu nedenle
   * `getGeometryDelta` içindeki paralel export'lar bu method'u çağırmaz —
   * orada lease.session üzerinde inline export yapılır. Bu public method
   * external caller'lar için hâlâ çalışır; affinity hit olmazsa "unknown
   * item id" hatası alır ve caller fallback yapar.
   *
   * @param {string} subArticleItemId Basket'teki sub-article itemId'si.
   * @param {object} [timer] Faz 0 perf-logger timer (opsiyonel).
   * @returns {Promise<string>} pCon CDN GLB URL (session-bound).
   */
  async exportSubArticleGltf(subArticleItemId, timer = null) {
    if (!subArticleItemId) {
      throw new Error("exportSubArticleGltf requires a sub-article itemId");
    }
    return sessionPool.runWithSessionForItem(
      subArticleItemId,
      timer,
      async (lease) =>
        _measureRpc("eaiws.exportSubArticle", timer, () =>
          lease.session.basket.getExportedGeometry(subArticleItemId, [
            "format=GLTF",
          ]),
        ),
    );
  }

  /**
   * Faz 5 — Geometry delta üretici.
   *
   * Pre/post snapshot karşılaştırması ile değişen sub-article'ları tespit
   * eder, sadece changed/added için `getExportedGeometry` çağırır. Tüm
   * article'ı re-export etmek yerine network transfer'i drasticly düşürür.
   *
   * Akış (kabul kriteri 5: tek bir helper içinde, telemetry phase'leri
   * `_measureRpc` ile sarılı):
   *
   *   1. Pre-snapshot: `getItemProperties(itemId, { subArticles: true })`
   *      + `getAllItems([itemId], { subItems: true, geometryIds: true })`
   *      → `buildSubArticleSnapshot(itemProps, basketItems)` (itemId enrich).
   *      `prevSubArticleSnapshot` parametresi verilmişse onu kullan
   *      (frontend optimizasyonu için reserve; MVP'de null geçilir).
   *   2. `setPropertyValue` döngüsü (export ÇAĞRILMAZ).
   *   3. Post-snapshot: aynı pre-snapshot recipe.
   *   4. Diff (path-based eşleme):
   *        pre'de var, post'ta yok → removed
   *        post'ta var, pre'de yok → added
   *        her ikisinde var ama geometryId farklı → changed
   *   5. Her changed/added için aynı session üzerinden paralel
   *      `getExportedGeometry` çağır (Faz 7: nested re-lease yok —
   *      lease.session kullanılır). Hata olursa `_fellBackToFullGlb` ile
   *      dön (caller full-GLB'ye düşer). Top-level item (depth=0) DELTA'YA
   *      DAHİL DEĞİL — pCon'un kendisi değişen tüm sub-article'ları
   *      bildiriyor; top-level node sadece container'dır ve client-side
   *      replace edilemez.
   *   6. `getArticleData` + `getAllChoiceLists` → fiyat + cartProperties +
   *      mapped properties.
   *   7. Worst-case fallback: değişen sub-article sayısı total snapshot'ın
   *      ≥ %75'i ise full-GLB akışı daha verimli → `_fellBackToFullGlb`.
   *
   * @param {string} itemId Top-level basket item.
   * @param {Array<{propClass:string, propName:string, value:any}>} propertyList
   *   Frontend'in tam property snapshot'ı (idempotent apply).
   * @param {Array} [prevSubArticleSnapshot] `buildSubArticleSnapshot` formatında
   *   önceki state (frontend opsiyonel olarak gönderir; MVP'de null → backend
   *   pre-snapshot RPC çağırır).
   * @param {object} [timer]
   * @returns {Promise<{
   *   type: "geometry-delta",
   *   changedSubArticles: Array<{id:string, geometryId:string, gltfUrl:string}>,
   *   addedSubArticles:   Array<{id:string, geometryId:string, gltfUrl:string}>,
   *   removedSubArticles: Array<string>,
   *   subArticles: Array,
   *   price: number,
   *   currency: string,
   *   properties: Array,
   *   cartProperties: object|null,
   *   _subArticleSources?: Array<{ url:string }>,
   *   _fellBackToFullGlb?: { reason: string, gltfUrl?: string }
   * }>}
   */
  async getGeometryDelta(
    itemId,
    propertyList,
    prevSubArticleSnapshot = null,
    timer = null,
  ) {
    return sessionPool.runWithSessionForItem(itemId, timer, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      // 1) Pre-snapshot. Frontend gönderdiyse ona güven (MVP'de null);
      //    aksi halde EAIWS'ten oku. itemId enrichment için her iki RPC
      //    paralel çağrılır (round-trip latency yarıya iner).
      let preSnapshot;
      if (
        Array.isArray(prevSubArticleSnapshot) &&
        prevSubArticleSnapshot.length > 0
      ) {
        preSnapshot = prevSubArticleSnapshot;
      } else {
        const [preItemProps, preBasketItems] = await Promise.all([
          _measureRpc("eaiws.subArticleSnapshot.pre.props", timer, () =>
            session.basket.getItemProperties([targetItemId], {
              subArticles: true,
            }),
          ),
          _measureRpc("eaiws.subArticleSnapshot.pre.basket", timer, () =>
            session.basket.getAllItems([targetItemId], {
              subItems: true,
              geometryIds: true,
            }),
          ),
        ]);
        preSnapshot = buildSubArticleSnapshot(preItemProps, preBasketItems);
      }

      // 2) setPropertyValue döngüsü. `getMaterialPatch` ile aynı semantik
      //    (skip + warn pattern); export ÇAĞRILMAZ — Faz 5'in kazancı burada.
      const setPropStart = timer ? performance.now() : 0;
      for (const { propClass, propName, value } of propertyList) {
        if (value === null || value === undefined || value === "") continue;
        try {
          await session.basket.setPropertyValue(
            targetItemId,
            propClass,
            propName,
            value,
          );
        } catch (err) {
          if (isSkippablePropertyError(err)) {
            console.warn(
              `[PconClient.getGeometryDelta] Skipping property ${propClass}.${propName}=${value}: ${err.message}`,
            );
            continue;
          }
          throw err;
        }
      }
      if (timer) {
        try {
          timer.markRaw("eaiws.setProp", performance.now() - setPropStart);
        } catch {
          /* telemetry must not throw */
        }
      }

      // 3) Post-snapshot — aynı recipe.
      const [postItemProps, postBasketItems] = await Promise.all([
        _measureRpc("eaiws.subArticleSnapshot.post.props", timer, () =>
          session.basket.getItemProperties([targetItemId], {
            subArticles: true,
          }),
        ),
        _measureRpc("eaiws.subArticleSnapshot.post.basket", timer, () =>
          session.basket.getAllItems([targetItemId], {
            subItems: true,
            geometryIds: true,
          }),
        ),
      ]);
      const postSnapshot = buildSubArticleSnapshot(
        postItemProps,
        postBasketItems,
      );

      // 4) Diff — path-based eşleme. `path` field'ı DFS index'lerinden
      //    deterministik olarak üretilir (örn. "0/2/1"); pre ve post arası
      //    yeniden sıralama yoksa (yaygın senaryo) path eşleşir.
      //    Pre'de path X varsa, post'ta da path X aranır:
      //      - Bulunmazsa → removed.
      //      - Bulunursa ve geometryId farklıysa → changed.
      //    Post'ta var ama pre'de yok → added.
      //    Top-level (depth=0, path="0") delta'ya DAHİL EDİLMEZ —
      //    container/scene root semantik; client tarafında replace edilemez,
      //    ayrıca sub-article'ları zaten ayrı listelenir.
      const preByPath = new Map();
      for (const entry of preSnapshot) {
        if (entry?.depth === 0) continue;
        preByPath.set(entry.path, entry);
      }
      const postByPath = new Map();
      for (const entry of postSnapshot) {
        if (entry?.depth === 0) continue;
        postByPath.set(entry.path, entry);
      }

      const removedSubArticles = [];
      const changedEntries = [];
      const addedEntries = [];

      for (const [path, preEntry] of preByPath) {
        if (!postByPath.has(path)) {
          // Pre'de var, post'ta yok → removed. ID bazlı dön (frontend
          // sceneIndex.subArticleMap'ten bu ID'yi siler).
          if (preEntry.id) removedSubArticles.push(preEntry.id);
        }
      }
      for (const [path, postEntry] of postByPath) {
        const preEntry = preByPath.get(path);
        if (!preEntry) {
          // Post'ta var, pre'de yok → added.
          addedEntries.push(postEntry);
        } else if (
          (preEntry.geometryId || "") !== (postEntry.geometryId || "")
        ) {
          // Aynı path, farklı geometry → changed (re-export gerekecek).
          changedEntries.push(postEntry);
        }
      }

      // 5) Worst-case shortcut: changed+added çok büyükse full-GLB daha hızlı.
      //    Eşik: total non-root snapshot'ın ≥75%'i. Bu sayede "neredeyse her
      //    şey değişti" durumlarında piecemeal export'la time/bandwidth
      //    harcamayız.
      const totalSubCount = postByPath.size;
      const churnCount = changedEntries.length + addedEntries.length;
      if (totalSubCount > 0 && churnCount / totalSubCount >= 0.75) {
        return {
          _fellBackToFullGlb: {
            reason: `geometry-delta churn ${churnCount}/${totalSubCount} ≥ 75%`,
          },
        };
      }

      // 5.5) Sub-article export'larını PARALEL çağır.
      //      Top-level itemId yetersiz olabilir (entry.itemId === undefined);
      //      o durumda export edilemez → fallback.
      const exportTargets = [...changedEntries, ...addedEntries];
      if (exportTargets.some((e) => !e.itemId)) {
        return {
          _fellBackToFullGlb: {
            reason: "geometry-delta missing sub-article itemId mapping",
          },
        };
      }

      let exportedUrls;
      try {
        // Faz 7 — pool altyapısı: nested re-lease yapmıyoruz (sub-article
        // export TOP-LEVEL article ile aynı session'da olmalı, aksi halde
        // affinity miss + "unknown item id" → fallback). Lease.session
        // üzerinden inline export ile aynı `eaiws.exportSubArticle`
        // telemetry label'ı korunur.
        exportedUrls = await Promise.all(
          exportTargets.map((entry) =>
            _measureRpc("eaiws.exportSubArticle", timer, () =>
              session.basket.getExportedGeometry(entry.itemId, [
                "format=GLTF",
              ]),
            ),
          ),
        );
      } catch (err) {
        // EAIWS sub-article export'u reddetti veya transient hata.
        // Caller `_fellBackToFullGlb` görüp full-GLB akışına düşer.
        console.warn(
          `[PconClient.getGeometryDelta] sub-article export failed: ${err.message}`,
        );
        return {
          _fellBackToFullGlb: {
            reason: `sub-article export failed: ${err.message}`,
          },
        };
      }

      const changedSubArticles = changedEntries.map((entry, i) => ({
        id: entry.id,
        geometryId: entry.geometryId,
        gltfUrl: exportedUrls[i],
      }));
      const addedSubArticles = addedEntries.map((entry, i) => ({
        id: entry.id,
        geometryId: entry.geometryId,
        gltfUrl: exportedUrls[changedEntries.length + i],
      }));

      // 6) Article data + choice lists — fiyat + cartProperties + mapped props.
      //    `getMaterialPatch` ile aynı flag set'i (catalog image dahil);
      //    cart-builder consistency için.
      const articleData = await _measureRpc(
        "eaiws.getArticleData",
        timer,
        () =>
          session.basket.getArticleData(targetItemId, {
            fetchCatalogImage: true,
            fetchCatalogIcon: true,
            enableBooleanPropType: true,
          }),
      );

      const tOptions = new GetChoiceListOptions();
      tOptions.enableBooleanPropType = true;
      tOptions.highResPropValueIcons = true;
      tOptions.fetchPropValueImages = true;

      const choiceLists = await _measureRpc(
        "eaiws.getAllChoiceLists",
        timer,
        () => session.basket.getAllChoiceLists(targetItemId, tOptions),
      );

      const currency =
        articleData.currency || (await session.basket.getCurrency());
      const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;
      const properties = await mapProperties(articleData, choiceLists);
      const cartProperties = buildCartProperties(articleData, choiceLists);

      // `_subArticleSources`: route'un fire-and-forget `cacheGltf` çağırması
      // için (Faz 2/3 paterni; gltf-cache objectHash dedup'ından faydalanır).
      // Public response'a sızdırılmadan önce caller strip eder.
      const subArticleSources = exportedUrls.map((url) => ({ url }));

      return {
        type: "geometry-delta",
        changedSubArticles,
        addedSubArticles,
        removedSubArticles,
        subArticles: postSnapshot,
        price,
        currency,
        properties,
        cartProperties,
        _subArticleSources: subArticleSources,
      };
    });
  }

  /**
   * Faz 3 — Sub-article hierarchy ile birlikte GLTF export.
   *
   * Standart `exportGltf` yalnızca `["format=GLTF"]` kullanır; bu method
   * EAIWS spec §5.6.3.43'te `hierarchyMode=Hierarchy` opt'unu da geçer.
   * Plan §379 referansı: GLB içinde sub-article ağacının korunması (her
   * sub-article ayrı node) için bu opt gerekir.
   *
   * **Önemli**: spec'te `hierarchyMode` öncelikle GFX/FBX için listelenmiş;
   * GLTF formatı için EAIWS tarafının davranışı pratik testle doğrulanmalı.
   * Eğer EAIWS opt'u görmezden gelirse veya hata dönerse, `gltf-enricher`
   * post-process ile sub-article metadata'sını yine yazabilir (mapping
   * snapshot DFS-order'ından gelir; `subArticles: true` getItemProperties
   * çağrısı zaten yapılmış olmalı).
   *
   * Bu method mevcut `exportGltf`'i ezmez; caller (gltf-cache veya init
   * route) deneme sırasıyla önce bunu çağırabilir.
   */
  async exportGltfHierarchical(itemId, timer = null) {
    return sessionPool.runWithSessionForItem(itemId, timer, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      return _measureRpc("eaiws.exportHierarchical", timer, () =>
        session.basket.getExportedGeometry(targetItemId, [
          "format=GLTF",
          "hierarchyMode=Hierarchy",
        ]),
      );
    });
  }

  /**
   * Faz 1 — Property Classification için sub-article topolojisi snapshot'ı.
   *
   * `session.basket.getItemProperties(itemIds, opts)` doğrudan EAIWS
   * spec'inde tanımlı; dönen `Array<ItemProperties>` her item için
   * `article: ArticleProperties` içerir, `ArticleProperties.geometryId`
   * ve `ArticleProperties.subArticles[]` (recursive) alanları geometry
   * checksum'ı için kullanılır (bkz. `property-classifier.server.js`).
   *
   * `opts.subArticles: true` plan §406 referansı; sub-article ağacının
   * tam expand edilmesini sağlar. Diğer GetItemPropertiesOptions
   * field'ları (priceInfo, tmDescrMode, vb.) caller'a bırakılır.
   *
   * @param {string} itemId
   * @param {object} [opts] EAIWS GetItemPropertiesOptions; default {}.
   * @param {object} [timer] Faz 0 perf-logger timer (opsiyonel).
   */
  async getItemProperties(itemId, opts = {}, timer = null) {
    return sessionPool.runWithSessionForItem(itemId, timer, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;
      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }
      return _measureRpc("eaiws.getItemProperties", timer, () =>
        session.basket.getItemProperties([targetItemId], opts),
      );
    });
  }

  /**
   * Cart-add anında çağrılır. Şu anki konfigürasyon için legacy middleware'in
   * `finalProperties` body'sinde beklediği üç dinamik EAIWS asset URL'sini
   * üretir:
   *
   *  - `obxUrl`         → `basket.copy([itemId], ...)` ile cut buffer'a alınmış
   *                        OBX dosyası (legacy `_obx_url`). Aynı dosya
   *                        `_reopen_url`'in `obx=` parametresinde de kullanılır.
   *  - `attachmentUrl`  → `basket.getGeneratedImage(itemId, [...])` ile üretilen
   *                        konfigürasyonun render edilmiş JPG'si (legacy
   *                        `_attachment`).
   *  - `articleImageUrl` → güncel `articleData.catalogImage` (session-bound;
   *                        legacy `_article_image`). Stale catalog image
   *                        cache'inden kaçınmak için her seferinde fresh
   *                        çekilir.
   *
   * URL'ler EAIWS session'ına bağlıdır; session expire olunca geçersizleşir.
   * Bu nedenle cache'lenmez, her cart-add'de yeniden üretilir.
   */
  async generateCartAssets(itemId) {
    return sessionPool.runWithSessionForItem(itemId, null, async (lease) => {
      const session = lease.session;
      const targetItemId = itemId || lease.currentItemId;

      if (!targetItemId) {
        throw new Error("No active article item. Call getArticleData first.");
      }

      // copy() ve getGeneratedImage() basket üzerinde okuma operasyonlarıdır;
      // paralel çalıştırarak round-trip latency'i yarıya iniyoruz.
      // articleData'yı da paralel çekiyoruz ki güncel catalogImage URL'i
      // (session-bound) elde edebilelim.
      const [obxUrl, attachmentUrl, articleData] = await Promise.all([
        session.basket.copy([targetItemId], null, null, {}),
        session.basket.getGeneratedImage(targetItemId, [
          "format=JPG",
          "width=800",
          "height=800",
        ]),
        session.basket.getArticleData(targetItemId, {
          fetchCatalogImage: true,
          enableBooleanPropType: true,
        }),
      ]);

      return {
        obxUrl: obxUrl || "",
        attachmentUrl: attachmentUrl || "",
        articleImageUrl: articleData?.catalogImage || "",
      };
    });
  }

  /**
   * Geriye uyumlu shim. Faz 7 öncesi `PconClient` kendi `EaiwsSession`'ını
   * tutardı ve `disconnect()` o session'ı kapatırdı. Şimdi pool'a delege
   * ediyoruz: tüm pool entry'leri kapatılır, health check durur.
   *
   * Tek caller: `scripts/classify-article.js` — process exit öncesi temiz
   * shutdown için. Production runtime'da çağrılmaz.
   */
  async disconnect() {
    await sessionPool.shutdown();
  }
}

let instance = null;

export function getPconClient() {
  if (!instance) {
    instance = new PconClient();
  }
  return instance;
}

export default PconClient;
