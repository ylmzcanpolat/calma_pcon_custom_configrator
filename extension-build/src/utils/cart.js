/**
 * Shopify cart helpers
 *
 * `cartProperties` payload'u (legacy `finalProperties` ile birebir uyumlu)
 * backend'in `/api/pcon/cart-payload` endpoint'inde üretilir. `_request_id`,
 * `_basket_id`, `_attachment`, `_obx_url`, `_reopen_url`, `_article_image`
 * — hepsi server-side generate edilir; frontend bunları olduğu gibi
 * Shopify `cart/add.js` body'sine gömer. Bu modül sadece HTTP wrapper'ı
 * ve drawer cart event'lerini içerir.
 */

/**
 * `cart/add.js` endpoint'inin tam URL'ini üretir. Multi-locale store'larda
 * Liquid `routes.root_url` `/en`, `/de` gibi prefix verir; bunun başına
 * `cart/add.js` getiriyoruz. Bootloader'ın `data-routes-root`'unu öncelikli
 * kullan; runtime'da `window.Shopify.routes.root` mevcutsa onu da deneriz
 * (theme tarafından sonradan set edilen tek kaynaklı runtime değer).
 */
export function getCartAddUrl(routesRoot) {
  let root =
    (typeof window !== "undefined" && window.Shopify?.routes?.root) ||
    routesRoot ||
    "/";
  if (!root.endsWith("/")) root += "/";
  return root + "cart/add.js";
}

/**
 * Shopify cart/add.js'e POST atar. Hata durumunda Shopify'ın döndürdüğü
 * `{ status, message, description }` yapısını parse edip okunabilir bir
 * Error fırlatır. Ağ/zaman aşımı hataları da yakalanır.
 */
export async function postCartAdd(routesRoot, items) {
  const url = getCartAddUrl(routesRoot);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ items }),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Bazı temalarda 422 sonrası HTML response dönebiliyor; sessizce yut.
  }

  if (!res.ok) {
    const message =
      payload?.description ||
      payload?.message ||
      `Add to cart failed (HTTP ${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

/**
 * Drawer cart'ı yenilemek için yaygın kullanılan event'leri dispatch eder.
 * Dawn ve türevi temaların çoğu en az birini dinler. `cart:refresh` çoğu
 * custom drawer entegrasyonu için, `cart:open` drawer'ı görünür hale
 * getirmek için, `cart:added` Dawn benzeri sistemler için yedek event'tir.
 */
export function dispatchCartUpdateEvents(payload) {
  if (typeof document === "undefined") return;
  const detail = payload || null;
  document.dispatchEvent(
    new CustomEvent("cart:refresh", { bubbles: true, detail }),
  );
  document.dispatchEvent(
    new CustomEvent("cart:added", { bubbles: true, detail }),
  );
  document.dispatchEvent(
    new CustomEvent("cart:open", { bubbles: true, detail }),
  );
  // Bazı temalar Shopify section api ile çalışan publish-subscribe pattern
  // kullanır; bunu da en güvenli generic isimle deniyoruz.
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail }));
  }
}
