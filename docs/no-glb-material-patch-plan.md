# GLB-Sız Material Patch Planı
## "Her property değişiminde GLB indirme" sorununu çöz

**Koordinatör notu:** Bu döküman, Sonnet 4.6 agent'larına bölüm bölüm (faz bazında) görev olarak verilmek üzere hazırlanmıştır. Her faz, bağımsız bir agent tarafından yürütülmeli ve koordinatör tarafından denetlenmelidir. Bir sonraki faza geçiş, önceki fazın kabul kriterlerini karşılamasına bağlıdır.

---

## Sorunun Özeti

Kullanıcı bir property (örn. kumaş rengi) değiştirdiğinde sunucu `getExportedGeometry` çağırarak yeni bir GLB dosyası üretir. Bu dosya frontend'e indirilir, Three.js sahnesi yeniden yüklenir. Her tıklama için 1–3 saniyelik gecikme oluşur.

### Neden GLB yeniden üretiliyor?

EAIWS, hangi mesh'in hangi property'ye ait olduğunu bildiren bir API sunmuyor. Bu nedenle daha önce denenen `gltf-enricher` + `getMaterialPatch` yolu çalışmadı — `pconMaterialName` metadata'sı doldurulamadı, `MaterialSwapper` mesh bulamadı, `meshCount=0 skipped=1` hatası aldı. Her iki feature flag (`PCON_MATERIAL_PATCH_ENABLED`, `PCON_GEOMETRY_DELTA_ENABLED`) bu nedenle kapatıldı.

### Önerilen Çözüm

EAIWS'ten metadata beklemek yerine, **ilk yüklemede gelen GLB'yi Three.js'te parse ederek** `material.name` → `propId` eşleştirmesini kurmak. OFML ürünlerinde mesh/material isimleri property isimleriyle örtüşen bir örüntü içerir (örn. `"Seat_Fabric_01"` ↔ `"KECE_RENK"`). Bu eşleştirme bir kez kurulur (meshMap), sonraki tüm property değişimlerinde GLB export yapılmaz — sadece Three.js material patch uygulanır.

### Neden Bu Yaklaşım Uygulanabilir?

- Her ürün sayfası tek bir article ID ile sabit — kullanıcı ürün değiştiremiyor. meshMap bir kez kurulup oturum boyunca geçerli kalır.
- Nurus ürünleri sınırlı sayıda — eşleştirme Faz 0'da doğrulandıktan sonra tüm ürünler için çalışır.
- Geometri değişimleri (`a`/`r` flag) için yeni GLB yine çekilir — doğruluk garanti altında.

---

## Mevcut Altyapının Durumu

Aşağıdaki dosyalar halihazırda mevcut ve ilgili fazlarda kullanılacak:

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `app/services/pcon-client.server.js` | Aktif | Faz 1'de optimize edilecek |
| `app/routes/pcon-proxy.api.pcon.update.jsx` | Aktif | Faz 2'de güncellenecek |
| `app/routes/pcon-proxy.api.pcon.init.jsx` | Aktif | Faz 2'de minimal güncelleme |
| `extension-build/src/scene/SceneIndex.js` | Aktif, eksik | `pconMaterialName` userData boş geliyor; Faz 3'te extend edilecek |
| `extension-build/src/scene/MaterialSwapper.js` | Aktif, kısmen çalışıyor | mesh bulamıyor; Faz 3+4'te fix edilecek |
| `extension-build/src/store/configurator-store.js` | Aktif | Faz 3 ve 4'te güncellenecek |
| `scripts/inspect-glb.js` | Aktif | Faz 0'da referans alınacak |
| `extension-build/src/scene/GeometrySwapper.js` | Aktif | Dokunulmayacak |

---

## Faz Haritası ve Bağımlılıklar

```
Faz 0 (Doğrulama)
    │
    ├─ GEÇER ──► Faz 1 (Sunucu Optimizasyonları)
    │                │
    │            Faz 2 (Route Güncelleme)  ◄── Faz 1'e bağımlı
    │                │
    │            Faz 3 (SceneIndex + MeshMap)  ◄── Faz 0'a bağımlı
    │                │
    │            Faz 4 (Store Entegrasyonu)  ◄── Faz 2 + Faz 3'e bağımlı
    │                │
    │            Faz 5 (Test + Sertleştirme)
    │
    └─ BAŞARISIZ ──► Durdur, Koordinatöre bildir
```

