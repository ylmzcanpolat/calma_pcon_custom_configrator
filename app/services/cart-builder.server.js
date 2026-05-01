/**
 * Cart properties builder
 *
 * Storefront `<configurator>/Add to Cart` butonu, Shopify `cart/add.js`
 * endpoint'ine birebir aynı `properties` objesini göndermek zorundadır
 * (mağazanın CRM/sipariş işleme tarafı bu key'lere göre çalışıyor).
 *
 * Bu modül EAIWS'ten gelen ham `articleData` + `choiceLists`'ten,
 * eski 3. parti middleware'in ürettiği `finalProperties` formatını üretir.
 *
 * İki aşamalı yapı:
 *
 *  1. **Static portion** — `buildCartProperties(articleData, choiceLists)`.
 *     Legacy `finalProperties` ile birebir aynı **anahtar sırasında**, ama
 *     dinamik (cache'lenemeyen) alanlar için boş placeholder'lar üretir.
 *     Bu obje Redis'te uzun süreli (24h) cache'lenir.
 *
 *  2. **Dynamic merge** — `mergeCartAssets(staticCart, runtime)`.
 *     Cart-add anında çağrılır. Boş placeholder'ları gerçek değerlerle
 *     doldurur:
 *       - `_request_id`, `_basket_id`           → her cart-add için unique
 *       - `_quantity`                           → kullanıcının seçtiği adet
 *       - `_attachment`, `_obx_url`, `_reopen_url`,
 *         `_article_image`                      → EAIWS session'ından fresh
 *
 * JS objelerinde insertion order korunur; placeholder'ı sonradan overwrite
 * etmek anahtar pozisyonunu değiştirmez. Bu sayede final payload **legacy
 * ile birebir aynı sırada** üretilir.
 *
 * Anahtar sırası (legacy `finalProperties` payload'undan):
 *
 *   _description, _request_id, _quantity, _unit, _Configuration_Price,
 *   _currency, _vendormat, _Configuration, _cust_field1..5, _ext_quote_id,
 *   _service, _leadtime, _ext_quote_item, _contract_item, _manufactcode,
 *   _manufactmat, _ext_product_id, _matgroup, _vendor, _contract,
 *   _priceunit, _attachment, _attachment_purpose, _item_type, _parent_id,
 *   _article_image, _eco, _eco_info, _obx_url, _oci_plugin, _priceservice,
 *   _reopen_url, _taxcode, _vat, _ean, _basket_id, _seriesid,
 *   _additional_text, _special_model_info, divider 1, ...visible props...
 *
 * VAT, fiyatın KDV-dahil portion'ından geri hesaplanır. Vergi oranı, vergi
 * kodu, reopen URL parametreleri env var'dan okunur.
 */

import { randomBytes, randomUUID } from "node:crypto";
import { HIDDEN_PROPERTY_IDS } from "./property-mapper.server.js";

const TAX_RATE = parseFloat(process.env.PCON_TAX_RATE || "0.19");
const TAX_CODE = process.env.PCON_TAX_CODE || "DE";

// Reopen URL config — legacy middleware ile uyumlu olması için pCon UI base
// + flag'ler sabit; gatekeeper ID ve hook URL env'den okunur. Bu URL
// kullanıcı sepete ekledikten sonra konfigürasyonu PCON UI'da yeniden
// açabilmesi için CRM'in saklayıp linklediği bir yapıdır.
const REOPEN_UI_BASE =
  process.env.PCON_REOPEN_UI_BASE || "https://ui.pcon-solutions.com/";
const REOPEN_LANG = process.env.PCON_REOPEN_LANG || "en";
const REOPEN_GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";
const REOPEN_HOOK_URL = process.env.PCON_REOPEN_HOOK_URL || "";

const REQUEST_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const REQUEST_ID_LENGTH = 16;

/**
 * Legacy middleware'in ürettiği "PCON-XXXXXXXXXXXXXXXX" formatında 16 karakterli
 * uppercase alphanumeric request id üretir. Crypto-grade rastgelelik kullanır
 * (Math.random değil); CRM tarafının uniqueness varsayımı korunur.
 */
export function generateRequestId() {
  const buf = randomBytes(REQUEST_ID_LENGTH);
  let id = "PCON-";
  for (let i = 0; i < REQUEST_ID_LENGTH; i++) {
    id += REQUEST_ID_CHARS[buf[i] % REQUEST_ID_CHARS.length];
  }
  return id;
}

