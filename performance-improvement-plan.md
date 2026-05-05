# Performance Improvement Plan — pCon EAIWS + three.js Configurator

> Bu doküman, mevcut "her property değişiminde tam GLB indirme" yaklaşımından **MDD tarzı tek-GLB + runtime material/texture swap + sub-article delta** modeline geçiş için faz faz bir geçiş planıdır. Her faz ayrı bir agent'a görev olarak verilebilir; her fazın **Tanım**, **Kapsam**, **Dokunulacak dosyalar**, **Çıktılar**, **Kabul kriterleri** ve **Doğrulama** bölümleri vardır. Doküman bilinçli olarak teknoloji tarafsız değildir; mevcut React Router + Vite extension + Redis + EAIWS yığınımızı varsayar.

---

## 1. Yönetici Özeti (Executive Summary)

### Şu anki sorun

Her property değişiminde aşağıdaki zincir çalışıyor:

```
Storefront tıklama
   → /apps/pcon-configurator/api/pcon/update (POST)
   → EAIWS: setPropertyValue(...)
   → EAIWS: getArticleData(...) + getAllChoiceLists(...) + getExportedGeometry(format=GLTF)
   → server: full GLB URL döndür (~2–10 MB)
   → frontend: yeni gltfUrl → Model.jsx remount → GLTFLoader → Draco decode → GPU upload → fade-in
```

Cache HIT olsa bile **HTTP istek + GLB indirme + parse + GPU upload** maliyeti her seferinde ödeniyor. Cache MISS'te EAIWS round-trip 5–10 sn sürebiliyor.

### MDD'nin yaptığı (canlı analizden)

`https://mdd.eu/en/acoustic-pods/coda-4-person-acoustic-booth/` ürün sayfasında network analizi göstermiştir ki:

- İlk yüklemede **tek bir** statik GLB iniyor: `https://configurator.mdd.pl/models-glb/CD03.glb`
- Yanında **14 adet WebP texture** preload ediliyor (`textures/0008.webp`, `4202.webp`, `0101.webp`, `M030.webp`, …) — bunlar koleksiyondaki tüm renk/kumaş seçenekleri.
- HDRI environment + Draco decoder bir defa indiriliyor.
- **EAIWS RPC trafiği yok**, **WebSocket yok**, model dosyası tekrar inmiyor.
- Property değişiminde sadece three.js içindeki ilgili `MeshStandardMaterial` üzerinde `material.map` swap edilip `needsUpdate = true` set ediliyor; tek GLB sahnede kalmaya devam ediyor.

Yani MDD pCon'u **build-time / asset hazırlık aşamasında** kullanıyor; **runtime'da artık pCon'a hiç gitmiyor**. Bütün akış istemci tarafında, statik asset'ler üzerinden ilerliyor.

### Hedef mimari (hibrit)

Bizim ürünümüz tamamen statik kataloglu değil; runtime'da farklı article number / manufacturer kombinasyonları, farklı kataloglardan çekilen dinamik property setleri var. Bu yüzden MDD'nin "%100 statik" modelini doğrudan kopyalayamayız. Hedefimiz **iki kanallı bir update protokolü**:

1. **Appearance kanalı** — Renk, kumaş, kaplama gibi sadece **material** değiştiren property'ler için backend GLB üretmez; küçük bir JSON `MaterialPatch` döner. Frontend three.js sahnesinde ilgili mesh'in material'ını anında günceller. Hedef: **<150 ms görsel güncelleme**.
2. **Geometry kanalı** — Mesh ekleyen/çıkaran/şekil değiştiren property'ler için backend `getItemProperties(subArticles=true)` ile **hangi sub-article'ın geometryId'si değişti** onu tespit eder. Sadece değişen sub-tree için yeni GLB üretip frontend ilgili node'u in-place değiştirir. Hedef: 5 MB tam reload yerine **kategori bazlı 200–800 KB delta**.

Buna ek olarak **(a)** appearance texture'ları için browser-side hover prefetch, **(b)** persistent EAIWS session pool, **(c)** initial load için article-bazlı metafield ile prebake'lenmiş GLB+texture katalog desteği eklenecek.

### Beklenen etkiler

| Senaryo | Şu an | Hedef |
|---|---|---|
| İlk sayfa açılışı (cold MISS) | 8–15 sn | 4–7 sn |
| İlk sayfa açılışı (warm HIT) | 2–4 sn | 1–2 sn |
| Renk/kumaş değişimi | 1.5–4 sn | <300 ms |
| Geometri-etkileyen property | 2–6 sn | 600–1500 ms |
| Cart add | mevcut | dokunulmuyor |

---

## 2. Mevcut Durum Analizi (As-Is)

### 2.1 Mimari diyagram

```
[Storefront PDP]
   pcon-3d-configurator/blocks/configurator.liquid
     └─ #pcon-root + window.__pconCustomIcons
        └─ extensions/pcon-3d-configurator/assets/configurator-app.js  (vite bundle)
            ├─ App.jsx → ConfiguratorScene.jsx
            │            ├─ Canvas + Model.jsx (GLTFLoader + DRACOLoader)
            │            └─ PropertySelector.jsx → store.updateProperty()
            └─ store/configurator-store.js (zustand)
                ├─ in-memory `responseCache` (props-key → response)
                └─ utils/api.js → /apps/pcon-configurator/api/pcon/{init|update|cart-payload}

[Shopify App Proxy]  →  React Router app
   app/routes/pcon-proxy.api.pcon.init.jsx     (loader)
   app/routes/pcon-proxy.api.pcon.update.jsx   (action)
   app/routes/pcon-proxy.gltf.$.jsx            (local GLB serve, immutable cache)
   app/services/
       pcon-client.server.js     (singleton EaiwsSession; getArticleData / setPropertyValue / getExportedGeometry)
       property-mapper.server.js (EAIWS articleData → UI props + icon proxy)
       gltf-cache.server.js      (Redis entry hash → local .cache/gltf/<objectHash>.glb + Draco compress)
       cache-warmer.server.js    (background warmer; tek property layer-2)
       article-warmer.server.js  (manuel layer-1/2/3 warm)
       redis-client.server.js    (cacheGet/cacheSet)
```

### 2.2 Performans dar boğazları (gözlem + kod analizi)

