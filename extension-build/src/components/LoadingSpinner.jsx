import { Html } from "@react-three/drei";

export default function LoadingSpinner() {
  return (
    <Html center>
      <div className="pcon-loading" style={{ height: "auto" }}>
        <div className="pcon-loading__spinner" />
        <p className="pcon-loading__text">Loading 3D Model...</p>
      </div>
    </Html>
  );
}
