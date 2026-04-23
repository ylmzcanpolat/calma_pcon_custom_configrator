# Faz 0 — Performans Referans Ölçümleri (Baseline)

**Tarih:** 2026-04-14
**Ölçüm ortamı:** macOS Development

---

## Bundle Boyutu

| Dosya | Boyut |
|-------|-------|
| `extensions/pcon-3d-configurator/assets/configurator-app.js` | 1,145,653 bytes (~1.1 MB) |

## GLTF Disk Cache

| Metrik | Değer |
|--------|-------|
| Toplam dosya sayısı | 155 |
| Toplam boyut | ~7.3 GB |
| Ortalama dosya boyutu | ~48 MB |
| Min dosya boyutu | ~46 MB |
| Max dosya boyutu | ~59 MB |

## Redis Cache

| Metrik | Değer |
|--------|-------|
| Toplam key sayısı | Ölçülemedi (redis-cli erişilemiyor) |
| Init key sayısı | — |
| Update key sayısı | — |

> Redis ölçümleri, sunucu çalışır durumdayken `redis-cli DBSIZE` ve `redis-cli KEYS "pcon:*" | wc -l` komutlarıyla alınmalıdır.

## pCon API Response Süreleri

| İşlem | Süre |
|-------|------|
| Init (cache miss) | Ölçülecek (runtime'da) |
| Init (cache hit) | Ölçülecek (runtime'da) |
| Update (cache miss) | Ölçülecek (runtime'da) |
| Update (cache hit) | Ölçülecek (runtime'da) |

> API süreleri, uygulama çalışırken X-Response-Time header'ı eklendikten sonra (Faz 3) ölçülecektir.

---

## Hedefler (Faz 9 ile karşılaştırma)

| Metrik | Öncesi | Hedef |
|--------|--------|-------|
| Bundle boyutu (gzip) | ~1.1 MB | <500 KB |
| Init süresi (cache hit) | ? ms | <200 ms |
| Init süresi (cache miss) | ? ms | <5s |
| Update süresi (cache hit) | ? ms | <100 ms |
| Update süresi (cache miss) | ? ms | <4s |
| GLTF yükleme süresi | ? s | <3s |
| İlk anlamlı render (FMP) | ? s | <2s |
