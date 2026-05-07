/**
 * Faz 0 — Frontend Performance Recorder
 *
 * Sorumluluk:
 *   - Tek bir kullanıcı action'ı (örn. property tıklama) için
 *     `mark(label)` ile performance.now() snapshot'ları toplamak.
 *   - Backend'den gelen `Server-Timing` header'ını parse edip aynı kayda
 *     iliştirmek (`attachServerTiming`).
 *   - `flushToConsole()` + `flushToWindow()` ile tek satırlık structured
 *     log + `window.__pconPerf` ring buffer'ına kayıt.
 *
 * Davranışsal sözleşme:
 *   - SSR-safe: `performance` ve `window` yoksa no-op'a düşer.
 *   - Hot path'te yalnızca `performance.now()` (mikrosaniye seviyesi);
 *     hiçbir async I/O veya layout-trigger işi yok.
 *   - Bu modül **hiçbir three.js / store davranışını değiştirmez**.
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 0 §0.2.
 */

const RING_BUFFER_SIZE = 50;

const hasPerf = typeof performance !== "undefined" && typeof performance.now === "function";
const hasWindow = typeof window !== "undefined";

function now() {
  return hasPerf ? performance.now() : Date.now();
}

/**
 * Yeni bir kullanıcı action'ı için recorder.
 *
 * Tipik akış:
 *   const r = createPerfRecorder({ op: "updateProperty", articleNumber, propertyId });
 *   r.mark("click");
 *   ... fetch ...
 *   r.mark("response_server");
 *   r.attachServerTiming(headerValue);
 *   r.mark("paint_state_set");
 *   r.flushToConsole();
 *   r.flushToWindow();
 *
 * Her recorder bağımsız bir kayıt nesnesi üretir; concurrent action
 * (örn. iki property hızlı arka arkaya tıklanmış) durumunda overlap'i
 * ayrıştırmak caller'ın sorumluluğunda — basit kullanım için her
 * tıklama yeni recorder demek yeterli.
 */
export function createPerfRecorder(meta = {}) {
  const startedAt = now();
  // Insertion-ordered Map.
  const marks = new Map();
  let serverTiming = null;

  function mark(label) {
    if (!label) return 0;
    const t = now();
    const prev = marks.size > 0 ? Array.from(marks.values()).pop() : startedAt;
    marks.set(label, t);
    return t - prev;
  }

  function measure(from, to) {
    const a = marks.get(from);
    const b = marks.get(to);
    if (a === undefined || b === undefined) return null;
    return round2(b - a);
  }

  function attachServerTiming(headerValue) {
    serverTiming = parseServerTiming(headerValue);
  }

  function getDurations() {
    if (marks.size === 0) return {};
    const labels = Array.from(marks.keys());
    const out = {};
    let prev = startedAt;
    for (const label of labels) {
      const t = marks.get(label);
      out[label] = round2(t - prev);
      prev = t;
    }
    out.total = round2(prev - startedAt);
    return out;
  }

  function totalMs() {
    if (marks.size === 0) return 0;
    const last = Array.from(marks.values()).pop();
    return round2(last - startedAt);
  }

  function buildEntry() {
    const durations = getDurations();
    return {
      ts: Date.now(),
      op: meta.op || "unknown",
      articleNumber: meta.articleNumber || null,
      propertyId: meta.propertyId || null,
      durations,
      serverTiming: serverTiming || null,
    };
  }

  function flushToConsole() {
    const entry = buildEntry();
    const phaseStr = Object.entries(entry.durations)
      .map(([k, v]) => `${k}=${v}ms`)
      .join(" ");
    const serverStr = entry.serverTiming
      ? " server=" +
        Object.entries(entry.serverTiming)
          .map(([k, v]) => `${k}:${v}`)
          .join(",")
      : "";
    const propStr = entry.propertyId ? ` propId=${entry.propertyId}` : "";
    const articleStr = entry.articleNumber ? ` article=${entry.articleNumber}` : "";
    // tek satır, kopyalanabilir log:
    // [pcon-perf] op=updateProperty propId=... article=... click=0ms ... total=970ms server=eaiws-setProp:520,...
    // eslint-disable-next-line no-console
    console.log(`[pcon-perf] op=${entry.op}${propStr}${articleStr} ${phaseStr}${serverStr}`);
    return entry;
  }

  function flushToWindow() {
    if (!hasWindow) return null;
    const entry = buildEntry();
    if (!Array.isArray(window.__pconPerf)) {
      window.__pconPerf = [];
    }
    window.__pconPerf.push(entry);
    while (window.__pconPerf.length > RING_BUFFER_SIZE) {
      window.__pconPerf.shift();
    }
    return entry;
  }

  return {
    mark,
    measure,
    attachServerTiming,
    getDurations,
    totalMs,
    flushToConsole,
    flushToWindow,
    // Diagnostic — testlerde ya da ileride PerfHud için kullanılabilir.
    snapshot: buildEntry,
  };
}

/**
 * `Server-Timing` header'ını parse et.
 *
 * Örn:
 *   "cache;dur=12.3, eaiws-setProp;dur=890.2, total;dur=2150.8"
 *      → { cache: 12.3, "eaiws-setProp": 890.2, total: 2150.8 }
 *
 * `desc` ve diğer parametreler şimdilik yok sayılır (ihtiyaç olursa
 * obje değer formatına geçilir; bu fazda baseline için yeterli).
 */
export function parseServerTiming(headerValue) {
  if (!headerValue || typeof headerValue !== "string") return null;
  const out = {};
  const items = headerValue.split(",");
  for (const raw of items) {
    const parts = raw.split(";").map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) continue;
    const name = parts[0];
    let dur = null;
    for (let i = 1; i < parts.length; i++) {
      const kv = parts[i];
      if (kv.startsWith("dur=")) {
        const n = parseFloat(kv.slice(4));
        if (Number.isFinite(n)) dur = n;
      }
    }
    if (name) out[name] = dur;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}
