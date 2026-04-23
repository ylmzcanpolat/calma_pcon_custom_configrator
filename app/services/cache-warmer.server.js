import { getSessionManager } from "./pcon-session-manager.server.js";
import { generateCacheKey, cacheGet, cacheSet } from "./redis-client.server.js";
import { cacheGltf } from "./gltf-cache.server.js";

const warmingInProgress = new Set();

export function warmCacheInBackground(articleNumber, manufacturerId, properties) {
  const warmKey = articleNumber + ":" + (manufacturerId || "");
  if (warmingInProgress.has(warmKey)) return;
  warmingInProgress.add(warmKey);

  const editableProps = (properties || []).filter(
    (p) => p.editable && p.options && p.options.length > 1,
  );

  if (editableProps.length === 0) {
    warmingInProgress.delete(warmKey);
    return;
  }

  const baseProps = {};
  for (const p of properties) {
    if (p.currentValue) baseProps[p.id] = p.currentValue;
  }

  setImmediate(async () => {
    const manager = getSessionManager();
    let client;
    try {
      client = await manager.acquire();

      const initData = await client.getArticleData(articleNumber, manufacturerId);
      const itemId = initData.itemId;

      console.log(
        `[cache-warmer] Starting pre-warm for ${articleNumber}: ${editableProps.length} editable props`,
      );

      let warmed = 0;
      let skipped = 0;

      for (const prop of editableProps) {
        for (const opt of prop.options) {
          if (!opt.available || opt.value === prop.currentValue) continue;

          const propsToCache = { ...baseProps, [prop.id]: opt.value };

          const cacheKey = generateCacheKey("update", {
            articleNumber: articleNumber || "",
            manufacturerId: manufacturerId || "",
            ...propsToCache,
          });

          const existing = await cacheGet(cacheKey);
          if (existing) {
            skipped++;
            continue;
          }

          try {
            const propertyList = Object.entries(propsToCache).map(([key, value]) => {
              const [propClass, propName] = key.split(".");
              return { propClass, propName, value };
            });

            const data = await client.setPropertyValue(itemId, propertyList);
            const localGltfUrl = await cacheGltf(data.gltfUrl);

            await cacheSet(cacheKey, {
              price: data.price,
              gltfUrl: localGltfUrl,
              originalGltfUrl: data.gltfUrl,
              validOptions: data.validOptions,
              currency: data.currency,
            });

            warmed++;
          } catch (err) {
            console.warn(`[cache-warmer] Failed to warm ${prop.id}=${opt.value}:`, err.message);
          }
        }
      }

      console.log(
        `[cache-warmer] Done for ${articleNumber}: ${warmed} warmed, ${skipped} already cached`,
      );
    } catch (err) {
      console.error(`[cache-warmer] Failed to start warming for ${articleNumber}:`, err.message);
    } finally {
      if (client) manager.release(client);
      warmingInProgress.delete(warmKey);
    }
  });
}
