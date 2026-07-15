import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/App.jsx"),
      // ESM çıktı — code-splitting'i mümkün kılar. IIFE/UMD tek dosyaya
      // zorladığı için (inlineDynamicImports) split imkânsızdı.
      formats: ["es"],
      // Ana giriş adı STABİL kalmalı: section ve bootloader buna referans verir.
      fileName: () => "configurator-app.js",
    },
    outDir: resolve(__dirname, "../extensions/pcon-3d-configurator/assets"),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        // inlineDynamicImports KALDIRILDI → Rollup dinamik import'ları
        // (ConfiguratorScene içindeki WCF importları) ayrı chunk'lara böler.
        // Chunk isimleri content-hash'li: Shopify CDN'de ham dosya adıyla
        // (asset_url ?v= cache-buster'ı olmadan) çekildikleri için deploy
        // bazında cache-bust yalnızca hash ile sağlanır.
        entryFileNames: "configurator-app.js",
        // Tüm build emisyonları "pcon-chunk-" prefix'ini paylaşır → tema
        // sync script'i stale temizliğinde yalnızca bu prefix'e dokunur,
        // temanın diğer pcon-*.js dosyalarına (ör. pcon-sync.js) ASLA dokunmaz.
        chunkFileNames: "pcon-chunk-[name]-[hash].js",
        assetFileNames: "pcon-chunk-[name]-[hash][extname]",
        // Ağır 3D motorunu (WCF + BabylonJS + jszip WCF bağımlılığı) tek bir
        // async "engine" chunk'ında topla. Bu modüller yalnızca dinamik
        // import ile erişildiğinden chunk async kalır: hafif shell (React +
        // UI + store) önce yüklenir, engine ConfiguratorScene mount olunca gelir.
        manualChunks(id) {
          if (
            id.includes("@easterngraphics/wcf") ||
            id.includes("@babylonjs") ||
            id.includes("/jszip/")
          ) {
            return "engine";
          }
          return undefined;
        },
      },
      treeshake: {
        moduleSideEffects: false,
        preset: "recommended",
      },
    },
    minify: "esbuild",
    target: "es2020",
  },
  // WCF ve BabylonJS native ESM kullandığından dev server pre-bundling dışında tutulur.
  optimizeDeps: {
    exclude: ["@easterngraphics/wcf", "@babylonjs/core"],
    include: ["jszip"],
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
