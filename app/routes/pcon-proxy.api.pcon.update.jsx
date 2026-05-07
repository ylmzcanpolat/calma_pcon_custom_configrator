import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import {
  upgradeCacheEntryWithLocalGltf,
  cacheSubArticleGltf,
} from "../services/gltf-cache.server";
import {
  createPerfTimer,
  recordTimerSamples,
} from "../services/perf-logger.server";
import { classifyProperties } from "../services/property-classifier.server";
import { getOrFetchTexture } from "../services/texture-cache.server";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

/**
 * Faz 2 feature flag — `PCON_MATERIAL_PATCH_ENABLED`.
 *
 * Default: **false** (2026-05-06 live test sonrası).
 *
 * Live test bulgusu: Faz 4 mesh-mapping `findTargetMeshes` 4 fallback
 * katmanın hepsinde boş döndürüyor — `gltf-enricher` `pconMaterialName: null`
 * yazıyor (deferred Faz 4 risk), backend material-patch'te
 * `targetSelectors` üretilmiyor (deferred Faz 2 risk), `pconPropertyTags`
 * hiç yazılmıyor. Sonuç: `[material-swap] meshCount=0 skipped=1` — patch
 * uygulanmıyor, görsel değişmiyor.
 *
 * Bu sebeple acil olarak default OFF yapıldı; full-GLB path (eski Faz 0
 * davranış) devreye giriyor → görsel garanti. Faz 6 IDB cache + cache
 * warming sayesinde 2. ve sonraki tıklamalar cache HIT ile hızlıdır.
 *
 * Bunu tekrar açmadan önce yapılmalı (orta vadeli iş):
 *   1. `gltf-enricher.writeNodeExtras` → `pconMaterialName` doldur
 *      (article.materials[] veya `getMaterialAssignments` üzerinden)
 *   2. Backend `getMaterialPatch` → `targetSelectors: ["sub:<id>"]` üret
 *   3. Live test → `meshCount > 0` doğrula, sonra flag'i true'ya çevir.
 *
 * Açmak için: `PCON_MATERIAL_PATCH_ENABLED=true` env var.
 */
function isMaterialPatchEnabled() {
  // eslint-disable-next-line no-undef
  return process.env.PCON_MATERIAL_PATCH_ENABLED === "true";
}

/**
 * Faz 5 feature flag — `PCON_GEOMETRY_DELTA_ENABLED`.
 *
 * Default: **false** (2026-05-06 live test sonrası).
 *
 * Geometry-delta path'i `GeometrySwapper` üzerinden çalışır ve sub-article
 * ID match'ine bağımlıdır; bu da `pconSubArticleId` mesh metadata'sını
 * gerektirir. Aynı mesh-mapping deferred risk burada da geçerli (yapılan
 * partial swap mesh'i bulamayıp atlayabilir).
 *
 * Acil garanti çözüm olarak full-GLB path'ine düşürüldü. Mesh-mapping
 * fix'inden sonra (yukarıdaki adımlar) yeniden ON yapılabilir.
 *
 * Açmak için: `PCON_GEOMETRY_DELTA_ENABLED=true` env var.
 */
function isGeometryDeltaEnabled() {
  // eslint-disable-next-line no-undef
  return process.env.PCON_GEOMETRY_DELTA_ENABLED === "true";
}

// Faz 5 — geometry-delta path'inin tetikleneceği maksimum dirtyKeys uzunluğu.
// Plan §521: tek bir property değişimi için optimize; multi-property update
// (örn. URL'den apply) için full-GLB daha verimli (delta hesaplama overhead'i
// artar, classifier her key için "geometry" döndürmeyebilir).
const GEOMETRY_DELTA_MAX_DIRTY_KEYS = 3;

