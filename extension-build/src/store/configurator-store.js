import { create } from "zustand";
import {
  initArticle,
  updateProperties,
  fetchCartPayload,
} from "../utils/api.js";
import { readUrlProperties, writeUrlProperties } from "../utils/url-sync.js";
import { postCartAdd } from "../utils/cart.js";
import {
  getPreorderIntent,
  clearPreorderIntent,
  getCustomerId,
  postPreorderAddLine,
} from "../utils/preorder-intent.js";
import { createPerfRecorder } from "../utils/perf.js";
import { applyMaterialPatch } from "../scene/MaterialSwapper.js";
import { applyGeometryDelta } from "../scene/GeometrySwapper.js";

const responseCache = new Map();

function buildPropsCacheKey(properties) {
  const sorted = Object.keys(properties).sort();
  return sorted.map((k) => k + "=" + properties[k]).join("&");
}

/* ─────────────────── Faz 6 — Feature flags & prefetch infra ────────────────
 *
 * Hepsi default OFF veya UX-yumuşak ON. Window/query gating sayesinde
 * production bundle bytewise mevcut davranışı korur ta ki opt-in yapılana
 * kadar.
 *
 *   PCON_HOVER_PREFETCH (default OFF) — option butonu hover'ında debounce'lu
 *     prefetch. Backend Redis cache + frontend `responseCache` populate olur;
 *     ardından gelen click cache HIT path'inde no-op network ile döner.
 *   PCON_OPTIMISTIC_UI (default ON) — `updateProperty` tıklama anında
 *     `currentValue`'yu set eder; backend cevabı geldiğinde finalize/revert
 *     edilir. OFF ise klasik "click → wait → state" akışı.
 *
 * Prefetch'in EAIWS rate limit'e takılmaması için iki guard:
 *   - PREFETCH_DEBOUNCE_MS — aynı key 200ms quiet period beklemeden hiç
 *     fetch tetiklenmez (hızlı mouse-over her butona hit etmez).
 *   - MAX_CONCURRENT_PREFETCH — eşzamanlı 3'ü aşmaz; tetiklenecek 4üncü
 *     debounce timer içinde sessizce skip edilir.
 */
const PREFETCH_DEBOUNCE_MS = 200;
const MAX_CONCURRENT_PREFETCH = 3;
const prefetchInflight = new Set();
const prefetchTimers = new Map();

function isHoverPrefetchEnabled() {
  if (typeof window === "undefined") return false;
  if (window.__pconConfig && window.__pconConfig.hoverPrefetch === true) return true;
  try {
    return window.location.search.indexOf("hoverprefetch=1") !== -1;
  } catch {
    return false;
  }
}

function isOptimisticUIEnabled() {
  if (typeof window === "undefined") return true;
  if (window.__pconConfig && window.__pconConfig.optimisticUI === false) return false;
  try {
    if (window.location.search.indexOf("optimisticui=0") !== -1) return false;
  } catch {
    /* ignore */
  }
  return true;
}

/**
 * `<link rel="prefetch">` tag'i ekle. Browser HTTP cache'ine düşürür;
 * gerçek tıklamada texture/image fetch network'ten değil cache'ten gelir.
 * Idempotent: aynı href için ikinci kez çağrılırsa duplicate eklemez.
 */
