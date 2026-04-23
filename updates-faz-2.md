# Faz 2 — Cache Warming Sistemi Yenileme (Tamamlandı)

**Tarih:** 2026-04-14
**Durum:** Tamamlandı
**Build:** Başarılı (0 hata)

---

## 2.1 — `product-fetcher.server.js` (GraphQL Sorgusu İyileştirmesi)

**Dosya:** `app/services/product-fetcher.server.js`

**Yapılan değişiklikler:**

- Products sorgusuna `query` filtresi eklendi:
  ```graphql
  products(first: 50, after: $cursor, query: "metafields.namespace:'$app' AND metafields.key:'pcon_article_number'")
  ```
  Artık sadece `pcon_article_number` metafield'ına sahip ürünler çekiliyor. Gereksiz pagination ortadan kalktı.
- `handle` alanı sorguya ve dönen article objesine eklendi.
- `manufacturerId` metafield'ı zaten okunuyordu — korundu.

**Öncesi:**
```graphql
products(first: 50, after: $cursor) {
  edges {
    node {
      id
      title
      articleNumber: metafield(...) { value }
      manufacturerId: metafield(...) { value }
    }
  }
}
```

**Sonrası:**
```graphql
products(first: 50, after: $cursor, query: "metafields.namespace:'$app' AND metafields.key:'pcon_article_number'") {
  edges {
    node {
      id
      title
      handle
      articleNumber: metafield(...) { value }
      manufacturerId: metafield(...) { value }
    }
  }
}
```

---

## 2.2 + 2.3 — `article-warmer.server.js` (Tam Yeniden Yazım)

**Dosya:** `app/services/article-warmer.server.js`

**Yapılan değişiklikler:**

### Katmanlı Warming Stratejisi

- **Katman 1** — Varsayılan konfigürasyon (init data) cache'leme. Her article'ın default değerleri ile init verisini Redis'e yazıyor.
- **Katman 2** — Tek property değişimi kombinasyonları. Her editable property'nin her available seçeneği için tek değişiklik (N kombinasyon).
- **Katman 3** — İlk 3 editable property'nin ikili çapraz kombinasyonları. Örnek: Renk × Boyut = 8×4 = 32 ekstra kombinasyon.

### Paralel Concurrency

`CACHE_WARM_CONCURRENCY` env değişkeni (varsayılan: 2) ile kontrol edilen worker pool sistemi. Birden fazla kombinasyon aynı anda warm ediliyor.

### Retry Mekanizması

Başarısız kombinasyonlar `MAX_RETRIES=1` kez daha deneniyor. Retry arası 1 saniye bekleme süresi var.

### Progress Callback

Her adımda `onProgress({ phase, current, total, detail })` formatında callback çağrılıyor. CLI ve scheduler bu callback'i kullanarak progress logluyor.

### Warming Metadata

Her article için Redis'e `pcon:warm:status:<articleNumber>` key'ine sonuç istatistikleri kaydediliyor (7 gün TTL):

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

### Dry-Run Desteği

`dryRun: true` parametresi ile gerçek warming yapmadan ne yapılacağını hesaplayabilme.

### `originalGltfUrl` Tutarlılığı

Tüm cache kayıtlarında (Layer 1 init + Layer 2/3 combinations) pCon CDN URL'si `originalGltfUrl` alanında saklanıyor. Frontend bu URL'yi doğrudan kullanarak tarayıcıdan pCon CDN'e direkt bağlanabiliyor.

### `warmArticle()` Yeni API

```javascript
await warmArticle({
  articleNumber: "P12.01.101",
  manufacturerId: "NRUS",
  layers: [1, 2],       // Hangi katmanlar çalışacak (varsayılan: [1, 2])
  dryRun: false,         // Sadece planı göster
  onProgress: (info) => {} // Progress callback
});
```

---

## 2.4 — `cache-scheduler.server.js` (Scheduler Güncelleme)

**Dosya:** `app/services/cache-scheduler.server.js`

**Yapılan değişiklikler:**

- Cron ifadesi `0 3,15 * * *` (günde 2 kere: 03:00 ve 15:00) — zaten mevcuttu, korundu.
- `runWarmingCycle()` fonksiyonuna yeni parametreler eklendi:
  - `layers` — Hangi warming katmanlarının çalışacağı
  - `dryRun` — Dry-run modu
  - `verbose` — Detaylı loglama
  - `onProgress` — Progress callback
- Warming cycle sonucu Redis'e `pcon:warm:last-cycle` key'i olarak kaydediliyor (7 gün TTL).
- Verbose modda ürün listesi numaralanarak loglanıyor.
- `totalFailed` istatistiği eklendi.

