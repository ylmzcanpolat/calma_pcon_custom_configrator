import { authenticate } from "../shopify.server";
import { isRedisHealthy, getRedisCacheStats, cacheGet } from "../services/redis-client.server";
import { getGltfDiskStats } from "../services/gltf-cache.server";

export async function loader({ request }) {
  await authenticate.admin(request);

  try {
    const [redisHealthy, redisStats, gltfDisk, lastCycle] = await Promise.all([
      isRedisHealthy(),
      getRedisCacheStats(),
      getGltfDiskStats(),
      cacheGet("pcon:warm:last-cycle"),
    ]);

    const lastWarming = lastCycle
      ? {
          timestamp: lastCycle.timestamp,
          products: lastCycle.products,
          warmed: lastCycle.totalWarmed,
          skipped: lastCycle.totalSkipped,
          durationSeconds: lastCycle.elapsedSeconds,
        }
      : null;

    return Response.json({
      redis: {
        connected: redisHealthy,
        ...redisStats,
      },
      gltfDisk,
      lastWarming,
    });
  } catch (err) {
    console.error("[cache-stats] Error:", err.message);
    return Response.json(
      { error: "Failed to fetch cache stats" },
      { status: 500 },
    );
  }
}
