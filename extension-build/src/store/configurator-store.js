/**
 * Configurator store — WCF (@easterngraphics/wcf) tabanlı.
 *
 * Mimari kararlar:
 *   - WCF Application/Session/ArticleManager/propMap module-level değişkenlerde
 *     tutulur: Zustand state'ine koymak bu objeler değiştikçe gereksiz
 *     re-render tetikler.
 *   - Zustand store sadece UI state (properties, price, loading, cart) tutar.
 *   - ConfiguratorScene.jsx WCF lifecycle'ı yönetir (mount/unmount/cleanup)
 *     ve hazır olduğunda `setWcfReady` / `setWcfError` ile store'u günceller.
 *   - `updateProperty` store action'ı WCF setValue → getProperties zincirini
 *     çalıştırır; Three.js, GLB indirme, backend round-trip yoktur.
 *   - Cart akışı değişmez: backend `/api/pcon/cart-payload` hala pCon OBX/
 *     attachment URL'leri üretir. itemId artık null (backend yeni session açar).
 */

import { create } from "zustand";
// fetchCartPayload: backend round-trip yolu — WCF direkt akışında kullanılmıyor
// import { fetchCartPayload } from "../utils/api.js";
import { readUrlProperties, writeUrlProperties } from "../utils/url-sync.js";
import { postCartAdd, dispatchCartUpdateEvents } from "../utils/cart.js";
import {
  getPreorderIntent,
  clearPreorderIntent,
  getCustomerId,
  postPreorderAddLine,
} from "../utils/preorder-intent.js";

// ─── Module-level WCF state (Zustand dışında — re-render tetiklemez) ─────────

/** @type {import("@easterngraphics/wcf/modules/cf").ArticleElement | null} */
let _wcfArticle = null;

/** @type {import("@easterngraphics/wcf/modules/cf").ArticleManager | null} */
let _wcfArticleManager = null;

/**
 * propId → raw WCF property ref.
 * `setValue` çağrısı için saklanır; her getProperties() sonrası güncellenir.
 * @type {Map<string, object>}
 */
let _wcfPropMap = new Map();

// ─── Cart property category helpers ───────────────────────────────────────

/**
 * WCF property id'sindeki anahtar kelimelerden mantıksal kategori çıkarır.
 * Kategori adları Shopify cart properties'teki "divider" başlıkları olarak kullanılır.
 *
 * Ürün-bağımsız genel kelimeler (DUVAR=wall, MASA=table, HALI=carpet/floor)
 * yanında ek pattern'ler de gerekirse buraya eklenebilir.
 */
function getPropertyCategory(propId) {
  const u = (propId || "").toUpperCase();
  if (u.includes("DUVAR"))    return "WALL";
  if (u.includes("MASA"))     return "TABLE";
  if (u.includes("HALI"))     return "FLOOR";
  if (u.includes("TAVAN") || u.includes("SPRINKLER")) return "CEILING";
  if (u.includes("MONITOR") || u.includes("EKRAN") || u.includes("SCREEN"))
    return "SCREEN MOUNT";
  return "GENERAL";
}

/** Kategorilerin istenen görünüm sırası */
const CATEGORY_ORDER = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR",
];

/**
 * PropertySelector'da gösterilecek property'lerin sabit sıralaması.
 * Bu listede yer alan ID'ler her zaman en başta, buradaki sırayla gösterilir.
 * Listede yer almayan property'ler pCon'dan gelen orijinal sıralarıyla
 * bu property'lerin ardından eklenir.
 */
const PROPERTY_ORDER = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL",
];

/**
 * PropertySelector'da GÖSTERİLMEYECEK property ID'leri.
 * Bu ID'ler mapWcfProperties aşamasında filtrelenir; UI'da görünmez.
 */
const HIDDEN_FROM_UI = new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR",
]);

/**
 * UI'dan gizlenen ama sepet payload'ına ZORLA eklenmesi gereken property'ler.
 * Her entry: { id, propLabel, value, displayLabel }
 *   - propLabel   : cart'ta görünecek property adı (human-readable)
 *   - value       : WCF'e / pCon'a gönderilecek ham değer
 *   - displayLabel: cart'ta görünecek seçim etiketi
 */
const HIDDEN_CART_FORCED = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO",
  },
];

// ─── Property mapping helpers ──────────────────────────────────────────────

/**
 * WCF raw property listesini choices ile birlikte yükler ve
 * PropertySelector'ın beklediği formata dönüştürür.
 *
 * @param {object[]} rawProps - article.getProperties() çıktısı
 * @returns {Promise<object[]>} - { id, label, type, editable, currentValue, options }
 */