export async function action({ request }) {
  // Faz 0 telemetry: tüm action path'i tek timer altında. Sub-RPC süreleri
  // pcon-client içindeki `_measureRpc` helper'ı tarafından `markRaw` ile
  // yazılır; aşağıdaki `mark()` çağrıları üst-seviye milestone'ları işaretler.
  const timer = createPerfTimer("pcon/update");

  await authenticate.public.appProxy(request);
  timer.mark("auth");

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  timer.mark("body.parse");

  /* console.log("body", body); */

  const { properties, itemId, articleNumber } = body;

  if (!properties || typeof properties !== "object") {
    return Response.json(
      { error: "properties object is required" },
      { status: 400 },
    );
  }

  const propsCount = Object.keys(properties).length;
  // İlk anahtar, frontend'in az önce değiştirdiği "dirty key" varsayımı
  // — Faz 1+ classifier'ı buna göre çalışacak; baseline'da sadece
  // sample bucketing için per-property log etiketi olarak kullanılıyor.
  const propertyId = Object.keys(properties)[0] || null;

  // ───────────────────── Faz 2: Material-Patch branching ─────────────────────
  //
  // Yalnızca aşağıdaki KOŞULLARIN HEPSİ doğruysa light-weight patch path'i
  // çalışır. Aksi halde fall-through ile aşağıdaki mevcut full-GLB akışı
  // bytewise eski davranışı sergiler.
  //
  //   (a) `PCON_MATERIAL_PATCH_ENABLED === "true"`               (env flag)
  //   (b) request body'sinde `dirtyKeys: string[]` var ve length === 1
  //   (c) classifier o tek dirty key için "appearance" döndürdü
  //
  // (b) frontend Faz 4 hazırlanmadan önce body'de dirtyKeys göndermiyor
  // olabilir → koşul başarısız → mevcut full-GLB. Bu sayede flag ON olsa
  // bile mevcut frontend kırılmaz.
  const flagOn = isMaterialPatchEnabled();
  const dirtyKeys = Array.isArray(body.dirtyKeys) ? body.dirtyKeys : [];
  const singleDirtyKey =
    flagOn && dirtyKeys.length === 1 ? String(dirtyKeys[0]) : null;

  if (singleDirtyKey) {
    const patchResponse = await tryMaterialPatchPath({
      timer,
      body,
      properties,
      itemId,
      articleNumber,
      propertyId,
      propsCount,
      dirtyKey: singleDirtyKey,
    });
    if (patchResponse) return patchResponse;
    // null → graceful fallback (geometry/unknown classification veya
    // beklenmedik state). Geometry-delta veya full-GLB akışı aşağıda
    // devam eder.
  }
  // ───────────────────────────────────────────────────────────────────────────

  // ───────────────────── Faz 5: Geometry-Delta branching ─────────────────────
  //
  // Material-patch path başarısız olduktan sonra (veya hiç tetiklenmedi —
  // dirtyKeys.length > 1) geometry-delta denenir. Koşullar:
  //
  //   (a) `PCON_GEOMETRY_DELTA_ENABLED === "true"` (env flag)
  //   (b) dirtyKeys.length 1..GEOMETRY_DELTA_MAX_DIRTY_KEYS arası
  //   (c) tüm dirty key'ler classifier tarafından "geometry" işaretli
  //
  // Hata durumunda veya `_fellBackToFullGlb` set edildiyse `null` döner
  // ve aşağıdaki mevcut full-GLB akışı bytewise eski davranışı sergiler.
  const flagGeomDelta = isGeometryDeltaEnabled();
  const geomDirtyKeys =
    flagGeomDelta &&
    dirtyKeys.length >= 1 &&
    dirtyKeys.length <= GEOMETRY_DELTA_MAX_DIRTY_KEYS
      ? dirtyKeys.map(String)
      : null;

  if (geomDirtyKeys) {
    const deltaResponse = await tryGeometryDeltaPath({
      timer,
      body,
      properties,
      itemId,
      articleNumber,
      propertyId,
      propsCount,
      dirtyKeys: geomDirtyKeys,
    });
    if (deltaResponse) return deltaResponse;
    // null → fallback to full-GLB (classifier appearance/unknown veya
    // delta üretilemedi). Frontend bunu kırılma olarak görmez.
  }
  // ───────────────────────────────────────────────────────────────────────────

  const cacheKey = generateCacheKey("update", {
    articleNumber: articleNumber || "",
    ...properties,
  });

  const cached = await cacheGet(cacheKey);
  timer.mark("cache.lookup");
  // Cache versioning: yeni cartProperties formatı `_request_id` placeholder'ı
  // içerir (cart-payload endpoint'inde overwrite edilir). Eski entry'ler bu
  // placeholder'a sahip olmadığı için organik bir migration ile bypass edilir.
  if (
    cached &&
    cached.cartProperties &&
    cached.cartProperties._request_id !== undefined
  ) {
    let gltfUrl = cached.gltfUrl;
    if (!gltfUrl || !gltfUrl.startsWith(LOCAL_GLTF_PREFIX)) {
      const sourceUrl = cached.originalGltfUrl || cached.gltfUrl;
      upgradeCacheEntryWithLocalGltf(cacheKey, sourceUrl);
      gltfUrl = sourceUrl;
    }

    timer.mark("done");
    console.log(
      timer.toLogString({
        cache: "HIT",
        articleNumber: articleNumber || "",
        propsCount,
      }),
    );
    void recordTimerSamples(timer, {
      articleNumber: articleNumber || "",
      propertyId,
    });

    return Response.json(
      { ...cached, gltfUrl },
      { headers: { "Server-Timing": timer.toServerTimingHeader() } },
    );
  }

  try {
    const pcon = getPconClient();

    const propertyList = Object.entries(properties).map(([key, value]) => {
      const [propClass, propName] = key.split(".");
      return { propClass, propName, value };
    });

    let data;
    try {
      data = await pcon.setPropertyValue(itemId, propertyList, timer);
    } catch (err) {
      const isStaleItem =
        err.message?.includes("unknown item id") ||
        err.message?.includes("UnknownItemIdException");

      if (!isStaleItem || !articleNumber) throw err;

      console.log("[pcon/update] Stale itemId, re-inserting article...");
      const manufacturerId = body.manufacturerId || "";
      const fresh = await pcon.getArticleData(
        articleNumber,
        manufacturerId,
        timer,
      );
      data = await pcon.setPropertyValue(fresh.itemId, propertyList, timer);
    }
    // pcon-client RPC'leri (`eaiws.setProp`, `eaiws.export`, vs.) zaten
    // markRaw ile yazıldı; bu yüksek seviye mark agregat süreyi yakalar.
    timer.mark("pcon.client");

    const result = {
      price: data.price,
      gltfUrl: data.gltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      cartProperties: data.cartProperties || null,
    };

    await cacheSet(cacheKey, result);
    timer.mark("cache.set");

    upgradeCacheEntryWithLocalGltf(cacheKey, data.gltfUrl);
    timer.mark("done");

    console.log(
      timer.toLogString({
        cache: "MISS",
        articleNumber: articleNumber || "",
        propsCount,
      }),
    );
    void recordTimerSamples(timer, {
      articleNumber: articleNumber || "",
      propertyId,
    });

    return Response.json(result, {
      headers: { "Server-Timing": timer.toServerTimingHeader() },
    });
  } catch (err) {
    timer.mark("error");
    console.error("[pcon/update] Error:", err.message);
    console.log(
      timer.toLogString({
        cache: "ERROR",
        articleNumber: articleNumber || "",
        propsCount,
        error: err.message,
      }),
    );
    void recordTimerSamples(timer, {
      articleNumber: articleNumber || "",
      propertyId,
    });
    return Response.json(
      { error: "Failed to update pCon configuration", detail: err.message },
      {
        status: 500,
        headers: { "Server-Timing": timer.toServerTimingHeader() },
      },
    );
  }
}