1. **Her property değişiminde tam GLB üretimi** — `pcon-client.server.js:229` `getExportedGeometry(itemId, ["format=GLTF"])` her `setPropertyValue` çağrısından sonra ana article için tüm geometri export ediliyor. Renk değişimi de mesh değişimi de aynı maliyete giriyor.
2. **Material vs geometry değişimi ayrımı yok** — Backend her değişikliği aynı şekilde işliyor; frontend her seferinde GLTFLoader + Draco decode + GPU upload pipeline'ını baştan çalıştırıyor.
3. **Mesh-level bilgi atılıyor** — `getExportedGeometry` çağrısında `hierarchyMode` belirtilmemiş; sub-article meta'ları glTF'e yazılmıyor. Frontend hangi mesh'in hangi pCon material/sub-article ile eşleştiğini bilmiyor. Bu yüzden in-place patch *yapamıyor* (zorlanırsak rastgele mesh swap olur).
4. **Singleton EaiwsSession** — `pcon-client.server.js:326` tek bir session global; eş zamanlı kullanıcı dakikada 3–5'e çıktığında `currentItemId` race condition oluşuyor; `update` endpoint'inde "stale itemId" recovery var ama bu da extra round-trip.
5. **Cache key tüm property kombinasyonunu içeriyor** — `pcon-proxy.api.pcon.update.jsx:34` `generateCacheKey("update", { articleNumber, ...properties })`. N property × M değer için kombinasyon patlaması var; warmer sadece L2 (tek property değişimi) yapıyor. Çoklu seçimde her zaman MISS.
6. **Optimistic UI yok** — `store.updateProperty` butonu işaretliyor ama 3D görüntü `gltfUrl` değişene kadar eski hâlinde kalıyor; kullanıcı "tıkladım, bir şey olmadı" hissi yaşıyor.
7. **Texture'lar GLB içine gömülü** — Her renk seçimi için backend tamamen yeni GLB üretip içine yeni texture gömüyor. Aynı geometri için 50 farklı renk = 50 ayrı GLB (sadece texture farkı için).
8. **Spinner görünür süresi** — `ConfiguratorScene.jsx:74` SHOW_DELAY 200ms + MIN_VISIBLE 400ms. Cache HIT bile olsa toplam ~600ms spinner görüyoruz; texture swap'ta bunu tamamen atlamamız gerekecek.
9. **Spec'te de görüldüğü üzere `getExportedGeometry` ZIP/multi-file modu var** (`ascii=true`, `texTrans=true`) ama biz `format=GLTF` (tek GLB) kullanıyoruz; geometriyi texture'lardan ayırma seçeneğimizi bilinçli olarak kapatmışız.

### 2.3 Mevcut güçlü noktalar (korunacak)

- `gltf-cache.server.js`'de **pCon objectHash extraction** çok zekice; aynı konfigürasyonun farklı session'larda da aynı `<objectHash>.glb` üretmesi sayesinde Redis + disk dedup çalışıyor. Bu özelliği yeni mimaride sub-article seviyesine taşıyacağız.
- Draco compression pipeline, fire-and-forget background upgrade, immutable HTTP cache header'ları doğru kurulmuş.
- Icon proxy (`icon-cache.server.js`) sayesinde EAIWS session-bound icon URL'leri stale olmuyor.
- Cart add akışı (`cart-payload.jsx`) bağımsız ve performans planımızdan etkilenmiyor → DOKUNULMAYACAK.

### 2.4 Şu anki bundle boyutu (ölçüldü)

`extensions/pcon-3d-configurator/assets/configurator-app.js` — **~1.16 MB** (tek dosya). Three.js + drei + zustand + GLTFLoader + DRACOLoader hep içinde. Bu da TTI'yı geciktiriyor (Faz 7'de ele alınacak, ama opsiyonel).

---

## 3. MDD Analizi (Detaylı)

Browser-use ile yapılan canlı analiz sonuçları:

### 3.1 Initial load network manifesti

| Kaynak | Domain | Boyut grubu | Ne işe yarıyor |
|---|---|---|---|
| `models-glb/CD03.glb?v=1` | `configurator.mdd.pl` | Tek model, ~MB seviyesi | Tüm geometri (CD02 ve CD03 ayrı GLB) |
| `media/hdri/studio_small_01_1k-best1.hdr` | `mdd.eu` | ~1 MB | PBR aydınlatma |
| `media/draco-master/draco_decoder.wasm` + wrapper.js | `mdd.eu` | ~200 KB | Geometry decompress |
| `textures/{0008,szklo,carpet_bump,4202,carpet,light,light_bump,4202_bump,0101,metal,szklomle,M030,4317_bump,4317}.webp?v=3` | `configurator.mdd.pl` | her biri 50–250 KB | Kumaş, ahşap, metal, cam, halı texture'ları |
| `icons/webp/500*.webp` | `configurator.mdd.pl` | her biri ~10 KB | UI seçim ikonları |
| `get-images/406068/en` | `configurator.mdd.pl` | ufak JSON | Ürün metadata (fiyat, label, varyantlar) |

Önemli **negatif gözlemler**:

- `eaiws.pcon-solutions.com`, `gatekeeper.eaiws.*`, `s1.eaiws.*` gibi pCon CDN domain'lerine **HİÇ** istek yok.
- WebSocket yok.
- `setPropertyValue`, `getExportedGeometry`, `applyTransaction` gibi RPC pattern'leri yok.
- Property dropdown'larında bir seçenek değişimi sırasında **yeni GLB inmiyor**, sadece henüz preload edilmemişse `textures/<yeniRenkKodu>.webp` istemi düşüyor (genelde preload'da olduğu için onu da görmedik).

### 3.2 Çıkarım

MDD pipeline'ı muhtemelen şöyle:

1. **Build-time** — pCon Planner / EAIWS API ile her ürün koleksiyonu için (örn. CD03):
   - Tüm geometric varyantları (back wall glass/upholstered, plug type, table on/off, vs.) tek GLB içinde "ayrı node" olarak export ediyorlar; runtime'da **node visibility toggle** ile geometri değişiyor.
   - Tüm renk/kumaş seçenekleri için ayrı WebP texture asset'i hazırlıyorlar (`<materialCode>.webp` naming convention).
   - Her property değerini bir mesh node ismine veya texture asset'e map'leyen küçük bir JSON config oluşturuyorlar.
2. **Runtime** — `configurator-scripts.min.js`:
   - Tek GLB yükle → THREE.Scene
   - Property seçilince map'ten ilgili mesh/texture'ı bul → `mesh.visible = true/false` veya `material.map = newTexture; material.needsUpdate = true`
   - Pricing/cart için `get-images/<id>/<locale>` endpoint'i (kendi backend'leri).

