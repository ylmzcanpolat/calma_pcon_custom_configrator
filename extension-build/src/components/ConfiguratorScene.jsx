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

function ModelLoadingProgress({ percent }) {
  return (
    <Html center>
      <div style={{ textAlign: "center", color: "#666", width: "200px" }}>
        <div style={{
          width: "100%", height: "4px", background: "#e0e0e0",
          borderRadius: "2px", overflow: "hidden",
        }}>
          <div style={{
            width: percent + "%", height: "100%",
            background: "#333", borderRadius: "2px",
            transition: "width 0.2s ease",
          }} />
        </div>
        <p style={{ fontSize: "12px", marginTop: "8px" }}>
          Loading model… {percent}%
        </p>
      </div>
    </Html>
  );
}

const HDRI_URL =
  "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a/hdri/studio_small_03_1k.hdr";

const SPINNER_R = 28;
const SPINNER_C = 2 * Math.PI * SPINNER_R;

export default function ConfiguratorScene({ canvasHeight, environmentPreset }) {
  const gltfUrl = useConfiguratorStore((s) => s.gltfUrl);
  const loading = useConfiguratorStore((s) => s.loading);
  const updating = useConfiguratorStore((s) => s.updating);
  const error = useConfiguratorStore((s) => s.error);
  const [loadProgress, setLoadProgress] = useState(0);

  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerPct, setSpinnerPct] = useState(0);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (!updating) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowSpinner(true);
    setSpinnerPct(0);

    let fake = 0;
    const iv = setInterval(() => {
      fake = Math.min(fake + 2, 30);
      setSpinnerPct(fake);
    }, 100);
    return () => clearInterval(iv);
  }, [updating]);

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const handleProgress = useCallback((percent) => {
    setLoadProgress(percent);
    setSpinnerPct(30 + percent * 0.7);
    if (percent >= 100) {
      hideTimerRef.current = setTimeout(() => {
        setShowSpinner(false);
        setSpinnerPct(0);
      }, 400);
    }
  }, []);

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
            <Suspense fallback={<ModelLoadingProgress percent={loadProgress} />}>
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
          <div className="pcon-updating">
            <div className="pcon-progress-spinner">
              <svg viewBox="0 0 64 64" className="pcon-progress-spinner__svg">
                <circle
                  className="pcon-progress-spinner__track"
                  cx="32" cy="32" r={SPINNER_R}
                />
                <circle
                  className="pcon-progress-spinner__fill"
                  cx="32" cy="32" r={SPINNER_R}
                  style={{
                    strokeDasharray: SPINNER_C,
                    strokeDashoffset: SPINNER_C * (1 - spinnerPct / 100),
                  }}
                />
              </svg>
              <span className="pcon-progress-spinner__pct">
                {Math.round(spinnerPct)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pcon-sidebar">
        <PriceDisplay />
        <PropertySelector />
      </div>
    </div>
  );
}