async function mapWcfProperties(rawProps) {
  if (!Array.isArray(rawProps)) return [];

  const editableChoiceProps = rawProps.filter(
    (r) =>
      r.visible !== false &&
      r.editable !== false &&
      r.choiceList &&
      !HIDDEN_FROM_UI.has(r.key),
  );

  const choiceResults = await Promise.all(
    editableChoiceProps.map((r) =>
      typeof r.getChoices === "function"
        ? r.getChoices().catch(() => [])
        : Promise.resolve([]),
    ),
  );

  const mapped = editableChoiceProps.map((raw, i) => {
    const choices = choiceResults[i] || [];
    const currentVal = typeof raw.getValue === "function" ? raw.getValue() : null;

    return {
      id: raw.key,
      label: raw.name,
      type: choices.some((c) => c.largeIcon || c.smallIcon) ? "color" : "text",
      editable: true,
      currentValue: currentVal?.value ?? null,
      options: choices.map((c) => ({
        value: c.value,
        label: c.text,
        // Swatch UI'da ~40–96px gösterildiği için önce küçük ikonu tercih
        // ediyoruz; largeIcon (bazen ~1MB) yalnızca smallIcon yoksa fallback.
        // İkonlar WCF choiceList'inden her oturumda taze geldiği için pCon
        // tarafındaki değişiklikler kullanıcıya anında yansımaya devam eder.
        icon: c.smallIcon || c.largeIcon || null,
        available: c.selectable !== false,
      })),
    };
  });

  // PROPERTY_ORDER listesindeki ID'ler önce, tanımlı sırayla gelir.
  // Listede bulunmayanlar pCon'dan gelen orijinal sıralarını koruyarak arkaya eklenir.
  const orderMap = new Map(PROPERTY_ORDER.map((id, idx) => [id, idx]));
  return mapped.sort((a, b) => {
    const ai = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
    const bi = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
    if (ai !== bi) return ai - bi;
    // Her ikisi de listede yoksa orijinal pCon sırası korunur (sort stable)
    return 0;
  });
}

/**
 * WCF article'dan fiyat okur.
 *
 * YÖ1: getCompositeCalculation() — pricing procedure kuruluysa tüm fiyat
 *      detaylarını verir. Procedure yoksa "no active pricing procedure"
 *      exception fırlatır; ayrı try/catch ile yakalanır, YÖ2'ye geçilir.
 *
 * YÖ2: getItemProperties().article.salesPrice — pricing procedure olmadan
 *      da çalışır; temel satış fiyatını döndürür.
 *
 * KRİTİK: Her method kendi try/catch bloğundadır. Böylece YÖ1 exception
 * fırlatsa bile YÖ2 her zaman denenir.
 *
 * @param {object} article - WCF ArticleElement
 * @returns {Promise<{ price: number|null, currency: string }>}
 */
async function fetchWcfPrice(article) {
  if (!article) return { price: null, currency: "EUR" };

  const mainArticle =
    typeof article.getMainArticle === "function"
      ? (article.getMainArticle() ?? article)
      : article;

  // YÖ1 — getCompositeCalculation (pricing procedure kuruluysa çalışır)
  // Ayrı try/catch: exception fırlatırsa YÖ2'ye geçilir.
  try {
    if (typeof mainArticle.getCompositeCalculation === "function") {
      const calc = await mainArticle.getCompositeCalculation();
      const moneyObj = calc?.grossPrice ?? calc?.netPrice ?? calc?.salesPrice;
      if (moneyObj?.value != null) {
        return {
          price: moneyObj.value,
          currency: moneyObj.currency || "EUR",
        };
      }
    }
  } catch (err) {
    console.warn("[wcf] getCompositeCalculation failed (falling back to getItemProperties):", err?.message || err);
  }

  // YÖ2 — getItemProperties (pricing procedure olmadan da çalışır)
  // Ayrı try/catch: YÖ1'den bağımsız olarak her zaman denenir.
  try {
    if (typeof mainArticle.getItemProperties === "function") {
      const itemProps = await mainArticle.getItemProperties?.();
      const art = itemProps?.article;
      if (art?.salesPrice != null) {
        return {
          price: art.salesPrice,
          currency: art.salesCurrency || "EUR",
        };
      }
    }
  } catch (err) {
    console.warn("[wcf] getItemProperties failed:", err?.message || err);
  }

  console.warn("[wcf] price could not be determined — both methods failed");
  return { price: null, currency: "EUR" };
}

/**
 * Shopify cart line item property'lerini (divider yapısı dahil) üretir.
 *
 * Bu fonksiyon hem `addToCart` (gerçek /cart/add.js çağrısı) hem de
 * `addToQuoteList` (window.CalmaQuoteList.addItem) tarafından kullanılır.
 * Böylece teklif listesine eklenen `properties` objesi, sepete eklenen
 * obje ile BİREBİR aynı olur — bu, draft order'a dönüşürken
 * _Configuration_Price / _currency gibi alanların tutarlı kalması için
 * kritiktir.
 *
 * @param {object} args
 * @param {object[]} args.properties     - store.properties (mapWcfProperties çıktısı)
 * @param {number|null} args.price       - WCF fiyatı
 * @param {string} args.currency
 * @param {string} args.articleNumber
 * @param {string} args.manufacturerId
 * @param {number} args.safeQuantity     - normalize edilmiş pozitif tam sayı
 * @returns {Record<string, string>} Shopify line item properties
 */
