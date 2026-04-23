# Faz 3 — Backend API Performans Optimizasyonu

**Tarih:** 2026-04-14
**Durum:** Tamamlandı

---

## 3.1 pCon API Çağrılarını Paralelize Et

### Değişiklik Özeti

`insertArticle` çağrısından sonra sıralı olarak çalışan `getArticleData`, `getAllChoiceLists` ve `getExportedGeometry` çağrıları `Promise.all` ile paralel hale getirildi.

### Önceki Durum (Sıralı)

```
insertArticle → getArticleData → getAllChoiceLists → getExportedGeometry
                 [3s]              [2s]                [4s]
Total: ~9s
```

### Yeni Durum (Paralel)

```
insertArticle → Promise.all([
                   getArticleData,      [3s]
                   getAllChoiceLists,    [2s]  → Toplam: ~4s (en yavaş)
                   getExportedGeometry  [4s]
                 ])
Total: ~4-5s (insert + en yavaş paralel çağrı)
```

### Tahmini İyileşme

Init süresi cache miss durumunda **%40-50 azalır**.

### Değiştirilen Dosyalar

#### `app/services/pcon-client.server.js`

**`getArticleData` metodu (satır ~119-128):**

```javascript
const [articleData, choiceLists, gltfUrl] = await Promise.all([
  session.basket.getArticleData(itemId, {
    fetchCatalogImage: true,
    enableBooleanPropType: true,
  }),
  session.basket.getAllChoiceLists(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
]);
```

**`setPropertyValue` metodu (satır ~172-180):**

Property set işlemi sonrası veri toplama kısmı paralelize edildi:

```javascript
const [articleData, choiceLists, gltfUrl] = await Promise.all([
  session.basket.getArticleData(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getAllChoiceLists(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
]);
```

#### `app/services/article-warmer.server.js`

**Layer 1 warming (init data):**

```javascript
const [articleData, choiceLists, gltfUrl] = await Promise.all([
  session.basket.getArticleData(itemId, {
    fetchCatalogImage: true,
    enableBooleanPropType: true,
  }),
  session.basket.getAllChoiceLists(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
]);
```

**Layer 2/3 veri toplama:**

```javascript
const [articleData, choiceLists] = await Promise.all([
  session.basket.getArticleData(itemId, {
    fetchCatalogImage: true,
    enableBooleanPropType: true,
  }),
  session.basket.getAllChoiceLists(itemId, {
    enableBooleanPropType: true,
  }),
]);
```

**`warmCombinations` fonksiyonu (her kombinasyon sonrası veri toplama):**

```javascript
const [updatedData, updatedChoices, updatedGltf] = await Promise.all([
  session.basket.getArticleData(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getAllChoiceLists(itemId, {
    enableBooleanPropType: true,
  }),
  session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
]);
```

---

## 3.2 Update Route Cache Key'e `manufacturerId` Ekle

### Durum: Zaten Mevcut

Bu değişiklik önceki fazlarda (Faz 2) zaten uygulanmıştı. `pcon-proxy.api.pcon.update.jsx` dosyasında cache key oluşturulurken `manufacturerId` kullanılmaktadır:

```javascript
const cacheKey = generateCacheKey("update", {
  articleNumber: articleNumber || "",
  manufacturerId: manufacturerId || "",
  ...properties,
});
```

Aynı şekilde `article-warmer.server.js` içindeki `buildLayer2Combinations` ve `buildLayer3Combinations` fonksiyonlarında da `manufacturerId` cache key'e dahil edilmektedir. Ek işlem gerekmedi.

---

## 3.3 Response Header Optimizasyonu

### Değişiklik Özeti

Init ve update route'larına cache-friendly ve observability header'ları eklendi.

### Eklenen Header'lar

| Header | Açıklama |
|--------|----------|
| `Cache-Control: private, max-age=300` | Tarayıcı cache'i 5 dakika (CDN cache'lemez) |
| `X-Cache-Status: HIT / MISS` | Redis cache hit/miss durumunu gösterir |
| `X-Response-Time: Xms` | İstek işleme süresini gösterir |

### Değiştirilen Dosyalar

#### `app/routes/pcon-proxy.api.pcon.init.jsx`

Route başında `startTime` kaydı alınmaya başlandı. Hem cache HIT hem MISS durumlarında header'lar eklendi:

```javascript
const startTime = Date.now();
// ...
const headers = {
  "Cache-Control": "private, max-age=300",
  "X-Cache-Status": cached ? "HIT" : "MISS",
  "X-Response-Time": `${Date.now() - startTime}ms`,
};
return Response.json(result, { headers });
```

#### `app/routes/pcon-proxy.api.pcon.update.jsx`

Aynı pattern update route'una da uygulandı:

```javascript
const startTime = Date.now();
// ...
const headers = {
  "Cache-Control": "private, max-age=300",
  "X-Cache-Status": cached ? "HIT" : "MISS",
  "X-Response-Time": `${Date.now() - startTime}ms`,
};
return Response.json(result, { headers });
```

---

## 3.4 Hata Detaylarını Gizle

### Değişiklik Özeti

Production ortamında `err.message` client'a gönderilmeyecek şekilde güncellendi. Sadece development ortamında `detail` alanı dönülür.

### Değiştirilen Dosyalar

#### `app/routes/pcon-proxy.api.pcon.init.jsx`

