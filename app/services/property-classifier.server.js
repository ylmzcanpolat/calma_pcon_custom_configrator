/**
 * Faz 1 — Property Classification Servisi
 *
 * Sorumluluk:
 *   - Bir article'ın her property'sini "appearance" (sadece görsel),
 *     "geometry" (sub-article topolojisini değiştiren) veya "unknown"
 *     etiketiyle sınıflandırır.
 *   - Üç katmanlı çalışır:
 *       1) Override JSON (manuel müdahale, en yüksek öncelik)
 *       2) Empirical sonuç (Redis cache; A→B test, sub-article geometryId
 *          checksum karşılaştırması)
 *       3) Heuristic regex (sync, hiç IO yok; mil-saniye seviyesinde)
 *   - Init request akışında **bloke etmez**: Heuristic+override sync
 *     döner, empirical sonuç yoksa fire-and-forget background job
 *     tetiklenir; sonuç bir sonraki request için Redis'e yazılır.
 *
 * Frontend (Faz 2 ve sonrası) bu çıktıyı kullanarak appearance-only
 * property tıklamalarında GLB indirmeyi atlayıp in-place material patch
 * uygular.
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 1 §400-446.
 */

import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";
import { EaiwsSession } from "@easterngraphics/wcf/modules/eaiws/index.js";
import { InsertInfo } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";
import { cacheGet, cacheSet } from "./redis-client.server.js";
import { isSkippablePropertyError } from "./pcon-client.server.js";

// ─────────────────────────── konfig ───────────────────────────

const GATEKEEPER_URL = "https://gatekeeper.eaiws.pcon-solutions.com/v2";
const GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";
// Empirical session locale: classifier'ın görselliği önemli değil,
// sadece geometryId checksum karşılaştırılıyor. EN ile çalışmak güvenli.
const EMPIRICAL_LOCALE = "en";

// 30 gün — plan §406. Article'ın property semantiği nadiren değişir.
const CLASSIFICATION_TTL_SECONDS = 30 * 24 * 60 * 60;

// Heuristic regex'leri — plan §405 referansı.
// Property id veya name'inde geçen anahtar kelimelere bakılır.
const APPEARANCE_PATTERN =
  /(RENK|COLOR|FABRIC|KUMAS|KAPLAMA|MATERIAL|FINISH|TEXTURE|YUZEY)/i;
const GEOMETRY_PATTERN =
  /(BOYUT|DIMENSION|MODUL|MODULE|PRIZ|SOCKET|VENTILATION|HAVALANDIRMA|SHELF|RAF|MEDIA|MEDIAWALL|ASKILIK|HOOK|SIZE)/i;

// Override JSON dosya yolu (server-side, build sırasında değil runtime'da
// fs üzerinden oku; deploy hot-swap'i için).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OVERRIDE_PATH = join(__dirname, "property-classification-overrides.json");

// ─────────────────────────── override loader ───────────────────────────

let _overrideCache = null;

/**
 * Override JSON'ı diskten oku. Process içinde memoize edilir;
 * `resetOverrideCache()` ile (testlerde veya operatör JSON'u elle
 * düzenleyip restart yapmadan reload etmek istediğinde) sıfırlanabilir.
 */
