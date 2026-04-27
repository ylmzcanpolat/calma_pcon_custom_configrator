import { create } from "zustand";
import { initArticle, updateProperties } from "../utils/api.js";
import { readUrlProperties, writeUrlProperties } from "../utils/url-sync.js";

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

  async initialize(config) {
    set({
      proxyBase: config.proxyBase,
      articleNumber: config.articleNumber,
      manufacturerId: config.manufacturerId,
      currency: config.currency,
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

      properties = applyCustomIcons(properties, config.customIcons);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || config.currency,
        properties,
        itemId: data.itemId,
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
        validOptions: null,
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
    const { proxyBase, itemId, articleNumber, manufacturerId } = get();
    set({ updating: true });

    try {
      const data = await updateProperties(proxyBase, urlProps, itemId, articleNumber, manufacturerId);
      const { properties } = get();

      const merged = mergeValidOptions(properties, data.validOptions);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || get().currency,
        properties: merged,
        updating: false,
      });
    } catch (err) {
      set({ error: err.message, updating: false });
    }
  },

  async updateProperty(key, value) {
    const { proxyBase, itemId, properties, articleNumber, manufacturerId } = get();

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
      const merged = mergeValidOptions(optimistic, cached.validOptions);
      set({
        gltfUrl: cached.gltfUrl,
        price: cached.price,
        currency: cached.currency || get().currency,
        properties: merged,
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
        validOptions: data.validOptions,
      });

      const merged = mergeValidOptions(optimistic, data.validOptions);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || get().currency,
        properties: merged,
        updating: false,
      });
    } catch (err) {
      set({ properties, updating: false, error: err.message });
    }
  },

  setLoading(loading) {
    set({ loading });
  },

  setError(error) {
    set({ error });
  },
}));

function mergeValidOptions(properties, validOptions) {
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

/**
 * Override option icons with custom assets uploaded to the theme extension.
 * Matching is label-based and locale-independent (DE + EN covered).
 * Icon URLs are built via Liquid `asset_url` filter in configurator.liquid
 * and exposed on `window.__pconCustomIcons`.
 */
function applyCustomIcons(properties, customIcons) {
  if (!customIcons || typeof customIcons !== "object") return properties;

  return properties.map((prop) => {
    if (isSocketProperty(prop.label)) {
      return { ...prop, options: overrideSocketIcons(prop.options, customIcons.socket) };
    }
    return prop;
  });
}

function isSocketProperty(label) {
  return /steckdose|socket/i.test(label || "");
}

function overrideSocketIcons(options, socketIcons) {
  if (!socketIcons || !Array.isArray(options)) return options;

  return options.map((opt) => {
    const customIcon = matchSocketIcon(opt.label, socketIcons);
    return customIcon ? { ...opt, icon: customIcon } : opt;
  });
}

function matchSocketIcon(optLabel, map) {
  const label = (optLabel || "").toLowerCase();
  if (/german|deutsch/.test(label)) return map.german || null;
  if (/multi|universal/.test(label)) return map.multi || null;
  if (/swiss|schweiz/.test(label)) return map.swiss || null;
  if (/\buk\b|british|britisch/.test(label)) return map.uk || null;
  return null;
}

export default useConfiguratorStore;
