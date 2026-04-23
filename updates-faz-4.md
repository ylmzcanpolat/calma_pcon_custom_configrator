# Faz 4 — Frontend Bundle ve Yükleme Optimizasyonu

**Durum:** Tamamlandı  
**Tarih:** 2026-04-14

---

## Özet

Bu fazda frontend bundle boyutu azaltıldı, lazy loading eklendi, skeleton UI implemente edildi, resource hints tanımlandı ve GLTF yükleme sırasında progress gösterimi sağlandı.

**Bundle boyutu sonuçları:**
- Önceki tahmini boyut: ~2MB (minified, gzip öncesi)
- Yeni boyut: **1,145.57 KB** (minified) / **322.99 KB** (gzipped)
- Hedef: <500KB (gzipped) — **HEDEF AŞILDI**

---

## 4.1 Bundle Boyutu Azaltma

### a) Three.js Tree-Shaking

**Dosya:** `extension-build/src/components/Model.jsx`

`import * as THREE from "three"` yerine sadece kullanılan sınıflar import edildi:

```javascript
// Eski
import * as THREE from "three";
// ...
const box = new THREE.Box3().setFromObject(scene);
const center = box.getCenter(new THREE.Vector3());

// Yeni
import { Box3, Vector3 } from "three";
// ...
const box = new Box3().setFromObject(scene);
const center = box.getCenter(new Vector3());
```

Bu sayede Three.js'in kullanılmayan modülleri (audio, animation, loaders, geometries vb.) bundle'a dahil edilmiyor.

### b) drei Seçici (Deep) Import

**Dosya:** `extension-build/src/components/ConfiguratorScene.jsx`

drei barrel export yerine deep import path'leri kullanıldı:

```javascript
// Eski
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { Html } from "@react-three/drei";

// Yeni
import { Environment } from "@react-three/drei/core/Environment";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Html } from "@react-three/drei/web/Html";
```

**Not:** `Html` componenti `core/` değil `web/` altında bulunuyor — build sırasında doğrulandı.

### c) Vite Build Optimizasyonu

**Dosya:** `extension-build/vite.config.extension.js`

Rollup tree-shaking ayarları ve ES2020 target eklendi:

```javascript
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
```

- `moduleSideEffects: false` — Kullanılmayan importları agresif şekilde siler
- `preset: "recommended"` — Rollup'ın önerilen tree-shake ayarlarını aktifleştirir
- `target: "es2020"` — Modern JS output üretir, gereksiz polyfill'leri önler

---

## 4.2 Lazy Loading Stratejisi (IntersectionObserver)

**Dosya:** `extensions/pcon-3d-configurator/assets/configurator.js`

Configurator bundle'ı artık sayfa yüklendiğinde hemen indirilmiyor. `IntersectionObserver` ile kullanıcı configurator alanına 200px yaklaştığında yükleme başlıyor:

```javascript
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
```

- `rootMargin: "200px"` — Kullanıcı görünüm alanına 200px kala yükleme başlar
- `IntersectionObserver` desteklenmeyen eski tarayıcılarda fallback olarak hemen yükleme yapılır
- Tüm script yükleme mantığı `loadConfigurator()` fonksiyonuna taşındı

---

## 4.3 Skeleton / Placeholder UI

### Liquid Template

**Dosya:** `extensions/pcon-3d-configurator/blocks/configurator.liquid`

Eski loading spinner yerine CSS-only skeleton UI eklendi:

```html
<div class="pcon-skeleton">
  <div class="pcon-skeleton__viewer"></div>
  <div class="pcon-skeleton__sidebar">
    <div class="pcon-skeleton__price"></div>
    <div class="pcon-skeleton__props"></div>
    <div class="pcon-skeleton__props"></div>
    <div class="pcon-skeleton__props"></div>
  </div>
</div>
```

### CSS

**Dosya:** `extensions/pcon-3d-configurator/assets/configurator.css`

Skeleton stilleri eklendi:

