# pCon 3D Configurator — Shopify App Specification

> Bu döküman, Shopify React Router app boilerplate üzerinde pCon EAIWS entegrasyonu ile 3D ürün konfigüratörü geliştirmek için referans spesifikasyondur.
> Shopify MCP'den alınan güncel dokümantasyon bilgileri ile güncellenmiştir.

---

## 0. Mevcut Durum Analizi

### Boilerplate Yapısı
- **Framework:** React Router 7 + Vite 6
- **Session Storage:** Prisma (SQLite) — `@shopify/shopify-app-session-storage-prisma`
- **API Version:** `October25` (kod tarafı); `shopify.app.toml` içinde `2026-07`
- **Auth:** `@shopify/shopify-app-react-router` — `authenticate.admin`, `authenticate.public.appProxy`
- **Extensions:** `extensions/` klasörü mevcut ama boş; `package.json` workspaces ayarı yapılmış

### Mevcut Dosya Yapısı
```
3-d-test-app/
├── app/
│   ├── db.server.js          # Prisma client singleton
│   ├── entry.server.jsx      # SSR stream
│   ├── root.jsx               # HTML shell
│   ├── routes.js              # flatRoutes()
│   ├── shopify.server.js      # shopifyApp config
│   └── routes/
│       ├── app.jsx            # Embedded layout + AppProvider
│       ├── app._index.jsx     # Demo home page
│       ├── app.additional.jsx # Additional page
│       ├── auth.$.jsx         # Auth catch-all
│       ├── auth.login/        # Login form
│       ├── _index/            # Landing redirect
│       └── webhooks.*         # Webhook handlers
├── extensions/                # BOŞ — Theme App Extension buraya gelecek
├── prisma/
│   └── schema.prisma          # Session model (SQLite)
├── shopify.app.toml           # App config
├── shopify.web.toml           # Web config
├── package.json
├── vite.config.js
└── tsconfig.json
```

---

## 1. Mimari Genel Bakış

### Veri Akış Diyagramı
```
┌─────────────────────────────────────────────────────┐
│  Shopify Storefront (PDP)                           │
│  ┌───────────────────────────────────────────────┐  │
│  │  Theme App Extension (App Block)              │  │
│  │  ┌─────────────────┐  ┌────────────────────┐ │  │
│  │  │  Liquid Block    │  │  React App (R3F)   │ │  │
│  │  │  - mount div     │  │  - 3D Canvas       │ │  │
│  │  │  - window config │  │  - UI Controls     │ │  │
│  │  │  - JS loader     │  │  - Price Display   │ │  │
│  │  └─────────────────┘  └────────┬───────────┘ │  │
│  └────────────────────────────────┼─────────────┘  │
│                                   │                 │
│         App Proxy (fetch)         │                 │
│    /{prefix}/{subpath}/api/pcon/* │                 │
└───────────────────────────────────┼─────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────┐
│  Node.js Backend (React Router / Remix)               │
│  ┌──────────────────┐  ┌──────────────┐              │
│  │  App Proxy Route  │  │  Redis Cache │              │
│  │  authenticate.    │  │  (MD5 hash)  │              │
│  │  public.appProxy  │  └──────┬───────┘              │
│  └────────┬─────────┘         │                      │
│           │                    │                      │
│           ▼                    ▼                      │
│  ┌──────────────────────────────────┐                │
│  │  PconClient (Singleton)          │                │
│  │  @easterngraphics/wcf            │                │
│  │  - session management            │                │
│  │  - reconnect logic               │                │
│  └────────┬─────────────────────────┘                │
└───────────┼──────────────────────────────────────────┘
            │
            ▼
   ┌─────────────────┐
   │  pCon EAIWS     │
   │  (SOAP/REST)    │
   └─────────────────┘
```

### Temel Kısıtlamalar
- **Fiyat → Sepet:** Zaten çözülmüş. Bu proje kapsamında fiyat yalnızca frontend'de gösterilir.
- **Görselleştirme:** React Three Fiber (R3F) + @react-three/drei
- **Storefront Entegrasyonu:** Theme App Extension (App Block) — Ürün detay sayfasına (PDP)
- **Backend:** React Router (Remix) sunucusu + `@easterngraphics/wcf`
- **Önbellek:** Redis in-memory cache
- **Storefront → Backend İletişimi:** Shopify App Proxy (ZORUNLU — storefront'tan doğrudan app backend'e CORS olmadan erişim sağlar)

