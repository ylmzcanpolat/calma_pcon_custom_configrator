import { mkdir, writeFile, access, readdir, stat, unlink } from "fs/promises";
import { resolve } from "path";
import { createHash } from "crypto";
import { cacheGet, cacheSet } from "./redis-client.server.js";
import {
  enrichGlbWithSubArticleMetadata,
  buildSubArticleSnapshot,
} from "./gltf-enricher.server.js";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

const GLTF_CACHE_DIR = resolve(process.cwd(), ".cache/gltf");
const MAX_CACHE_SIZE_MB = parseInt(process.env.GLTF_CACHE_MAX_SIZE_MB || "5000", 10);

// Faz 3 — enriched GLB için ayrı dosya suffix'i. Aynı objectHash için
// hem ham/draco-compressed (`<hash>.glb`) hem enriched (`<hash>.enriched.glb`)
// versiyonlar yan yana yaşayabilir. Eski cache entry'leri kırılmasın diye
// (`cached.gltfUrl` raw'ı işaret ediyorsa frontend hâlâ alır), yeni MISS
// path'i enriched'i tercih eder ve Redis entry'sine `enriched: true` yazar.
const ENRICHED_SUFFIX = ".enriched.glb";
const RAW_SUFFIX = ".glb";

let dirReady = false;
let compressionAvailable = null;

async function ensureDir() {
  if (dirReady) return;
  await mkdir(GLTF_CACHE_DIR, { recursive: true });
  dirReady = true;
}

function hashUrl(url) {
  return createHash("md5").update(url).digest("hex");
}

/**
 * pCon EAIWS GLB URL'leri şu formattadır:
 *   https://s1.eaiws.pcon-solutions.com/<version>/session-cache/<sessionId>/objects/<objectHash>.glb
 *
 * `<sessionId>` session-bound (geçici), `<objectHash>` ise pCon tarafından
 * konfigürasyonun içerik özetinden türetilen deterministic bir hash. Aynı
 * konfigürasyon farklı session'larda da aynı objectHash'i üretir (canlı test
 * ile doğrulandı: A==C dönüş davranışı).
 *
 * Cache anahtarı olarak objectHash kullandığımızda:
 *   - Aynı konfigürasyon için tek dosya tutulur (session-arası dedup)
 *   - Browser HTTP cache hit oranı artar
 *   - Disk kullanımı dramatik azalır
 */