/**
 * Faz 2 — Material-patch branching helper.
 *
 * Strategy:
 *   1. classifier'a tek dirty key için sınıflandırma sor; "appearance"
 *      değilse `null` dön → caller mevcut full-GLB akışına devam etsin.
 *   2. `pcon:material-patch:<hash>` cache'ine bak (key inputları
 *      `articleNumber`, `dirtyKey`, dirty key'in yeni değeri).
 *   3. MISS ise `pcon.getMaterialPatch()` çağır; texture proxy fetch'lerini
 *      fire-and-forget tetikle; cache'le ve dön.
 *
 * Hata durumunda `null` döner — caller defensive olarak full-GLB'ye düşer.
 *
 * @returns {Promise<Response|null>}
 *   `Response`  → Patch başarıyla üretildi/cache'lendi; route'tan dönülecek.
 *   `null`      → Graceful fallback (sınıflandırma appearance değil ya da
 *                 path beklenmedik state'e girdi). Caller mevcut full-GLB
 *                 yolundan devam etmelidir.
 */
async function tryMaterialPatchPath({
  timer,
  body,
  properties,
  itemId,
  articleNumber,
  propertyId,
  propsCount,
  dirtyKey,
}) {
  try {
    const manufacturerId = body.manufacturerId || "";

    // Init endpoint'inde de aynı `classifyProperties` çağrısı kullanılır;
    // sonuç Redis'te 30 gün TTL ile sticky → bu çağrı genellikle
    // mil-saniye seviyesindedir (cache hit). Empirical sonuç yoksa
    // background job tetiklenir; biz heuristic+override sonucuyla
    // ilerleriz (heuristic muhafazakar — yanlış pozitif "appearance"
    // riski düşük).
    //
    // Properties listesi: classifier sadece id field'ı + opsiyonel
    // propClass/propName/label kullanır; mevcut snapshot id'leri yeterli.
    const classifyInput = Object.keys(properties).map((id) => {
      const [propClass, propName] = id.split(".");
      return { id, propClass, propName };
    });
    const classifications = await classifyProperties(
      articleNumber || "",
      manufacturerId,
      classifyInput,
    );
    timer.mark("classify");

    // Filter tamamen kaldırıldı: classifier sonucundan bağımsız her
    // dirtyKey için material-patch denenir. Backend `getMaterialPatch`
    // boş patches[] dönerse aşağıda detect edilip null'a düşülür ve
    // sırayla geometry-delta → full-GLB fallback'i devreye girer.
    //
    // Sebep (Faz 2 deploy sonrası live test bulgusu): empirical cache'te
    // bazı appearance property'ler yanlışlıkla "geometry" olarak yazılmış
    // → tryGeometryDeltaPath'e düşüp boş delta dönüyordu, görsel
    // değişmiyordu. Classifier'a katı bağımlılık yerine "her şüpheliyi
    // dene, boşsa fallback" pattern'i çok daha sağlam — backend kendisi
    // gerçekten material-patch üretip üretemeyeceğini bilir.
    //
    // Telemetry: classifier sonucu hâlâ ölçüldü (`classify` mark) ve
    // `recordTimerSamples` ile sample'a yazılıyor; sadece routing
    // kararı bağımlı değil.
    void classifications;

    const cacheKey = generateCacheKey("material-patch", {
      articleNumber: articleNumber || "",
      dirtyKey,
      value: properties[dirtyKey],
    });

    const cached = await cacheGet(cacheKey);
    timer.mark("cache.lookup");

    if (
      cached &&
      cached.type === "material-patch" &&
      cached.cartProperties &&
      cached.cartProperties._request_id !== undefined
    ) {
      timer.mark("done");
      console.log(
        timer.toLogString({
          cache: "HIT",
          path: "material-patch",
          articleNumber: articleNumber || "",
          propsCount,
        }),
      );
      void recordTimerSamples(timer, {
        articleNumber: articleNumber || "",
        propertyId,
      });
      return Response.json(cached, {
        headers: { "Server-Timing": timer.toServerTimingHeader() },
      });
    }

    const pcon = getPconClient();

    const propertyList = Object.entries(properties).map(([key, value]) => {
      const [propClass, propName] = key.split(".");
      return { propClass, propName, value };
    });

    let patch;
    try {
      patch = await pcon.getMaterialPatch(
        itemId,
        propertyList,
        [dirtyKey],
        timer,
      );
    } catch (err) {
      const isStaleItem =
        err.message?.includes("unknown item id") ||
        err.message?.includes("UnknownItemIdException");

      if (!isStaleItem || !articleNumber) {
        // pcon-client zaten sınıflandırılamayan property error'larını
        // skip ediyor; başka bir hata varsa fallback path'e düş.
        console.warn(
          "[pcon/update] Material-patch path failed, falling back to full GLB:",
          err.message,
        );
        return null;
      }

      console.log(
        "[pcon/update] Stale itemId in material-patch path, re-inserting article...",
      );
      const fresh = await pcon.getArticleData(
        articleNumber,
        manufacturerId,
        timer,
      );
      patch = await pcon.getMaterialPatch(
        fresh.itemId,
        propertyList,
        [dirtyKey],
        timer,
      );
    }
    timer.mark("pcon.client");

    // Boş patch detect: backend setProperty yaptı ama getAllChoiceLists
    // / getArticleData karşılaştırması bu property için anlamlı bir
    // material değişimi bulmadı. Bu genellikle classifier yanlış
    // pozitif "appearance" verdiği bir geometry-affecting property için
    // olur. Frontend'e boş patches gönderirsek MaterialSwapper hiçbir
    // mesh güncellemez, kullanıcı "değişmedi" der → null'a düşüp
    // sıradaki path'in (geometry-delta veya full-GLB) görsel değişimi
    // sağlamasını bekleriz.
    if (!Array.isArray(patch.patches) || patch.patches.length === 0) {
      console.log(
        `[pcon/update] material-patch empty (likely geometry-affecting property), falling back`,
      );
      return null;
    }

    // Texture proxy fetch'lerini tetikle — fire-and-forget. Frontend
    // proxy URL'i isterken texture henüz cache'lenmemişse 404 alır;
    // Faz 4 frontend'i retry ile tolere edecek. Amaç bu fetch'i request
    // critical path'inde bekletmemek.
    if (Array.isArray(patch._textureSources)) {
      for (const src of patch._textureSources) {
        getOrFetchTexture(src.hash, src.sourceUrl).catch((err) => {
          console.warn(
            `[pcon/update] Background texture fetch failed (${src.hash}): ${err.message}`,
          );
        });
      }
    }

    // Public response — internal `_textureSources`'u sızdırma.
    const result = {
      type: patch.type,
      patches: patch.patches,
      price: patch.price,
      currency: patch.currency,
      properties: patch.properties,
      cartProperties: patch.cartProperties || null,
    };

    await cacheSet(cacheKey, result);
    timer.mark("cache.set");
    timer.mark("done");

    console.log(
      timer.toLogString({
        cache: "MISS",
        path: "material-patch",
        articleNumber: articleNumber || "",
        propsCount,
      }),
    );
    void recordTimerSamples(timer, {
      articleNumber: articleNumber || "",
      propertyId,
    });

    return Response.json(result, {
      headers: { "Server-Timing": timer.toServerTimingHeader() },
    });
  } catch (err) {
    // Defensive: classifier veya helper'da beklenmedik bir hata olursa
    // sessizce full-GLB akışına düş; user-facing 500 vermeyiz.
    console.warn(
      "[pcon/update] Material-patch path threw, falling back to full GLB:",
      err.message,
    );
    return null;
  }
}

