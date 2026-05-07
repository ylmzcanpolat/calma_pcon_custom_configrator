/**
 * Faz 7 — EAIWS Session Pool
 *
 * Sorumluluk
 * ──────────
 * Birden fazla EAIWS `EaiwsSession` instance'ını lease/release pattern'iyle
 * paylaştırarak:
 *   1. Concurrent HTTP request'lerin tek bir session üzerinde sıraya girme
 *      (ve `currentItemId` race) riskini hafifletmek.
 *   2. Gatekeeper round-trip'i avoid edebilmek için warm session'ları
 *      kalıcı tutmak (idle timeout ile).
 *   3. Broken session'ları otomatik tespit edip kapatmak (health check).
 *
 * Geriye Uyumluluk Garantisi
 * ──────────────────────────
 * Default `PCON_SESSION_POOL_SIZE = 1` ile bytewise singleton davranışı:
 *   - Pool tek session tutar.
 *   - Tüm request'ler ardışık olarak aynı session'ı lease eder.
 *   - `currentItemId` per-entry alanı = eski `PconClient.currentItemId`.
 *   - itemId affinity trivial (tek session her itemId için).
 *
 * Pool size >= 2 olunca:
 *   - Concurrent lease farklı session'lara dağılır.
 *   - itemId affinity best-effort: aynı itemId için aynı session'a yönelt.
 *   - Affinity miss → caller "unknown item id" alabilir → mevcut route
 *     "stale itemId → re-insert" pattern'i (örn. `pcon-proxy.api.pcon.update`)
 *     fallback olarak devreye girer.
 *
 * Lifecycle
 * ─────────
 *   lease(timer, opts?) → idle session varsa onu döner; yoksa pool size
 *     < MAX ise lazy yeni session açar (gatekeeper rate limit'e takılmamak
 *     için sıralı / serialized); doluysa FIFO bekleme kuyruğuna yatırır
 *     (timeout: 30s, sonra reject).
 *
 *   release(lease) | lease.release() → idle havuzuna geri döndürür; broken
 *     ise kapatır ve kuyruğa yeni connection açtırır.
 *
 *   healthCheck (30s interval) → idle session'lara `getCurrency` ping;
 *     broken (`!session.isValid` veya error throw) entry'ler kapatılır.
 *     `idleTimeoutMs` aşıldıysa idle entry'ler de kapatılır.
 *
 *   shutdown() → tüm session'ları kapatır, health check'i durdurur, queue'yu
 *     reject eder. Test/teardown için.
 *
 * Telemetri (Faz 0 sözleşmesiyle uyumlu)
 * ──────────────────────────────────────
 * `lease(timer, ...)` çağrısına timer geçilirse:
 *   - `lease.acquire`   → toplam acquire süresi (idle pick + create + queue).
 *   - `lease.queueWait` → yalnızca FIFO kuyrukta beklenen süre (queue wait).
 *
 * Bu phase'ler `markRaw` ile yazılır (running clock cursor'unu ilerletmez,
 * `pcon-client::_measureRpc` ile aynı disipline tabi).
 *
 * Out-of-Scope (Faz 7 raporunda)
 * ──────────────────────────────
 * - Per-article warm session: pool altyapısı kurulduktan sonra opsiyonel.
 *   Skeleton var (TODO yorumu); uygulama Faz 7.5'a bırakıldı.
 */

import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { performance } from "perf_hooks";
import { EaiwsSession } from "@easterngraphics/wcf/modules/eaiws/index.js";

const GATEKEEPER_BASE_URL = "https://gatekeeper.eaiws.pcon-solutions.com/v2";
const GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2000;
const HEALTH_CHECK_INTERVAL_MS = 30_000;
const LEASE_QUEUE_TIMEOUT_MS = 30_000;

let _entryIdCounter = 0;
let _leaseIdCounter = 0;

/**
 * Pool entry'leri için internal shape:
 *   {
 *     id: number,
 *     session: EaiwsSession,
 *     currentItemId: string|null,  // entry üzerinde en son insert/operate
 *                                  // edilen article'ın itemId'si (affinity
 *                                  // map ile koordineli güncellenir).
 *     leasedAt: number,            // şu anki lease başlangıç zamanı (ms).
 *     lastUsedAt: number,          // idle timeout için son kullanım zamanı.
 *     broken: boolean,             // health check / release-time invalid.
 *     inUse: boolean,
 *   }
 */

