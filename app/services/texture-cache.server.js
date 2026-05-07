/**
 * Faz 2 — Texture Cache (icon-cache aynası)
 *
 * Sorumluluk:
 *   - pCon EAIWS CDN'inden gelen session-bound texture URL'lerini
 *     bir kerelik fetch edip local diske `.cache/textures/<hash>.<ext>`
 *     olarak yazar.
 *   - Texture'a ait meta-bilgiyi (`contentType`, `ext`, `sourceUrl`,
 *     `sizeBytes`, `ts`) Redis'te 30 gün TTL ile saklar; key formatı
 *     `pcon:tex:<materialHash>`.
 *   - Frontend (Faz 4) `option.image` alanından bizim public proxy URL'imizi
 *     (`/apps/pcon-configurator/texture/<hash>.<ext>`) okur ve doğrudan
 *     `<img>` veya GLB material map'i olarak kullanır.
 *
 * Tasarım:
 *   - `icon-cache.server.js`'in birebir pattern'i; tek ek olarak Redis
 *     meta'sı yazılır. Disk format aynı (md5(rawUrl) + extension); concurrent
 *     fetch dedupe için in-memory promise map kullanılır.
 *   - Public route (`pcon-proxy.texture.$.jsx`) `getTextureMeta()` ile
 *     meta'yı sorgular; meta yoksa 404 döner. Yani route asla raw URL'e
 *     hit atmaz; tüm fetch'ler bu modülden geçer (`update` endpoint'i
 *     fire-and-forget olarak çağırır).
 */

import { mkdir, writeFile, access, stat } from "fs/promises";
import { resolve } from "path";
import { createHash } from "crypto";
import { cacheGet, cacheSet } from "./redis-client.server.js";

const TEXTURE_CACHE_DIR = resolve(process.cwd(), ".cache/textures");

// Plan §445 referansı: article'ın property semantiği nadiren değişir;
// texture asset'leri de uzun süre stable kalır. 30 gün TTL.
const TEXTURE_META_TTL_SECONDS = 30 * 24 * 60 * 60;

let dirReady = false;
const inflight = new Map();

const MIME_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
};

const ALLOWED_EXTS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
]);

async function ensureDir() {
  if (dirReady) return;
  await mkdir(TEXTURE_CACHE_DIR, { recursive: true });
  dirReady = true;
}

function buildMetaKey(materialHash) {
  return `pcon:tex:${materialHash}`;
}

/**
 * Bir raw URL'i deterministik olarak `{ hash, ext, proxyUrl }` üçlüsüne
 * map eder. Bu pure function'dır — IO yapmaz; caller bu descriptor'ı
 * frontend response'una koymadan önce `getOrFetchTexture` ile fetch'i
 * tetikler (fire-and-forget).
 */
export function buildTextureDescriptor(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const hash = createHash("md5").update(rawUrl).digest("hex");
  const ext = extFromUrl(rawUrl) || "jpg";
  const proxyUrl = `/apps/pcon-configurator/texture/${hash}.${ext}`;
  return { hash, ext, proxyUrl, sourceUrl: rawUrl };
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
    if (match) {
      const ext = match[1].toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        return ext === "jpeg" ? "jpg" : ext;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Texture'ı diskte ve Redis meta'sında hazırla. Aynı hash için concurrent
 * çağrılar tek bir fetch'e dedupe edilir (icon-cache pattern'inin aynısı).
 *
 * @param {string} materialHash MD5(sourceUrl) — caller hesaplar.
 * @param {string} sourceUrl    Raw pCon CDN URL (session-bound olabilir).
 * @returns {Promise<{ localPath: string, contentType: string, ext: string, hash: string } | null>}
 *   Hata durumunda `null` döner; caller sessizce fall-through eder.
 */
export async function getOrFetchTexture(materialHash, sourceUrl) {
  if (!materialHash || !sourceUrl) return null;

  if (inflight.has(materialHash)) return inflight.get(materialHash);

  const task = (async () => {
    try {
      await ensureDir();

      const guessedExt = extFromUrl(sourceUrl) || "jpg";
      const guessedPath = resolve(
        TEXTURE_CACHE_DIR,
        `${materialHash}.${guessedExt}`,
      );

      // Hot path: hem dosya hem meta varsa — yeniden fetch etme.
      try {
        await access(guessedPath);
        const existingMeta = await getTextureMeta(materialHash);
        if (existingMeta) {
          return {
            localPath: guessedPath,
            contentType: existingMeta.contentType,
            ext: existingMeta.ext,
            hash: materialHash,
          };
        }
      } catch {
        // not cached yet
      }

      const res = await fetch(sourceUrl);
      if (!res.ok) {
        console.warn(
          `[texture-cache] fetch ${res.status} for ${sourceUrl}`,
        );
        return null;
      }

      const contentType = (res.headers.get("content-type") || "")
        .split(";")[0]
        .trim()
        .toLowerCase();
      const ext = MIME_EXT[contentType] || guessedExt;
      const filename = `${materialHash}.${ext}`;
      const localPath = resolve(TEXTURE_CACHE_DIR, filename);

      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(localPath, buffer);

      const meta = {
        contentType: contentType || `image/${ext === "jpg" ? "jpeg" : ext}`,
        ext,
        sourceUrl,
        sizeBytes: buffer.length,
        ts: Date.now(),
      };

      try {
        await cacheSet(buildMetaKey(materialHash), meta, TEXTURE_META_TTL_SECONDS);
      } catch (err) {
        console.warn(
          `[texture-cache] Failed to write meta for ${materialHash}: ${err.message}`,
        );
      }

      return {
        localPath,
        contentType: meta.contentType,
        ext,
        hash: materialHash,
      };
    } catch (err) {
      console.warn(
        `[texture-cache] Failed to cache texture ${sourceUrl}: ${err.message}`,
      );
      return null;
    } finally {
      inflight.delete(materialHash);
    }
  })();

  inflight.set(materialHash, task);
  return task;
}

/**
 * Sadece meta'yı oku (route'lar için ucuz lookup). Disk'e dokunmaz.
 *
 * @param {string} materialHash
 * @returns {Promise<{ contentType, ext, sourceUrl, sizeBytes, ts } | null>}
 */
export async function getTextureMeta(materialHash) {
  if (!materialHash) return null;
  try {
    const meta = await cacheGet(buildMetaKey(materialHash));
    return meta || null;
  } catch (err) {
    console.warn(
      `[texture-cache] Failed to read meta for ${materialHash}: ${err.message}`,
    );
    return null;
  }
}

/**
 * Public path'e dosyanın gerçekten var olup olmadığını kontrol eder.
 * Route loader'ı meta + dosya tutarlılığı için kullanır.
 */
export async function textureFileExists(materialHash, ext) {
  if (!materialHash || !ext) return false;
  try {
    const filePath = resolve(TEXTURE_CACHE_DIR, `${materialHash}.${ext}`);
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

export function getTextureCacheDir() {
  return TEXTURE_CACHE_DIR;
}
