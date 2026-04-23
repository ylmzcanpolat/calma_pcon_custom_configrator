# pCon 3D Configurator — İyileştirme Yol Haritası

Bu doküman, mevcut pCon 3D Configurator uygulamasının performans, hız ve best practice açısından iyileştirilmesi için fazlara bölünmüş bir yol haritası sunar.

**Hedef:** Ürün detay sayfasında kullanıcıya en hızlı 3D configurator deneyimini sunmak. Tüm pCon gecikmeleri arka plan cache warming ile elimine edilecek, kullanıcı tarayıcısına hiçbir zaman pCon API gecikmesi yansıtılmayacak.

---

## Önemli Kurallar — Her Agent İçin Geçerli

> **Her faz üzerinde çalışan agent, aşağıdaki kurallara MUTLAKA uymalıdır:**
>
> 1. **Shopify MCP ile konuşma zorunluluğu:** Her işlem adımında Shopify MCP araçları kullanılmalıdır.
>    - İlk olarak `learn_shopify_api` çağrılarak `conversationId` alınmalıdır.
>    - GraphQL sorguları `validate_graphql_codeblocks` ile doğrulanmalıdır.
>    - Liquid değişiklikleri `validate_theme` veya `validate_theme_codeblocks` ile doğrulanmalıdır.
>    - Dökümantasyon araştırması için `search_docs_chunks` kullanılmalıdır.
>
> 2. **Mevcut dökümanları referans alma:** `configrator_process.md` dosyasını okuyarak mevcut mimarinin detaylarını anlamalıdır.
>
> 3. **Test:** Her değişiklikten sonra build ve lint kontrolü yapılmalıdır.
>
> 4. **Geriye uyumluluk:** Mevcut cache verileri korunmalı, mevcut API kontratları bozulmamalıdır.

---

## Mevcut Durum Özeti

| Bileşen | Durum | Sorun |
|---------|-------|-------|
| PconClient | Singleton | Çoklu kullanıcıda race condition |
| Cache Warming | Tek property değişimi | Kombinasyonları kapsamıyor |
| Bundle | ~2MB IIFE | Code splitting yok, lazy loading yok |
| pCon API çağrıları | Sıralı (sequential) | Paralelize edilebilir |
| Frontend request | Debounce/abort yok | Race condition riski |
| Three.js memory | dispose() yok | Memory leak riski |
| GLTF dosyaları | ~50MB ham | Draco compression yok |
| Disk cache | Eviction yok | Disk dolma riski |
| Cron schedule | Günde 1 kere | Günde 2 kere olmalı |

---

## Faz 0 — Hazırlık ve Temel Altyapı

**Süre tahmini:** 1-2 saat
**Risk:** Düşük
**Öncelik:** Zorunlu (diğer fazlardan önce)

### 0.1 Mevcut durumu snapshot'la

- [ ] Mevcut `configurator-app.js` bundle boyutunu kaydet (referans ölçüm)
- [ ] Redis cache'teki mevcut key sayısını kaydet
- [ ] pCon API response sürelerini ölç ve kaydet (init ve update)
- [ ] Mevcut GLTF dosya boyutlarını kaydet

```bash
# Bundle boyutu ölçümü
ls -lh extensions/pcon-3d-configurator/assets/configurator-app.js

# Redis key sayısı
redis-cli DBSIZE

# GLTF cache boyutu
du -sh .cache/gltf/
```

### 0.2 Bağımlılıkları kontrol et

- [ ] `package.json`'daki tüm bağımlılıkların güncel olduğunu doğrula
- [ ] React 18 + @react-three/fiber ~8.x + @react-three/drei ~9.x uyumluluğunu koru
- [ ] `draco3dgzip` paketini ekle (Faz 4 için hazırlık)

### 0.3 `.env` dosyasını güncelle

Yeni ortam değişkenleri tanımla:

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `CACHE_WARM_CRON` | `0 3,15 * * *` | Günde 2 kere: 03:00 ve 15:00 |
| `PCON_SESSION_POOL_SIZE` | `3` | Paralel pCon session sayısı |
| `GLTF_CACHE_MAX_SIZE_MB` | `5000` | Disk cache max boyutu (MB) |
| `CACHE_WARM_CONCURRENCY` | `2` | Warming paralel istek sayısı |

**Agent talimatı:**
```
Shopify MCP → learn_shopify_api(api: "admin") çağır.
search_docs_chunks ile "environment variables app configuration" ara.
Mevcut .env yapısını incele ve yukarıdaki değişkenleri ekle.
```

---

## Faz 1 — Kritik: PconClient Concurrency Düzeltmesi

**Süre tahmini:** 3-4 saat
**Risk:** Yüksek (veri bütünlüğü)
**Öncelik:** En yüksek — diğer tüm fazlardan önce yapılmalı

### Sorun

`pcon-client.server.js` singleton bir `PconClient` instance'ı kullanıyor. Tek bir `session` ve tek bir `currentItemId` tutuyor. Birden fazla kullanıcı aynı anda istek atarsa:

- Kullanıcı A article insert eder → `currentItemId = "aaa"`
- Kullanıcı B article insert eder → `currentItemId = "bbb"` (A'nınkini ezer)
- Kullanıcı A'nın update isteği yanlış ürünle çalışır

### Çözüm: Per-Request Session veya Session Pool

#### 1.1 `PconSessionManager` sınıfı oluştur

`app/services/pcon-session-manager.server.js` dosyası oluştur:

**Gereksinimler:**
- Konfigüre edilebilir pool boyutu (`PCON_SESSION_POOL_SIZE`)
- Her session bağımsız Gatekeeper bağlantısı
- Session acquire/release mekanizması
- Idle session timeout (5 dakika)
- Health check ve otomatik reconnect

**Temel yapı:**
```javascript
class PconSessionManager {
  constructor(poolSize = 3) { /* ... */ }
  async acquire()  { /* Boş session ver veya yeni oluştur */ }
  release(session) { /* Havuza geri bırak */ }
  async shutdown() { /* Tüm session'ları kapat */ }
}
```

#### 1.2 API route'larını güncelle

- `pcon-proxy.api.pcon.init.jsx`: Session acquire → işlem → release
- `pcon-proxy.api.pcon.update.jsx`: Session acquire → işlem → release
- `itemId`'yi artık instance state'inde değil, Redis cache'ten ve request body'den al

#### 1.3 `currentItemId` kaldır

- `PconClient` sınıfından `this.currentItemId` state'ini tamamen kaldır
- Tüm metodlar `itemId`'yi parametre olarak almalı
- `getArticleData` dönüşü `{ itemId, ...data }` şeklinde olmalı

#### 1.4 Eski singleton PconClient'ı kaldır

- `getPconClient()` fonksiyonunu `getSessionManager()` ile değiştir
- `cache-warmer.server.js`'deki singleton kullanımını kaldır (bağımsız session kullanmalı)

### ⚠️ REVİZYON 1.5 — Session Affinity (Canlı Test Sonrası Eklendi)

**Tespit:** Canlı testte property update süresi ~650ms+ (cache miss). Bunun ana sebebi: her update isteğinde pool'dan rastgele bir session alınıyor. Bu session'da kullanıcının mevcut article'ı ve property state'i olmadığı için backend TÜM property'leri sıfırdan set etmek zorunda kalıyor (26 adet sıralı `setPropertyValue` çağrısı).

**Sorun:** `PconSessionManager.acquire()` her zaman herhangi bir boş session'ı veriyor. Kullanıcının `itemId`'si başka session'a ait olduğunda "unknown item id" hatası alınıyor ve article re-insert + tüm property'lerin tekrar set edilmesi gerekiyor.

**Çözüm: Session-Item Affinity Mekanizması**

`PconSessionManager`'a item-based session mapping ekle:

```javascript
class PconSessionManager {
  constructor(poolSize) {
    this.pool = [];
    this._itemSessionMap = new Map(); // itemId → entry mapping
  }

  async acquireForItem(itemId) {
    if (itemId && this._itemSessionMap.has(itemId)) {
      const entry = this._itemSessionMap.get(itemId);
      if (!entry.inUse && entry.client.isConnected()) {
        entry.inUse = true;
        entry.lastUsed = Date.now();
        return entry.client;
      }
    }
    return this.acquire();
  }

  registerItem(itemId, client) {
    const entry = this.pool.find(e => e.client === client);
    if (entry) {
      this._itemSessionMap.set(itemId, entry);
    }
  }

  release(client) {
    // Mevcut release mantığı korunur
    // Item mapping temizlenmez - session idle timeout'ta temizlenir
  }
}
```

**Update route değişikliği (`pcon-proxy.api.pcon.update.jsx`):**
```javascript
// Mevcut: client = await manager.acquire();
// Yeni:
client = await manager.acquireForItem(itemId);
```

**Beklenen etki:** Aynı kullanıcı aynı ürünle çalışırken, session zaten doğru article ve property state'ine sahip olacak. Backend sadece değişen 1 property'yi set edecek (26 yerine 1 çağrı = ~50ms vs ~1.3-2.6s).

**Agent talimatı:**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. pcon-session-manager.server.js dosyasını oku.
3. acquireForItem() ve registerItem() metodlarını ekle.
4. _itemSessionMap'i idle cleanup sırasında temizle.
5. pcon-proxy.api.pcon.update.jsx'te acquireForItem(itemId) kullan.
6. pcon-proxy.api.pcon.init.jsx'te insertArticle sonrası registerItem(itemId, client) çağır.
7. Build ve test et.
```

**Agent talimatı (orijinal + revizyon birleşik):**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. configrator_process.md dosyasını oku, mevcut PconClient yapısını anla.
3. pcon-client.server.js, init route ve update route dosyalarını oku.
4. PconSessionManager sınıfını oluştur (1.1).
5. Session Affinity mekanizmasını ekle: acquireForItem(), registerItem() (1.5).
6. Route'ları güncelle (acquire/release pattern + affinity).
7. cache-warmer.server.js'i güncelle (bağımsız session).
8. Build ve test et.
```

---

## Faz 2 — Cache Warming Sistemi Yenileme

**Süre tahmini:** 4-5 saat
**Risk:** Orta
**Öncelik:** Çok yüksek — kullanıcı deneyiminin temel taşı

### Hedef

Tüm pCon ürünlerinin tüm varyant kombinasyonları için cache'in önceden doldurulması. Kullanıcı tarayıcısına hiçbir zaman pCon API gecikmesi yansıtılmamalı.

### 2.1 Ürün Keşfi — Shopify GraphQL Sorgusu İyileştirmesi

`product-fetcher.server.js` dosyasını güncelle:

**Mevcut sorun:** Sadece `pcon_article_number` metafield'ı kontrol ediliyor. `pcon_manufacturer_id` de mutlaka okunmalı.

**Yeni GraphQL sorgusu:**
```graphql
query FetchPconProducts($cursor: String) {
  products(first: 50, after: $cursor, query: "metafields.namespace:'$app' AND metafields.key:'pcon_article_number'") {
    edges {
      node {
        id
        title
        handle
        articleNumber: metafield(namespace: "$app", key: "pcon_article_number") {
          value
        }
        manufacturerId: metafield(namespace: "$app", key: "pcon_manufacturer_id") {
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

> **Not:** Bu sorgu `validate_graphql_codeblocks` MCP aracı ile doğrulanmalıdır.

### 2.2 Full Kombinasyon Warming Stratejisi

Mevcut strateji: Her property için tek tek değişim (N kombinasyon).
Yeni strateji: Önceliklendirilmiş çok katmanlı warming.

**Katman 1 — Varsayılan konfigürasyon (init):**
Her article'ın varsayılan değerleri ile init verisini cache'le.

**Katman 2 — Tek property değişimi (en olası kullanıcı davranışı):**
Her editable property'nin her available seçeneği için tek değişiklik.
Örnek: 5 property × ortalama 4 seçenek = 20 kombinasyon.

**Katman 3 — İki property kombinasyonu (opsiyonel, yoğun):**
En çok değiştirilen 2-3 property'nin çapraz kombinasyonları.
Örnek: Renk × Boyut = 8×4 = 32 ekstra kombinasyon.

**Warm sıralaması:** Katman 1 → Katman 2 → Katman 3 (bütçeye göre)

### 2.3 `article-warmer.server.js` İyileştirmesi

**Değişiklikler:**
- Bağımsız Gatekeeper session kullanımını koru (doğru yaklaşım)
- Paralel warming desteği ekle (`CACHE_WARM_CONCURRENCY` kadar paralel istek)
- Progress callback ekle (loglama ve monitoring için)
- Warming sonucu Redis'e metadata olarak kaydet (`pcon:warm:status:<articleNumber>`)
- Başarısız kombinasyonları 1 kez daha dene (retry)

**Warming metadata formatı:**
```json
{
  "articleNumber": "P12.01.101",
  "lastWarmed": "2026-04-14T03:00:00Z",
  "totalCombinations": 45,
  "warmed": 43,
  "skipped": 2,
  "failed": 0,
  "durationSeconds": 142.5
}
```

### 2.4 Zamanlanmış Warming — Günde 2 Kere

`cache-scheduler.server.js` güncellemesi:

**Cron ifadesi:** `0 3,15 * * *` (03:00 ve 15:00)

**Akış:**
1. Shopify Admin GraphQL API ile `pcon_article_number` metafield'ına sahip tüm ürünleri çek
2. Her ürün için bağımsız Gatekeeper session oluştur
3. Katman 1 + Katman 2 warming uygula
4. Session'ı kapat
5. Sonuçları logla ve Redis metadata'ya kaydet

### 2.5 Manuel CLI Warming Komutu

`scripts/warm-cache.js` güncellemesi:

```bash
# Tüm pCon ürünlerini warm et
npm run warm-cache

# Belirli bir article'ı warm et
npm run warm-cache -- --article P12.01.101 --manufacturer NRUS

# Sadece Katman 1 + 2 (hızlı)
npm run warm-cache -- --layers 1,2

# Full kombinasyon (Katman 1 + 2 + 3)
npm run warm-cache -- --layers 1,2,3

# Dry-run (ne yapılacağını göster, çalıştırma)
npm run warm-cache -- --dry-run

# Progress ile
npm run warm-cache -- --verbose
```

**Çıktı örneği:**
```
[warm-cache] Fetching pCon products from Shopify...
[warm-cache] Found 3 products with pCon metafields:
  1. Calma Desk (P12.01.101 / NRUS)
  2. Nova Chair (P15.02.201 / NRUS)
  3. Forma Table (P18.03.301 / NRUS)

[warm-cache] [1/3] Warming: Calma Desk (P12.01.101)
[warm-cache]   Layer 1: Init data... OK (2.1s)
[warm-cache]   Layer 2: 45 single-property combinations...
[warm-cache]     [1/45] DIS_RENK.MAT_PANEL=PW9017... OK (3.2s)
[warm-cache]     [2/45] DIS_RENK.MAT_PANEL=FLT02... CACHED
[warm-cache]     ...
[warm-cache]   Layer 2 complete: 43 warmed, 2 cached (142.5s)
[warm-cache]   ✓ Calma Desk done (144.6s)

[warm-cache] Summary:
  Products: 3
  Total warmed: 128
  Total skipped: 12
  Total time: 8m 32s
```

### 2.6 Cache'te `originalGltfUrl` Tutma

Her cache kaydında mutlaka `originalGltfUrl` (pCon CDN URL) tutulmalı. Frontend bu URL'yi doğrudan kullanarak tarayıcıdan pCon CDN'e direkt bağlanacak. Bu sayede App Proxy bant genişliği darboğazı yaşanmaz.

### ⚠️ REVİZYON 2.7 — `warm-cache.js` Exit Code Düzeltmesi (Canlı Test Sonrası Eklendi)

**Tespit:** `scripts/warm-cache.js` dosyasının `.finally()` bloğunda her zaman `process.exit(0)` çağrılıyor. Bu, warming sırasında hata oluşsa ve `process.exitCode = 1` set edilse bile script'in başarılı çıkış kodu döndürmesine neden oluyor. CI/CD pipeline'larında yanıltıcı sonuçlara yol açar.

**Mevcut (hatalı):**
```javascript
.finally(() => {
  process.exit(0); // ← Hataları yutarak her zaman 0 döner
});
```

**Yeni:**
```javascript
.catch((err) => {
  console.error("[warm-cache] Fatal error:", err.message);
  process.exitCode = 1;
}).finally(() => {
  process.exit(process.exitCode || 0);
});
```

**Agent talimatı (orijinal + revizyon birleşik):**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. search_docs_chunks ile "products query metafield filter GraphQL pagination" ara.
3. Yeni GraphQL sorgusunu validate_graphql_codeblocks ile doğrula.
4. configrator_process.md dosyasını oku, mevcut warming akışını anla.
5. product-fetcher.server.js, article-warmer.server.js, cache-warmer.server.js,
   cache-scheduler.server.js ve scripts/warm-cache.js dosyalarını güncelle.
6. Cron ifadesini 0 3,15 * * * olarak güncelle.
7. warm-cache.js'te exit code sorununu düzelt (REVİZYON 2.7).
8. Build ve test et.
```

---

## Faz 3 — Backend API Performans Optimizasyonu

**Süre tahmini:** 2-3 saat
**Risk:** Düşük-Orta
**Öncelik:** Yüksek

### 3.1 pCon API Çağrılarını Paralelize Et

**Mevcut (sıralı):**
```
insertArticle → getArticleData → getAllChoiceLists → getExportedGeometry
                 [3s]              [2s]                [4s]
Total: ~9s
```

**Yeni (paralel):**
```
insertArticle → Promise.all([
                   getArticleData,      [3s]
                   getAllChoiceLists,    [2s]  → Toplam: ~4s (en yavaş)
                   getExportedGeometry  [4s]
                 ])
Total: ~4-5s (insert + en yavaş paralel çağrı)
```

**Tahmini iyileşme:** Init süresi %40-50 azalır (cache miss durumunda).

**Uygulanacak dosyalar:**
- `pcon-client.server.js` → `getArticleData` metodu
- `pcon-client.server.js` → `setPropertyValue` metodu (update sonrası kısım)
- `article-warmer.server.js` → warming döngüsü

### 3.2 Update Route Cache Key'e `manufacturerId` Ekle

**Mevcut:**
```javascript
generateCacheKey("update", { articleNumber, ...properties })
```

**Yeni:**
```javascript
generateCacheKey("update", { articleNumber, manufacturerId: manufacturerId || "", ...properties })
```

Bu, farklı manufacturer'lar için aynı article number'a sahip ürünlerin cache collision yaşamasını engeller.

### 3.3 Response Header Optimizasyonu

Init ve update route'larına cache-friendly header'lar ekle:

```javascript
const headers = {
  "Cache-Control": "private, max-age=300",
  "X-Cache-Status": cached ? "HIT" : "MISS",
  "X-Response-Time": `${Date.now() - startTime}ms`,
};
```

### 3.4 Hata Detaylarını Gizle

Production ortamında `err.message` client'a gönderilmemeli:

```javascript
const isDev = process.env.NODE_ENV !== "production";
return Response.json(
  {
    error: "Failed to initialize pCon article",
    ...(isDev && { detail: err.message }),
  },
  { status: 500 }
);
```

### ⚠️ REVİZYON 3.5 — Sadece Değişen Property'yi Set Et (Canlı Test Sonrası Eklendi — EN KRİTİK DARBOĞAZ)

**Tespit:** Canlı testte her property değişikliğinde update API ~650ms+ sürüyor. Bunun ana nedeni: `pcon-client.server.js`'teki `setPropertyValue()` metodu TÜM property'leri sıralı (sequential) olarak set ediyor. URL'de 26 property var — kullanıcı 1 property değiştirdiğinde backend 26 adet `session.basket.setPropertyValue()` çağrısı yapıyor. Her çağrı ~50-100ms sürdüğünde, toplam **1.3-2.6 saniye** sadece property setting'e gidiyor.

**Mevcut akış (yavaş):**
```
Frontend: TÜM 26 property'yi gönder
  ↓
Backend: for döngüsü ile 26 adet sıralı setPropertyValue çağrısı
  ↓
Backend: articleData + choiceLists + gltfUrl (paralel)
  ↓
Toplam: ~1.3-2.6s (property set) + ~0.5s (veri çekme) = ~2-3s
```

**Yeni akış (hızlı):**
```
Frontend: changedProperty + allProperties (cache key için) gönder
  ↓
Backend (session affinity ile aynı session):
  → Sadece 1 adet setPropertyValue çağrısı
  → articleData + choiceLists + gltfUrl (paralel)
  ↓
Toplam: ~50-100ms (1 property set) + ~0.5s (veri çekme) = ~0.6-0.7s

Backend (session affinity yok / stale session):
  → Article re-insert + TÜM property'leri set et (fallback)
```

**Çözüm — 2 Parçalı:**

**Parça A — Frontend (`configurator-store.js`):**

`updateProperty` fonksiyonunda `allProperties`'in yanında `changedProperty`'yi de ayrıca gönder:

```javascript
async updateProperty(key, value) {
  // ... mevcut optimistic UI ve cache kontrolü ...

  const allProps = {};
  for (const p of optimistic) {
    if (p.currentValue) allProps[p.id] = p.currentValue;
  }

  // Yeni: changedProperty ayrıca gönderiliyor
  const data = await updateProperties(
    proxyBase, allProps, itemId, articleNumber, manufacturerId,
    { signal: currentAbort.signal, changedProperty: { key, value } }
  );
}
```

`api.js`'teki `updateProperties` fonksiyonu:
```javascript
export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId, options = {}) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties,
      itemId,
      articleNumber,
      manufacturerId,
      changedProperty: options.changedProperty || null  // Yeni alan
    }),
    ...options,
  });
}
```

**Parça B — Backend (`pcon-proxy.api.pcon.update.jsx` + `pcon-client.server.js`):**

Update route'ta:
```javascript
const { properties, itemId, articleNumber, manufacturerId, changedProperty } = body;

// changedProperty varsa ve session affinity ile doğru session'a ulaşıldıysa,
// sadece 1 property set et
client = await manager.acquireForItem(itemId);

try {
  let data;
  if (changedProperty) {
    data = await client.setSingleProperty(itemId, changedProperty.key, changedProperty.value);
  } else {
    // Fallback: tüm property'leri set et (ilk yükleme sonrası URL'den restore gibi)
    data = await client.setPropertyValue(itemId, propertyList);
  }
} catch (err) {
  // Stale itemId fallback: re-insert + tüm property'leri set et
  // ...
}
```

`pcon-client.server.js`'e yeni metod ekle:
```javascript
async setSingleProperty(itemId, propertyKey, value) {
  const session = await this.ensureSession();
  const [propClass, propName] = propertyKey.split(".");

  await session.basket.setPropertyValue(itemId, propClass, propName, value);

  const [articleData, choiceLists, gltfUrl] = await Promise.all([
    session.basket.getArticleData(itemId, { enableBooleanPropType: true }),
    session.basket.getAllChoiceLists(itemId, { enableBooleanPropType: true }),
    session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
  ]);

  // ... return price, gltfUrl, validOptions, currency
}
```

**Beklenen etki:** Property değişikliği süresi **~2-3 saniyeden ~0.6-0.7 saniyeye** düşecek (%70+ iyileşme). Session affinity (Faz 1 REVİZYON 1.5) ile birlikte uygulandığında en yüksek etki sağlanır.

**Agent talimatı (orijinal + revizyon birleşik):**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. configrator_process.md ve mevcut route dosyalarını oku.
3. pcon-client.server.js'te:
   a. getArticleData ve setPropertyValue metodlarını Promise.all ile paralelize et (3.1).
   b. Yeni setSingleProperty() metodu ekle (REVİZYON 3.5).
4. Update route'ta:
   a. manufacturerId'yi cache key'e ekle (3.2).
   b. changedProperty desteği ekle — varsa setSingleProperty, yoksa setPropertyValue (REVİZYON 3.5).
5. Response header'ları ekle (3.3).
6. Hata mesajlarını production'da gizle (3.4).
7. article-warmer.server.js'te de aynı paralelizasyonu uygula.
8. Build ve test et.
```

---

## Faz 4 — Frontend Bundle ve Yükleme Optimizasyonu

**Süre tahmini:** 4-5 saat
**Risk:** Orta
**Öncelik:** Yüksek

### 4.1 Bundle Boyutu Azaltma

**Mevcut tahmini boyut:** ~2MB (minified, gzip öncesi)
**Hedef:** <500KB (gzipped)

**Adımlar:**

#### a) Three.js Tree-Shaking

Mevcut:
```javascript
import * as THREE from "three";
```

Yeni:
```javascript
import { Box3, Vector3 } from "three";
```

Sadece `Model.jsx`'te kullanılan sınıfları import et.

#### b) drei'den Seçici Import

Mevcut:
```javascript
import { Environment, ContactShadows, OrbitControls, Html } from "@react-three/drei";
```

Bu zaten seçici ama `drei`'nin barrel export'ları yüzünden tree-shaking çalışmayabilir. Deep import kullan:

```javascript
import { Environment } from "@react-three/drei/core/Environment";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
```

#### c) Vite Build Optimizasyonu

`vite.config.extension.js` güncellemesi:
```javascript
build: {
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
},
```

### 4.2 Lazy Loading Stratejisi

Configurator bundle'ını viewport'a girince yükle:

**Bootloader (`configurator.js`) güncellemesi:**
```javascript
var observer = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    observer.disconnect();
    loadConfigurator();
  }
}, { rootMargin: "200px" });