/**
 * Lease objesi — caller `runWithSession[ForItem]` veya direct `lease()`
 * üzerinden alır. `release()` idempotent (çoklu call güvenli).
 *
 * `currentItemId` per-entry state'i wrapping — getter entry'den okur,
 * setter entry'ye yazar VE pool affinity map'ini günceller (yalnızca
 * `getArticleData` tarafı yeni article insert ettiğinde set eder; diğer
 * method'lar tipik olarak read-only kullanır).
 */
class Lease {
  constructor(pool, entry) {
    this._pool = pool;
    this._entry = entry;
    this.id = ++_leaseIdCounter;
    // `session` hot-path'te erişim için doğrudan referans olarak expose
    // edilir; lease iade edildikten sonra bu referansı kullanmak undefined
    // behavior (entry başka bir lease tarafından alınmış olabilir).
    this.session = entry.session;
    this._released = false;
  }

  get currentItemId() {
    return this._entry.currentItemId;
  }

  set currentItemId(value) {
    this._entry.currentItemId = value;
    if (value != null && value !== "") {
      this._pool._registerAffinity(value, this._entry.id);
    }
  }

  release() {
    if (this._released) return;
    this._released = true;
    this._pool._releaseEntry(this._entry);
  }
}

export class PconSessionPool {
  constructor({ size = 1, idleTimeoutMs = 300_000 } = {}) {
    this.maxSize = Math.max(1, Number(size) || 1);
    this.idleTimeoutMs = Math.max(0, Number(idleTimeoutMs) || 0);

    this.entries = [];
    /** @type {Array<{resolve:Function,reject:Function,preferEntryId?:number,timeout:any,enqueuedAt:number}>} */
    this.queue = [];
    /** @type {Map<string, number>} itemId → entryId. */
    this.affinity = new Map();

    // Yeni gatekeeper session açma işlemleri serialized — N parallel
    // `_createGatekeeperSession()` rate-limit'e takılabilir (kritik güvenlik
    // ilkesi #5). Promise chain ile sıraya alıyoruz.
    this._connectingChain = Promise.resolve();
    this._healthInterval = null;
    this._stopped = false;

    if (this.maxSize > 1) {
      console.warn(
        `[pcon-pool] Pool size ${this.maxSize} (>1) is EXPERIMENTAL — itemId affinity is best-effort; affinity-miss falls into route's "stale itemId → re-insert" path.`,
      );
    }

    this._startHealthCheck();
  }

  // ─────────────────────────── Public API ───────────────────────────

  /**
   * @param {object|null} timer Faz 0 perf-logger timer (opsiyonel).
   * @param {object} [opts]
   * @param {number} [opts.preferEntryId] itemId affinity map'inden gelen ipucu.
   * @returns {Promise<Lease>}
   */
  async lease(timer = null, opts = {}) {
    if (this._stopped) {
      throw new Error("PconSessionPool: pool has been shut down");
    }

    const acquireStart = timer ? performance.now() : 0;
    const entry = await this._acquireEntry(timer, opts);

    entry.inUse = true;
    entry.leasedAt = Date.now();

    if (timer) {
      try {
        timer.markRaw("lease.acquire", performance.now() - acquireStart);
      } catch {
        /* telemetry must not throw */
      }
    }

    return new Lease(this, entry);
  }

  /**
   * Convenience wrapper: lease + auto-release in finally.
   *
   * @template T
   * @param {object|null} timer
   * @param {(lease: Lease) => Promise<T>} fn
   * @returns {Promise<T>}
   */
  async runWithSession(timer, fn) {
    const lease = await this.lease(timer);
    try {
      return await fn(lease);
    } finally {
      lease.release();
    }
  }

  /**
   * itemId affinity ile lease + auto-release.
   *
   * Affinity hit (pool size > 1 ve daha önce `getArticleData` bu itemId'yi
   * bir entry'ye yazmış) → aynı session reuse edilir (state-ful).
   * Affinity miss → herhangi bir idle session leased; caller "unknown item
   * id" alırsa route stale-itemId pattern'i ile re-insert eder.
   *
   * Pool size 1 modunda (default) affinity trivial: tek session her itemId
   * için → bu wrapper effectively `runWithSession` ile aynı davranır.
   *
   * @template T
   * @param {string|null|undefined} itemId
   * @param {object|null} timer
   * @param {(lease: Lease) => Promise<T>} fn
   * @returns {Promise<T>}
   */
  async runWithSessionForItem(itemId, timer, fn) {
    const opts = {};
    if (itemId != null && itemId !== "") {
      const eid = this.affinity.get(itemId);
      if (eid !== undefined) opts.preferEntryId = eid;
    }
    const lease = await this.lease(timer, opts);
    try {
      return await fn(lease);
    } finally {
      lease.release();
    }
  }