Bu yaklaşım çok hızlı (RPC yok, GLB swap yok) ama **build-time'a yatırım** gerektiriyor: her yeni ürün varyantı için manuel/otomatik bir export adımı.

### 3.3 Bizim için uyarlanabilirlik notu

Bizim setup'ımızda dinamik EAIWS kullanımı bir özellik (yüzlerce article number, sürekli güncellenen kataloglar). MDD'nin %100 build-time yaklaşımına geçemeyiz — ama **runtime EAIWS ile aynı sonucu üretebiliriz** çünkü:

- pCon'un `getAllChoiceLists` API'si zaten `propValue.image` / `largeIcon` ile **runtime'da material texture URL'lerini sunuyor** (bkz. EAIWS spec 5.6.1.50, `fetchPropValueImages`). Bu URL'ler MDD'nin elle hazırladığı `4202.webp` muadili — sadece pCon'un kendi CDN'inden geliyor.
- `getItemProperties` API'si `subArticles[].geometryId` döndürüyor; bu hash sayesinde geometri değişikliklerini tespit edip sadece değişen sub-article'ı re-export edebiliriz.
- `getExportedGeometry` API'sinde `hierarchyMode=Hierarchy` ile sub-article ağaç yapısını koruyarak export ettirebiliriz; bu sayede frontend'de mesh→material eşleşmesi mümkün.

---

## 4. pCon EAIWS API Fizibilite Notları

### 4.1 İlgili API'ler (Spec referanslı)