```css
.pcon-skeleton {
  display: flex;
  gap: 24px;
  padding: 16px;
  animation: pcon-pulse 1.5s ease-in-out infinite;
}
.pcon-skeleton__viewer {
  flex: 2;
  aspect-ratio: 4 / 3;
  background: #f0f0f0;
  border-radius: 8px;
}
.pcon-skeleton__sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pcon-skeleton__price { height: 60px; background: #f0f0f0; border-radius: 8px; }
.pcon-skeleton__props { height: 80px; background: #f0f0f0; border-radius: 8px; }

@keyframes pcon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

Mobil responsive desteği de eklendi:

```css
@media (max-width: 768px) {
  .pcon-skeleton { flex-direction: column; }
  .pcon-skeleton__viewer { aspect-ratio: 16 / 9; }
}
```

---

## 4.4 Resource Hints

**Dosya:** `extensions/pcon-3d-configurator/blocks/configurator.liquid`

pCon API sunucusuna erken bağlantı için `preconnect` ve `dns-prefetch` eklendi:

```html
<link rel="preconnect" href="https://s2.eaiws.pcon-solutions.com" crossorigin>
<link rel="dns-prefetch" href="https://s2.eaiws.pcon-solutions.com">
```

Bu, GLTF modeli yüklenmeye başlamadan önce DNS çözümleme + TLS handshake'i tamamlar (~100-300ms tasarruf).

---

## 4.5 GLTF Yükleme Optimizasyonu (Progress Tracking)

### Model.jsx

**Dosya:** `extension-build/src/components/Model.jsx`

R3F'in `useLoader` hook'u yerine manuel `GLTFLoader.load()` kullanılarak progress tracking eklendi:

```javascript
const loader = new GLTFLoader();
loader.load(
  url,
  (loaded) => { /* onLoad — cache'e kaydet, state'e set et */ },
  (progress) => {
    const percent = (progress.loaded / progress.total) * 100;
    if (onProgress) onProgress(Math.round(percent));
  },
  (err) => { /* onError */ },
);
```

Ek özellikler:
- **GLTF Cache:** `gltfCache` Map ile aynı URL'ye tekrar istek atılmaz, cache'ten hemen yüklenir
- **Cleanup:** Component unmount olursa `cancelled` flag ile stale state güncellemesi engellenir
- **Error bubbling:** Hata durumunda `throw error` ile `ModelErrorBoundary`'ye hata iletilir

### ConfiguratorScene.jsx — Progress UI

**Dosya:** `extension-build/src/components/ConfiguratorScene.jsx`

Canvas içinde `ModelLoadingProgress` komponenti eklendi:

```javascript
function ModelLoadingProgress({ percent }) {
  return (
    <Html center>
      <div style={{ textAlign: "center", color: "#666", width: "200px" }}>
        <div style={{ width: "100%", height: "4px", background: "#e0e0e0", ... }}>
          <div style={{ width: percent + "%", background: "#333", ... }} />
        </div>
        <p>Loading model… {percent}%</p>
      </div>
    </Html>
  );
}
```

Bu, eski `<LoadingSpinner />` yerine Suspense fallback olarak kullanılır ve gerçek indirme yüzdesini gösterir.

---

## Değişen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `extension-build/src/components/Model.jsx` | Three.js tree-shaking, GLTF progress tracking, cache |
| `extension-build/src/components/ConfiguratorScene.jsx` | drei deep import, progress UI |
| `extension-build/vite.config.extension.js` | Rollup treeshake, ES2020 target |
| `extensions/pcon-3d-configurator/assets/configurator.js` | IntersectionObserver lazy loading |
| `extensions/pcon-3d-configurator/blocks/configurator.liquid` | Skeleton UI, resource hints |
| `extensions/pcon-3d-configurator/assets/configurator.css` | Skeleton stilleri, responsive |

---

## Build Doğrulama

```
vite v6.4.2 building for production...
✓ 356 modules transformed.
extensions/pcon-3d-configurator/assets/configurator-app.js  1,145.57 kB │ gzip: 322.99 kB
✓ built in 1.49s
```

Build başarılı. Gzipped boyut **322.99 KB** — hedef olan 500KB'nin altında.
