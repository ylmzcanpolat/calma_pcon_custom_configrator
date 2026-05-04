// Init/update endpoint'leri pCon EAIWS'e proxy yapıyor: ilk (cold) MISS'te
// pCon round-trip + property mapping ~5-10s sürebilir. Shopify App Proxy
// 30sn timeout sınırı içinde maksimum buffer veriyoruz; backend Draco gibi
// pahalı işlemleri bilinçli olarak fire-and-forget arka plana atıyor ki bu
// timeout tetiklenmesin.
const DEFAULT_TIMEOUT = 30000;
// Cart payload endpoint EAIWS'te 2-3 round-trip yapar (setProperties + asset
// gen); GLTF üreten update endpoint kadar ağır olabiliyor.
const CART_PAYLOAD_TIMEOUT = 30000;

export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || DEFAULT_TIMEOUT,
  );

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

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export function initArticle(proxyBase, articleNumber, manufacturerId) {
  const params = new URLSearchParams({ articleNumber });
  if (manufacturerId) params.set("manufacturerId", manufacturerId);
  return pconFetch(proxyBase, `/api/pcon/init?${params}`);
}

export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({ properties, itemId, articleNumber, manufacturerId }),
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