function loadOverrides() {
  try {
    if (_overrideCache) return _overrideCache;
    const raw = readFileSync(OVERRIDE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    // `_comment` field'ı dokümantasyon için var; lookup sırasında es geç.
    _overrideCache = parsed && typeof parsed === "object" ? parsed : {};
    return _overrideCache;
  } catch (err) {
    console.warn(
      "[property-classifier] Failed to load overrides JSON:",
      err.message,
    );
    return {};
  }
}

/**
 * Test ve ileri kullanım için override cache'ini sıfırlar.
 */
export function resetOverrideCache() {
  _overrideCache = null;
}

/**
 * Lookup sırası: `<article>:<manufacturer>` → `<article>:*` → `*`.
 * Dönen map property-id → label (sadece override edilmiş property'ler
 * için entry vardır).
 */
function getOverrideMap(articleNumber, manufacturerId) {
  const overrides = loadOverrides();
  const merged = {};
  // En düşük öncelikten başla, üzerine yaz; en spesifik en son uygulanır
  // ki spesifik genel'i ezsin.
  const wildcard = overrides["*"];
  if (wildcard && typeof wildcard === "object") {
    Object.assign(merged, wildcard);
  }
  if (articleNumber) {
    const articleWildcard = overrides[`${articleNumber}:*`];
    if (articleWildcard && typeof articleWildcard === "object") {
      Object.assign(merged, articleWildcard);
    }
    if (manufacturerId) {
      const specific = overrides[`${articleNumber}:${manufacturerId}`];
      if (specific && typeof specific === "object") {
        Object.assign(merged, specific);
      }
    }
  }
  return merged;
}

// ─────────────────────────── heuristic ───────────────────────────

/**
 * Sync, hiç IO yok. Sadece property id/name regex'lerine bakar.
 *
 * Karar tablosu:
 *   - Hem appearance hem geometry pattern'ı eşleşiyorsa → "geometry"
 *     (geometry tarafı güvenli: yanlış pozitif appearance, GLB
 *     reload'unu atlamamıza ve görsel hataya yol açar; tersi sadece
 *     gereksiz GLB reload'u yapar — tolere edilebilir).
 *   - Sadece appearance eşleşiyorsa → "appearance".
 *   - Sadece geometry eşleşiyorsa → "geometry".
 *   - Hiçbiri eşleşmiyorsa → "unknown" (empirical sonuç gelene kadar
 *     frontend bunu güvenli tarafta — "geometry gibi" — ele alır).
 *
 * @param {Array<{id?:string, propClass?:string, propName?:string, label?:string}>} properties
 * @returns {Object<string, "appearance"|"geometry"|"unknown">}
 */
export function classifyHeuristically(properties) {
  if (!Array.isArray(properties)) return {};
  const out = {};
  for (const prop of properties) {
    const id =
      prop.id ||
      (prop.propClass && prop.propName
        ? `${prop.propClass}.${prop.propName}`
        : null);
    if (!id) continue;
    // Property'nin id, name veya label'ında ara — EAIWS bazen anlam
    // veren ipucunu sadece propText (label) içinde tutar.
    const haystack = [id, prop.propName || "", prop.label || ""].join(" ");
    const isAppearance = APPEARANCE_PATTERN.test(haystack);
    const isGeometry = GEOMETRY_PATTERN.test(haystack);
    if (isGeometry) {
      out[id] = "geometry";
    } else if (isAppearance) {
      out[id] = "appearance";
    } else {
      out[id] = "unknown";
    }
  }
  return out;
}

// ─────────────────────────── empirical helpers ───────────────────────────

/**
 * `getItemProperties(itemId, { subArticles: true })` yanıtından
 * sub-article topolojisinin imzasını üretir. Top-level + tüm nested
 * sub-article'ların `geometryId` değerleri sıralanmadan (DFS sırasıyla)
 * tek bir string'e konkatenate edilir; iki snapshot arası fark, geometry
 * değişmiş demektir.
 *
 * EAIWS spec §getItemProperties: dönen ItemProperties[].article.subArticles
 * her bir sub-article için ArticleProperties (içinde geometryId) içerir.
 * Sub-article'lar yine `subArticles` ile recursive olabilir.
 */
function buildGeometryChecksum(itemPropertiesArray) {
  const ids = [];
  function walk(article) {
    if (!article || typeof article !== "object") return;
    // geometryId boş/undefined olabilir (örn. text-only item) — yine de
    // pozisyonu koruyalım ki "var → yok" değişimi de yakalanabilsin.
    ids.push(article.geometryId == null ? "" : String(article.geometryId));
    if (Array.isArray(article.subArticles)) {
      for (const sub of article.subArticles) walk(sub);
    }
  }
  for (const item of itemPropertiesArray || []) {
    if (item?.article) walk(item.article);
  }
  return ids.join("|");
}

/**
 * Property listesinden empirical test için kullanılacak A→B çiftini seç.
 * - A: property'nin mevcut değeri (default).
 * - B: A'dan farklı, `available !== false` olan ilk option.
 * Eğer property'nin sadece tek option'ı varsa (veya tüm option'lar A'ya
 * eşitse) null döner; bu property "unknown" kalır.
 */
function pickTestPair(prop) {
  if (!prop || !Array.isArray(prop.options) || prop.options.length === 0) {
    return null;
  }
  const defaultValue = prop.currentValue;
  const alt = prop.options.find(
    (o) => o && o.available !== false && o.value !== defaultValue,
  );
  if (!alt) return null;
  return { defaultValue, altValue: alt.value };
}

async function openEmpiricalSession() {
  if (!GATEKEEPER_ID) {
    throw new Error(
      "PCON_GATEKEEPER_ID is not set; cannot open empirical EAIWS session",
    );
  }
  const res = await fetch(`${GATEKEEPER_URL}/session/${GATEKEEPER_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: EMPIRICAL_LOCALE }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gatekeeper error: ${res.status} ${body}`);
  }
  const gk = await res.json();
  const session = new EaiwsSession();
  session.connect(gk.server, gk.sessionId, (gk.keepAliveInterval || 60) * 1000);
  await session.basket.setLanguages(EMPIRICAL_LOCALE);
  return session;
}