---

## 2. Faz 0: Yapılandırma ve Hazırlık (shopify.app.toml Güncellemeleri)

### 2.1 Metafield Tanımları (TOML'da — GraphQL DEĞİL)

Shopify MCP tarafından doğrulanan en iyi pratik: App-owned metafield tanımları `shopify.app.toml` dosyasında TOML formatında yapılmalıdır. `$app` namespace otomatik olarak atanır.

```toml
# shopify.app.toml — EKLENMESİ GEREKEN BÖLÜMLER

# pCon article number — ürünü pCon'da tanımlamak için
[product.metafields.app.pcon_article_number]
type = "single_line_text_field"
name = "pCon Article Number"
description = "pCon EAIWS article number for 3D configurator"
  [product.metafields.app.pcon_article_number.access]
  admin = "merchant_read_write"
  storefront = "public_read"

# pCon manufacturer ID
[product.metafields.app.pcon_manufacturer_id]
type = "single_line_text_field"
name = "pCon Manufacturer ID"
description = "pCon manufacturer identifier"
  [product.metafields.app.pcon_manufacturer_id.access]
  admin = "merchant_read_write"
  storefront = "public_read"
```

**ÖNEMLİ:** Liquid'de bu metafield'lara erişim:
```liquid
{{ product.metafields["$app:pcon"].pcon_article_number.value }}
{{ product.metafields["$app:pcon"].pcon_manufacturer_id.value }}
```

> NOT: `$app:pcon` yerine doğru namespace `$app` olacaktır. Yani:
> `product.metafields["$app"].pcon_article_number.value`

### 2.2 App Proxy Yapılandırması

Storefront'tan backend'e erişim **App Proxy** ile sağlanmalıdır. Bu, Shopify'ın resmi yöntemidir ve CORS sorunlarını ortadan kaldırır.

```toml
# shopify.app.toml — EKLENMESİ GEREKEN BÖLÜM

[app_proxy]
url = "/pcon-proxy"
prefix = "apps"
subpath = "pcon-configurator"
```

Bu sayede storefront'taki JS şu şekilde API'ye ulaşır:
```
GET https://{shop}.myshopify.com/apps/pcon-configurator/api/pcon/init?articleNumber=...
POST https://{shop}.myshopify.com/apps/pcon-configurator/api/pcon/update
```

### 2.3 Access Scopes Güncelleme

```toml
[access_scopes]
scopes = "write_products,write_metaobjects,write_metaobject_definitions,write_app_proxy"
```

`write_app_proxy` scope'u app proxy kullanabilmek için zorunludur.

---

## 3. Faz 1: Node.js Backend (Middleware) ve EAIWS Bağlantısı

### 3.1 Gerekli Paketler

```bash
npm install @easterngraphics/wcf redis
```

`crypto` Node.js yerleşiktir, kurulum gerekmez.

### 3.2 PconClient — EAIWS Oturum Yönetimi

**Dosya:** `app/services/pcon-client.server.js`

Singleton pattern ile pCon EAIWS bağlantısı:
- `@easterngraphics/wcf` paketini kullanarak `SessionService` başlatma
- pCon.login veya Gatekeeper OAuth/API Key ile yetkilendirme
- Bağlantı koptuğunda otomatik yeniden bağlanma (reconnect)
- Oturum süresinin takibi ve gerektiğinde yenileme

```
Temel API:
- connect() → EAIWS oturum açma
- getArticleData(articleNumber, manufacturerId) → başlangıç verisi
- setPropertyValue(properties) → konfigürasyon güncelleme
- exportGltf() → glTF model URL alma
- disconnect() → oturum kapatma
```

### 3.3 API Uç Noktaları (App Proxy Routes)

App Proxy üzerinden gelen istekler `authenticate.public.appProxy(request)` ile doğrulanır.

#### A. Init Endpoint

**Dosya:** `app/routes/pcon-proxy.api.pcon.init.jsx`

> **NOT:** App Proxy route'ları `app/routes/` altında tanımlanır. URL pattern: `pcon-proxy/api/pcon/init` → Storefront'tan `https://{shop}.myshopify.com/apps/pcon-configurator/api/pcon/init` olarak erişilir.

