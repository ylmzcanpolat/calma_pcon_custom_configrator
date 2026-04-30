import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import ConfiguratorScene from "./components/ConfiguratorScene.jsx";
import useConfiguratorStore from "./store/configurator-store.js";
import {
  readVariantFromDom,
  subscribeVariantChanges,
} from "./utils/variant-detect.js";

function Configurator({ config }) {
  const initialize = useConfiguratorStore((s) => s.initialize);
  const setVariantId = useConfiguratorStore((s) => s.setVariantId);

  useEffect(() => {
    initialize(config);
  }, [initialize, config]);

  // Variant change tracking — tema seçici (variant-selects, form input vs.)
  // değiştiğinde store'daki variantId güncellenir. Önceliğimiz Liquid'in
  // bastığı initial value; ardından DOM'dan canlı okuma.
  useEffect(() => {
    const fromDom = readVariantFromDom();
    if (fromDom) setVariantId(fromDom);

    const unsubscribe = subscribeVariantChanges((variantId) => {
      setVariantId(variantId);
    });
    return unsubscribe;
  }, [setVariantId]);

  return (
    <ConfiguratorScene
      canvasHeight={config.canvasHeight}
      environmentPreset={config.environmentPreset}
    />
  );
}

window.__pconConfiguratorInit = function (root, config) {
  const mergedConfig = {
    ...config,
    customIcons: window.__pconCustomIcons || {},
  };
  root.innerHTML = "";
  const reactRoot = createRoot(root);
  reactRoot.render(<Configurator config={mergedConfig} />);
};
