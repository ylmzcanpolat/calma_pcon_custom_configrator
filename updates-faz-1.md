# Faz 1 — Kritik: PconClient Concurrency Düzeltmesi (Tamamlandı)

**Tarih:** 2026-04-14
**Süre:** ~45 dakika
**Risk:** Yüksek (veri bütünlüğü)
**Durum:** ✅ Tamamlandı

---

## Sorun (Önceki Durum)

`pcon-client.server.js` singleton bir `PconClient` instance'ı kullanıyordu. Tek bir `session` ve tek bir `currentItemId` tutuyordu. Birden fazla kullanıcı aynı anda istek attığında:

1. Kullanıcı A article insert eder → `currentItemId = "aaa"`
2. Kullanıcı B article insert eder → `currentItemId = "bbb"` (A'nınkini ezer)
3. Kullanıcı A'nın update isteği yanlış ürünle çalışır

Bu durum **race condition** ve **veri bütünlüğü** sorunlarına neden oluyordu.

---

## Faz 0 Uyumluluk Kontrolü

Faz 1 değişiklikleri öncesinde, Faz 0'da yapılan tüm işlemlerle uyumluluk kontrol edildi:

| Faz 0 Değişikliği | Durum | Açıklama |
|-------------------|-------|----------|
| `.env` — `PCON_SESSION_POOL_SIZE=3` | ✅ Uyumlu | `PconSessionManager` bu değişkeni doğru okuyor |
| `.env` — `CACHE_WARM_CRON=0 3,15 * * *` | ✅ Dokunulmadı | `cache-scheduler.server.js` bozulmadı |
| `.env` — `GLTF_CACHE_MAX_SIZE_MB=5000` | ✅ Dokunulmadı | İlgili dosyaya müdahale edilmedi |
| `.env` — `CACHE_WARM_CONCURRENCY=2` | ✅ Dokunulmadı | Faz 2'de kullanılacak |
| `cache-scheduler.server.js` cron varsayılanı | ✅ Dokunulmadı | `"0 3,15 * * *"` değeri korunuyor |
| `package.json` — `draco3d` ve `gltf-pipeline` | ✅ Dokunulmadı | Paketler yerinde |
| `BASELINE.md` | ✅ Dokunulmadı | Referans ölçümler korunuyor |
| `configrator_process.md` — env tablosu | ✅ Dokunulmadı | Güncellenen tablo korunuyor |

**Sonuç:** Faz 0 ile herhangi bir çakışma veya uyumsuzluk bulunmadı.

---

## Yapılan Değişiklikler

### 1.1 — PconSessionManager Sınıfı Oluşturuldu

**Yeni dosya:** `app/services/pcon-session-manager.server.js`

Session pool yönetimi için yeni bir sınıf oluşturuldu:

**Özellikler:**

| Özellik | Detay |
|---------|-------|
| Pool boyutu | `PCON_SESSION_POOL_SIZE` env değişkeninden okunur (varsayılan: 3) |
| Session tipi | Her slot bağımsız bir `PconClient` instance'ı tutar |
| Idle timeout | 5 dakika kullanılmayan session'lar otomatik disconnect edilir |
| Cleanup interval | Her 60 saniyede bir idle session'lar temizlenir |
| Bekleme kuyruğu | Pool doluysa istekler 30 sn timeout ile sıraya alınır |
| Health check | `acquire()` sırasında `isConnected()` kontrolü yapılır |

**API:**

```javascript
const manager = getSessionManager();

// Session al
const client = await manager.acquire();
try {
  // client ile pCon işlemleri...
} finally {
  // Session'ı havuza geri bırak
  manager.release(client);
}

// Pool durumu
console.log(manager.stats);
// → { poolSize: 3, active: 2, inUse: 1, idle: 1, waiters: 0 }

// Uygulama kapanırken
await manager.shutdown();
```

**`acquire()` akışı:**

```
1. Pool'da boş (inUse=false) session var mı?
   ├─ EVET → isConnected() kontrolü
   │         ├─ Bağlı → session'ı döndür
   │         └─ Kopuk → reconnect dene
   │                    ├─ Başarılı → session'ı döndür
   │                    └─ Başarısız → entry sil, sonraki slot'a geç
   └─ HAYIR → Pool dolu mu?
              ├─ HAYIR → Yeni PconClient oluştur, connect et, pool'a ekle
              └─ EVET → Bekleme kuyruğuna gir (30 sn timeout)
```

**`release(client)` akışı:**

```
1. Bekleyen istek (waiter) var mı?
   ├─ EVET → Waiter'a direkt session'ı ver (pool'a geri dönmez)
   └─ HAYIR → Session'ı idle olarak işaretle (inUse = false)
```

---

### 1.2 — API Route'ları Güncellendi

#### `pcon-proxy.api.pcon.init.jsx`

**Önceki:**
```javascript
import { getPconClient } from "../services/pcon-client.server";
// ...
const pcon = getPconClient();
const data = await pcon.getArticleData(articleNumber, manufacturerId);
// ...
warmCacheInBackground(articleNumber, manufacturerId, data.properties, data.itemId);
```

**Sonrası:**
```javascript
import { getSessionManager } from "../services/pcon-session-manager.server";
// ...
const manager = getSessionManager();
let client;
try {
  client = await manager.acquire();
  const data = await client.getArticleData(articleNumber, manufacturerId);
  // ...
  warmCacheInBackground(articleNumber, manufacturerId, data.properties);
} catch (err) {
  // hata yönetimi
} finally {
  if (client) manager.release(client);
}
```

**Değişiklikler:**
- `getPconClient()` → `getSessionManager().acquire()` / `release()`
- `try/finally` bloğu ile session her zaman serbest bırakılıyor
- `warmCacheInBackground` artık `itemId` parametresi almıyor (kendi session'ını oluşturuyor)

#### `pcon-proxy.api.pcon.update.jsx`

**Önceki:**
```javascript
import { getPconClient } from "../services/pcon-client.server";
// ...
const pcon = getPconClient();
data = await pcon.setPropertyValue(itemId, propertyList);
```

**Sonrası:**
```javascript
import { getSessionManager } from "../services/pcon-session-manager.server";
// ...
const manager = getSessionManager();
let client;
try {
  client = await manager.acquire();
  data = await client.setPropertyValue(itemId, propertyList);
  // ...
} catch (err) {
  // hata yönetimi
} finally {
  if (client) manager.release(client);
}
```

**Değişiklikler:**
- `getPconClient()` → `getSessionManager().acquire()` / `release()`
- `try/finally` bloğu ile session her zaman serbest bırakılıyor
- Stale itemId retry mekanizması aynı acquire edilmiş `client` üzerinden çalışıyor

---

### 1.3 — PconClient'tan `currentItemId` Kaldırıldı

**Dosya:** `app/services/pcon-client.server.js`

**Kaldırılan state:**
```javascript
// ÖNCEKİ:
constructor() {
  this.session = null;
  this.currentItemId = null;  // ← KALDIRILDI
  this.connectPromise = null;
}
```

**Güncellenen constructor:**
```javascript
// SONRASI:
constructor() {
  this.session = null;
  this.connectPromise = null;
}
```

**Güncellenen metodlar:**

| Metod | Önceki | Sonrası |
|-------|--------|---------|
| `getArticleData()` | `this.currentItemId = itemId;` satırı vardı | Satır kaldırıldı, `itemId` sadece return objesinde döner |
| `setPropertyValue(itemId, props)` | `const targetItemId = itemId \|\| this.currentItemId;` | `if (!itemId) throw new Error(...)` — itemId zorunlu |
| `exportGltf(itemId)` | `const targetItemId = itemId \|\| this.currentItemId;` | `if (!itemId) throw new Error(...)` — itemId zorunlu |
| `disconnect()` | `this.currentItemId = null;` | Satır kaldırıldı |

**Eklenen metod:**

```javascript
isConnected() {
  return !!this.session?.isValid;
}
```

Bu metod `PconSessionManager` tarafından health check amacıyla kullanılır.

**Export değişikliği:**

| Önceki | Sonrası |
|--------|---------|
| `class PconClient { ... }` (default) | `export class PconClient { ... }` (named + default) |
| `export function getPconClient() { ... }` (singleton) | Kaldırıldı |
| `let instance = null;` | Kaldırıldı |

---

### 1.4 — Singleton Kaldırıldı, Cache Warmer Güncellendi

**Dosya:** `app/services/cache-warmer.server.js`

**Önceki yaklaşım:**
- `getPconClient()` singleton üzerinden `setPropertyValue` çağrılıyordu
- `itemId` init route'undan parametre olarak alınıyordu
- Bu `itemId` singleton session'a aitti; farklı session'da geçersiz olabilirdi

**Yeni yaklaşım:**
- Bağımsız `PconClient` instance'ı oluşturuluyor (pool'dan alınmıyor)
- Article kendisi insert ediliyor, kendi `itemId`'sini alıyor
- İş bitince `disconnect()` ile temizleniyor
- Pool session'larını meşgul etmiyor

**Fonksiyon imzası değişikliği:**

```javascript
// ÖNCEKİ:
warmCacheInBackground(articleNumber, manufacturerId, properties, itemId)

// SONRASI:
warmCacheInBackground(articleNumber, manufacturerId, properties)
```

`itemId` parametresi kaldırıldı çünkü artık warming fonksiyonu kendi session'ını ve kendi `itemId`'sini oluşturuyor.

**Yeni akış:**

```
1. Yeni PconClient oluştur
2. Bağımsız Gatekeeper session aç (connect)
3. Article'ı insert et → kendi itemId'sini al
4. Her editable property × option kombinasyonu için:
   a. Redis cache kontrol et (varsa atla)
   b. setPropertyValue çağır (kendi session, kendi itemId)
   c. Sonucu Redis + disk cache'e yaz
5. Session'ı disconnect et
```

**Cache kaydına `originalGltfUrl` eklendi:**

```javascript
// ÖNCEKİ:
await cacheSet(cacheKey, {
  price: data.price,
  gltfUrl: localGltfUrl,
  validOptions: data.validOptions,
  currency: data.currency,
});

// SONRASI:
await cacheSet(cacheKey, {
  price: data.price,
  gltfUrl: localGltfUrl,
  originalGltfUrl: data.gltfUrl,  // ← pCon CDN URL'si eklendi
  validOptions: data.validOptions,
  currency: data.currency,
});
```

---

### 1.5 — REVİZYON: Session Affinity Mekanizması Eklendi

**Tarih:** 2026-04-14 (Canlı test sonrası revizyon)

**Tespit:** Canlı testte her update isteğinde pool'dan rastgele bir session alınıyordu. Bu session'da kullanıcının mevcut article'ı ve property state'i olmadığı için backend TÜM property'leri sıfırdan set etmek zorunda kalıyordu (26 adet sıralı `setPropertyValue` çağrısı).

**Çözüm:** `PconSessionManager`'a item-based session mapping eklendi. Bir `itemId` ile init yapılan session hatırlanıyor, update geldiğinde aynı session tercih ediliyor.

**Eklenen yapılar (`pcon-session-manager.server.js`):**

| Yapı | Açıklama |
|------|----------|
| `_itemSessionMap` (Map) | `itemId → pool entry` eşlemesi tutar |
| `acquireForItem(itemId)` | Önce eşleme tablosunda bu itemId'nin session'ını arar; bulamazsa veya session meşgulse/kopuksa normal `acquire()` fallback yapar |
| `registerItem(itemId, client)` | Bir itemId'yi belirli bir client/session ile eşleştirir |

**`acquireForItem(itemId)` akışı:**

```
1. itemId var mı ve _itemSessionMap'te kayıtlı mı?
   ├─ EVET → Entry hâlâ pool'da mı?
   │         ├─ EVET → inUse=false ve isConnected() mi?
   │         │         ├─ EVET → Bu session'ı döndür (affinity hit)
   │         │         └─ HAYIR → Mapping'i sil, normal acquire()'a git
   │         └─ HAYIR → Mapping'i sil, normal acquire()'a git
   └─ HAYIR → Normal acquire()'a git
```

**Route değişiklikleri:**

**Init route (`pcon-proxy.api.pcon.init.jsx`):**
```javascript
client = await manager.acquire();
const data = await client.getArticleData(articleNumber, manufacturerId);
manager.registerItem(data.itemId, client);  // ← YENİ: itemId-session eşlemesi
```

**Update route (`pcon-proxy.api.pcon.update.jsx`):**
```javascript
// ÖNCEKİ:
client = await manager.acquire();

// SONRASI:
client = await manager.acquireForItem(itemId);  // ← Affinity ile session seçimi

// Stale itemId fallback'inde yeni mapping:
activeItemId = await client.insertArticle(articleNumber, manufacturerId || "");
manager.registerItem(activeItemId, client);  // ← Re-insert sonrası yeni mapping
```

**Temizlik mekanizması:**

- `_removeEntry(entry)`: Entry silinirken ilgili tüm item mapping'leri de temizlenir
- `_cleanupIdle()`: Idle session evict edilirken ilgili item mapping'leri de temizlenir
- `shutdown()`: `_itemSessionMap.clear()` ile tüm mapping'ler temizlenir

**`stats` getter güncellemesi:**
```javascript
// ÖNCEKİ:
{ poolSize, active, inUse, idle, waiters }

// SONRASI:
{ poolSize, active, inUse, idle, waiters, itemMappings }
```

**Beklenen etki:**
- Aynı kullanıcı aynı ürünle çalışırken, session zaten doğru article ve property state'ine sahip olacak
- Backend sadece değişen property'leri set edecek (26 yerine ilgili property'ler)
- Session affinity + `setSingleProperty` (Faz 3 REVİZYON 3.5) birlikte: ~50ms vs ~1.3-2.6s