observer.observe(root);
```

Bu sayede sayfa ilk açıldığında ~2MB'lık bundle indirilmez. Kullanıcı aşağı scroll edip configurator'a yaklaşınca yükleme başlar. `rootMargin: "200px"` ile 200px öncesinden başlatılarak kullanıcı geldiğinde hazır olur.

### 4.3 Skeleton/Placeholder UI

Bundle yüklenene kadar CSS-only skeleton göster:

**Liquid template'te:**
```html
<div id="pcon-root" ...>
  <div class="pcon-skeleton">
    <div class="pcon-skeleton__viewer"></div>
    <div class="pcon-skeleton__sidebar">
      <div class="pcon-skeleton__price"></div>
      <div class="pcon-skeleton__props"></div>
    </div>
  </div>
</div>
```

**CSS (configurator.css):**
```css
.pcon-skeleton {
  display: flex; gap: 24px;
  animation: pcon-pulse 1.5s ease-in-out infinite;
}
.pcon-skeleton__viewer {
  flex: 2; aspect-ratio: 4/3;
  background: #f0f0f0; border-radius: 8px;
}
.pcon-skeleton__sidebar {
  flex: 1; display: flex; flex-direction: column; gap: 16px;
}
@keyframes pcon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 4.4 Resource Hints

**Liquid template'e ekle:**
```liquid
<link rel="preconnect" href="https://s2.eaiws.pcon-solutions.com" crossorigin>
<link rel="dns-prefetch" href="https://s2.eaiws.pcon-solutions.com">
```

