/**
 * Configurator API helpers — WCF migrasyonu sonrası.
 *
 * init ve update backend endpoint'leri artık kullanılmıyor (WCF client-side
 * property yönetimini hallediyor). Sadece cart-payload endpoint'i kalıyor:
 * pCon OBX/attachment URL'lerini backend EAIWS session'ıyla üretir.
 */

const CART_PAYLOAD_TIMEOUT = 30000;

const hasPerf =
  typeof performance !== "undefined" && typeof performance.now === "function";

function nowMs() {
  return hasPerf ? performance.now() : Date.now();
}

/**
 * Genel fetch helper: timeout + JSON error parse.
 */
export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || 30000,
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

    const json = await response.json();
    const _totalMs = Math.round((nowMs() - t0) * 100) / 100;
    return json;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Cart-add anında çağrılır. Backend EAIWS'ten fresh asset URL'leri
 * (`_attachment`, `_obx_url`, `_reopen_url`, `_article_image`) çekip
 * tam `cartProperties` objesini döner.
 *
 * WCF migrasyonuyla itemId artık null gönderilir — backend yeni session açar.
 */
export function fetchCartPayload(proxyBase, body) {
  return pconFetch(proxyBase, "/api/pcon/cart-payload", {
    method: "POST",
    body: JSON.stringify(body),
    timeout: CART_PAYLOAD_TIMEOUT,
  });
}
