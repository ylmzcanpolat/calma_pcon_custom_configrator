# Faz 4: React Three Fiber (R3F) ile 3D Görselleştirme — Uygulama Kaydı

> Bu dosya Faz 4 kapsamında yapılan tüm değişiklikleri belgelemektedir.
> Sonraki fazlarda veya farklı bir agent ile çalışırken referans olarak kullanılabilir.

---

## Genel Bakış

Faz 4, Faz 3'te oluşturulan Theme App Extension bootloader'ının yüklediği ana React uygulamasını oluşturur. three.js + React Three Fiber (R3F) kullanılarak 3D model görselleştirmesi, Zustand ile state management, ve App Proxy üzerinden pCon API iletişimi sağlanır.

---

## Kurulan Paketler

Root `package.json`'a eklenen bağımlılıklar:

| Paket | Versiyon | Amaç |
|-------|---------|------|
| `three` | ^0.183.2 | 3D rendering engine |
| `@react-three/fiber` | ^9.5.0 | React renderer for three.js |
| `@react-three/drei` | ^10.7.7 | R3F helper hooks (useGLTF, Environment, OrbitControls) |
| `zustand` | ^5.0.12 | Minimal state management |

> **Not:** React ve React DOM zaten root dependencies'de mevcuttu.

---

## Oluşturulan Dosya Yapısı

> **KRİTİK:** Shopify CLI, theme app extension klasöründe SADECE `assets`, `blocks`, `snippets`, `locales` dizinlerine izin verir.
> Bu nedenle React kaynak kodu ve build config'i `extension-build/` klasöründe (proje root'unda) tutulur.
> Build output'u `extensions/pcon-3d-configurator/assets/` altına yazılır.

```
extension-build/                    # React kaynak kodu (proje root'unda)
├── vite.config.extension.js        # IIFE bundle build config
└── src/
    ├── App.jsx                     # Entry point + window.__pconConfiguratorInit
    ├── store/
    │   └── configurator-store.js   # Zustand store
    ├── components/
    │   ├── ConfiguratorScene.jsx   # Ana sahne (Canvas + R3F + UI overlay)
    │   ├── Model.jsx               # glTF model yükleyici (useGLTF)
    │   ├── LoadingSpinner.jsx      # 3D sahne içi loading
    │   ├── PriceDisplay.jsx        # Fiyat gösterimi
    │   └── PropertySelector.jsx    # Varyasyon seçim butonları
    └── utils/
        ├── api.js                  # App Proxy fetch wrapper
        └── url-sync.js             # URL ↔ State senkronizasyonu

extensions/pcon-3d-configurator/    # Shopify CLI'ın izin verdiği yapı
├── shopify.extension.toml
├── assets/
│   ├── configurator.js             # Faz 3'ten — Bootloader
│   ├── configurator.css            # Faz 3'ten — Stiller
│   └── configurator-app.js         # Build output (337KB gzipped)
├── blocks/
│   └── configurator.liquid         # App block
├── locales/
│   └── en.default.json
└── snippets/

app/routes/
└── pcon-proxy.assets.$.jsx         # Bundle'ı serve eden App Proxy route
```

---

## Dosya Detayları

### 1. Root `package.json` Build Script'leri

```json
{
  "build": "npm run build:extension && react-router build",
  "build:extension": "vite build --config extension-build/vite.config.extension.js",
  "dev:extension": "vite build --config extension-build/vite.config.extension.js --watch"
}
```

- `build:extension` — `extension-build/` kaynak kodunu build edip output'u `extensions/.../assets/` altına yazar
- `dev:extension` — Watch modunda build (geliştirme sırasında)
- `build` — Önce extension build, sonra ana app build

`shopify.web.toml` predev komutu `npm run build:extension` çalıştırır, böylece `shopify app dev` sırasında otomatik build olur.

### 2. `vite.config.extension.js`

- **Format:** IIFE (Immediately Invoked Function Expression) — storefront'ta global scope'a enjekte edilir
- **Entry:** `src/App.jsx`
- **Output:** `assets/configurator-app.js`
- **Minification:** esbuild (Vite varsayılanı)
- **Inline dynamic imports:** true (tek dosya çıktısı)
- **JSX:** React automatic runtime

### 3. `src/App.jsx` (Entry Point)

- `window.__pconConfiguratorInit(root, config)` fonksiyonunu global olarak dışa açar
- Bu fonksiyon Faz 3 bootloader'ı tarafından çağrılır
- `createRoot(root)` ile React uygulamasını mount eder
- `config` objesi bootloader'dan gelir:

```javascript
config = {
  articleNumber: string,    // pCon makale numarası
  manufacturerId: string,   // Üretici ID
  shopDomain: string,       // Mağaza domain'i
  proxyBase: string,        // "/apps/pcon-configurator"
  currency: string,         // "TRY", "EUR" vb.
  canvasHeight: number,     // 300-800px
  environmentPreset: string // "studio" | "apartment" | "warehouse" | "sunset"
}
```