function buildShopifyProperties({
  properties,
  price,
  currency,
  articleNumber,
  manufacturerId,
  safeQuantity,
}) {
  // ── Konfigürasyon bölümü ─────────────────────────────────────────────────
  // Property'ler önce kategoriye göre gruplandırılır (GENERAL, WALL, TABLE…),
  // ardından her kategori için TEK bir "divider N" eklenir; o kategoriye ait
  // tüm property'ler ardı ardına sıralanır.
  //
  //   "divider 1": "GENERAL"
  //   "CALMA":     "CALMA SMALL - 100X110"
  //   "PLUG":      "UK PLUG"
  //   "divider 2": "WALL"
  //   "COLOUR OF INTERIOR FELT": "FLT02 - Light Grey"
  //   ...
  //
  // currentValue ham WCF kodu (örn. "m_100_110"); options listesinden
  // eşleşen label'ı buluruz (örn. "CALMA SMALL - 100X110").

  // Adım 1 — properties'i kategorilere göre grupla
  const grouped = new Map(); // category → [{label, selectedLabel}]
  const configDescParts = [];

  for (const p of properties) {
    if (p.currentValue == null || p.currentValue === "") continue;
    const cat = getPropertyCategory(p.id);
    if (!grouped.has(cat)) grouped.set(cat, []);
    const selectedOption = (p.options || []).find(
      (o) => o.value === p.currentValue,
    );
    const selectedLabel = selectedOption?.label || String(p.currentValue);
    grouped.get(cat).push({ label: p.label, selectedLabel });
    configDescParts.push(selectedLabel);
  }

  // Adım 1b — UI'dan gizlenen ama sepet payload'ına zorla eklenmesi gereken
  // property'leri (HIDDEN_CART_FORCED) uygun kategorilerine dahil et.
  for (const forced of HIDDEN_CART_FORCED) {
    const cat = getPropertyCategory(forced.id);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push({
      label: forced.propLabel,
      selectedLabel: forced.displayLabel,
    });
    configDescParts.push(forced.displayLabel);
  }

  // Adım 2 — CATEGORY_ORDER önce, ardından tanımsız kategoriler
  const orderedCats = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  // Adım 3 — divider çiftlerini oluştur (kategori başına 1 divider)
  const configDividers = {};
  let dividerIdx = 1;

  for (const cat of orderedCats) {
    const items = grouped.get(cat);
    if (!items || items.length === 0) continue;
    configDividers[`divider ${dividerIdx}`] = cat;
    dividerIdx++;
    for (const { label, selectedLabel } of items) {
      configDividers[label] = selectedLabel;
    }
  }

  // _description / _Configuration: "articleNumber / manufacturerId — cfg1 / cfg2"
  const descStr = [
    articleNumber,
    manufacturerId || null,
    ...configDescParts.slice(0, 2),
  ]
    .filter(Boolean)
    .join(" / ");

  // ── Shopify cart properties — tam format ─────────────────────────────────
  // Önce sabit/sistem alanları, ardından konfigürasyon divider çiftleri.
  // _attachment, _article_image, _obx_url, _reopen_url: backend EAIWS
  // round-trip gerektirir; şimdilik boş — gerektiğinde entegre edilir.
  return {
    _description: descStr,
    _quantity: String(safeQuantity),
    _unit: "ST",
    _Configuration_Price: price != null ? String(price) : "",
    _currency: currency || "EUR",
    _vendormat: articleNumber || "",
    _Configuration: descStr,
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
    _manufactcode: manufacturerId || "",
    _manufactmat: "",
    _ext_product_id: articleNumber || "",
    _matgroup: "",
    _vendor: "",
    _contract: "",
    _priceunit: "1",
    _attachment: "",
    _attachment_purpose: "C",
    _item_type: "R",
    _parent_id: "",
    _article_image: "",
    _eco: "0",
    _eco_info: "Gross Eco Contribution",
    _obx_url: "",
    _oci_plugin: "true",
    _priceservice: "false",
    _reopen_url: "",
    _taxcode: "",
    _vat: "",
    _ean: articleNumber || "",
    _basket_id: "",
    _seriesid: "",
    _additional_text: "",
    _special_model_info: "",
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...configDividers,
  };
}

/**
 * Shopify variant ID'sini saf sayısal forma indirger.
 * "gid://shopify/ProductVariant/1234567890" → "1234567890"
 * "1234567890" → "1234567890"
 *
 * @param {string|number|null} variantId
 * @returns {string} sadece sayısal variant id (bulunamazsa "")
 */
function toNumericVariantId(variantId) {
  if (variantId == null) return "";
  const str = String(variantId);
  const match = str.match(/(\d+)\s*$/);
  return match ? match[1] : "";
}

