# Add to Cart Implementasyonu — Değişiklik ve Rollback Dökümanı

**İlk implementasyon:** 30 Nisan 2026
**v2 (asset URL'leri):** 30 Nisan 2026 — bu dosyanın güncel durumu
**Konu:** Custom 3D Configurator'e Shopify cart/add.js entegrasyonu (PCON → Shopify cart)
**Branch baseline:** `dbcbdd1 Add to cart changes 1` (en son commit)

Bu doküman, configurator extension'ına eklenen "Add to Cart" özelliğinin tüm değişikliklerini ve deploy sonrası bir hata oluşması durumunda nasıl geri alınacağını detaylı şekilde anlatır. Tema iframe'inin gönderdiği `finalProperties` body'siyle birebir uyumlu cart payload'u backend'de EAIWS ham datasından üretilir.

> **v2 değişiklik özeti:** İlk implementasyonda `_attachment`, `_obx_url`, `_reopen_url` boş, `_request_id` ve `_basket_id` frontend'de generate ediliyordu. Kullanıcı feedback'i sonrası bu altı alan da backend'de üretilir hale geldi. EAIWS session-bound URL'leri olduğu için cache'e yazılmaz; cart-add anında **yeni `/api/pcon/cart-payload` endpoint'i** ile fresh çekilir.

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

Tema'da çalışan iframe + postMessage tabanlı PCON entegrasyonu kaldırılıp custom configurator extension'ında native bir Add to Cart akışı kuruldu. Mağazanın downstream sistemleri (CRM, sipariş işleme, OCI plugin) `properties` objesindeki belirli underscore'lu meta key'lere göre çalıştığı için cart payload'ı tema iframe'inin gönderdiğiyle **birebir aynı** üretilir — anahtar sırası dahil.

### v2 Mimari Değişikliği — Static / Dynamic Bölünmesi

`cartProperties` **iki katmanlı** üretilir:

| Katman | İçerik | Üretim yeri | Cache |
|--------|--------|-------------|-------|
| **Static** | `_description`, `_Configuration_Price`, `_vendormat`, `_manufactcode`, divider'lar, müşteriye görünür property'ler... | `cart-builder.server.js → buildCartProperties()` (init/update route) | Redis, 24h TTL |
| **Dynamic** | `_request_id`, `_basket_id`, `_quantity`, `_attachment`, `_obx_url`, `_reopen_url`, `_article_image` | `pcon-client.generateCartAssets()` + `cart-builder.mergeCartAssets()` (cart-payload route) | **Yok** — her cart-add'de fresh |

Static katman sadece **placeholder string**'ler içerir dinamik alanlar için (`_request_id: ""`, `_obx_url: ""` vb.). Bu sayede legacy anahtar sırası korunur — JS object insertion order, sonradan overwrite edildiğinde de pozisyonu değiştirmez.

Dynamic katmanın cache'lenmemesinin nedeni: EAIWS asset URL'leri (`/session-cache/<session-id>/...`) **session-bound**'tur. Session expire olduğunda URL'ler geçersizleşir. Redis 24h TTL'inde tutmak imkânsız — bu yüzden cart-add anında fresh çekilir.

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
  ├─ buildCartProperties() → STATIC cart payload (placeholder dynamic fields)
  └─ Redis'e cartProperties dahil cache'ler (24h TTL)
        │
        ▼
[Frontend Zustand store]
  └─ cartProperties (static), quantity, variantId, successAction state yönetir
        │
        ▼
[AddToCartButton]
  └─ onClick → store.addToCart()
        │
        ▼
[store.addToCart()]
  ├─ POST /api/pcon/cart-payload { properties, itemId, articleNumber, manufacturerId, quantity }
  │     │
  │     ▼
  │  [cart-payload route]
  │  ├─ pcon.setPropertyValue(itemId, properties) → stale-fallback ile re-establish
  │  ├─ pcon.generateCartAssets(itemId)
  │  │     ├─ basket.copy([itemId], ...)            → _obx_url
  │  │     ├─ basket.getGeneratedImage(...)         → _attachment
  │  │     └─ basket.getArticleData(fetchCatalog…) → _article_image
  │  ├─ generateRequestId() / generateBasketId()
  │  ├─ buildReopenUrl(obxUrl) → _reopen_url
  │  └─ mergeCartAssets(staticCart, dynamicFields) → finalProperties
  │
  ├─ POST /cart/add.js  { items: [{ id: variantId, quantity, properties: finalProperties }] }
  └─ successAction'a göre: drawer-event | redirect | reload | none
```

### Üretilen `finalProperties` Yapısı (legacy ile birebir)

```
_description, _request_id, _quantity, _unit, _Configuration_Price,
_currency, _vendormat, _Configuration, _cust_field1..5, _ext_quote_id,
_service, _leadtime, _ext_quote_item, _contract_item, _manufactcode,
_manufactmat, _ext_product_id, _matgroup, _vendor, _contract,
_priceunit, _attachment, _attachment_purpose, _item_type, _parent_id,
_article_image, _eco, _eco_info, _obx_url, _oci_plugin, _priceservice,
_reopen_url, _taxcode, _vat, _ean, _basket_id, _seriesid,
_additional_text, _special_model_info, divider 1, ...visible props...
```

---

## 2. Mimari ve Veri Akışı

### Backend tarafı

```
                  EAIWS
                    │
       ┌────────────┴────────────┐
       │                         │
       ▼ getArticleData         ▼ basket.copy / getGeneratedImage
       getAllChoiceLists         (cart-add anında, yalnızca cart-payload route)
       │
PconClient (pcon-client.server.js)
 ├─ getArticleData()           — used by init route (cached)
 ├─ setPropertyValue()         — used by update route (cached) + cart-payload route (uncached)
 └─ generateCartAssets() — used by cart-payload route (uncached)
       │
       ▼ buildCartProperties(articleData, choiceLists)
cart-builder.server.js
       ├─ STATIC cartProperties (Redis-safe, placeholder dynamic fields)
       │       │
       │       ▼ Redis cache (24h TTL)
       │       └─ init/update route'lar response'a koyar
       │
       └─ mergeCartAssets(staticCart, runtime) — cart-payload route'unda
               ├─ requestId / basketId / quantity
               ├─ attachmentUrl / obxUrl / articleImageUrl
               └─ reopenUrl (default: buildReopenUrl(obxUrl))
                       │
                       ▼ FINAL cartProperties (legacy `finalProperties` ile aynı)
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
init/update response { ...rest, cartProperties: STATIC }
  ↓ store.set({ cartProperties })
AddToCartButton (sidebar)
  ↓ user click
store.addToCart()
  ↓ POST /api/pcon/cart-payload  ← v2 yenisi
backend builds FINAL cartProperties (with fresh assets + IDs)
  ↓ POST /cart/add.js with FINAL cartProperties
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

| Fonksiyon | Açıklama |
|-----------|----------|
| `buildCartProperties(articleData, choiceLists)` | Static portion (placeholder dynamic fields). Redis-safe. |
| `mergeCartAssets(staticCart, runtime)` | Static cart üzerine dinamik alanları yazar; immutable yeni obje döner. |
| `buildReopenUrl(obxUrl, opts?)` | PCON UI reopen URL'si (gatekeeper + obx + hook URL). |
| `generateRequestId()` | `PCON-` + 16 char crypto-grade alphanumeric. |
| `generateBasketId()` | `crypto.randomUUID()` (RFC4122 v4). |

**Yardımcı (private) fonksiyonlar:**
- `buildVisibleProperties(articleData, choiceLists)` — divider'lı, müşteriye görünür property listesi
- `computeVatPortion(price, taxRate)` — VAT-included fiyattan KDV portion
- `formatPrice(value, decimals)` — `toFixed` wrapper

**Sabitler (env üzerinden override edilebilir):**
- `TAX_RATE` — `process.env.PCON_TAX_RATE` (default `0.19`)
- `TAX_CODE` — `process.env.PCON_TAX_CODE` (default `"DE"`)
- `REOPEN_UI_BASE` — `process.env.PCON_REOPEN_UI_BASE` (default `"https://ui.pcon-solutions.com/"`)
- `REOPEN_LANG` — `process.env.PCON_REOPEN_LANG` (default `"en"`)
- `REOPEN_GATEKEEPER_ID` — `process.env.PCON_GATEKEEPER_ID` (mevcut env, paylaşılır)
- `REOPEN_HOOK_URL` — `process.env.PCON_REOPEN_HOOK_URL` (default `""`; legacy: `https://crm.nurus.com.tr/api/pcon/tryprices`)

**Bağımlılık:** `node:crypto` (randomBytes, randomUUID), `./property-mapper.server.js → HIDDEN_PROPERTY_IDS`

---

### `app/routes/pcon-proxy.api.pcon.cart-payload.jsx` (v2 yenisi)

Cart-add anında çağrılan POST endpoint'i.

**Body:**
```json
{
  "properties": { "PROPCLASS.PROPNAME": "value", ... },
  "itemId": "<eaiws-item-id-or-null>",
  "articleNumber": "P12.01.101",
  "manufacturerId": "NRUS",
  "quantity": 1
}
```

**Response:**
```json
{
  "cartProperties": { ... legacy finalProperties ... },
  "itemId": "<aktif-eaiws-item-id>"
}
```

**Akış:**
1. `pcon.setPropertyValue(itemId, propertyList)` — stale itemId'de article'ı re-insert eder (update route ile aynı pattern)
2. `pcon.generateCartAssets(activeItemId)` — paralel olarak `basket.copy()` + `getGeneratedImage()` + `getArticleData()`
3. `mergeCartAssets(updateResult.cartProperties, runtime)` — fresh static + dynamic merge
4. Response body'sinde tam `cartProperties` + güncel `itemId`

**Cache:** Yok. Her istekte EAIWS round-trip yapılır (~1-3 saniye).

---

### `extension-build/src/utils/cart.js` (yenisi → v2'de slim'lendi)

Shopify cart endpoint helpers + drawer event'leri.

**Public API:**
- `getCartAddUrl(routesRoot)` → multi-locale prefix'i hesaba katar
- `postCartAdd(routesRoot, items)` → fetch wrapper, Shopify hata mesajı parsing
- `dispatchCartUpdateEvents(payload)` → `cart:refresh`, `cart:added`, `cart:open`, `cart:updated` event'leri

**v2'de kaldırılan**: `generateRequestId`, `generateUUID` — backend'e taşındı (`cart-builder.server.js`).

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

2. `getArticleData()` return value'ya `cartProperties` eklendi (static — placeholder dynamic fields).

3. `setPropertyValue()` return value'ya `cartProperties` eklendi (aynı pattern).

4. **v2 yenisi:** `generateCartAssets(itemId)` method eklendi. Şu üç EAIWS çağrısını paralel yapar:
   - `basket.copy([itemId], null, null, {})` → OBX URL
   - `basket.getGeneratedImage(itemId, ["format=JPG", "width=800", "height=800"])` → attachment URL
   - `basket.getArticleData(itemId, { fetchCatalogImage: true })` → fresh catalog image URL

   Return: `{ obxUrl, attachmentUrl, articleImageUrl }`.

**Etkilenen caller'lar:** Init route, update route, cache-warmer (otomatik dolar), **cart-payload route (yeni)**.

**Rollback:** İmport satırı + iki return value'daki `cartProperties` satırlarını + `generateCartAssets` method'unu sil.

---

### `app/routes/pcon-proxy.api.pcon.init.jsx`

**Yapılan değişiklikler:**

1. Cache hit kontrolü `cached.cartProperties._request_id !== undefined` koşulunu da kontrol ediyor (v2: yeni format placeholder'lı; eski entry'ler organic miss):
   ```js
   if (
     cached &&
     cached.cartProperties &&
     cached.cartProperties._request_id !== undefined
   ) {
     return Response.json({ ...cached, gltfUrl: cached.originalGltfUrl || cached.gltfUrl });
   }
   ```

2. `result` objesine `cartProperties: data.cartProperties || null` eklendi.

**Rollback:** `if (cached)` koşulunu eski haline döndür, `result`'tan `cartProperties` satırını sil.

---

### `app/routes/pcon-proxy.api.pcon.update.jsx`

**Yapılan değişiklikler:**

1. Cache hit kontrolüne `cached.cartProperties._request_id !== undefined` koşulu eklendi (init ile aynı pattern, v2 format kontrolü).
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

**v2 değişiklikleri (özet):**

1. Imports güncellendi:
   ```js
   import { initArticle, updateProperties, fetchCartPayload } from "../utils/api.js";
   import { postCartAdd, dispatchCartUpdateEvents } from "../utils/cart.js";
   // generateRequestId, generateUUID artık import edilmiyor (backend'e taşındı)
   ```

2. State alanları (değişiklik yok):
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

3. `addToCart()` baştan yazıldı:
   - Önce `fetchCartPayload(proxyBase, { properties, itemId, articleNumber, manufacturerId, quantity })` çağrılır
   - Backend FINAL cartProperties (assets + IDs dahil) döner
   - Backend `itemId` değişikliği bildirirse store'da güncellenir (stale fallback senaryosu)
   - Bu finalProperties olduğu gibi `cart/add.js`'in `properties` alanına gömülür
   - Frontend artık `_request_id`, `_basket_id`, `_quantity` veya assets generate etmiyor

**Rollback:** Bu dosya çok kritik; geri almak için `git checkout HEAD~1 -- extension-build/src/store/configurator-store.js`.

---

### `extension-build/src/utils/api.js`

**v2 değişikliği:**

1. `fetchCartPayload(proxyBase, body)` helper eklendi (POST `/api/pcon/cart-payload`, 30s timeout).
2. `CART_PAYLOAD_TIMEOUT = 30000` sabit (default 15s yetersiz — EAIWS asset gen ek round-trip).

**Rollback:** Yeni export ve sabit'i sil.

---

### `extension-build/src/utils/cart.js`

**v2 değişikliği:** `generateRequestId` ve `generateUUID` fonksiyonları silindi (artık backend üretiyor). Geriye `getCartAddUrl`, `postCartAdd`, `dispatchCartUpdateEvents` kaldı. Header docstring güncellendi.

**Rollback:** İlk implementasyonun crypto-based ID generators'unu geri ekle (gerek olur mu — şüpheli; geriye dönmeyiz).

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

1. Dev sırasında bırakılmış noisy `console.log` satırları silindi.

**Rollback:** Add to Cart akışıyla doğrudan ilgisi yok.

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
   - `success_action` (select, default "drawer-event"): `drawer-event` / `redirect` / `reload` / `none`

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
   - `.pcon-cart__btn-spinner` — loading spinner
   - `.pcon-cart__error` — kırmızı hata kutusu
   - `.pcon-cart__success` — yeşil başarı kutusu

**Rollback:** "Add to Cart Section" yorum satırından "Skeleton / Placeholder UI" yorum satırına kadar olan bloğu sil.

---

### `extensions/pcon-3d-configurator/assets/configurator-app.js` (build output)

**Yapılan değişiklikler:**

Build artifact'i — `npm run build:extension` tarafından otomatik regenerate edilir. Bundle boyutu: **1,160 KB (gzip 327 KB)** — v1'le aynı (~+0 KB; ID generator'ler frontend'den çıktığı için net etki nötr).

**Rollback:** Sadece kaynak dosyaları geri alıp `npm run build:extension` çalıştır.

---

## 5. Yeni Env Değişkenleri

| Değişken | Default | Açıklama |
|----------|---------|----------|
| `PCON_TAX_RATE` | `0.19` | VAT hesaplaması için kullanılan oran (KDV-dahil fiyatın yüzde portion'ı). German VAT 19% varsayılır. |
| `PCON_TAX_CODE` | `DE` | `_taxcode` cart property'sine yazılan vergi ülke kodu. |
| `PCON_REOPEN_UI_BASE` | `https://ui.pcon-solutions.com/` | PCON UI'ın base URL'si. Reopen URL şu pattern'le construct edilir: `<base>/#GATEKEEPER_ID=...&obx=...`. |
| `PCON_REOPEN_LANG` | `en` | Reopen URL'deki `lang` parametresi. |
| `PCON_REOPEN_HOOK_URL` | (boş) | Reopen URL'deki `HOOK_URL` parametresi — CRM'in PCON UI'dan çağrılan tryprices endpoint'i. **Legacy değer:** `https://crm.nurus.com.tr/api/pcon/tryprices`. |
| `PCON_GATEKEEPER_ID` | (mevcut, paylaşılır) | EAIWS gatekeeper ID'si; aynı zamanda reopen URL'de `GATEKEEPER_ID` parametresi olarak kullanılır. |

**Eklemek için (yerel `.env`):**
```
PCON_TAX_RATE=0.19
PCON_TAX_CODE=DE
PCON_REOPEN_HOOK_URL=https://crm.nurus.com.tr/api/pcon/tryprices
```

**Eklemek için (Fly.io production):**
```bash
fly secrets set \
  PCON_TAX_RATE=0.19 \
  PCON_TAX_CODE=DE \
  PCON_REOPEN_HOOK_URL=https://crm.nurus.com.tr/api/pcon/tryprices
```

> **`PCON_REOPEN_HOOK_URL` boş bırakılırsa** reopen URL'de `HOOK_URL` parametresi hiç yer almaz. Bu durumda CRM, kullanıcı PCON UI'da konfigürasyonu reopen ettiğinde fiyat hook'u çalışmayabilir. Production'da mutlaka set edilmeli.

---

## 6. Cache Invalidation Stratejisi

### Otomatik (önerilen)

Init/update route'ları cache hit kontrolünde `cached.cartProperties._request_id !== undefined` koşulunu da kontrol eder. v2 öncesi yazılmış cache entry'lerinde:
- `cartProperties` tamamen yok → cache miss
- `cartProperties` var ama `_request_id` placeholder yok → cache miss (eski STATIC_META formatı)

Bu, **organik migration** sağlar — manuel flush gerekmez. İlk birkaç istek EAIWS round-trip yapar; sonrası fresh cache hit.

### Manuel (acil durumda)

Tüm pCon cache'ini sıfırlamak için:
```bash
redis-cli --scan --pattern 'pcon:*' | xargs redis-cli del
```

Selektif:
```bash
redis-cli --scan --pattern 'pcon:init:*' | xargs redis-cli del
redis-cli --scan --pattern 'pcon:update:*' | xargs redis-cli del
```

Cache scheduler (CRON) günde 2 kez (03:00 ve 15:00) re-warm yapacak, böylece manuel flush sonrası performans düşüşü ~birkaç saat içinde toparlar.

> **Not:** `cart-payload` endpoint'i hiç cache kullanmaz; her istek EAIWS round-trip yapar. Bu by-design (asset URL'leri session-bound).

---

## 7. Manuel Doğrulama Adımları

Deploy sonrası şu sırayla doğrula:

### 1. Backend health (init/update)

```bash
curl -s "https://APP_URL/apps/pcon-configurator/api/pcon/init?articleNumber=P12.01.101&manufacturerId=NRUS" | jq '.cartProperties | keys[:5]'
```

Beklenen: `["_Configuration", "_Configuration_Price", "_currency", "_description", "_ean"]` benzeri.

### 2. Cart payload endpoint (v2 yeni)

```bash
curl -sX POST \
  -H "Content-Type: application/json" \
  -d '{"properties":{"COLOR.PROP":"VALUE"},"itemId":null,"articleNumber":"P12.01.101","manufacturerId":"NRUS","quantity":1}' \
  "https://APP_URL/apps/pcon-configurator/api/pcon/cart-payload" \
  | jq '.cartProperties | { _request_id, _basket_id, _attachment, _obx_url, _reopen_url, _article_image, _quantity }'
```

Beklenen format (örnek değerler — tüm 7 alan dolu olmalı):
```json
{
  "_request_id": "PCON-XXXXXXXXXXXXXXXX",
  "_basket_id": "60c0d87e-61c5-4e57-8fc3-c5c74aed2721",
  "_attachment": "https://s1.eaiws.pcon-solutions.com/.../objects/<hash>.jpg",
  "_obx_url": "https://s1.eaiws.pcon-solutions.com/.../cut_buffer/00000001.obx",
  "_reopen_url": "https://ui.pcon-solutions.com/#GATEKEEPER_ID=...&obx=...",
  "_article_image": "https://s1.eaiws.pcon-solutions.com/.../objects/<hash>.jpg",
  "_quantity": "1"
}
```

### 3. Anahtar sırası kontrolü

```bash
curl -sX POST ... | jq -r '.cartProperties | keys_unsorted[:10] | join(",")'
```

Beklenen: `_description,_request_id,_quantity,_unit,_Configuration_Price,_currency,_vendormat,_Configuration,_cust_field1,_cust_field2`

### 4. Frontend UI

- PDP'yi aç → configurator yüklendiğinde **Add to Cart** butonu sidebar'ın altında görünmeli
- Buton initial olarak enabled olmalı (cartProperties + variantId her ikisi de set)
- Property değiştirince buton hala aktif kalmalı
- Quantity +/− tuşlarıyla değiştirilebilmeli
- "Add to Cart" tıklandığında network tab'da:
  - **Önce:** `POST /apps/.../api/pcon/cart-payload` — response'ta tam `cartProperties`
  - **Sonra:** `POST /cart/add.js` — body: `{ "items": [{ "id": <variant_id>, "quantity": 1, "properties": <finalProperties> }] }`
- `properties` objesinde `_request_id`, `_basket_id`, `_attachment`, `_obx_url`, `_reopen_url`, `_article_image`, `_quantity` ve tüm meta alanlar dolu olmalı
- Başarılı response sonrası drawer cart açılmalı

### 5. Hata senaryosu

- DevTools'tan variant input'u sil ve yeniden tıkla → buton "Could not detect a product variant on this page" gösterip tekrar enabled kalmalı
- EAIWS connect hatası → cart-payload endpoint 500 döndürür, frontend hata mesajı gösterir, buton tekrar enabled kalır

---

## 8. Rollback Prosedürü

### Tam Rollback (acil durum)

Tüm değişiklikleri geri al:

```bash
git checkout HEAD~1 -- \
  app/services/pcon-client.server.js \
  app/services/cache-warmer.server.js \
  app/services/article-warmer.server.js \
  app/routes/pcon-proxy.api.pcon.init.jsx \
  app/routes/pcon-proxy.api.pcon.update.jsx \
  extension-build/src/store/configurator-store.js \
  extension-build/src/utils/api.js \
  extension-build/src/utils/cart.js \
  extension-build/src/App.jsx \
  extension-build/src/components/ConfiguratorScene.jsx \
  extension-build/src/components/PropertySelector.jsx \
  extensions/pcon-3d-configurator/blocks/configurator.liquid \
  extensions/pcon-3d-configurator/assets/configurator.js \
  extensions/pcon-3d-configurator/assets/configurator.css

rm -f \
  app/services/cart-builder.server.js \
  app/routes/pcon-proxy.api.pcon.cart-payload.jsx \
  extension-build/src/utils/variant-detect.js \
  extension-build/src/components/AddToCartButton.jsx

npm run build:extension
shopify app deploy
```

> **Not:** `git checkout HEAD~1 --` komutu, bu PR commit'inin ÖNCESİNDEKİ commit'in haline döndürür. Eğer `dbcbdd1` haricinde commit eklendiyse, hash'i `git log` ile bul.

### Kısmi Rollback Senaryoları

#### Senaryo A: cart-payload endpoint hata veriyor, init/update sağlam

```bash
git checkout HEAD~1 -- \
  app/services/pcon-client.server.js \
  app/services/cache-warmer.server.js \
  app/services/article-warmer.server.js \
  app/routes/pcon-proxy.api.pcon.init.jsx \
  app/routes/pcon-proxy.api.pcon.update.jsx \
  extension-build/src/store/configurator-store.js \
  extension-build/src/utils/api.js \
  extension-build/src/utils/cart.js
rm -f \
  app/services/cart-builder.server.js \
  app/routes/pcon-proxy.api.pcon.cart-payload.jsx
# variant-detect ve AddToCartButton'ı bırakırsak unused kalır, sorun değil
npm run build:extension
```

Bu durumda Add to Cart butonu kayboluk (cartProperties null kalır frontend'de — store init'i de eski hale dönmüş olur), configurator çalışmaya devam eder.

#### Senaryo B: init/update'te cartProperties hata veriyor (5xx)

```bash
git checkout HEAD~1 -- \
  app/services/pcon-client.server.js \
  app/routes/pcon-proxy.api.pcon.init.jsx \
  app/routes/pcon-proxy.api.pcon.update.jsx \
  app/services/cache-warmer.server.js \
  app/services/article-warmer.server.js
rm -f \
  app/services/cart-builder.server.js \
  app/routes/pcon-proxy.api.pcon.cart-payload.jsx
```

cart-payload endpoint orphan kalır (silindi); frontend çağırırsa 404 alır. Add to Cart hata gösterir. Configurator sağlam.

#### Senaryo C: Frontend cart akışı hatası, backend sağlam

UI'da Add to Cart sırasında JS hatası olursa:

```bash
git checkout HEAD~1 -- \
  extension-build/src/store/configurator-store.js \
  extension-build/src/utils/api.js \
  extension-build/src/utils/cart.js \
  extension-build/src/App.jsx \
  extension-build/src/components/ConfiguratorScene.jsx
rm -f \
  extension-build/src/utils/variant-detect.js \
  extension-build/src/components/AddToCartButton.jsx

npm run build:extension
```

Backend cartProperties üretmeye devam eder (zararsızdır — kimse istemiyor) ama UI'da Add to Cart kaybolur.

#### Senaryo D: Liquid block hatası (theme editor'de görsel sorun)

```bash
git checkout HEAD~1 -- extensions/pcon-3d-configurator/blocks/configurator.liquid
shopify app deploy
```

#### Senaryo E: CSS bozulmuş

```bash
git checkout HEAD~1 -- extensions/pcon-3d-configurator/assets/configurator.css
shopify app deploy
```

#### Senaryo F: Sadece env hatası (vat/taxcode/reopen)

`.env` veya Fly secrets'tan değişkenleri unset et:

```bash
fly secrets unset \
  PCON_TAX_RATE \
  PCON_TAX_CODE \
  PCON_REOPEN_UI_BASE \
  PCON_REOPEN_LANG \
  PCON_REOPEN_HOOK_URL
fly deploy
```

Default değerler devreye girer.

### Redis cache rollback

Eğer rollback sonrası eski cartProperties'li entry'ler kafa karıştırıyorsa flush et:

```bash
redis-cli --scan --pattern 'pcon:*' | xargs redis-cli del
```

---

## 9. Bilinen Kısıtlamalar

### 9.1 Asset URL'leri session-bound — sipariş sonrası uzun süreli erişim sınırlı

`_attachment`, `_obx_url`, `_reopen_url`, `_article_image` URL'leri EAIWS session-cache'inden gelir (`/session-cache/<session-id>/...`). Session expire olunca (5 dk idle / pool rotation), bu URL'ler **404** döndürür.

**Etki:**
- Müşteri sipariş verir → URL'ler valid (cart-add anında fresh)
- Sipariş Shopify admin'e düşer → URL'ler hala valid (~dakikalar içinde)
- 1 saat sonra mağaza sahibi siparişi görüntüler → URL'ler **stale** olabilir

**Çözüm seçenekleri (gelecek issue):**
- Cart-add anında EAIWS dosyalarını **mağaza filesystem'ine** download et (gltf-cache.server.js benzeri pattern)
- Mağazada stable URL'ler serv et (`/apps/pcon-configurator/order-asset/<hash>.jpg`)
- Trade-off: Storage maliyeti + cleanup karmaşası

Şu an için legacy 3. parti middleware ile aynı davranış (URL'ler aynı şekilde session-bound).

### 9.2 cart-payload endpoint'i her cart-add'de EAIWS round-trip yapar

EAIWS asset üretimi (~1-3 saniye) cache'lenmediği için her Add to Cart click bir endpoint çağrısı tetikler. Çift tıklama veya rapid clicking durumunda:
- Frontend `cartLoading` flag ile koruma var
- Backend EAIWS pool serileşmiş — concurrent çağrılar queue edilir

İleride (~30 saniye) configuration-keyed short-term cache eklenebilir.

### 9.3 VAT oranı hard-coded `0.19` default

Şu an env var'dan okunuyor (`PCON_TAX_RATE`). Multi-region pricing veya farklı kategoriler için farklı KDV oranları gerekiyorsa cart-builder'a per-product/per-region resolver eklenebilir.

### 9.4 Müşteriye görünür property filtresi

`buildVisibleProperties()` `visible && editable && choiceList` olan tüm property'leri gösterir — yani configurator UI'daki PropertySelector'la birebir aynı küme. Tema 3. parti middleware bazen subset gösterip bazılarını saklıyordu (örn. `ACOUSTIC_FELT_COLOR`, `ACOUSTIC_PANEL_FABRIC_GROUP` gizli). Eğer downstream bu filtre eksikliğinden hata verirse:

- **Geçici çözüm**: `app/services/property-mapper.server.js` içindeki `HIDDEN_PROPERTY_IDS` set'ine ID'leri ekle
- **Kalıcı çözüm**: `cart-builder.server.js`'e ayrı bir `CART_HIDDEN_PROPERTY_IDS` set ekle (UI'dan farklı filtreleme için)

### 9.5 İlk istekte cartProperties null olabilir

Çok nadir bir race condition: init API call sürerken kullanıcı çok hızlı bir şekilde Add to Cart'a tıklarsa "Configuration not ready" hatası alır. Buton disabled olduğu için praktikte gerçekleşmez ama edge case olarak biliyoruz.

### 9.6 Tax rate KDV-dahil fiyatı varsayar

`computeVatPortion()` `pdSalesPrice`'ı KDV-dahil kabul eder. Eğer EAIWS KDV-hariç fiyat dönüyorsa formül yanlış olur. Doğrulamak için:
```
price * vat_rate / (1 + vat_rate) == _vat (örnek payload'da 1218.85)
```
Örnekte `7633.85 * 0.19 / 1.19 = 1218.85` ✓ — varsayım doğru.

### 9.7 `_unit` her zaman `"ST"` (German "Stück" = adet)

Legacy middleware sabit `"ST"` gönderiyor; biz de aynısını yapıyoruz. Eğer farklı birim (kg, m vb.) gerekirse `STATIC_META`'da düzenlenir. EAIWS `articleData`'da unit alanı varsa o kullanılabilir.

---

## Sonuç (v2)

İlk implementasyondaki "boş bırakılan asset URL'leri" sorunu giderildi. Artık `finalProperties` payload'u **tam ve legacy ile birebir uyumlu** — anahtar sırası, dinamik ID'ler, EAIWS asset URL'leri dahil. Mimari iki katmanlı:

- **Static**: Init/update route'larında üretilir, Redis'te cache'lenir, deterministik
- **Dynamic**: cart-payload route'unda fresh üretilir, asla cache'lenmez

Cart-add latency'si ~1-3 saniye (EAIWS asset gen), `cartLoading` UI flag'iyle kullanıcı feedback'i verilir. Backend stale-itemId fallback'ı ile session pool rotasyonu şeffaf şekilde toparlanır.

Bu PR commit edilmeden önce `git checkout HEAD~1 -- <file>` ile her dosya tek tek geri alınabilir; commit edildikten sonra `HEAD~1` yerine bir önceki commit hash'i kullanılır.