Bu, GLTF yüklemesi başlamadan önce DNS + TLS handshake'i tamamlar (~100-300ms tasarruf).

### 4.5 GLTF Yükleme Optimizasyonu

Frontend'de GLTF yükleme sırasında progress göster:

```javascript
const loader = new GLTFLoader();
loader.load(
  url,
  (gltf) => { /* onLoad */ },
  (progress) => {
    const percent = (progress.loaded / progress.total) * 100;
    setLoadProgress(percent);
  },
  (error) => { /* onError */ }
);
```

**Agent talimatı:**
```
1. Shopify MCP → learn_shopify_api(api: "liquid") çağır, conversationId al.
2. search_docs_chunks ile "theme app extension performance script loading" ara.
3. configrator_process.md dosyasını oku.
4. extension-build/vite.config.extension.js, App.jsx, Model.jsx,
   ConfiguratorScene.jsx dosyalarını oku.
5. Three.js import'larını optimize et.
6. Bootloader'a IntersectionObserver lazy loading ekle.
7. Liquid template'e skeleton UI ve resource hints ekle.
8. validate_theme_codeblocks ile Liquid değişikliklerini doğrula.
9. Extension build yap ve yeni bundle boyutunu ölç.
10. Build ve test et.
```

---

## Faz 5 — Frontend Request Yönetimi ve UX

**Süre tahmini:** 2-3 saat
**Risk:** Düşük
**Öncelik:** Yüksek

### 5.1 Request Debounce

Kullanıcı hızlıca property'ler arasında geçiş yapınca gereksiz API çağrıları engellenmeli.

**`configurator-store.js` güncellemesi:**

```javascript
let updateTimer = null;
let abortController = null;

async updateProperty(key, value) {
  // Optimistic UI hemen güncellenir
  // ...

  // Frontend cache kontrolü
  // ...

  // Debounce: 150ms bekle
  if (updateTimer) clearTimeout(updateTimer);
  if (abortController) abortController.abort();

  abortController = new AbortController();

  updateTimer = setTimeout(async () => {
    try {
      const data = await updateProperties(proxyBase, allProps, itemId,
        articleNumber, manufacturerId, { signal: abortController.signal });
      // UI güncelle
    } catch (err) {
      if (err.name === "AbortError") return; // iptal edilen isteği yoksay
      // Hata işle
    }
  }, 150);
}
```

### 5.2 AbortController Entegrasyonu

`api.js` dosyasını güncelle:

```javascript
export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  const controller = options.signal
    ? null
    : new AbortController();
  const signal = options.signal || controller?.signal;
  const timeout = setTimeout(
    () => controller?.abort(),
    options.timeout || DEFAULT_TIMEOUT,
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    // ...
  } finally {
    clearTimeout(timeout);
  }
}
```

### 5.3 Optimistic UI İyileştirmesi

Property değiştiğinde:
1. Seçilen buton hemen active olur (mevcut — çalışıyor)
2. Eğer frontend cache'te varsa, 3D model ve fiyat anında güncellenir (mevcut — çalışıyor)
3. Eğer cache'te yoksa, eski 3D model gösterilmeye devam eder + subtle loading overlay
4. Yeni model gelince crossfade geçiş yapılır (yeni)

### 5.4 Hata Durumunda Retry Mekanizması

Zustand store'a retry mantığı ekle:

```javascript
async updatePropertyWithRetry(key, value, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await this.updateProperty(key, value);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### ⚠️ REVİZYON 5.5 — Debounce Değerini Azalt veya Kaldır (Canlı Test Sonrası Eklendi)

**Tespit:** Mevcut `DEBOUNCE_MS = 150` değeri her property değişikliğine 150ms gecikme ekliyor. Property selector butonları discrete click'ler — kullanıcı bir butona tıkladığında yeni bir tıklama beklenmesi gereksiz. Bu 150ms doğrudan kullanıcının algıladığı gecikmeye ekleniyor.

**Çözüm:** Debounce değerini 0ms'ye düşür veya en fazla 50ms yap. Property butonları zaten tek seferlik click olduğu için debounce'a gerek yok. Eğer text input gibi sürekli tetiklenen bir input olsaydı debounce anlamlı olurdu.

```javascript
// Mevcut:
const DEBOUNCE_MS = 150;

// Yeni:
const DEBOUNCE_MS = 0; // Discrete click'ler için debounce gereksiz
```

**Not:** Eğer ileride text input'lu property'ler eklenirse, sadece o input tipi için debounce uygulanabilir.

### ⚠️ REVİZYON 5.6 — `updatePropertyWithRetry` Etkisizlik Düzeltmesi (Canlı Test Sonrası Eklendi)

**Tespit:** Mevcut `updateProperty()` fonksiyonu `setTimeout` ile debounced bir yapıda çalışıyor ve **Promise döndürmüyor**. Bu yüzden `updatePropertyWithRetry()`'daki `await get().updateProperty(...)` ifadesi API çağrısının gerçek sonucunu beklemeden hemen resolve oluyor. Retry mantığı (`catch` bloğu ve exponential backoff) hiçbir zaman tetiklenmiyor.

**Mevcut (etkisiz):**
```javascript
async updateProperty(key, value) {
  // ... setTimeout içinde API çağrısı var
  // Fonksiyon undefined döner, await hiçbir şey beklemez
  updateTimer = setTimeout(async () => {
    // API çağrısı burada ama return değeri kaybolur
  }, DEBOUNCE_MS);
}

async updatePropertyWithRetry(key, value, retries = 2) {
  // await get().updateProperty() → hemen resolve, retry hiç çalışmaz
}
```

**Çözüm:** `updateProperty` bir Promise döndürmeli, bu Promise debounced API çağrısının sonucunu temsil etmeli:

```javascript
async updateProperty(key, value) {
  // ... optimistic UI, cache check ...

  if (updateTimer) clearTimeout(updateTimer);
  if (abortController) abortController.abort();

  abortController = new AbortController();
  const currentAbort = abortController;

  return new Promise((resolve, reject) => {
    updateTimer = setTimeout(async () => {
      try {
        const data = await updateProperties(
          proxyBase, allProps, itemId, articleNumber, manufacturerId,
          { signal: currentAbort.signal, changedProperty: { key, value } }
        );
        // ... responseCache.set, mergeValidOptions, set state ...
        resolve(data);
      } catch (err) {
        if (err.name === "AbortError") {
          resolve(undefined); // İptal normal durum
          return;
        }
        set({ properties, updating: false, error: err.message });
        reject(err);
      }
    }, DEBOUNCE_MS);
  });
}
```

### ⚠️ REVİZYON 5.7 — Frontend'den Sadece Değişen Property'yi Gönder (Canlı Test Sonrası Eklendi)

**Tespit:** Faz 3 REVİZYON 3.5 ile bağlantılı. Frontend'in `updateProperties()` çağrısını `changedProperty` bilgisini de içerecek şekilde güncellemesi gerekiyor.

**`configurator-store.js` değişikliği:**
```javascript
updateTimer = setTimeout(async () => {
  try {
    const data = await updateProperties(
      proxyBase, allProps, itemId, articleNumber, manufacturerId,
      {
        signal: currentAbort.signal,
        changedProperty: { key, value }  // ← Yeni: hangi property değişti
      }
    );
    // ...
  }
}, DEBOUNCE_MS);
```

**`api.js` değişikliği:**
```javascript
export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId, options = {}) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties,
      itemId,
      articleNumber,
      manufacturerId,
      changedProperty: options.changedProperty || null
    }),
    ...options,
  });
}
```

**Agent talimatı (orijinal + revizyon birleşik):**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. configrator_process.md dosyasını oku.
3. configurator-store.js ve api.js dosyalarını oku.
4. Debounce değerini 0ms'ye düşür (REVİZYON 5.5).
5. updateProperty'yi Promise döndürecek şekilde düzelt (REVİZYON 5.6).
6. changedProperty bilgisini updateProperties çağrısına ekle (REVİZYON 5.7).
7. AbortController entegrasyonunu koru (5.2).
8. Extension build yap ve test et.
```

