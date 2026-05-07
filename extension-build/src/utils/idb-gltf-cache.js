/**
 * Faz 6 — IndexedDB cache for GLB / texture buffers.
 *
 * Browser HTTP cache is volatile (gets evicted on storage pressure, kapsam
 * dışı kalan PWA scenarios, etc.); IDB durable bir layer sağlar. Aynı
 * `objectHash`'li GLB'ler refresh sonrası bile diskten ~ms seviyesinde
 * yüklenir.
 *
 * Davranışsal sözleşme:
 *   - SSR-safe: `window` veya `indexedDB` yoksa tüm public API no-op döner.
 *   - **Flag-gated** (default OFF): `window.__pconConfig.idbCache === true`
 *     veya `?idbcache=1` query param ile açılır. Default'ta hiç DB
 *     açılmaz — Faz 6 öncesi davranış bytewise korunur.
 *   - Eviction: LRU 200 MB. Her `idbSet` öncesi totalBytes hesaplanır;
 *     limit aşılırsa en eski (`ts` ascending) entry'ler silinir.
 *   - Quota exceeded → console.warn + sessizce skip; throw etmez.
 *
 * Cache key:
 *   - GLB için Faz 0 backend'in ürettiği `objectHash` (16+ hex chars).
 *   - Texture için `materialHash` (Faz 2 backend MD5; texture-cache.server.js).
 *
 * Plan referansı: performance-improvement-plan.md Faz 6 §546.
 */

const DB_NAME = "pcon-cache";
const DB_VERSION = 1;
const STORE = "assets";
const MAX_BYTES = 200 * 1024 * 1024;

const hasWindow = typeof window !== "undefined";

export function isIdbEnabled() {
  if (!hasWindow) return false;
  if (typeof indexedDB === "undefined") return false;
  // Default ON (2026-05-06): Faz 4 mesh-mapping deferred sebebiyle backend
  // material-patch/geometry-delta path'leri kapalı; her property değişimi
  // full-GLB indirir. IDB cache aynı objectHash GLB'lerini browser
  // refresh sonrasında bile mil-saniye seviyesinde paint eder — bu
  // sebeple production default ON.
  // Acil rollback: `window.__pconConfig = { idbCache: false }` veya
  // URL'de `?idbcache=0` query param.
  if (window.__pconConfig && window.__pconConfig.idbCache === false) return false;
  try {
    if (window.location.search.indexOf("idbcache=0") !== -1) return false;
  } catch {
    /* ignore */
  }
  return true;
}

let dbPromise = null;

function openDb() {
  if (!isIdbEnabled()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      console.warn("[idb-cache] open threw:", err?.message || err);
      resolve(null);
      return;
    }

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "key" });
        // `ts` index → cursor üzerinden LRU eviction sırası alabilelim.
        store.createIndex("ts", "ts", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      console.warn("[idb-cache] open failed:", req.error?.message);
      resolve(null);
    };
    req.onblocked = () => {
      console.warn("[idb-cache] open blocked (older tab holds DB)");
      resolve(null);
    };
  });

  return dbPromise;
}

function txStore(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Read entry buffer. Best-effort `ts` refresh for LRU.
 * @returns {Promise<ArrayBuffer|null>}
 */
export async function idbGet(key) {
  if (!isIdbEnabled() || !key) return null;
  try {
    const db = await openDb();
    if (!db) return null;
    const entry = await reqToPromise(txStore(db, "readonly").get(key));
    if (!entry || !entry.buffer) return null;

    // LRU touch — fire-and-forget, no await.
    try {
      txStore(db, "readwrite").put({ ...entry, ts: Date.now() });
    } catch {
      /* ignore */
    }
    return entry.buffer;
  } catch (err) {
    console.warn("[idb-cache] get failed:", err?.message || err);
    return null;
  }
}

function evictUntilFits(db, neededBytes) {
  return new Promise((resolve) => {
    const store = txStore(db, "readwrite");
    const idx = store.index("ts");
    let total = 0;
    const entries = [];

    const cursorReq = idx.openCursor();
    cursorReq.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const size = cursor.value.size || 0;
        total += size;
        entries.push({ key: cursor.value.key, size });
        cursor.continue();
      } else {
        let evicted = 0;
        let i = 0;
        while (total + neededBytes > MAX_BYTES && i < entries.length) {
          try {
            store.delete(entries[i].key);
            total -= entries[i].size;
            evicted++;
          } catch {
            /* ignore */
          }
          i++;
        }
        resolve({ evicted });
      }
    };
    cursorReq.onerror = () => resolve({ evicted: 0 });
  });
}

