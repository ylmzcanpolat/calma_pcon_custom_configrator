import { useEffect, useState } from "react";

/**
 * Faz 6 — Dev-only Performance HUD overlay.
 *
 * Faz 0 perf recorder'ı (`window.__pconPerf` ring buffer) gerçek zamanlı
 * monitor için sağ-üst köşede minimal HUD. Production bundle'da default
 * KAPALI; sadece `?perfhud=1` query param veya `window.__pconConfig.perfHud
 * === true` ile açılır. Flag OFF iken `null` döner — DOM'a hiç eklenmez.
 *
 * Inline style kullanıyoruz (CSS module açma maliyeti yok, ~2 KB bundle
 * ekiyle sınırlı). pointer-events:none → kullanıcı etkileşimini engellemez.
 */

function isPerfHudEnabled() {
  if (typeof window === "undefined") return false;
  if (window.__pconConfig && window.__pconConfig.perfHud === true) return true;
  try {
    return window.location.search.indexOf("perfhud=1") !== -1;
  } catch {
    return false;
  }
}

const REFRESH_MS = 500;

const overlayStyle = {
  position: "fixed",
  top: "8px",
  right: "8px",
  zIndex: 999999,
  maxWidth: "240px",
  padding: "6px 8px",
  background: "rgba(0,0,0,0.72)",
  color: "#0f0",
  font: "10px/1.4 ui-monospace, Menlo, Consolas, monospace",
  borderRadius: "4px",
  pointerEvents: "none",
  whiteSpace: "pre-wrap",
  textAlign: "left",
};

function fmtMs(n) {
  if (n == null || !Number.isFinite(n)) return "?";
  return n + "ms";
}

export default function PerfHud() {
  const enabled = isPerfHudEnabled();
  // tick — `window.__pconPerf` array length değişimini "izlemenin" en hafif
  // yolu; gerçek subscriber yok (perf.js Array push kullanıyor). 500ms
  // throttle gözle algılanan freshness için yeterli ve render maliyeti
  // ihmal edilebilir.
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => setTick((t) => (t + 1) % 1000000), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled) return null;

  const samples =
    typeof window !== "undefined" && Array.isArray(window.__pconPerf)
      ? window.__pconPerf
      : [];
  const last = samples.length > 0 ? samples[samples.length - 1] : null;

  if (!last) {
    return (
      <div style={overlayStyle} role="status" data-testid="pcon-perf-hud">
        {"[pcon-perf]\nno samples yet"}
      </div>
    );
  }

  const dur = last.durations || {};
  const totalMs = dur.total;
  // Server total timing — backend `Server-Timing: total;dur=...` header'ından.
  const serverMs = last.serverTiming && last.serverTiming.total;
  const clientMs =
    Number.isFinite(totalMs) && Number.isFinite(serverMs)
      ? Math.round((totalMs - serverMs) * 100) / 100
      : null;

  const lines = [
    "op: " + (last.op || "—"),
    "propId: " + (last.propertyId || "—"),
    "total: " + fmtMs(totalMs) + " (server: " + fmtMs(serverMs) + ", client: " + fmtMs(clientMs) + ")",
  ];

  return (
    <div style={overlayStyle} role="status" data-testid="pcon-perf-hud">
      {lines.join("\n")}
    </div>
  );
}
