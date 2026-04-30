/**
 * Shopify cart helpers
 *
 * Cart `properties` objesi backend'de `cart-builder.server.js` tarafından
 * üretilir, ancak şu üç alan her cart-add'de yeniden hesaplanmalıdır:
 *
 *   - `_request_id`  → her sepete-ekleme için unique ID (PCON-XXXXXXXXXXXXXXXX)
 *   - `_basket_id`   → her sepete-ekleme için unique UUID
 *   - `_quantity`    → kullanıcının o anda seçtiği adet (string)
 *
 * Bu alanlar Redis cache'ine girmemeli; aksi halde aynı konfigürasyon
 * tekrar sepete eklendiğinde sahte bir aynı request_id ile gelir ve
 * downstream (CRM, sipariş işleme) uniqueness varsayımı kırılır.
 */

const REQUEST_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const REQUEST_ID_LENGTH = 16;

export function generateRequestId() {
  let id = "PCON-";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(REQUEST_ID_LENGTH);
    crypto.getRandomValues(buf);
    for (let i = 0; i < REQUEST_ID_LENGTH; i++) {
      id += REQUEST_ID_CHARS[buf[i] % REQUEST_ID_CHARS.length];
    }
  } else {
    for (let i = 0; i < REQUEST_ID_LENGTH; i++) {
      id += REQUEST_ID_CHARS[Math.floor(Math.random() * REQUEST_ID_CHARS.length)];
    }
  }
  return id;
}

export function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122 v4 fallback
  const buf = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 16; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}

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