  /**
   * @returns {{size:number, maxSize:number, inUse:number, idle:number, broken:number, pendingLeases:number}}
   */
  stats() {
    let inUse = 0;
    let idle = 0;
    let broken = 0;
    for (const e of this.entries) {
      if (e.broken) broken++;
      else if (e.inUse) inUse++;
      else idle++;
    }
    return {
      size: this.entries.length,
      maxSize: this.maxSize,
      inUse,
      idle,
      broken,
      pendingLeases: this.queue.length,
    };
  }

  /**
   * Tüm session'ları kapatır, health check'i durdurur, kuyruğu reject eder.
   * Test/teardown için. Production'da çağrılmaz.
   */
  async shutdown() {
    this._stopped = true;

    if (this._healthInterval) {
      clearInterval(this._healthInterval);
      this._healthInterval = null;
    }

    for (const item of this.queue) {
      try {
        clearTimeout(item.timeout);
      } catch {
        /* ignore */
      }
      try {
        item.reject(new Error("PconSessionPool: shutdown"));
      } catch {
        /* ignore */
      }
    }
    this.queue.length = 0;

    for (const entry of [...this.entries]) {
      try {
        if (entry.session?.isValid) entry.session.disconnect();
      } catch (err) {
        console.warn(
          `[pcon-pool] shutdown: disconnect entry ${entry.id} failed: ${err.message}`,
        );
      }
    }
    this.entries.length = 0;
    this.affinity.clear();
  }

  // ─────────────────────────── Internal ───────────────────────────

  /**
   * Acquire loop: prefer-idle → any-idle → create (capacity) → queue.
   *
   * @param {object|null} timer
   * @param {{preferEntryId?: number}} opts
   * @returns {Promise<object>} entry
   */
  async _acquireEntry(timer, opts = {}) {
    const preferEntryId = opts.preferEntryId;

    // Sonsuz döngü riskine karşı küçük bir loop guard — pratikte 2-3
    // iterasyon yeterli (idle pick → create → queue dispatch → return).
    for (let iter = 0; iter < 100; iter++) {
      if (this._stopped) {
        throw new Error("PconSessionPool: pool has been shut down");
      }

      // 1) Preferred idle.
      if (preferEntryId !== undefined) {
        const preferred = this.entries.find(
          (e) => e.id === preferEntryId && !e.inUse && !e.broken,
        );
        if (preferred) return preferred;
      }

      // 2) Any idle.
      const idle = this.entries.find((e) => !e.inUse && !e.broken);
      if (idle) return idle;

      // 3) Capacity → serialized create.
      if (this.entries.length < this.maxSize) {
        const created = await this._createSerialized();
        if (created) return created;
        continue;
      }

      // 4) Pool full → queue (FIFO, with timeout).
      return await this._enqueue(preferEntryId, timer);
    }

    throw new Error(
      "PconSessionPool: acquire loop exceeded — internal invariant broken",
    );
  }

  /**
   * Pool size altındaysa yeni bir session aç. Birden fazla `_acquireEntry`
   * concurrent çağrı yapsa bile gatekeeper request'leri sıralı kalır
   * (`_connectingChain` ile). Idle'a düşen veya kapasite biten durumlarda
   * `null` döner; caller döngüye geri yazar.
   */
  async _createSerialized() {
    const previous = this._connectingChain;
    let release = () => {};
    this._connectingChain = new Promise((r) => {
      release = r;
    });

    try {
      // Önceki create işleminin bitmesini bekle (rate limit'e takılmamak için).
      await previous;

      if (this._stopped) return null;
      // Race: bekleme süresince idle düştü ya da kapasite doldu mu?
      const idle = this.entries.find((e) => !e.inUse && !e.broken);
      if (idle) return null;
      if (this.entries.length >= this.maxSize) return null;

      const session = await this._doConnectOne();
      const entry = {
        id: ++_entryIdCounter,
        session,
        currentItemId: null,
        leasedAt: 0,
        lastUsedAt: Date.now(),
        broken: false,
        inUse: false,
      };
      this.entries.push(entry);
      return entry;
    } finally {
      release();
    }
  }

