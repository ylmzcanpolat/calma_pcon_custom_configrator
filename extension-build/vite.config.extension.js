import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/App.jsx"),
      name: "PconConfigurator",
      fileName: () => "configurator-app.js",
      formats: ["iife"],
    },
    outDir: resolve(__dirname, "../extensions/pcon-3d-configurator/assets"),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
      treeshake: {
        moduleSideEffects: false,
        preset: "recommended",
      },
    },
    minify: "esbuild",
    target: "es2020",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
    jsxDev: false,
  },
});
