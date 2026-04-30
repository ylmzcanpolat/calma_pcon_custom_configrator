import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import { cacheGltf } from "../services/gltf-cache.server";

export async function action({ request }) {
  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  /* console.log("body", body); */

  const { properties, itemId, articleNumber } = body;

  if (!properties || typeof properties !== "object") {
    return Response.json({ error: "properties object is required" }, { status: 400 });
  }

  const cacheKey = generateCacheKey("update", {
    articleNumber: articleNumber || "",
    ...properties,
  });

  const cached = await cacheGet(cacheKey);
  // Eski cache entry'leri (deploy öncesi yazılmış) `cartProperties` içermez.
  // Bu durumda cache'i atlayıp tazeleme yolu izlenir; aksi halde Add to Cart
  // butonu bu konfigürasyon için her zaman disabled kalır.
  if (cached && cached.cartProperties) {
    return Response.json({
      ...cached,
      gltfUrl: cached.originalGltfUrl || cached.gltfUrl,
    });
  }

  try {
    const pcon = getPconClient();

    const propertyList = Object.entries(properties).map(([key, value]) => {
      const [propClass, propName] = key.split(".");
      return { propClass, propName, value };
    });

    let data;
    try {
      data = await pcon.setPropertyValue(itemId, propertyList);
    } catch (err) {
      const isStaleItem =
        err.message?.includes("unknown item id") ||
        err.message?.includes("UnknownItemIdException");

      if (!isStaleItem || !articleNumber) throw err;

      console.log("[pcon/update] Stale itemId, re-inserting article...");
      const manufacturerId = body.manufacturerId || "";
      const fresh = await pcon.getArticleData(articleNumber, manufacturerId);
      data = await pcon.setPropertyValue(fresh.itemId, propertyList);
    }

    cacheGltf(data.gltfUrl).catch(() => {});

    const result = {
      price: data.price,
      gltfUrl: data.gltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      cartProperties: data.cartProperties || null,
    };

    await cacheSet(cacheKey, result);

    return Response.json(result);
  } catch (err) {
    console.error("[pcon/update] Error:", err.message);
    return Response.json(
      { error: "Failed to update pCon configuration", detail: err.message },
      { status: 500 },
    );
  }
}
