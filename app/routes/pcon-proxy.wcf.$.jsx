/**
 * GET /apps/pcon-configurator/wcf/* (→ Remix internal: /pcon-proxy/wcf/*)
 *
 * WCF kütüphanesinin runtime'da ihtiyaç duyduğu statik dosyaları
 * (data/, styles/ klasörleri) node_modules'tan okuyup tarayıcıya sunar.
 *
 * wcfConfig.dataPath = "/apps/pcon-configurator/wcf/data/" şeklinde set
 * edildiğinde WCF bu endpoint üzerinden dosyaları çeker.
 *
 * Güvenlik: ".." path traversal denemelerine karşı basit kontrol mevcuttur.
 * Cache: 24 saatlik CDN-friendly Cache-Control header'ı eklenir.
 */

import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

const MIME_TYPES = {
  ".json":   "application/json",
  ".js":     "application/javascript",
  ".mjs":    "application/javascript",
  ".css":    "text/css",
  ".wasm":   "application/wasm",
  ".png":    "image/png",
  ".jpg":    "image/jpeg",
  ".jpeg":   "image/jpeg",
  ".webp":   "image/webp",
  ".svg":    "image/svg+xml",
  ".glb":    "model/gltf-binary",
  ".gltf":   "model/gltf+json",
  ".bin":    "application/octet-stream",
  ".ttf":    "font/ttf",
  ".woff":   "font/woff",
  ".woff2":  "font/woff2",
  ".xml":    "application/xml",
  ".txt":    "text/plain",
};

function getContentType(filePath) {
  const dotIdx = filePath.lastIndexOf(".");
  if (dotIdx === -1) return "application/octet-stream";
  const ext = filePath.substring(dotIdx).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export async function loader({ params }) {
  const raw = params["*"] || "";

  // Güvenlik: path traversal engellemesi
  if (raw.includes("..") || raw.includes("\\")) {
    return new Response("Forbidden", { status: 403 });
  }

  const wcfRoot = join(process.cwd(), "node_modules", "@easterngraphics", "wcf");
  const normalizedPath = normalize(raw);

  // Yalnızca data/ ve styles/ klasörlerine erişim izni
  if (!normalizedPath.startsWith("data") && !normalizedPath.startsWith("styles")) {
    return new Response("Not found", { status: 404 });
  }

  const fullPath = join(wcfRoot, normalizedPath);

  try {
    const data = await readFile(fullPath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": getContentType(normalizedPath),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
