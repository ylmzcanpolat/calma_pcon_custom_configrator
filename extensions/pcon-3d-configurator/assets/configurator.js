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
    var bust = "t=" + Date.now();
    var cdnUrl = root.dataset.bundleUrl || "";
    var proxyUrl = config.proxyBase + "/assets/configurator-app.js";

    var urls = [];
    if (cdnUrl) {
      urls.push(cdnUrl + (cdnUrl.indexOf("?") !== -1 ? "&" : "?") + bust);
    }
    urls.push(proxyUrl + "?" + bust);

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