**Paralel yürütülebilir:** Faz 1 ve Faz 3, Faz 0'ın onayından sonra aynı anda iki ayrı agent'a verilebilir. Birbirini bloklamaz.

---

## FAZ 0 — Material Adı Doğrulama (Go/No-Go)

### Amaç
Nurus ürünlerinin GLB'sindeki material isimlerinin, `getArticleData`'dan dönen property ID'leriyle örtüşüp örtüşmediğini doğrulamak. Bu faz, bir sonraki fazların tamamına karar verir.

### Agent'a Verilecek Bağlam Dosyaları
- `scripts/inspect-glb.js` (referans — benzer yapıda yeni script yazılacak)
- `app/services/pcon-client.server.js` (getArticleData'nın return shape'ini anlamak için)
- `package.json` (mevcut bağımlılıklar; `gltf-pipeline` zaten mevcut)

### Yapılacak İş
Yeni bir script dosyası oluştur: `scripts/validate-material-mapping.js`

Script şunları yapmalı:
1. CLI argümanı olarak bir GLB dosya yolu al (`node scripts/validate-material-mapping.js <glb-path> [article-props-json-path]`)
2. `gltf-pipeline`'ın `glbToGltf` fonksiyonu ile GLB'yi parse et (inspect-glb.js'deki gibi)
3. `gltf.materials[]` dizisinden tüm material isimlerini çıkar
4. Opsiyonel ikinci argüman olarak, `getArticleData` çıktısından alınmış bir `properties.json` dosyası kabul et  
   - Bu dosya `[{id: "PROPCLASS.PROPNAME", ...}]` formatında olacak
5. Her material ismi için, tüm property ID'leri içinde substring eşleşmesi ara (case-insensitive, `_` ve `.` normalize edilmiş)
6. Çıktı olarak bir tablo bas:
   - Toplam material sayısı
   - Eşleşen material sayısı ve yüzdesi
   - Her material için: `material.name` | `eşleşen propId` | `EŞLEŞTI / EŞLEŞMEDI`
7. Son satırda karar yaz: `%60+ eşleşme → DEVAM`, `%60 altı → DUR`

### Kabul Kriterleri
- [x] Script çalışıyor, GLB parse hatası vermiyor
- [x] Eşleşme tablosu çıktısı doğru ve anlaşılır
- [ ] En az bir Nurus ürünü GLB'si için test edilmiş, çıktı koordinatöre sunulmuş

### Agent Notu
Bu faz **kod değişikliği içermiyor** — sadece yeni bir script. `inspect-glb.js`'i referans al ama kopyalama. Uzun açıklamalar ekleme, sadece çalışan script yaz. GLB dosyası olmadan çalışıyorsan, script'i yazıp koordinatöre "GLB dosyası gerekiyor, şu komutu çalıştır:" mesajıyla sun.

---

## FAZ 1 — Sunucu Tarafı Performans Optimizasyonları

> **Ön koşul:** Faz 0 geçmeli. Faz 3 ile paralel yürütülebilir.

### Amaç
`pcon-client.server.js` içindeki gereksiz sıralı RPC çağrılarını, gereksiz yüklü seçenekleri ve koşulsuz çağrıları optimize et. Bu değişiklikler mesh-mapping'den bağımsız, saf performans kazanımlarıdır.

### Agent'a Verilecek Bağlam Dosyaları
- `app/services/pcon-client.server.js` (DEĞİŞTİRİLECEK dosya)
- `node_modules/@easterngraphics/wcf/modules/eaiws/basket/BasketTypes.d.ts` (SetPropertyValueOptions API referansı için ilk 50 satır yeterli)

### Yapılacak Değişiklikler

#### 1. Import Ekle
`SetPropertyValueOptions`'ı import et:
```js
import { GetChoiceListOptions, SetPropertyValueOptions } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";
```

#### 2. `getArticleData` metodu — 3 sıralı RPC → `Promise.all`

**Mevcut akış:** `getArticleData` → `getAllChoiceLists` → `getExportedGeometry` (sıralı, ~1300ms)

**Yeni akış:** Üçünü `Promise.all` ile paralel çalıştır.

Dikkat: `_measureRpc` wrapper'larını koru ama `Promise.all` içine al. Return shape değişmemeli. `getExportedGeometry` argümanına `"texTrans=true"` ekle: `["format=GLTF", "texTrans=true"]`.

#### 3. `setPropertyValue` metodu — 5 değişiklik

**3a. Property döngüsü → `Promise.all`**

Mevcut `for...of` döngüsünü `Promise.all` ile değiştir. Her property için `SetPropertyValueOptions` nesnesi oluştur:
- `computeChoiceListChangeFlags = true`
- `computeVisibilityChangeFlags = false`
- `computeValueChangeFlags = false`

Her `setPropertyValue` çağrısının return değerini topla (flag string). Hepsi tamamlanınca flag string'leri birleştir: `combinedFlags = flagResults.join("")`. Mevcut `isSkippablePropertyError` catch mantığını koru.

Timer için: `Promise.all` öncesi `setPropStart` al, sonrası `markRaw("eaiws.setProp", ...)` yaz — mevcut pattern'i koru.

**3b. `getArticleData` — `fetchCatalogImage: false`, `fetchCatalogIcon: false`**

Property güncellemesinde katalog görselı değişmez. Her iki flag'i `false` yap.

**3c. `getAllChoiceLists` — koşullu çağrı + hafif seçenekler**

`combinedFlags` içinde `"C"` veya `"I"` varsa choice list değişmiş demektir.

- `combinedFlags.includes("C") || combinedFlags.includes("I")` → `choiceListChanged`
- `combinedFlags.includes("a") || combinedFlags.includes("r")` → `hasGeometryChange`

`choiceListChanged` ise: `getAllChoiceLists` çağır ama hafif seçeneklerle:
```js
const lightOptions = new GetChoiceListOptions();
lightOptions.enableBooleanPropType = true;
lightOptions.highResPropValueIcons = false;  // görseller değişmez
lightOptions.fetchPropValueImages   = false; // görseller değişmez
```
`choiceListChanged` değilse: `getAllChoiceLists` ÇAĞIRMA, `null` döndür, bir sonraki adımda mevcut/cached değerleri kullan.

**3d. `getArticleData` + `getAllChoiceLists` → `Promise.all`**

İkisini paralel çalıştır.

**3e. `getExportedGeometry` — koşullu çağrı**

`hasGeometryChange` (flag `"a"` veya `"r"`) varsa çalıştır. Yoksa çalıştırma.

Return shape'e `hasGeometryChange` ve `changeFlags` alanlarını ekle:
```js
return {
  price,
  gltfUrl: hasGeometryChange ? gltfUrl : null,  // null = GLB değişmedi
  hasGeometryChange,
  changeFlags: combinedFlags,
  properties,
  currency,
  cartProperties,
};
```

#### 4. `getMaterialPatch` metodu — 2 değişiklik
- `getArticleData` çağrısında `fetchCatalogImage: false`, `fetchCatalogIcon: false` yap
- `getAllChoiceLists` + `getArticleData` → `Promise.all` ile paralel çağır

Bu metodda `getAllChoiceLists`'in `fetchPropValueImages: true` kalması gerekiyor (texture URL için). Değiştirme.

#### 5. `getGeometryDelta` metodu — 1 değişiklik
- Step 6'daki `getArticleData` ve `getAllChoiceLists` çağrılarını `Promise.all` ile paralel yap
- `getArticleData`'da `fetchCatalogImage: false`, `fetchCatalogIcon: false` yap

### Kabul Kriterleri
- [ ] `getArticleData` içindeki 3 RPC `Promise.all` ile çalışıyor
- [ ] `setPropertyValue` `SetPropertyValueOptions` kullanıyor ve flag dönüyor
- [ ] `setPropertyValue` return shape'inde `gltfUrl: null` ve `hasGeometryChange: false` mümkün
- [ ] `getMaterialPatch` ve `getGeometryDelta` `fetchCatalogImage: false` kullanıyor
- [ ] Mevcut `_measureRpc` telemetri yapısı bozulmamış
- [ ] Linter hatası yok

### Agent Notu
Sadece `pcon-client.server.js` dosyasını değiştir. Başka dosyaya dokunma. Return shape değişikliği Faz 2'nin girdisi — kontratı bozmadan genişlet (yeni alanlar ekle, eski alanları çıkarma).

---

## FAZ 2 — Route Güncelleme: "No-GLB" Response Tipi

> **Ön koşul:** Faz 1 tamamlanmış ve kabul edilmiş olmalı.

### Amaç
`pcon-proxy.api.pcon.update.jsx` route'unu, `pcon-client.server.js`'in artık `gltfUrl: null` dönebildiği yeni akışa uyarla. GLB değişmediğinde frontend'e `type: "no-glb"` döndür.

### Agent'a Verilecek Bağlam Dosyaları
- `app/routes/pcon-proxy.api.pcon.update.jsx` (DEĞİŞTİRİLECEK)
- `app/routes/pcon-proxy.api.pcon.init.jsx` (referans — cache format anlamak için)
- `app/services/pcon-client.server.js` (Faz 1 çıktısı — yeni return shape için)
- `app/services/redis-client.server.js` (cache API referansı için)

### Yapılacak Değişiklikler

#### `pcon-proxy.api.pcon.update.jsx` — Full-GLB yolu (alt kısım)

Mevcut kodda `pcon.setPropertyValue(...)` çağrısının sonucundaki `data` nesnesi işleniyor. Faz 1 sonrası `data.gltfUrl` null olabilir ve `data.hasGeometryChange` false olabilir.

**No-GLB dalı ekle:**

`data.hasGeometryChange === false` (veya `data.gltfUrl === null`) ise:

1. Cache key'i `"no-glb-update"` tipiyle oluştur (mevcut update key formatını kullan)
2. Response nesnesini şu şekilde oluştur:
```js
const result = {
  type: "no-glb",                        // Frontend bu tip ile dallanır
  price: data.price,
  currency: data.currency,
  properties: data.properties,
  cartProperties: data.cartProperties || null,
  changeFlags: data.changeFlags,
};
```
3. Redis'e cache'le
4. `Response.json(result, { headers: ... })` ile dön

**Full-GLB dalı (mevcut, korunacak):**

`data.hasGeometryChange === true` ise: mevcut akış (`gltfUrl` swap) olduğu gibi kalsın. Sadece `result` nesnesine `type: "full-gltf"` ekle (şu an `type` yok — geriye dönük uyumluluk için mevcut davranışla ek field).

#### Stale itemId fallback — dokunma

`"unknown item id"` hatası için mevcut fallback mantığını değiştirme — olduğu gibi kalsın.

#### Cache versioning — dikkat

Cache'deki eski `"no-glb"` entry'leri için: `cached.type === "no-glb"` kontrolü ekle. Eski entry'ler `type` alanı taşımaz, bunlar full-GLB path'ine düşer (geriye uyumluluk).

### Kabul Kriterleri
- [ ] `setPropertyValue` `hasGeometryChange: false` döndürdüğünde route `type: "no-glb"` yanıtı gönderiyor
- [ ] `setPropertyValue` `hasGeometryChange: true` döndürdüğünde route eski `gltfUrl` swap akışında kalıyor
- [ ] `type: "no-glb"` response'u `gltfUrl` alanı içermiyor (veya `null`)
- [ ] Cache HIT'te `type` field'ı korunuyor ve doğru tip dönüyor
- [ ] Material-patch ve geometry-delta branch'leri (şu an OFF) dokunulmamış

### Agent Notu
Sadece `pcon-proxy.api.pcon.update.jsx` dosyasını değiştir. `pcon-proxy.api.pcon.init.jsx`'e dokunma. `tryMaterialPatchPath` ve `tryGeometryDeltaPath` yardımcı fonksiyonlarına dokunma.

---

## FAZ 3 — SceneIndex Genişletme + MeshMap Altyapısı

> **Ön koşul:** Faz 0 geçmeli. Faz 1 ile paralel yürütülebilir.

### Amaç
`SceneIndex.js`'i, Three.js sahnesindeki gerçek `mesh.material.name` değerlerini de indexleyecek şekilde genişlet. Bunu kullanarak property ID'lerini mesh'lere bağlayan bir `MeshMapper.js` yardımcı modülü yaz. `configurator-store.js`'e meshMap state'ini ekle.

### Agent'a Verilecek Bağlam Dosyaları
- `extension-build/src/scene/SceneIndex.js` (GENİŞLETİLECEK)
- `extension-build/src/scene/MaterialSwapper.js` (referans — mevcut kullanım anlaşılsın)
- `extension-build/src/store/configurator-store.js` (GÜNCELLENECEK — state ekleme)
- `extension-build/src/components/ConfiguratorScene.jsx` (referans — Model nasıl yükleniyor)

### Yapılacak Değişiklikler

#### 1. `SceneIndex.js` — `nativeMaterialMap` ekleme

`buildSceneIndex` fonksiyonuna yeni bir Map ekle: `nativeMaterialMap`.

Mevcut `traverse` döngüsü içinde, her node için:
- Eğer node bir `Mesh` ise (`node.isMesh === true`)
- Ve `node.material` mevcutsa
- `node.material.name` değerini al (boş string olabilir, atla)
- `nativeMaterialMap.get(materialName)` array'ine bu node'u push et (yoksa `[]` ile başlat)

Return objesine `nativeMaterialMap` ekle:
```js
return {
  subArticleMap,
  materialMap,        // mevcut — userData.pconMaterialName'den
  nativeMaterialMap,  // yeni  — mesh.material.name'den
  propertyTagMap,
  sceneSnapshot,
  sceneRoot,
};
```

`findTargetMeshes` fonksiyonuna `nativeMaterialMap` parametresi ekle ve `targetSelectors` içinde `"mat:<name>"` prefix'i destekle:
```js
// targetSelector örneği: "mat:Seat_Fabric_01"
if (sel.startsWith("mat:")) {
  const matName = sel.slice(4);
  const nodes = nativeMaterialMap?.get(matName) || [];
  // mesh descendant'ları collect et (mevcut collectMeshDescendants helper'ını kullan)
}
```

#### 2. Yeni dosya: `extension-build/src/scene/MeshMapper.js`

Bu modül, Three.js scene'deki native material isimleri ile property ID'leri arasındaki eşleştirmeyi kurar.

```js
/**
 * Bir Three.js sahnesindeki material isimlerini property ID'lerine eşler.
 * 
 * Eşleştirme algoritması (case-insensitive, normalize edilmiş):
 *   1. material.name normalize edilir: küçük harf, `_` ve `.` → boşluk
 *   2. Her property ID'nin propName kısmı normalize edilir: aynı kurallar
 *   3. material.name içinde propName substring olarak aranır
 *   4. Bulunan eşleşme: propId → ["mat:<materialName>", ...] selector listesi
 * 
 * @param {object} scene THREE.Group / Scene root
 * @param {Array<{id: string}>} properties [{id: "PROPCLASS.PROPNAME"}, ...]
 * @returns {Map<string, string[]>} propId → targetSelector[] map'i
 */
export function buildMeshMap(scene, properties) { ... }

/**
 * MeshMap'in boş olup olmadığını veya belirli bir prop için sonuç
 * döndürüp döndürmediğini kontrol eder.
 */
export function hasMeshMapping(meshMap, propId) { ... }
```

Normalizasyon fonksiyonu:
```js
function normalize(str) {
  return String(str || "").toLowerCase().replace(/[_.]/g, " ").replace(/\s+/g, " ").trim();
}
```

Eşleştirme önceliği:
1. Tam eşleşme (`normalize(materialName) === normalize(propName)`) — en yüksek
2. Substring eşleşme (`normalize(materialName).includes(normalize(propName))`)
3. Ters substring (`normalize(propName).includes(normalize(materialName))`)

Bir material birden fazla property'ye eşleşirse, en uzun propName kazanır (daha spesifik eşleşme).

#### 3. `configurator-store.js` — meshMap state

State'e ekle:
```js
meshMap: null,   // Map<propId, string[]> | null — null: henüz kurulmamış
```

Action ekle:
```js
setMeshMap(meshMap) {
  set({ meshMap: meshMap || null });
},
```

`initialize` action'ının başarı dalına not ekle: meshMap `null`'a sıfırla (yeni ürün yüklendiğinde eski map geçersiz). `set({ ..., meshMap: null })` yeterli.

### Kabul Kriterleri
- [ ] `buildSceneIndex` `nativeMaterialMap` döndürüyor
- [ ] `findTargetMeshes` `"mat:<name>"` selector'ını tanıyor
- [ ] `MeshMapper.js` dosyası mevcut ve `buildMeshMap` export ediyor
- [ ] `buildMeshMap` en az bir gerçek Three.js sahnesinde test edilmiş (birim test olmak zorunda değil — console.log ile doğrulama yeterli)
- [ ] `configurator-store.js`'de `meshMap` state ve `setMeshMap` action mevcut
- [ ] Linter hatası yok

### Agent Notu
`MaterialSwapper.js`'in iç kısımlarını değiştirme — sadece `SceneIndex.js` ve yeni `MeshMapper.js`. Store'da minimal değişiklik yap. `Model.jsx`'e veya diğer component'lara dokunma — bu Faz 4'ün işi.

---

## FAZ 4 — Store Entegrasyonu: No-GLB Client Patch Akışı

> **Ön koşul:** Faz 2 ve Faz 3 tamamlanmış ve kabul edilmiş olmalı.

### Amaç
GLB yüklendikten sonra meshMap'i otomatik kur. `updateProperty` action'ına `type: "no-glb"` response'unu işleyecek dal ekle. Geometri değişiminde (`a`/`r` flag) yeni GLB iste ve meshMap'i yenile.

### Agent'a Verilecek Bağlam Dosyaları
- `extension-build/src/store/configurator-store.js` (GÜNCELLEME — ana değişiklik)
- `extension-build/src/components/ConfiguratorScene.jsx` (referans — sceneRef nasıl set ediliyor)
- `extension-build/src/scene/MaterialSwapper.js` (referans — `applyMaterialPatch` imzası)
- `extension-build/src/scene/MeshMapper.js` (Faz 3 çıktısı — import edilecek)
- `extension-build/src/scene/SceneIndex.js` (referans — `buildSceneIndex` imzası)

### Yapılacak Değişiklikler

#### 1. `configurator-store.js` — `setSceneRef` güncelleme

Mevcut:
```js
setSceneRef(scene) {
  set({ sceneRef: scene || null });
},
```

Yeni:
```js
setSceneRef(scene) {
  if (!scene) {
    set({ sceneRef: null, meshMap: null });
    return;
  }
  set({ sceneRef: scene });
  // meshMap'i asenkron olarak kur (non-blocking)
  const { properties } = get();
  if (properties && properties.length > 0) {
    Promise.resolve().then(() => {
      try {
        const { buildMeshMap } = require('../scene/MeshMapper.js');  // import at top
        const meshMap = buildMeshMap(scene, properties);
        set({ meshMap });
        console.log(`[store] meshMap built: ${meshMap.size} property mappings`);
      } catch (err) {
        console.warn('[store] meshMap build failed:', err.message);
      }
    });
  }
},
```

**Önemli:** `buildMeshMap` import'unu dosyanın üstüne ekle.

#### 2. `configurator-store.js` — `updateProperty` güncellemesi

Mevcut kodda sunucudan dönen `data` nesnesi `type` field'ına göre dallanıyor (`material-patch`, `geometry-delta`, full-gltf). Buraya yeni bir dal ekle.

`data.type === "no-glb"` durumu için, mevcut `material-patch` dalının hemen üstüne:

```js
// ── No-GLB yolu: sadece Three.js material patch ──────────────
if (data && data.type === "no-glb") {
  const { sceneRef, meshMap, customIcons } = get();
  
  // meshMap mevcut değilse — fallback: full GLB iste
  if (!sceneRef || !meshMap || meshMap.size === 0) {
    console.warn("[store] no-glb received but meshMap empty, requesting full GLB");
    // full-GLB için yeni istek at (mevcut updateProperty'yi tekrar çağırmak yerine
    // sadece gltfUrl'yi zorla yenile — aşağıdaki full-gltf path'ini tetikle)
    // TODO: koordinatöre sor — fallback stratejisi onaylanacak
    set({ updating: false });
    return;
  }

  // Değişen property'ler için material patch uygula
  const changedProps = data.properties || [];
  if (sceneRef) {
    for (const prop of changedProps) {
      if (prop.id !== key) continue;  // sadece değişen property'yi patch'le
      const targetSelectors = meshMap.get(prop.id) || [];
      if (targetSelectors.length === 0) continue;

      const option = prop.options?.find(o => o.value === prop.currentValue);
      const textureUrl = option?.icon || null;

      // MaterialSwapper'ın mevcut applyMaterialPatch'i yerine
      // buildSceneIndex + findTargetMeshes ile direkt uygula
      try {
        const { buildSceneIndex, findTargetMeshes } = await import('../scene/SceneIndex.js');
        const { applyMaterialPatch } = await import('../scene/MaterialSwapper.js');
        const patchPayload = {
          patches: [{
            propClass: prop.id.split('.')[0],
            propName: prop.id.split('.')[1],
            value: prop.currentValue,
            targetSelectors,
            material: {
              baseColorTextureUrl: textureUrl,
              baseColorFactor: null,
              metalness: 0,
              roughness: 0.85,
            }
          }]
        };
        await applyMaterialPatch(sceneRef, patchPayload);
      } catch (err) {
        console.warn('[store] no-glb material patch failed:', err.message);
      }
    }
  }

  const merged = mergeProperties(optimistic, data, customIcons);
  responseCache.set(cacheKey, { type: "no-glb", ...data });
  
  set({
    price: data.price,
    currency: data.currency || get().currency,
    properties: merged,
    cartProperties: data.cartProperties || get().cartProperties,
    updating: false,
    lastResponseType: "no-glb",
  });
  recorder.mark("paint_state_set");
  recorder.flushToConsole();
  recorder.flushToWindow();
  return;
}
```

**Geometri değişimi flag'i (`changeFlags`):**

Eğer `data.type === "no-glb"` ama `data.changeFlags` içinde `"a"` veya `"r"` varsa (nadir durum — flag hesabı sunucu tarafında), yeni GLB talep et:
```js
const hasGeomChange = data.changeFlags && (data.changeFlags.includes("a") || data.changeFlags.includes("r"));
if (hasGeomChange) {
  // meshMap'i sıfırla — bir sonraki sceneRef set'inde yeniden kurulacak
  set({ meshMap: null });
  // gltfUrl swap normal akışa dönsün (aşağıdaki full-gltf path devam eder)
}
```

#### 3. Cache — `"no-glb"` tipi

`updateProperty` içindeki cache HIT dalına `type: "no-glb"` handling ekle — `material-patch` cache HIT dalından sonra, mevcut `full-gltf` dalından önce:

```js
if (cached.type === "no-glb") {
  // Aynı no-glb logic'i cache HIT'te de çalışır
  // (yukarıdaki no-glb branch'ini ayna etki)
  ...
  return;
}
```

### Kabul Kriterleri
- [ ] GLB yüklendikten sonra `store.meshMap` dolmuş (`console.log` ile doğrulanabilir)
- [ ] `type: "no-glb"` response geldiğinde `gltfUrl` değişmiyor, sahne remount olmuyor
- [ ] Material patch görsel olarak uygulanıyor (en az bir property için)
- [ ] `meshMap` boşsa kod çökmüyor, sessizce `updating: false` yapıyor
- [ ] Cache HIT'te `no-glb` tipi doğru işleniyor
- [ ] Linter hatası yok

### Agent Notu
Sadece `configurator-store.js` dosyasını değiştir. `ConfiguratorScene.jsx` veya `Model.jsx`'e dokunma. `applyMaterialPatch` imzasını değiştirme. Eğer `MaterialSwapper`'ın mevcut `applyMaterialPatch` fonksiyonu `targetSelectors` boş olunca çöküyorsa, koordinatöre bildir — Faz 5'te fix edilecek.

---

## FAZ 5 — Test ve Sertleştirme

> **Ön koşul:** Faz 4 tamamlanmış olmalı.

### Amaç
Uçtan uca akışı doğrula. Kenar durumları sertleştir. Performans ölçümü yap.

### Agent'a Verilecek Bağlam Dosyaları
- `docs/perf-baseline.md` (mevcut baseline referansı)
- Tüm değiştirilen dosyalar

### Yapılacak İş

#### Test Senaryoları (manuel, browser geliştirici araçları ile)

1. **Temel akış:** Appearance property değiştir → Network sekmesinde yeni GLB isteği OLMAMALI, sadece `/api/pcon/update` isteği olmalı
2. **Geometri değişimi:** Boyut/form değiştiren bir property seç → Yeni GLB isteği OLMALI, meshMap sonraki yüklemede yeniden kurulmalı
3. **Hızlı tıklama:** 3 property'yi hızlıca art arda değiştir → Hata/çökme olmamalı, son state doğru olmalı
4. **Sayfa yenileme:** URL property sync çalışmalı (mevcut davranış bozulmamış)
5. **Cache HIT:** Aynı kombinasyona geri dön → Network isteği olmamalı (mevcut cache davranışı korunmuş)

#### Ölçüm

`perf-baseline.md`'deki mevcut metriklerle karşılaştır. `window.__pconPerf` ring buffer'ından `updateProperty` `click→paint_state_set` sürelerini kaydet.

#### Sertleştirme — Olası Sorunlar

1. **`applyMaterialPatch` `targetSelectors` boşsa:** `MaterialSwapper.js`'de erken return ekle, throw etme
2. **`mesh.material` array ise:** Bazı mesh'lerde `material` array olabilir (multi-material). `nativeMaterialMap` indexleme sırasında array'deki her material için de ekle
3. **meshMap büyüklüğü:** 100+ property'li ürünlerde meshMap.size sınırı yok ama build süresi ölçülmeli (<5ms beklenti)

### Kabul Kriterleri
- [ ] 5 test senaryosu geçiyor
- [ ] Appearance property değişiminde GLB indirmesi yok (Network sekmesinde doğrulandı)
- [ ] `click→paint_state_set` süresi baseline'dan en az 500ms düşük
- [ ] Console'da beklenmedik hata yok
- [ ] `perf-baseline.md` güncellendi

---

## Koordinatör Kontrol Listesi

Her faz tesliminde şunları kontrol et:

| Faz | Kontrol |
|-----|---------|
| 0 | Material eşleşme yüzdesi ≥ %60 mu? Tablo makul görünüyor mu? |
| 1 | `setPropertyValue` return shape doğru mu? `hasGeometryChange: false` mümkün mü? Telemetri kırılmamış mı? |
| 2 | Route'dan `type: "no-glb"` cevabı gelabiliyor mu? Cache format doğru mu? |
| 3 | `buildMeshMap` gerçek sahne üzerinde test edildi mi? `nativeMaterialMap` doldu mu? |
| 4 | GLB swap olmadan material değişiyor mu? meshMap boşsa sessizce atlanıyor mu? |
| 5 | Network sekmesinde GLB isteği yok mu? Hız kazanımı ölçüldü mü? |

---

## Kritik Tasarım Kararları ve Gerekçeleri

### Neden `SceneIndex.js`'i genişletiyoruz, yeni dosya yazmıyoruz?
`MaterialSwapper.js` zaten `buildSceneIndex` + `findTargetMeshes` kullanıyor. `nativeMaterialMap`'i `SceneIndex`'e eklemek, `MaterialSwapper`'ın mevcut `applyMaterialPatch` çağrısının `"mat:<name>"` selector desteğiyle çalışmasını sağlar — yeni bir patch motoru yazmak zorunda kalmayız.

### Neden `getAllChoiceLists` tamamen kaldırılmıyor?
Texture URL'leri (`option.image`) choice list response'undan geliyor. Material rengi/texture'ı değiştirmek için bu URL gerekli. `getAllChoiceLists` hafif seçeneklerle ve koşullu olarak çağırılmaya devam ediyor — tamamen kaldırmak mümkün değil.

### Neden meshMap `configurator-store.js`'de tutuluyor?
`sceneRef` zaten store'da. meshMap, sceneRef'e bağlı ve component tree'den bağımsız bir state. Store'da tutmak, `updateProperty` action'ının sceneRef ve meshMap'e aynı anda erişmesini sağlar — prop drilling veya context olmadan.

### Neden Faz 1 ve Faz 3 paralel yürütülebilir?
Faz 1 yalnızca `pcon-client.server.js` (sunucu). Faz 3 yalnızca `SceneIndex.js`, `MeshMapper.js`, `configurator-store.js` (istemci). Hiçbir ortak dosya yok. Faz 2 (Faz 1'e bağımlı) ve Faz 4 (her ikisine bağımlı) biter bitmez birleştirilir.
