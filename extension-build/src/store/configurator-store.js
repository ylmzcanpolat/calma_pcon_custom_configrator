import { create } from "zustand";
import {
  initArticle,
  updateProperties,
  fetchCartPayload,
} from "../utils/api.js";
import { readUrlProperties, writeUrlProperties } from "../utils/url-sync.js";
import { postCartAdd } from "../utils/cart.js";

const responseCache = new Map();

function buildPropsCacheKey(properties) {
  const sorted = Object.keys(properties).sort();
  return sorted.map((k) => k + "=" + properties[k]).join("&");
}

const useConfiguratorStore = create((set, get) => ({
  gltfUrl: null,
  price: null,
  currency: "TRY",
  properties: [],
  loading: false,
  updating: false,
  error: null,

  proxyBase: "",
  articleNumber: "",
  manufacturerId: "",
  itemId: null,
  customIcons: {},

  // Cart state — addToCart için
  cartProperties: null,
  quantity: 1,
  variantId: null,
  routesRoot: "/",
  addToCartLabel: "Add to Cart",
  cartLoading: false,
  cartError: null,
  cartSuccess: false,

  async initialize(config) {
    set({
      proxyBase: config.proxyBase,
      articleNumber: config.articleNumber,
      manufacturerId: config.manufacturerId,
      currency: config.currency,
      customIcons: config.customIcons || {},
      variantId: config.variantId || null,
      routesRoot: config.routesRoot || "/",
      addToCartLabel: config.addToCartLabel || "Add to Cart",
      loading: true,
      error: null,
    });

    try {
      const data = await initArticle(
        config.proxyBase,
        config.articleNumber,
        config.manufacturerId,
      );

      const urlProps = readUrlProperties();
      let properties = data.properties || [];

      properties = properties.map((prop) => {
        if (urlProps[prop.id] !== undefined) {
          return { ...prop, currentValue: urlProps[prop.id] };
        }
        return prop;
      });

      properties = applyCustomIcons(properties, get().customIcons);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || config.currency,
        properties,
        itemId: data.itemId,
        cartProperties: data.cartProperties || null,
        loading: false,
      });

      const initProps = {};
      for (const p of properties) {
        if (p.currentValue) initProps[p.id] = p.currentValue;
      }
      responseCache.set(buildPropsCacheKey(initProps), {
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || config.currency,
        properties,
        cartProperties: data.cartProperties || null,
      });

      const hasUrlOverrides = Object.keys(urlProps).length > 0;
      if (hasUrlOverrides) {
        get().applyUrlProperties(urlProps);
      } else {
        syncCurrentToUrl(properties);
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  async applyUrlProperties(urlProps) {
    const { proxyBase, itemId, articleNumber, manufacturerId, properties: prevProperties, customIcons } = get();
    set({ updating: true });

    try {
      const data = await updateProperties(proxyBase, urlProps, itemId, articleNumber, manufacturerId);
      const merged = mergeProperties(prevProperties, data, customIcons);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || get().currency,
        properties: merged,
        cartProperties: data.cartProperties || get().cartProperties,
        updating: false,
      });
    } catch (err) {
      set({ error: err.message, updating: false });
    }
  },

  async updateProperty(key, value) {
    const { proxyBase, itemId, properties, articleNumber, manufacturerId, customIcons } = get();

    const optimistic = properties.map((p) =>
      p.id === key ? { ...p, currentValue: value } : p,
    );
    set({ properties: optimistic, updating: true, error: null });

    syncCurrentToUrl(optimistic);

    const allProps = {};
    for (const p of optimistic) {
      if (p.currentValue) allProps[p.id] = p.currentValue;
    }

    const cacheKey = buildPropsCacheKey(allProps);
    const cached = responseCache.get(cacheKey);
    if (cached) {
      const merged = mergeProperties(optimistic, cached, customIcons);
      set({
        gltfUrl: cached.gltfUrl,
        price: cached.price,
        currency: cached.currency || get().currency,
        properties: merged,
        cartProperties: cached.cartProperties || get().cartProperties,
        updating: false,
      });
      return;
    }

    try {
      const data = await updateProperties(proxyBase, allProps, itemId, articleNumber, manufacturerId);

      responseCache.set(cacheKey, {
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency,
        properties: data.properties,
        validOptions: data.validOptions,
        cartProperties: data.cartProperties || null,
      });

      const merged = mergeProperties(optimistic, data, customIcons);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || get().currency,
        properties: merged,
        cartProperties: data.cartProperties || get().cartProperties,
        updating: false,
      });
    } catch (err) {
      set({ properties, updating: false, error: err.message });
    }
  },

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

  /**
   * Cart-add akışı:
   *
   *  1. Backend `/api/pcon/cart-payload` çağrılır. EAIWS'ten fresh
   *     `_attachment`, `_obx_url`, `_reopen_url`, `_article_image` ve
   *     server-side generate edilen `_request_id`/`_basket_id` ile birlikte
   *     tam `cartProperties` payload'u alınır.
   *  2. Dönen `cartProperties` olduğu gibi Shopify `cart/add.js` body'sinin
   *     `properties` alanına gömülür — legacy `finalProperties` ile birebir.
   *  3. Başarılı response sonrası sayfa `window.location.reload()` ile
   *     yenilenir; tema kendi cart count / drawer state'ini fresh çeker.
   *
   * Hata durumunda `cartError` set edilir, buton yeniden tıklanabilir kalır.
   */
  async addToCart() {
    const {
      cartProperties,
      proxyBase,
      properties,
      itemId,
      articleNumber,
      manufacturerId,
      quantity,
      variantId,
      routesRoot,
      cartLoading,
      updating,
      loading,
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

    // Backend'in beklediği "PROPCLASS.PROPNAME" → "value" map'i — store'daki
    // currentValue olanlar.
    const propertyMap = {};
    for (const p of properties) {
      if (p.currentValue) propertyMap[p.id] = p.currentValue;
    }

    try {
      const payload = await fetchCartPayload(proxyBase, {
        properties: propertyMap,
        itemId,
        articleNumber,
        manufacturerId,
        quantity: safeQuantity,
      });

      const finalProperties = payload?.cartProperties;
      if (!finalProperties) {
        throw new Error("Cart payload missing cartProperties");
      }

      // Backend stale-itemId fallback'ı yapmış olabilir; store'u güncelle ki
      // sonraki update çağrıları doğru itemId ile gitsin.
      const nextState = { cartLoading: false, cartSuccess: true };
      if (payload.itemId && payload.itemId !== itemId) {
        nextState.itemId = payload.itemId;
      }

      const items = [
        {
          id: variantId,
          quantity: safeQuantity,
          properties: finalProperties,
        },
      ];

      await postCartAdd(routesRoot, items);
      set(nextState);

      // Başarı feedback'i kullanıcıya kısa süreli görünsün diye reload'u
      // bir sonraki tick'e atıyoruz; aynı tick'te navigate olursa React
      // unmount'tan önce success badge yansımayabilir.
      window.setTimeout(() => window.location.reload(), 0);
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
}));

