# Faz 3: Theme App Extension — Uygulama Kaydı

> Bu dosya Faz 3 kapsamında yapılan tüm değişiklikleri belgelemektedir.
> Faz 4 veya sonraki fazlarda değişiklik yaparken referans olarak kullanılabilir.

---

## Genel Bakış

Faz 3, Shopify storefront (PDP) tarafında 3D Configurator'ın mount edileceği Theme App Extension'ı oluşturur. Bootloader pattern kullanılır: extension içindeki küçük JS dosyası (<5KB) config'i okur ve ana React bundle'ı App Proxy üzerinden lazy-load eder.

---

## Oluşturulan Dosya Yapısı

```
extensions/pcon-3d-configurator/
├── shopify.extension.toml     # Extension config
├── blocks/
│   └── configurator.liquid    # App block (PDP'de görünür)
├── assets/
│   ├── configurator.js        # Bootloader JS (<5KB, IIFE)
│   └── configurator.css       # Tüm UI state'leri için stiller
└── locales/
    └── en.default.json        # i18n çeviri dosyası
```

### Silinen Dosyalar (CLI scaffold varsayılanları)

- `blocks/star_rating.liquid` — CLI'ın oluşturduğu örnek block (kaldırıldı)
- `snippets/stars.liquid` — CLI'ın oluşturduğu örnek snippet (kaldırıldı)

---

## Dosya Detayları

### 1. `shopify.extension.toml`

```toml
name = "pcon-3d-configurator"
type = "theme"
uid = "c45fc786-b981-9958-f41b-01f4184c5822bf02de0c"
```

- `shopify app generate extension --template theme_app_extension --name pcon-3d-configurator` komutuyla oluşturuldu
- `uid` Shopify CLI tarafından otomatik atandı — değiştirmemek gerekir

### 2. `blocks/configurator.liquid`

Liquid app block dosyası. PDP (Product Detail Page) section'ına app block olarak eklenir.

**Kritik `data-*` Attributes:**

| Attribute | Kaynak | Açıklama |
|-----------|--------|----------|
| `data-article-number` | `product.metafields['$app'].pcon_article_number.value` | pCon makale numarası |
| `data-manufacturer-id` | `product.metafields['$app'].pcon_manufacturer_id.value` | Üretici ID |
| `data-shop-domain` | `shop.permanent_domain` | Mağaza domain'i |
| `data-proxy-base` | Hardcoded: `/apps/pcon-configurator` | App Proxy base URL |
| `data-currency` | `shop.currency` | Mağaza para birimi |
| `data-canvas-height` | `block.settings.canvas_height` | Theme editor ayarı |
| `data-environment-preset` | `block.settings.environment_preset` | Aydınlatma preset'i |

**Schema Settings (Theme Editor'dan ayarlanabilir):**

- `canvas_height`: Range 300–800px, varsayılan 500px
- `environment_preset`: studio / apartment / warehouse / sunset

**Schema Özellikleri:**

- `"target": "section"` → PDP section'a app block olarak eklenir
- `"javascript": "configurator.js"` → Shopify tarafından `<script async>` olarak yüklenir
- `"stylesheet": "configurator.css"` → Shopify tarafından otomatik eklenir
- `"enabled_on": { "templates": ["product"] }` → Sadece ürün sayfasında görünür

### 3. `assets/configurator.js` (Bootloader)

IIFE formatında, <5KB bootloader. Şu adımları uygular:

1. `#pcon-root` div'ini DOM'dan bulur
2. `dataset` API ile tüm `data-*` attribute'larını config objesine okur
3. `articleNumber` validasyonu yapar (yoksa hata gösterir)
4. Ana React bundle'ı App Proxy üzerinden dinamik `<script>` ile yükler:
   - URL: `{proxyBase}/assets/configurator-app.js`
5. Bundle yüklendikten sonra `window.__pconConfiguratorInit(root, config)` çağrısı yapar
6. Hata durumlarında SVG icon + mesaj gösterir

**Faz 4 ile entegrasyon noktası:**

Faz 4'te oluşturulacak React uygulaması, build sonrası `window.__pconConfiguratorInit` fonksiyonunu dışa açmalıdır. Bu fonksiyon bootloader tarafından `(root, config)` parametreleriyle çağrılır.

```javascript
// Faz 4'te oluşturulacak React entry point'inde:
window.__pconConfiguratorInit = function(root, config) {
  // React app'i root div'e mount et
  // config objesi: { articleNumber, manufacturerId, shopDomain, proxyBase, currency, canvasHeight, environmentPreset }
};
```

**App Proxy route gereksinimi:**

Bootloader `{proxyBase}/assets/configurator-app.js` adresinden bundle'ı yükler. Bu, Faz 4'te oluşturulacak bir App Proxy route gerektirir:
- Route dosyası: `app/routes/pcon-proxy.assets.configurator-app[.js].jsx` (veya benzeri)
- Bu route, build edilmiş React bundle'ı serve eder

### 4. `assets/configurator.css`

Tüm UI state'leri için CSS sınıfları:

| CSS Sınıfı | Kullanım |
|------------|----------|
| `#pcon-root` | Ana container |
| `.pcon-loading` / `.pcon-loading__spinner` / `.pcon-loading__text` | İlk yükleme durumu |
| `.pcon-error` / `.pcon-error__icon` / `.pcon-error__message` | Hata durumu |
| `.pcon-canvas-wrap` | 3D Canvas container |
| `.pcon-overlay` | Canvas üzerinde UI overlay (pointer-events: none) |
| `.pcon-price` | Fiyat gösterimi (sağ üst, glass morphism) |
| `.pcon-properties` / `.pcon-prop-group` | Property seçici paneli (alt) |
| `.pcon-option-btn` / `--active` / `--disabled` / `--color` | Seçenek butonları |
| `.pcon-updating` | Property değişimi sırasında overlay |

Mobile responsive breakpoint: `max-width: 600px`

### 5. `locales/en.default.json`

```json
{
  "configurator": {
    "loading": "Loading 3D Configurator...",
    "error": {
      "no_article": "No pCon article number configured for this product.",
      "load_failed": "Failed to load 3D Configurator. Please refresh the page.",
      "init_failed": "Failed to initialize 3D Configurator."
    }
  }
}
```

---

## Bağımlılıklar (Önceki Fazlardan)

Faz 3'ün çalışması için şunlar gereklidir:

| Bileşen | Faz | Durum |
|---------|-----|-------|
| `shopify.app.toml` — App Proxy config (`/apps/pcon-configurator`) | Faz 1 | Mevcut |
| `shopify.app.toml` — Metafield tanımları (`pcon_article_number`, `pcon_manufacturer_id`) | Faz 1 | Mevcut |
| `app/routes/pcon-proxy.api.pcon.init.jsx` — Init API | Faz 1 | Mevcut |
| `app/routes/pcon-proxy.api.pcon.update.jsx` — Update API | Faz 1 | Mevcut |
| `app/services/redis-client.server.js` — Redis cache | Faz 2 | Mevcut |

---

## Notlar

- Extension `shopify app generate extension` CLI komutu ile scaffold edildi (spec'teki zorunluluk)
- `snippets/` klasörü boş bırakıldı (gerektiğinde Liquid snippet'lar eklenebilir)
- Bootloader ES5-uyumlu yazıldı (eski tarayıcı desteği, IIFE pattern)
- CSS class isimleri `pcon-` prefix'i ile namespace'lendi (storefront theme ile çakışma riski yok)