---

## Faz 6 — Three.js Memory Yönetimi ve 3D Performans

**Süre tahmini:** 2-3 saat
**Risk:** Orta
**Öncelik:** Orta-Yüksek

### 6.1 GLTF Memory Dispose

**Mevcut sorun:** Her property değişikliğinde yeni GLTF yüklenir ama eski scene dispose edilmiyor. 50MB'lık modeller GPU memory'de birikir.

**Model.jsx güncellemesi:**

```javascript
useEffect(() => {
  return () => {
    // Cleanup: eski scene'i dispose et
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => disposeMaterial(m));
        } else {
          disposeMaterial(child.material);
        }
      }
    });
  };
}, [scene]);

function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) value.dispose();
  }
  material.dispose();
}
```

### 6.2 GLTF Loader Cache Temizliği

```javascript
useEffect(() => {
  return () => {
    // Eski URL'nin loader cache'ini temizle
    useLoader.clear(GLTFLoader, url);
  };
}, [url]);
```

### 6.3 Model Geçiş Animasyonu

Yeni model yüklenirken smooth geçiş:

```javascript
const [opacity, setOpacity] = useState(0);

useEffect(() => {
  setOpacity(0);
  const timer = setTimeout(() => setOpacity(1), 50);
  return () => clearTimeout(timer);
}, [scene]);

return (
  <group ref={groupRef}>
    <primitive object={scene} />
    {/* Fade-in effect CSS veya Three.js material opacity ile */}
  </group>
);
```

### ⚠️ REVİZYON 6.4 — HDRI Dosyasını Güvenilir CDN'den Yükle (Canlı Test Sonrası Eklendi)

**Tespit:** Canlı testte HDRI environment dosyası (`studio_small_03_1k.hdr`) GitHub `raw.githubusercontent.com` CDN'den yükleniyor. Bu:
- Production kullanımı için güvenilir değil (rate limiting, downtime riski)
- GitHub CDN'i asset serving için optimize edilmemiş (yavaş olabilir)
- Üçüncü parti bağımlılığı — kontrol dışı

**⛔ Shopify Theme Extension Kısıtlaması:**
Extension `assets/` klasörü yalnızca şu dosya türlerini kabul eder: `.jpg, .jpeg, .js, .css, .png, .svg, .json, .wasm`. **`.hdr` dosyaları extension assets'e EKLENEMEZ.**

**Çözüm (3 seçenek, öncelik sırasıyla):**

**Seçenek A — App Proxy üzerinden serve et (Önerilen):**
1. `studio_small_03_1k.hdr` dosyasını `public/` klasörüne koy (Vite build tarafından serve edilir)
2. App Proxy üzerinden bir route ile dosyayı sun:

```javascript
// app/routes/pcon-proxy.assets.$.jsx
import { readFile } from "fs/promises";
import { resolve } from "path";

export async function loader({ params }) {
  const filePath = resolve("public", params["*"]);
  const buffer = await readFile(filePath);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
```

```javascript
// ConfiguratorScene.jsx
<Environment files={`${proxyBase}/assets/studio_small_03_1k.hdr`} />
```

**Seçenek B — jsDelivr CDN kullan (Basit, güvenilir):**
jsDelivr, GitHub repo'larını production-grade CDN üzerinden mirror'lar:

```javascript
// ConfiguratorScene.jsx
<Environment files="https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a/hdri/studio_small_03_1k.hdr" />
```

jsDelivr avantajları: Global CDN, HTTP/2, cache headers, SLA garantisi.

**Seçenek C — drei preset'i koruyup preconnect ekle (Minimum değişiklik):**
Eğer yukarıdaki seçenekler uygulanamıyorsa, mevcut `preset="studio"` korunabilir ve Liquid template'e GitHub CDN için de preconnect eklenir:

```liquid
<link rel="preconnect" href="https://raw.githubusercontent.com" crossorigin>
```

**Önerilen seçenek:** Seçenek B (jsDelivr CDN) — en az kod değişikliği ile en güvenilir sonuç.

**ÖNEMLİ:** Eğer daha önce `.hdr` dosyası `extensions/pcon-3d-configurator/assets/` altına eklendiyse, bu dosya **silinmelidir** çünkü Shopify build hatası veriyor.

### ⚠️ REVİZYON 6.5 — Three.js Sahne Aydınlatması ve Tone Mapping Düzeltmesi (Canlı Test 3 Sonrası Eklendi) — **EN KRİTİK GÖRSEL SORUN**

**Tespit:** pCon UI referans linki ile uygulamamızın çıktısı karşılaştırıldığında, **3D modelin renkleri tamamen yanlış gösteriliyor:**

| Özellik | pCon UI (Referans) | Bizim Uygulama |
|---------|-------------------|----------------|
| Dış duvarlar (PW9017 Schwarz) | **Siyah** | Açık gri / beyaz |
| İç döşeme (NU_A3_03) | **Altın/Sarı kumaş** | Görünmüyor / soluk |
| Genel görünüm | Koyu, zengin, kontrastlı | Soluk, beyaz, yıkanmış |
| İç detaylar (masa, kapı vb.) | Net görünür | Zor ayırt edilir |

**Referans pCon UI linki:**
```
https://ui.pcon-solutions.com/#GATEKEEPER_ID=65f048ad95604&moc=NRUS&ban=P12.01.101&sid=CLMP&ovc=MODEL.CALMA_MODEL%3DCALMA%3BTYPE.DIMENSION%3Dd_100_110%3BDIS_RENK.MAT_PANEL%3DFLT02%3BDIS_RENK.MAT_LAQUERED%3DPW9017%3BIC_PANEL_DOSEME.PG_FOAM%3DA3%3BIC_PANEL_DOSEME.MAT_FOAM%3DNU_A3_03%3BMASA.TABLEC%3Dtrue%3BMASA.TABLE_TYPE%3Dfix%3BMASA.TABLETOP_MATERIAL%3DPW%3BMASA.MAT_TABLETOP%3DPW1500%3BMASA.MAT_TABLEMETAL%3DRAL9005%3BOPTION.U_SOCKET%3Dalman%3BOPTION.OCCUPANCYI%3Dtrue%3BOPTION.OCCUPANCYI_ST%3Ddolu%3BOPTION.TOUCH_PANEL%3Dyes%3BOPTION.SPRINKLER%3Dfalse%3BOPTION.GUC_KABLOSU%3Dalman%3BMATERIAL.MAT_CEILING%3DFLT02%3BMATERIAL.MAT_FLOOR%3DCORAL342&lang=en
```

**Kök Neden:** Three.js Canvas'ın varsayılan tone mapping ve environment aydınlatma ayarları, koyu PBR malzemeleri (siyah, koyu gri vb.) aşırı parlak gösteriyor. HDRI environment (`studio_small_03_1k.hdr`) tam yoğunlukta uygulandığında, karanlık yüzeyler ışığı fazla yansıtıp gri/beyaz görünüyor.

**Çözüm — `ConfiguratorScene.jsx` güncellemesi:**

```javascript
import * as THREE from "three";

// Canvas'a tone mapping ve exposure ayarları ekle
<Canvas
  camera={{ position: [0, 2, 5], fov: 50 }}
  gl={{
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 0.7,   // Varsayılan 1.0 — düşürülerek koyu renkler korunur
    outputColorSpace: THREE.SRGBColorSpace,
  }}
>
  <Environment
    files={HDRI_URL}
    environmentIntensity={0.8}  // IBL yoğunluğunu azalt (Three.js r152+)
  />
  {/* Ek yönlü ışık — gölge ve derinlik için */}
  <directionalLight position={[5, 5, 5]} intensity={0.3} />
  <Suspense fallback={<ModelLoadingProgress percent={loadProgress} />}>
    ...
  </Suspense>
  ...
</Canvas>
```