/**
 * Faz 5 — Geometry-delta branching helper.
 *
 * Strategy (paralel: `tryMaterialPatchPath`):
 *   1. classifier'dan tüm dirty key'leri al; HEPSİ "geometry" değilse
 *      `null` dön → caller mevcut full-GLB akışına devam etsin.
 *   2. `pcon:geometry-delta:<hash>` cache'ine bak (key inputları
 *      `articleNumber`, dirty key'lerin yeni değerleri, all properties).
 *      Aynı final state için aynı delta üretilir; cache HIT response'u
 *      olduğu gibi döner.
 *   3. MISS ise `pcon.getGeometryDelta()` çağır:
 *      - `_fellBackToFullGlb` set ise `null` (caller full-GLB'ye düşer).
 *      - Aksi halde sub-article GLB URL'lerini local proxy URL'lere
 *        çevir (`cacheSubArticleGltf` — fire-and-forget olabilir; ama
 *        frontend ilk istemede pCon CDN URL alır, aynı pattern Faz 0
 *        full-GLB için de geçerli).
 *      - Cache'le ve dön.
 *
 * Hata durumunda `null` döner → caller defensive olarak full-GLB'ye düşer.
 *
 * @returns {Promise<Response|null>}
 */
async function tryGeometryDeltaPath({
  timer,
  body,
  properties,
  itemId,
  articleNumber,
  propertyId,
  propsCount,
  dirtyKeys,
}) {
  try {
    const manufacturerId = body.manufacturerId || "";

    // 1) Classification — tek bir Redis lookup (`classifyProperties` mevcut
    //    cache yolu). Eğer sticky empirical sonuç yoksa heuristic kullanılır;
    //    geometry için heuristic muhafazakar (yanlış pozitif geometry, sadece
    //    full-GLB'ye düşer ama kırılmaz).
    const classifyInput = Object.keys(properties).map((id) => {
      const [propClass, propName] = id.split(".");
      return { id, propClass, propName };
    });
    const classifications = await classifyProperties(
      articleNumber || "",
      manufacturerId,
      classifyInput,
    );
    timer.mark("classify");

    // Tüm dirty key'lerin "geometry" olması şart. Karışık (örn. bir
    // appearance + bir geometry) durumda full-GLB güvenlidir; partial
    // delta logic'i karmaşıklaştırmaz.
    const allGeometry = dirtyKeys.every(
      (key) => classifications[key] === "geometry",
    );
    if (!allGeometry) {
      // appearance/unknown → mevcut full-GLB. Telemetry için mark
      // zaten yazıldı; downstream timer'ı ezmiyoruz.
      return null;
    }

    // 2) Cache lookup. Key, final state'i (tüm properties + dirty keys)
    //    içerir; aynı final state için aynı delta üretileceği varsayımı
    //    (backend pre-snapshot kendi okuduğu için pre-state cache key'inde
    //    direkt yer almaz — ama FRONTEND aynı dirtyKeys'i göndererek
    //    "where I am now" bağlamı sağlamış olur).
    const cacheKey = generateCacheKey("geometry-delta", {
      articleNumber: articleNumber || "",
      dirtyKeys: dirtyKeys.slice().sort().join(","),
      ...properties,
    });

    const cached = await cacheGet(cacheKey);
    timer.mark("cache.lookup");

    if (
      cached &&
      cached.type === "geometry-delta" &&
      cached.cartProperties &&
      cached.cartProperties._request_id !== undefined
    ) {
      timer.mark("done");
      console.log(
        timer.toLogString({
          cache: "HIT",
          path: "geometry-delta",
          articleNumber: articleNumber || "",
          propsCount,
        }),
      );
      void recordTimerSamples(timer, {
        articleNumber: articleNumber || "",
        propertyId,
      });
      return Response.json(cached, {
        headers: { "Server-Timing": timer.toServerTimingHeader() },
      });
    }

    const pcon = getPconClient();

    const propertyList = Object.entries(properties).map(([key, value]) => {
      const [propClass, propName] = key.split(".");
      return { propClass, propName, value };
    });

    let delta;
    try {
      // MVP: prevSubArticleSnapshot=null → backend pre-snapshot'ı kendi
      // çeker (extra ~1 RPC; Faz 7 optimizasyonunda frontend snapshot
      // gönderebilir).
      delta = await pcon.getGeometryDelta(itemId, propertyList, null, timer);
    } catch (err) {
      const isStaleItem =
        err.message?.includes("unknown item id") ||
        err.message?.includes("UnknownItemIdException");

      if (!isStaleItem || !articleNumber) {
        console.warn(
          "[pcon/update] Geometry-delta path failed, falling back to full GLB:",
          err.message,
        );
        return null;
      }

      console.log(
        "[pcon/update] Stale itemId in geometry-delta path, re-inserting article...",
      );
      const fresh = await pcon.getArticleData(
        articleNumber,
        manufacturerId,
        timer,
      );
      delta = await pcon.getGeometryDelta(
        fresh.itemId,
        propertyList,
        null,
        timer,
      );
    }
    timer.mark("pcon.client");

    // `_fellBackToFullGlb` set ise route caller'ına null dön; mevcut
    // full-GLB akışı alttan devam eder.
    if (delta && delta._fellBackToFullGlb) {
      console.log(
        `[pcon/update] geometry-delta fell back to full-GLB (${delta._fellBackToFullGlb.reason})`,
      );
      return null;
    }
    if (!delta || delta.type !== "geometry-delta") {
      // Beklenmedik shape → defensive fallback.
      return null;
    }

    // Boş delta detect: classifier yanlışlıkla "geometry" işaretlemiş
    // ama EAIWS pre/post snapshot karşılaştırması sub-article topolojisinde
    // hiçbir değişiklik bulmamış → bu property aslında appearance-only.
    // Frontend'e boş delta göndermek yerine null dönerek caller'ın
    // (action) full-GLB akışına düşmesini sağlarız; en azından görsel
    // değişimi garanti ederiz (ideal değil ama broken UX'ten iyi).
    //
    // İlk arka plan empirical run'ı (classifyEmpirically) bu key'i
    // doğru "appearance" olarak yeniden sınıflayacak ve sonraki
    // update'lerde direkt material-patch path'i devreye girecek.
    const totalChanges =
      (delta.changedSubArticles?.length || 0) +
      (delta.addedSubArticles?.length || 0) +
      (delta.removedSubArticles?.length || 0);
    if (totalChanges === 0) {
      console.log(
        `[pcon/update] geometry-delta empty (likely appearance-only property), falling back to full GLB`,
      );
      return null;
    }

    timer.mark("geometry.delta");

    // 3) Sub-article GLB URL'lerini local proxy URL'lere çevir. Faz 0/3
    //    paterni: ilk MISS pCon CDN URL ile cevap döner, arka planda local
    //    cache hazırlanır. Burada yine fire-and-forget; frontend'in ilk
    //    swap'inde pCon CDN URL kullanılır, sonraki request'lerde local
    //    proxy. cacheGltf objectHash dedup'ı sayesinde aynı sub-article
    //    aynı geometry için tekrar inmez (kabul kriteri 2).
    const sourceUrls = Array.isArray(delta._subArticleSources)
      ? delta._subArticleSources.map((s) => s.url).filter(Boolean)
      : [];
    for (const url of sourceUrls) {
      cacheSubArticleGltf(url).catch((err) => {
        console.warn(
          `[pcon/update] Background sub-article cache failed (${url}): ${err.message}`,
        );
      });
    }

    // Public response — internal `_subArticleSources`'u sızdırma.
    const result = {
      type: delta.type,
      changedSubArticles: delta.changedSubArticles,
      addedSubArticles: delta.addedSubArticles,
      removedSubArticles: delta.removedSubArticles,
      subArticles: delta.subArticles,
      price: delta.price,
      currency: delta.currency,
      properties: delta.properties,
      cartProperties: delta.cartProperties || null,
    };

    await cacheSet(cacheKey, result);
    timer.mark("cache.set");
    timer.mark("done");

    console.log(
      timer.toLogString({
        cache: "MISS",
        path: "geometry-delta",
        articleNumber: articleNumber || "",
        propsCount,
        changed: result.changedSubArticles?.length || 0,
        added: result.addedSubArticles?.length || 0,
        removed: result.removedSubArticles?.length || 0,
      }),
    );
    void recordTimerSamples(timer, {
      articleNumber: articleNumber || "",
      propertyId,
    });

    return Response.json(result, {
      headers: { "Server-Timing": timer.toServerTimingHeader() },
    });
  } catch (err) {
    console.warn(
      "[pcon/update] Geometry-delta path threw, falling back to full GLB:",
      err.message,
    );
    return null;
  }
}