/**
 * Merge an update response into the current property list.
 *
 * EAIWS authoritatively dictates which properties are visible/contextual at
 * any given configuration; on each `setPropertyValue` it returns the full
 * post-update property snapshot (`data.properties`) — including label, type,
 * options, currentValue, icon URLs and crucially the *set* of properties
 * (some may appear or disappear depending on context, e.g. PRIZ_TIPI when
 * BOLGE = "-" vs "NA"). We therefore replace the local list with the server
 * snapshot and re-apply storefront-only customizations (custom icons).
 *
 * For backwards compatibility with cache entries written by the previous
 * `validOptions`-based protocol, we fall back to a partial merge that only
 * updates `available`/`label` on existing options.
 */
function mergeProperties(prevProperties, data, customIcons) {
  if (Array.isArray(data?.properties)) {
    return applyCustomIcons(data.properties, customIcons);
  }
  return legacyMergeValidOptions(prevProperties, data?.validOptions);
}

function legacyMergeValidOptions(properties, validOptions) {
  if (!validOptions) return properties;

  const voMap = new Map();
  for (const vo of validOptions) {
    const byValue = new Map();
    for (const o of vo.options) {
      byValue.set(o.value, o);
    }
    voMap.set(vo.id, byValue);
  }

  return properties.map((prop) => {
    const byValue = voMap.get(prop.id);
    if (!byValue) return prop;

    const mergedOptions = prop.options.map((opt) => {
      const vo = byValue.get(opt.value);
      if (!vo) return { ...opt, available: false };
      return {
        ...opt,
        available: vo.available,
        label: vo.label ?? opt.label,
      };
    });

    return {
      ...prop,
      options: mergedOptions,
    };
  });
}

