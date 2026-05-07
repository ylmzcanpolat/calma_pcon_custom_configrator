/**
 * Faz 2 — Texture proxy route.
 *
 * URL: `/apps/pcon-configurator/texture/<materialHash>.<ext>`
 *
 * Bu route, `texture-cache.server.js` tarafından önceden fetch edilmiş
 * texture dosyalarını dönen pasif bir CDN-front'tur. Route hiçbir zaman
 * remote pCon CDN'ine kendi başına istek atmaz; meta yoksa 404 döner.
 * Texture cache populate'ı `update` endpoint'i tarafından
 * (`getOrFetchTexture` fire-and-forget) yapılır.
 *
 * `pcon-proxy.icon.$.jsx`'in birebir uyarlanmış kopyasıdır; sadece
 * Cache-Control TTL'i 1 yıl + immutable (texture asset'leri hash-based
 * dolayısıyla content-addressed; URL değişmediği sürece içerik aynıdır).
 */

import { resolve, extname } from "path";
import { readFile } from "fs/promises";
import {
  getTextureCacheDir,
  getTextureMeta,
} from "../services/texture-cache.server";

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_BY_EXT));

export async function loader({ params }) {
  const filename = params["*"];

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new Response("Not Found", { status: 404 });
  }

  const ext = extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return new Response("Not Found", { status: 404 });
  }

  // `<hash>.<ext>` → hash kısmını çıkart; meta'da yoksa fetch henüz
  // yapılmamış demektir (route asla pCon'a kendi başına istek atmaz).
  const hash = filename.slice(0, -ext.length);
  if (!hash || !/^[a-f0-9]{32}$/i.test(hash)) {
    return new Response("Not Found", { status: 404 });
  }

  const meta = await getTextureMeta(hash);
  if (!meta) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const dir = getTextureCacheDir();
    const filePath = resolve(dir, filename);

    if (!filePath.startsWith(dir)) {
      return new Response("Forbidden", { status: 403 });
    }

    const content = await readFile(filePath);

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": meta.contentType || MIME_BY_EXT[ext],
        // Texture URL'leri content-addressed (hash) olduğu için 1 yıl
        // immutable cache güvenli — içerik değişirse hash de değişir.
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