/**
 * Legacy `_basket_id` formatı: RFC4122 v4 UUID. Node 14.17+ standart
 * `crypto.randomUUID()` kullanılır.
 */
export function generateBasketId() {
  return randomUUID();
}

/**
 * EAIWS articleData + choiceLists'ten Shopify cart `properties` objesinin
 * **statik portion'ını** üretir. Dinamik alanlar (`_request_id`,
 * `_basket_id`, `_quantity`, `_attachment`, `_obx_url`, `_reopen_url`,
 * `_article_image`) boş string olarak placeholder edilir; bunlar
 * `mergeCartAssets()` ile cart-add anında doldurulur.
 *
 * Anahtar sırası `finalProperties` legacy payload'unun aynısıdır.
 */
export function buildCartProperties(articleData, choiceLists) {
  if (!articleData) return null;

  const baseArticleNumber = articleData.baseArticleNumber || "";
  const manufacturerId = articleData.manufacturerId || "";
  const seriesId = articleData.seriesId || "";
  const currency =
    articleData.currency || articleData.salesCurrency || "";
  const price =
    articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;
  const shortText = articleData.shortText || "";
  const catalogImage = articleData.catalogImage || "";

  const vat = computeVatPortion(price, TAX_RATE);

  // Anahtar sırası önemli — legacy `finalProperties` ile birebir aynı.
  // Boş placeholder'lar `mergeCartAssets` tarafından overwrite edilir.
  const out = {
    _description: shortText,
    _request_id: "",
    _quantity: "",
    _unit: "ST",
    _Configuration_Price: formatPrice(price, 3),
    _currency: currency,
    _vendormat: baseArticleNumber,
    _Configuration: shortText,
    _cust_field1: "",
    _cust_field2: "",
    _cust_field3: "",
    _cust_field4: "",
    _cust_field5: "",
    _ext_quote_id: "",
    _service: "",
    _leadtime: "",
    _ext_quote_item: "",
    _contract_item: "",
    _manufactcode: manufacturerId,
    _manufactmat: "",
    _ext_product_id: baseArticleNumber,
    _matgroup: "",
    _vendor: "",
    _contract: "",
    _priceunit: "1",
    _attachment: "",
    _attachment_purpose: "C",
    _item_type: "R",
    _parent_id: "",
    _article_image: catalogImage,
    _eco: "0",
    _eco_info: "Gross Eco Contribution",
    _obx_url: "",
    _oci_plugin: "true",
    _priceservice: "false",
    _reopen_url: "",
    _taxcode: TAX_CODE,
    _vat: formatPrice(vat, 2),
    _ean: baseArticleNumber,
    _basket_id: "",
    _seriesid: seriesId,
    _additional_text: "",
    _special_model_info: "",
  };

  const visible = buildVisibleProperties(articleData, choiceLists);
  for (const [key, value] of Object.entries(visible)) {
    out[key] = value;
  }

  return out;
}

/**
 * Static cartProperties üzerine dinamik alanları yazar. Yeni bir obje
 * dönerek immutability sağlar (caller cached static cart'ı bozmasın).
 *
 * Boş bırakılan alanlar atlanır — örneğin `articleImageUrl` verilmezse
 * cached static `_article_image` korunur.
 */
export function mergeCartAssets(staticCart, runtime = {}) {
  if (!staticCart) return null;

  const out = { ...staticCart };

  if (runtime.requestId) out._request_id = runtime.requestId;
  if (runtime.basketId) out._basket_id = runtime.basketId;
  if (runtime.quantity != null) out._quantity = String(runtime.quantity);

  if (runtime.attachmentUrl) out._attachment = runtime.attachmentUrl;
  if (runtime.obxUrl) out._obx_url = runtime.obxUrl;
  if (runtime.articleImageUrl) out._article_image = runtime.articleImageUrl;

  // Reopen URL ya direkt verilir ya da OBX URL'den construct edilir.
  if (runtime.reopenUrl) {
    out._reopen_url = runtime.reopenUrl;
  } else if (runtime.obxUrl) {
    out._reopen_url = buildReopenUrl(runtime.obxUrl);
  }

  return out;
}

