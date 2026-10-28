/**
 * Calma Quote Edit köprüsü
 *
 * Kardeş app'in (`calma-pcon-ax-custom-app`, B2B Dealer Portal) "Edit Quote"
 * modalında bir satırın **"Edit configuration"** butonuna basıldığında dealer
 * bu ürünün PDP'sine yönlendirilir ve tarayıcıya iki kayıt yazılır
 * (quote-edit-session.js):
 *
 *   localStorage["calma_quote_line_edit_intent"] = JSON.stringify({
 *     quotationId: string,  // düzenlenen teklif satırının (Opportunity) id'si
 *     quoteNumber: string,  // "Q-2026-0012" (gösterim)
 *     customerId:  string,
 *     lineIndex:   number,  // çalışma kopyasındaki satır indeksi
 *     lineName:    string,
 *     returnUrl:   string,  // iş bitince dönülecek adres (portal + #quotations?edit=…)
 *     createdAt:   number,
 *     expiresAt:   number   // createdAt + 60 dk
 *   })
 *
 *   localStorage["calma_quote_edit_session_<quotationId>"] = JSON.stringify({
 *     quotationId, quoteNumber, customerId, baseVersion,
 *     items: [{ variant_id, quantity, properties, name, image, sku, url, edited? }],
 *     form, dirty, createdAt, updatedAt, expiresAt
 *   })
 *
 * Konfigüratör intent varsa:
 *   1. Satırın konfigürasyonunu geri yükler (saklı OBX → importObx; olmazsa
 *      `_pcon_full.properties` değerlerini uygular),
 *   2. "Add to Cart" yerine **"Update Quote Line"** sunar: yeni satır(lar)
 *      sepete DEĞİL, çalışma kopyasına yazılır (`replaceLine`) ve dealer
 *      `returnUrl`'e geri gönderilir. Revizyon, modalda "SAVE REVISION" ile
 *      tek seferde kaydedilir.
 *
 * Kardeş app'in embed'i sayfada ise `window.CalmaQuoteEdit` kullanılır; yoksa
 * aynı sözleşmeyle doğrudan localStorage'a düşülür.
 *
 * KEY/SHAPE/TTL kardeş app tarafından sahip — burada DEĞİŞTİRMEYİN.
 */

const INTENT_KEY = "calma_quote_line_edit_intent";
const SESSION_PREFIX = "calma_quote_edit_session_";
const PROXY_BASE = "/apps/b2b-portal";

function api() {
  if (typeof window === "undefined") return null;
  const a = window.CalmaQuoteEdit;
  return a && a.__loaded ? a : null;
}

