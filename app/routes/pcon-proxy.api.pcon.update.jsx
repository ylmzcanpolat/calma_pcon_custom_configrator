import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import { upgradeCacheEntryWithLocalGltf } from "../services/gltf-cache.server";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

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
  // Cache versioning: yeni cartProperties formatı `_request_id` placeholder'ı
  // içerir (cart-payload endpoint'inde overwrite edilir). Eski entry'ler bu
  // placeholder'a sahip olmadığı için organik bir migration ile bypass edilir.
  if (
    cached &&
    cached.cartProperties &&
    cached.cartProperties._request_id !== undefined
  ) {
    let gltfUrl = cached.gltfUrl;
    if (!gltfUrl || !gltfUrl.startsWith(LOCAL_GLTF_PREFIX)) {
      const sourceUrl = cached.originalGltfUrl || cached.gltfUrl;
      upgradeCacheEntryWithLocalGltf(cacheKey, sourceUrl);
      gltfUrl = sourceUrl;
    }
    return Response.json({ ...cached, gltfUrl });
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

    const result = {
      price: data.price,
      gltfUrl: data.gltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      cartProperties: data.cartProperties || null,
    };

    await cacheSet(cacheKey, result);

    upgradeCacheEntryWithLocalGltf(cacheKey, data.gltfUrl);

    return Response.json(result);
  } catch (err) {
    console.error("[pcon/update] Error:", err.message);
    return Response.json(
      { error: "Failed to update pCon configuration", detail: err.message },
      { status: 500 },
    );
  }
}
