import { createClient } from "redis";
import { createHash } from "crypto";

const CACHE_TTL = 86400; // 24 hours

let client = null;
let connectionPromise = null;

async function getClient() {
  if (client?.isReady) return client;

  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      client = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

      client.on("error", (err) => {
        console.error("[Redis] Connection error:", err.message);
      });

      client.on("reconnecting", () => {
        console.log("[Redis] Reconnecting...");
      });

      await client.connect();
      console.log("[Redis] Connected successfully");
      return client;
    } catch (err) {
      console.error("[Redis] Failed to connect:", err.message);
      client = null;
      connectionPromise = null;
      return null;
    }
  })();

  return connectionPromise;
}

export function generateCacheKey(prefix, data) {
  const sorted = Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
  const hash = createHash("md5").update(JSON.stringify(sorted)).digest("hex");
  return `pcon:${prefix}:${hash}`;
}

export async function cacheGet(key) {
  try {
    const redis = await getClient();
    if (!redis) return null;

    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("[Redis] GET error:", err.message);
    return null;
  }
}

export async function cacheSet(key, value, ttl = CACHE_TTL) {
  try {
    const redis = await getClient();
    if (!redis) return;

    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error("[Redis] SET error:", err.message);
  }
}

export async function isRedisHealthy() {
  try {
    const redis = await getClient();
    if (!redis) return false;
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}

export async function getRedisCacheStats() {
  try {
    const redis = await getClient();
    if (!redis) return { connected: false, totalKeys: 0, initKeys: 0, updateKeys: 0 };

    const allKeys = await redis.keys("pcon:*");
    const initKeys = allKeys.filter((k) => k.startsWith("pcon:init:"));
    const updateKeys = allKeys.filter((k) => k.startsWith("pcon:update:"));

    return {
      connected: true,
      totalKeys: allKeys.length,
      initKeys: initKeys.length,
      updateKeys: updateKeys.length,
    };
  } catch {
    return { connected: false, totalKeys: 0, initKeys: 0, updateKeys: 0 };
  }
}

export async function disconnectRedis() {
  if (client?.isReady) {
    await client.quit();
    client = null;
    connectionPromise = null;
  }
}