```
Route: GET /pcon-proxy/api/pcon/init
Query Params: articleNumber, manufacturerId

İşlem:
1. authenticate.public.appProxy(request) ile doğrula
2. Redis cache kontrol (hash: md5(articleNumber + manufacturerId))
3. Cache miss → PconClient.getArticleData() çağır
4. Sonucu cache'e yaz (TTL: 24h)
5. JSON döndür

Çıktı: {
  price: number,
  gltfUrl: string,
  properties: Array<{
    id: string,
    label: string,
    type: "select" | "color" | "text",
    options: Array<{ value: string, label: string }>,
    currentValue: string
  }>,
  currency: string
}
```

#### B. Update Endpoint

**Dosya:** `app/routes/pcon-proxy.api.pcon.update.jsx`

```
Route: POST /pcon-proxy/api/pcon/update
Body: { properties: { [key: string]: string } }

İşlem:
1. authenticate.public.appProxy(request) ile doğrula
2. Properties'den MD5 hash üret
3. Redis cache kontrol
4. Cache miss → PconClient.setPropertyValue() + exportGltf()
5. Sonucu cache'e yaz (TTL: 24h)
6. JSON döndür

Çıktı: {
  price: number,
  gltfUrl: string,
  validOptions: Array<{
    id: string,
    options: Array<{ value: string, label: string, available: boolean }>
  }>
}
```

### 3.4 Route Naming Convention

React Router flat routes yapısı kullanıldığından, dosya isimleri URL path'ini belirler:
```
app/routes/pcon-proxy.api.pcon.init.jsx    → /pcon-proxy/api/pcon/init
app/routes/pcon-proxy.api.pcon.update.jsx  → /pcon-proxy/api/pcon/update
```

`pcon-proxy` prefix'i `shopify.app.toml` deki `[app_proxy] url` ayarına karşılık gelir.

---

## 4. Faz 2: Redis Önbellek (Cache) Katmanı

### 4.1 Redis Client

**Dosya:** `app/services/redis-client.server.js`

Singleton pattern ile Redis bağlantısı. Environment variable: `REDIS_URL`

### 4.2 Hash Üretim Algoritması

```javascript
import { createHash } from "crypto";

function generateCacheKey(prefix, data) {
  const sorted = Object.keys(data).sort().reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {});
  const hash = createHash("md5").update(JSON.stringify(sorted)).digest("hex");
  return `pcon:${prefix}:${hash}`;
}
```

### 4.3 Cache Interceptor Akışı

```
İstek geldi
  ↓
Hash üret → "pcon:update:a1b2c3..."
  ↓
redis.get(hash)
  ↓
┌─── Cache HIT ───→ JSON döndür (~10ms)
│
└─── Cache MISS ──→ pCon EAIWS çağrısı
                      ↓
                    Sonuç al
                      ↓
                    redis.setex(hash, 86400, JSON.stringify(data))
                      ↓
                    JSON döndür
```

### 4.4 TTL Stratejisi

| Veri Tipi | TTL | Gerekçe |
|-----------|-----|---------|
| init (article data) | 86400s (24h) | Ürün base config nadiren değişir |
| update (config) | 86400s (24h) | Aynı kombinasyon her zaman aynı sonucu verir |
| gltf URL | 86400s (24h) | pCon URL'leri geçici olabilir, 24h yeterli |

---

## 5. Faz 3: Theme App Extension (Storefront Frontend)

### 5.1 Extension Oluşturma (Shopify CLI)

**ZORUNLU:** Extension'lar Shopify CLI ile scaffold edilmelidir. Manuel oluşturma yapılmamalıdır.

```bash
cd /path/to/3-d-test-app
shopify app generate extension
# Tip seç: Theme app extension
# İsim: pcon-3d-configurator
```

Bu komut şu yapıyı oluşturur:
```
extensions/
└── pcon-3d-configurator/
    ├── assets/          # JS, CSS dosyaları
    ├── blocks/          # Liquid app block dosyaları
    ├── snippets/        # Liquid snippet'lar
    ├── locales/         # Çeviri dosyaları
    ├── package.json
    └── shopify.extension.toml
```

### 5.2 App Block Yapılandırması

**Dosya:** `extensions/pcon-3d-configurator/blocks/configurator.liquid`

