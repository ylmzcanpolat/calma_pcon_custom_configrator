(function () {
  "use strict";

  var root = document.getElementById("pcon-root");
  if (!root) return;

  var config = {
    articleNumber: root.dataset.articleNumber || "",
    manufacturerId: root.dataset.manufacturerId || "",
    shopDomain: root.dataset.shopDomain || "",
    proxyBase: root.dataset.proxyBase || "/apps/pcon-configurator",
    gatekeeperId: root.dataset.gatekeeperId || "",
    currency: root.dataset.currency || "TRY",
    canvasHeight: parseInt(root.dataset.canvasHeight, 10) || 500,
    environmentPreset: root.dataset.environmentPreset || "studio",
    variantId: root.dataset.variantId || "",
    routesRoot: root.dataset.routesRoot || "/",
    addToCartLabel: root.dataset.addToCartLabel || "Add to Cart",
    successAction: root.dataset.successAction || "drawer-event",
    customerLoggedIn: root.dataset.customerLoggedIn === "true",
    discountPercentage: parseFloat(root.dataset.discountPercentage) || null,
    productTitle: root.dataset.productTitle || "",
    productImageUrl: root.dataset.productImage || "",
    productSku: root.dataset.productSku || "",
    customerName: root.dataset.customerName || "",
  };

  if (!config.articleNumber) {
    showError("No pCon article number configured for this product.");
    return;
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadConfigurator();
      }
    }, { rootMargin: "200px" });

    observer.observe(root);
  } else {
    loadConfigurator();
  }

  function loadConfigurator() {
    var cdnUrl = root.dataset.bundleUrl || "";
    var proxyUrl = config.proxyBase + "/assets/configurator-app.js";

    // Shopify'ın asset_url'i zaten deploy başına versiyonludur (theme app
    // extension'da versiyon, CDN path segment'inde bulunur:
    // .../nurus-3d-configurator-prod-99/assets/...). Bu yüzden manuel bir
    // cache-buster GEREKMEZ; her yüklemede benzersiz URL üretmek tarayıcı
    // cache'ini tamamen devre dışı bırakır ve ağır bundle'ı defalarca
    // indirtir. Yeni bir deploy path segment'ini (versiyonu) değiştirdiği
    // için kullanıcı otomatik olarak güncel bundle'ı alır.
    //
    // Proxy fallback'in (yerleşik versiyonu yok) da deploy'da tazelenmesi
    // için versiyonu CDN URL'inden türetip query olarak ekliyoruz: aynı
    // deploy içinde tarayıcı cache'i çalışır, yeni deploy'da bust olur.
    var version = extractAssetVersion(cdnUrl);
    var proxyVersioned = version
      ? proxyUrl + "?v=" + encodeURIComponent(version)
      : proxyUrl;

    var urls = [];
    if (cdnUrl) {
      urls.push(cdnUrl);
    }
    urls.push(proxyVersioned);

    var runtimeErr = null;
    window.addEventListener("error", function (evt) {
      if (evt.filename && evt.filename.indexOf("configurator-app") !== -1) {
        runtimeErr = evt.message;
      }
    });

    loadNext(0);

    function loadNext(i) {
      if (i >= urls.length) {
        showError("Failed to load 3D Configurator." + (runtimeErr ? " (" + runtimeErr + ")" : ""));
        return;
      }
      var s = document.createElement("script");
      s.src = urls[i];
      // ESM bundle: configurator-app.js artık ES module (code-splitting için).
      // type="module" ile yüklenir; ConfiguratorScene mount olunca ağır 3D
      // motoru (pcon-chunk-engine-*.js) import.meta.url'e göre RELATIF olarak
      // aynı assets klasöründen (CDN veya proxy) dinamik yüklenir.
      // Module script'ler CORS modunda çekilir (cdn.shopify.com ACAO: * döner).
      s.type = "module";
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = function () {
        if (typeof window.__pconConfiguratorInit === "function") {
          try {
            window.__pconConfiguratorInit(root, config);
          } catch (e) {
            showError("Configurator error: " + e.message);
          }
        } else {
          loadNext(i + 1);
        }
      };
      s.onerror = function () {
        loadNext(i + 1);
      };
      document.head.appendChild(s);
    }
  }

  // Deploy başına stabil bir versiyon token'ı çıkarır. Öncelik ?v= param'ı
  // (klasik theme asset_url stili); yoksa theme app extension path'indeki
  // /assets/'ten önceki segment (örn. "nurus-3d-configurator-prod-99").
  function extractAssetVersion(url) {
    if (!url) return "";
    var q = url.match(/[?&]v=([^&]+)/);
    if (q) return q[1];
    var seg = url.match(/\/([^/]+)\/assets\//);
    if (seg) return seg[1];
    return "";
  }

  function showError(msg) {
    root.innerHTML =
      '<div class="pcon-error">' +
      '<svg class="pcon-error__icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' +
      "</svg>" +
      '<p class="pcon-error__message">' + msg + "</p>" +
      "</div>";
  }
})();
