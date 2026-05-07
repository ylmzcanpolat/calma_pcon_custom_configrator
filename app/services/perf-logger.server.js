/**
 * Faz 0 — Backend Performance Logger
 *
 * Sorumluluk:
 *   - Tek bir HTTP request akışı içinde phase-by-phase süre ölçümü
 *     (`mark()`, `markRaw()`).
 *   - Standardize çıktı formatları:
 *       * `toServerTimingHeader()` → HTTP `Server-Timing` header değeri.
 *       * `toLogString()` → tek satırlık insan-okur structured log.
 *       * `toJSON()` → diagnostic JSON snapshot.
 *   - Fire-and-forget Redis sliding-window sample push (`recordSample`)
 *     ve P50/P95/P99 hesabı (`getPerfStats`).
 *
 * Davranışsal sözleşme:
 *   - Hot path'te yalnızca `performance.now()` (ucuz) çağrısı yapar;
 *     Redis I/O her zaman fire-and-forget — request handler'ı bloklamaz
 *     ve hatayı yutmaz şekilde sadece console.warn ile geçer.
 *   - Hiçbir EAIWS / cache mantığını değiştirmez. Sadece okur ve raporlar.
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 0 §0.1.
 */

import { performance } from "perf_hooks";

// Redis client lazy import — `cacheGet/cacheSet` ile aynı bağlantıyı
// paylaşalım diye `redis-client.server.js` üzerinden raw client'a
// erişmek yerine, kendi küçük getter'ımızı kullanıyoruz. Eğer Redis
// yoksa veya bağlantı kurulamamışsa sample push silently no-op'a düşer.
import { createClient } from "redis";

const SAMPLE_RING_SIZE = 200;
const SAMPLE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 gün

let _perfRedis = null;
let _perfRedisPromise = null;

async function getPerfRedis() {
  if (_perfRedis?.isReady) return _perfRedis;
  if (_perfRedisPromise) return _perfRedisPromise;

  _perfRedisPromise = (async () => {
    try {
      const client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
      });
      client.on("error", (err) => {
        console.warn("[perf-logger] Redis error:", err.message);
      });
      await client.connect();
      _perfRedis = client;
      return client;
    } catch (err) {
      console.warn("[perf-logger] Redis unavailable:", err.message);
      _perfRedis = null;
      _perfRedisPromise = null;
      return null;
    }
  })();

  return _perfRedisPromise;
}

/**
 * Tek HTTP request için timer.
 *
 * Tipik kullanım:
 *
 *   const timer = createPerfTimer("pcon/update", { articleNumber });
 *   timer.mark("auth");
 *   timer.mark("cache-lookup");
 *   timer.mark("eaiws-setProp");
 *   timer.mark("eaiws-export");
 *   timer.mark("done");
 *   const headerValue = timer.toServerTimingHeader();
 *   console.log(timer.toLogString({ cache: "MISS", articleNumber }));
 */
export function createPerfTimer(endpoint = "unknown", baseMeta = {}) {
  const startedAt = performance.now();
  let lastMark = startedAt;
  // Insertion-ordered Map: ek bir array'e gerek yok; Map.entries() sıralı döner.
  const phases = new Map();

  function mark(label) {
    const now = performance.now();
    const dur = Math.max(0, now - lastMark);
    if (label) phases.set(label, (phases.get(label) || 0) + dur);
    lastMark = now;
    return dur;
  }

  /**
   * Önceden ölçülmüş süreyi (ms cinsinden) doğrudan kaydet.
   * `mark(label)` running clock'ı ilerletir; `markRaw(label, ms)` ise
   * `lastMark` cursor'unu kaymaz — örn. RPC sub-süresini iç içe ölçen
   * pcon-client metodları bunu kullanır (caller'ın iki mark arasında
   * "cache.set" gibi başka bir adım eklemesini bozmamak için).
   */
  function markRaw(label, durationMs) {
    if (!label) return;
    const dur = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
    phases.set(label, (phases.get(label) || 0) + dur);
  }

  function getDurations() {
    const out = {};
    for (const [k, v] of phases.entries()) {
      out[k] = round2(v);
    }
    return out;
  }

  function totalMs() {
    return round2(performance.now() - startedAt);
  }

  function toServerTimingHeader() {
    const parts = [];
    for (const [k, v] of phases.entries()) {
      parts.push(`${sanitizeLabel(k)};dur=${round2(v)}`);
    }
    parts.push(`total;dur=${totalMs()}`);
    return parts.join(", ");
  }

  function toLogString(extraMeta = {}) {
    const meta = { ...baseMeta, ...extraMeta };
    const head = `[${endpoint}]`;
    const metaParts = [];
    if (meta.cache) metaParts.push(`cache=${meta.cache}`);
    for (const [k, v] of Object.entries(meta)) {
      if (k === "cache") continue;
      if (v === undefined || v === null) continue;
      metaParts.push(`${k}=${v}`);
    }
    const phaseParts = [];
    for (const [k, v] of phases.entries()) {
      phaseParts.push(`${k}=${round2(v)}ms`);
    }
    phaseParts.push(`total=${totalMs()}ms`);
    return [head, ...metaParts, ...phaseParts].join(" ");
  }

  function toJSON(extraMeta = {}) {
    return {
      endpoint,
      meta: { ...baseMeta, ...extraMeta },
      totalMs: totalMs(),
      phases: getDurations(),
    };
  }

  return {
    endpoint,
    mark,
    markRaw,
    getDurations,
    totalMs,
    toServerTimingHeader,
    toLogString,
    toJSON,
  };
}