```liquid
<div
  id="pcon-root"
  data-article-number="{{ product.metafields['$app'].pcon_article_number.value }}"
  data-manufacturer-id="{{ product.metafields['$app'].pcon_manufacturer_id.value }}"
  data-shop-domain="{{ shop.permanent_domain }}"
  data-proxy-base="/apps/pcon-configurator"
  data-currency="{{ shop.currency }}"
  style="width: 100%; min-height: 500px;"
>
  <div style="display:flex;align-items:center;justify-content:center;height:500px;">
    <p>Loading 3D Configurator...</p>
  </div>
</div>

{% schema %}
{
  "name": "3D Configurator",
  "target": "section",
  "javascript": "configurator.js",
  "stylesheet": "configurator.css",
  "enabled_on": {
    "templates": ["product"]
  },
  "settings": [
    {
      "type": "range",
      "id": "canvas_height",
      "label": "Canvas Height (px)",
      "min": 300,
      "max": 800,
      "step": 50,
      "default": 500
    },
    {
      "type": "select",
      "id": "environment_preset",
      "label": "Lighting Preset",
      "options": [
        { "value": "studio", "label": "Studio" },
        { "value": "apartment", "label": "Apartment" },
        { "value": "warehouse", "label": "Warehouse" },
        { "value": "sunset", "label": "Sunset" }
      ],
      "default": "studio"
    }
  ]
}
{% endschema %}
```