function extractPconObjectHash(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/objects\/([a-f0-9]{16,})\.glb(?:[?#]|$)/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Cache'lenecek dosyanın local hash'ini belirler. pCon formatına uyan URL'ler
 * için object hash, diğerleri için URL'in MD5'i (geriye uyumluluk).
 */
function resolveCacheHash(url) {
  return extractPconObjectHash(url) || hashUrl(url);
}

async function checkCompressionAvailable() {
  if (compressionAvailable !== null) return compressionAvailable;
  try {
    await import("gltf-pipeline");
    compressionAvailable = true;
  } catch {
    compressionAvailable = false;
    console.warn("[gltf-cache] gltf-pipeline not available, Draco compression disabled");
  }
  return compressionAvailable;
}

async function compressGltfBuffer(buffer) {
  try {
    const gltfPipeline = await import("gltf-pipeline");
    const processGlb = gltfPipeline.processGlb || gltfPipeline.default?.processGlb;
    if (typeof processGlb !== "function") {
      throw new Error("processGlb not found in gltf-pipeline exports");
    }
    const results = await processGlb(buffer, {
      dracoOptions: { compressionLevel: 7 },
    });

    const compressedBuffer = Buffer.from(results.glb);
    const savings = ((1 - compressedBuffer.length / buffer.length) * 100).toFixed(1);
    console.log(
      `[gltf-cache] Draco compression: ${(buffer.length / 1024 / 1024).toFixed(1)}MB → ${(compressedBuffer.length / 1024 / 1024).toFixed(1)}MB (${savings}% smaller)`,
    );
    return compressedBuffer;
  } catch (err) {
    console.warn("[gltf-cache] Draco compression failed, using original:", err.message);
    return buffer;
  }
}

const inflight = new Map();

/**
 * Verilen `subArticleTree`'yi flat-friendly snapshot'a çevirir; flat zaten
 * geldiyse aynen döndürür. Hem `cacheGltf` (enrich opsiyonu) hem üst
 * route'lar için aynı normalize lojiği.
 */
function _normalizeSubArticleSnapshot(subArticleTree) {
  if (!Array.isArray(subArticleTree) || subArticleTree.length === 0) {
    return [];
  }
  const first = subArticleTree[0];
  if (first && typeof first === "object" && "article" in first) {
    return buildSubArticleSnapshot(subArticleTree);
  }
  if (
    first &&
    typeof first === "object" &&
    ("id" in first || "geometryId" in first || "path" in first)
  ) {
    return subArticleTree;
  }
  return [];
}

/**
 * @param {string} remoteUrl pCon CDN GLB URL'i.
 * @param {object} [opts]
 * @param {boolean} [opts.compress=true] Draco compression uygula.
 * @param {Array}   [opts.subArticleTree=null] Faz 3 — verilirse GLB
 *   `gltf-enricher` ile node.extras enrich edilir, dosya `<hash>.enriched.glb`
 *   suffix'iyle yazılır. Mevcut `<hash>.glb` (raw/draco) entry'sini etkilemez.
 *   Format: ham EAIWS `getItemProperties` çıktısı veya `buildSubArticleSnapshot`
 *   çıktısı; ikisi de kabul edilir.
 * @returns {Promise<string|null>} Local proxy URL veya hata durumunda
 *   orijinal pCon URL (graceful degradation).
 */
export async function cacheGltf(
  remoteUrl,
  { compress = true, subArticleTree = null } = {},
) {
  if (!remoteUrl) return null;

  // Eğer URL zaten local proxy URL ise (warmer veya cache HIT'ten gelen)
  // başka iş yapma. Enriched flow için bile local URL geldiyse re-enrich
  // gereksiz; caller `cached.enriched` flag'ini ayrıca takip eder.
  if (remoteUrl.startsWith(LOCAL_GLTF_PREFIX)) {
    return remoteUrl;
  }

  const snapshot = _normalizeSubArticleSnapshot(subArticleTree);
  const wantEnrich = snapshot.length > 0;

  const hash = resolveCacheHash(remoteUrl);
  const suffix = wantEnrich ? ENRICHED_SUFFIX : RAW_SUFFIX;
  const filename = hash + suffix;
  const localPath = resolve(GLTF_CACHE_DIR, filename);
  const publicUrl = LOCAL_GLTF_PREFIX + filename;

  try {
    await access(localPath);
    return publicUrl;
  } catch {
    // not cached yet
  }

  // Aynı object aynı anda iki route tarafından istenirse (örn. cache miss +
  // warmer eşzamanlı), tek bir indirme yapılsın. Inflight key dosya
  // adıdır — enriched ve raw versiyonlar yan yana inflight olabilir.
  const inflightKey = filename;
  if (inflight.has(inflightKey)) {
    return inflight.get(inflightKey);
  }

  const task = (async () => {
    try {
      await ensureDir();
      const res = await fetch(remoteUrl);
      if (!res.ok) {
        console.warn(`[gltf-cache] fetch ${res.status} for ${remoteUrl}`);
        return remoteUrl;
      }

      let buffer = Buffer.from(await res.arrayBuffer());

      if (wantEnrich) {
        // Faz 3 — enrich + Draco compress tek geçişte (gltf-enricher
        // `processGlb` customStages + dracoOptions). Enrich fail-soft;
        // yine de hash dosyasını yaz ki eski cache entry'leri etkilemesin.
        const enrichRes = await enrichGlbWithSubArticleMetadata(
          buffer,
          snapshot,
          { compressDraco: compress && (await checkCompressionAvailable()) },
        );
        buffer = enrichRes.buffer;
        if (enrichRes.enriched) {
          console.log(
            `[gltf-cache] enriched ${hash}.enriched.glb — ` +
              `${enrichRes.nodesWritten}/${enrichRes.subArticleCount} node extras written`,
          );
        } else {
          // Enrich başarısız → raw GLB'yi enriched suffix'le yine yazıyoruz
          // ki HIT'lerde aynı yola döneriz; ama log seviyesi: warn.
          console.warn(
            `[gltf-cache] enrichment skipped for ${hash}; writing raw GLB to enriched path`,
          );
        }
      } else if (compress && (await checkCompressionAvailable())) {
        buffer = await compressGltfBuffer(buffer);
      }

      await writeFile(localPath, buffer);

      evictOldFiles(MAX_CACHE_SIZE_MB).catch((err) =>
        console.error("[gltf-cache] Eviction error:", err.message),
      );

      return publicUrl;
    } catch (err) {
      console.error("[gltf-cache] Failed to cache GLTF:", err.message);
      return remoteUrl;
    } finally {
      inflight.delete(inflightKey);
    }
  })();

  inflight.set(inflightKey, task);
  return task;
}

/**
 * Verilen Redis cache entry'sini arka planda local GLB URL'i ile günceller.
 *
 * Bu fonksiyon **bilerek await edilemez** — fire-and-forget olarak çağrılmalı.
 * GLB indirme + Draco compression CPU/network açısından pahalı olduğu için
 * HTTP response'unu blokluyor olmamalı (Shopify App Proxy 30sn timeout sınırı
 * + frontend AbortController timeout'u). Bunun yerine ilk istek pCon CDN URL'i
 * ile hızlıca cevap döner; arka planda local cache hazırlanır ve Redis entry
 * yükseltilir; bir sonraki istek artık local URL alır.
 *
 * Faz 3: opsiyonel `subArticleTree` parametresi geçilirse, GLB
 * `gltf-enricher` ile node.extras enrich edilip `<hash>.enriched.glb`
 * dosyasına yazılır; Redis entry'sine `enriched: true` flag'i de eklenir.
 * Bu işlem aynı background task içinde yapıldığı için ilk MISS response'unu
 * BLOKLAMAZ (plan §418 KK3). subArticleTree verilmezse mevcut davranış
 * korunur (Draco compress + `<hash>.glb` filename).
 *
 * Race condition koruması: cart-payload veya başka bir route bu key'i bizim
 * background tamamlamamızdan önce güncellerse, en son entry üzerine yazıyoruz
 * (gltfUrl + (varsa) enriched alanlarını local'e çeviriyoruz, diğer alanları
 * olduğu gibi koruyoruz). Eski cache entry'ler kırılmaz: enrich fail olursa
 * `latest.enriched` set edilmez.
 *
 * @param {string} cacheKey
 * @param {string} sourceUrl pCon CDN GLB URL'i.
 * @param {Array} [subArticleTree=null] Faz 3 — verilirse enrich pipeline'a
 *   geçilir. Format: ham EAIWS `getItemProperties` çıktısı veya
 *   `buildSubArticleSnapshot` çıktısı.
 */
export function upgradeCacheEntryWithLocalGltf(
  cacheKey,
  sourceUrl,
  subArticleTree = null,
) {
  if (!cacheKey || !sourceUrl) return;
  if (sourceUrl.startsWith(LOCAL_GLTF_PREFIX)) return;

  const wantEnrich =
    Array.isArray(subArticleTree) && subArticleTree.length > 0;

  cacheGltf(sourceUrl, wantEnrich ? { subArticleTree } : {})
    .then(async (localUrl) => {
      if (!localUrl || !localUrl.startsWith(LOCAL_GLTF_PREFIX)) return;

      try {
        const latest = await cacheGet(cacheKey);
        if (!latest) return;

        // Idempotency: başka bir request bizi yenmiş ve zaten **aynı tipte**
        // (raw vs enriched) local URL yazılmışsa tekrar yazmaya gerek yok.
        // Enriched isteniyor + mevcut raw local ise üzerine yazıyoruz
        // (enriched URL daha "güçlü" — Faz 4 frontend metadata'ya muhtaç).
        const alreadyLocal = latest.gltfUrl?.startsWith(LOCAL_GLTF_PREFIX);
        const alreadyEnriched = latest.enriched === true;
        if (alreadyLocal && (!wantEnrich || alreadyEnriched)) return;

        const updated = {
          ...latest,
          gltfUrl: localUrl,
          originalGltfUrl: sourceUrl,
        };
        if (wantEnrich) {
          updated.enriched = localUrl.endsWith(ENRICHED_SUFFIX);
        }

        await cacheSet(cacheKey, updated);
      } catch (err) {
        console.warn(
          "[gltf-cache] background entry upgrade failed:",
          err.message,
        );
      }
    })
    .catch((err) => {
      console.warn("[gltf-cache] background download failed:", err.message);
    });
}

/**
 * Faz 5 — Sub-article GLB cache helper.
 *
 * Sub-article export'ları (`pcon-client.exportSubArticleGltf`) tek başlarına
 * küçük GLB'lerdir. Enrichment YAPMIYORUZ (mini bir GLB için pipeline
 * overhead'i değmez; frontend zaten sub-article ID'sine sahip). Sadece raw
 * cache (`<hash>.glb`) yazıyoruz; pCon objectHash dedup'ından otomatik
 * faydalanırız (aynı sub-article + aynı geometry farklı request'lerde
 * tekrar inmesin).
 *
 * Compression default OFF: sub-article GLB'leri tipik olarak <300 KB,
 * Draco roundtrip CPU maliyeti büyük article'lara göre marjinal kazanç
 * sağlar; basitlik adına compress=false. Operatör isterse opts ile
 * override edebilir.
 *
 * @param {string} remoteUrl pCon CDN sub-article GLB URL.
 * @param {object} [opts]
 * @param {boolean} [opts.compress=false]
 * @returns {Promise<string|null>} Local proxy URL veya hata durumunda
 *   orijinal pCon URL (graceful degradation, `cacheGltf` davranışı).
 */
export async function cacheSubArticleGltf(remoteUrl, { compress = false } = {}) {
  return cacheGltf(remoteUrl, { compress });
}

export async function evictOldFiles(maxSizeMB) {
  try {
    const files = await readdir(GLTF_CACHE_DIR);
    if (files.length === 0) return;

    const stats = await Promise.all(
      files.map(async (f) => {
        const path = resolve(GLTF_CACHE_DIR, f);
        const s = await stat(path);
        return { path, size: s.size, mtime: s.mtimeMs };
      }),
    );

    const totalSize = stats.reduce((sum, s) => sum + s.size, 0);
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (totalSize <= maxBytes) return;

    stats.sort((a, b) => a.mtime - b.mtime);

    let freed = 0;
    const target = totalSize - maxBytes;

    for (const file of stats) {
      if (freed >= target) break;
      try {
        await unlink(file.path);
        freed += file.size;
        console.log(`[gltf-cache] Evicted ${file.path} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      } catch {
        // file may have been deleted concurrently
      }
    }

    console.log(`[gltf-cache] Eviction freed ${(freed / 1024 / 1024).toFixed(1)}MB`);
  } catch (err) {
    console.error("[gltf-cache] evictOldFiles error:", err.message);
  }
}

export async function getGltfDiskStats() {
  try {
    await ensureDir();
    const files = await readdir(GLTF_CACHE_DIR);
    if (files.length === 0) {
      return { totalFiles: 0, totalSizeMB: 0, maxSizeMB: MAX_CACHE_SIZE_MB };
    }

    const stats = await Promise.all(
      files.map(async (f) => {
        const s = await stat(resolve(GLTF_CACHE_DIR, f));
        return s.size;
      }),
    );

    const totalBytes = stats.reduce((sum, s) => sum + s, 0);
    return {
      totalFiles: files.length,
      totalSizeMB: Math.round(totalBytes / 1024 / 1024),
      maxSizeMB: MAX_CACHE_SIZE_MB,
    };
  } catch {
    return { totalFiles: 0, totalSizeMB: 0, maxSizeMB: MAX_CACHE_SIZE_MB };
  }
}

export function getGltfCacheDir() {
  return GLTF_CACHE_DIR;
}
