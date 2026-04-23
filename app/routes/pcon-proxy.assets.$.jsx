import { resolve } from "path";
import { readFile } from "fs/promises";

const EXTENSION_ASSETS_DIR = resolve(
  process.cwd(),
  "extensions/pcon-3d-configurator/assets",
);

const MIME_TYPES = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

export async function loader({ params }) {
  const filename = params["*"];

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new Response("Not Found", { status: 404 });
  }

  const ext = "." + filename.split(".").pop();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const filePath = resolve(EXTENSION_ASSETS_DIR, filename);

    if (!filePath.startsWith(EXTENSION_ASSETS_DIR)) {
      return new Response("Forbidden", { status: 403 });
    }

    const content = await readFile(filePath);

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