// ─── URL sync helpers ──────────────────────────────────────────────────────

function syncCurrentToUrl(properties) {
  const map = {};
  for (const p of properties) {
    if (p.currentValue) map[p.id] = p.currentValue;
  }
  writeUrlProperties(map);
}

// ─── Store ─────────────────────────────────────────────────────────────────

const useConfiguratorStore = create((set, get) => ({
  // ── Config (initialize() tarafından set edilir) ──────────────────────────
  proxyBase: "",
  gatekeeperId: "",
  articleNumber: "",
  manufacturerId: "",
  currency: "TRY",
  customIcons: {},
  variantId: null,
  routesRoot: "/",
  addToCartLabel: "Add to Cart",
  successAction: "drawer-event",
  // null → metafield yok veya customer login değil → discount gösterilmez
  discountPercentage: null,
  productTitle: "",
  productImageUrl: "",
  productSku: "",
  customerName: "",

  // ── UI State ─────────────────────────────────────────────────────────────
  loading: false,
  updating: false,
  error: null,
  properties: [],
  price: null,

  // ── Cart State ────────────────────────────────────────────────────────────
  // null = henüz hazır değil (buton disabled), {} = WCF article yüklendi (hazır)
  cartProperties: null,
  quantity: 1,
  cartLoading: false,
  cartError: null,
  cartSuccess: false,

  // ── Quote List State (window.CalmaQuoteList — mağaza tarafı API) ──────────
  // quoteLoading: addItem çağrısı sırasında butonu kilitler
  // quoteSuccess: kısa "Teklif listesine eklendi" geri bildirimi
  // quoteError  : API yoksa / hata olursa kullanıcıya gösterilir
  quoteLoading: false,
  quoteError: null,
  quoteSuccess: false,

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: initialize — App.jsx'ten config alınır, ConfiguratorScene
  // tetiklenir (loading: true seti). Asıl WCF başlatma ConfiguratorScene'de.
  // ────────────────────────────────────────────────────────────────────────
  initialize(config) {
    set({
      proxyBase: config.proxyBase,
      gatekeeperId: config.gatekeeperId || "",
      articleNumber: config.articleNumber,
      manufacturerId: config.manufacturerId,
      currency: config.currency,
      customIcons: config.customIcons || {},
      variantId: config.variantId || null,
      routesRoot: config.routesRoot || "/",
      addToCartLabel: config.addToCartLabel || "Add to Cart",
      successAction: config.successAction || "drawer-event",
      discountPercentage: config.discountPercentage ?? null,
      productTitle: config.productTitle || "",
      productImageUrl: config.productImageUrl || "",
      productSku: config.productSku || "",
      customerName: config.customerName || "",
      loading: true,
      error: null,
      properties: [],
      price: null,
      cartProperties: null,
    });
  },

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: refreshWcfPrice — eventArticleChanged listener ve dışarıdan
  // fiyat yenilenmesi için. Mevcut price null ise veya pricing procedure
  // hazır olduğunda tekrar çağrılır.
  // ────────────────────────────────────────────────────────────────────────
  async refreshWcfPrice() {
    if (!_wcfArticle) return;
    try {
      const priceData = await fetchWcfPrice(_wcfArticle);
      if (priceData?.price != null) {
        set({
          price: priceData.price,
          currency: priceData.currency || get().currency,
        });
      }
    } catch (err) {
      console.warn("[store] refreshWcfPrice failed:", err?.message || err);
    }
  },

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfReady — ConfiguratorScene WCF yüklemeyi tamamladığında
  // çağırır; article ve propMap module-level değişkenlere yazılmış olmalı.
  // ────────────────────────────────────────────────────────────────────────
  async setWcfReady(article, articleManager, rawProps) {
    _wcfArticle = article;
    _wcfArticleManager = articleManager;
    _wcfPropMap = new Map(rawProps.map((r) => [r.key, r]));

    const priceData = await fetchWcfPrice(article).catch(() => ({
      price: null,
      currency: "EUR",
    }));

    const mapped = await mapWcfProperties(rawProps).catch(() => []);
    const customIcons = get().customIcons;
    const properties = applyCustomIcons(mapped, customIcons);

    // ─── pCon / WCF property debug logs ─────────────────────────────────────
    console.group("[pCon] Properties — raw (WCF)");
    console.log("rawProps count:", rawProps.length);
    console.table(
      rawProps.map((r) => ({
        key: r.key,
        name: r.name,
        visible: r.visible,
        editable: r.editable,
        hasChoiceList: !!r.choiceList,
        value: typeof r.getValue === "function" ? r.getValue()?.value : "(n/a)",
      })),
    );
    console.groupEnd();

    console.group("[pCon] Properties — mapped (store)");
    console.log("mapped count:", properties.length);
    console.table(
      properties.map((p) => ({
        id: p.id,
        label: p.label,
        type: p.type,
        currentValue: p.currentValue,
        optionCount: p.options?.length ?? 0,
      })),
    );
    console.log("[pCon] Full mapped properties (JSON):", JSON.stringify(properties, null, 2));
    console.groupEnd();
    // ─────────────────────────────────────────────────────────────────────────

    set({
      properties,
      price: priceData.price,
      currency: priceData.currency || get().currency,
      cartProperties: {}, // signal: WCF article hazır → cart butonu açılır
      loading: false,
    });

    // Not: ConfiguratorScene, setWcfReady bittikten hemen sonra
    // refreshWcfPrice() çağırır. Burada ek retry'a gerek yok.

    // URL'deki property override'larını uygula
    const urlProps = readUrlProperties();
    if (Object.keys(urlProps).length > 0) {
      for (const [propId, value] of Object.entries(urlProps)) {
        const currentProp = properties.find((p) => p.id === propId);
        if (currentProp && currentProp.currentValue !== value) {
          get()
            .updateProperty(propId, value)
            .catch((e) => console.warn("[store] URL prop apply failed:", e.message));
        }
      }
    } else {
      syncCurrentToUrl(properties);
    }
  },

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfError — ConfiguratorScene hata durumunda çağırır.
  // ────────────────────────────────────────────────────────────────────────
  setWcfError(err) {
    set({ error: err?.message || String(err), loading: false });
  },

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: updateProperty
  //
  // setValue() EAIWS sunucusunu günceller; BabylonJS sahne güncellemesi ise
  // eventArticleChanged ateşlenince tamamlanır.
  //
  // Race-condition fix: her iki koşul da gerçekleşene kadar bekle:
  //   1. setValue() promise'i resolve (EAIWS onayı)
  //   2. eventArticleChanged event'i (sahne güncellemesi tamamlandı)
  // Her ikisi birleşince getProperties() çağrılır → UI + sahne senkron.
  // ────────────────────────────────────────────────────────────────────────
  async updateProperty(key, value) {
    const rawProp = _wcfPropMap.get(key);
    if (!rawProp || typeof rawProp.setValue !== "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", key);
      return;
    }

    const { properties, customIcons } = get();

    // Optimistik güncelleme — seçim anında active görünür.
    const optimistic = properties.map((p) =>
      p.id === key ? { ...p, currentValue: value } : p,
    );
    set({ properties: optimistic, updating: true, error: null });
    syncCurrentToUrl(optimistic);

    try {
      // WCF'nin eventArticleChanged sistemi mevcut mu?
      const eventBus = _wcfArticleManager?.eventArticleChanged;
      const hasEventBus =
        eventBus && typeof eventBus.addListener === "function";

      // setValue() + eventArticleChanged'i birlikte bekle.
      // Eğer event sistemi yoksa sadece setValue() beklen.
      await new Promise((resolve, reject) => {
        let setValueDone = false;
        let articleChangedFired = !hasEventBus; // event yoksa önceden true
        let settled = false;

        // Güvenlik timeout'u — event hiç gelmezse yine ilerle.
        const timeoutId = setTimeout(() => {
          if (settled) return;
          settled = true;
          if (hasEventBus) eventBus.removeListener(onChanged);
          console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding");
          resolve();
        }, 10000);

        function tryResolve() {
          if (settled || !setValueDone || !articleChangedFired) return;
          settled = true;
          clearTimeout(timeoutId);
          resolve();
        }

        function onChanged() {
          eventBus.removeListener(onChanged);
          articleChangedFired = true;
          tryResolve();
        }

        if (hasEventBus) eventBus.addListener(onChanged);

        rawProp.setValue(value)
          .then(() => {
            setValueDone = true;
            tryResolve();
          })
          .catch((err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            if (hasEventBus) eventBus.removeListener(onChanged);
            reject(err);
          });
      });

      // Sahne güncellendikten sonra fresh properties ve fiyat al.
      if (!_wcfArticle) throw new Error("WCF article ref lost");

      const [rawProps, priceData] = await Promise.all([
        _wcfArticle.getProperties(),
        fetchWcfPrice(_wcfArticle),
      ]);

      // propMap'i güncelle — yeni raw ref'lerle
      _wcfPropMap = new Map(rawProps.map((r) => [r.key, r]));

      const mapped = await mapWcfProperties(rawProps);
      const updatedProps = applyCustomIcons(mapped, customIcons);

      set({
        properties: updatedProps,
        price: priceData.price,
        currency: priceData.currency || get().currency,
        updating: false,
      });
      syncCurrentToUrl(updatedProps);

      // ────────────────────────────────────────────────────────────────────
      // Render frame yedek garantisi — WCF on-demand rendering kullanır.
      // ConfiguratorScene içindeki eventArticleChanged listener'ı zaten
      // requestRenderFrame() çağırıyor, ancak event timeout'a düştüğü
      // (yukarıdaki 10s safety timeout'u) veya WCF event'i kaçırdığı
      // durumlarda listener tetiklenmez. Bu yedek çağrı, property update
      // tamamlandıktan sonra canvas'ın eski state'te kalmamasını garanti
      // eder. Multiple requestRenderFrame çağrıları WCF tarafından
      // deduplicate edilir (mRenderFrameRequested flag), zararsız.
      // ────────────────────────────────────────────────────────────────────
      try {
        _wcfArticleManager?.app?.viewer?.requestRenderFrame?.();
      } catch (_e) { /* viewer dispose edilmiş olabilir */ }
    } catch (err) {
      console.warn("[store] updateProperty revert:", err?.message || err);
      // Optimistik state'i geri al
      syncCurrentToUrl(properties);
      set({ properties, updating: false, error: err?.message || String(err) });
    }
  },

  // ─── No-op: WCF ile hover prefetch gerekmez (client-side, anında update) ─
  prefetchProperty() {},

  // ─── Cart actions ─────────────────────────────────────────────────────────

  setQuantity(qty) {
    const n = parseInt(qty, 10);
    set({ quantity: Number.isFinite(n) && n >= 1 ? n : 1 });
  },

  setVariantId(variantId) {
    if (!variantId) return;
    const current = get().variantId;
    if (String(current) === String(variantId)) return;
    set({ variantId: String(variantId), cartError: null, cartSuccess: false });
  },

  resetCartFeedback() {
    set({ cartError: null, cartSuccess: false });
  },

  resetQuoteFeedback() {
    set({ quoteError: null, quoteSuccess: false });
  },

  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: addToQuoteList — ürünü mağazanın "Teklif Listesi" API'sine ekler.
  //
  // window.CalmaQuoteList.addItem(...) çağrılır. Gönderilen `properties` objesi
  // addToCart() ile BİREBİR aynıdır (buildShopifyProperties) — teklif draft
  // order'a dönüştüğünde _Configuration_Price / _currency buradan okunur.
  //
  // Sepete ekleme YAPILMAZ, yönlendirme YAPILMAZ. Mağazadaki sağ-alt rozet
  // sayacı kendi kendine güncellenir.
  // ────────────────────────────────────────────────────────────────────────
  async addToQuoteList() {
    const {
      properties,
      price,
      currency,
      articleNumber,
      manufacturerId,
      quantity,
      variantId,
      productTitle,
      productImageUrl,
      productSku,
      loading,
      updating,
      cartProperties,
      quoteLoading,
    } = get();

    if (quoteLoading) return false;

    if (loading || updating) {
      set({ quoteError: "Configuration is still loading. Please wait." });
      return false;
    }

    if (!cartProperties) {
      set({ quoteError: "Configuration not ready. Please wait." });
      return false;
    }

    // API yoksa güvenli davran (bayi değil veya script yüklenmemiş).
    const api = typeof window !== "undefined" ? window.CalmaQuoteList : null;
    if (!api || typeof api.addItem !== "function") {
      set({
        quoteError:
          "Quote list is not available. Please make sure you are signed in as a dealer.",
      });
      return false;
    }

    const numericVariantId = toNumericVariantId(variantId);
    if (!numericVariantId) {
      set({
        quoteError:
          "Could not detect a product variant on this page. Please reload and try again.",
      });
      return false;
    }

    set({ quoteLoading: true, quoteError: null, quoteSuccess: false });

    const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

    // addToCart() ile birebir aynı properties objesi
    const shopifyProperties = buildShopifyProperties({
      properties,
      price,
      currency,
      articleNumber,
      manufacturerId,
      safeQuantity,
    });

    try {
      api.addItem({
        variant_id: numericVariantId,
        quantity: safeQuantity,
        properties: shopifyProperties,
        name: productTitle || articleNumber || null,
        image: productImageUrl || null,
        sku: productSku || articleNumber || null,
      });
      set({ quoteLoading: false, quoteSuccess: true });
      return true;
    } catch (err) {
      console.error("[Configurator] addToQuoteList error:", err);
      set({
        quoteLoading: false,
        quoteError: err?.message || "Failed to add to quote list.",
      });
      return false;
    }
  },

  /**
   * Cart-add akışı (iki dallı: normal ve preorder).
   *
   * Backend `/api/pcon/cart-payload` fresh OBX/attachment URL'leri üretir.
   * WCF ile itemId artık null — backend yeni EAIWS session açar ve current
   * property değerlerini uygular.
   */
  async addToCart(successOverride = null) {
    const {
      properties,
      price,
      currency,
      articleNumber,
      manufacturerId,
      quantity,
      variantId,
      routesRoot,
      successAction,
      cartLoading,
      updating,
      loading,
      cartProperties,
    } = get();

    if (cartLoading) return false;

    if (loading || updating) {
      set({ cartError: "Configuration is still loading. Please wait." });
      return false;
    }

    if (!cartProperties) {
      set({ cartError: "Configuration not ready. Please wait." });
      return false;
    }

    if (!variantId) {
      set({
        cartError:
          "Could not detect a product variant on this page. Please reload and try again.",
      });
      return false;
    }

    set({ cartLoading: true, cartError: null, cartSuccess: false });

    const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

    const shopifyProperties = buildShopifyProperties({
      properties,
      price,
      currency,
      articleNumber,
      manufacturerId,
      safeQuantity,
    });

    console.log(
      "[cart] Shopify cart/add.js payload:",
      JSON.stringify({ items: [{ id: variantId, quantity: safeQuantity, properties: shopifyProperties }] }, null, 2),
    );

    try {
      const preorderIntent = getPreorderIntent();

      if (preorderIntent) {
        const customerId = getCustomerId();
        let preorderResult;
        try {
          preorderResult = await postPreorderAddLine({
            logged_in_customer_id: customerId,
            draftOrderId: preorderIntent.draftOrderId,
            variantId,
            quantity: safeQuantity,
            properties: shopifyProperties,
          });
        } catch (err) {
          console.error("[Configurator] Preorder add-line error:", err);
          window.alert("❌ Could not add to preorder. Please try again.");
          set({ cartLoading: false });
          return false;
        }

        if (!preorderResult || preorderResult.error) {
          const detail = preorderResult?.error || "Unknown error";
          window.alert("❌ Could not add to preorder: " + detail);
          set({ cartLoading: false });
          return false;
        }

        const draftName =
          preorderResult.draftOrder?.name ||
          preorderIntent.draftOrderName ||
          "preorder";
        window.alert("✅ Product added to Preorder " + draftName);

        clearPreorderIntent();
        set({ cartLoading: false, cartSuccess: true });
        window.location.href =
          "/pages/b2b-account#preorder-" + preorderIntent.draftOrderId;
        return true;
      }

      // Normal mod — WCF properties doğrudan Shopify cart/add.js'e gönderilir.
      // Backend EAIWS round-trip yok: tam konfigürasyon zaten WCF state'inde.
      const items = [
        {
          id: variantId,
          quantity: safeQuantity,
          properties: shopifyProperties,
        },
      ];

      const cartPayload = await postCartAdd(routesRoot, items);
      set({ cartLoading: false, cartSuccess: true });

      // successAction'a göre post-add davranışı:
      // successOverride parametresi verilmişse o kullanılır (örn. guest modu),
      // yoksa store'daki successAction ayarı geçerlidir.
      //   drawer-event → drawer cart event'lerini dispatch et (Dawn ve türevleri)
      //   redirect      → /cart sayfasına yönlendir
      //   reload        → sayfayı yenile
      //   none          → hiçbir şey yapma
      const effectiveAction = successOverride ?? successAction;
      if (effectiveAction === "redirect") {
        window.setTimeout(() => {
          window.location.href =
            (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
        }, 0);
      } else if (effectiveAction === "reload") {
        window.setTimeout(() => window.location.reload(), 0);
      } else if (effectiveAction !== "none") {
        dispatchCartUpdateEvents(cartPayload);
      }
      return true;
    } catch (err) {
      set({
        cartLoading: false,
        cartError: err?.message || "Failed to add to cart",
      });
      return false;
    }
  },

  setLoading(loading) {
    set({ loading });
  },

  setError(error) {
    set({ error });
  },

  // ──────────────────────────────────────────────────────────────────────────
  // exportRequest — "Add to Request" butonu için Excel indirme aksiyonu.
  //
  // addToCart() ile aynı configDividers yapısını kullanır (fiyat hariç).
  // Gerçek cart-add yapılmaz; yalnızca xlsx dosyası oluşturulup indirilir.
  // ──────────────────────────────────────────────────────────────────────────
  async exportRequest() {
    const {
      properties,
      articleNumber,
      manufacturerId,
      quantity,
      productTitle,
      productImageUrl,
      customerName,
    } = get();

    const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

    // configDividers — addToCart() ile aynı kategori / divider mantığı
    const grouped = new Map();
    for (const p of properties) {
      if (p.currentValue == null || p.currentValue === "") continue;
      const cat = getPropertyCategory(p.id);
      if (!grouped.has(cat)) grouped.set(cat, []);
      const selectedOption = (p.options || []).find(
        (o) => o.value === p.currentValue,
      );
      const selectedLabel = selectedOption?.label || String(p.currentValue);
      grouped.get(cat).push({ label: p.label, selectedLabel });
    }

    for (const forced of HIDDEN_CART_FORCED) {
      const cat = getPropertyCategory(forced.id);
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat).push({
        label: forced.propLabel,
        selectedLabel: forced.displayLabel,
      });
    }

    const orderedCats = [
      ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
      ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
    ];

    const configDividers = {};
    let dividerIdx = 1;
    for (const cat of orderedCats) {
      const items = grouped.get(cat);
      if (!items || items.length === 0) continue;
      configDividers[`divider ${dividerIdx}`] = cat;
      dividerIdx++;
      for (const { label, selectedLabel } of items) {
        configDividers[label] = selectedLabel;
      }
    }

    try {
      const { exportToExcel } = await import("../utils/excel-export.js");
      await exportToExcel({
        articleNumber,
        manufacturerId,
        productTitle,
        productImageUrl,
        quantity: safeQuantity,
        customerName,
        configDividers,
      });
    } catch (err) {
      console.error("[exportRequest] Excel export failed:", err);
      window.alert("Excel export failed: " + (err?.message || String(err)));
    }
  },
}));

