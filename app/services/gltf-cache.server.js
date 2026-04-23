import { mkdir, writeFile, access, readdir, stat, unlink } from "fs/promises";
import { resolve } from "path";
import { createHash } from "crypto";

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

export async function cacheGltf(remoteUrl, { compress = true } = {}) {
  if (!remoteUrl) return null;

  const hash = hashUrl(remoteUrl);
  const filename = hash + ".glb";
  const localPath = resolve(GLTF_CACHE_DIR, filename);

  try {
    await access(localPath);
    return `/apps/pcon-configurator/gltf/${filename}`;
  } catch {
    // not cached yet
  }

  try {
    await ensureDir();
    const res = await fetch(remoteUrl);
    if (!res.ok) return remoteUrl;

    let buffer = Buffer.from(await res.arrayBuffer());

    if (compress && await checkCompressionAvailable()) {
      buffer = await compressGltfBuffer(buffer);
    }

    await writeFile(localPath, buffer);

    evictOldFiles(MAX_CACHE_SIZE_MB).catch((err) =>
      console.error("[gltf-cache] Eviction error:", err.message),
    );

    return `/apps/pcon-configurator/gltf/${filename}`;
  } catch (err) {
    console.error("[gltf-cache] Failed to cache GLTF:", err.message);
    return remoteUrl;
  }
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