/**
 * Sliding-window per-operation latency sample push.
 *
 * Key şeması:
 *   pcon:perf:samples:<operation>:<articleNumber>            → genel ring
 *   pcon:perf:samples:<operation>:<articleNumber>:<propId>   → per-property ring
 *
 * Operation tipik değerler: `init`, `update`, `update.eaiws.setProp`,
 * `update.eaiws.export`. Frontend ölçümleri için de aynı API kullanılabilir
 * (örn. `op = "frontend.updateProperty"`) ama default olarak yalnızca
 * backend tarafından yazılır.
 *
 * Fire-and-forget: hatayı yutar, never throws, await edilmesi şart değildir.
 */
export async function recordSample(operation, articleNumber, propertyId, durationMs) {
  if (!operation || !Number.isFinite(durationMs)) return;
  try {
    const redis = await getPerfRedis();
    if (!redis) return;

    const sample = JSON.stringify({
      ts: Date.now(),
      ms: round2(durationMs),
    });

    const ops = [];
    const baseKey = buildSampleKey(operation, articleNumber || "_", null);
    ops.push(redis.lPush(baseKey, sample));
    ops.push(redis.lTrim(baseKey, 0, SAMPLE_RING_SIZE - 1));
    ops.push(redis.expire(baseKey, SAMPLE_TTL_SECONDS));

    if (propertyId) {
      const propKey = buildSampleKey(operation, articleNumber || "_", propertyId);
      ops.push(redis.lPush(propKey, sample));
      ops.push(redis.lTrim(propKey, 0, SAMPLE_RING_SIZE - 1));
      ops.push(redis.expire(propKey, SAMPLE_TTL_SECONDS));
    }

    await Promise.all(ops);
  } catch (err) {
    console.warn("[perf-logger] recordSample failed:", err.message);
  }
}

/**
 * Bir timer içindeki tüm phase'leri otomatik olarak Redis sliding-window'a
 * iletmek için convenience helper. `recordSample` çağrılarını caller'ın
 * tek tek yapmaması için kullanılır.
 *
 * Always fire-and-forget — handler return'unu beklemeyin.
 */
export function recordTimerSamples(timer, { articleNumber, propertyId } = {}) {
  if (!timer) return;
  const op = timer.endpoint || "unknown";
  const total = timer.totalMs();
  // Genel total sample'ı.
  void recordSample(op, articleNumber, propertyId, total);
  // Phase-level sample'ları (örn. `update.eaiws.setProp`).
  const durations = timer.getDurations();
  for (const [phase, ms] of Object.entries(durations)) {
    void recordSample(`${op}.${phase}`, articleNumber, propertyId, ms);
  }
}

/**
 * P50/P95/P99 + count + min/max/mean hesabı.
 *
 * @param {string} operation   örn. "pcon/update" veya "pcon/update.eaiws.setProp"
 * @param {string} articleNumber
 * @param {string} [propertyId] belirtilirse property-bazlı ring'i okur.
 */
export async function getPerfStats(operation, articleNumber, propertyId = null) {
  try {
    const redis = await getPerfRedis();
    if (!redis) return emptyStats();

    const key = buildSampleKey(operation, articleNumber || "_", propertyId);
    const raw = await redis.lRange(key, 0, SAMPLE_RING_SIZE - 1);
    if (!raw || raw.length === 0) return emptyStats();

    const samples = [];
    for (const item of raw) {
      try {
        const parsed = JSON.parse(item);
        if (Number.isFinite(parsed.ms)) samples.push(parsed.ms);
      } catch {
        // bozuk entry yok say
      }
    }

    return computeStats(samples);
  } catch (err) {
    console.warn("[perf-logger] getPerfStats failed:", err.message);
    return emptyStats();
  }
}

// ─────────────────────────── helpers ───────────────────────────

function buildSampleKey(operation, articleNumber, propertyId) {
  const safeOp = String(operation).replace(/\s+/g, "_");
  const safeArt = String(articleNumber).replace(/\s+/g, "_") || "_";
  const base = `pcon:perf:samples:${safeOp}:${safeArt}`;
  if (!propertyId) return base;
  const safeProp = String(propertyId).replace(/\s+/g, "_");
  return `${base}:${safeProp}`;
}

function emptyStats() {
  return { count: 0, p50: null, p95: null, p99: null, min: null, max: null, mean: null };
}

function computeStats(samples) {
  if (!samples.length) return emptyStats();
  const sorted = [...samples].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, n) => acc + n, 0);
  return {
    count: sorted.length,
    p50: round2(percentile(sorted, 0.5)),
    p95: round2(percentile(sorted, 0.95)),
    p99: round2(percentile(sorted, 0.99)),
    min: round2(sorted[0]),
    max: round2(sorted[sorted.length - 1]),
    mean: round2(sum / sorted.length),
  };
}

// Linear interpolation between closest ranks.
function percentile(sorted, p) {
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

function sanitizeLabel(label) {
  // `Server-Timing` token'ı için: alfa-numerik + `_`/`-`/`.`
  return String(label).replace(/[^a-zA-Z0-9._-]/g, "-");
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}
