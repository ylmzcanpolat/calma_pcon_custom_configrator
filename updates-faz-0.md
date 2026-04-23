# Faz 0 — Hazırlık ve Temel Altyapı (Tamamlandı)

**Tarih:** 2026-04-14
**Süre:** ~30 dakika
**Risk:** Düşük
**Durum:** ✅ Tamamlandı

---

## 0.1 Mevcut Durum Snapshot'ı

Tüm referans ölçümler `BASELINE.md` dosyasına kaydedildi.

### Bundle Boyutu

| Dosya | Boyut | Gzip |
|-------|-------|------|
| `extensions/pcon-3d-configurator/assets/configurator-app.js` | 1,145,653 bytes (~1.1 MB) | 322.62 KB |

### GLTF Disk Cache

| Metrik | Değer |
|--------|-------|
| Toplam dosya sayısı | 155 |
| Toplam boyut | ~7.3 GB |
| Ortalama dosya boyutu | ~48 MB |
| Min dosya boyutu | ~46 MB |
| Max dosya boyutu | ~59 MB |
| Konum | `.cache/gltf/` |

### Redis Cache

| Metrik | Değer |
|--------|-------|
| Durum | Ölçülemedi (`redis-cli` bu ortamda erişilebilir değil) |

> Redis ölçümleri, sunucu çalışır durumdayken `redis-cli DBSIZE` ve `redis-cli KEYS "pcon:*" | wc -l` ile alınmalıdır.

### pCon API Response Süreleri

Henüz ölçülmedi. Faz 3'te `X-Response-Time` header'ı eklendikten sonra ölçülecek.

---

## 0.2 Bağımlılık Kontrolü

### Uyumluluk Durumu

| Paket | Mevcut Versiyon | Durum |
|-------|----------------|-------|
| `react` | 18.3.1 | ✅ Sabit (React 19'a geçilmeyecek) |
| `@react-three/fiber` | ^8.18.0 | ✅ Uyumlu (v9 React 19 gerektirir, geçilmeyecek) |
| `@react-three/drei` | ^9.122.0 | ✅ Uyumlu (v10 React 19 gerektirir, geçilmeyecek) |
| `three` | ^0.183.2 | ✅ Güncel |
| `zustand` | ^5.0.12 | ✅ Güncel |

### Güvenli Minor/Patch Güncellemeler (Yapıldı)

| Paket | Eski | Yeni |
|-------|------|------|
| `react-router` | 7.14.0 | 7.14.1 |
| `@react-router/dev` | 7.14.0 | 7.14.1 |
| `@react-router/fs-routes` | 7.14.0 | 7.14.1 |
| `@react-router/node` | 7.14.0 | 7.14.1 |
| `@react-router/serve` | 7.14.0 | 7.14.1 |
| `redis` | 5.11.0 | 5.12.0 |

### Yeni Eklenen Paketler (Faz 4 Hazırlığı)

| Paket | Versiyon | Amaç |
|-------|----------|------|
| `draco3d` | ^1.5.7 | Draco GLTF encoder/decoder (Faz 4/6 için) |
| `gltf-pipeline` | ^4.3.1 | Backend tarafı GLTF compression (Faz 4 için) |

> **Not:** Dokümanda `draco3dgzip` olarak belirtilen paket npm'de mevcut değildi. Doğru paket olan `draco3d` yüklendi.

### Güncellenmeyecek Major Versiyonlar

| Paket | Mevcut | Latest | Neden |
|-------|--------|--------|-------|
| `@react-three/fiber` | 8.18.0 | 9.6.0 | React 19 gerektirir |
| `@react-three/drei` | 9.122.0 | 10.7.7 | React 19 gerektirir |
| `react` / `react-dom` | 18.3.1 | 19.2.5 | Three.js ekosistemi henüz hazır değil |
| `prisma` / `@prisma/client` | 6.19.3 | 7.7.0 | Breaking changes, ayrı migration gerektirir |
| `vite` | 6.4.2 | 8.0.8 | Breaking changes, ayrı değerlendirme gerektirir |
| `eslint` | 8.57.1 | 10.2.0 | Flat config migration gerektirir |
| `typescript` | 5.9.3 | 6.0.2 | Breaking changes riski |

---

## 0.3 `.env` Güncellemesi

### Eklenen Ortam Değişkenleri

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `CACHE_WARM_CRON` | `0 3,15 * * *` | Günde 2 kere warming (03:00 ve 15:00) |
| `PCON_SESSION_POOL_SIZE` | `3` | Paralel pCon Gatekeeper session sayısı |
| `GLTF_CACHE_MAX_SIZE_MB` | `5000` | Disk GLTF cache max boyutu (MB) |
| `CACHE_WARM_CONCURRENCY` | `2` | Warming paralel istek sayısı |

### Güncellenen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `.env` | 4 yeni ortam değişkeni eklendi |
| `app/services/cache-scheduler.server.js` | Varsayılan cron ifadesi `"0 3 * * *"` → `"0 3,15 * * *"` olarak güncellendi |
| `configrator_process.md` | Ortam değişkenleri tablosuna 3 yeni değişken eklendi, `CACHE_WARM_CRON` varsayılanı güncellendi |

---

## Build Doğrulaması

```
vite v6.4.2 building for production...
✓ 623 modules transformed.
extensions/pcon-3d-configurator/assets/configurator-app.js  1,145.65 kB │ gzip: 322.62 kB
✓ built in 1.86s
```

**Sonuç:** ✅ Build başarılı, hata yok.

---

## Oluşturulan / Değiştirilen Dosyalar Özeti

| Dosya | İşlem |
|-------|-------|
| `BASELINE.md` | ✨ Yeni oluşturuldu |
| `package.json` | 📦 `draco3d` ve `gltf-pipeline` eklendi |
| `package-lock.json` | 📦 Otomatik güncellendi (npm install) |
| `.env` | ✏️ 4 yeni ortam değişkeni eklendi |
| `app/services/cache-scheduler.server.js` | ✏️ Varsayılan cron güncellendi |
| `configrator_process.md` | ✏️ Ortam değişkenleri tablosu güncellendi |

---

## Sonraki Adım: Faz 1

**Faz 1 — PconClient Concurrency Düzeltmesi** hazır. Bu fazda:
- `PconSessionManager` sınıfı oluşturulacak (session pool)
- API route'ları acquire/release pattern'ine geçecek
- Singleton `currentItemId` state'i kaldırılacak
- Tahmini süre: 3-4 saat