async function setSinglePropertyValue(session, itemId, propClass, propName, value) {
  if (value === null || value === undefined || value === "") return false;
  try {
    await session.basket.setPropertyValue(itemId, propClass, propName, value);
    return true;
  } catch (err) {
    if (isSkippablePropertyError(err)) {
      // Bu property test edilemez — caller "unknown" olarak işaretler.
      return false;
    }
    throw err;
  }
}

// ─────────────────────────── public: empirical ───────────────────────────

/**
 * Bir EAIWS session açar, article'ı insert eder ve her property için
 * A→B mutasyon testi uygular. `getItemProperties(itemId, { subArticles:
 * true })` ile sub-article geometryId checksum'ı öncesi/sonrası
 * karşılaştırılır. Sonuç:
 *   - Aynı checksum → "appearance"
 *   - Farklı checksum → "geometry"
 *   - Test edilemeyen (1 option, set hatası) → "unknown"
 *
 * Sonuç Redis'e yazılır: `pcon:classify:<articleNumber>:<manufacturerId>`,
 * TTL 30 gün.
 *
 * NOT: Bu fonksiyon **kendi bağımsız** EAIWS session'ını açar; shared
 * `pcon-client` singleton'ını kullanmaz. Bu sayede cache-warmer veya
 * concurrent init request'leriyle race olmaz (Plan §445 risk maddesi).
 *
 * @param {string} articleNumber
 * @param {string|undefined} manufacturerId
 * @param {Array<{id, propClass, propName, currentValue, options, editable}>} properties
 *        Caller `init` endpoint'inden veya `getArticleData` çağrısından
 *        gelen mapped property listesini geçer. `editable === false` veya
 *        `options.length < 2` olanlar otomatik atlanır.
 * @returns {Promise<Object<string, "appearance"|"geometry"|"unknown">>}
 */
