# Faz 8 — Bootloader ve Liquid Template Optimizasyonu

**Tarih:** 14 Nisan 2026
**Risk:** Düşük
**Öncelik:** Orta

---

## Yapılan Değişiklikler

### 8.1 Bootloader Gereksiz Gecikme Kaldırıldı

**Dosya:** `extensions/pcon-3d-configurator/assets/configurator.js`

Script `onload` callback'indeki gereksiz `setTimeout(..., 100)` sarmalayıcısı kaldırıldı. Bu 100ms'lik gecikme, bundle yüklendikten sonra `__pconConfiguratorInit` çağrısını anlamsız şekilde erteliyordu.

**Önceki:**
```javascript
s.onload = function () {
  setTimeout(function () {
    if (typeof window.__pconConfiguratorInit === "function") {
      try {
        window.__pconConfiguratorInit(root, config);
      } catch (e) {
        showError("Configurator error: " + e.message);
      }
    } else {
      loadNext(i + 1);
    }
  }, 100);
};
```

**Sonrası:**
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

**Etki:** Configurator başlatma süresi ~100ms kısaldı. `onload` event'i zaten script'in tam olarak parse ve execute edildiğini garanti ettiğinden, ek bir gecikmeye ihtiyaç yoktur.

---

### 8.2 Script Attribute'ları Güncellendi

**Dosya:** `extensions/pcon-3d-configurator/assets/configurator.js`

Bundle script elementine `crossOrigin = "anonymous"` attribute'ı eklendi.

**Önceki:**
```javascript
var s = document.createElement("script");
s.src = urls[i];
s.async = true;
```

**Sonrası:**
```javascript
var s = document.createElement("script");
s.src = urls[i];
s.async = true;
s.crossOrigin = "anonymous";
```

**Etki:**
- CORS destekli CDN'lerden yüklenirken daha detaylı hata raporlaması sağlanır (`window.onerror` event'inde stack trace bilgisi alınabilir).
- Subresource Integrity (SRI) desteği için altyapı hazırlanmış olur.
- `s.async = true` zaten mevcuttu, bu da script'in ana thread'i bloklamadan paralel yüklenmesini sağlıyordu.

---

### 8.3 Liquid Template Metafield Kontrolü Eklendi

**Dosya:** `extensions/pcon-3d-configurator/blocks/configurator.liquid`

Tüm configurator HTML bloğu `{% if product.metafields['$app'].pcon_article_number.value != blank %}` koşuluna sarıldı. pCon article number metafield'ı tanımlanmamış ürünlerde configurator DOM'u, preconnect/dns-prefetch linkleri ve skeleton UI hiç render edilmez.

**Önceki:**
```liquid
<link rel="preconnect" href="https://s2.eaiws.pcon-solutions.com" crossorigin>
<link rel="dns-prefetch" href="https://s2.eaiws.pcon-solutions.com">

<div id="pcon-root" ...>
  <!-- skeleton -->
</div>
```

**Sonrası:**
```liquid
{% if product.metafields['$app'].pcon_article_number.value != blank %}
<link rel="preconnect" href="https://s2.eaiws.pcon-solutions.com" crossorigin>
<link rel="dns-prefetch" href="https://s2.eaiws.pcon-solutions.com">

<div id="pcon-root" ...>
  <!-- skeleton -->
</div>
{% endif %}
```

**Etki:**
- pCon konfigürasyonu olmayan ürün sayfalarında gereksiz JS yüklenmesi tamamen engellenir.
- `#pcon-root` elementi oluşturulmadığından bootloader (`configurator.js`) ilk satırda `if (!root) return;` ile çıkar ve hiçbir script yükleme/network isteği yapılmaz.
- Bu sayede konfigüratör dışı ürün sayfalarında sayfa yüklenme performansı iyileşir (preconnect, DNS prefetch, skeleton CSS ve JS bundle isteği sıfırlanır).

---

## Değişen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `extensions/pcon-3d-configurator/assets/configurator.js` | setTimeout(100) kaldırıldı, `crossOrigin` eklendi |
| `extensions/pcon-3d-configurator/blocks/configurator.liquid` | Metafield koşul kontrolü eklendi |

---

## Performans Kazanımları

| Metrik | İyileşme |
|--------|----------|
| Configurator init gecikmesi | -100ms (setTimeout kaldırıldı) |
| Non-pCon ürün sayfaları | JS bundle yüklemesi tamamen engellendi |
| CORS hata raporlaması | crossOrigin ile detaylı stack trace |

---

## Test Kontrol Listesi

- [ ] pCon article number metafield'ı olan bir ürün sayfasında configurator'ın normal yüklendiğini doğrula
- [ ] pCon article number metafield'ı olmayan bir ürün sayfasında `#pcon-root` elementinin DOM'da bulunmadığını doğrula
- [ ] DevTools Network sekmesinde non-pCon ürünlerde `configurator-app.js` isteğinin yapılmadığını kontrol et
- [ ] Configurator başlatma süresinin ~100ms kısaldığını doğrula
- [ ] CDN'den yükleme sırasında `crossorigin="anonymous"` attribute'ının script tag'inde göründüğünü doğrula
- [ ] Hata durumlarında (`onerror`) fallback URL mekanizmasının çalışmaya devam ettiğini doğrula
