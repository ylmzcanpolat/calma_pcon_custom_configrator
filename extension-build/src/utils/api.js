// Init/update endpoint'leri pCon EAIWS'e proxy yapıyor: ilk (cold) MISS'te
// pCon round-trip + property mapping ~5-10s sürebilir. Shopify App Proxy
// 30sn timeout sınırı içinde maksimum buffer veriyoruz; backend Draco gibi
// pahalı işlemleri bilinçli olarak fire-and-forget arka plana atıyor ki bu
// timeout tetiklenmesin.
const DEFAULT_TIMEOUT = 30000;
// Cart payload endpoint EAIWS'te 2-3 round-trip yapar (setProperties + asset
// gen); GLTF üreten update endpoint kadar ağır olabiliyor.
const CART_PAYLOAD_TIMEOUT = 30000;

const hasPerf =
  typeof performance !== "undefined" && typeof performance.now === "function";

function nowMs() {
  return hasPerf ? performance.now() : Date.now();
}

/**
 * Faz 0 telemetry: response payload'una **non-enumerable** `__perfMeta`
 * iliştir. Mevcut çağıranlar JSON yapısını destructure ederken bu alanı
 * görmez (Object.keys/for-in dışında); store + addToCart akışı tamamen
 * geriye uyumlu. Yalnızca telemetry recorder'ları `data.__perfMeta` ile
 * okuyabilir.
 *
 * Şekli:
 *   data.__perfMeta = {
 *     totalMs: 845.3,         // network + parse fetch süresi
 *     serverTiming: "cache;dur=12.3, eaiws.setProp;dur=520.1, total;dur=830.4"
 *   }
 *
 * NOT: Geriye uyumluluk için response shape'i değişmiyor (bkz.
 * `pconFetchWithMeta` aşağıda — ihtiyaç olursa typed wrapper).
 */
function attachPerfMeta(data, meta) {
  if (!data || typeof data !== "object") return data;
  try {
    Object.defineProperty(data, "__perfMeta", {
      value: meta,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  } catch {
    // Frozen object vs.; sessizce geç.
  }
  return data;
}

export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || DEFAULT_TIMEOUT,
  );

  const t0 = nowMs();

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${response.status}`);
    }

    // Server-Timing'i body parse'tan ÖNCE oku — header'lar response'a aittir,
    // body'yi consume etmemize gerek yok.
    const serverTiming = response.headers.get("Server-Timing") || null;

    const json = await response.json();
    const totalMs = Math.round((nowMs() - t0) * 100) / 100;

    return attachPerfMeta(json, { totalMs, serverTiming });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Açık tipli wrapper: data + meta'yı ayrı alanlarda döner. Faz 0'da store
 * `pconFetch` üzerinden gidip `__perfMeta`'yı non-enumerable olarak okuyor;
 * bu fonksiyon ileride sample/analytics modüllerinin gizli alana ihtiyaç
 * duymadan kullanabilmesi için public alternatif.
 */
export async function pconFetchWithMeta(proxyBase, endpoint, options = {}) {
  const data = await pconFetch(proxyBase, endpoint, options);
  const perfMeta = data && data.__perfMeta ? data.__perfMeta : null;
  return { data, perfMeta };
}

export function initArticle(proxyBase, articleNumber, manufacturerId) {
  const params = new URLSearchParams({ articleNumber });
  if (manufacturerId) params.set("manufacturerId", manufacturerId);
  return pconFetch(proxyBase, `/api/pcon/init?${params}`);
}

/**
 * Faz 4 — `dirtyKeys` parametresi eklendi (default `[]`).
 *
 * Backend Faz 2 `pcon-proxy.api.pcon.update.jsx` body'de `dirtyKeys: string[]`
 * arar; uzunluk === 1 ise material-patch path'ine sapar (flag-ON). Flag OFF
 * iken ekstra alan zararsızdır (backend `Array.isArray` kontrolüyle yutar).
 *
 * `dirtyKeys` opsiyonel: argument geçmeyen eski caller'lar (örn. test fixture
 * veya `applyUrlProperties`) tamamen geriye uyumlu davranır.
 */
export function updateProperties(
  proxyBase,
  properties,
  itemId,
  articleNumber,
  manufacturerId,
  dirtyKeys = [],
) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties,
      itemId,
      articleNumber,
      manufacturerId,
      dirtyKeys,
    }),
  });
}

/**
 * Cart-add anında çağrılır. Backend EAIWS'ten fresh asset URL'leri
 * (`_attachment`, `_obx_url`, `_reopen_url`, `_article_image`) çekip,
 * `_request_id` ve `_basket_id`'i de generate ederek, Shopify
 * `cart/add.js`'e POST edilebilecek **tam** `cartProperties` objesini
 * döner. Frontend bunu olduğu gibi cart payload'a gömer.
 */
export function fetchCartPayload(proxyBase, body) {
  return pconFetch(proxyBase, "/api/pcon/cart-payload", {
    method: "POST",
    body: JSON.stringify(body),
    timeout: CART_PAYLOAD_TIMEOUT,
  });
}