export async function classifyEmpirically(
  articleNumber,
  manufacturerId,
  properties,
) {
  if (!articleNumber) {
    throw new Error("classifyEmpirically: articleNumber is required");
  }
  if (!Array.isArray(properties) || properties.length === 0) {
    return {};
  }

  const startTime = performance.now();
  const result = {};
  const session = await openEmpiricalSession();

  try {
    const topFolder = await session.basket.getTopFolderId();
    const info = new InsertInfo();
    info.baseArticleNumber = articleNumber;
    if (manufacturerId) info.manufacturerId = manufacturerId;
    const itemId = await session.basket.insertOFMLArticle(topFolder, null, info);

    // Baseline checksum'ı bir kez al — her property test'inden sonra
    // default'a geri döndüğümüzde tekrar buna eşit olmasını bekleriz
    // (deterministik kalıyor mu kontrolü değil; sadece test sırasında
    // her döngüye temiz başlamak için).
    const baselineSnapshot = await session.basket.getItemProperties([itemId], {
      subArticles: true,
    });
    let lastChecksum = buildGeometryChecksum(baselineSnapshot);

    for (const prop of properties) {
      const id =
        prop.id ||
        (prop.propClass && prop.propName
          ? `${prop.propClass}.${prop.propName}`
          : null);
      if (!id) continue;

      // Editable olmayan veya tek-option'lı property'ler test edilemez.
      const editable = prop.editable !== false;
      const pair = pickTestPair(prop);
      if (!editable || !pair) {
        result[id] = "unknown";
        continue;
      }

      try {
        // A→B: alt değere set, snapshot al, checksum karşılaştır.
        const setOk = await setSinglePropertyValue(
          session,
          itemId,
          prop.propClass,
          prop.propName,
          pair.altValue,
        );
        if (!setOk) {
          result[id] = "unknown";
          continue;
        }

        const afterSnapshot = await session.basket.getItemProperties([itemId], {
          subArticles: true,
        });
        const afterChecksum = buildGeometryChecksum(afterSnapshot);
        result[id] = afterChecksum === lastChecksum ? "appearance" : "geometry";

        // B→A: default'a geri çevir ki bir sonraki property test'i temiz
        // baseline'dan başlasın. Hata olursa logla ama döngüyü bozma.
        try {
          await setSinglePropertyValue(
            session,
            itemId,
            prop.propClass,
            prop.propName,
            pair.defaultValue,
          );
          // Yeni baseline checksum (bazen reset tam baseline'a dönmeyebilir
          // — örn. dependent property'lerin yeniden hesaplanması nedeniyle.
          // Bu durumda bir sonraki turun karşılaştırmasını "şu anki"
          // checksum'a göre yapıyoruz, yine de doğru sonuç verir).
          const resetSnapshot = await session.basket.getItemProperties(
            [itemId],
            { subArticles: true },
          );
          lastChecksum = buildGeometryChecksum(resetSnapshot);
        } catch (resetErr) {
          console.warn(
            `[property-classifier] Reset failed for ${id}:`,
            resetErr.message,
          );
        }
      } catch (err) {
        console.warn(
          `[property-classifier] Empirical test failed for ${id}:`,
          err.message,
        );
        result[id] = "unknown";
      }
    }

    // Redis'e yaz — fail-soft.
    try {
      const key = buildClassificationKey(articleNumber, manufacturerId);
      await cacheSet(key, result, CLASSIFICATION_TTL_SECONDS);
    } catch (err) {
      console.warn(
        "[property-classifier] Redis cacheSet failed (continuing):",
        err.message,
      );
    }

    const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(1);
    const counts = countLabels(result);
    console.log(
      `[property-classifier] Empirical done for ${articleNumber}` +
        (manufacturerId ? `:${manufacturerId}` : "") +
        ` — properties=${Object.keys(result).length} ` +
        `(geometry=${counts.geometry}, appearance=${counts.appearance}, ` +
        `unknown=${counts.unknown}) in ${elapsedSec}s`,
    );

    return result;
  } finally {
    try {
      session.disconnect();
    } catch (err) {
      console.warn("[property-classifier] Session disconnect failed:", err.message);
    }
  }
}

// ─────────────────────────── public: ana akış ───────────────────────────