// ─── Custom icon override logic (aynen korundu) ───────────────────────────────

const SOCKET_PROPERTY_IDS = new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]);

const SOCKET_ICON_PATTERNS = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" },
];

const DIMENSION_PROPERTY_ID = "MT_TEXT.Meta_Dimension";

const DIMENSION_DEPENDENT_ICONS = {
  m_100_140: {
    "MEDIAWALL.MEDIAWALL": {
      false: "withoutMediawall",
      true: "withMediawall",
    },
    "KOLTUK_4U.KOLTUK": {
      false: "forUWithoutSofa",
      true: "forUWithSofa",
    },
  },
  m_100_220: {
    "KOLTUK.KOLTUK": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa",
    },
  },
  m_144_220: {
    "KOLTUK_L.KOLTUK": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa",
    },
  },
  m_188_220ALL: {
    "MASA_FA.MASA": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa",
    },
  },
};

function applyCustomIcons(properties, customIcons) {
  if (!customIcons || typeof customIcons !== "object") return properties;
  let result = applyVariantPickerIcons(properties, customIcons.variantPicker);
  result = applySocketIcons(result, customIcons.socket);
  result = applyContextualIcons(result, customIcons.contextual);
  return result;
}

let variantPickerLookup = null;
let variantPickerSource = null;