  async _enqueue(preferEntryId, timer) {
    const queueStart = timer ? performance.now() : 0;
    const entry = await new Promise((resolve, reject) => {
      const item = {
        resolve,
        reject,
        preferEntryId,
        enqueuedAt: Date.now(),
      };
      item.timeout = setTimeout(() => {
        const idx = this.queue.indexOf(item);
        if (idx >= 0) this.queue.splice(idx, 1);
        reject(
          new Error(
            `PconSessionPool: lease timeout after ${LEASE_QUEUE_TIMEOUT_MS}ms (pool full, no session freed up)`,
          ),
        );
      }, LEASE_QUEUE_TIMEOUT_MS);
      // Node ortamında setTimeout event-loop'u canlı tutar; pool teardown
      // sırasında process'in beklemesini istemiyoruz.
      if (typeof item.timeout.unref === "function") item.timeout.unref();
      this.queue.push(item);
    });

    if (timer) {
      try {
        timer.markRaw("lease.queueWait", performance.now() - queueStart);
      } catch {
        /* telemetry must not throw */
      }
    }

    return entry;
  }

  _releaseEntry(entry) {
    entry.inUse = false;
    entry.lastUsedAt = Date.now();

    if (entry.broken) {
      // Fire-and-forget close; queue dispatch kapanış sonrası yeni create
      // tetiklemek için gerekli.
      this._closeEntry(entry, "broken-on-release").finally(() => {
        this._dispatchQueue();
      });
      return;
    }

    this._dispatchQueue();
  }

