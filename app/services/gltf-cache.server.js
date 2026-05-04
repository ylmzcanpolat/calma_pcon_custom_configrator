import { mkdir, writeFile, access, readdir, stat, unlink } from "fs/promises";
import { resolve } from "path";
import { createHash } from "crypto";
import { cacheGet, cacheSet } from "./redis-client.server.js";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

const GLTF_CACHE_DIR = resolve(process.cwd(), ".cache/gltf");
const MAX_CACHE_SIZE_MB = parseInt(process.env.GLTF_CACHE_MAX_SIZE_MB || "5000", 10);

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

export async function cacheGltf(remoteUrl, { compress = true } = {}) {
  if (!remoteUrl) return null;

  // Eğer URL zaten local proxy URL ise (warmer veya cache HIT'ten gelen)
  // başka iş yapma.
  if (remoteUrl.startsWith(LOCAL_GLTF_PREFIX)) {
    return remoteUrl;
  }

  const hash = resolveCacheHash(remoteUrl);
  const filename = hash + ".glb";
  const localPath = resolve(GLTF_CACHE_DIR, filename);
  const publicUrl = LOCAL_GLTF_PREFIX + filename;

  try {
    await access(localPath);
    return publicUrl;
  } catch {
    // not cached yet
  }

  // Aynı object aynı anda iki route tarafından istenirse (örn. cache miss +
  // warmer eşzamanlı), tek bir indirme yapılsın.
  if (inflight.has(hash)) {
    return inflight.get(hash);
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

      if (compress && (await checkCompressionAvailable())) {
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
      inflight.delete(hash);
    }
  })();

  inflight.set(hash, task);
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
 * Race condition koruması: cart-payload veya başka bir route bu key'i bizim
 * background tamamlamamızdan önce güncellerse, en son entry üzerine yazıyoruz
 * (gltfUrl alanını local'e çeviriyoruz, diğer alanları olduğu gibi koruyoruz).
 */
export function upgradeCacheEntryWithLocalGltf(cacheKey, sourceUrl) {
  if (!cacheKey || !sourceUrl) return;
  if (sourceUrl.startsWith(LOCAL_GLTF_PREFIX)) return;

  cacheGltf(sourceUrl)
    .then(async (localUrl) => {
      if (!localUrl || !localUrl.startsWith(LOCAL_GLTF_PREFIX)) return;

      try {
        const latest = await cacheGet(cacheKey);
        if (!latest) return;
        // Idempotency: başka bir request bizi yenmiş ve zaten local URL
        // yazılmışsa tekrar yazmaya gerek yok.
        if (latest.gltfUrl?.startsWith(LOCAL_GLTF_PREFIX)) return;

        await cacheSet(cacheKey, {
          ...latest,
          gltfUrl: localUrl,
          originalGltfUrl: sourceUrl,
        });
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