function preloadAsset(href, asKind) {
  if (!href || typeof document === "undefined") return;
  try {
    const sel = `link[rel="prefetch"][href="${href.replace(/"/g, '\\"')}"]`;
    if (document.head.querySelector(sel)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    if (asKind) link.as = asKind;
    link.href = href;
    document.head.appendChild(link);
  } catch {
    /* ignore — non-blocking enhancement */
  }
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

  // Faz 4 — Material-swap orchestration state.
  //
  // `sceneRef`           Model.jsx tarafından mount/unmount sırasında
  //                      published THREE.Group; `applyMaterialPatch` /
  //                      `applyGeometryDelta` bu referansı kullanır.
  //                      Render loop'a katılmaz, sadece action içinden
  //                      okunur — re-render tetiklemez ama zustand'da
  //                      subscriber'ı yok zaten.
  // `lastResponseType`   "material-patch" | "geometry-delta" | "full-gltf"
  //                      | null. Spinner gating'inde ConfiguratorScene.jsx
  //                      tarafından okunuyor (in-place patch sırasında
  //                      spinner GÖSTERMEME — fade-in artifacti olmaz).
  // `gltfLoader`         Faz 5 — Model.jsx'in DRACO-configured GLTFLoader
  //                      singleton'ı. GeometrySwapper sub-article GLB'leri
  //                      bu loader üzerinden yükler.
  sceneRef: null,
  lastResponseType: null,
  gltfLoader: null,

  // Faz 6 — Hover prefetch routing. Backend `/api/pcon/init` her property için
  // "appearance" | "geometry" | "unknown" classification döner; prefetch
  // action bunu kullanarak texture preload mı (appearance) yoksa backend
  // warm fetch mi (geometry/unknown) yapacağına karar verir.
  // Subscriber yok (sadece action içinde tüketilir) → re-render tetiklemez.
  classifications: {},

  async initialize(config) {
    // Faz 0 telemetry: configurator init zincirini ölç. Davranış değişmez.
    const recorder = createPerfRecorder({
      op: "initialize",
      articleNumber: config.articleNumber,
    });
    recorder.mark("click");

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
      recorder.mark("response_server");
      if (data && data.__perfMeta) {
        recorder.attachServerTiming(data.__perfMeta.serverTiming);
      }

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
        // Faz 6 — Backend Faz 1'de eklenen `classifications` map'i
        // (`{ propId: "appearance" | "geometry" | "unknown" }`). Eski
        // backend'lerle uyumluluk için yoksa boş obje düşeriz —
        // `prefetchProperty` action'ı "unknown" path'ine sapar.
        classifications: data.classifications || {},
        loading: false,
      });
      recorder.mark("paint_state_set");

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

      recorder.flushToConsole();
      recorder.flushToWindow();

      const hasUrlOverrides = Object.keys(urlProps).length > 0;
      if (hasUrlOverrides) {
        get().applyUrlProperties(urlProps);
      } else {
        syncCurrentToUrl(properties);
      }
    } catch (err) {
      recorder.mark("error");
      recorder.flushToConsole();
      recorder.flushToWindow();
      set({ error: err.message, loading: false });
    }
  },

  async applyUrlProperties(urlProps) {
    const { proxyBase, itemId, articleNumber, manufacturerId, properties: prevProperties, customIcons } = get();
    // Faz 0 telemetry: URL'den apply edilen property setinin click→paint
    // süresi. Davranış değişmez.
    const recorder = createPerfRecorder({
      op: "applyUrlProperties",
      articleNumber,
      propertyId: Object.keys(urlProps || {})[0] || null,
    });
    recorder.mark("click");
    set({ updating: true });

    try {
      const data = await updateProperties(proxyBase, urlProps, itemId, articleNumber, manufacturerId);
      recorder.mark("response_server");
      if (data && data.__perfMeta) {
        recorder.attachServerTiming(data.__perfMeta.serverTiming);
      }
      const merged = mergeProperties(prevProperties, data, customIcons);

      set({
        gltfUrl: data.gltfUrl,
        price: data.price,
        currency: data.currency || get().currency,
        properties: merged,
        cartProperties: data.cartProperties || get().cartProperties,
        updating: false,
      });
      recorder.mark("paint_state_set");
      recorder.flushToConsole();
      recorder.flushToWindow();
    } catch (err) {
      recorder.mark("error");
      recorder.flushToConsole();
      recorder.flushToWindow();
      set({ error: err.message, updating: false });
    }
  },

  async updateProperty(key, value) {
    const { proxyBase, itemId, properties, articleNumber, manufacturerId, customIcons } = get();

    // Faz 0 telemetry: tıklamadan paint'e (state.set) kadar her phase'i ölç.
    // Davranış değişmez — sadece `window.__pconPerf` ring buffer'a entry
    // push ve tek satır console log.
    const recorder = createPerfRecorder({
      op: "updateProperty",
      articleNumber,
      propertyId: key,
    });
    recorder.mark("click");

    const optimistic = properties.map((p) =>
      p.id === key ? { ...p, currentValue: value } : p,
    );

    // Faz 6 — Optimistic UI flag-gated.
    //   ON (default): tıklama anında `currentValue` set edilir → button
    //     active state ANINDA render edilir; backend response'u beklenmez.
    //     Hata path'i (catch) state'i ve URL'i `properties`/`syncCurrentToUrl`
    //     ile geri alır + console.warn ("[store] property revert: ...").
    //   OFF: klasik akış — sadece `updating: true`. Backend response geldikten
    //     sonra state set edilir; revert ihtiyacı zaten yok (state hiç ileri
    //     gitmedi).
    const optimisticEnabled = isOptimisticUIEnabled();
    if (optimisticEnabled) {
      set({ properties: optimistic, updating: true, error: null });
      syncCurrentToUrl(optimistic);
    } else {
      set({ updating: true, error: null });
    }

    const allProps = {};
    for (const p of optimistic) {
      if (p.currentValue) allProps[p.id] = p.currentValue;
    }

    const cacheKey = buildPropsCacheKey(allProps);
    const cached = responseCache.get(cacheKey);
    if (cached) {
      recorder.mark("response_local_cache");
      const merged = mergeProperties(optimistic, cached, customIcons);

      // Faz 4 — local cache'de material-patch entry'si varsa yeniden uygula.
      // Aynı combination ikinci kez seçilirse sahnede MaterialSwapper'ı tekrar
      // çağırırız; durum aynı zaten ama state-only update yetmez (önceki
      // tıklamada başka kombinasyona gidip geri dönülmüş olabilir).
      if (cached.type === "material-patch") {
        const sceneRef = get().sceneRef;
        if (sceneRef) {
          try {
            await applyMaterialPatch(sceneRef, cached);
          } catch (err) {
            console.warn(
              "[store] applyMaterialPatch (cache HIT) failed:",
              err.message,
            );
          }
        }
        set({
          // gltfUrl AYNI KALIR — material-patch GLB swap tetiklemez.
          price: cached.price,
          currency: cached.currency || get().currency,
          properties: merged,
          cartProperties: cached.cartProperties || get().cartProperties,
          updating: false,
          lastResponseType: "material-patch",
        });
      } else if (cached.type === "geometry-delta") {
        // Faz 5 — local cache HIT'te de geometry-delta'yı sahneye uygula.
        // Aynı kombinasyon iki kez seçilirse (örn. user A→B→A toggling)
        // ikinci tıklamada sahne hala A state'ine dönmemiş olabilir;
        // delta'yı tekrar uygulayarak senkronize ederiz.
        const sceneRef = get().sceneRef;
        const gltfLoader = get().gltfLoader;
        if (sceneRef && gltfLoader) {
          try {
            await applyGeometryDelta(sceneRef, cached, gltfLoader);
          } catch (err) {
            console.warn(
              "[store] applyGeometryDelta (cache HIT) failed:",
              err.message,
            );
          }
        }
        set({
          // gltfUrl AYNI KALIR — geometry-delta full GLB swap tetiklemez.
          price: cached.price,
          currency: cached.currency || get().currency,
          properties: merged,
          cartProperties: cached.cartProperties || get().cartProperties,
          updating: false,
          lastResponseType: "geometry-delta",
        });
      } else {
        set({
          gltfUrl: cached.gltfUrl,
          price: cached.price,
          currency: cached.currency || get().currency,
          properties: merged,
          cartProperties: cached.cartProperties || get().cartProperties,
          updating: false,
          lastResponseType: "full-gltf",
        });
      }
      recorder.mark("paint_state_set");
      recorder.flushToConsole();
      recorder.flushToWindow();
      return;
    }

    try {
      // Faz 4 — `dirtyKeys: [key]` body'ye eklenir. Backend Faz 2 bunu
      // appearance/geometry classification için kullanır; flag-OFF iken
      // zararsız (Array.isArray + length kontrolüyle yutulur).
      const data = await updateProperties(
        proxyBase,
        allProps,
        itemId,
        articleNumber,
        manufacturerId,
        [key],
      );
      recorder.mark("response_server");
      if (data && data.__perfMeta) {
        recorder.attachServerTiming(data.__perfMeta.serverTiming);
      }

      // ─────────────── Faz 4: Response type branching ───────────────
      //
      // Backend `type === "material-patch"` döndüyse:
      //   * gltfUrl AYNI kalır (Model.jsx unmount tetiklenmez, fade yok).
      //   * MaterialSwapper sahnedeki mesh'lere in-place patch uygular.
      //   * `lastResponseType: "material-patch"` set edilir; spinner gating
      //     bunu okur (ConfiguratorScene.jsx).
      //
      // Aksi halde (eski full-GLB shape veya `type` field'ı yok):
      //   * Mevcut akış aynen — gltfUrl swap, Model.jsx remount.
      //   * Geriye uyumluluk: eski cache entry'leri ve flag-OFF iken
      //     bytewise mevcut davranış.
      if (data && data.type === "material-patch") {
        const sceneRef = get().sceneRef;
        if (sceneRef) {
          try {
            await applyMaterialPatch(sceneRef, data);
          } catch (err) {
            console.warn("[store] applyMaterialPatch failed:", err.message);
            // Görsel uygulama başarısız oldu — state update'i yine de
            // yapıyoruz ki price/cartProperties tutarlı kalsın (kabul
            // kriteri 4: kırılmasın). Kullanıcı ya bir sonraki tıklamada
            // toparlanır ya da geometry-property tıklayıp full-GLB akışına
            // geçer. Hata UI'a yansıtılmaz; sadece console.
          }
        } else {
          console.warn(
            "[store] material-patch received but no sceneRef; skipping in-place swap",
          );
        }

        // material-patch response'u local cache'e koy. `type` field'ı
        // kalır → tekrar HIT olduğunda yukarıdaki cache HIT branching
        // doğru yola düşer.
        responseCache.set(cacheKey, {
          type: "material-patch",
          patches: data.patches,
          price: data.price,
          currency: data.currency,
          properties: data.properties,
          cartProperties: data.cartProperties || null,
        });

        const merged = mergeProperties(optimistic, data, customIcons);
        set({
          // gltfUrl AYNI KALIR — Model.jsx unmount/remount tetiklemesin.
          price: data.price,
          currency: data.currency || get().currency,
          properties: merged,
          cartProperties: data.cartProperties || get().cartProperties,
          updating: false,
          lastResponseType: "material-patch",
        });
        recorder.mark("paint_state_set");
        recorder.flushToConsole();
        recorder.flushToWindow();
        return;
      }

      // ─────────────── Faz 5: geometry-delta branching ─────────────────
      //
      // Backend `type === "geometry-delta"` döndüyse:
      //   * gltfUrl AYNI kalır (Model.jsx unmount tetiklenmez, fade yok).
      //   * GeometrySwapper sadece değişen sub-article'ları sahnede
      //     remove/replace/add eder; tüm article re-render edilmez.
      //   * `lastResponseType: "geometry-delta"` → spinner gating
      //     (ConfiguratorScene.jsx).
      //
      // Görsel apply başarısız olursa `error` state'e geçeriz ve
      // spinner mask'i kalkar — kullanıcı bir sonraki tıklamada
      // (full-GLB tetikleyebilecek bir property) sahneyi temizler.
      // gltfUrl swap manuel yapmıyoruz çünkü backend zaten delta gönderdi
      // (full-GLB istemi yapmak için yeni bir update tetiklemek gerek;
      // o sorumluluk frontend'e dahil değil — UX bozulmaz, kullanıcı
      // başka bir property tıkladığında akış normalleşir).
      if (data && data.type === "geometry-delta") {
        const sceneRef = get().sceneRef;
        const gltfLoader = get().gltfLoader;
        let applyErr = null;
        if (sceneRef && gltfLoader) {
          try {
            await applyGeometryDelta(sceneRef, data, gltfLoader);
          } catch (err) {
            applyErr = err;
            console.warn("[store] applyGeometryDelta failed:", err.message);
          }
        } else {
          console.warn(
            "[store] geometry-delta received but no sceneRef/gltfLoader; skipping in-place swap",
          );
        }

        const merged = mergeProperties(optimistic, data, customIcons);

        if (applyErr) {
          // GeometrySwapper'ın total fail throw'u (tüm load'lar başarısız).
          // Backend zaten delta gönderdi — full-GLB istemi tetikleyemeyiz
          // (yeni network round-trip gerekecekti). Error state'i set edip
          // kullanıcıya "Failed to load 3D model" banner'ı gösteriyoruz;
          // kullanıcı sayfayı yenileyebilir veya başka bir property
          // tıklayıp full-GLB akışını tetikleyebilir.
          // Cache'e KOYMUYORUZ — bir sonraki tıklama bozuk delta'yı tekrar
          // çekmesin; backend'den fresh isteyelim.
          set({
            properties: merged,
            updating: false,
            error: applyErr.message,
          });
          recorder.mark("error");
          recorder.flushToConsole();
          recorder.flushToWindow();
          return;
        }

        // Başarı: cache'e koy, gltfUrl AYNI kalır (kabul kriteri 1).
        responseCache.set(cacheKey, {
          type: "geometry-delta",
          changedSubArticles: data.changedSubArticles,
          addedSubArticles: data.addedSubArticles,
          removedSubArticles: data.removedSubArticles,
          subArticles: data.subArticles,
          price: data.price,
          currency: data.currency,
          properties: data.properties,
          cartProperties: data.cartProperties || null,
        });

        set({
          price: data.price,
          currency: data.currency || get().currency,
          properties: merged,
          cartProperties: data.cartProperties || get().cartProperties,
          updating: false,
          lastResponseType: "geometry-delta",
          error: null,
        });
        recorder.mark("paint_state_set");
        recorder.flushToConsole();
        recorder.flushToWindow();
        return;
      }

      // ── Full-GLB yolu (mevcut davranış) ─────────────────────────────
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
        lastResponseType: "full-gltf",
      });
      recorder.mark("paint_state_set");
      recorder.flushToConsole();
      recorder.flushToWindow();
    } catch (err) {
      recorder.mark("error");
      recorder.flushToConsole();
      recorder.flushToWindow();
      // Faz 6 — Optimistic UI revert: original `properties` snapshot'ına
      // geri dön + URL params'ı senkronize et. Flag OFF iken state hiç
      // değişmediği için revert no-op'a denk düşer ama yine de URL'i
      // garantili senkronize tutuyoruz (önceki bir başka updateProperty
      // çağrısı URL'e yazmış olabilir).
      if (optimisticEnabled) {
        console.warn(
          "[store] property revert: " + key + " → " + value + " (" + err.message + ")",
        );
        syncCurrentToUrl(properties);
      }
      set({ properties, updating: false, error: err.message });
    }
  },

  /**
   * Faz 4 — Model.jsx tarafından sahne mount/unmount sırasında çağrılır.
   * `applyMaterialPatch` çağrısında `get().sceneRef` üzerinden okunur.
   * Subscriber'ı yok (sadece action içinde tüketilir) → re-render
   * tetiklemez.
   */
  setSceneRef(scene) {
    set({ sceneRef: scene || null });
  },

  /**
   * Faz 5 — Model.jsx tarafından mount/unmount sırasında çağrılır.
   * GeometrySwapper sub-article GLB'lerini bu loader üzerinden yükler.
   * Subscriber yok → re-render tetiklemez.
   */
  setGltfLoader(loader) {
    set({ gltfLoader: loader || null });
  },

  /**
   * Faz 6 — Hover prefetch.
   *
   * `PropertySelector.jsx` option butonuna mouse-enter / focus geldiğinde
   * çağrılır. Plan §539-541, §566.
   *
   * Davranış (PCON_HOVER_PREFETCH flag-gated, default OFF):
   *   1. Same value veya non-existent prop → no-op.
   *   2. 200ms debounce: aynı `propId:value` key'i hızlı tekrar tetiklerse
   *      önceki timer iptal, yenisi kurulur (mouse hızlıca üstüden geçince
   *      hiç fetch yapılmaz).
   *   3. Concurrent guard: 3 in-flight prefetch'ten fazlasına izin yok.
   *      EAIWS rate limit'e takılmamak için (plan §566).
   *   4. Classification dispatch:
   *        appearance → `<link rel="prefetch">` ile swatch icon URL'i
   *          browser HTTP cache'ine alınır + backend warm fetch
   *          (cache HIT path'inde gerçek tıklama no-op'a düşer).
   *        geometry / unknown → backend warm fetch.
   *   5. Backend response **state'e merge edilmez**; sadece module-level
   *      `responseCache` Map'ine yazılır. Gerçek tıklama (`updateProperty`)
   *      cache HIT path'ini bulur ve network'e çıkmaz → kabul kriteri 1.
   *
   * Hata path'i: console.warn + sessizce skip; UI/state etkilenmez.
   */
  prefetchProperty: async (propId, value) => {
    if (!isHoverPrefetchEnabled()) return;
    if (!propId || value === undefined || value === null) return;

    const prop = get().properties.find((p) => p.id === propId);
    if (!prop) return;
    if (prop.currentValue === value) return;
    const opt = prop.options.find((o) => o.value === value);
    if (!opt || opt.available === false) return;

    const key = propId + ":" + value;

    if (prefetchTimers.has(key)) {
      clearTimeout(prefetchTimers.get(key));
    }

    const timer = setTimeout(async () => {
      prefetchTimers.delete(key);

      if (prefetchInflight.has(key)) return;
      if (prefetchInflight.size >= MAX_CONCURRENT_PREFETCH) return;

      const {
        properties: latest,
        proxyBase,
        itemId,
        articleNumber,
        manufacturerId,
        classifications,
      } = get();

      // Stale check — properties değişmiş olabilir; kullanıcı zaten o
      // değere geçmişse anlamı yok.
      const liveProp = latest.find((p) => p.id === propId);
      if (!liveProp || liveProp.currentValue === value) return;

      const allProps = {};
      for (const p of latest) {
        if (p.currentValue) allProps[p.id] = p.currentValue;
      }
      allProps[propId] = value;

      const cacheKey = buildPropsCacheKey(allProps);
      // Already cached frontend-side — kullanıcı tıklasa bile network
      // request olmayacak. Skip.
      if (responseCache.has(cacheKey)) return;

      const cls = (classifications && classifications[propId]) || "unknown";

      // Appearance → swatch icon'u browser cache'ine düşür. Hafif (KB
      // seviyesinde) ama gerçek material baseColor texture'ını backend
      // material-patch response'unda alacağımız için orayı da prefetch
      // yapmak istiyoruz; backend warm fetch onu hallediyor.
      if (cls === "appearance" && opt.icon) {
        preloadAsset(opt.icon, "image");
      }

      prefetchInflight.add(key);
      try {
        const data = await updateProperties(
          proxyBase,
          allProps,
          itemId,
          articleNumber,
          manufacturerId,
          [propId],
        );
        // Response'u state'e merge ETMİYORUZ — kullanıcı henüz tıklamadı.
        // Sadece `responseCache`'e yazıyoruz ki bir sonraki gerçek tıklama
        // cache HIT path'ine düşsün (kabul kriteri 1: yeni network request
        // görünmemeli).
        if (data && data.type === "material-patch") {
          responseCache.set(cacheKey, {
            type: "material-patch",
            patches: data.patches,
            price: data.price,
            currency: data.currency,
            properties: data.properties,
            cartProperties: data.cartProperties || null,
          });
        } else if (data && data.type === "geometry-delta") {
          responseCache.set(cacheKey, {
            type: "geometry-delta",
            changedSubArticles: data.changedSubArticles,
            addedSubArticles: data.addedSubArticles,
            removedSubArticles: data.removedSubArticles,
            subArticles: data.subArticles,
            price: data.price,
            currency: data.currency,
            properties: data.properties,
            cartProperties: data.cartProperties || null,
          });
        } else if (data) {
          responseCache.set(cacheKey, {
            gltfUrl: data.gltfUrl,
            price: data.price,
            currency: data.currency,
            properties: data.properties,
            validOptions: data.validOptions,
            cartProperties: data.cartProperties || null,
          });
        }
      } catch (err) {
        console.warn("[prefetch] failed:", err?.message || err);
      } finally {
        prefetchInflight.delete(key);
      }
    }, PREFETCH_DEBOUNCE_MS);

    prefetchTimers.set(key, timer);
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
   * Cart-add akışı (iki dallı):
   *
   *  1. Backend `/api/pcon/cart-payload` her durumda çağrılır. EAIWS'ten
   *     fresh `_attachment`, `_obx_url`, `_reopen_url`, `_article_image` ve
   *     server-side generate edilen `_request_id`/`_basket_id` ile tam
   *     `cartProperties` payload'u alınır. (Preorder akışında da bu meta'lar
   *     draft order line item'a kaydediliyor — daha sonra siparişi işlerken
   *     pCon UI reopen'ı için gerekli.)
   *
   *  2a. **Preorder mode** — `localStorage["calma_preorder_intent"]` aktif:
   *      Kardeş app'in (B2B Dealer Portal) preorder sistemine bağlanır.
   *      `cart/add.js`'e UĞRAMAZ; `POST /apps/b2b-portal/preorder/add-line`
   *      ile satır draft order'a eklenir. Başarıda alert + intent clear +
   *      `/pages/b2b-account#preorder-<id>` redirect (RELOAD YOK). Hatada
   *      alert + intent KORUNUR (dealer tekrar deneyebilsin) + PDP'de kal.
   *
   *  2b. **Normal mode** — intent yok/expired:
   *      Dönen `cartProperties` olduğu gibi Shopify `cart/add.js` body'sinin
   *      `properties` alanına gömülür. Başarıda sayfa `window.location.reload()`
   *      ile yenilenir; tema kendi cart count / drawer state'ini fresh çeker.
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

      // Preorder intent kontrolü — kardeş B2B Dealer Portal app'i tarafından
      // localStorage'a yazılan 10 dk TTL'li intent. Banner app embed'i theme'de
      // enable ise window.CalmaPreorderIntent global'i de mevcut; helper iki
      // kaynağı da otomatik handle eder.
      const preorderIntent = getPreorderIntent();

      if (preorderIntent) {
        // ── PREORDER MODE ──────────────────────────────────────────────
        // cart/add.js'e UĞRAMA. Doğrudan kardeş app'in preorder add-line
        // endpoint'ine POST at; başarıda alert + redirect, hatada intent
        // korunur (dealer tekrar deneyebilsin) ve PDP'de kalınır.
        const customerId = getCustomerId();

        let preorderResult;
        try {
          preorderResult = await postPreorderAddLine({
            logged_in_customer_id: customerId,
            draftOrderId: preorderIntent.draftOrderId,
            variantId,
            quantity: safeQuantity,
            properties: finalProperties,
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
        set(nextState);
        // Redirect — RELOAD YOK; reload yapılırsa redirect'in önüne geçer
        // ve dealer PDP'de sıkışır.
        window.location.href =
          "/pages/b2b-account#preorder-" + preorderIntent.draftOrderId;
        return true;
      }

      // ── NORMAL MODE ────────────────────────────────────────────────
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