---

## Dokunulmayan Dosyalar

Bu dosyalar Faz 1 kapsamında değiştirilmedi:

| Dosya | Neden |
|-------|-------|
| `article-warmer.server.js` | Zaten bağımsız Gatekeeper session kullanıyor |
| `cache-scheduler.server.js` | `warmArticle()` üzerinden `article-warmer` kullanıyor, pool'a bağımlılığı yok |
| `scripts/warm-cache.js` | `warmArticle()` üzerinden çalışıyor, değişiklik gerektirmiyor |
| `redis-client.server.js` | Cache yardımcı fonksiyonları değişmedi |
| `gltf-cache.server.js` | Disk cache mantığı değişmedi |
| `entry.server.jsx` | Cache scheduler başlatma mekanizması değişmedi |

---

## Race Condition Çözümü — Öncesi / Sonrası

### Öncesi (Singleton):

```
Kullanıcı A ──→ getPconClient() ──→ AYNI instance
                                         │
Kullanıcı B ──→ getPconClient() ──→ AYNI instance
                                         │
                                    this.currentItemId = ???
                                    (son yazan kazanır)
```

### Sonrası (Session Pool):

```
Kullanıcı A ──→ acquire() ──→ PconClient #1 (bağımsız session)
                                    │
                                    └─ kendi itemId'si

Kullanıcı B ──→ acquire() ──→ PconClient #2 (bağımsız session)
                                    │
                                    └─ kendi itemId'si

Kullanıcı C ──→ acquire() ──→ PconClient #3 (bağımsız session)
                                    │
                                    └─ kendi itemId'si

Kullanıcı D ──→ acquire() ──→ [bekleme kuyruğu] → ilk release olan session
```

