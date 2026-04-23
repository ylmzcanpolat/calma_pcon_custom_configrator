import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import ConfiguratorScene from "./components/ConfiguratorScene.jsx";
import useConfiguratorStore from "./store/configurator-store.js";

function Configurator({ config }) {
  const initialize = useConfiguratorStore((s) => s.initialize);

  useEffect(() => {
    initialize(config);
  }, [initialize, config]);

  return (
    <ConfiguratorScene
      canvasHeight={config.canvasHeight}
      environmentPreset={config.environmentPreset}
    />
  );
}

window.__pconConfiguratorInit = function (root, config) {
  root.innerHTML = "";
  const reactRoot = createRoot(root);
  reactRoot.render(<Configurator config={config} />);
};
