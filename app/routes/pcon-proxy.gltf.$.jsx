import { resolve } from "path";
import { readFile } from "fs/promises";
import { getGltfCacheDir } from "../services/gltf-cache.server";

export async function loader({ params }) {
  const filename = params["*"];

  if (!filename || !filename.endsWith(".glb") || filename.includes("..") || filename.includes("/")) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const dir = getGltfCacheDir();
    const filePath = resolve(dir, filename);

    if (!filePath.startsWith(dir)) {
      return new Response("Forbidden", { status: 403 });
    }

    const content = await readFile(filePath);

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=604800, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
