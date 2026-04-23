import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import { cacheGltf } from "../services/gltf-cache.server";
import { warmCacheInBackground } from "../services/cache-warmer.server";

export async function loader({ request }) {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const articleNumber = url.searchParams.get("articleNumber");
  const manufacturerId = url.searchParams.get("manufacturerId");

  if (!articleNumber) {
    return Response.json({ error: "articleNumber is required" }, { status: 400 });
  }

  const cacheKey = generateCacheKey("init", { articleNumber, manufacturerId: manufacturerId || "" });

  const cached = await cacheGet(cacheKey);
  if (cached) {
    return Response.json({
      ...cached,
      gltfUrl: cached.originalGltfUrl || cached.gltfUrl,
    });
  }

  try {
    const pcon = getPconClient();
    const data = await pcon.getArticleData(articleNumber, manufacturerId);

    cacheGltf(data.gltfUrl).catch(() => {});

    const result = {
      price: data.price,
      gltfUrl: data.gltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      itemId: data.itemId,
    };

    await cacheSet(cacheKey, result);

    warmCacheInBackground(articleNumber, manufacturerId, data.properties, data.itemId);

    return Response.json(result);
  } catch (err) {
    console.error("[pcon/init] Error:", err.message);
    return Response.json(
      { error: "Failed to initialize pCon article", detail: err.message },
      { status: 500 },
    );
  }
}