/**
 * Persist buffer; evicts older entries if MAX_BYTES would be exceeded.
 * @param {string} key
 * @param {ArrayBuffer} buffer
 * @param {"gltf"|"texture"} type
 * @returns {Promise<boolean>} true on success, false on skip/failure.
 */
export async function idbSet(key, buffer, type) {
  if (!isIdbEnabled() || !key || !buffer) return false;
  const size = buffer.byteLength || 0;
  if (size === 0 || size > MAX_BYTES) return false;

  try {
    const db = await openDb();
    if (!db) return false;
    await evictUntilFits(db, size);

    const entry = {
      key,
      buffer,
      type: type === "texture" ? "texture" : "gltf",
      ts: Date.now(),
      size,
    };
    await reqToPromise(txStore(db, "readwrite").put(entry));
    return true;
  } catch (err) {
    if (err && (err.name === "QuotaExceededError" || /quota/i.test(err.message || ""))) {
      console.warn("[idb-cache] quota exceeded, skipping put for", key);
    } else {
      console.warn("[idb-cache] set failed:", err?.message || err);
    }
    return false;
  }
}

export async function idbDelete(key) {
  if (!isIdbEnabled() || !key) return false;
  try {
    const db = await openDb();
    if (!db) return false;
    await reqToPromise(txStore(db, "readwrite").delete(key));
    return true;
  } catch {
    return false;
  }
}

export async function idbStats() {
  const empty = { count: 0, totalBytes: 0, oldestTs: 0, newestTs: 0 };
  if (!isIdbEnabled()) return empty;
  try {
    const db = await openDb();
    if (!db) return empty;

    return await new Promise((resolve) => {
      let count = 0;
      let totalBytes = 0;
      let oldestTs = Infinity;
      let newestTs = 0;
      const cursorReq = txStore(db, "readonly").openCursor();
      cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          count++;
          totalBytes += cursor.value.size || 0;
          const ts = cursor.value.ts || 0;
          if (ts > 0) oldestTs = Math.min(oldestTs, ts);
          newestTs = Math.max(newestTs, ts);
          cursor.continue();
        } else {
          resolve({
            count,
            totalBytes,
            oldestTs: oldestTs === Infinity ? 0 : oldestTs,
            newestTs,
          });
        }
      };
      cursorReq.onerror = () => resolve(empty);
    });
  } catch {
    return empty;
  }
}

export async function idbClear() {
  if (!isIdbEnabled()) return false;
  try {
    const db = await openDb();
    if (!db) return false;
    await reqToPromise(txStore(db, "readwrite").clear());
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract objectHash from gltfUrl.
 *
 * Backend (Faz 0) iki URL şekli üretir:
 *   1. Raw EAIWS: `…/objects/<hash>.glb`
 *   2. Local proxy: `/apps/pcon-configurator/gltf/<hash>.glb`
 *      veya `/apps/pcon-configurator/gltf/<hash>.enriched.glb` (Faz 3)
 *
 * Hash 8+ hex char. Eşleşme yoksa `null` döner; caller IDB by-pass eder.
 */
export function extractObjectHash(url) {
  if (!url || typeof url !== "string") return null;

  let m = url.match(/\/gltf\/([a-f0-9]{8,})(?:\.enriched)?\.glb(?:[?#]|$)/i);
  if (m) return m[1];

  m = url.match(/\/objects\/([a-f0-9]{8,})\.glb(?:[?#]|$)/i);
  if (m) return m[1];

  return null;
}