/**
 * Üç katmanlı classification. Init endpoint'inde **sync** çağrılır:
 * heuristic+override hızlı döner; eğer Redis'te empirical sonuç varsa
 * onunla zenginleşir; sonuç yoksa background job tetiklenir (fire-and-
 * forget) ve bu request bloklanmadan döner.
 *
 * Lookup öncelik (yüksekten düşüğe):
 *   1. Override JSON (article-specific > article-wildcard > global)
 *   2. Empirical (Redis cache, 30 gün TTL)
 *   3. Heuristic (regex)
 *
 * @param {string} articleNumber
 * @param {string|undefined} manufacturerId
 * @param {Array} properties — mapped property listesi
 * @returns {Promise<Object<string, "appearance"|"geometry"|"unknown">>}
 */
export async function classifyProperties(
  articleNumber,
  manufacturerId,
  properties,
) {
  if (!Array.isArray(properties)) return {};

  // 1) Heuristic baseline.
  const map = classifyHeuristically(properties);

  // 2) Empirical (Redis lookup) — varsa heuristic'i ezsin.
  let empiricalMap = null;
  if (articleNumber) {
    try {
      const key = buildClassificationKey(articleNumber, manufacturerId);
      empiricalMap = await cacheGet(key);
    } catch (err) {
      console.warn(
        "[property-classifier] Redis cacheGet failed (using heuristic only):",
        err.message,
      );
    }
  }

  if (empiricalMap && typeof empiricalMap === "object") {
    for (const [id, label] of Object.entries(empiricalMap)) {
      // Empirical sadece bilinen üç label'dan birini yazmalı; sanity check.
      if (label === "appearance" || label === "geometry" || label === "unknown") {
        map[id] = label;
      }
    }
  } else if (articleNumber && properties.length > 0) {
    // Empirical sonuç yok → arka planda başlat. setImmediate ile event
    // loop'u boşalttıktan sonra tetikle ki init response'u önce dönsün.
    setImmediate(() => {
      classifyEmpirically(articleNumber, manufacturerId, properties).catch(
        (err) => {
          console.warn(
            `[property-classifier] Background empirical failed for ${articleNumber}:`,
            err.message,
          );
        },
      );
    });
  }

  // 3) Override — en yüksek öncelik, en son uygulanır.
  const overrideMap = getOverrideMap(articleNumber, manufacturerId);
  for (const [id, label] of Object.entries(overrideMap)) {
    if (label === "appearance" || label === "geometry" || label === "unknown") {
      map[id] = label;
    }
  }

  return map;
}

// ─────────────────────────── helpers ───────────────────────────

/**
 * Empirical classification cache schema versiyonu. Faz 2 production'a
 * alındıktan sonra "DUVAR.YUZEY_RENK_DUVAR" gibi appearance property'lerin
 * eski empirical run'da "geometry" işaretli kaldığı tespit edildi (boş
 * geometry-delta dönüyordu, görsel değişmiyordu). Cache key'ine versiyon
 * koyarak eski entry'leri otomatik bypass ederiz; ilk istekte yeniden
 * heuristic kullanılır + arka planda doğru empirical sonuç yazılır.
 *
 * Bump kuralı: empirical algoritma değişirse veya yanlış pozitif/negatif
 * pattern keşfedilirse bu sayıyı artır.
 */
const CLASSIFY_CACHE_VERSION = 2;

export function buildClassificationKey(articleNumber, manufacturerId) {
  const safeArticle = String(articleNumber || "_");
  const safeMfr = String(manufacturerId || "_");
  return `pcon:classify:v${CLASSIFY_CACHE_VERSION}:${safeArticle}:${safeMfr}`;
}

function countLabels(map) {
  const c = { appearance: 0, geometry: 0, unknown: 0 };
  for (const label of Object.values(map)) {
    if (c[label] != null) c[label]++;
  }
  return c;
}
