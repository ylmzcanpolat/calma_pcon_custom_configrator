import { resolve, extname } from "path";
import { readFile } from "fs/promises";
import { getIconCacheDir } from "../services/icon-cache.server";

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

  try {
    const dir = getIconCacheDir();
    const filePath = resolve(dir, filename);

    if (!filePath.startsWith(dir)) {
      return new Response("Forbidden", { status: 403 });
    }

    const content = await readFile(filePath);

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": MIME_BY_EXT[ext],
        "Cache-Control": "public, max-age=604800, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
