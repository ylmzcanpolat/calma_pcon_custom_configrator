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

  const optionMap = new Map();
  for (const vo of validOptions) {
    optionMap.set(vo.id, vo.options);
  }

  return properties.map((prop) => {
    const newOptions = optionMap.get(prop.id);
    if (!newOptions) return prop;
    return {
      ...prop,
      options: newOptions,
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

export default useConfiguratorStore;
