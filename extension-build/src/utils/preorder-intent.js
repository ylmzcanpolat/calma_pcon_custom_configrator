/**
 * Calma Preorder Intent köprüsü
 *
 * Kardeş app (`calma-pcon-ax-custom-app`, B2B Dealer Portal) preorder
 * sayfasında "+ Add Product" butonuna basıldığında dealer'ın tarayıcısına
 * şu shape'te bir intent kaydı yazıyor:
 *
 *   localStorage["calma_preorder_intent"] = JSON.stringify({
 *     draftOrderId:   string,   // numeric Shopify Draft Order ID
 *     draftOrderName: string,   // "#D1234"
 *     createdAt:      number,   // ms epoch
 *     expiresAt:      number    // createdAt + 10 dk
 *   })
 *
 * Aynı shop origin'inde olduğumuz için configurator bu kaydı okuyup
 * "Add to Cart" akışını dallandırabilir: intent varsa ürün sepete değil
 * doğrudan açık preorder'a (Shopify Draft Order) eklenir.
 *
 * Kardeş app banner app embed'i theme'de enable ise `window.CalmaPreorderIntent`
 * global'i otomatik yüklenir. Yoksa direkt localStorage fallback'i kullanılır.
 *
 * KEY/SHAPE/TTL kardeş app tarafından sahip — burada DEĞİŞTİRMEYİN.
 */

const STORAGE_KEY = "calma_preorder_intent";

/**
 * Aktif intent'i döner; expired ise sessizce siler ve null döner.
 * Banner app embed'i mevcutsa onun helper'ını kullanır (cross-tab tutarlılık),
 * yoksa direkt localStorage'tan okur.
 */
export function getPreorderIntent() {
  if (typeof window === "undefined") return null;

  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get === "function") {
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
      // Banner global hatalı; localStorage fallback'ine düş.
    }
  }

  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (
      !obj ||
      typeof obj.expiresAt !== "number" ||
      Date.now() > obj.expiresAt
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}

/**
 * Intent'i siler. Banner global'i varsa banner UI'ını da kaldırır
 * (`CalmaPreorderIntent.clear()` her ikisini birden yapar).
 */
export function clearPreorderIntent() {
  if (typeof window === "undefined") return;

  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear === "function") {
    try {
      window.CalmaPreorderIntent.clear();
      return;
    } catch {
      // Fallback'e düş.
    }
  }

  try {
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Storage kapalıysa sessiz geç.
  }
}

/**
 * PDP'deki dealer'ın Shopify customer id'sini bulur. Tema bazen kendi
 * global'ini inject eder (`window.SHOPIFY_CUSTOMER_ID`); bunun fallback'i
 * her Shopify mağazasında bulunan `ShopifyAnalytics.meta.page.customerId`.
 *
 * `null` döndüğünde backend `verifyDealerAccess` zaten reject eder; configurator
 * panik yapmamalı, hata mesajı dealer'a gösterilir.
 */
export function getCustomerId() {
  if (typeof window === "undefined") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const id = window.ShopifyAnalytics?.meta?.page?.customerId;
  return id != null ? String(id) : null;
}

/**
 * Preorder draft order'a satır ekleme endpoint'inin URL'i. Shopify App Proxy
 * locale-agnostic çalışır, bu yüzden `routesRoot` prefix'i kullanılmaz —
 * her dilde root'tan başlar.
 */
const PREORDER_ADD_LINE_URL = "/apps/b2b-portal/preorder/add-line";

/**
 * Açık preorder'a (Draft Order) satır ekler. Body kontratı kardeş app'in
 * `POST /apps/b2b-portal/preorder/add-line` endpoint'i ile birebir aynıdır;
 * `_Configuration_Price` numeric ise backend bunu `priceOverride`'a çevirir,
 * geri kalan key'ler `customAttributes` olarak draft order line item'a yazılır.
 *
 * Hata response'larında ya {error: string, [details]} ya da network/parse
 * hatası dönebilir. Caller her iki vakayı da yakalayıp dealer'a uygun
 * mesaj göstermeli — burada throw etmiyoruz, response objesini olduğu gibi
 * dönüyoruz ki caller `data.error` kontrolü yapabilsin.
 */
export async function postPreorderAddLine(body) {
  const res = await fetch(PREORDER_ADD_LINE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Endpoint nadiren HTML hata sayfası dönebilir; sessizce yut.
  }

  if (!payload) {
    return {
      error: `Preorder add-line failed (HTTP ${res.status})`,
    };
  }

  return payload;
}
