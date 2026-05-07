import { Suspense, Component, useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { Environment } from "@react-three/drei/core/Environment";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Html } from "@react-three/drei/web/Html";
import Model from "./Model.jsx";
import PriceDisplay from "./PriceDisplay.jsx";
import PropertySelector from "./PropertySelector.jsx";
import AddToCartButton from "./AddToCartButton.jsx";
import PerfHud from "./PerfHud.jsx";
import useConfiguratorStore from "../store/configurator-store.js";

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error) {
    console.error("[pcon] GLTF load failed:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            <p>Failed to load 3D model.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onRetry) this.props.onRetry();
              }}
              style={{
                marginTop: "10px", padding: "8px 16px",
                border: "1px solid #ccc", borderRadius: "4px",
                background: "#fff", cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function ModelLoadingProgress() {
  return (
    <Html center>
      <div className="pcon-suspense-spinner" aria-hidden="true">
        <span className="pcon-suspense-spinner__dot" />
        <span className="pcon-suspense-spinner__dot" />
        <span className="pcon-suspense-spinner__dot" />
      </div>
    </Html>
  );
}

const HDRI_URL =
  "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a/hdri/studio_small_03_1k.hdr";

const SPINNER_R = 28;
const SPINNER_C = 2 * Math.PI * SPINNER_R;

// Spinner UX best practice (Nielsen Norman Group):
//   - <200ms işlemler için spinner gösterilmez (algılanan "anlık" yanıt)
//   - Spinner gösterilmişse en az ~400ms görünür kalır (flicker önleme)
//   - Belirsiz süre = indeterminate animation; ölçülebilir progress = determinate
const SPINNER_SHOW_DELAY_MS = 200;
const SPINNER_MIN_VISIBLE_MS = 400;

export default function ConfiguratorScene({ canvasHeight, environmentPreset, customerLoggedIn }) {
  const gltfUrl = useConfiguratorStore((s) => s.gltfUrl);
  const loading = useConfiguratorStore((s) => s.loading);
  const updating = useConfiguratorStore((s) => s.updating);
  const error = useConfiguratorStore((s) => s.error);
  // Faz 4 — spinner gating. Önceki başarılı response material-patch ise
  // sonraki tıklamada (aynı veya benzer appearance property) backend'in de
  // material-patch döndüreceğini varsayıyoruz (classifier sticky / Redis
  // 30 gün TTL). Bu sayede in-flight phase'inde de spinner GÖSTERMEYİZ —
  // appearance swap genellikle <300 ms (plan §469); 200 ms grace period
  // (SPINNER_SHOW_DELAY_MS) zaten short fast path'leri kapsıyor ama
  // cache-MISS material-patch (~500-800 ms) için bu heuristic kritik.
  // Yanlış tahmin (sonra full-GLB gelirse) → GLB indirme fazında
  // isModelLoading=true zaten spinner'ı tetikler.
  const lastResponseType = useConfiguratorStore((s) => s.lastResponseType);

  // Model indirme/parsing durumu — backend updating bittikten sonra GLB
  // hala indiriliyor olabilir, bu süreyi de spinner'la kapsıyoruz.
  const [isModelLoading, setIsModelLoading] = useState(false);
  // null = indeterminate (Content-Length yok ya da henüz progress event yok),
  // sayı = determinate yüzde.
  const [modelProgress, setModelProgress] = useState(null);

  const [showSpinner, setShowSpinner] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const shownAtRef = useRef(0);

  // gltfUrl değişimi = yeni model. Model.jsx mount edildiğinde onProgress(0)
  // veya cached ise onProgress(100) çağıracak; buna kadar "yükleniyor" say.
  useEffect(() => {
    if (!gltfUrl) return;
    setIsModelLoading(true);
    setModelProgress(null);
  }, [gltfUrl]);

  const handleProgress = useCallback((percent) => {
    if (percent >= 100) {
      // Yükleme bitti; bir tick beklet ki Three.js scene mount tamamlansın,
      // sonra spinner'ı kaldırma kararını ver. State güncellemesi useEffect'i
      // tetikleyecek, hide timer minimum visible süreye uyacak.
      setModelProgress(100);
      setIsModelLoading(false);
    } else {
      setModelProgress(percent);
    }
  }, []);

  // `updating` material-patch / geometry-delta path'lerinde de true olur
  // (network round-trip) ama Model.jsx unmount/remount yok → isModelLoading
  // false → spinner sadece updating yüzünden gözükür. Önceki response
  // in-place patch tipiyse (material-patch veya geometry-delta) bu
  // in-flight phase'i süresince de spinner'ı gizliyoruz — fade-in
  // yerine targeted node swap ile <300ms paint hedefi (plan §469).
  const updatingMasked =
    updating &&
    lastResponseType !== "material-patch" &&
    lastResponseType !== "geometry-delta";
  const isBusy = updatingMasked || isModelLoading;

  // Spinner görünürlük yönetimi: gösterme/gizleme timer'ları ile flicker
  // ve "spinner takılı kaldı" hissini önlüyoruz.
  useEffect(() => {
    if (isBusy) {
      // Pending hide varsa iptal et — iş hala devam ediyor.
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      // Zaten görünüyorsa veya gösterme zamanlanmışsa tekrar zamanlama.
      if (showSpinner || showTimerRef.current) return;

      showTimerRef.current = setTimeout(() => {
        showTimerRef.current = null;
        shownAtRef.current = Date.now();
        setShowSpinner(true);
      }, SPINNER_SHOW_DELAY_MS);
      return;
    }

    // İş bitti.
    // Henüz gösterilmemişse (grace period içinde tamamlandı) zamanlamayı iptal.
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (!showSpinner) return;

    // Spinner görünür → minimum süre dolmasını bekle, sonra gizle.
    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, SPINNER_MIN_VISIBLE_MS - elapsed);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null;
      setShowSpinner(false);
      setModelProgress(null);
    }, remaining);
  }, [isBusy, showSpinner]);

  useEffect(
    () => () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    [],
  );

  // Determinate mode'a sadece backend isteği bittiğinde ve gerçek bir model
  // download yüzdesi geldiğinde geçiyoruz. Backend beklerken (updating) ya
  // da progress event yokken indeterminate kalıyor — sahte ilerleme yok.
  // `updatingMasked` material-patch in-flight'i hesaba katmıyor; doğrudan
  // `updating` ile karşılaştırıyoruz çünkü determinate ifadesi yalnızca
  // GLB download yüzdesi gerçekten görünüyorsa anlamlı.
  const isDeterminate =
    !updating && modelProgress != null && modelProgress > 0 && modelProgress < 100;
  const dashOffset = isDeterminate
    ? SPINNER_C * (1 - modelProgress / 100)
    : SPINNER_C * 0.75;

  if (loading) {
    return (
      <div
        className="pcon-loading"
        style={{ height: canvasHeight + "px" }}
      >
        <div className="pcon-loading__spinner" />
        <p className="pcon-loading__text">Loading 3D Configurator...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pcon-error" style={{ minHeight: canvasHeight + "px" }}>
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
    );
  }

  return (
    <div className="pcon-configurator">
      <div className="pcon-viewer">
        {gltfUrl && (
          <Canvas
            camera={{ position: [0, 2, 5], fov: 50 }}
            gl={{
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 0.7,
              outputColorSpace: SRGBColorSpace,
            }}
          >
            <Environment
              files={HDRI_URL}
              environmentIntensity={0.8}
            />
            <directionalLight position={[5, 5, 5]} intensity={0.3} />
            <Suspense fallback={<ModelLoadingProgress />}>
              <ModelErrorBoundary>
                <Model key={gltfUrl} url={gltfUrl} onProgress={handleProgress} />
              </ModelErrorBoundary>
            </Suspense>
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.5}
              scale={10}
              blur={2}
            />
            <OrbitControls
              enablePan={false}
              minDistance={0.5}
              maxDistance={10}
            />
          </Canvas>
        )}

        {showSpinner && (
          <div className="pcon-updating" role="status" aria-live="polite">
            <div
              className={
                "pcon-progress-spinner" +
                (isDeterminate ? "" : " pcon-progress-spinner--indeterminate")
              }
            >
              <svg viewBox="0 0 64 64" className="pcon-progress-spinner__svg">
                <circle
                  className="pcon-progress-spinner__track"
                  cx="32"
                  cy="32"
                  r={SPINNER_R}
                />
                <circle
                  className="pcon-progress-spinner__fill"
                  cx="32"
                  cy="32"
                  r={SPINNER_R}
                  style={{
                    strokeDasharray: SPINNER_C,
                    strokeDashoffset: dashOffset,
                  }}
                />
              </svg>
              {isDeterminate && (
                <span className="pcon-progress-spinner__pct">
                  {Math.round(modelProgress)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pcon-sidebar">
        {customerLoggedIn && <PriceDisplay />}
        <PropertySelector />
        {customerLoggedIn && <AddToCartButton />}
      </div>

      {/* Faz 6 — Dev-only PerfHud overlay. Component kendi içinde flag
          kontrolü yapıyor (PCON_PERF_HUD default OFF, `?perfhud=1` ile
          açılır); flag OFF iken `null` döner ve DOM'a hiç eklenmez. */}
      <PerfHud />
    </div>
  );
}