function getVariantPickerLookup(variantPicker) {
  if (variantPickerSource === variantPicker && variantPickerLookup) {
    return variantPickerLookup;
  }
  variantPickerSource = variantPicker;
  variantPickerLookup = new Map();
  if (variantPicker && typeof variantPicker === "object") {
    for (const [code, url] of Object.entries(variantPicker)) {
      if (!code || !url) continue;
      variantPickerLookup.set(normalizeCode(code), url);
    }
  }
  return variantPickerLookup;
}

function normalizeCode(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function applyVariantPickerIcons(properties, variantPicker) {
  const lookup = getVariantPickerLookup(variantPicker);
  if (lookup.size === 0) return properties;

  return properties.map((prop) => {
    let touched = false;
    const newOptions = prop.options.map((opt) => {
      if (opt.icon) return opt;
      const url = lookup.get(normalizeCode(opt.value));
      if (!url) return opt;
      touched = true;
      return { ...opt, icon: url };
    });
    if (!touched) return prop;
    return { ...prop, type: "color", options: newOptions };
  });
}

function applySocketIcons(properties, socketIcons) {
  if (!socketIcons) return properties;
  return properties.map((prop) => {
    if (!isSocketProperty(prop)) return prop;
    const newOptions = overrideSocketIcons(prop.options, socketIcons);
    const hasIcon = newOptions.some((o) => o.icon);
    return { ...prop, type: hasIcon ? "color" : prop.type, options: newOptions };
  });
}

function applyContextualIcons(properties, contextual) {
  if (!contextual) return properties;
  const dimensionProp = properties.find((p) => p.id === DIMENSION_PROPERTY_ID);
  const dimensionValue = dimensionProp?.currentValue;
  if (!dimensionValue) return properties;
  const ruleSet = DIMENSION_DEPENDENT_ICONS[dimensionValue];
  if (!ruleSet) return properties;

  return properties.map((prop) => {
    const optionRules = ruleSet[prop.id];
    if (!optionRules) return prop;
    const newOptions = prop.options.map((opt) => {
      const iconKey = optionRules[opt.value];
      const url = iconKey ? contextual[iconKey] : null;
      return url ? { ...opt, icon: url } : opt;
    });
    const hasIcon = newOptions.some((o) => o.icon);
    return { ...prop, type: hasIcon ? "color" : prop.type, options: newOptions };
  });
}

function isSocketProperty(prop) {
  if (!prop) return false;
  if (SOCKET_PROPERTY_IDS.has(prop.id)) return true;
  return /steckdose|socket|priz/i.test(prop.label || "");
}

function overrideSocketIcons(options, socketIcons) {
  if (!socketIcons || !Array.isArray(options)) return options;
  return options.map((opt) => {
    const customIcon = matchSocketIcon(opt, socketIcons);
    return customIcon ? { ...opt, icon: customIcon } : opt;
  });
}

function matchSocketIcon(opt, map) {
  const haystack = `${opt.value || ""} ${opt.label || ""}`.toLowerCase();
  for (const { keys, iconKey } of SOCKET_ICON_PATTERNS) {
    if (keys.some((k) => haystack.includes(k))) {
      return map[iconKey] || null;
    }
  }
  return null;
}

export default useConfiguratorStore;