| API / Alan | Spec § | Bizim için anlamı |
|---|---|---|
| `setPropertyValue(itemId, class, name, value, options?)` | 5.6.3.39 | Mevcut, değişiklik yok. |
| `getArticleData(itemId, options)` | 5.6.3.34 | Mevcut. `properties[]` artık appearance vs geometry classifier'ın input'u olacak. |
| `getAllChoiceLists(itemId, GetChoiceListOptions)` | 5.6.1.50 | `fetchPropValueImages: true` ile **her option için yüksek çözünürlüklü material image URL** alıyoruz (bizim swatch icon'umuzdan farklı; gerçek texture). Faz 2'de bu URL'leri aktif kullanacağız. |
| `getItemProperties(itemIds[], options)` | 5.6.3.32 | `subArticles=true` ile alt article ID listesi + her birinin `geometryId` checksum'u. Faz 1'de classifier, Faz 5'te delta detection için. |
| `getExportedGeometry(itemId, options[])` | 5.6.3.43 | Tek-GLB için kullanmaya devam edeceğiz, ama (a) ana article için bir kez, (b) sadece değişen sub-article ID'leri için tekrar çağıracağız. `hierarchyMode=Hierarchy` ile sub-article ağacı korunabilir. |
| `getAllItems(options)` | 5.6.3.13 | `geometryIds: true` ile basket'teki tüm item'ların geometryId hash'lerini tek seferde alabiliriz. Delta diff için alternatif. |
| `getGeneratedImage(...)` | 5.6.3.40 | Cart-payload'da kullanılıyor; dokunulmayacak. |

### 4.2 GLB hierarchyMode

Spec 5.6.3.43'te belirtildiği üzere `hierarchyMode` parametresi (GLB için indirek olarak FBX/GFX export davranışını da etkiler) ile node ağacının korunmasını talep edebiliriz:

- `Hierarchy` → OFML article hiyerarşisi node ağacında korunur, materyaller leaf node'lara atanır.
- `MaterialStack` → İç node'lara da material atanır (frontend için en kullanışlısı).

GLB için pCon'un default davranışı denenmeli; opsiyonel olarak GFJ (JSON geometry) format'ı export edip oradan node-name ↔ material-name mapping'i çıkarabiliriz (Faz 3).

### 4.3 Material image URL'lerinin yapısı

`getAllChoiceLists` ile gelen `propValue.image` / `largeIcon` URL'leri pCon CDN'inde:

```
https://s2.eaiws.pcon-solutions.com/<version>/file-cache/.../mat/l/<materialCode>.jpg
```

Bunlar **session-bound** olabiliyor (icon-cache.server.js'in icon proxy yapma sebebi de bu). Yeni texture proxy'mizde aynı yöntemi uygulamamız gerekecek (Faz 2.4).

### 4.4 Property classification için pratik strateji

Bir property'nin appearance-only mi geometry-affecting mi olduğunu anlamak için spec'te direkt bir flag yok. Üç yaklaşım var:

1. **Heuristic (hızlı, %80 doğru)** — `propClass` ve `propName`'e göre regex tabanlı sınıflandırma:
   - `*MAT*`, `*COLOR*`, `*RENK*`, `*KUMAS*`, `*KAPLAMA*`, `*FABRIC*`, `*FINISH*` → appearance.
   - `*BOLGE*`, `*PRIZ*`, `*TIP*`, `*TYPE*`, `*ENABLED*`, `*ON_OFF*`, `*BOOL*` → geometry.
   - `*DIMENSION*`, `*BOY*`, `*SIZE*` → geometry.
2. **Empirical (yavaş, %100 doğru)** — Article ilk warm edildiğinde her property için iki değer set edip `getItemProperties(subArticles=true)` ile geometryId hash'lerini karşılaştır. Eşitse appearance, değilse geometry. Sonucu Redis'e kalıcı yaz (per `articleNumber:propClass.propName`).
3. **Manual override** — `app/services/property-classification-overrides.json` ile bilinen property'ler için elle "appearance" veya "geometry" tag'i.

Plan: heuristic + empirical karışımı, manual override son söz.

---

## 5. Faz Planı

> **Sıra önerisi:** Faz 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7. Faz 6 ve 7 paralelleştirilebilir. Her faz bağımsız PR olarak deploy edilebilecek şekilde tasarlandı (özellikle Faz 2 öncesi/sonrası eski akış geri çağırılabilir kalmalı: feature flag).

### Faz 0 — Baseline & Telemetry

**Amaç.** İyileştirmeleri sayısal olarak ölçebilmek için "öncesi" verilerini toplamak. Aksi halde "daha hızlı oldu" hissini doğrulayamayız.

**Kapsam.**

1. Backend her endpoint'inde structured timing log:
   - `[pcon/init] cache=HIT|MISS rt=Xms eaiws=Yms gltfBytes=Z`
   - `[pcon/update] cache=HIT|MISS rt=Xms eaiws.setProp=Yms eaiws.export=Zms`
2. Frontend `store/configurator-store.js`'e basit profiler:
   - `t_click_to_response`, `t_response_to_paint`, `t_total`
   - Bunları `console.table` + `window.__pconPerf` push et; Faz 6'da gerçek bir HUD overlay'e dönüşecek.
3. `extension-build/src/utils/api.js`'e fetch sürelerini ölç, response'a server-timing header'ı zorunlu kıl.
4. Her property için `t_total` için P50/P95 ölçümü → log dosyası veya Redis'e (key: `pcon:perf:<articleNumber>`).
5. **Manuel ölçüm protokolü** dokümana eklenecek: hangi article, hangi property, hangi step ne kadar sürüyor.

**Dokunulacak dosyalar.**

- `app/routes/pcon-proxy.api.pcon.init.jsx`
- `app/routes/pcon-proxy.api.pcon.update.jsx`
- `app/services/pcon-client.server.js`
- `extension-build/src/utils/api.js`
- `extension-build/src/store/configurator-store.js`
- (Yeni) `app/services/perf-logger.server.js`
- (Yeni) `extension-build/src/utils/perf.js`

**Çıktılar.** Mevcut sistem için P50/P95 sayıları ile bir kısa rapor (`docs/perf-baseline.md` veya bu doküman içine).

**Kabul kriterleri.**

- Her `init` ve `update` cevabında server-timing header var.
- Frontend console'da bir property tıklamasından sonra `[pcon-perf] click→paint=Xms` benzeri net log var.
- En az 3 article için (bir simple, bir complex, bir prebake'ten geçmiş) P50/P95 baseline tablosu var.

**Doğrulama.** Bu dokümanın "Beklenen etkiler" tablosunu güncelle: "Şu an" sütunu ölçüm verisiyle dolacak.

---

### Faz 1 — Property Classification Servisi

**Amaç.** Her property'nin **appearance-only** mı **geometry-affecting** mi olduğunu tespit eden, sonucu cache'leyen bir servis. Faz 2 ve 5 bu servisin çıktısını input olarak kullanacak.

**Kapsam.**

1. `app/services/property-classifier.server.js` (yeni):
   ```
   classifyProperties(articleNumber, manufacturerId, properties[]) →
     { "PROPCLASS.PROPNAME": "appearance" | "geometry" | "unknown" }
   ```
2. **Heuristic katmanı (sync, milisaniye)** — yukarıdaki regex tablosu.
3. **Empirical katmanı (async, dakika seviyesi)** — `article-warmer.server.js` mantığını yeniden kullanarak: bir EAIWS session'ı aç, her property için "default" ile "ikinci option" değerini set et, `getItemProperties(itemId, { subArticles: true })` ile öncesi/sonrası `geometryId` checksum array'ini karşılaştır. Aynıysa `appearance`, farklıysa `geometry`. Sonucu Redis'e `pcon:classify:<articleNumber>:<manufacturerId>` key'iyle yaz, TTL 30 gün.
4. **Manual override katmanı** — `app/services/property-classification-overrides.json`:
   ```json
   {
     "*": {                                      // tüm article'lar için
       "OI_NONE_PROPCLASS.PRIZ_TIPI": "geometry"
     },
     "11.0231.W:*": {                            // article-spesifik
       "MT_TEXT.Meta_Dimension": "geometry"
     }
   }
   ```
   Override > empirical > heuristic.
5. `init` endpoint'inde response'a `classifications` alanı ekle (frontend Faz 2'de kullanacak):
   ```json
   { ... , "classifications": { "PROPCLASS.RENK_KUMAS": "appearance", "MT_TEXT.MEDIAWALL": "geometry" } }
   ```
6. Empirical classifier'ı **arka planda** çalıştır (init MISS'inde fire-and-forget; sonuçlar bir sonraki request için hazır olur). Heuristic her zaman senkron geri döner.
7. CLI: `npm run classify -- --article=11.0231.W --manufacturer=NURUS` formatında manuel tetikleme scripti.

**Dokunulacak dosyalar.**

- (Yeni) `app/services/property-classifier.server.js`
- (Yeni) `app/services/property-classification-overrides.json`
- (Yeni) `scripts/classify-article.js`
- `app/routes/pcon-proxy.api.pcon.init.jsx` — response'a `classifications` ekle
- `app/services/pcon-client.server.js` — `getItemProperties(subArticles: true)` wrapper helper'ı ekle

**Çıktılar.** Init response'unda her property için bir tag. Redis'te kalıcı classification cache.

**Kabul kriterleri.**

- 3 farklı article için classification map manuel olarak `console.log`'da görülebilir.
- En az bir geometry property (PRIZ_TIPI vb.) ve bir appearance property (renk/kumaş) doğru tag'lenmiş.
- Override JSON'a manuel ekleme yapıldığında öncelik kazanıyor (unit test).
- Empirical classifier 10 property'lik bir article için 60 sn altında bitiyor (worst case kabul).

**Doğrulama.** İki article için elle: önce heuristic sonucunu, sonra empirical sonucunu karşılaştır; uyuşmayan property varsa override JSON'a ekle.

**Riskler.** Empirical classifier EAIWS session'ı tutuyor; cache-warmer ile aynı session race olmamalı. Çözüm: ayrı session, Faz 7'deki pool ile uyumlu.

---

### Faz 2 — Backend "MaterialPatch" Kanalı

**Amaç.** `update` endpoint'i, **appearance-only** property değişimlerinde GLB üretmek yerine küçük bir JSON döner. Frontend bunu Faz 4'te in-place uygular.

**Kapsam.**

1. `app/services/pcon-client.server.js`'e yeni method:
   ```
   getMaterialPatch(itemId, propertyList, classifications) →
     {
       type: "material-patch",
       patches: [
         {
           propClass: "PROPCLASS",
           propName: "RENK_KUMAS",
           value: "Atlantic",
           targetSelectors: ["sub:abc123", "mesh:InteriorWall_*"],   // bkz. Faz 3
           material: {
             baseColorTextureUrl: "/apps/pcon-configurator/texture/<hash>.jpg",
             baseColorFactor: null,            // veya "#ABCDEF" (texture yoksa)
             metalness: 0,
             roughness: 0.85
           }
         }
       ],
       price: 12200,
       currency: "EUR",
       cartProperties: { ... }                  // mevcut
     }
   ```
2. `getMaterialPatch` mantığı:
   - `setPropertyValue` (mevcut gibi) ile değişikliği uygula.
   - `getAllChoiceLists(itemId, { fetchPropValueImages: true, highResPropValueIcons: true })` ile değişen property'nin yeni `currentValue` için `propValue.image` URL'ini al.
   - `getArticleData` ile fiyat + `cartProperties` güncel snapshot'ını üret.
   - **Geometriyi yeniden export ETME** — GLB üretimi atlanıyor; bütün performans kazancı buradan.
3. **Texture proxy** — `app/routes/pcon-proxy.texture.$.jsx` (yeni, `pcon-proxy.icon.$.jsx`'in kopyası mantığında). pCon'dan gelen session-bound texture URL'lerini proxy'leyip `texture-cache.server.js` ile diske yaz, immutable cache header döndür. URL formatı: `/apps/pcon-configurator/texture/<materialHash>.jpg` (hash, URL'den extract veya MD5).
4. `app/routes/pcon-proxy.api.pcon.update.jsx` — request body'sinde `dirtyKey` (kullanıcının az önce değiştirdiği property ID) bilgisini al; classifier'a sor:
   - **appearance** ise → `getMaterialPatch` çağır → response `{ type: "material-patch", patches: [...] }` dön.
   - **geometry** veya **unknown** ise → mevcut full-GLB yolu (geriye uyumlu).
5. Cache key politikasını güncelle: appearance patch'leri için key tüm prop kombinasyonu yerine sadece `(articleNumber, dirtyKey, value)` olabilir → çok daha az MISS. Geometry için mevcut ağır key kalır.
6. `app/services/cart-builder.server.js` — `cartProperties` üretimi material-patch path'inde de doğru çalışsın (sadece appearance değiştiğinde de doğru `_request_id` placeholder ve doğru property snapshot dönmeli).

**Dokunulacak dosyalar.**

- `app/services/pcon-client.server.js` — `getMaterialPatch` method
- `app/routes/pcon-proxy.api.pcon.update.jsx` — branching logic
- (Yeni) `app/routes/pcon-proxy.texture.$.jsx`
- (Yeni) `app/services/texture-cache.server.js`
- `app/services/redis-client.server.js` — `generateCacheKey("material-patch", ...)` desteği
- `app/services/property-mapper.server.js` — `propValue.image` URL'inin proxy'lenmiş hâlini de döndür (Faz 4'ün direkt kullanımı için)

**Çıktılar.** Renk değiştirildiğinde `update` response'u **<5 KB JSON** + texture URL bir kez indirilince browser cache'inden gelir. Hiç GLB inmez.

**Kabul kriterleri.**

- POSTMAN ile `update` endpoint'ine sadece bir renk property'si ile istek atıldığında response `type: "material-patch"` dönüyor ve `gltfUrl` alanı yok.
- Geometri property'sinde response hâlâ `gltfUrl` ile geliyor (regression yok).
- Texture proxy bir resmi indirip cache'liyor; ikinci istek 304 / `Cache-Control: immutable` ile geliyor.
- Network panelinde renk değişimi sonrası **toplam <50 KB** transfer (cart hariç).
- Frontend Faz 4 olmadan **boz olmamalı** — eski `gltfUrl` dolu cache HIT'leri yine çalışmalı (geriye uyumlu).

**Doğrulama.** Backend integration testi: bir article için (a) geometry property değiştir → eski response, (b) appearance property değiştir → patch response. Boyut farkını ölç.

**Riskler.**

- `getAllChoiceLists` her appearance update'inde yeniden çağrılıyor; bu da ekstra round-trip. Çözüm: choiceList cache (per-article, in-memory + Redis 5 dk TTL) — choice list'ler property combination'a göre değişebildiği için cache key tüm aktif property snapshot'ını içermeli.
- `propValue.image` URL'i her zaman var olmayabilir (catalog data'ya bağlı). Yoksa fallback olarak `baseColorFactor` (RGB hex) ile dön; frontend Faz 4'te ya tek renk uygula ya geometry path'e düş.

---

### Faz 3 — GLB Export'ta Sub-Article Hierarchy

**Amaç.** Frontend'in "patch'in hangi mesh'e uygulanacağını" bilmesi için GLB içine pCon sub-article ID'lerini ve material adlarını gömmek.

**Kapsam.**

1. `pcon-client.server.js:getExportedGeometry` çağrılarını şu opsiyonlarla güncelle:
   ```
   ["format=GLTF", "hierarchyMode=Hierarchy"]
   ```
   (Eğer `hierarchyMode` GLTF için desteklenmiyorsa — spec 5.6.3.43'te öncelikle GFX/FBX için listelenmiş — pratik test gerek; alternatif olarak `format=GFJ` ile JSON manifest çekip GLB ile birlikte servis et).
2. **GLB extras enrichment (server-side post-process).** `app/services/gltf-enricher.server.js` (yeni):
   - GLB indirildikten sonra, `getItemProperties(itemId, { subArticles: true })` ile sub-article ağacını al.
   - GLB içindeki node ağacını gez; her node'un `extras` alanına şu objeyi yaz:
     ```json
     { "pconSubArticleId": "...", "pconMaterialName": "...", "pconPropertyTags": ["RENK_KUMAS"] }
     ```
   - Yazma için `gltf-pipeline` zaten dependency'mizde; `glb-utils` veya `@gltf-transform/core` ile node-extras yazımı yapılabilir.
3. **Naming convention** — sub-article ID + material name kombinasyonu node name'e de yazılsın (`SubArt_<id>__<mat>`); böylece frontend `scene.getObjectByName(/^SubArt_<id>/)` ile hızlı bulur.
4. Initial init endpoint response'una bir `sceneIndex` alanı eklensin:
   ```json
   {
     "subArticles": [
       { "id": "abc123", "geometryId": "deadbeef", "materials": ["FabricA", "MetalB"] },
       ...
     ]
   }
   ```
   Frontend bu index'i kullanarak material patch'lerini route eder.

**Dokunulacak dosyalar.**

- `app/services/pcon-client.server.js` — `getExportedGeometry` opts; `getItemProperties` helper
- `app/services/gltf-cache.server.js` — enrich step, cache key'i enriched GLB için ayrı tut (eski cache ile çakışmasın)
- (Yeni) `app/services/gltf-enricher.server.js`
- (Yeni) dependency: `@gltf-transform/core` (gltf-pipeline yetersizse)
- `app/routes/pcon-proxy.api.pcon.init.jsx` — `subArticles` snapshot'ını response'a ekle
- `app/services/article-warmer.server.js` ve `cache-warmer.server.js` — enrich step warming sırasında da koşmalı

**Çıktılar.** Tüm GLB'ler artık node `extras` alanında pCon sub-article ID'leri ve material adlarını içeriyor. Initial response sub-article snapshot'ı içeriyor.

**Kabul kriterleri.**

- Bir GLB'yi `gltf-validator` veya `glb-converter` ile incelediğinde `extras.pconSubArticleId` görünüyor.
- Frontend (Faz 4 öncesi) `scene.traverse` ile bu metadata'ya erişebiliyor (manuel test).
- Enrich işlemi background task; ilk MISS response'unu **bloklamamalı** (cache upgrade pattern, gltf-cache.server.js:upgradeCacheEntryWithLocalGltf benzeri).

**Doğrulama.** Manuel: bir node'u browser console'da `model.scene.getObjectByName(...).userData.pconSubArticleId === <beklenen>` doğrula.

**Riskler.** Çok büyük GLB'lerde enrich işlemi (parse + write) saniyeler alabilir; bu yüzden background-only çalışmalı, ilk request'i geciktirmemeli. Eski cache entry'ler enrich'lenmemiş olabilir; classifier veya frontend bunu tolere etmeli (eksikse mesh-name pattern fallback'i).

---

### Faz 4 — Frontend Material Swap Engine

**Amaç.** Backend'in dönderdiği `material-patch` JSON'unu three.js sahnesinde **GLB reload olmadan** uygulamak.

**Kapsam.**

1. `extension-build/src/scene/MaterialSwapper.js` (yeni):
   ```
   applyMaterialPatch(scene, patch, textureLoader) → Promise<void>
   ```
   - `patch.targetSelectors` üzerinden mesh'leri bul:
     - `sub:<id>` → `scene.userData.pconIndex.get(id)` (Faz 3'teki sceneIndex'ten)
     - `mesh:<pattern>` → regex name match
   - Her mesh için `material.clone()` (paylaşılan material'a yan etki olmasın) → `material.map = await textureLoader.loadAsync(url)` → `material.color.set(hex)` → `material.needsUpdate = true`.
   - Texture'ları **promise'lerle paralel** yükle, hepsi yüklenmeden önce eski texture görünür kalsın (smooth transition).
2. `Model.jsx` revize:
   - `gltfUrl` değişimi sadece **geometry kanalı**ndan tetikleniyor; appearance kanalında `gltfUrl` aynı kalıyor.
   - Component initial mount'ta GLB'yi yükledikten sonra `userData.pconIndex` (sub-article ID → mesh ref) Map'i kursun ve store'a publish etsin.
3. `store/configurator-store.js` revize:
   - `updateProperty` action'ı response type'ına bak:
     - `material-patch` → `MaterialSwapper.applyMaterialPatch(currentScene, patch)` → spinner GÖSTERME → state'i güncelle.
     - eski format → mevcut `gltfUrl` swap path.
4. **Texture preloader**: `initialize()` sonrasında, classifier "appearance" demiş tüm property'lerin tüm option'ları için texture URL'lerini `link rel=prefetch` veya `TextureLoader.loadAsync` ile arka planda preload et. Hover'da `link rel=preload` ile boost et (Faz 6).
5. **Optimistic preview**: Renk seçildiğinde, `propValue.image` URL'ini direkt store'da tutuyoruz (Faz 2.6) — frontend bu URL'i sahip olduğu mesh listesine "tahmini" olarak hemen uygular; backend response gelince onaylar/düzeltir.

**Dokunulacak dosyalar.**

- (Yeni) `extension-build/src/scene/MaterialSwapper.js`
- (Yeni) `extension-build/src/scene/SceneIndex.js`
- `extension-build/src/components/Model.jsx` — sceneIndex kurulumu, fade davranışını koru ama appearance patch'inde fade tetikleme.
- `extension-build/src/components/ConfiguratorScene.jsx` — spinner gating: appearance patch sırasında spinner GÖSTERME.
- `extension-build/src/store/configurator-store.js` — response type branching, optimistic preview state.
- `extension-build/src/utils/api.js` — response shape değişikliğine uyum (type alanı).

**Çıktılar.** Renk/kumaş seçimi **<300 ms** içinde sahnede görünür. Spinner çıkmaz. GLB reload olmaz.

**Kabul kriterleri.**

- DevTools Network panel: appearance property tıklandığında sadece **(a) update endpoint JSON (~5 KB) + (b) yeni texture (varsa, ilk seferde, ~50–200 KB)** istemi düşüyor; yeni `.glb` yok.
- Three.js Inspector / `scene.traverse(...)` ile material map'in değiştiği doğrulanabiliyor.
- Geometri property'leri hâlâ tam GLB swap akışıyla çalışıyor (regression yok).
- Bundle size artışı **< 5 KB** (MaterialSwapper küçük).

**Doğrulama.** `chrome://tracing` veya basit `performance.now()` ile click→paint < 300 ms.

**Riskler.**

- Material clone'ları memory leak'e dönüşebilir; her swap'te eski texture'ı `.dispose()` etmek gerek (Model.jsx'teki disposeMaterial'a hook).
- Sub-article enrichment olmayan eski GLB'lerde sceneIndex boş; o zaman mesh-name fallback yeterli olmaz → geometry path'e fallback yap.

---

### Faz 5 — Sub-Article Granular Geometry Delta

**Amaç.** Geometri-etkileyen property değişimlerinde tüm article'ı re-export etmek yerine sadece değişen sub-article'ları yeniden export edip frontend'de in-place değiştirmek.

**Kapsam.**

1. `pcon-client.server.js` yeni method:
   ```
   getGeometryDelta(itemId, propertyList, prevSubArticleSnapshot) →
     {
       type: "geometry-delta",
       changedSubArticles: [
         { id: "abc123", geometryId: "newhash", gltfUrl: "/apps/.../subArt-abc123-<hash>.glb" }
       ],
       removedSubArticles: ["xyz789"],
       price, currency, cartProperties
     }
   ```
2. Akış:
   - Pre-snapshot: `getItemProperties(itemId, { subArticles: true })` ile her sub-article'ın eski `geometryId`.
   - `setPropertyValue(...)`.
   - Post-snapshot: tekrar `getItemProperties`. Aynı ID için hash farkı = changed; eski snapshot'ta var, yeni snapshot'ta yok = removed; tersi = added.
   - Sadece **changed/added** sub-article'lar için `getExportedGeometry(subArticleItemId, ["format=GLTF"])` (sub-article seviyesinde export desteği — spec'te direkt belirtilmemiş; pCon'da sub-article'ların kendi itemId'si var ve export çağrısı bunu kabul ediyor; **practical test gerekir**).
   - Cache: her sub-article GLB'si `gltf-cache.server.js`'in objectHash dedup'ından zaten faydalanır.
3. Frontend `MaterialSwapper`'ın yanına `GeometrySwapper.applyGeometryDelta(scene, sceneIndex, delta)` ekle:
   - Removed sub-article'lar için `parent.remove(node)` + dispose.
   - Changed/added için `GLTFLoader.loadAsync(url)` → `parent.replace(oldNode, newNode)` veya `parent.add(newNode)` + sceneIndex update.
4. Update endpoint branching:
   - `appearance` → material-patch (Faz 2)
   - `geometry` → **önce** `getGeometryDelta` dene; çağrı failover ederse veya delta tüm sub-article'ları kapsıyorsa **fallback** olarak full-GLB path'ine düş.
5. `pcon-proxy.api.pcon.update.jsx` body'sinde frontend'in sceneIndex snapshot'ını ek olarak göndermesi gerekecek (önceki sub-article ID'leri); böylece backend prev-snapshot için EAIWS'e gitmek zorunda kalmaz. Bu opsiyonel optimizasyon.

**Dokunulacak dosyalar.**

- `app/services/pcon-client.server.js` — `getGeometryDelta` method
- `app/services/gltf-cache.server.js` — sub-article boyutlu GLB'ler için aynı pattern
- `app/routes/pcon-proxy.api.pcon.update.jsx` — third branch (geometry-delta)
- (Yeni) `extension-build/src/scene/GeometrySwapper.js`
- `extension-build/src/store/configurator-store.js` — `geometry-delta` response handling
- `extension-build/src/components/Model.jsx` — sceneIndex incremental güncelleme

**Çıktılar.** Geometri property değişimlerinde transfer 200–800 KB seviyesine düşüyor; fade-in yerine targeted node swap ile daha hızlı paint.

**Kabul kriterleri.**

- Bir geometry property (örn. PRIZ_TIPI) değiştirildiğinde Network panelinde **sadece değişen sub-article(lar) için** GLB iniyor; tüm article GLB'si inmiyor.
- Cache key `(articleNumber, subArticleId, geometryId)` üzerinden olduğu için aynı sub-article'ın aynı yapısı tekrar tekrar inmiyor.
- Worst case fallback (full-GLB) çalışıyor; classifier "geometry" deyip backend delta üretemediğinde donmuyor.

**Doğrulama.** En az iki article için manuel test: değişen sub-tree'nin frontend'de in-place yenilendiği gözle ve Three.js inspector'la doğrulanmalı.

**Riskler.** EAIWS sub-article'ı bağımsız export etmeyi reddederse plan B: `getGeneratedImage` benzeri bir node-bazlı export yok; o durumda Faz 5 daraltılır → "tüm geometri patches" değil ama "sub-article visibility toggle" yaklaşımı uygulanır (ilk yüklemede tüm geometric varyantlar dahil edilip backend frontend'e hangisinin görünür olacağını söyler — MDD'nin yaklaşımına en yakın yol).

---

### Faz 6 — Optimistic UI + Hover Prefetch + IndexedDB

**Amaç.** Algılanan latency'i sıfıra indirme: kullanıcı tıklamadan **önce** kaynaklar inmiş olsun.

**Kapsam.**

1. **Hover prefetch** — `PropertySelector.jsx`: bir option butonuna mouse enter geldiğinde:
   - `appearance` property → texture URL'ini `<link rel="prefetch">` veya `TextureLoader.preload()` ile çek.
   - `geometry` property → `update` endpoint'ine "prefetch=true" parametresiyle çağır; backend response'u cache'ler ama frontend state'i değiştirmez.
2. **Optimistic UI**:
   - Tıklama anında **henüz response gelmeden** local state'i güncelle (`p.currentValue = clicked.value`); uygun option'ı active yap.
   - Appearance için optimistic material swap (Faz 4.5).
   - Geometry için spinner ama "yarı-saydam preview" — eski mesh'in opacity'sini düşür; response gelince swap.
3. **IndexedDB cache (opsiyonel)** — `extension-build/src/utils/idb-gltf-cache.js`. Browser refresh sonrası bile aynı GLB ve texture'lar diskten gelir (HTTP cache yetersiz kalırsa). Cache key: GLB için objectHash, texture için materialHash. Eviction policy: LRU 200 MB.
4. **HUD** (Faz 0 perf logger'ı görsel HUD'a çevir, dev mode için): canvas üstünde küçük bir overlay ile son işlem süresi.

**Dokunulacak dosyalar.**

- `extension-build/src/components/PropertySelector.jsx` — onMouseEnter handler
- `extension-build/src/store/configurator-store.js` — `prefetchProperty(propId, value)` action
- (Yeni) `extension-build/src/utils/idb-gltf-cache.js`
- (Yeni) `extension-build/src/components/PerfHud.jsx` (dev-only toggle)

**Çıktılar.** "Tıkladığım anda olan oluyor" hissi; refresh'lerde anlık reload.

**Kabul kriterleri.**

- Hover sonrası tıklamada Network panelinde yeni istek **gözükmemeli** (hover sırasında inmiş olmalı).
- IndexedDB'ye GLB yazıldığı browser DevTools Application tab'inde görünür.
- Optimistic UI: tıklamadan response'a kadar olan grace period'ta button doğru active state'e geçer.

**Doğrulama.** P95 click→paint < 200 ms (hover prefetch yapılmış senaryolarda < 50 ms).

**Riskler.** Hover prefetch agresif kullanıldığında EAIWS rate limit'e takılabiliriz → debounce 200 ms + concurrent prefetch limiti.

---

### Faz 7 — EAIWS Session Pool + Bundle Splitting

**Amaç.** Backend tarafında çoklu kullanıcı handling'ini iyileştirmek ve frontend bundle TTI'yı düşürmek. **Performans kazancı dolaylı** ama production stability için kritik.

**Kapsam.**

1. **EAIWS session pool** — `app/services/pcon-session-pool.server.js`:
   - N adet (env: `PCON_SESSION_POOL_SIZE`, default 4) kalıcı `EaiwsSession` tut.
   - Her request için pool'dan bir session "lease" et, return ile bırak.
   - Health check: 30 sn'de bir `getCurrency` ile ping; broken session'ı kapat ve yenisini aç.
   - Request başına `currentItemId` race condition'ını ortadan kaldır → singleton pattern'i pool ile değiştir.
2. **Per-article warm session** — Sık kullanılan article için pool'dan bir session'ı "sıcak" tut (article inserted, ready for setPropertyValue). Cache MISS'lerde gatekeeper round-trip atlanır.
3. **Bundle splitting** — `extension-build/vite.config.extension.js`:
   - `three`, `@react-three/drei` core'unu ayrı chunk'a (`vendor-three.js`).
   - Lazy-load `DRACOLoader` (sadece GLB indirilirken).
   - HDR environment ve büyük asset'leri `<link rel=preload>` ile early hint.

**Dokunulacak dosyalar.**

- (Yeni) `app/services/pcon-session-pool.server.js`
- `app/services/pcon-client.server.js` — singleton pattern'i pool wrapper'a sar
- `app/services/article-warmer.server.js`, `cache-warmer.server.js` — pool kullan
- `extension-build/vite.config.extension.js` — manualChunks config
- `extensions/pcon-3d-configurator/blocks/configurator.liquid` — DRACOLoader artık dynamic import; preconnect/preload header'ları güncelle

**Çıktılar.** Eş zamanlı 10+ kullanıcıda P95 cache MISS süresi belirgin düşer. configurator-app.js TTI ~30% düşer (ölçülmesi gerek).

**Kabul kriterleri.**

- Pool size 4 ile 10 paralel update isteği (ab/k6) — hata yok, P95 < 5 sn.
- Bundle'da `vendor-three.js` ayrı dosya olarak görünüyor.
- Lighthouse "Reduce JavaScript execution time" skoru iyileşmiş.

**Doğrulama.** Fly.io üzerinde load test sonuçlarıyla.

**Riskler.** EAIWS gatekeeper N session açtırma rate'i kısıtlı olabilir → pool size düşük tut, idle session'ları timeout ile kapat.

---

## 6. Risk Tablosu ve Rollback

| Faz | Ana risk | Rollback yolu |
|---|---|---|
| 0 | Sadece logging; risk yok | — |
| 1 | Empirical classifier yanlış pozitif "appearance" verir → sahnede yanlış mesh güncellenir | Manuel override JSON ile per-property "geometry" zorla |
| 2 | Texture proxy bozulursa appearance update'leri 500 döner | Feature flag `ENABLE_MATERIAL_PATCH=false` ile tüm akışı eski full-GLB path'ine yönlendir |
| 3 | Enrichment GLB'yi bozarsa frontend yüklenmez | Enrichment failure'da orijinal (un-enriched) GLB serve et; frontend mesh-name pattern fallback'iyle çalışsın |
| 4 | MaterialSwapper memory leak yapar (GPU dolar) | `Model.jsx`'teki disposeScene'i material swap'lerinde de zorla; cache MAX_CACHE_ENTRIES'i 5'ten 3'e düşür |
| 5 | Sub-article export desteklenmez | Plan B: visibility toggle yaklaşımına dön (ilk GLB'ye tüm varyantları dahil et, backend hangisinin visible olacağını söylesin) |
| 6 | Hover prefetch EAIWS'i boğar | Concurrent prefetch limiti 2; debounce 250 ms |
| 7 | Pool race condition yeni bug üretir | Pool size 1'e indir → singleton davranışına dön |

Her faz **bağımsız feature flag** ile deploy edilmeli (`PCON_PHASE2_ENABLED`, vb.). Tek bir env değişkeni çevirerek geri dönüş garantili.

---

## 7. Etkilenmeyen Bileşenler (Garanti)

- **Cart add akışı** — `cart-payload.jsx`, `cart-builder.server.js`, `addToCart()` store action'ı, preorder akışı: hiçbiri değişmiyor. Faz 2 ve 5 cart-payload'a `cartProperties`'i aynı şekilde sağlamaya devam ediyor.
- **B2B preorder intent** — Dokunulmuyor.
- **Variant detect** ve URL sync — Dokunulmuyor.
- **Icon proxy** — Aynen kalıyor, üzerine texture proxy ekleniyor.
- **Auth (Shopify App Proxy)** — Aynen.

---

## 8. Önerilen Çalışma Düzeni (Agent Brief'leri)

Her fazı bir agent'a göndermeden önce ona şu çekirdek bilgiyi de ver:

1. Bu dokümanın ilgili faz bölümünün **tamamı**.
2. "Kabul kriterleri"ni manuel olarak doğrulaması talimatı.
3. "Doğrulama" bölümündeki testleri çalıştırma yükümlülüğü.
4. Mevcut dosyalarda **dokunulmaması gereken** bölümlerin (cart akışı vs.) altını çizen bir uyarı.
5. Geriye uyumluluk: feature flag ile devre dışı bırakılabilirlik zorunlu.

Bittikten sonra her faz için kontrol checklist'in:

- [ ] "Çıktılar" listesindeki tüm dosyalar var/güncellenmiş mi?
- [ ] "Kabul kriterleri"nin her maddesi doğrulandı mı?
- [ ] Network panelinde beklenen davranış gözleniyor mu?
- [ ] Eski article'lar (cache'i bayat olabilen) hâlâ yükleniyor mu? (regression)
- [ ] Cart add hâlâ çalışıyor mu? (her faz sonunda zorunlu smoke test)
- [ ] `extension-build/src/components/ConfiguratorScene.jsx` spinner davranışı bozulmadı mı? (flicker/stuck spinner kontrolü)
- [ ] Faz'ın feature flag'i var mı, kapatınca eski davranışa dönüyor mu?

---

## 9. Sıradaki Adım

Bir sonraki istek geldiğinde **Faz 0** ile başlanmalı. Faz 0 bittiği anda sayısal baseline elimizde olacağı için sonraki tüm fazların kazancı objektif olarak ölçülebilir hale gelecek.

> **Not:** Bu doküman canlı bir referans; Faz 0 ölçümleri geldikten sonra "Beklenen etkiler" tablosu güncellenmeli. Faz 5 öncesinde EAIWS sub-article export'unun pratikte desteklenip desteklenmediği bir mini POC ile doğrulanmalı (1-2 saatlik bir test).