**Ayar kılavuzu (iteratif test gerektirir):**

| Parametre | Başlangıç Değeri | Aralık | Etki |
|-----------|-----------------|--------|------|
| `toneMappingExposure` | 0.7 | 0.5 — 1.0 | Düşürünce koyu renkler daha koyu görünür |
| `environmentIntensity` | 0.8 | 0.5 — 1.0 | IBL (Image-Based Lighting) yoğunluğu |
| `directionalLight intensity` | 0.3 | 0.1 — 0.5 | Ek gölge/derinlik aydınlatması |

**⚠️ Önemli:** `environmentIntensity` prop'u Three.js r152+ ve drei'nin güncel sürümlerinde kullanılabilir. Eğer mevcut three.js sürümü desteklemiyorsa, alternatif olarak `onCreated` callback ile ayarlanabilir:

```javascript
<Canvas
  onCreated={(state) => {
    state.gl.toneMapping = THREE.ACESFilmicToneMapping;
    state.gl.toneMappingExposure = 0.7;
    state.gl.outputColorSpace = THREE.SRGBColorSpace;
    if (state.scene.environmentIntensity !== undefined) {
      state.scene.environmentIntensity = 0.8;
    }
  }}
  camera={{ position: [0, 2, 5], fov: 50 }}
>
```

**Test yöntemi:** Düzeltme sonrasında pCon UI referans linkindeki aynı konfigürasyon ile kıyaslama yapılmalı:
1. PW9017 (Schwarz) duvarlar siyah/koyu gri görünmeli
2. NU_A3_03 kumaş döşeme altın/sarı tonunda görünmeli
3. PW1500 masa üstü açık gri olmalı
4. Genel kontrast pCon UI'a yakın olmalı

### ⚠️ REVİZYON 6.6 — Gatekeeper ID Uyumsuzluğu Araştırması (Canlı Test 3 Sonrası Eklendi)

**Tespit:** Uygulamamız farklı bir Gatekeeper ID kullanıyor:

| Kaynak | Gatekeeper ID |
|--------|--------------|
| Bizim `.env` | `692ed4017b5fb` |
| pCon UI referans linki | `65f048ad95604` |

**Potansiyel Etki:**
- Farklı Gatekeeper abonelikleri farklı GLTF export kalitesine sahip olabilir
- Texture çözünürlüğü veya malzeme detayı farklılık gösterebilir
- Aynı article number farklı varsayılan konfigürasyonlarla yüklenebilir

**Yapılacak:**
1. `692ed4017b5fb` ile oluşturulan GLTF'in malzeme/texture içerip içermediğini kontrol et
2. Eğer GLTF'te texture/renk bilgisi eksikse, `.env` dosyasında Gatekeeper ID'yi `65f048ad95604` ile değiştirip test et
3. Her iki Gatekeeper ile aynı konfigürasyonda GLTF dosya boyutlarını karşılaştır (aynıysa fark Gatekeeper'da değil rendering'dedir)

**NOT:** Gatekeeper ID değişikliği kritik bir ortam ayarıdır. Üretim ortamında hangi Gatekeeper kullanılacağına Nurus/pCon ile doğrulanarak karar verilmelidir.

### ⚠️ REVİZYON 6.7 — Kamera Konumlandırma: Ürün İç Alanı Görünmüyor (Canlı Test 4 Sonrası Eklendi) — **KRİTİK GÖRSEL SORUN**

**Tespit:** Canlı browser testinde ürünün (CALMA booth/pod) sadece dış duvarları görünüyor, cam kapıdan iç alan (oturma, masa, döşeme) hiç görülemiyor. pCon UI referansında ise ürün diagonal (3/4) açıdan gösterilip iç mekan net bir şekilde görülüyor.

**Karşılaştırma:**

| Özellik | pCon UI | Bizim Uygulama |
|---------|---------|----------------|
| Kamera açısı | ~30-45° diagonal (ön-sol çapraz) | Doğrudan Z ekseni üzerinde (0, y, z) |
| İç mekan | Cam kapıdan görünür (masa, döşeme, halı) | Sadece dış duvarlar |
| Kullanıcı deneyimi | Ürünün tüm detayları anlaşılır | Sadece kutu şeklinde dış kabuk |

**Kök Neden (Model.jsx, satır 170-177):**

```javascript
// MEVCUT — HATALI
const maxDim = Math.max(size.x, size.y, size.z);
const fov = camera.fov * (Math.PI / 180);
const distance = maxDim / (2 * Math.tan(fov / 2));
camera.position.set(0, size.y * 0.4, distance * 1.5);  // ❌ Düz Z ekseni
camera.lookAt(0, 0, 0);
```

Kamera `(0, y, z)` konumuna yerleştirildiğinde, booth tipi ürünlerin sadece bir yüzeyi (dış duvar veya arka panel) görünür. pCon UI ise kamerayı diagonal konumlandırarak cam kapıdan iç alanı gösterir.

**Düzeltme — 2 Aşamalı:**

**Aşama 1: GLTF Embedded Camera Kullanımı (Öncelikli)**

pCon'un GLTF exportu embedded kamera içerebilir. Önce bunu kontrol et:

```javascript
// Model.jsx — GLTF yüklendikten sonra
useEffect(() => {
  if (!gltf || !scene) return;

  const box = new Box3().setFromObject(scene);
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  scene.position.sub(center);

  // 1) GLTF'te gömülü kamera varsa kullan
  if (gltf.cameras && gltf.cameras.length > 0) {
    const gltfCam = gltf.cameras[0];
    // GLTF kamerasının world position'ını al
    const camNode = gltf.scene.getObjectByProperty('uuid', gltfCam.uuid);
    if (camNode) {
      const worldPos = new Vector3();
      camNode.getWorldPosition(worldPos);
      worldPos.sub(center); // scene offset'i uygula
      camera.position.copy(worldPos);
      camera.fov = gltfCam.fov ? THREE.MathUtils.radToDeg(gltfCam.fov) : 50;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      return;
    }
  }

  // 2) Fallback: Diagonal (3/4) kamera konumu
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const distance = maxDim / (2 * Math.tan(fov / 2));

  // Kamerayı ön-sol diagonal konuma yerleştir (pCon UI benzeri görünüm)
  camera.position.set(
    -distance * 0.8,      // X: sola kaydır (ön-sol çapraz)
    size.y * 0.6,         // Y: biraz yukarıdan bak
    distance * 1.0        // Z: yaklaştır
  );
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}, [scene, camera, gltf]);
```

**Aşama 2: OrbitControls Target Düzeltmesi (ConfiguratorScene.jsx)**

OrbitControls'un `target`'ı `(0,0,0)` yerine modelin merkezine set edilmeli:

```javascript
<OrbitControls
  enablePan={false}
  minDistance={2}
  maxDistance={10}
  target={[0, 0, 0]}
  // Kullanıcının modeli döndürerek iç alanı da görebilmesini sağla
/>
```

**Doğrulama Kriterleri:**
1. Sayfa yüklendiğinde CALMA booth'un cam kapısı ve iç alanı (masa, döşeme, halı) görünür olmalı
2. Kamera açısı pCon UI referansına yakın olmalı (~30-45° diagonal)
3. Kullanıcı orbit kontrollerle döndürerek tüm açılardan bakabilmeli
4. Farklı CALMA boyutlarında (SMALL, MEDIUM, LARGE vb.) kamera otomatik uyum sağlamalı

**NOT:** Bu düzeltme REVİZYON 6.5 (tone mapping) ile birlikte uygulandığında, ürün hem doğru renklerle hem de doğru açıdan görünecektir. Bu ikisi birlikte ürünün "pCon UI kalitesinde" görünmesini sağlayacak en kritik düzeltmelerdir.

### 6.5 Draco GLTF Compression (Backend Tarafı)

> **Not:** Bu adım pCon CDN'den gelen GLTF'lere doğrudan uygulanamaz çünkü URL'ler pCon tarafından üretilir. Ancak disk cache'e yazarken compression uygulanabilir veya pCon'dan Draco formatında export istenebilir.

**Kontrol et:** `getExportedGeometry` çağrısında `"format=GLTF"` yerine Draco destekli format mevcut mu?

```javascript
// Olası alternatif:
const gltfUrl = await session.basket.getExportedGeometry(itemId, [
  "format=GLTF",
  "compression=DRACO"  // pCon destekliyorsa
]);
```

Eğer pCon Draco desteklemiyorsa, disk cache'e yazarken `gltf-pipeline` veya `gltfpack` ile compress et:

```javascript
import { processGlb } from "gltf-pipeline";

async function compressGltf(buffer) {
  const results = await processGlb(buffer, {
    dracoOptions: { compressionLevel: 7 },
  });
  return Buffer.from(results.glb);
}
```

**Agent talimatı (orijinal + tüm revizyonlar birleşik):**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. configrator_process.md dosyasını oku.
3. Model.jsx, ConfiguratorScene.jsx dosyalarını oku.
4. ⭐ EN ÖNCELİKLİ — REVİZYON 6.5: Three.js tone mapping ve environment düzeltmesi:
   a. Canvas'a gl={{ toneMapping, toneMappingExposure: 0.7, outputColorSpace }} ekle
   b. Environment'a environmentIntensity={0.8} ekle (veya onCreated callback kullan)
   c. Ek directionalLight ekle (intensity: 0.3)
   d. pCon UI referans linkiyle karşılaştırarak iteratif ayar yap:
      https://ui.pcon-solutions.com/#GATEKEEPER_ID=65f048ad95604&moc=NRUS&ban=P12.01.101&sid=CLMP&ovc=...
   e. Hedef: PW9017 (siyah) duvarlar koyu görünmeli, NU_A3_03 kumaş sarı/altın görünmeli
5. ⭐ EN ÖNCELİKLİ — REVİZYON 6.7: Kamera konumlandırma düzeltmesi (Model.jsx):
   a. GLTF embedded camera kontrolü ekle: gltf.cameras dizisini kontrol et
   b. Eğer GLTF'te kamera varsa, gömülü kameranın world position'ını kullan
   c. Eğer GLTF'te kamera yoksa, fallback olarak diagonal (3/4) açı uygula:
      camera.position.set(-distance * 0.8, size.y * 0.6, distance * 1.0)
   d. Mevcut düz Z-ekseni konumunu (0, y, z) KESİNLİKLE kaldır
   e. Hedef: Sayfa açıldığında CALMA booth'un cam kapısından iç mekan (masa, döşeme, halı) görünmeli
   f. Doğrulama: pCon UI'daki kamera açısıyla karşılaştır
6. REVİZYON 6.6: Gatekeeper ID araştırması:
   a. Mevcut .env PCON_GATEKEEPER_ID (692ed4017b5fb) ile GLTF export kalitesini kontrol et
   b. Gerekirse 65f048ad95604 ile karşılaştırma testi yap
7. Memory dispose mekanizmasını ekle (6.1).
8. Loader cache temizliğini ekle (6.2).
9. HDRI dosyasını güvenilir CDN'den yükle (REVİZYON 6.4).
10. pCon EAIWS dökümantasyonunu kontrol et: Draco export destekli mi?
11. Extension build yap ve test et.
    ⚠️ Build sonrasında browserdan canlı test yaparak:
    - pCon UI ile renk karşılaştırması MUTLAKA yapılmalı (REVİZYON 6.5)
    - Kamera açısı kontrolü: İç mekan görünür mü? (REVİZYON 6.7)