```javascript
const isDev = process.env.NODE_ENV !== "production";
return Response.json(
  {
    error: "Failed to initialize pCon article",
    ...(isDev && { detail: err.message }),
  },
  { status: 500 },
);
```

#### `app/routes/pcon-proxy.api.pcon.update.jsx`

```javascript
const isDev = process.env.NODE_ENV !== "production";
return Response.json(
  {
    error: "Failed to update pCon configuration",
    ...(isDev && { detail: err.message }),
  },
  { status: 500 },
);
```

---

## ⚠️ REVİZYON 3.5 — Sadece Değişen Property'yi Set Et (EN KRİTİK DARBOĞAZ)

### Problem

Her property değişikliğinde backend TÜM property'leri (örn. 26 adet) sıralı `setPropertyValue` çağrısı ile set ediyordu. Her çağrı ~50-100ms sürdüğünde toplam **1.3-2.6 saniye** sadece property setting'e gidiyordu.

### Çözüm

Frontend'den `changedProperty` bilgisi ayrıca gönderiliyor. Backend, session affinity ile doğru session'a ulaştığında sadece 1 adet `setPropertyValue` çağrısı yapıyor. Stale session durumunda fallback olarak tüm property'ler set ediliyor.

### Önceki Akış

```
Frontend: TÜM 26 property'yi gönder
  ↓
Backend: for döngüsü ile 26 adet sıralı setPropertyValue çağrısı
  ↓
Backend: articleData + choiceLists + gltfUrl (paralel)
  ↓
Toplam: ~1.3-2.6s (property set) + ~0.5s (veri çekme) = ~2-3s
```

### Yeni Akış

```
Frontend: changedProperty + allProperties (cache key için) gönder
  ↓
Backend (session affinity ile aynı session):
  → Sadece 1 adet setPropertyValue çağrısı
  → articleData + choiceLists + gltfUrl (paralel)
  ↓
Toplam: ~50-100ms (1 property set) + ~0.5s (veri çekme) = ~0.6-0.7s
```

### Tahmini İyileşme

Property değişikliği süresi **~2-3 saniyeden ~0.6-0.7 saniyeye** düşecek (**%70+ iyileşme**).

### Değiştirilen Dosyalar

#### `extension-build/src/utils/api.js`

`updateProperties` fonksiyonuna `changedProperty` parametresi eklendi:

```javascript
export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId, options = {}) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties,
      itemId,
      articleNumber,
      manufacturerId,
      changedProperty: options.changedProperty || null,
    }),
    ...options,
  });
}
```

#### `extension-build/src/store/configurator-store.js`

`updateProperty` metodunda `changedProperty: { key, value }` gönderilmeye başlandı:

```javascript
const data = await updateProperties(
  proxyBase, allProps, itemId, articleNumber, manufacturerId,
  { signal: currentAbort.signal, changedProperty: { key, value } },
);
```

`applyUrlProperties` ise `changedProperty` göndermez — bu doğru davranıştır çünkü URL'den restore ederken tüm property'lerin set edilmesi gerekir.

#### `app/services/pcon-client.server.js`

Yeni `setSingleProperty()` metodu eklendi:

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

#### `app/routes/pcon-proxy.api.pcon.update.jsx`

Body'den `changedProperty` extract edilip, varsa `setSingleProperty`, yoksa `setPropertyValue` kullanılıyor:

```javascript
const { properties, itemId, articleNumber, manufacturerId, changedProperty } = body;
// ...
try {
  if (changedProperty) {
    data = await client.setSingleProperty(activeItemId, changedProperty.key, changedProperty.value);
  } else {
    data = await client.setPropertyValue(activeItemId, propertyList);
  }
} catch (err) {
  // Stale itemId fallback: re-insert + tüm property'leri set et (her zaman setPropertyValue)
}
```

#### `extensions/pcon-3d-configurator/assets/configurator-app.js`

Extension bundle `npm run build:extension` ile yeniden derlendi. Yeni boyut: **1,154 KB** (gzip: **326 KB**).

---

## Özet Tablo

| Görev | Dosya | Durum |
|-------|-------|-------|
| 3.1 API Paralelizasyon | `pcon-client.server.js` | ✅ Tamamlandı |
| 3.1 API Paralelizasyon | `article-warmer.server.js` | ✅ Tamamlandı |
| 3.2 Cache Key manufacturerId | `pcon-proxy.api.pcon.update.jsx` | ✅ Zaten mevcuttu |
| 3.3 Response Headers | `pcon-proxy.api.pcon.init.jsx` | ✅ Tamamlandı |
| 3.3 Response Headers | `pcon-proxy.api.pcon.update.jsx` | ✅ Tamamlandı |
| 3.4 Hata Gizleme | `pcon-proxy.api.pcon.init.jsx` | ✅ Tamamlandı |
| 3.4 Hata Gizleme | `pcon-proxy.api.pcon.update.jsx` | ✅ Tamamlandı |
| **REVİZYON 3.5** setSingleProperty | `pcon-client.server.js` | ✅ Tamamlandı |
| **REVİZYON 3.5** changedProperty (frontend) | `api.js` + `configurator-store.js` | ✅ Tamamlandı |
| **REVİZYON 3.5** changedProperty (backend) | `pcon-proxy.api.pcon.update.jsx` | ✅ Tamamlandı |
| **REVİZYON 3.5** Extension rebuild | `configurator-app.js` | ✅ Tamamlandı |