---

## Build Doğrulaması

### İlk Build (1.1–1.4)

```
vite v6.4.2 building for production...
✓ 623 modules transformed.
extensions/pcon-3d-configurator/assets/configurator-app.js  1,145.65 kB │ gzip: 322.62 kB
✓ built in 2.14s

vite v6.4.2 building SSR bundle for production...
✓ 28 modules transformed.
build/server/index.js  69.95 kB
✓ built in 75ms
```

### Revizyon Build (1.5 — Session Affinity)

```
vite v6.4.2 building for production...
✓ 357 modules transformed.
extensions/pcon-3d-configurator/assets/configurator-app.js  1,154.11 kB │ gzip: 325.91 kB
✓ built in 1.80s

vite v6.4.2 building SSR bundle for production...
✓ 31 modules transformed.
build/server/index.js  86.69 kB
✓ built in 86ms
```

**Sonuç:** ✅ Tüm build'ler başarılı. Lint hatası yok.

---

## Oluşturulan / Değiştirilen Dosyalar Özeti

| Dosya | İşlem | Detay |
|-------|-------|-------|
| `app/services/pcon-session-manager.server.js` | ✨ Yeni + ✏️ Revize | Session pool + session affinity (`acquireForItem`, `registerItem`, `_itemSessionMap`) |
| `app/services/pcon-client.server.js` | ✏️ Değiştirildi | `currentItemId` kaldırıldı, `isConnected()` eklendi, singleton kaldırıldı |
| `app/routes/pcon-proxy.api.pcon.init.jsx` | ✏️ Değiştirildi | acquire/release pattern + `registerItem()` çağrısı |
| `app/routes/pcon-proxy.api.pcon.update.jsx` | ✏️ Değiştirildi | `acquireForItem(itemId)` + stale fallback'te `registerItem()` |
| `app/services/cache-warmer.server.js` | ✏️ Değiştirildi | Bağımsız PconClient kullanımına geçirildi |

---

## Sonraki Adım: Faz 2

**Faz 2 — Cache Warming Sistemi Yenileme** hazır. Bu fazda:
- Shopify GraphQL sorgusu iyileştirilecek (`manufacturerId` metafield eklenmesi)
- Full kombinasyon warming stratejisi (Katman 1 / 2 / 3)
- `article-warmer.server.js` paralel warming desteği
- Cron zamanlaması günde 2 kere (zaten Faz 0'da hazırlandı)
- Manuel CLI warming komutu iyileştirilecek
- Tahmini süre: 4-5 saat