**Kritik Noktalar (Shopify MCP'den):**
- `"target": "section"` → App block olarak PDP section'a eklenir
- `"javascript": "configurator.js"` → `assets/configurator.js` otomatik yüklenir (`<script async>`)
- `"enabled_on": { "templates": ["product"] }` → Sadece ürün sayfasında görünür
- `product.metafields["$app"]` ile app-owned metafield'lara erişilir
- Theme app extension'lar `content_for_header`, `content_for_layout` erişemez
- Parent section object'ten sadece `id` property'si erişilebilir

### 5.3 React Uygulaması Build Stratejisi

Theme app extension JS dosyası sınırları:
- **Compressed JS:** ~10 KB önerilen limit (schema ile referanslanan)
- **Tüm dosyalar:** 10 MB enforced limit

**Strateji:** React uygulaması ayrı bir Vite config ile bundle edilip `extensions/pcon-3d-configurator/assets/configurator.js` olarak output verilir. Tree-shaking ve code splitting kritik.

**Alternatif Strateji (Önerilen):** App block içindeki JS yalnızca bir bootloader olsun. Ana React bundle'ı App Proxy üzerinden veya CDN'den yüklensin.

```
extensions/pcon-3d-configurator/assets/configurator.js  (bootloader, <5KB)
  ↓
Ana React bundle'ı App Proxy üzerinden veya external CDN'den lazy-load edilir
  ↓
React app pcon-root div'ine mount olur
```

### 5.4 window.PCON_CONFIG Yerine data-* Attributes

Shopify Theme App Extension'larda `<script>` etiketi ile global değişken tanımlamak güvenlik riski oluşturabilir. Bunun yerine `data-*` HTML attributes kullanılır:

```javascript
// configurator.js (bootloader)
const root = document.getElementById("pcon-root");
if (root) {
  const config = {
    articleNumber: root.dataset.articleNumber,
    manufacturerId: root.dataset.manufacturerId,
    shopDomain: root.dataset.shopDomain,
    proxyBase: root.dataset.proxyBase,
    currency: root.dataset.currency,
  };
  // React app'i yükle ve mount et
}
```

---

## 6. Faz 4: React Three Fiber (R3F) ile 3D Görselleştirme

### 6.1 Gerekli Frontend Paketler

```bash
npm install three @react-three/fiber @react-three/drei zustand
```

### 6.2 Zustand Store

**Dosya:** `extensions/pcon-3d-configurator/src/store/configurator-store.js`

```
State:
  - gltfUrl: string | null
  - price: number | null
  - currency: string
  - properties: PropertyOption[]
  - loading: boolean
  - error: string | null
  - proxyBase: string
  - articleNumber: string
  - manufacturerId: string

Actions:
  - initialize(config) → /api/pcon/init çağrısı
  - updateProperty(key, value) → /api/pcon/update çağrısı
  - setLoading(boolean)
  - setError(string)
```

### 6.3 URL Senkronizasyonu

Kullanıcı sayfayı yenilediğinde seçimlerin korunması için URL parametreleri kullanılır:

```
https://shop.com/products/masa?color=white&legs=metal
```

Zustand middleware ile URL ↔ state senkronizasyonu:
- State değiştiğinde → `history.replaceState` ile URL güncelle
- Sayfa yüklendiğinde → URL params'dan state'i oku, init API'yi bu params ile çağır

### 6.4 Sahne (Scene) Yapısı

```jsx
<Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
  <Environment preset={environmentPreset} />
  <Suspense fallback={<LoadingSpinner />}>
    <Model url={gltfUrl} />
  </Suspense>
  <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} />
  <OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
</Canvas>
```

### 6.5 Dinamik glTF Yükleme

`@react-three/drei` `useGLTF` hook'u kullanılır:
- Browser-level cache sayesinde aynı URL ikinci kez geldiğinde anında render
- URL değiştiğinde useGLTF otomatik olarak yeni modeli yükler
- `useGLTF.preload(url)` ile önceden yükleme mümkün

### 6.6 UI Katmanı

3D Canvas üzerinde (absolute position) HTML/CSS katman:
- Anlık fiyat gösterimi (Zustand store'dan)
- Varyasyon seçim butonları (renk, malzeme vb.)
- Loading skeleton/spinner
- Hata mesajları

---

## 7. Dosya Yapısı (Hedef)

```
3-d-test-app/
├── app/
│   ├── services/
│   │   ├── pcon-client.server.js       # pCon EAIWS singleton
│   │   └── redis-client.server.js      # Redis singleton
│   ├── utils/
│   │   └── cache.server.js             # MD5 hash + cache interceptor
│   ├── routes/
│   │   ├── pcon-proxy.api.pcon.init.jsx    # App Proxy: init endpoint
│   │   ├── pcon-proxy.api.pcon.update.jsx  # App Proxy: update endpoint
│   │   └── ... (mevcut route'lar)
│   └── ... (mevcut dosyalar)
├── extensions/
│   └── pcon-3d-configurator/
│       ├── assets/
│       │   ├── configurator.js         # Bootloader veya bundled React app
│       │   └── configurator.css        # Temel stiller
│       ├── blocks/
│       │   └── configurator.liquid     # App block tanımı
│       ├── snippets/
│       ├── locales/
│       │   └── en.default.json
│       ├── src/                        # React kaynak kodu (build öncesi)
│       │   ├── App.jsx
│       │   ├── store/
│       │   │   └── configurator-store.js
│       │   ├── components/
│       │   │   ├── ConfiguratorScene.jsx
│       │   │   ├── Model.jsx
│       │   │   ├── LoadingSpinner.jsx
│       │   │   ├── PriceDisplay.jsx
│       │   │   └── PropertySelector.jsx
│       │   └── utils/
│       │       ├── api.js              # fetch wrapper (App Proxy)
│       │       └── url-sync.js         # URL param sync
│       ├── vite.config.extension.js    # Extension-specific Vite config
│       ├── package.json
│       └── shopify.extension.toml
├── shopify.app.toml                    # Güncellenmiş: metafields + app_proxy
└── ... (diğer mevcut dosyalar)
```

---

## 8. Environment Variables

```env
# pCon EAIWS
PCON_EAIWS_URL=https://eaiws.pcon-solutions.com
PCON_API_KEY=your_api_key_here
PCON_USERNAME=your_username
PCON_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# Shopify (mevcut)
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
```

---

## 9. Uygulama Sırası (Implementation Order)

### Adım 1: shopify.app.toml Güncelleme
- [ ] Metafield tanımlarını ekle (pcon_article_number, pcon_manufacturer_id)
- [ ] App Proxy config ekle
- [ ] Access scopes güncelle (write_app_proxy)
- [ ] `shopify app deploy` ile değişiklikleri uygula

### Adım 2: Backend Services
- [ ] `npm install @easterngraphics/wcf redis`
- [ ] `app/services/pcon-client.server.js` — PconClient singleton
- [ ] `app/services/redis-client.server.js` — Redis client singleton
- [ ] `app/utils/cache.server.js` — MD5 hash + cache helper

### Adım 3: API Routes (App Proxy)
- [ ] `app/routes/pcon-proxy.api.pcon.init.jsx` — Init endpoint
- [ ] `app/routes/pcon-proxy.api.pcon.update.jsx` — Update endpoint
- [ ] Test: `shopify app dev` ile App Proxy route'ları test et

### Adım 4: Theme App Extension
- [ ] `shopify app generate extension` → Theme app extension
- [ ] `blocks/configurator.liquid` — App block Liquid dosyası
- [ ] `assets/configurator.js` — Bootloader JS
- [ ] `assets/configurator.css` — Base stiller

### Adım 5: React 3D Configurator (Frontend)
- [ ] Vite config for extension build
- [ ] Zustand store (configurator-store.js)
- [ ] API client (App Proxy fetch wrapper)
- [ ] ConfiguratorScene (Canvas + R3F)
- [ ] Model component (useGLTF)
- [ ] UI components (PriceDisplay, PropertySelector)
- [ ] URL senkronizasyonu

### Adım 6: Entegrasyon ve Test
- [ ] `shopify app dev` ile uçtan uca test
- [ ] Redis cache doğrulama
- [ ] pCon EAIWS bağlantı testi
- [ ] 3D model yükleme performans testi
- [ ] Mobile responsive kontrol

---

## 10. Kritik Teknik Kararlar

### 10.1 App Proxy vs Direct API Call
**Karar:** App Proxy kullanılacak.
**Gerekçe:** Storefront'tan backend'e erişimde Shopify, App Proxy kullanımını zorunlu kılar. Doğrudan API çağrısı CORS hatası verir. App Proxy istekleri Shopify tarafından imzalanır ve `authenticate.public.appProxy()` ile doğrulanır.

### 10.2 Metafield Tanımlama Yöntemi
**Karar:** TOML (shopify.app.toml)
**Gerekçe:** Shopify MCP dokümantasyonuna göre app-owned metafield'lar %99.99 oranında TOML'da tanımlanmalıdır. Version control altında, type-safe, auto-installed. `metafieldDefinitionCreate` GraphQL KULLANILMAMALI.

### 10.3 React Bundle Dağıtımı
**Karar:** Bootloader + Lazy Load
**Gerekçe:** Theme App Extension JS limiti ~10KB (önerilen). R3F + Three.js bundle bu limiti aşar. Bootloader pattern ile ana bundle App Proxy veya CDN üzerinden yüklenir.

### 10.4 Storefront'ta Metafield Erişimi
**Karar:** Liquid `data-*` attributes
**Gerekçe:** `product.metafields["$app"].pcon_article_number.value` Liquid syntax'ı ile HTML data attributes'a yazılır. JS tarafında `dataset` API'si ile okunur.

### 10.5 State Management
**Karar:** Zustand
**Gerekçe:** R3F ile mükemmel entegrasyon, minimal bundle size (~1KB), React dışından da erişilebilir (storefront context).

---

## 11. Güvenlik Kontrol Listesi

- [ ] App Proxy istekleri `authenticate.public.appProxy()` ile doğrulanıyor
- [ ] pCon credentials environment variable'da, kod'da değil
- [ ] Redis bağlantısı TLS ile (production)
- [ ] TOML'daki metafield erişim izinleri doğru (`storefront = "public_read"`)
- [ ] XSS koruması: Liquid output'lar escape edilmiş
- [ ] Rate limiting: pCon API çağrıları throttle edilmiş

---

## 12. Performans Hedefleri

| Metrik | Hedef | Yöntem |
|--------|-------|--------|
| İlk yükleme (init) — cache hit | < 100ms | Redis cache |
| İlk yükleme (init) — cache miss | < 3s | pCon API |
| Konfigürasyon değişimi — cache hit | < 100ms | Redis cache |
| Konfigürasyon değişimi — cache miss | < 2s | pCon API |
| 3D model ilk render | < 2s | useGLTF + browser cache |
| 3D model değişimi | < 1s | useGLTF preload |
| JS bundle boyutu (bootloader) | < 5KB | Minimal bootloader |
| JS bundle boyutu (ana app) | < 500KB gzipped | Tree-shaking + code split |

---

## 13. Referans Linkler

- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions)
- [Theme App Extensions Config](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration)
- [Build Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/build)
- [App Proxies](https://shopify.dev/docs/apps/build/online-store/app-proxies)
- [App Proxy Auth (React Router)](https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/public/app-proxy)
- [Metafields](https://shopify.dev/docs/apps/build/metafields)
- [Metafield Values](https://shopify.dev/docs/apps/build/metafields/manage-metafields)
- [Liquid App Object](https://shopify.dev/docs/api/liquid/objects/app)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
