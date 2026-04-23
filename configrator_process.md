# pCon 3D Configurator — Detaylı Teknik Dokümantasyon

Bu doküman, Shopify Theme App Extension olarak çalışan pCon 3D Configurator uygulamasının tüm teknik detaylarını, veri akışını, haberleşme protokollerini ve cache stratejisini açıklar.

**Son güncelleme:** 14 Nisan 2026 (Faz 9 — Son Doğrulama ve Performans Testi sonrası)

---

## İçindekiler

1. [Genel Mimari](#1-genel-mimari)
2. [Veri Akışı (End-to-End)](#2-veri-akışı-end-to-end)
3. [Shopify Tarafı — Theme App Extension](#3-shopify-tarafı--theme-app-extension)
4. [Frontend — React Uygulaması](#4-frontend--react-uygulaması)
5. [Backend — API Route'ları](#5-backend--api-routeları)
6. [pCon EAIWS Haberleşmesi](#6-pcon-eaiws-haberleşmesi)
7. [Cache Stratejisi (Redis + Disk + In-Memory)](#7-cache-stratejisi-redis--disk--in-memory)
8. [Otomatik Cache Warming](#8-otomatik-cache-warming)
9. [Dosya Yapısı ve Sorumlulukları](#9-dosya-yapısı-ve-sorumlulukları)
10. [Ortam Değişkenleri](#10-ortam-değişkenleri)
11. [Performans Optimizasyonları](#11-performans-optimizasyonları)
12. [Güvenlik ve Rate Limiting](#12-güvenlik-ve-rate-limiting)
13. [Monitoring ve Observability](#13-monitoring-ve-observability)
14. [Bilinen Kısıtlamalar ve Çözümleri](#14-bilinen-kısıtlamalar-ve-çözümleri)

---

## 1. Genel Mimari

```
┌─────────────────────────────────────────────────────────────────┐
│                      Shopify Storefront                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Liquid Block  │→│ Bootloader   │→│  React Bundle (IIFE)   │ │
│  │ (metafields) │  │ configurator │  │  configurator-app.js   │ │
│  │ + Skeleton UI│  │  .js (lazy)  │  │  325.89 KB gzip        │ │
│  └──────────────┘  └──────────────┘  └───────────┬───────────┘ │
└──────────────────────────────────────────────────│─────────────┘
                                                   │
                  ┌── GET /api/pcon/init ───────────┤
                  │   POST /api/pcon/update ────────┤
                  │   GET /gltf/*.glb ──────────────┤
                  │   GET /api/pcon/cache-stats ────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               Shopify App Proxy → Node.js App                   │
│  ┌─────────┐   ┌──────────────┐   ┌─────────────────────────┐ │
│  │  Redis   │←→│  API Routes  │←→│  PconSessionManager       │ │
│  │ (24h TTL)│   │  init/update │   │  (Session Pool, 3 slot)  │ │
│  └─────────┘   │  rate-limited│   │   └── PconClient ×3      │ │
│                 └──────────────┘   └───────────┬─────────────┘ │
│  ┌─────────┐                                   │               │
│  │ .cache/  │   ┌──────────────┐               ▼               │
│  │  gltf/   │←─│ Cache Warmer │   ┌─────────────────────────┐ │
│  │  *.glb   │   │ + Scheduler  │   │  pCon Cloud (EAIWS)     │ │
│  │  (Draco) │   │ (Katmanlı)   │   │  Gatekeeper + Basket API│ │
│  └─────────┘   └──────────────┘   └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Ana bileşenler:**
- **Shopify Theme App Extension**: Liquid bloğu + JavaScript + CSS (metafield kontrolü ile koşullu render)
- **React SPA (IIFE bundle)**: Three.js ile 3D görselleştirme, Zustand ile state yönetimi, DRACOLoader desteği
- **Node.js Backend**: React Router v7 üzerinde API route'ları, rate limiting, response headers
- **PconSessionManager**: Session pool (3 slot) ile concurrent pCon bağlantı yönetimi
- **pCon EAIWS**: 3D ürün konfigürasyonu için harici servis
- **Redis**: JSON response cache (24 saat TTL)
- **Disk Cache**: GLTF/GLB dosyaları (`.cache/gltf/`) — Draco compression + LRU eviction

---

## 2. Veri Akışı (End-to-End)

### 2.1 İlk Yükleme (Initialization)

```
Kullanıcı ürün sayfasını açar
         │
         ▼
┌─ Liquid Template ─────────────────────────────┐
│ 1. Metafield kontrolü:                        │
│    pcon_article_number != blank ise devam et   │
│    (yoksa hiçbir şey render edilmez)           │
│ 2. Preconnect + DNS prefetch hint'leri         │
│ 3. data-* attribute'ları ile #pcon-root oluşur│
│ 4. Skeleton UI (CSS-only pulse animasyonu)     │
│ 5. configurator.js bootloader yüklenir        │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ Bootloader (configurator.js) ────────────────┐
│ 1. IntersectionObserver: kullanıcı 200px       │
│    yaklaşınca bundle yüklemeyi başlat          │
│ 2. data-* attr'larından config oluşturur      │
│ 3. configurator-app.js'i CDN'den yükler       │
│    (başarısız olursa App Proxy fallback)       │
│ 4. crossOrigin="anonymous" ile yükleme        │
│ 5. window.__pconConfiguratorInit(root, config) │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ React App (Zustand store.initialize) ────────┐
│ 1. GET /apps/pcon-configurator/api/pcon/init  │
│    ?articleNumber=P12.01.101                   │
│    &manufacturerId=NRUS                        │
└───────────────────────┬───────────────────────┘
                        │ (Shopify App Proxy)
                        ▼
┌─ Backend (init route) ────────────────────────┐
│ 0. Rate limit kontrolü (30 req/min/IP)        │
│ 1. Redis cache kontrol:                       │
│    Key: pcon:init:<MD5(articleNumber+mfrId)>   │
│ 2. Cache HIT → JSON döndür + headers          │
│    (X-Cache-Status: HIT, X-Response-Time)     │
│ 3. Cache MISS:                                │
│    a. SessionManager.acquire() → PconClient   │
│    b. Promise.all([getArticleData,            │
│       getAllChoiceLists, getExportedGeometry]) │
│    c. Redis'e kaydet + GLTF disk cache        │
│    d. warmCacheInBackground başlat            │
│    e. SessionManager.release()                │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ Frontend (store güncellemesi) ────────────────┐
│ State güncellenir:                             │
│ - gltfUrl  → Three.js Canvas'ta model yüklenir│
│ - price    → PriceDisplay'de gösterilir        │
│ - properties → PropertySelector butonları      │
│ - itemId   → sonraki update istekleri için     │
│ - currency → fiyat formatlaması için           │
└────────────────────────────────────────────────┘
```

### 2.2 Property Değişikliği (Update)

```
Kullanıcı bir seçenek butonuna tıklar
         │
         ▼
┌─ Zustand store.updatePropertyWithRetry ──────┐
│ 1. Optimistic UI: property hemen güncellenir  │
│ 2. URL query string güncellenir               │
│ 3. Frontend in-memory cache kontrol:          │
│    - HIT → anında UI güncelle, API çağrısı YOK│
│    - MISS → debounce (150ms) sonra API çağrısı│
│ 4. Önceki devam eden istek AbortController    │
│    ile iptal edilir                            │
│ 5. Hata durumunda exponential backoff retry   │
│    (max 2 retry, 1s-2s arası)                 │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ POST /api/pcon/update ───────────────────────┐
│ Body: {                                        │
│   properties: { "CLASS.NAME": "value", ... },  │
│   itemId: "uuid",                              │
│   articleNumber: "P12.01.101",                 │
│   manufacturerId: "NRUS"                       │
│ }                                              │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ Backend işleme ──────────────────────────────┐
│ 0. Rate limit kontrolü                        │
│ 1. Redis cache kontrol:                       │
│    Key: pcon:update:<MD5(articleNumber+        │
│         manufacturerId+tüm property değerleri)>│
│ 2. Cache HIT → JSON döndür                    │
│ 3. Cache MISS:                                │
│    a. SessionManager.acquire()                │
│    b. Her property için setPropertyValue()     │
│       - "unknown property" hataları atlanır    │
│    c. Stale itemId → re-insert + retry        │
│    d. Promise.all([getArticleData,            │
│       getAllChoiceLists, getExportedGeometry]) │
│    e. Redis + disk cache                       │
│    f. SessionManager.release()                │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ Response JSON ───────────────────────────────┐
│ Headers:                                       │
│   Cache-Control: private, max-age=300          │
│   X-Cache-Status: HIT|MISS                     │
│   X-Response-Time: Xms                         │
│ Body: {                                        │
│   price: 7250,                                 │
│   gltfUrl: "https://s2.eaiws.pcon-solutions   │
│             .com/.../geometry.glb",            │
│   originalGltfUrl: "...",                      │
│   validOptions: [...],                         │
│   currency: "EUR"                              │
│ }                                              │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─ Frontend güncelleme ─────────────────────────┐
│ 1. gltfUrl → Three.js yeni modeli yükler      │
│    (crossfade animasyonu ile geçiş)            │
│ 2. price → PriceDisplay güncellenir           │
│ 3. validOptions → buton available/unavailable │
│    durumları güncellenir                       │
│ 4. Response in-memory cache'e eklenir         │
│ 5. Eski model scene dispose edilir            │
│    (geometry, material, texture temizliği)     │
└────────────────────────────────────────────────┘
```

---

## 3. Shopify Tarafı — Theme App Extension

### 3.1 Liquid Template (`configurator.liquid`)

Tüm configurator bloğu `{% if product.metafields['$app'].pcon_article_number.value != blank %}` koşuluna sarılıdır. pCon metafield'ı olmayan ürünlerde hiçbir şey render edilmez.

```liquid
{% if product.metafields['$app'].pcon_article_number.value != blank %}
<link rel="preconnect" href="https://s2.eaiws.pcon-solutions.com" crossorigin>
<link rel="dns-prefetch" href="https://s2.eaiws.pcon-solutions.com">

<div id="pcon-root"
  data-article-number="{{ product.metafields['$app'].pcon_article_number.value }}"
  data-manufacturer-id="{{ product.metafields['$app'].pcon_manufacturer_id.value }}"
  data-shop-domain="{{ shop.permanent_domain }}"
  data-proxy-base="/apps/pcon-configurator"
  data-currency="{{ shop.currency }}"
  data-canvas-height="{{ block.settings.canvas_height }}"
  data-environment-preset="{{ block.settings.environment_preset }}"
  data-bundle-url="{{ 'configurator-app.js' | asset_url }}"
>
  <!-- CSS-only Skeleton UI -->
  <div class="pcon-skeleton">
    <div class="pcon-skeleton__viewer"></div>
    <div class="pcon-skeleton__sidebar">
      <div class="pcon-skeleton__price"></div>
      <div class="pcon-skeleton__props"></div>
      <div class="pcon-skeleton__props"></div>
      <div class="pcon-skeleton__props"></div>
    </div>
  </div>
</div>
{% endif %}
```

**Gerekli Shopify Product Metafield'ları:**

| Metafield | Tip | Açıklama |
|-----------|-----|----------|
| `pcon_article_number` | `single_line_text_field` | pCon OFML article numarası (örn: `P12.01.101`) |
| `pcon_manufacturer_id` | `single_line_text_field` | pCon üretici kodu (örn: `NRUS`) |

Her iki metafield da `storefront: public_read` erişimine sahiptir, böylece Liquid template'ten okunabilir.

### 3.2 Bootloader (`configurator.js`)

**Lazy loading stratejisi:**
1. `IntersectionObserver` ile kullanıcı `#pcon-root` elementine 200px yaklaştığında yükleme başlar
2. `IntersectionObserver` desteklenmeyen tarayıcılarda fallback olarak hemen yüklenir
3. **Öncelikli**: Shopify CDN'den (`data-bundle-url` ile `{{ 'configurator-app.js' | asset_url }}`)
4. **Fallback**: App Proxy üzerinden (`/apps/pcon-configurator/assets/configurator-app.js`)
5. Script `crossOrigin = "anonymous"` ile yüklenir (CORS hata raporlaması için)

Her iki yolda da cache-busting `?v=timestamp` parametresi eklenir. Script yüklendiğinde `window.__pconConfiguratorInit(rootElement, config)` fonksiyonunu çağırır.

### 3.3 App Proxy Yapılandırması

`shopify.app.toml` içinde:
```toml
[app_proxy]
url = "/pcon-proxy"
prefix = "apps"
subpath = "pcon-configurator"
```

Bu yapılandırma ile:
- **Storefront URL**: `https://STORE.myshopify.com/apps/pcon-configurator/...`
- **Backend URL**: `https://APP_URL/pcon-proxy/...`

---

## 4. Frontend — React Uygulaması

### 4.1 Build Yapısı

React uygulaması `extension-build/` dizininde geliştirilir ve Vite ile tek bir IIFE bundle olarak derlenir:

- **Giriş noktası**: `extension-build/src/App.jsx`
- **Çıktı**: `extensions/pcon-3d-configurator/assets/configurator-app.js`
- **Format**: IIFE (Immediately Invoked Function Expression)
- **Minification**: esbuild (target: ES2020)
- **Tree-shaking**: `moduleSideEffects: false`, `preset: "recommended"`
- **JSX**: Production mode (`jsxDev: false`)
- **Bundle boyutu**: ~1,154 KB (minified) / ~326 KB (gzipped)

### 4.2 State Yönetimi (Zustand Store)

`configurator-store.js` uygulamanın merkezi state deposudur:

**State yapısı:**
```javascript
{
  gltfUrl: string | null,
  price: number | null,
  currency: string,
  properties: Property[],
  loading: boolean,
  updating: boolean,
  error: string | null,
  proxyBase: string,
  articleNumber: string,
  manufacturerId: string,
  itemId: string | null,
}
```

**Property veri yapısı:**
```javascript
{
  id: "DIS_RENK.MAT_PANEL",
  propClass: "DIS_RENK",
  propName: "MAT_PANEL",
  label: "Panel Rengi",
  type: "select" | "color" | "text",
  editable: boolean,
  currentValue: "FLT02",
  options: [
    {
      value: "FLT02",
      label: "Filt",
      icon: "https://..." | null,
      available: true
    }
  ]
}
```

**Request yönetimi:**
- **Debounce**: 150ms — kullanıcı hızlıca property değiştirdiğinde sadece son seçim için API çağrısı yapılır
- **AbortController**: Önceki devam eden istekler iptal edilir
- **Frontend in-memory cache**: `responseCache` (Map) — API yanıtlarını property kombinasyonuna göre saklar
- **Retry mekanizması**: Hata durumunda exponential backoff ile max 2 retry (1s, 2s arayla)

### 4.3 URL Senkronizasyonu

Kullanıcının konfigürasyonu URL query string'ine yansıtılır:
```
/products/calma?DIS_RENK.MAT_PANEL=FLT02&TYPE.DIMENSION=d_100_110
```

Bu sayede:
- Kullanıcı sayfayı yenilediğinde konfigürasyon korunur
- Konfigürasyon URL olarak paylaşılabilir

### 4.4 3D Görselleştirme

- **Three.js** + **@react-three/fiber** v8 + **@react-three/drei** v9 (React 18 uyumlu)
- **GLTFLoader**: pCon CDN'den doğrudan `.glb` dosyası yüklenir
- **DRACOLoader**: Google CDN'den decoder yüklenir (Draco-sıkıştırılmış dosyalar için)
- **Shared loader**: Modül seviyesinde tek GLTFLoader + DRACOLoader instance
- **GLTF Cache (LRU)**: Max 5 model cache'te tutulur, en eski entry dispose edilir
- **Environment**: Studio, Apartment, Warehouse, Sunset preset'leri
- **OrbitControls**: Kullanıcı modeli döndürebilir/yakınlaştırabilir
- **ContactShadows**: Zemine yumuşak gölge
- **Auto-framing**: Model boyutuna göre kamera otomatik konumlanır
- **Crossfade animasyonu**: Model değişiminde opacity fade-in (MathUtils.lerp)
- **Material restore**: Fade tamamlandığında orijinal material durumları geri yüklenir
- **Scene dispose**: Model değiştiğinde eski geometry, material, texture temizlenir
- **Progress tracking**: GLTF indirme yüzdesi UI'da gösterilir
- **Error Boundary**: GLTF yükleme hatalarında "Retry" butonu gösterilir

### 4.5 Bileşen Hiyerarşisi

```
App.jsx
  └── Configurator
        └── ConfiguratorScene
              ├── [loading] → Loading spinner
              ├── [error] → Error mesajı
              └── [ready] → pcon-configurator (flex layout)
                    ├── pcon-viewer
                    │     ├── Canvas (Three.js)
                    │     │     ├── Environment
                    │     │     ├── Model (key={gltfUrl})
                    │     │     │     ├── GLTFLoader + DRACOLoader
                    │     │     │     ├── Crossfade animasyonu
                    │     │     │     └── LRU cache (max 5)
                    │     │     ├── ModelLoadingProgress (indirme %)
                    │     │     ├── ContactShadows
                    │     │     └── OrbitControls
                    │     └── [updating] → Subtle progress bar
                    └── pcon-sidebar
                          ├── PriceDisplay
                          └── PropertySelector
                                └── PropertyGroup (her editable prop için)
                                      └── option buttons (updatePropertyWithRetry)
```

---

## 5. Backend — API Route'ları

### 5.1 GET `/api/pcon/init`

**Dosya**: `app/routes/pcon-proxy.api.pcon.init.jsx`

**Query parametreleri:**
| Parametre | Zorunlu | Açıklama |
|-----------|---------|----------|
| `articleNumber` | Evet | pCon OFML article numarası |
| `manufacturerId` | Hayır | pCon üretici kodu |

**İşlem akışı:**
1. `authenticate.public.appProxy(request)` — Shopify imza doğrulaması
2. Rate limit kontrolü (30 req/min/IP)
3. Redis cache kontrol → `pcon:init:<MD5(articleNumber + manufacturerId)>`
4. **Cache HIT**: JSON body + headers (`X-Cache-Status: HIT`, `X-Response-Time`)
5. **Cache MISS**:
   - `SessionManager.acquire()` → PconClient al
   - `client.getArticleData()` çağır (paralel: articleData + choiceLists + GLTF)
   - GLTF dosyasını arka planda disk cache'e indir (`cacheGltf`, await edilmez)
   - Redis'e kaydet (hem `gltfUrl` hem `originalGltfUrl` dahil)
   - `warmCacheInBackground()` ile arka planda property kombinasyonlarını ön-cache'le
   - `SessionManager.release()` ile session'ı geri bırak

**Response headers:**
| Header | Değer |
|--------|-------|
| `Cache-Control` | `private, max-age=300` |
| `X-Cache-Status` | `HIT` veya `MISS` |
| `X-Response-Time` | `Xms` |

### 5.2 POST `/api/pcon/update`

**Dosya**: `app/routes/pcon-proxy.api.pcon.update.jsx`

**Request body:**
```json
{
  "properties": {
    "DIS_RENK.MAT_PANEL": "FLT02",
    "TYPE.DIMENSION": "d_100_110"
  },
  "itemId": "uuid",
  "articleNumber": "P12.01.101",
  "manufacturerId": "NRUS"
}
```

**İşlem akışı:**
1. Shopify imza doğrulaması + rate limit kontrolü
2. Redis cache kontrol → `pcon:update:<MD5(articleNumber + manufacturerId + tüm property değerleri)>`
3. **Cache HIT**: Döndür (`originalGltfUrl` tercih edilir)
4. **Cache MISS**:
   - `SessionManager.acquire()`
   - Properties'i `{ propClass, propName, value }` dizisine dönüştür
   - `client.setPropertyValue()` çağır
   - **Stale itemId** hatası → article'ı yeniden insert et ve tekrar dene
   - **Unknown property** hatası → o property'i atla, devam et
   - `Promise.all([getArticleData, getAllChoiceLists, getExportedGeometry])`
   - Redis + disk cache
   - `SessionManager.release()`

**Hata response (production):**
```json
{ "error": "Failed to update pCon configuration" }
```
Development ortamında `detail` alanı da eklenir.

### 5.3 GET `/gltf/*.glb`

**Dosya**: `app/routes/pcon-proxy.gltf.$.jsx`

Disk cache'teki GLTF dosyalarını servis eder. Güvenlik kontrolleri:
- Sadece `.glb` uzantılı dosyalar
- Path traversal koruması (`..`, `/` içeremez)
- `Content-Type: model/gltf-binary`
- `Cache-Control: public, max-age=604800, immutable`
- `Access-Control-Allow-Origin: *`

### 5.4 GET `/api/pcon/cache-stats`

**Dosya**: `app/routes/pcon-proxy.api.pcon.cache-stats.jsx`

**Kimlik doğrulama**: `authenticate.admin` (Shopify admin paneli)

Cache durumu ve istatistiklerini döndürür:
```json
{
  "redis": {
    "connected": true,
    "totalKeys": 156,
    "initKeys": 3,
    "updateKeys": 153
  },
  "gltfDisk": {
    "totalFiles": 104,
    "totalSizeMB": 4800,
    "maxSizeMB": 5000
  },
  "lastWarming": {
    "timestamp": "2026-04-14T03:00:00Z",
    "products": 3,
    "warmed": 128,
    "skipped": 12,
    "durationSeconds": 512
  }
}
```

---

## 6. pCon EAIWS Haberleşmesi

### 6.1 Session Pool Yönetimi (PconSessionManager)

Singleton `PconClient` yerine session pool kullanılır:

```
┌─ PconSessionManager (pool) ──────────────────────┐
│                                                    │
│  Slot 1: PconClient → EaiwsSession (idle/inUse)  │
│  Slot 2: PconClient → EaiwsSession (idle/inUse)  │
│  Slot 3: PconClient → EaiwsSession (idle/inUse)  │
│                                                    │
│  Bekleme kuyruğu: [waiter1, waiter2, ...]         │
│  Idle timeout: 5 dakika                            │
│  Cleanup interval: 60 saniye                       │
│  Acquire timeout: 30 saniye                        │
└───────────────────────────────────────────────────┘
```

**API:**
```javascript
const manager = getSessionManager();
const client = await manager.acquire();
try {
  // pCon işlemleri
} finally {
  manager.release(client);
}
```

**`acquire()` akışı:**
1. Pool'da idle session var mı? → `isConnected()` kontrol → kullan veya reconnect
2. Pool dolu değilse yeni PconClient oluştur
3. Pool doluysa bekleme kuyruğuna gir (30s timeout)

### 6.2 Bağlantı Süreci

```
App Server                    pCon Gatekeeper                pCon EAIWS
    │                              │                              │
    │  POST /v2/session/{ID}       │                              │
    │  { locale: "tr_TR" }         │                              │
    │─────────────────────────────→│                              │
    │                              │                              │
    │  { server, sessionId,        │                              │
    │    keepAliveInterval }       │                              │
    │←─────────────────────────────│                              │
    │                              │                              │
    │  session.connect(server, sessionId, keepAliveMs)            │
    │────────────────────────────────────────────────────────────→│
    │                              │                              │
    │  Connected ✓                 │                              │
    │←────────────────────────────────────────────────────────────│
```

**Retry mekanizması**: Bağlantı başarısız olursa 3 denemeye kadar tekrar eder (2 saniye arayla).

### 6.3 Article İşlemleri (Paralel)

**Veri toplama (Promise.all ile paralel):**
```javascript
const [articleData, choiceLists, gltfUrl] = await Promise.all([
  session.basket.getArticleData(itemId, { ... }),
  session.basket.getAllChoiceLists(itemId, { ... }),
  session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
]);
```

Bu paralel çalışma init cache miss durumunda **%40-50 süre azalması** sağlar.

### 6.4 Property Mapping (`property-mapper.server.js`)

pCon'dan gelen ham property verileri frontend'e uygun formata dönüştürülür (ortak modül):

**Dönüşüm kuralları:**
- `visible: false` olan property'ler filtrelenir
- `choiceList` yoksa `type: "text"`
- `choiceList` var + seçeneklerde icon varsa `type: "color"`
- `choiceList` var + icon yoksa `type: "select"`
- `id` formatı: `propClass.propName` (örn: `DIS_RENK.MAT_PANEL`)

### 6.5 Hata Yönetimi

| Hata | Sebep | Çözüm |
|------|-------|-------|
| `unknown item id` | pCon session süresi dolmuş, itemId geçersiz | Article yeniden insert edilir, yeni itemId ile tekrar denenir |
| `unknown property` | Read-only veya tanınmayan property set edilmeye çalışılıyor | Property atlanır, diğer property'lerle devam edilir |
| `request-application-not-allowed` | Gatekeeper ID hatalı veya yetki yok | Gatekeeper v2 API kullanılmalı |

---

## 7. Cache Stratejisi (Redis + Disk + In-Memory)

### 7.1 Redis Cache

**Key formatı**: `pcon:<prefix>:<MD5_hash>`

| Prefix | Hash içeriği | Değer |
|--------|-------------|-------|
| `init` | `{ articleNumber, manufacturerId }` | `{ price, gltfUrl, originalGltfUrl, properties, currency, itemId }` |
| `update` | `{ articleNumber, manufacturerId, ...tüm_property_değerleri }` | `{ price, gltfUrl, originalGltfUrl, validOptions, currency }` |
| `warm:status:<article>` | — | `{ articleNumber, lastWarmed, totalCombinations, warmed, skipped, failed, durationSeconds }` |
| `warm:last-cycle` | — | Warming cycle sonuç özeti |

**TTL**: 24 saat (86400 saniye) — warming metadata 7 gün

**Cache key oluşturma:**
```javascript
function generateCacheKey(prefix, data) {
  const sorted = Object.keys(data).sort().reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {});
  const hash = createHash("md5").update(JSON.stringify(sorted)).digest("hex");
  return `pcon:${prefix}:${hash}`;
}
```

> **Önemli**: Update cache key'inde `itemId` kullanılMAZ. Bu sayede farklı pCon session'larında aynı konfigürasyon kombinasyonu cache'ten dönebilir. `manufacturerId` ise dahil edilir.

### 7.2 Disk GLTF Cache

- **Dizin**: `.cache/gltf/`
- **Dosya adı**: `<MD5(remote_url)>.glb`
- **Draco compression**: `gltf-pipeline` ile compression level 7 (tahmini %40-60 boyut azalma)
- **LRU eviction**: `GLTF_CACHE_MAX_SIZE_MB` (varsayılan: 5000MB) aşıldığında en eski dosyalar silinir
- **Fallback**: Compression başarısız olursa orijinal buffer kullanılır
- **Servis**: `GET /apps/pcon-configurator/gltf/<hash>.glb` route'u ile

### 7.3 Frontend In-Memory Cache

- **Tür**: JavaScript `Map` (sayfa yaşam döngüsü boyunca)
- **Key**: Property değerlerinin sıralı string birleşimi (`id=value&...`)
- **Etki**: Aynı property kombinasyonuna tekrar dönüldüğünde API çağrısı yapılmaz, anında UI güncellenir

### 7.4 Frontend GLTF Cache (LRU)

- **Tür**: JavaScript `Map` (max 5 entry)
- **Key**: GLTF URL
- **LRU**: En eski erişilen entry dispose edilir (geometry, material, texture)
- **GPU memory sınırı**: Max 5 model ≈ ~250MB

### 7.5 Cache Katmanları Özeti

```
Kullanıcı tıklaması
     │
     ▼
[1] Frontend In-Memory Response Cache (Map)
     │ MISS
     ▼
[2] Debounce (150ms) + AbortController
     │
     ▼
[3] Redis Cache (24h TTL)
     │ MISS
     ▼
[4] pCon EAIWS API (canlı istek, paralel)
     │
     ├──→ Redis'e yaz
     ├──→ GLTF'i disk'e indir (arka plan, Draco compressed)
     ├──→ Frontend response cache'e yaz
     └──→ warmCacheInBackground başlat
```

---

## 8. Otomatik Cache Warming

### 8.1 Katmanlı Warming Stratejisi (`article-warmer.server.js`)

| Katman | Açıklama | Kombinasyon |
|--------|----------|------------|
| **1** | Varsayılan konfigürasyon (init data) | 1 per article |
| **2** | Tek property değişimi kombinasyonları | N (her editable property × her option) |
| **3** | İlk 3 property'nin ikili çapraz kombinasyonları | N×M (isteğe bağlı) |

**Concurrency**: `CACHE_WARM_CONCURRENCY` (varsayılan: 2) ile paralel warming

**Retry**: Başarısız kombinasyonlar 1 kez daha denenir (1s arası)

**Progress callback**: Her adımda `onProgress({ phase, current, total, detail })` formatında raporlama

**Metadata**: Her article için Redis'e warming sonuç istatistikleri kaydedilir (7 gün TTL)

### 8.2 Arka Plan Pre-Warming (`cache-warmer.server.js`)

İlk article yüklemesinden sonra otomatik başlar:
- `SessionManager.acquire()` ile pool'dan session alır
- Her editable property'nin her available seçeneği için cache kontrol + warming
- `SessionManager.release()` ile session'ı geri bırakır
- Aynı article için eşzamanlı warming engellenir (`warmingInProgress` Set)

### 8.3 Günlük Zamanlanmış Warming (`cache-scheduler.server.js`)

- **Zamanlama**: `node-cron` ile günde 2 kere (varsayılan: 03:00 ve 15:00)
- **CRON ifadesi**: `process.env.CACHE_WARM_CRON || "0 3,15 * * *"`
- **Başlatma**: `app/entry.server.jsx` içinde `startCacheScheduler()` çağrılır
- **Sonuç kayıt**: Redis'e `pcon:warm:last-cycle` key'i (7 gün TTL)

**Akış:**
1. `fetchPconProducts()` → Shopify Admin GraphQL API ile `pcon_article_number` metafield'i dolu tüm ürünleri al (filtrelenmiş sorgu)
2. Her ürün için `warmArticle()` çağır (katmanlı warming)

### 8.4 Manuel Warming (`scripts/warm-cache.js`)

```bash
# Tüm Shopify ürünlerini warm et (Layer 1+2)
npm run warm-cache

# Belirli bir article'ı warm et
npm run warm-cache -- --article P12.01.101 --manufacturer NRUS

# Full kombinasyon (Katman 1 + 2 + 3)
npm run warm-cache -- --layers 1,2,3

# Dry-run (ne yapılacağını göster, çalıştırma)
npm run warm-cache -- --dry-run

# Detaylı progress ile
npm run warm-cache -- --verbose
```

---

## 9. Dosya Yapısı ve Sorumlulukları

```
3-d-test-app/
├── app/
│   ├── entry.server.jsx              # Server giriş noktası, cache scheduler başlatır
│   ├── shopify.server.js             # Shopify API + session yönetimi
│   ├── routes/
│   │   ├── pcon-proxy.api.pcon.init.jsx    # GET  /api/pcon/init (rate-limited)
│   │   ├── pcon-proxy.api.pcon.update.jsx  # POST /api/pcon/update (rate-limited)
│   │   ├── pcon-proxy.api.pcon.cache-stats.jsx  # GET /api/pcon/cache-stats (admin)
│   │   ├── pcon-proxy.gltf.$.jsx           # GET  /gltf/*.glb
│   │   └── pcon-proxy.assets.$.jsx         # GET  /assets/*.js (static)
│   └── services/
│       ├── pcon-client.server.js       # pCon EAIWS client (connect, article ops)
│       ├── pcon-session-manager.server.js  # Session pool yönetimi (acquire/release)
│       ├── redis-client.server.js      # Redis bağlantı + cache get/set + health
│       ├── gltf-cache.server.js        # GLTF disk cache + Draco compression + LRU eviction
│       ├── cache-warmer.server.js      # Arka plan pre-warming (session pool ile)
│       ├── article-warmer.server.js    # Bağımsız article warming (katmanlı strateji)
│       ├── cache-scheduler.server.js   # Günlük cron zamanlayıcı
│       ├── product-fetcher.server.js   # Shopify GraphQL ile ürün listesi (filtrelenmiş)
│       ├── property-mapper.server.js   # Ortak property mapping utility
│       └── rate-limiter.server.js      # IP tabanlı rate limiting
│
├── extension-build/
│   ├── vite.config.extension.js       # IIFE bundle Vite yapılandırması (ES2020, tree-shaking)
│   └── src/
│       ├── App.jsx                    # React giriş, __pconConfiguratorInit
│       ├── store/
│       │   └── configurator-store.js  # Zustand: debounce, AbortController, retry, in-memory cache
│       ├── utils/
│       │   ├── api.js                 # API fetch (external signal desteği)
│       │   └── url-sync.js            # URL query string senkronizasyonu
│       └── components/
│           ├── ConfiguratorScene.jsx  # Ana sahne + layout + subtle progress bar
│           ├── Model.jsx              # Three.js GLTFLoader + DRACOLoader + LRU + crossfade
│           ├── PropertySelector.jsx   # Property butonları (updatePropertyWithRetry)
│           ├── PriceDisplay.jsx       # Fiyat gösterimi
│           └── LoadingSpinner.jsx     # Yükleme göstergesi
│
├── extensions/
│   └── pcon-3d-configurator/
│       ├── blocks/
│       │   └── configurator.liquid    # Shopify Liquid (metafield koşullu, skeleton UI)
│       └── assets/
│           ├── configurator.js        # Bootloader (IntersectionObserver lazy loading)
│           ├── configurator-app.js    # Build çıktısı (React bundle, ~326KB gzip)
│           └── configurator.css       # Stiller (skeleton, progress bar, responsive)
│
├── scripts/
│   └── warm-cache.js                  # Manuel cache warming CLI (katmanlı, dry-run)
│
├── prisma/
│   └── schema.prisma                  # Shopify session storage
│
├── .cache/
│   └── gltf/                          # GLTF disk cache (Draco compressed, LRU evicted)
│       └── *.glb
│
├── shopify.app.toml                   # Shopify uygulama yapılandırması
├── shopify.web.toml                   # Web process yapılandırması
├── BASELINE.md                        # Faz 0 referans ölçümleri
└── package.json                       # Bağımlılıklar ve script'ler
```

---

## 10. Ortam Değişkenleri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|----------|---------|------------|----------|
| `PCON_GATEKEEPER_ID` | Evet | — | pCon Gatekeeper kimlik kodu |
| `REDIS_URL` | Hayır | `redis://localhost:6379` | Redis bağlantı URL'si |
| `PCON_LOCALE` | Hayır | `tr_TR` | pCon session dili |
| `CACHE_WARM_CRON` | Hayır | `0 3,15 * * *` | Cache warming cron ifadesi (günde 2 kere: 03:00 ve 15:00) |
| `PCON_SESSION_POOL_SIZE` | Hayır | `3` | Paralel pCon Gatekeeper session sayısı |
| `GLTF_CACHE_MAX_SIZE_MB` | Hayır | `5000` | Disk GLTF cache max boyutu (MB) |
| `CACHE_WARM_CONCURRENCY` | Hayır | `2` | Warming paralel istek sayısı |
| `SHOPIFY_API_VERSION` | Hayır | `2025-04` | Shopify Admin API versiyonu |
| `RATE_LIMIT_PER_MINUTE` | Hayır | `30` | IP başına dakikada max istek sayısı |

---

## 11. Performans Optimizasyonları

### 11.1 Backend Optimizasyonları

| Optimizasyon | Faz | Etki |
|-------------|-----|------|
| Session pool (acquire/release) | 1 | Race condition çözüldü, concurrent kullanıcı desteği |
| pCon API çağrıları paralelizasyonu | 3 | Init cache miss süresi %40-50 azaldı |
| Response headers (Cache-Control, X-Cache-Status, X-Response-Time) | 3 | Tarayıcı cache + observability |
| Production'da hata detayları gizleme | 3 | Güvenlik |
| Rate limiting (30 req/min/IP) | 7 | DDoS/abuse koruması |
| DRY: Ortak property-mapper modülü | 7 | Bakım kolaylığı |

### 11.2 Frontend Optimizasyonları

| Optimizasyon | Faz | Etki |
|-------------|-----|------|
| Three.js tree-shaking (named imports) | 4 | Bundle boyutu azaldı |
| drei deep imports | 4 | Bundle boyutu azaldı |
| Vite ES2020 target + aggressive tree-shake | 4 | Bundle boyutu azaldı |
| IntersectionObserver lazy loading | 4 | İlk sayfa yükleme hızı arttı |
| Skeleton UI (CSS-only) | 4 | Algılanan yükleme süresi azaldı |
| Resource hints (preconnect, dns-prefetch) | 4 | DNS + TLS ~100-300ms tasarruf |
| GLTF progress tracking | 4 | Kullanıcıya indirme durumu gösterimi |
| Request debounce (150ms) | 5 | Gereksiz API çağrıları engellendi |
| AbortController | 5 | Eski istekler iptal edildi |
| Crossfade model geçişi | 5 | Smooth UX |
| Scene dispose (geometry, material, texture) | 5 | Memory leak engellendi |
| Subtle progress bar (updating) | 5 | Bloklayıcı olmayan UX |
| Retry mekanizması (exponential backoff) | 5 | Geçici hatalara dayanıklılık |
| LRU GLTF cache (max 5 entry) | 6 | GPU memory sınırlı (≈250MB) |
| DRACOLoader desteği | 6 | Sıkıştırılmış model desteği |
| Fade animation optimizasyonu (erken çıkış) | 6 | Fade sonrası frame cost ≈ 0ms |
| Material restore | 6 | Orijinal material durumu korunur |

### 11.3 Cache Warming Optimizasyonları

| Optimizasyon | Faz | Etki |
|-------------|-----|------|
| GraphQL filtrelenmiş product sorgusu | 2 | Gereksiz ürün çekimi engellendi |
| Katmanlı warming (Layer 1/2/3) | 2 | Stratejik kombinasyon önceden cache |
| Paralel warming (concurrency) | 2 | Warming süresi kısaldı |
| Draco compression (disk cache) | 6 | Disk kullanımı ~%50 azaldı |
| LRU disk eviction | 6 | Disk dolma riski engellendi |

### 11.4 Bootloader Optimizasyonları

| Optimizasyon | Faz | Etki |
|-------------|-----|------|
| setTimeout(100) kaldırıldı | 8 | -100ms init gecikmesi |
| crossOrigin="anonymous" | 8 | Detaylı CORS hata raporlaması |
| Metafield koşullu render | 8 | Non-pCon ürünlerde sıfır JS yükü |

---

## 12. Güvenlik ve Rate Limiting

### 12.1 Shopify App Proxy Doğrulaması

Tüm API route'ları `authenticate.public.appProxy(request)` ile Shopify imza doğrulamasından geçer.

### 12.2 Rate Limiting

- **Limit**: 30 istek / dakika / IP (`RATE_LIMIT_PER_MINUTE` env)
- **Sliding window**: 60 saniyelik pencere
- **IP tespiti**: `x-forwarded-for` header (ilk IP adresi)
- **Memory cleanup**: 5 dakikada bir expired entry'ler temizlenir
- **Aşıldığında**: 429 Too Many Requests + `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` headers
- **Uygulanan route'lar**: init, update

### 12.3 Hata Gizleme

Production ortamında API hata response'larında `err.message` detayı döndürülmez. Sadece genel hata mesajı verilir. Development'ta `detail` alanı dahil edilir.

### 12.4 Path Traversal Koruması

GLTF route'unda `..` ve `/` karakterleri kontrol edilir, sadece `.glb` uzantılı dosyalar servis edilir.

---

## 13. Monitoring ve Observability

### 13.1 Response Headers

Her API response'unda:
- `X-Cache-Status: HIT|MISS` — Redis cache hit/miss durumu
- `X-Response-Time: Xms` — İstek işleme süresi

### 13.2 Cache Stats API

`GET /api/pcon/cache-stats` (admin auth ile) endpoint'i:
- Redis bağlantı durumu ve key sayıları
- GLTF disk cache istatistikleri
- Son warming cycle sonuçları

### 13.3 Redis Health Check

`isRedisHealthy()` fonksiyonu Redis'e PING göndererek bağlantı durumunu kontrol eder.

### 13.4 Console Logging

Tüm backend servisleri structered prefix ile log üretir:
- `[PconClient]`, `[SessionManager]`, `[Redis]`, `[gltf-cache]`, `[cache-scheduler]`, `[article-warmer]`, `[pcon/init]`, `[pcon/update]`

---

## 14. Bilinen Kısıtlamalar ve Çözümleri

### 14.1 GLTF Dosya Boyutu (~50MB)

**Sorun**: pCon GLTF dosyaları ~50MB boyutunda.

**Çözümler**:
- Frontend'e orijinal pCon CDN URL'si (`originalGltfUrl`) döndürülür
- Disk cache'e Draco compression ile yazılır (~25MB)
- LRU eviction ile disk boyutu kontrol altında
- Frontend LRU cache ile max 5 model GPU memory'de

### 14.2 pCon Session Ömrü (itemId geçerliliği)

**Sorun**: pCon EAIWS session'ları belirli bir süre sonra sona erer.

**Çözüm**: Update route'unda `unknown item id` hatası algılandığında article otomatik olarak yeniden insert edilir ve istek tekrarlanır.

### 14.3 Read-only Property'ler

**Sorun**: Frontend tüm property değerlerini gönderir.

**Çözüm**: `setPropertyValue` çağrısında `unknown property` hataları yakalanır ve sessizce atlanır.

### 14.4 React / Three.js Versiyon Uyumu

**Sorun**: `@react-three/fiber` v9 ve `@react-three/drei` v10, React 19 gerektirir. Proje React 18 kullanır.

**Çözüm**: `@react-three/fiber` ~8.18, `@react-three/drei` ~9.122 versiyonları sabitlenmiştir.

### 14.5 Redis Cache Key Stratejisi

**Sorun**: `itemId` session'a özgüdür.

**Çözüm**: Update cache key'i `articleNumber` + `manufacturerId` + tüm property değerlerinden oluşur. `itemId` dahil edilmez.

### 14.6 pCon EAIWS Draco Export Desteği Yok

**Sorun**: pCon EAIWS API'si native Draco export desteklemiyor.

**Çözüm**: Backend disk cache aşamasında `gltf-pipeline` ile Draco compression uygulanır. Frontend'de DRACOLoader ile decode edilir.