/**
 * PCON UI'ın "reopen configuration" linkini üretir. Legacy URL şablonu:
 *
 *   https://ui.pcon-solutions.com/#GATEKEEPER_ID=...&lang=en&sp=true&hde=true
 *     &asi=false&msi=true&san=true&ssi=false&HOOK_URL=...&obx=...
 *
 * Sıra önemli: legacy CRM'in dictionaries için key sırasını koruyabildiği
 * varsayımıyla aynen kopyalıyoruz. URL fragment kullanır (`#` sonrası), bu
 * yüzden URLSearchParams ile encode edip `?` yerine `#` ile birleştiriyoruz.
 */
export function buildReopenUrl(obxUrl, opts = {}) {
  const base = (opts.base || REOPEN_UI_BASE).replace(/\/+$/, "");
  const gatekeeperId = opts.gatekeeperId || REOPEN_GATEKEEPER_ID;
  const hookUrl = opts.hookUrl || REOPEN_HOOK_URL;
  const lang = opts.lang || REOPEN_LANG;

  const params = new URLSearchParams();
  if (gatekeeperId) params.set("GATEKEEPER_ID", gatekeeperId);
  params.set("lang", lang);
  params.set("sp", "true");
  params.set("hde", "true");
  params.set("asi", "false");
  params.set("msi", "true");
  params.set("san", "true");
  params.set("ssi", "false");
  if (hookUrl) params.set("HOOK_URL", hookUrl);
  if (obxUrl) params.set("obx", obxUrl);

  return `${base}/#${params.toString()}`;
}

function buildVisibleProperties(articleData, choiceLists) {
  const props = articleData.properties || [];
  const propertyClasses = articleData.propertyClasses || [];

  const choiceMap = new Map();
  for (const cl of choiceLists || []) {
    choiceMap.set(`${cl.propClass}.${cl.propName}`, cl.values || []);
  }

  const classDescMap = new Map();
  for (const pc of propertyClasses) {
    if (!pc?.name) continue;
    classDescMap.set(pc.name, pc.description || pc.name);
  }

  // Müşteriye gösterilen property'ler: konfiguratör UI'da görünenlerle
  // birebir aynı küme. `editable && visible && choiceList` olanlar.
  const visibleProps = props.filter(
    (p) =>
      p.visible &&
      p.editable &&
      p.choiceList &&
      !HIDDEN_PROPERTY_IDS.has(`${p.propClass}.${p.propName}`),
  );

  const groupOrder = [];
  const groupMap = new Map();
  for (const p of visibleProps) {
    if (!groupMap.has(p.propClass)) {
      groupMap.set(p.propClass, []);
      groupOrder.push(p.propClass);
    }
    groupMap.get(p.propClass).push(p);
  }

  const out = {};
  let dividerIndex = 0;

  for (const className of groupOrder) {
    const groupProps = groupMap.get(className);
    if (!groupProps || groupProps.length === 0) continue;

    dividerIndex++;
    const dividerLabel = classDescMap.get(className) || className;
    out[`divider ${dividerIndex}`] = dividerLabel;

    for (const p of groupProps) {
      const baseLabel =
        (p.propText || `${p.propClass}.${p.propName}`).trim() ||
        `${p.propClass}.${p.propName}`;

      const currentValue = p.value?.value ?? "";
      let displayValue = "";

      if (currentValue !== "" && currentValue !== null && currentValue !== undefined) {
        const choices =
          choiceMap.get(`${p.propClass}.${p.propName}`) || [];
        const selected = choices.find((c) => c.value === currentValue);
        displayValue = (selected?.text ?? currentValue ?? "").toString();
      }

      // Aynı `propText`'e sahip iki farklı property olabilir; ikinci ve
      // sonraki tekrarları " (2)", " (3)" ... ile ayır. Aksi halde aynı
      // key tekrar yazılınca ilk değer kaybolur.
      let key = baseLabel;
      let suffix = 1;
      while (Object.prototype.hasOwnProperty.call(out, key)) {
        suffix++;
        key = `${baseLabel} (${suffix})`;
      }

      out[key] = displayValue;
    }
  }

  return out;
}

function computeVatPortion(price, taxRate) {
  if (!price || price <= 0 || !taxRate || taxRate <= 0) return 0;
  // Fiyat KDV-dahil kabul edilir; net = price / (1 + rate), vat = price - net
  const net = price / (1 + taxRate);
  return price - net;
}

function formatPrice(value, decimals) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.00";
  return num.toFixed(decimals);
}
