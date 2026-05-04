import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import { upgradeCacheEntryWithLocalGltf } from "../services/gltf-cache.server";
import { warmCacheInBackground } from "../services/cache-warmer.server";
import { isCacheWarmingEnabled } from "../services/cache-warming-config.server";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

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
  // Cache versioning: yeni format `_request_id` placeholder'ı içerir
  // (cart-payload endpoint'inde overwrite edilir). Eski entry'ler bu
  // placeholder'a sahip olmayabilir (deploy öncesi yazılmış); o durumda
  // cache atlanıp tazelenir, böylece legacy anahtar sırası garanti edilir.
  if (
    cached &&
    cached.cartProperties &&
    cached.cartProperties._request_id !== undefined
  ) {
    // Tercihli sıra: warmer veya önceki MISS path'i tarafından yazılmış
    // local proxy URL. Eski entry'ler (deploy öncesi yazılmış) sadece pCon
    // CDN URL içerir; bu durumda response'u bloklamadan arka planda local
    // cache hazırlanıp Redis entry yükseltilir.
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
    const data = await pcon.getArticleData(articleNumber, manufacturerId);

    // İlk MISS: pCon CDN URL ile hızlıca cevap dön. Local cache + Draco
    // compression arka planda hazırlanır; bir sonraki request local URL alır.
    // Bu sayede HTTP timeout (frontend ya da Shopify App Proxy) tetiklenmez.
    const result = {
      price: data.price,
      gltfUrl: data.gltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      itemId: data.itemId,
      cartProperties: data.cartProperties || null,
    };

    await cacheSet(cacheKey, result);

    upgradeCacheEntryWithLocalGltf(cacheKey, data.gltfUrl);

    if (isCacheWarmingEnabled()) {
      warmCacheInBackground(articleNumber, manufacturerId, data.properties);
    }

    return Response.json(result);
  } catch (err) {
    console.error("[pcon/init] Error:", err.message);
    return Response.json(
      { error: "Failed to initialize pCon article", detail: err.message },
      { status: 500 },
    );
  }
}
