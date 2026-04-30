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
 * Üç bölümden oluşur:
 *
 *  1. **Underscore'lu meta key'ler** — sepette müşteriye görünmez,
 *     sipariş/CRM tarafında işlenir. Çoğu `articleData`'dan türer
 *     (`shortText`, `baseArticleNumber`, `manufacturerId`, `seriesId`,
 *     `catalogImage`, `pdSalesPrice`, `currency`). Bir kısmı sabittir
 *     (`_unit`, `_priceunit`, `_attachment_purpose`, `_item_type` vb.) —
 *     legacy middleware ile uyumluluk için aynen tutulur. `_request_id`,
 *     `_basket_id`, `_quantity` ve gerekirse `_obx_url`/`_attachment` gibi
 *     dinamik alanlar burada üretilmez; her biri cart-add anında frontend
 *     tarafından eklenir (cache'e dondurulmamaları için).
 *
 *  2. **Divider'lar** — Shopify cart UI'da görsel başlık görevi gören
 *     `divider 1`, `divider 2` ... key'leridir. EAIWS'ten gelen
 *     `propertyClasses` listesine göre, görünür/editable property'lerin
 *     ait olduğu sınıfların açıklamaları kullanılır.
 *
 *  3. **Müşteriye görünür property'ler** — `propText` → seçili choice'un
 *     `text` değerinin map'lenmesi. EAIWS'in görünür kıldığı her editable
 *     property burada listelenir; bu sayede konfiguratör UI'da görünenle
 *     sepette listelenen birebir aynı olur.
 *
 * VAT, fiyatın KDV-dahil portion'ından geri hesaplanır. Vergi oranı ve
 * vergi kodu env var'dan okunur (`PCON_TAX_RATE`, `PCON_TAX_CODE`).
 */

import { HIDDEN_PROPERTY_IDS } from "./property-mapper.server.js";

const TAX_RATE = parseFloat(process.env.PCON_TAX_RATE || "0.19");
const TAX_CODE = process.env.PCON_TAX_CODE || "DE";

const STATIC_META = {
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
  _manufactmat: "",
  _matgroup: "",
  _vendor: "",
  _contract: "",
  _priceunit: "1",
  _unit: "ST",
  _attachment: "",
  _attachment_purpose: "C",
  _item_type: "R",
  _parent_id: "",
  _eco: "0",
  _eco_info: "Gross Eco Contribution",
  _obx_url: "",
  _oci_plugin: "true",
  _priceservice: "false",
  _reopen_url: "",
  _additional_text: "",
  _special_model_info: "",
};

/**
 * EAIWS articleData + choiceLists'ten Shopify cart `properties` objesinin
 * statik portion'ını üretir. `_request_id`, `_basket_id` ve `_quantity`
 * frontend'de cart-add anında eklenir.
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

  const meta = {
    _description: shortText,
    _Configuration_Price: formatPrice(price, 3),
    _currency: currency,
    _vendormat: baseArticleNumber,
    _Configuration: shortText,
    _manufactcode: manufacturerId,
    _ext_product_id: baseArticleNumber,
    _article_image: catalogImage,
    _taxcode: TAX_CODE,
    _vat: formatPrice(vat, 2),
    _ean: baseArticleNumber,
    _seriesid: seriesId,
    ...STATIC_META,
  };

  const visible = buildVisibleProperties(articleData, choiceLists);

  return { ...meta, ...visible };
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