function syncCurrentToUrl(properties) {
  const map = {};
  for (const p of properties) {
    if (p.currentValue) map[p.id] = p.currentValue;
  }
  writeUrlProperties(map);
}

/* ------------------------------------------------------------------ *
 * Custom icon overrides
 *
 * EAIWS does not always ship icons (or the right icons) for every
 * choice-list value. We layer three storefront-side sources on top of
 * the server response:
 *
 *   1. `variantPicker` — *fallback only* lookup keyed by `option.value`.
 *      Mirrors the merchant's existing theme setup ("Variant picker
 *      images"): up to 110 `variant_picker_code_*` / `variant_picker_image_*`
 *      slots maintained in theme settings. Applied only when the option
 *      has no icon yet, so a real EAIWS icon (when present) always wins.
 *   2. `socket` — locale-independent socket-type icons matched via
 *      property ID + value/label keywords (DE/EN/TR). Forced override.
 *   3. `contextual` — icons that depend on the current value of another
 *      property, e.g. `MT_TEXT.Meta_Dimension`. Forced override.
 *
 * Whenever at least one option of a property ends up with an icon, the
 * property `type` is upgraded to "color" so PropertyCollapsible renders
 * swatches instead of plain chips.
 *
 * Asset URLs are produced by Liquid (`asset_url`/`image_url`) in
 * `configurator.liquid` and exposed on `window.__pconCustomIcons`.
 * ------------------------------------------------------------------ */

const SOCKET_PROPERTY_IDS = new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]);

const SOCKET_ICON_PATTERNS = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" },
];

const DIMENSION_PROPERTY_ID = "MT_TEXT.Meta_Dimension";

// Map: dimension value → { propertyId → { optionValue → iconKey } }
const DIMENSION_DEPENDENT_ICONS = {
  m_100_140: {
    "MEDIAWALL.MEDIAWALL": {
      "false": "withoutMediawall",
      "true": "withMediawall",
    },
    "KOLTUK_4U.KOLTUK": {
      "false": "forUWithoutSofa",
      "true": "forUWithSofa",
    },
  },
  m_100_220: {
    "KOLTUK.KOLTUK": {
      "false": "mediumLargeForAllWithoutSofa",
      "true": "mediumLargeForAllWithSofa",
    },
  },
  m_144_220: {
    "KOLTUK_L.KOLTUK": {
      "false": "mediumLargeForAllWithoutSofa",
      "true": "mediumLargeForAllWithSofa",
    },
  },
  m_188_220ALL: {
    "MASA_FA.MASA": {
      "false": "mediumLargeForAllWithoutSofa",
      "true": "mediumLargeForAllWithSofa",
    },
  },
};

function applyCustomIcons(properties, customIcons) {
  if (!customIcons || typeof customIcons !== "object") return properties;

  // Order matters: variant-picker is a *fallback* (only fills empty
  // icons), so it must run before the forced overrides — otherwise a
  // socket/contextual icon could later be overwritten.
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
    return {
      ...prop,
      type: "color",
      options: newOptions,
    };
  });
}

function applySocketIcons(properties, socketIcons) {
  if (!socketIcons) return properties;

  return properties.map((prop) => {
    if (!isSocketProperty(prop)) return prop;

    const newOptions = overrideSocketIcons(prop.options, socketIcons);
    const hasIcon = newOptions.some((o) => o.icon);

    return {
      ...prop,
      type: hasIcon ? "color" : prop.type,
      options: newOptions,
    };
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
    return {
      ...prop,
      type: hasIcon ? "color" : prop.type,
      options: newOptions,
    };
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