```

---

## Faz 7 — Altyapı Sağlamlaştırma ve Monitoring

**Süre tahmini:** 2-3 saat
**Risk:** Düşük
**Öncelik:** Orta

### 7.1 GLTF Disk Cache Eviction

`gltf-cache.server.js` güncellemesi:

**LRU eviction mekanizması:**
```javascript
async function evictOldFiles(maxSizeMB) {
  const files = await readdir(GLTF_CACHE_DIR);
  const stats = await Promise.all(
    files.map(async (f) => {
      const path = resolve(GLTF_CACHE_DIR, f);
      const stat = await fsStat(path);
      return { path, size: stat.size, mtime: stat.mtimeMs };
    })
  );

  const totalSize = stats.reduce((sum, s) => sum + s.size, 0);
  if (totalSize <= maxSizeMB * 1024 * 1024) return;

  // En eski dosyaları sil
  stats.sort((a, b) => a.mtime - b.mtime);
  let freed = 0;
  const target = totalSize - maxSizeMB * 1024 * 1024;

  for (const file of stats) {
    if (freed >= target) break;
    await unlink(file.path);
    freed += file.size;
  }
}
```

Warming ve cacheGltf çağrılarından sonra eviction çalıştır.

### 7.2 Redis Health Check

```javascript
export async function isRedisHealthy() {
  try {
    const redis = await getClient();
    if (!redis) return false;
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}
```

### 7.3 Cache İstatistikleri API'si

Yeni route: `GET /api/pcon/cache-stats`

```json
{
  "redis": {
    "connected": true,
    "totalKeys": 156,
    "initKeys": 3,
    "updateKeys": 153
  },
  "gltfDisk": {
    "totalFiles": 48,
    "totalSizeMB": 2400,
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

### 7.4 Rate Limiting

App Proxy route'larına basit rate limiting ekle:

```javascript
const requestCounts = new Map();
const RATE_LIMIT = 30; // 30 istek / dakika / IP
const WINDOW_MS = 60000;

function checkRateLimit(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }

  entry.count++;
  requestCounts.set(ip, entry);

  return entry.count <= RATE_LIMIT;
}
```

### 7.5 DRY İhlali Düzeltmesi

`_mapProperties` fonksiyonunu ortak bir util'e çıkar:

`app/services/property-mapper.server.js`:
```javascript
export function mapProperties(articleData, choiceLists) {
  // Tek bir yerde tanımlanmış mapping mantığı
}
```

Hem `pcon-client.server.js` hem `article-warmer.server.js` bu util'i import etmeli.

**Agent talimatı:**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. configrator_process.md dosyasını oku.
3. gltf-cache.server.js, redis-client.server.js dosyalarını oku.
4. Disk cache eviction mekanizmasını ekle.
5. Redis health check ekle.
6. Cache stats route oluştur (Shopify admin auth ile korunmalı).
7. Rate limiting ekle.
8. _mapProperties DRY ihlalini düzelt.
9. Build ve test et.
```

---

## Faz 8 — Bootloader ve Liquid Template Optimizasyonu

**Süre tahmini:** 1-2 saat
**Risk:** Düşük
**Öncelik:** Orta

### 8.1 Bootloader Gereksiz Gecikmeyi Kaldır

**Mevcut:**
```javascript
s.onload = function () {
  setTimeout(function () {
    if (typeof window.__pconConfiguratorInit === "function") {
      // ...
    }
  }, 100);  // ← Gereksiz 100ms gecikme
};
```

**Yeni:**
```javascript
s.onload = function () {
  if (typeof window.__pconConfiguratorInit === "function") {
    try {
      window.__pconConfiguratorInit(root, config);
    } catch (e) {
      showError("Configurator error: " + e.message);
    }
  } else {
    loadNext(i + 1);
  }
};
```

### 8.2 Script Attribute'ları

Bundle script'ine `defer` veya `async` attribute'ı ile birlikte `crossorigin` ekle:

```javascript
var s = document.createElement("script");
s.src = urls[i];
s.async = true;
s.crossOrigin = "anonymous"; // CORS destekli CDN'ler için
```

### 8.3 Liquid Template Metafield Kontrolü

Metafield'lar yoksa configurator'ı hiç yükleme:

```liquid
{% if product.metafields['$app'].pcon_article_number.value != blank %}
  <div id="pcon-root" ...>
    <!-- Configurator -->
  </div>
{% endif %}
```

Bu, pCon konfigürasyonu olmayan ürün sayfalarında gereksiz JS yüklenmesini engeller.

**Agent talimatı:**
```
1. Shopify MCP → learn_shopify_api(api: "liquid") çağır, conversationId al.
2. configrator_process.md dosyasını oku.
3. configurator.js (bootloader) ve configurator.liquid dosyalarını oku.
4. 100ms timeout'u kaldır.
5. Metafield kontrolü ekle.
6. validate_theme_codeblocks ile Liquid değişikliklerini doğrula.
7. Build ve test et.
```

---

## Faz 9 — Son Doğrulama ve Performans Testi

**Süre tahmini:** 1-2 saat
**Risk:** Düşük
**Öncelik:** Zorunlu (son faz)

### 9.1 Performans Karşılaştırması

Faz 0'da alınan ölçümlerle karşılaştır:

| Metrik | Öncesi | Sonrası | Hedef |
|--------|--------|---------|-------|
| Bundle boyutu (gzip) | ? KB | ? KB | <500 KB |
| Init süresi (cache hit) | ~10ms | ? ms | <200 ms |
| Init süresi (cache miss) | ? ms | ? ms | <5s |
| Update süresi (cache hit) | ? ms | ? ms | <100 ms |
| Update süresi (cache miss) | ~650ms+ | ? ms | <700 ms |
| GLTF yükleme süresi | ? s | ? s | <3s |
| İlk anlamlı render (FMP) | ~500ms (cache hit) | ? s | <2s |

> **Not (Canlı Test Referansı):** Init süresi Redis cache HIT durumunda ~10ms, çok hızlı.
> Update süresi cache MISS durumunda ~650ms+ ölçüldü (session affinity ve
> changedProperty optimizasyonları uygulandıktan sonra ~200-300ms hedefleniyor).

### 9.2 Load Test

Concurrent kullanıcı simülasyonu:
```bash
# 10 eşzamanlı kullanıcı, 30 saniye
npx autocannon -c 10 -d 30 "https://STORE.myshopify.com/apps/pcon-configurator/api/pcon/init?articleNumber=P12.01.101&manufacturerId=NRUS"
```

### 9.3 Cache Warming Doğrulaması

```bash
# Warming çalıştır
npm run warm-cache -- --verbose

# Redis'te cache key'lerini doğrula
redis-cli KEYS "pcon:*" | wc -l

# Init ve update isteklerinin cache hit verdiğini doğrula
curl -s "https://APP_URL/apps/pcon-configurator/api/pcon/init?articleNumber=P12.01.101&manufacturerId=NRUS" -I
# X-Cache-Status: HIT olmalı
```

### 9.4 `configrator_process.md` Güncelleme

Tüm fazlar tamamlandıktan sonra `configrator_process.md` dokümanını güncel mimariyi yansıtacak şekilde güncelle.

**Agent talimatı:**
```
1. Shopify MCP → learn_shopify_api(api: "admin") çağır, conversationId al.
2. Faz 0'daki referans ölçümleri oku.
3. Yeni ölçümleri al ve karşılaştır.
4. Cache warming'i çalıştır ve doğrula.
5. configrator_process.md dokümanını güncel mimariyi yansıtacak şekilde güncelle.
```

---

## Faz Özet Tablosu

| Faz | Açıklama | Süre | Öncelik | Bağımlılık |
|-----|----------|------|---------|------------|
| **0** | Hazırlık ve temel altyapı | 1-2 saat | Zorunlu | — |
| **1** | PconClient concurrency düzeltmesi | 3-4 saat | Kritik | Faz 0 |
| **2** | Cache warming sistemi yenileme | 4-5 saat | Çok yüksek | Faz 1 |
| **3** | Backend API performans optimizasyonu | 2-3 saat | Yüksek | Faz 1 |
| **4** | Frontend bundle ve yükleme optimizasyonu | 4-5 saat | Yüksek | Faz 0 |
| **5** | Frontend request yönetimi ve UX | 2-3 saat | Yüksek | Faz 4 |
| **6** | Three.js memory yönetimi ve 3D performans | 2-3 saat | Orta-Yüksek | Faz 4 |
| **7** | Altyapı sağlamlaştırma ve monitoring | 2-3 saat | Orta | Faz 1, 2 |
| **8** | Bootloader ve Liquid template optimizasyonu | 1-2 saat | Orta | Faz 4 |
| **9** | Son doğrulama ve performans testi | 1-2 saat | Zorunlu | Tüm fazlar |

**Toplam tahmini süre:** 22-32 saat

---

## Bağımlılık Grafiği

```
Faz 0 (Hazırlık)
  ├──→ Faz 1 (Concurrency) ──→ Faz 2 (Cache Warming)
  │                          ├──→ Faz 3 (API Performans)
  │                          └──→ Faz 7 (Altyapı)
  │
  └──→ Faz 4 (Bundle) ──→ Faz 5 (Request Yönetimi)
                       ├──→ Faz 6 (Three.js Memory)
                       └──→ Faz 8 (Bootloader)
                                    │
                                    └──→ Faz 9 (Test & Doğrulama)
```

**Paralel çalışma mümkün:** Faz 1-3 (Backend) ve Faz 4-6,8 (Frontend) birbirinden bağımsız ilerleyebilir.

---

## ⚠️ REVİZYON ÖZETİ — Canlı Test Sonrası Eklenen Düzeltmeler

> Aşağıdaki revizyonlar, tüm fazlar tamamlandıktan sonra yapılan canlı browser testinde
> tespit edilen performans darboğazları ve hatalar sonucunda eklenmiştir.
> Tarih: 2026-04-14

### Yeniden Çalışma Gerektiren Fazlar

| Faz | Revizyon | Açıklama | Öncelik | Beklenen Etki |
|-----|----------|----------|---------|---------------|
| **Faz 1** | REVİZYON 1.5 | Session Affinity — `acquireForItem()` ve `registerItem()` | Kritik | Update'te article re-insert ihtiyacını ortadan kaldırır |
| **Faz 2** | REVİZYON 2.7 | `warm-cache.js` exit code düzeltmesi | Düşük | CI/CD'de doğru hata raporlama |
| **Faz 3** | REVİZYON 3.5 | Sadece değişen property'yi set et — `setSingleProperty()` | **EN KRİTİK** | Update süresi 26x → 1x property set (~2.6s → ~0.1s) |
| **Faz 5** | REVİZYON 5.5 | Debounce 150ms → 0ms | Yüksek | Her tıklamada 150ms tasarruf |
| **Faz 5** | REVİZYON 5.6 | `updatePropertyWithRetry` Promise düzeltmesi | Orta | Retry mekanizması gerçekten çalışır hale gelir |
| **Faz 5** | REVİZYON 5.7 | Frontend'den `changedProperty` bilgisi gönderme | **KRİTİK** | Faz 3 REVİZYON 3.5'in frontend karşılığı |
| **Faz 6** | REVİZYON 6.4 | HDRI dosyasını güvenilir CDN'den yükle (`.hdr` extension assets'e eklenemez!) | Orta | GitHub CDN bağımlılığını kaldırır, güvenilirlik artar |
| **Faz 6** | REVİZYON 6.5 | Three.js tone mapping + environment intensity düzeltmesi | **EN KRİTİK** | Tüm renklerin doğru görünmesi — pCon UI ile eşleşme |
| **Faz 6** | REVİZYON 6.6 | Gatekeeper ID uyumsuzluğu araştırması | Yüksek | GLTF export kalitesi doğrulaması |
| **Faz 6** | REVİZYON 6.7 | Kamera konumlandırma — diagonal (3/4) açı + GLTF embedded camera | **EN KRİTİK** | İç mekanın görünmesi — sadece dış duvar yerine ürün detayları |

### Uygulama Sırası (Önerilen — Güncellenmiş)

```
1. ⭐ Faz 6 (REVİZYON 6.5 + 6.6 + 6.7) → Tone Mapping + Gatekeeper ID + Kamera Açısı — EN ÖNCELİKLİ (görsel doğruluk)
2. Faz 1 (REVİZYON 1.5) → Session Affinity
3. Faz 3 (REVİZYON 3.5) → setSingleProperty + changedProperty backend desteği
4. Faz 5 (REVİZYON 5.5 + 5.6 + 5.7) → Debounce + Retry + changedProperty frontend
5. Faz 6 (REVİZYON 6.4) → HDRI CDN
6. Faz 2 (REVİZYON 2.7) → warm-cache.js exit code
```

> **Kritik not (Güncellendi — Canlı Test 4 Sonrası):**
> REVİZYON 6.5 ve REVİZYON 6.7 birlikte EN ÖNCELİKLİ düzeltmelerdir:
> - **REVİZYON 6.5**: Renklerin doğru görünmesi (tone mapping, environment intensity)
> - **REVİZYON 6.7**: Kamera açısının düzeltilmesi (ürünün iç alanının görünmesi)
>
> Bu ikisi birlikte uygulandığında ürün "pCon UI kalitesinde" görünecektir.
> Şu an kullanıcı sadece ürünün dış duvarlarını görmekte, iç mekanı (masa, döşeme, halı,
> duvar kaplamalar) hiç görememektedir. Bu, ürün konfigüratörünün temel amacını
> anlamsız kılmaktadır — kullanıcı seçtiği döşeme, halı, masa rengini göremiyorsa
> konfigüratörün bir faydası yoktur.
>
> Faz 1 (REVİZYON 1.5) ve Faz 3 (REVİZYON 3.5) birbirine bağımlıdır.
> Session affinity olmadan sadece changedProperty göndermek de iyileşme sağlar ama
> en büyük etki ikisi birlikte uygulandığında elde edilir.
> Faz 5 (REVİZYON 5.7) ise Faz 3 (REVİZYON 3.5)'in frontend karşılığıdır — birlikte uygulanmalıdır.