---

## 2.5 — `scripts/warm-cache.js` (CLI Warming Komutu)

**Dosya:** `scripts/warm-cache.js`

**Yapılan değişiklikler:**

Tamamen yeniden yazıldı. Yeni CLI flagleri:

```bash
# Tüm pCon ürünlerini warm et (Layer 1+2)
npm run warm-cache

# Belirli bir article'ı warm et
npm run warm-cache -- --article P12.01.101 --manufacturer NRUS

# Sadece Katman 1 + 2 (hızlı)
npm run warm-cache -- --layers 1,2

# Full kombinasyon (Katman 1 + 2 + 3)
npm run warm-cache -- --layers 1,2,3

# Dry-run (ne yapılacağını göster, çalıştırma)
npm run warm-cache -- --dry-run

# Detaylı progress ile
npm run warm-cache -- --verbose
```

**Çıktı formatı:**
```
[warm-cache] Fetching pCon products from Shopify...
[warm-cache] Found 3 products with pCon metafields:
  1. Calma Desk (P12.01.101 / NRUS)
  2. Nova Chair (P15.02.201 / NRUS)
  3. Forma Table (P18.03.301 / NRUS)
[warm-cache] Layers: 1, 2

[warm-cache] [1/3] Warming: Calma Desk (P12.01.101)
[warm-cache]   ✓ Calma Desk done (2m 24s)

[warm-cache] Summary:
  Products: 3
  Total warmed: 128
  Total skipped: 12
  Total failed: 0
  Total time: 8m 32s
```

---

## 2.6 — `originalGltfUrl` Tutarlılığı

**Etkilenen dosyalar:** Tüm cache yazan dosyalar

| Dosya | `originalGltfUrl` Durumu |
|-------|--------------------------|
| `article-warmer.server.js` (Layer 1 init) | ✅ Eklendi |
| `article-warmer.server.js` (Layer 2/3 combos) | ✅ Eklendi |
| `cache-warmer.server.js` (background warming) | ✅ Zaten vardı, korundu |
| `pcon-proxy.api.pcon.init.jsx` | ✅ Zaten vardı, korundu |
| `pcon-proxy.api.pcon.update.jsx` | ✅ Zaten vardı, korundu |

---

## 2.7 — `cache-warmer.server.js` (Session Manager Uyumu)

**Dosya:** `app/services/cache-warmer.server.js`

**Yapılan değişiklikler:**

- Eski pattern (`new PconClient()` + `client.connect()` / `client.disconnect()`) kaldırıldı.
- Yeni pattern'a geçildi: `getSessionManager().acquire()` / `manager.release(client)`.
- Cache key'lere `manufacturerId` eklendi (farklı manufacturer'lar için aynı article number'a sahip ürünlerin cache collision'ı engellendi).

**Öncesi:**
```javascript
import { PconClient } from "./pcon-client.server.js";
// ...
const client = new PconClient();
await client.connect();
// ...
await client.disconnect();
```

**Sonrası:**
```javascript
import { getSessionManager } from "./pcon-session-manager.server.js";
// ...
const manager = getSessionManager();
let client = await manager.acquire();
// ...
manager.release(client);
```

---

## Ek — `pcon-proxy.api.pcon.update.jsx` (Update Route)

**Dosya:** `app/routes/pcon-proxy.api.pcon.update.jsx`

**Yapılan değişiklikler:**

- Request body'den `manufacturerId` parse ediliyor.
- Cache key'e `manufacturerId` eklendi:

**Öncesi:**
```javascript
const { properties, itemId, articleNumber } = body;
const cacheKey = generateCacheKey("update", {
  articleNumber: articleNumber || "",
  ...properties,
});
```

**Sonrası:**
```javascript
const { properties, itemId, articleNumber, manufacturerId } = body;
const cacheKey = generateCacheKey("update", {
  articleNumber: articleNumber || "",
  manufacturerId: manufacturerId || "",
  ...properties,
});
```

---

## Değiştirilen Dosyalar Özeti

| Dosya | İşlem |
|-------|-------|
| `app/services/product-fetcher.server.js` | GraphQL filter + handle eklendi |
| `app/services/article-warmer.server.js` | Tam yeniden yazıldı (katmanlı warming) |
| `app/services/cache-scheduler.server.js` | Yeniden yazıldı (parametreli, metadata) |
| `app/services/cache-warmer.server.js` | Session manager'a geçirildi |
| `app/routes/pcon-proxy.api.pcon.update.jsx` | manufacturerId cache key'e eklendi |
| `scripts/warm-cache.js` | Yeniden yazıldı (CLI flagler) |
