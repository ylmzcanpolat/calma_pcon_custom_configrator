/**
 * ConfiguratorScene — WCF (@easterngraphics/wcf) tabanlı 3D görüntüleyici.
 *
 * KRİTİK TASARIM KARARI:
 *   `<div ref={containerRef}>` her zaman DOM'da olmalıdır. Aksi takdirde
 *   WCF init useEffect'i `containerRef.current === null` bulur ve erken
 *   çıkar; setWcfReady hiç çağrılmaz ve "loading" state sonsuza dek
 *   true kalır.
 *
 * FİYAT MİMARİSİ:
 *   pricingProcTask ve articleLoadTask PARALEL başlar — setPricingProcedure
 *   insertArticle'dan önce çağrılırsa WCF, manufacturerId olmayan InsertInfo'yu
 *   reddeder ("neither catalogId… nor manufacturerId"). Paralel yapıda hangi
 *   task önce biterse bitsin, WCF article'ı doğru şekilde kabul eder.
 *
 *   Fiyatı garantilemek için `setWcfReady` bittikten hemen sonra
 *   `refreshWcfPrice()` doğrudan çağrılır. Böylece pricing procedure
 *   article'a uygulandıktan SONRA fiyat okunur — eventArticleChanged
 *   event'inin kaçırılıp kaçırılmadığından bağımsız olarak.
 *
 * GATEKEEPER:
 *   gatekeeperId varsa Gatekeeper API'si doğrudan çağrılır (proxy hop yok).
 */

/* eslint-disable react/prop-types */

import {
  Component,
  useCallback,
  useEffect,
  useRef,
} from "react";
import PriceDisplay from "./PriceDisplay.jsx";
import PropertySelector from "./PropertySelector.jsx";
import AddToCartButton from "./AddToCartButton.jsx";
import useConfiguratorStore from "../store/configurator-store.js";

// ─── Error Boundary ────────────────────────────────────────────────────────

class WcfErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error) {
    console.error("[pcon] WCF render error:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="pcon-error"
          style={{ minHeight: (this.props.canvasHeight || 500) + "px" }}
        >
          <svg
            className="pcon-error__icon"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="pcon-error__message">
            {this.state.error?.message || "Failed to load 3D Configurator."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Gatekeeper helper ────────────────────────────────────────────────────
//
// gatekeeperId varsa → doğrudan Gatekeeper API (daha hızlı, proxy yok)
// yoksa → backend /api/gatekeeper-session proxy'si
//
// Gatekeeper ID, pCon'un uygulama kimliğidir; hassas bir credential
// değildir ve frontend'e açıkça konulabilir.

async function openGatekeeperSession(proxyBase, locale = "en_US", gatekeeperId = null) {
  if (gatekeeperId) {
    const res = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${gatekeeperId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      },
    );
    if (!res.ok) {
      throw new Error(`Gatekeeper direct call failed (HTTP ${res.status})`);
    }
    return res.json();
  }

  const res = await fetch(`${proxyBase}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error || `Gatekeeper session failed (HTTP ${res.status})`,
    );
  }
  return res.json();
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────

export default function ConfiguratorScene({ canvasHeight, customerLoggedIn }) {
  const loading = useConfiguratorStore((s) => s.loading);
  const error = useConfiguratorStore((s) => s.error);
  const proxyBase = useConfiguratorStore((s) => s.proxyBase);
  const gatekeeperId = useConfiguratorStore((s) => s.gatekeeperId);
  const articleNumber = useConfiguratorStore((s) => s.articleNumber);
  const manufacturerId = useConfiguratorStore((s) => s.manufacturerId);
  const setWcfReady = useConfiguratorStore((s) => s.setWcfReady);
  const setWcfError = useConfiguratorStore((s) => s.setWcfError);
  const refreshWcfPrice = useConfiguratorStore((s) => s.refreshWcfPrice);

  // WCF canvas container — HER ZAMAN DOM'DA olmalı (early-return yasak)
  const containerRef = useRef(null);

  // WCF resource refs
  const wcfAppRef = useRef(null);
  const wcfSessionRef = useRef(null);
  const articleManagerRef = useRef(null);
  const changedListenerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // ── WCF cleanup ────────────────────────────────────────────────────────

  const cleanupWcf = useCallback(() => {
    try {
      resizeObserverRef.current?.disconnect();
    } catch (_e) { /* cleanup */ }
    resizeObserverRef.current = null;

    try {
      if (changedListenerRef.current && articleManagerRef.current) {
        articleManagerRef.current.eventArticleChanged?.removeListener(
          changedListenerRef.current,
        );
      }
    } catch (_e) { /* cleanup */ }
    changedListenerRef.current = null;
    articleManagerRef.current = null;

    try {
      wcfSessionRef.current?.close?.();
    } catch (_e) { /* cleanup */ }
    wcfSessionRef.current = null;

    try {
      wcfAppRef.current?.dispose?.();
    } catch (_e) { /* cleanup */ }
    wcfAppRef.current = null;
  }, []);

  // ── WCF lifecycle ──────────────────────────────────────────────────────
  //
  // PARALEL YAPI (kritik):
  //   pricingProcTask ve articleLoadTask aynı anda başlar.
  //   insertArticle'ı pricing procedure kurulumundan ÖNCE çalıştırmak,
  //   WCF'nin article'ı pricing context'i olmadan kaydetmesini sağlar.
  //   Böylece "manufacturerId required" validasyonu tetiklenmez.
  //
  // FİYAT OKUMA:
  //   setWcfReady → fetchWcfPrice → null olabilir (proc henüz article'a uygulanmadıysa)
  //   setWcfReady bittikten sonra refreshWcfPrice() doğrudan çağrılır.
  //   Pricing proc bu noktada article'a uygulanmış olur → fiyat gelir.
  // ──────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!articleNumber || !proxyBase) return;

    let cancelled = false;

    async function initWcf() {
      // containerRef henüz mount olmadıysa kısa süre bekle
      if (!containerRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (cancelled || !containerRef.current) return;
      }

      try {
        // ADIM 1 — Gatekeeper session
        const gkData = await openGatekeeperSession(proxyBase, "en_US", gatekeeperId || null);
        if (cancelled) return;

        // ADIM 2 — WCF Application (BabylonJS renderer)
        const [coreModule, utilsModule] = await Promise.all([
          import("@easterngraphics/wcf/modules/core"),
          import("@easterngraphics/wcf/modules/utils"),
        ]);
        if (cancelled) return;

        const { Application } = coreModule;
        const { wcfConfig } = utilsModule;

        wcfConfig.dataPath = `${proxyBase}/wcf/data/`;

        const app = new Application();
        app.initialize(containerRef.current, {
          hardwareAntialiasing: false,
          preserveDrawingBuffer: true,
          autoResizeViewer: true,
          adaptToDeviceRatio: true,
          maximumDeviceRatio: 2.0,
          audioEngine: false,
        });
        wcfAppRef.current = app;
        if (cancelled) {
          try { app.dispose?.(); } catch (_e) { /* ignore */ }
          return;
        }

        // ─────────────────────────────────────────────────────────────────
        // CANVAS BOYUT DÜZELTMESİ — kritik
        //
        // WCF Viewer.js canvas'ı oluştururken inline style ile boyut verir,
        // ancak BabylonJS engine.resize() çağrısı (canvas HTML width/height
        // attribute'larını CSS boyutuna eşitleyen) yalnızca window resize
        // event'i geldiğinde tetiklenir. Bu yüzden sayfa açıldığında
        // canvas içeriği yanlış aspect ratio ile (default 300×150 buffer
        // → görseli dikey olarak gerilmiş gösterir) render edilir.
        //
        // İki katmanlı düzeltme:
        //   1) Başlangıç: 2 rAF bekleyip viewer.resize(true) — browser'ın
        //      aspect-ratio layout hesaplamasını tamamlamasını garanti
        //      eder, sonra WCF API'siyle anında resize tetikler.
        //   2) ResizeObserver: container boyutu sonradan değişirse
        //      (sidebar içeriği yüklenince flex layout reflow olabilir,
        //      tema scriptleri tetikleyebilir) otomatik olarak yine resize
        //      eder. Window resize event'ine bağımlı kalmaz.
        // ─────────────────────────────────────────────────────────────────

        // 2 rAF: bazı browser'larda aspect-ratio layout pass için tek frame
        // yetmiyor; 2 frame beklemek tüm modern browser'larda güvenli.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (cancelled) return;
        try {
          app.viewer.resize(true);
        } catch (_e) { /* viewer henüz hazır değilse sessizce geç */ }

        if (typeof ResizeObserver !== "undefined" && containerRef.current) {
          const ro = new ResizeObserver(() => {
            if (cancelled) return;
            try {
              wcfAppRef.current?.viewer?.resize(true);
            } catch (_e) { /* viewer dispose edilmiş olabilir */ }
          });
          ro.observe(containerRef.current);
          resizeObserverRef.current = ro;
        }

        // ADIM 3 — EAIWS Session
        const { EaiwsSession } = await import(
          "@easterngraphics/wcf/modules/eaiws"
        );
        if (cancelled) return;

        const session = new EaiwsSession();
        session.connect(
          gkData.server,
          gkData.sessionId,
          gkData.keepAliveInterval,
        );
        wcfSessionRef.current = session;

        const lang = "en";
        await Promise.all([
          session.catalog.setLanguages([lang]),
          session.basket.setLanguages([lang]),
        ]);
        if (cancelled) return;

        // ADIM 4 — ArticleManager
        const { ArticleManager } = await import(
          "@easterngraphics/wcf/modules/cf"
        );
        if (cancelled) return;

        const articleManager = new ArticleManager(app, session);
        articleManagerRef.current = articleManager;

        // ─────────────────────────────────────────────────────────────────
        // ADIM 5 + 6 — Pricing procedure ve article yüklemesi PARALEL
        //
        // KRİTİK: setPricingProcedure, insertArticle'dan ÖNCE çağrılırsa
        // WCF pricing context'i aktif eder ve InsertInfo'da manufacturerId
        // zorunlu hale gelir. Paralel yapıda bu sıralama garantilenemeyen
        // bir race haline gelir ve her zaman doğal çalışır.
        //
        // Fiyat okuma garantisi: setWcfReady sonrası refreshWcfPrice()
        // çağrılır — o noktada pricing proc article'a uygulanmış olur.
        // ─────────────────────────────────────────────────────────────────

        // ADIM 5 — Pricing procedure (article load ile paralel)
        const pricingProcTask = (async () => {
          try {
            const { PricingProcedureInfo } = await import(
              "@easterngraphics/wcf/modules/eaiws/basket"
            );
            const procedures = await session.basket.listPricingProcedures(true);
            if (!procedures?.length || cancelled) {
              console.warn("[wcf] no pricing procedures available");
              return;
            }
            const procName = procedures[0].name;
            console.log("[wcf] setting pricing procedure:", procName);
            const procInfo = await PricingProcedureInfo.CreateInfo(
              session,
              procName,
              true,
            );
            if (!cancelled && articleManagerRef.current) {
              articleManagerRef.current.setPricingProcedure(procInfo);
              console.log("[wcf] pricing procedure ready:", procName);
            }
          } catch (err) {
            console.warn("[wcf] pricing procedure failed:", err?.message);
          }
        })();

        // ADIM 6 — Article yükleme (pricing procedure ile paralel)
        const articleLoadTask = (async () => {
          try {
            const { SearchArticleParameterSet } = await import(
              "@easterngraphics/wcf/modules/eaiws/catalog/CatalogTypes"
            );
            const sp = new SearchArticleParameterSet();
            sp.baseArticleNumber = articleNumber;
            if (manufacturerId) sp.manufacturerId = manufacturerId;

            const result = await session.catalog.searchArticle(sp);
            const item = result?.scoredItems?.[0]?.item;

            if (item) {
              const { InsertInfo } = await import(
                "@easterngraphics/wcf/modules/eaiws/basket"
              );
              const info = new InsertInfo();
              info.baseArticleNumber = item.baseArticleNumber || articleNumber;
              if (item.manufacturerId) info.manufacturerId = item.manufacturerId;
              if (item.seriesId) info.seriesId = item.seriesId;
              return await articleManager.insertArticle(info);
            } else {
              throw new Error(`Article not found in catalog: ${articleNumber}`);
            }
          } catch (catalogErr) {
            console.warn(
              "[wcf] catalog search fell back to direct insert:",
              catalogErr?.message,
            );
            const { InsertInfo } = await import(
              "@easterngraphics/wcf/modules/eaiws/basket"
            );
            const info = new InsertInfo();
            info.baseArticleNumber = articleNumber;
            if (manufacturerId) info.manufacturerId = manufacturerId;
            return await articleManager.insertArticle(info);
          }
        })();

        // Her ikisinin tamamlanmasını bekle
        const [, articleElement] = await Promise.all([
          pricingProcTask,
          articleLoadTask,
        ]);
        if (cancelled || !articleElement) return;

        // Sahneye ekle
        app.model.addElement(articleElement);

        // ─────────────────────────────────────────────────────────────────
        // KAMERA ORTALAMA — ürünün TAM KARŞISINDAN (front view), dikey ve
        // yatay hizada ortalı şekilde gösterilir.
        //
        // waitUntilGeometryUpdated(): insertArticle sonrası geometry hâlâ
        // async yükleniyor olabilir; bekemeden zoomToFit yapılırsa bounding
        // box boş/yanlış olur ve kamera hatalı pozisyonlanır. Geometry
        // hazır olduktan sonra hesaplamak doğru ortalanmayı garanti eder.
        //
        // KAMERA YÖNÜ — WCF konvansiyonu (BabylonJS koordinat sistemi):
        //   +Y up, ön cephe -Z tarafında. Default Perspective kamera
        //   pozisyonu (-1, 3, -4) → sol-üst-arkadan iso görünüm. Bu yüzden
        //   ilk yüklemede kamera sol üst açıdan bakıyor.
        //
        //   Çözüm: setDirection(0, 0, 1) → kamera +Z yönüne bakar, yani
        //   ürünün ön cephesinden tam karşıya bakar. Mod Perspective olarak
        //   kalır (CameraMode.Front'a geçilmiyor) — kullanıcı sonradan
        //   mouse ile serbestçe orbit edebilir, sadece BAŞLANGIÇ açısı
        //   front'a sabitlenir.
        //
        // zoomToFitElements: zoomToFitPerspective implementation'ı direction'ı
        //   değiştirmeden sadece position'ı bounding box'ı sığdıracak optimal
        //   mesafeye taşır → margin: 0.15 = ~%7.5 kenar boşluğu, dikey ve
        //   yatay olarak ortalı sonuç.
        // ─────────────────────────────────────────────────────────────────
        try {
          await articleElement.waitUntilGeometryUpdated?.();
          if (cancelled) return;

          const cameraControl = app.viewer?.view?.cameraControl;
          if (cameraControl) {
            const { Vector3 } = await import(
              "@babylonjs/core/Maths/math.vector.js"
            );
            if (cancelled) return;
            try {
              cameraControl.setDirection(new Vector3(0, 0, 1));
            } catch (dirErr) {
              console.warn("[wcf] setDirection failed:", dirErr?.message);
            }
            cameraControl.zoomToFitElements?.(
              [articleElement],
              { margin: 0.15 },
            );
            wcfAppRef.current?.viewer?.requestRenderFrame?.();
          }
        } catch (zoomErr) {
          console.warn("[wcf] initial camera setup failed:", zoomErr?.message);
        }

        // ADIM 7 — İlk properties oku
        const rawProps = await articleElement.getProperties();
        if (cancelled) return;

        // ─────────────────────────────────────────────────────────────────
        // eventArticleChanged listener
        //
        // İki sorumluluğu var:
        //   1) Fiyatı yeniden çek (refreshWcfPrice)
        //   2) Canvas'a render frame iste — kritik!
        //
        // WCF Viewer "on-demand rendering" kullanır (Viewer.js içinde
        // onDemandRenderingEnabled=true). Sahne yalnızca açık bir
        // requestRenderFrame() çağrısı veya kullanıcı camera etkileşimi
        // ile yeniden çizilir. Property değişikliği sahnedeki geometry/
        // material'i günceller AMA WCF kütüphanesi bu durumda render frame
        // talep etmeyi her zaman garanti etmez — özellikle async geometry
        // update'i ile internal render scheduling arasında race oluştuğunda
        // render kaçırılır. Kullanıcı modeli hareket ettirene kadar
        // (camera change → otomatik render) eski state görünür.
        //
        // waitUntilGeometryUpdated(): geometry async yükleniyorsa biter,
        // değilse anında resolve eder. Sonrasında requestRenderFrame()
        // her durumda kesin bir render frame zincirler.
        // ─────────────────────────────────────────────────────────────────
        const onChanged = (data) => {
          refreshWcfPrice();

          (async () => {
            try {
              const changedArticle = data?.article;
              const mainArticle =
                changedArticle?.getMainArticle?.() ?? articleElement;
              await mainArticle?.waitUntilGeometryUpdated?.();
              if (cancelled) return;
              wcfAppRef.current?.viewer?.requestRenderFrame?.();
            } catch (_e) { /* viewer dispose edilmiş olabilir */ }
          })();
        };
        changedListenerRef.current = onChanged;
        articleManager.eventArticleChanged?.addListener(onChanged);

        // Store'u hazır duruma geçir
        await setWcfReady(articleElement, articleManager, rawProps);
        if (cancelled) return;

        // ─────────────────────────────────────────────────────────────────
        // FİYAT OKUMA GARANTİSİ
        //
        // setWcfReady içindeki fetchWcfPrice çağrısı, pricing procedure
        // article'a henüz uygulanmamışsa null döndürebilir.
        //
        // Bu noktada her iki task da tamamlanmış olduğundan pricing proc
        // kesinlikle set edilmiştir. refreshWcfPrice() doğrudan çağrılarak
        // fiyatın kesinlikle okunması sağlanır.
        // ─────────────────────────────────────────────────────────────────
        refreshWcfPrice();

      } catch (err) {
        if (!cancelled) {
          console.error("[wcf] init failed:", err);
          setWcfError(err);
        }
      }
    }

    initWcf();

    return () => {
      cancelled = true;
      cleanupWcf();
    };
  }, [articleNumber, manufacturerId, proxyBase, gatekeeperId, setWcfReady, setWcfError, cleanupWcf, refreshWcfPrice]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <WcfErrorBoundary canvasHeight={canvasHeight}>
      <div className="pcon-configurator">
        <div className="pcon-viewer">

          {/* Initial load spinner — prop-change overlay ile aynı görünüm */}
          {loading && (
            <div className="pcon-updating">
              <div className="pcon-progress-spinner pcon-progress-spinner--indeterminate">
                <svg
                  className="pcon-progress-spinner__svg"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                >
                  <circle
                    className="pcon-progress-spinner__track"
                    cx="32"
                    cy="32"
                    r="28"
                    strokeDasharray="175.93"
                    strokeDashoffset="0"
                  />
                  <circle
                    className="pcon-progress-spinner__fill"
                    cx="32"
                    cy="32"
                    r="28"
                    strokeDasharray="131.95 175.93"
                    strokeDashoffset="0"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {!loading && error && (
            <div
              className="pcon-error"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                background: "white",
                minHeight: canvasHeight + "px",
              }}
            >
              <svg
                className="pcon-error__icon"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="pcon-error__message">{error}</p>
            </div>
          )}

          {/* WCF BabylonJS canvas container — HER ZAMAN DOM'DA */}
          <div
            ref={containerRef}
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
        </div>

        {/* Sidebar — viewer spinner'ından bağımsız olarak hemen görünür.
              Her bileşen kendi yükleme/boş durumunu yönetir:
                PropertySelector → properties boşken null döner
                PriceDisplay    → price null iken skeleton gösterir
                AddToCartButton → cartProperties/variantId hazır değilse disabled
              Yalnızca hata durumunda gizlenir (viewer'daki error overlay yeterli). */}
        <div className="pcon-sidebar">
          {!error && (
            <>
              <PropertySelector />
              {/* PriceDisplay sadece login olmuş kullanıcılara gösterilir */}
              {/* AddToCartButton her zaman gösterilir:
                    - login: normal sepete ekle davranışı
                    - guest: "Request a Quote" etiketi + ana sayfaya yönlendirme */}
              <div className="pcon-price-cart">
                {customerLoggedIn && <PriceDisplay />}
                <AddToCartButton isGuest={!customerLoggedIn} />
              </div>
            </>
          )}
        </div>
      </div>
    </WcfErrorBoundary>
  );
}