  /**
   * Kuyrukta bekleyen lease'leri çalıştırılabilen herhangi bir entry'ye
   * dispatch et. Idle bulamazsa ve kapasite varsa, lazy create tetikler.
   */
  _dispatchQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0];

      let entry = null;
      if (item.preferEntryId !== undefined) {
        entry = this.entries.find(
          (e) => e.id === item.preferEntryId && !e.inUse && !e.broken,
        );
      }
      if (!entry) {
        entry = this.entries.find((e) => !e.inUse && !e.broken);
      }
      if (!entry) break;

      try {
        clearTimeout(item.timeout);
      } catch {
        /* ignore */
      }
      this.queue.shift();
      item.resolve(entry);
    }

    // Idle yok ama kapasite varsa (örn. broken eviction sonrası slot açıldı)
    // bir create tetikle — kuyruktaki ilk talebe bağla.
    if (this.queue.length > 0 && this.entries.length < this.maxSize) {
      const item = this.queue[0];
      this._createSerialized()
        .then((entry) => {
          if (!entry) {
            // Race: başka birinin create'i veya idle düşmesi öne geçti;
            // tekrar dispatch dene.
            this._dispatchQueue();
            return;
          }
          const idx = this.queue.indexOf(item);
          if (idx >= 0) {
            this.queue.splice(idx, 1);
            try {
              clearTimeout(item.timeout);
            } catch {
              /* ignore */
            }
            item.resolve(entry);
          } else {
            // Item artık kuyrukta değilse (timeout/cancel), entry'yi
            // başkasının kullanımına aç.
            this._dispatchQueue();
          }
        })
        .catch((err) => {
          const idx = this.queue.indexOf(item);
          if (idx >= 0) {
            this.queue.splice(idx, 1);
            try {
              clearTimeout(item.timeout);
            } catch {
              /* ignore */
            }
            item.reject(err);
          }
        });
    }
  }

  _registerAffinity(itemId, entryId) {
    if (itemId == null || itemId === "") return;
    this.affinity.set(itemId, entryId);
  }

  _evictAffinityFor(entryId) {
    for (const [itemId, eid] of this.affinity) {
      if (eid === entryId) this.affinity.delete(itemId);
    }
  }

  async _closeEntry(entry, reason) {
    const idx = this.entries.indexOf(entry);
    if (idx >= 0) this.entries.splice(idx, 1);
    this._evictAffinityFor(entry.id);
    entry.broken = true;
    try {
      if (entry.session?.isValid) entry.session.disconnect();
      console.log(
        `[pcon-pool] Closed entry ${entry.id} (${reason}); pool size now ${this.entries.length}/${this.maxSize}`,
      );
    } catch (err) {
      console.warn(
        `[pcon-pool] disconnect entry ${entry.id} (${reason}) failed: ${err.message}`,
      );
    }
  }

  // ──────────────────────── Health Check ────────────────────────

  _startHealthCheck() {
    if (this._healthInterval) return;
    this._healthInterval = setInterval(() => {
      this._healthCheck().catch((err) => {
        console.warn(`[pcon-pool] health check error: ${err.message}`);
      });
    }, HEALTH_CHECK_INTERVAL_MS);
    if (typeof this._healthInterval.unref === "function") {
      this._healthInterval.unref();
    }
  }

  async _healthCheck() {
    if (this._stopped) return;
    const now = Date.now();

    // Snapshot: iteration sırasında entries değişebilir (broken eviction).
    const snapshot = [...this.entries];

    for (const entry of snapshot) {
      if (entry.inUse || entry.broken) continue;

      // Idle timeout: aşıldıysa kapat (gatekeeper rate limit'i sürdürmemek
      // için kullanılmayan session'ları geri ver). Pool size 1 modunda
      // singleton tek session uzun süre idle olabilir; bu durumda da
      // timeout sonrası kapanır ve bir sonraki request lazy yeniden açar
      // (mevcut singleton davranışıyla uyumlu — singleton da disconnect
      // sonrası yeniden bağlanırdı).
      if (
        this.idleTimeoutMs > 0 &&
        entry.lastUsedAt > 0 &&
        now - entry.lastUsedAt > this.idleTimeoutMs
      ) {
        await this._closeEntry(entry, "idle-timeout");
        continue;
      }

      // Liveness ping. EAIWS `getCurrency` light-weight bir basket
      // operasyonu; sub-second tamamlanır. Hata fırlatırsa entry broken.
      try {
        if (!entry.session?.isValid) throw new Error("session.isValid=false");
        await entry.session.basket.getCurrency();
        entry.lastUsedAt = Date.now();
      } catch (err) {
        console.warn(
          `[pcon-pool] health check failed for entry ${entry.id}: ${err.message}`,
        );
        await this._closeEntry(entry, "health-check");
      }
    }
  }

  // ──────────────────────── Connection ────────────────────────

  async _createGatekeeperSession() {
    if (!GATEKEEPER_ID) {
      throw new Error("PCON_GATEKEEPER_ID environment variable is not set");
    }

    const url = `${GATEKEEPER_BASE_URL}/session/${GATEKEEPER_ID}`;
    const body = { locale: "en" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorId = errorData?.error?.id || "unknown";
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`Gatekeeper session failed [${errorId}]: ${errorMsg}`);
    }

    const data = await response.json();
    return {
      server: data.server,
      sessionId: data.sessionId,
      keepAliveInterval: data.keepAliveInterval,
    };
  }

  async _doConnectOne() {
    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      try {
        const gk = await this._createGatekeeperSession();
        const session = new EaiwsSession();
        const keepAliveMs = (gk.keepAliveInterval || 60) * 1000;
        const connected = session.connect(
          gk.server,
          gk.sessionId,
          keepAliveMs,
        );
        // Locale "en" — pcon-client::_doConnect ile aynı (geriye uyumluluk).
        // article-warmer kendi session'ını kuruyor ve PCON_LOCALE env'ini
        // kullanıyor; pool yolu o akıştan bağımsız.
        await session.basket.setLanguages("en");
        if (connected) {
          console.log(
            `[pcon-pool] Session connected. ID=${session.sessionId}; pool size now ${this.entries.length + 1}/${this.maxSize}`,
          );
          return session;
        }
        console.warn(
          `[pcon-pool] connect() returned false on attempt ${attempt}`,
        );
      } catch (err) {
        console.error(
          `[pcon-pool] Connect attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS} failed: ${err.message}`,
        );
      }
      if (attempt < MAX_RECONNECT_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, RECONNECT_DELAY_MS));
      }
    }
    throw new Error("Failed to connect to pCon EAIWS after all retry attempts");
  }
}

// TODO (Faz 7.5 — Per-article warm session, plan §581):
// Sık kullanılan article'lar için pool'dan bir entry'yi "sıcak" tutmak
// (article inserted, ready for setPropertyValue) → cache MISS'lerde
// gatekeeper round-trip + insert atlanır. Skeleton fikir:
//
//   pool.warmArticle(articleNumber, manufacturerId) →
//     1. lease one entry (preferEntryId yoksa).
//     2. insertOFMLArticle, set affinity, mark entry as "warm:<articleKey>"
//        (etiket — release sonrası başka request preferEntryId ipucuyla
//         aynı entry'ye yönelir).
//     3. release.
//
// Production'a alınmadan önce gatekeeper rate limit kontrolü, warm-set
// invalidation (article snapshot expire) ve warm-set boyut limiti
// gerekiyor. Faz 7'de implementasyon kapsam dışı (raporda not düşüldü).

export const sessionPool = new PconSessionPool({
  size: parseInt(process.env.PCON_SESSION_POOL_SIZE || "1", 10),
  idleTimeoutMs: parseInt(process.env.PCON_SESSION_IDLE_MS || "300000", 10),
});

export default sessionPool;
