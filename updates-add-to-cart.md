# Add to Cart Implementasyonu — Değişiklik ve Rollback Dökümanı

**Tarih:** 30 Nisan 2026
**Konu:** Custom 3D Configurator'e Shopify cart/add.js entegrasyonu (PCON → Shopify cart)
**Branch baseline:** `3832c55 backup color images` (en son commit)

Bu doküman, configurator extension'ına eklenen "Add to Cart" özelliğinin tüm değişikliklerini ve deploy sonrası bir hata oluşması durumunda nasıl geri alınacağını detaylı şekilde anlatır. Tema iframe'inin gönderdiği `finalProperties` body'siyle birebir uyumlu cart payload'u backend'de EAIWS ham datasından üretilir; frontend cart-add anında dinamik alanları (request_id, basket_id, quantity) ekleyip Shopify `cart/add.js` endpoint'ine POST atar.

---

## İçindekiler

1. [Genel Bakış](#1-genel-bakış)
2. [Mimari ve Veri Akışı](#2-mimari-ve-veri-akışı)
3. [Yeni Oluşturulan Dosyalar](#3-yeni-oluşturulan-dosyalar)
4. [Değiştirilen Dosyalar](#4-değiştirilen-dosyalar)
5. [Yeni Env Değişkenleri](#5-yeni-env-değişkenleri)
6. [Cache Invalidation Stratejisi](#6-cache-invalidation-stratejisi)
7. [Manuel Doğrulama Adımları](#7-manuel-doğrulama-adımları)
8. [Rollback Prosedürü](#8-rollback-prosedürü)
9. [Bilinen Kısıtlamalar](#9-bilinen-kısıtlamalar)

---

## 1. Genel Bakış

### Amaç

Tema'da çalışan iframe + postMessage tabanlı PCON entegrasyonu kaldırılıp custom configurator extension'ında native bir Add to Cart akışı kuruldu. Mağazanın downstream sistemleri (CRM, sipariş işleme, OCI plugin) `properties` objesindeki belirli underscore'lu meta key'lere göre çalıştığı için cart payload'ı tema iframe'inin gönderdiğiyle **birebir aynı** üretilir.

### Yüksek Düzey Akış

```
[Liquid block]
  ├─ data-variant-id="{{ product.selected_or_first_available_variant.id }}"
  ├─ data-routes-root="{{ routes.root_url }}"
  └─ data-success-action / data-add-to-cart-label (theme editor)
        │
        ▼
[Bootloader configurator.js]
  └─ window.__pconConfiguratorInit(root, config) — config'e variantId/routesRoot/successAction taşır
        │
        ▼
[React App.jsx]
  ├─ Configurator.initialize(config) → store'u set eder
  └─ subscribeVariantChanges(setVariantId) — DOM'daki <variant-selects> değişimlerini canlı dinler
        │
        ▼
[Backend init/update routes]
  ├─ EAIWS articleData + choiceLists alınır
  ├─ buildCartProperties() → static cart payload üretir
  └─ Redis'e cartProperties dahil cache'ler
        │
        ▼
[Frontend Zustand store]
  └─ cartProperties, quantity, variantId, successAction state yönetir
        │
        ▼
[AddToCartButton]
  ├─ Quantity input (+/- step + direct input)
  ├─ disabled={cartLoading || updating || loading || !cartProperties || !variantId}
  └─ onClick → store.addToCart()
        │
        ▼
[store.addToCart()]
  ├─ generateRequestId() → "PCON-XXXXXXXXXXXXXXXX"
  ├─ generateUUID()      → _basket_id
  ├─ String(quantity)    → _quantity
  ├─ POST /cart/add.js  { items: [{ id, quantity, properties: finalProperties }] }
  └─ successAction'a göre: drawer-event | redirect | reload | none
```

### Üretilen `finalProperties` Yapısı

Backend `cart-builder.server.js` üç bölüm üretir:

1. **Underscore'lu meta key'ler** (sepette gizli, downstream sistem için):
   - `articleData` → `_description`, `_Configuration`, `_Configuration_Price`, `_currency`, `_vendormat`, `_ext_product_id`, `_ean`, `_manufactcode`, `_seriesid`, `_article_image`
   - Hesaplanır: `_vat` (VAT-included fiyatın KDV portion'ı)
   - Sabit (legacy ile uyumluluk): `_unit`, `_priceunit`, `_attachment_purpose`, `_item_type`, `_eco`, `_eco_info`, `_oci_plugin`, `_priceservice`, `_taxcode` (env), tüm `_cust_field*`, `_ext_*`, `_contract*` vb. boş tutulur
   - Frontend tarafından eklenir (cache'lenmez): `_request_id`, `_basket_id`, `_quantity`
   - **Atlanan** (kullanıcı isteği üzerine boş): `_attachment`, `_obx_url`, `_reopen_url`

2. **Divider'lar** (`divider 1`, `divider 2` ...): EAIWS'in `propertyClasses[].description`'ından alınır, görünür/editable property'lerin ait olduğu sınıflara göre numaralanır.

3. **Müşteriye görünür property'ler**: `propText` → choice list'in `text` değeri. Configurator UI'da görünenle birebir aynı küme.

---

## 2. Mimari ve Veri Akışı

### Backend tarafı

```
EAIWS
  ↓ getArticleData + getAllChoiceLists
PconClient (pcon-client.server.js)
  ↓ buildCartProperties(articleData, choiceLists)
cart-builder.server.js
  ↓ static cartProperties (request_id/basket_id/quantity hariç)
init/update route handlers
  ↓ cacheSet(redisKey, { ...response, cartProperties })
Redis (24h TTL)
  ↓ cacheGet → frontend response
```

### Frontend tarafı

```
Liquid block data attributes
  ↓ bootloader (configurator.js) reads
config object
  ↓ __pconConfiguratorInit
React App.jsx Configurator
  ↓ initialize(config)
Zustand store
  ↓ initArticle/updateProperties API call
init/update response { ...rest, cartProperties }
  ↓ store.set({ cartProperties })
AddToCartButton (sidebar)
  ↓ user click
store.addToCart()
  ↓ POST cart/add.js
  ↓ dispatchCartUpdateEvents() → drawer cart open
Done.
```

### Variant ID Detection Hierarchy

Theme editor'de variant değiştirildiğinde Add to Cart butonunun doğru variant'a sepetlemesi için üç aşamalı detection:

1. **Liquid initial value** — `data-variant-id="{{ product.selected_or_first_available_variant.id }}"` (PDP context)
2. **DOM live read** — `<variant-selects>`, `<variant-radios>`, klasik form input, generic select, hidden input chain
3. **Runtime fallback** — `window.ShopifyAnalytics.meta.selectedVariantId`

Variant değişimi olayları: `change` (input/select), custom `variant:change`, `on:variant:change`, `popstate` (URL `?variant=` değişimi).

---

## 3. Yeni Oluşturulan Dosyalar

### `app/services/cart-builder.server.js` (yeni)

EAIWS ham datasından Shopify cart `properties` objesi üretir.

**Public API:**
- `buildCartProperties(articleData, choiceLists)` → Object | null

**Yardımcı (private) fonksiyonlar:**
- `buildVisibleProperties(articleData, choiceLists)` — divider'lı, müşteriye görünür property listesi
- `computeVatPortion(price, taxRate)` — VAT-included fiyattan KDV portion
- `formatPrice(value, decimals)` — `toFixed` wrapper

**Sabitler:**
- `STATIC_META` — legacy ile uyumlu boş/sabit alanlar (cust_field*, ext_*, _eco, _oci_plugin vb.)
- `TAX_RATE` — `process.env.PCON_TAX_RATE` (default `0.19`)
- `TAX_CODE` — `process.env.PCON_TAX_CODE` (default `"DE"`)

**Bağımlılık:** `./property-mapper.server.js` → `HIDDEN_PROPERTY_IDS` set

---

### `extension-build/src/utils/cart.js` (yeni)

Shopify cart endpoint helpers + dinamik ID üretimi.

**Public API:**
- `generateRequestId()` → `"PCON-" + 16 char uppercase alphanumeric` (örnek: `PCON-C7NGGLK1FKB4MYHV`)
- `generateUUID()` → RFC4122 v4 UUID (`crypto.randomUUID()` öncelikli, manuel fallback)
- `getCartAddUrl(routesRoot)` → multi-locale prefix'i hesaba katar
- `postCartAdd(routesRoot, items)` → fetch wrapper, Shopify hata mesajı parsing
- `dispatchCartUpdateEvents(payload)` → `cart:refresh`, `cart:added`, `cart:open`, `cart:updated` event'leri

---

### `extension-build/src/utils/variant-detect.js` (yeni)

Theme'deki seçili variant ID'sini DOM üzerinden tespit + change subscription.

**Public API:**
- `readVariantFromDom()` → string | null
- `subscribeVariantChanges(callback)` → unsubscribe function

**Selektör chain:**
```
1. variant-selects input[name="id"]:checked
2. variant-radios input[name="id"]:checked
3. form[action$="/cart/add"] input[name="id"]
4. select[name="id"]
5. input[name="id"][type="hidden"]
6. input[name="id"]:not([type="hidden"]):checked
7. window.ShopifyAnalytics.meta.selectedVariantId
```

---

### `extension-build/src/components/AddToCartButton.jsx` (yeni)

Quantity input + Add to Cart butonu + error/success feedback.

**State binding (Zustand):**
- `quantity`, `setQuantity`, `addToCart`, `resetCartFeedback`
- `cartLoading`, `cartError`, `cartSuccess`, `cartProperties`, `variantId`
- `updating`, `loading`, `addToCartLabel`

**UX davranışı:**
- Quantity için custom +/- step butonları + direct number input (mobile için `inputMode="numeric"`)
- Buton disabled: `cartLoading || updating || loading || !cartProperties || !variantId`
- Loading sırasında inline spinner
- Hata mesajı `role="alert"` ile (Shopify'ın 422 description'ı yansır)
- Başarı badge'i 4 saniye boyunca görünür (auto-dismiss)

---

## 4. Değiştirilen Dosyalar

### `app/services/pcon-client.server.js`

**Yapılan değişiklikler:**

1. Yeni import:
   ```js
   import { buildCartProperties } from "./cart-builder.server.js";
   ```

2. `getArticleData()` return value'ya `cartProperties` eklendi:
   ```js
   const cartProperties = buildCartProperties(articleData, choiceLists);
   return { itemId, price, gltfUrl, properties, currency, cartProperties, ... };
   ```

3. `setPropertyValue()` return value'ya `cartProperties` eklendi (aynı pattern).

**Etkilenen caller'lar:** Init route, update route, cache-warmer (otomatik dolar).

**Rollback:** İmport satırı + iki return value'daki `cartProperties` satırlarını sil.

---

### `app/routes/pcon-proxy.api.pcon.init.jsx`

**Yapılan değişiklikler:**

1. Cache hit kontrolü `cached.cartProperties` varlığını da kontrol ediyor (eski cache entry'leri için organik migration):
   ```js
   if (cached && cached.cartProperties) {
     return Response.json({ ...cached, gltfUrl: cached.originalGltfUrl || cached.gltfUrl });
   }
   ```

2. `result` objesine `cartProperties: data.cartProperties || null` eklendi.

**Rollback:** `if (cached)` koşulunu eski haline döndür, `result`'tan `cartProperties` satırını sil.

---

### `app/routes/pcon-proxy.api.pcon.update.jsx`

**Yapılan değişiklikler:**

1. Cache hit kontrolüne `cached.cartProperties` koşulu eklendi (init ile aynı pattern).
2. `result` objesine `cartProperties: data.cartProperties || null` eklendi.

**Rollback:** Init route ile aynı şekilde geri al.

---

### `app/services/cache-warmer.server.js`

**Yapılan değişiklikler:**

1. `cacheSet()` payload'una `cartProperties: data.cartProperties || null` eklendi.

**Rollback:** Tek satırlık ekleme, sil.

---

### `app/services/article-warmer.server.js`

**Yapılan değişiklikler:**

1. Yeni import:
   ```js
   import { buildCartProperties } from "./cart-builder.server.js";
   ```

2. Layer 1 (init data) cache'lemesinde `cartProperties` eklendi:
   ```js
   const cartProperties = buildCartProperties(articleData, choiceLists);
   await cacheSet(initKey, { ..., cartProperties });
   ```

3. Layer 2/3 update cache'lemesinde aynı pattern uygulandı.

**Rollback:** İmport satırı + iki noktadaki `cartProperties` üretim/insertion'ını sil.

---

### `extension-build/src/store/configurator-store.js`

**Yapılan değişiklikler:**

1. Yeni import:
   ```js
   import { postCartAdd, generateRequestId, generateUUID, dispatchCartUpdateEvents } from "../utils/cart.js";
   ```

2. Yeni state alanları:
   ```js
   cartProperties: null,
   quantity: 1,
   variantId: null,
   routesRoot: "/",
   addToCartLabel: "Add to Cart",
   successAction: "drawer-event",
   cartLoading: false,
   cartError: null,
   cartSuccess: false,
   ```

3. `initialize(config)` içinde:
   - `set()` çağrısına `variantId, routesRoot, addToCartLabel, successAction` eklendi (config'ten okunur).
   - Init API response'undan `cartProperties` set'lendi.
   - In-memory `responseCache.set()` payload'una `cartProperties` eklendi.

4. `applyUrlProperties(urlProps)` içinde:
   - `set()` çağrısına `cartProperties: data.cartProperties || get().cartProperties` eklendi.
   - `console.log("data", data)` debug satırı kaldırıldı.

5. `updateProperty(key, value)` içinde:
   - Cache hit yolunda `cartProperties` taşındı.
   - In-memory cache `set()` payload'una `cartProperties` eklendi.
   - Cache miss yolunda response'tan `cartProperties` set'lendi.

6. **Yeni action'lar:**
   - `setQuantity(qty)` — input parsing + min 1 garanti
   - `setVariantId(variantId)` — idempotent (aynı value ise no-op)
   - `resetCartFeedback()` — `cartError`, `cartSuccess` temizler
   - `addToCart()` — bu PR'ın merkez fonksiyonu (yukarıda detay)

**Rollback:** Bu dosya çok kritik; geri almak için `git checkout HEAD -- extension-build/src/store/configurator-store.js`.

---

### `extension-build/src/App.jsx`

**Yapılan değişiklikler:**

1. Yeni import:
   ```js
   import { readVariantFromDom, subscribeVariantChanges } from "./utils/variant-detect.js";
   ```

2. `Configurator` component'ine variant detection useEffect eklendi:
   ```js
   const setVariantId = useConfiguratorStore((s) => s.setVariantId);
   useEffect(() => {
     const fromDom = readVariantFromDom();
     if (fromDom) setVariantId(fromDom);
     const unsubscribe = subscribeVariantChanges((variantId) => setVariantId(variantId));
     return unsubscribe;
   }, [setVariantId]);
   ```

**Rollback:** İmport ve useEffect'i sil. Pre-existing `initialize` useEffect'i değişmedi.

---

### `extension-build/src/components/ConfiguratorScene.jsx`

**Yapılan değişiklikler:**

1. Yeni import:
   ```js
   import AddToCartButton from "./AddToCartButton.jsx";
   ```

2. Sidebar'a `<AddToCartButton />` eklendi (`<PropertySelector />` altında).

**Rollback:** İmport ve component referansını sil.

---

### `extension-build/src/components/PropertySelector.jsx`

**Yapılan değişiklikler:**

1. Dev sırasında bırakılmış noisy `console.log("ahjvşadfjvaşvjadbvşjvbşadfkjvbaşdvjbadfşvjbadvşj")` ve `console.log("editableProps", editableProps)` satırları silindi.

**Rollback:** Add to Cart akışıyla doğrudan ilgisi yok, geri almaya gerek olmaz. Hata oluşursa bu konsolu yeniden eklemek gerekmez.

---

### `extensions/pcon-3d-configurator/blocks/configurator.liquid`

**Yapılan değişiklikler:**

1. `#pcon-root` div'ine yeni data attribute'lar:
   ```liquid
   data-variant-id="{{ product.selected_or_first_available_variant.id }}"
   data-routes-root="{{ routes.root_url }}"
   data-add-to-cart-label="{{ block.settings.add_to_cart_label | escape }}"
   data-success-action="{{ block.settings.success_action }}"
   ```

2. `{% schema %}` içinde yeni settings:
   - `header` — "Add to Cart" başlığı
   - `add_to_cart_label` (text, default "Add to Cart")
   - `success_action` (select, default "drawer-event")
     - `drawer-event` / `redirect` / `reload` / `none`

**Rollback:** Yeni 4 data attribute satırını + eklenen 3 schema setting bloğunu sil.

---

### `extensions/pcon-3d-configurator/assets/configurator.js` (bootloader)

**Yapılan değişiklikler:**

1. `config` objesine 4 yeni alan eklendi:
   ```js
   variantId: root.dataset.variantId || "",
   routesRoot: root.dataset.routesRoot || "/",
   addToCartLabel: root.dataset.addToCartLabel || "Add to Cart",
   successAction: root.dataset.successAction || "drawer-event",
   ```

**Rollback:** Bu 4 satırı sil.

---

### `extensions/pcon-3d-configurator/assets/configurator.css`

**Yapılan değişiklikler:**

1. **"Add to Cart Section"** başlıklı yeni CSS bloğu eklendi (skeleton bloğunun hemen üstüne):
   - `.pcon-cart` — container, sticky bottom
   - `.pcon-cart__row` — quantity row layout
   - `.pcon-cart__qty-label` — uppercase label
   - `.pcon-cart__qty-control` — +/− grup
   - `.pcon-cart__qty-step` — step butonu
   - `.pcon-cart__qty-input` — number input (browser arrow gizleme)
   - `.pcon-cart__btn` — primary CTA button
   - `.pcon-cart__btn-spinner` — loading spinner (inherits `pcon-spin` keyframes)
   - `.pcon-cart__error` — kırmızı hata kutusu
   - `.pcon-cart__success` — yeşil başarı kutusu

**Rollback:** "Add to Cart Section" yorum satırından "Skeleton / Placeholder UI" yorum satırına kadar olan bloğu sil.

---

### `extensions/pcon-3d-configurator/assets/configurator-app.js` (build output)

**Yapılan değişiklikler:**

Build artifact'i — `npm run build:extension` tarafından otomatik regenerate edilir. Bundle boyutu: 1,161 KB (gzip 327 KB) — değişiklik öncesiyle aynı (~+2 KB).

**Rollback:** Sadece kaynak dosyaları geri alıp `npm run build:extension` çalıştır.

---

## 5. Yeni Env Değişkenleri

| Değişken | Default | Açıklama |
|----------|---------|----------|
| `PCON_TAX_RATE` | `0.19` | VAT hesaplaması için kullanılan oran (KDV-dahil fiyatın yüzde portion'ı). German VAT 19% varsayılır. |
| `PCON_TAX_CODE` | `DE` | `_taxcode` cart property'sine yazılan vergi ülke kodu. |

Her ikisi de **opsiyonel** — set edilmezse default değerler kullanılır. Yine de `.env` ve production fly.toml'a eklemek ileride farklı vergi rejimleri (Türkiye %20 KDV vb.) için bakım kolaylığı sağlar.

**Eklemek için (yerel `.env`):**
```
PCON_TAX_RATE=0.19
PCON_TAX_CODE=DE
```

**Eklemek için (Fly.io production):**
```bash
fly secrets set PCON_TAX_RATE=0.19 PCON_TAX_CODE=DE
```

---

## 6. Cache Invalidation Stratejisi

### Otomatik (önerilen)

Init/update route'ları cache hit kontrolünde `cached.cartProperties` varlığını da kontrol eder. Eski Redis entry'leri (deploy öncesi yazılmış, `cartProperties` içermez) cache miss path'ine düşer ve fresh recompute edilir. Bu, **tek seferlik organik migration** sağlar — manuel flush gerekmez.

İlk birkaç istek:
- Eski cache entry → `cartProperties: undefined` → cache miss
- EAIWS recompute → fresh entry yazılır → sonraki istekler cache hit

### Manuel (acil durumda)

Tüm pCon cache'ini sıfırlamak için:
```bash
redis-cli --scan --pattern 'pcon:*' | xargs redis-cli del
```

veya selektif:
```bash
redis-cli --scan --pattern 'pcon:init:*' | xargs redis-cli del
redis-cli --scan --pattern 'pcon:update:*' | xargs redis-cli del
```

Cache scheduler (CRON) günde 2 kez (03:00 ve 15:00) re-warm yapacak, böylece manuel flush sonrası performans düşüşü ~birkaç saat içinde toparlar.

---

## 7. Manuel Doğrulama Adımları

Deploy sonrası şu sırayla doğrula:

### 1. Backend health

```bash
curl -s "https://APP_URL/apps/pcon-configurator/api/pcon/init?articleNumber=P12.01.101&manufacturerId=NRUS" | jq '.cartProperties | keys[:5]'
```

`["_Configuration", "_Configuration_Price", "_currency", "_description", "_ean"]` benzeri çıktı alınmalı.

### 2. Cart properties yapısı

```bash
curl -s "..." | jq '.cartProperties | { _description, _Configuration_Price, _currency, _vendormat, _manufactcode }'
```

Beklenen format:
```json
{
  "_description": "Calma Small - 100x110",
  "_Configuration_Price": "7633.850",
  "_currency": "EUR",
  "_vendormat": "P12.01.101",
  "_manufactcode": "NRUS"
}
```

### 3. Divider sayısı

```bash
curl -s "..." | jq '.cartProperties | to_entries | map(select(.key | startswith("divider "))) | length'
```

`>= 1` olmalı (en az bir divider).

### 4. Frontend UI

- PDP'yi aç → configurator yüklendiğinde **Add to Cart** butonu sidebar'ın altında görünmeli
- Buton initial olarak enabled olmalı (cartProperties + variantId her ikisi de set)
- Property değiştirince buton hala aktif kalmalı (her update sonrası cartProperties refresh ediliyor)
- Quantity +/− tuşlarıyla değiştirilebilmeli
- "Add to Cart" tıklandığında network tab'da `POST cart/add.js`:
  - Body: `{ "items": [{ "id": <variant_id>, "quantity": 1, "properties": { ... } }] }`
  - Properties objesinde `_request_id` (PCON-XXXX), `_basket_id` (UUID), `_quantity` ("1"), tüm meta alanlar ve görünür property'ler bulunmalı
- Başarılı response sonrası drawer cart açılmalı (theme'in dinlediği `cart:refresh`/`cart:open` event'leriyle)

### 5. Hata senaryosu

- DevTools'tan variant input'u sil ve yeniden tıkla → buton "Could not detect a product variant on this page" gösterip tekrar enabled kalmalı

---

## 8. Rollback Prosedürü

### Tam Rollback (acil durum)

Tüm değişiklikleri tek komutla geri al:

```bash
git checkout HEAD -- \
  app/services/pcon-client.server.js \
  app/services/cache-warmer.server.js \
  app/services/article-warmer.server.js \
  app/routes/pcon-proxy.api.pcon.init.jsx \
  app/routes/pcon-proxy.api.pcon.update.jsx \
  extension-build/src/store/configurator-store.js \
  extension-build/src/App.jsx \
  extension-build/src/components/ConfiguratorScene.jsx \
  extension-build/src/components/PropertySelector.jsx \
  extensions/pcon-3d-configurator/blocks/configurator.liquid \
  extensions/pcon-3d-configurator/assets/configurator.js \
  extensions/pcon-3d-configurator/assets/configurator.css

rm -f \
  app/services/cart-builder.server.js \
  extension-build/src/utils/cart.js \
  extension-build/src/utils/variant-detect.js \
  extension-build/src/components/AddToCartButton.jsx

npm run build:extension
shopify app deploy
```

> **Not:** Yukarıdaki `git checkout HEAD --` komutu, bu PR commit edilmeden ÖNCE çalıştırıldığında dosyaları en son commit'teki haline döndürür. Eğer bu PR commit edildiyse, `HEAD` yerine bir önceki commit hash'ini kullan (`git log` ile bul).

### Kısmi Rollback Senaryoları

#### Senaryo A: Backend cartProperties hatası, frontend sağlam

Backend cart-builder hatası olursa init/update route'larında sorun çıkar (response 500). Geri almak için:

```bash
git checkout HEAD -- \
  app/services/pcon-client.server.js \
  app/services/cache-warmer.server.js \
  app/services/article-warmer.server.js \
  app/routes/pcon-proxy.api.pcon.init.jsx \
  app/routes/pcon-proxy.api.pcon.update.jsx
rm -f app/services/cart-builder.server.js
```

Bu durumda frontend Add to Cart butonu hep disabled kalır (cartProperties null) ama sayfa çalışmaya devam eder. Kullanıcı sepete ekleyemez ama configurator çalışır.

#### Senaryo B: Frontend cart akışı hatası, backend sağlam

UI'da Add to Cart sırasında JS hatası olursa:

```bash
git checkout HEAD -- \
  extension-build/src/store/configurator-store.js \
  extension-build/src/App.jsx \
  extension-build/src/components/ConfiguratorScene.jsx
rm -f \
  extension-build/src/utils/cart.js \
  extension-build/src/utils/variant-detect.js \
  extension-build/src/components/AddToCartButton.jsx

npm run build:extension
```

Backend cartProperties üretmeye devam eder (zararsızdır) ama UI'da Add to Cart kaybolur. Kullanıcı eski configurator deneyimine döner.

#### Senaryo C: Liquid block hatası (theme editor'de görsel sorun)

```bash
git checkout HEAD -- extensions/pcon-3d-configurator/blocks/configurator.liquid
shopify app deploy
```

Bu sadece data-attribute'ları ve theme settings'i kaldırır; bootloader'daki fallback'ler nedeniyle JS kısmen çalışmaya devam eder ama variant ID detection DOM-only'ye düşer.

#### Senaryo D: CSS bozulmuş

Sadece görsel sorun:

```bash
git checkout HEAD -- extensions/pcon-3d-configurator/assets/configurator.css
shopify app deploy
```

Add to Cart kontrolleri unstyled görünür ama fonksiyonel kalır.

#### Senaryo E: Sadece env hatası (vat/taxcode)

`.env` veya Fly secrets'tan `PCON_TAX_RATE` ve `PCON_TAX_CODE` değerlerini değiştir/sil. Default değerler (`0.19`, `"DE"`) devreye girer.

```bash
fly secrets unset PCON_TAX_RATE PCON_TAX_CODE
fly deploy
```

### Redis cache rollback

Eğer rollback sonrası eski cartProperties'li entry'ler kafa karıştırıyorsa flush et:

```bash
redis-cli --scan --pattern 'pcon:*' | xargs redis-cli del
```

Yeni (rollback edilmiş) kod cartProperties yazmayacağı için cache temiz kalır.

---

## 9. Bilinen Kısıtlamalar

### 9.1 `_attachment`, `_obx_url`, `_reopen_url` boş

Kullanıcı isteği üzerine bu üç alan boş string olarak gönderiliyor. Eğer downstream sistem bu alanları zorunlu görüyorsa:

- **`_obx_url`**: `session.basket.getExportedGeometry(itemId, ["format=OBX"])` ile EAIWS'ten alınabilir; OBX dosyası app proxy üzerinden servis edilebilir.
- **`_reopen_url`**: PCON UI URL şablonu + OBX URL kombinasyonu (`https://ui.pcon-solutions.com/#GATEKEEPER_ID=...&obx=<encoded_obx_url>`).
- **`_attachment`**: `session.basket.getGeneratedImage(itemId, ["format=JPG", "size=600x600"])` ile thumbnail üretilebilir.

Hepsi opsiyonel implementasyondur, ileride ayrı issue olarak ele alınabilir.

### 9.2 VAT oranı hard-coded `0.19` default

Şu an env var'dan okunuyor (`PCON_TAX_RATE`). Multi-region pricing veya farklı kategoriler için farklı KDV oranları gerekiyorsa cart-builder'a per-product/per-region resolver eklenebilir.

### 9.3 Müşteriye görünür property filtresi

`buildVisibleProperties()` `visible && editable && choiceList` olan tüm property'leri gösterir — yani configurator UI'daki PropertySelector'la birebir aynı küme. Tema 3. parti middleware bazen subset gösterip bazılarını saklıyordu (örn. `ACOUSTIC_FELT_COLOR`, `ACOUSTIC_PANEL_FABRIC_GROUP` gizli). Eğer downstream bu filtre eksikliğinden hata verirse:

- **Geçici çözüm**: `app/services/property-mapper.server.js` içindeki `HIDDEN_PROPERTY_IDS` set'ine ID'leri ekleyin.
- **Kalıcı çözüm**: `cart-builder.server.js`'e ayrı bir `CART_HIDDEN_PROPERTY_IDS` set ekleyin (UI'dan farklı filtreleme için).

### 9.4 İlk istekte cartProperties null olabilir

Çok nadir bir race condition: init API call sürerken kullanıcı çok hızlı bir şekilde Add to Cart'a tıklarsa "Configuration not ready" hatası alır. Buton disabled olduğu için praktikte gerçekleşmez ama edge case olarak biliyoruz.

### 9.5 Tax rate KDV-dahil fiyatı varsayar

`computeVatPortion()` `pdSalesPrice`'ı KDV-dahil kabul eder. Eğer EAIWS KDV-hariç fiyat dönüyorsa formül yanlış olur. Doğrulamak için:
```
price * vat_rate / (1 + vat_rate) == _vat (örnek payload'da 1218.85)
```
Örnekte `7633.85 * 0.19 / 1.19 = 1218.85` ✓ — varsayım doğru.

---

## Sonuç

Bu PR'la birlikte custom 3D configurator extension'ı, tema'da iframe içinde çalışan eski PCON entegrasyonunun ürettiği `finalProperties` body'sini birebir yeniden üretip Shopify cart/add.js'e POST atan tam fonksiyonel bir Add to Cart deneyimine kavuştu. Backend tarafında EAIWS ham datasından deterministik üretim sayesinde cache layer'ı bozulmadı; frontend tarafında ise dinamik alanlar (request_id, basket_id, quantity) cart-add anında üretilerek downstream sistemlerin uniqueness varsayımları korundu.

Deploy sonrası bir sorun olduğunda yukarıdaki senaryolarla kısmi veya tam rollback yapılabilir; tüm değişiklikler commit edilmiş `HEAD`'in üstüne yapıldığı için `git checkout HEAD -- <file>` ile her dosya tek tek geri alınabilir.
