import { mkdir, writeFile, access } from "fs/promises";
import { resolve } from "path";
import { createHash } from "crypto";

const ICON_CACHE_DIR = resolve(process.cwd(), ".cache/icons");

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

async function ensureDir() {
  if (dirReady) return;
  await mkdir(ICON_CACHE_DIR, { recursive: true });
  dirReady = true;
}

function hashUrl(url) {
  return createHash("md5").update(url).digest("hex");
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      const ext = match[1].toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"].includes(ext)) {
        return ext === "jpeg" ? "jpg" : ext;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Download an icon from pCon EAIWS (or any remote URL) and cache it on disk,
 * returning a stable public URL served via the App Proxy.
 *
 * Returns the original URL on failure so callers can gracefully fall back.
 */
export async function cacheIcon(remoteUrl) {
  if (!remoteUrl || typeof remoteUrl !== "string") return remoteUrl;
  if (remoteUrl.startsWith("/apps/pcon-configurator/icon/")) return remoteUrl;
  if (remoteUrl.startsWith("data:")) return remoteUrl;

  const hash = hashUrl(remoteUrl);

  if (inflight.has(hash)) return inflight.get(hash);

  const task = (async () => {
    try {
      await ensureDir();

      const guessedExt = extFromUrl(remoteUrl) || "png";
      const guessedPath = resolve(ICON_CACHE_DIR, `${hash}.${guessedExt}`);

      try {
        await access(guessedPath);
        return `/apps/pcon-configurator/icon/${hash}.${guessedExt}`;
      } catch {
        // not cached yet
      }

      const res = await fetch(remoteUrl);
      if (!res.ok) {
        console.warn(`[icon-cache] fetch ${res.status} for ${remoteUrl}`);
        return remoteUrl;
      }

      const contentType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const ext = MIME_EXT[contentType] || guessedExt;
      const filename = `${hash}.${ext}`;
      const localPath = resolve(ICON_CACHE_DIR, filename);

      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(localPath, buffer);

      return `/apps/pcon-configurator/icon/${filename}`;
    } catch (err) {
      console.warn(`[icon-cache] Failed to cache icon ${remoteUrl}:`, err.message);
      return remoteUrl;
    } finally {
      inflight.delete(hash);
    }
  })();

  inflight.set(hash, task);
  return task;
}

export function getIconCacheDir() {
  return ICON_CACHE_DIR;
}