### 4. `src/store/configurator-store.js` (Zustand Store)

**State:**

| Field | Tip | Açıklama |
|-------|-----|----------|
| `gltfUrl` | string \| null | Aktif 3D model URL'i |
| `price` | number \| null | Güncel fiyat |
| `currency` | string | Para birimi |
| `properties` | array | Konfigürasyon seçenekleri (pCon'dan) |
| `loading` | boolean | İlk yükleme durumu |
| `updating` | boolean | Property değişimi sırasında |
| `error` | string \| null | Hata mesajı |
| `proxyBase` | string | App Proxy base URL |
| `articleNumber` | string | pCon makale numarası |
| `manufacturerId` | string | Üretici ID |
| `itemId` | string \| null | pCon session item ID |

**Actions:**

| Action | Açıklama |
|--------|----------|
| `initialize(config)` | `/api/pcon/init` çağrısı, URL params'dan state restore |
| `applyUrlProperties(urlProps)` | URL'deki seçimleri pCon'a uygular |
| `updateProperty(key, value)` | Tek bir property değiştirir, optimistic update yapar |
| `setLoading(boolean)` | Loading state setter |
| `setError(string)` | Error state setter |

**Akış:**

```
initialize(config)
  ↓
initArticle API çağrısı → /api/pcon/init
  ↓
URL params kontrol et (readUrlProperties)
  ↓
┌── URL params var → applyUrlProperties() → /api/pcon/update
│
└── URL params yok → mevcut seçimleri URL'e yaz (syncCurrentToUrl)
```

**Property güncelleme akışı:**

```
updateProperty(key, value)
  ↓
Optimistic UI update (anında seçimi göster)
  ↓
URL güncelle (history.replaceState)
  ↓
updateProperties API çağrısı → /api/pcon/update
  ↓
┌── Başarılı → yeni gltfUrl, price, validOptions set et
│
└── Hata → önceki state'e geri dön
```

### 5. `src/utils/api.js` (API Client)

- `pconFetch(proxyBase, endpoint, options)` — Base fetch wrapper, 15s timeout, AbortController
- `initArticle(proxyBase, articleNumber, manufacturerId)` — GET init endpoint
- `updateProperties(proxyBase, properties, itemId)` — POST update endpoint

### 6. `src/utils/url-sync.js` (URL Senkronizasyonu)

- `readUrlProperties()` — URL'den `propClass.propName=value` formatındaki parametreleri okur
- `writeUrlProperties(properties)` — State'i URL parametrelerine yazar (`history.replaceState`)
- Sadece nokta (`.`) içeren parametreler pCon property olarak kabul edilir (Shopify'ın kendi parametreleriyle çakışmaz)

### 7. `src/components/Model.jsx`

- `useGLTF(url)` ile glTF model yükleme
- Otomatik centering: `Box3` ile model merkeze taşınır
- Otomatik kamera pozisyonlama: model boyutuna göre kamera uzaklığı hesaplanır
- URL değiştiğinde useGLTF otomatik olarak yeni modeli yükler

### 8. `src/components/ConfiguratorScene.jsx`

Ana sahne bileşeni. Üç durumu yönetir:

1. **Loading:** Spinner + metin
2. **Error:** İkon + hata mesajı
3. **Normal:** R3F Canvas + UI overlay

R3F Canvas yapısı:
- `<Environment preset={...} />` — HDR aydınlatma
- `<Suspense fallback={<LoadingSpinner />}>` — Model yükleme sırasında 3D sahne içi spinner
- `<Model url={gltfUrl} />` — glTF model
- `<ContactShadows />` — Zemin gölgesi
- `<OrbitControls />` — Fare ile döndürme/zoom (pan devre dışı)

UI overlay (Canvas üzerinde):
- `<PriceDisplay />` — Sağ üstte fiyat
- `<PropertySelector />` — Altta seçenek butonları
- `pcon-updating` overlay — Property değişimi sırasında yarı saydam overlay

### 9. `src/components/PriceDisplay.jsx`

- Zustand store'dan `price` ve `currency` okur
- `Intl.NumberFormat` ile para birimi formatlaması (TRY, EUR, USD vb.)
- Fiyat yoksa render etmez

### 10. `src/components/PropertySelector.jsx`

- `editable` ve `options.length > 0` olan property'leri filtreler
- Her property grubu için `PropertyGroup` alt bileşeni render eder
- İki buton tipi:
  - **Select:** Metin etiketli buton (`pcon-option-btn`)
  - **Color:** İkon/görsel içeren yuvarlak buton (`pcon-option-btn--color`)
- Aktif seçim: `pcon-option-btn--active`
- Kullanılamaz seçenek: `pcon-option-btn--disabled` (opacity + cursor)

### 11. `app/routes/pcon-proxy.assets.$.jsx` (App Proxy Route)

- `pcon-proxy/assets/*` URL pattern'ine eşlenen splat route
- `extensions/pcon-3d-configurator/assets/` klasöründen dosya serve eder
- Güvenlik: path traversal koruması (`..` ve `/` kontrolü)
- Desteklenen MIME types: `.js`, `.css`, `.json`
- Cache: `public, max-age=86400, immutable`
- CORS: `Access-Control-Allow-Origin: *`

Storefront'ta bootloader bu URL üzerinden bundle'ı yükler:
```
/apps/pcon-configurator/assets/configurator-app.js
  → App Proxy → /pcon-proxy/assets/configurator-app.js
    → pcon-proxy.assets.$.jsx (loader)
      → extensions/pcon-3d-configurator/assets/configurator-app.js
```

---

## Build Sonuçları

```
✓ 594 modules transformed
extensions/pcon-3d-configurator/assets/configurator-app.js  1,194.62 kB │ gzip: 337.23 kB
✓ built in 1.83s
```

| Metrik | Sonuç | Hedef (Spec) | Durum |
|--------|-------|-------------|-------|
| Bundle boyutu (gzipped) | 337 KB | < 500 KB | Hedefte |
| Build süresi | ~1.8s | — | Hızlı |
| Bootloader boyutu | ~1.5 KB | < 5 KB | Hedefte |

---

## Root `package.json` Değişiklikleri

Eklenen/güncellenen script'ler:
```json
{
  "build": "npm run build:extension && react-router build",
  "build:extension": "vite build --config extension-build/vite.config.extension.js",
  "dev:extension": "vite build --config extension-build/vite.config.extension.js --watch"
}
```

`shopify.web.toml` predev komutu da güncellendi:
```toml
predev = "npx prisma generate && npm run build:extension"
```

---

## Veri Akışı Özeti

```
[Storefront PDP]
  ↓ Shopify yükler
[configurator.liquid] → data-* attributes (metafield'lardan)
  ↓ schema "javascript"
[configurator.js] (bootloader, 1.5KB)
  ↓ dynamic <script> load
[configurator-app.js] (React bundle, 461KB gz)
  ↓ window.__pconConfiguratorInit(root, config)
[App.jsx] → createRoot → <Configurator>
  ↓ useEffect → initialize(config)
[configurator-store.js] → initArticle API call
  ↓ /apps/pcon-configurator/api/pcon/init
[pcon-proxy.api.pcon.init.jsx] → Redis cache → pCon EAIWS
  ↓ { gltfUrl, price, properties, currency, itemId }
[ConfiguratorScene.jsx]
  ├── <Canvas> + <Model url={gltfUrl}> (R3F 3D rendering)
  ├── <PriceDisplay> (formatted price)
  └── <PropertySelector> (option buttons)
        ↓ onClick → updateProperty(key, value)
      [configurator-store.js] → optimistic update → URL sync
        ↓ /apps/pcon-configurator/api/pcon/update
      [pcon-proxy.api.pcon.update.jsx] → Redis cache → pCon EAIWS
        ↓ { gltfUrl, price, validOptions }
      State güncelle → yeni model + fiyat render
```

---

## Bağımlılıklar (Önceki Fazlardan)

| Bileşen | Faz | Durum |
|---------|-----|-------|
| `shopify.app.toml` — App Proxy + Metafields | Faz 1 | Mevcut |
| `app/services/pcon-client.server.js` | Faz 1 | Mevcut |
| `app/routes/pcon-proxy.api.pcon.init.jsx` | Faz 1 | Mevcut |
| `app/routes/pcon-proxy.api.pcon.update.jsx` | Faz 1 | Mevcut |
| `app/services/redis-client.server.js` | Faz 2 | Mevcut |
| Extension shell (liquid, bootloader, CSS) | Faz 3 | Mevcut |

---

## Olası İyileştirmeler / Sonraki Adımlar

1. **Code splitting:** three.js'i ayrı chunk olarak yükleyerek ilk yükleme hızını artırma
2. **glTF preload:** `useGLTF.preload(url)` ile sonraki model URL'lerini önceden yükleme
3. **Error boundary:** React ErrorBoundary ile 3D rendering hatalarını yakalama
4. **Skeleton UI:** Loading sırasında 3D model silueti gösterme
5. **Touch support:** Mobilde pinch-zoom ve rotation gesture'ları
6. **CDN:** Build output'u CDN'e deploy ederek App Proxy yükünü azaltma

---

## Notlar

- Build output (`assets/configurator-app.js`) `.gitignore`'a eklenmeli (her deploy'da yeniden build edilir)
- `src/` klasörü development-only; Shopify storefront'a deploy edilmez
- `useGLTF` browser cache'i kullanır — aynı URL için tekrar indirme yapmaz
- Optimistic update pattern: kullanıcı seçim yaptığında UI anında güncellenir, API cevabı geldiğinde doğrulanır
- URL sync sadece nokta içeren parametreleri (`propClass.propName`) okur/yazar — Shopify'ın kendi query parametreleriyle çakışma riski yoktur