function lsGet(key) {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function lsSet(key, value) {
  try {
    window.localStorage?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function lsRemove(key) {
  try {
    window.localStorage?.removeItem(key);
  } catch {
    /* storage kapalı */
  }
}

function safeParse(raw) {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : null;
  } catch {
    return null;
  }
}

/** Aktif "edit line" intent'i; süresi dolmuşsa null. */
export function getQuoteEditIntent() {
  if (typeof window === "undefined") return null;
  const a = api();
  if (a && typeof a.getIntent === "function") {
    try {
      return a.getIntent();
    } catch {
      /* fallback */
    }
  }
  const obj = safeParse(lsGet(INTENT_KEY));
  if (!obj || !obj.quotationId || typeof obj.expiresAt !== "number") return null;
  if (Date.now() > obj.expiresAt) {
    lsRemove(INTENT_KEY);
    return null;
  }
  return obj;
}

export function clearQuoteEditIntent() {
  if (typeof window === "undefined") return;
  const a = api();
  if (a && typeof a.clearIntent === "function") {
    try {
      a.clearIntent();
      return;
    } catch {
      /* fallback */
    }
  }
  lsRemove(INTENT_KEY);
}

/** Teklifin çalışma kopyası (unsaved working copy). */
export function getQuoteEditSession(quotationId) {
  if (typeof window === "undefined" || !quotationId) return null;
  const a = api();
  if (a && typeof a.getSession === "function") {
    try {
      return a.getSession(quotationId);
    } catch {
      /* fallback */
    }
  }
  const s = safeParse(lsGet(SESSION_PREFIX + quotationId));
  if (!s || !Array.isArray(s.items)) return null;
  if (typeof s.expiresAt === "number" && Date.now() > s.expiresAt) return null;
  return s;
}

/** Intent'in işaret ettiği satır (çalışma kopyasından). */
export function getQuoteEditLine(intent) {
  if (!intent) return null;
  const session = getQuoteEditSession(intent.quotationId);
  if (!session) return null;
  const idx = parseInt(intent.lineIndex, 10);
  if (!Number.isFinite(idx) || idx < 0 || idx >= session.items.length) return null;
  return session.items[idx] || null;
}

function bundleOf(props) {
  const id = props && props._bundle_id ? String(props._bundle_id) : "";
  const role = props && props._bundle_role ? String(props._bundle_role) : "";
  return { id, role: id ? role : "" };
}

/**
 * Çalışma kopyasındaki satırı yeni satır(lar)la değiştirir. Kardeş app API'si
 * varsa onunkini kullanır; yoksa aynı mantığı localStorage üzerinde uygular
 * (eski satırın bağlı child'ları — ücretsiz tabure — düşürülür, yeni satırlar
 * `edited: true` ile işaretlenir).
 *
 * @returns {object|null} güncellenmiş session; kopya yoksa null
 */
export function replaceQuoteEditLine(intent, newLines) {
  if (typeof window === "undefined" || !intent) return null;
  const a = api();
  if (a && typeof a.replaceLine === "function") {
    try {
      return a.replaceLine(intent.quotationId, intent.lineIndex, newLines);
    } catch (err) {
      console.warn("[quote-edit] CalmaQuoteEdit.replaceLine failed, using fallback:", err?.message || err);
    }
  }

  const key = SESSION_PREFIX + intent.quotationId;
  const session = safeParse(lsGet(key));
  if (!session || !Array.isArray(session.items)) return null;
  const idx = parseInt(intent.lineIndex, 10);
  if (!Number.isFinite(idx) || idx < 0 || idx >= session.items.length) return null;
  if (!Array.isArray(newLines) || !newLines.length) return null;

  const old = session.items[idx];
  const oldBundle = bundleOf(old?.properties);
  const stamped = newLines.map((ln, i) => {
    const copy = { ...ln, edited: true };
    if (i === 0 && old) {
      if (!copy.name && old.name) copy.name = old.name;
      if (!copy.image && old.image) copy.image = old.image;
      if (!copy.sku && old.sku) copy.sku = old.sku;
      if (!copy.url && old.url) copy.url = old.url;
    }
    return copy;
  });

  const next = [];
  session.items.forEach((it, i) => {
    if (i === idx) {
      next.push(...stamped);
      return;
    }
    const b = bundleOf(it?.properties);
    if (oldBundle.id && b.role === "child" && b.id === oldBundle.id) return;
    next.push(it);
  });

  const now = Date.now();
  const out = {
    ...session,
    items: next,
    dirty: true,
    updatedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };
  return lsSet(key, JSON.stringify(out)) ? out : null;
}

/**
 * Saklı .obx dosyasını kardeş app'ten çeker (`GET /obx/file`). Satırın
 * `_obxFileId` damgası ya da taze `_obxURL`'i ile aranır. Dosya yoksa /
 * süpürülmüşse null döner — çağıran `_pcon_full` fallback'ine geçer.
 *
 * @returns {Promise<Blob|null>}
 */
export async function fetchStoredObx({ customerId, fileId, url }) {
  if (!customerId || (!fileId && !url)) return null;
  const params = new URLSearchParams({ logged_in_customer_id: String(customerId) });
  if (fileId) params.set("fileId", String(fileId));
  if (url) params.set("url", String(url));
  try {
    const res = await fetch(`${PROXY_BASE}/obx/file?${params.toString()}`, {
      headers: { Accept: "application/octet-stream" },
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return blob && blob.size > 0 ? blob : null;
  } catch (err) {
    console.warn("[quote-edit] stored OBX fetch failed:", err?.message || err);
    return null;
  }
}

/**
 * Yeni konfigürasyonun kısa ömürlü pCon OBX linkini kardeş app'e kopyalatır
 * (`POST /obx/capture`). Satır sepete girmediği için storefront'un
 * obx-capture.js'i bunu göremez; revizyon kaydedilene kadar link ölmesin
 * diye burada hemen yakalatılır. Best-effort — hata akışı kesmez.
 */
export async function captureObxUrl(customerId, obxUrl) {
  if (!customerId || !obxUrl) return null;
  try {
    const res = await fetch(`${PROXY_BASE}/obx/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged_in_customer_id: String(customerId), urls: [obxUrl] }),
    });
    const data = await res.json().catch(() => null);
    return data?.captured?.[obxUrl] || null;
  } catch (err) {
    console.warn("[quote-edit] OBX capture failed:", err?.message || err);
    return null;
  }
}

/** Intent'te returnUrl yoksa kullanılacak varsayılan dönüş adresi. */
export function quoteEditReturnUrl(intent) {
  if (intent?.returnUrl) return intent.returnUrl;
  return "/pages/dealer-portal#quotations?edit=" + encodeURIComponent(intent?.quotationId || "");
}
