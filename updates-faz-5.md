# Faz 5 — Frontend Request Yönetimi ve UX

**Durum:** Tamamlandı  
**Tarih:** 2026-04-14

---

## Özet

Bu fazda kullanıcı hızlıca property'ler arasında geçiş yaptığında oluşan gereksiz API çağrıları engellendi, mevcut istekler iptal edilebilir hale getirildi, model geçişlerinde crossfade animasyonu eklendi, Three.js scene dispose mekanizması entegre edildi ve hata durumlarında otomatik retry mekanizması sağlandı.

Sonradan eklenen 3 revizyon (5.5, 5.6, 5.7) ile debounce değeri optimize edildi, retry mekanizmasının etkisizliği düzeltildi ve `changedProperty` desteği eklendi.

**Bundle boyutu sonuçları:**
- Önceki boyut: **1,145.57 KB** (minified) / **322.99 KB** (gzipped)
- Revizyon sonrası boyut: **1,154.24 KB** (minified) / **325.96 KB** (gzipped)
- Fark: +2.97 KB gzip — changedProperty desteği ve Promise sarmalama eklendi

---

## 5.1 Request Debounce

### Sorun
Kullanıcı hızlıca property'ler arasında geçiş yapınca her tıklamada ayrı bir `/api/pcon/update` isteği gidiyordu. Bu hem sunucu yükünü artırıyordu hem de gereksiz GLTF yüklemelerine neden oluyordu.

### Çözüm
**Dosya:** `extension-build/src/store/configurator-store.js`

AbortController ile birlikte debounce mekanizması eklendi. ~~İlk versiyonda `DEBOUNCE_MS = 150` olarak ayarlandı~~ → REVİZYON 5.5 ile `DEBOUNCE_MS = 0` olarak güncellendi (aşağıya bakınız).

```javascript
const DEBOUNCE_MS = 0; // REVİZYON 5.5: Discrete click'ler için 0ms
let updateTimer = null;
let abortController = null;

async updateProperty(key, value) {
  // 1. Optimistic UI hemen güncellenir
  // 2. Frontend cache kontrolü (anında dönüş)
  // 3. Önceki timer ve isteği iptal et
  if (updateTimer) clearTimeout(updateTimer);
  if (abortController) abortController.abort();

  abortController = new AbortController();
  const currentAbort = abortController;

  // 4. REVİZYON 5.6: Promise döndür (retry'ın çalışması için)
  // 5. REVİZYON 5.7: changedProperty bilgisini gönder
  return new Promise((resolve, reject) => {
    updateTimer = setTimeout(async () => {
      try {
        const data = await updateProperties(
          proxyBase, allProps, itemId, articleNumber, manufacturerId,
          { signal: currentAbort.signal, changedProperty: { key, value } },
        );
        // ... sonucu uygula ...
        resolve(data);
      } catch (err) {
        if (err.name === "AbortError") { resolve(undefined); return; }
        reject(err);
      }
    }, DEBOUNCE_MS);
  });
}
```

**Davranış:**
- Her tıklama: önceki bekleyen istek varsa iptal edilir, yeni istek hemen başlar
- AbortController eski in-flight istekleri iptal eder
- Cache hit durumunda API çağrısı atlanır (anında dönüş)

---

## 5.2 AbortController Entegrasyonu

### Sorun
`pconFetch` fonksiyonu kendi dahili AbortController'ını oluşturuyordu ve dışarıdan signal kabul etmiyordu. Bu, debounce sırasında eski isteklerin iptal edilmesini engelliyordu.

### Çözüm
**Dosya:** `extension-build/src/utils/api.js`

`pconFetch` fonksiyonu dışarıdan gelen `signal` parametresini destekleyecek şekilde güncellendi:

```javascript
export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  // Dış signal varsa kendi controller oluşturma
  const controller = options.signal ? null : new AbortController();
  const signal = options.signal || controller?.signal;
  const timeout = setTimeout(
    () => controller?.abort(),
    options.timeout || DEFAULT_TIMEOUT,
  );
  // ...
}
```

`updateProperties` fonksiyonu da options parametresini kabul edecek şekilde güncellendi. REVİZYON 5.7 ile `changedProperty` body'ye ekleniyor, fetch options'a sızmıyor:

```javascript
export function updateProperties(
  proxyBase, properties, itemId, articleNumber, manufacturerId, options = {}
) {
  const { changedProperty, ...fetchOptions } = options;
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties, itemId, articleNumber, manufacturerId,
      changedProperty: changedProperty || null,
    }),
    ...fetchOptions,
  });
}
```

**Davranış:**
- Dış signal verilirse → timeout controller oluşturulmaz, dış signal kullanılır
- Dış signal verilmezse → mevcut davranış korunur (dahili timeout controller)
- `changedProperty` body'ye dahil edilir, backend tek property set eder (Faz 3 REVİZYON 3.5 ile uyumlu)

---

## 5.3 Optimistic UI İyileştirmesi

### 5.3.1 Crossfade Model Geçişi

**Dosya:** `extension-build/src/components/Model.jsx`

Yeni model yüklendiğinde sert bir geçiş yerine smooth crossfade animasyonu eklendi:

```javascript
const FADE_SPEED = 4;

// useFrame ile her karede opacity lerp edilir
useFrame((_, delta) => {
  if (!groupRef.current || !visible) return;
  opacityRef.current = MathUtils.lerp(opacityRef.current, 1, delta * FADE_SPEED);
  if (opacityRef.current > 0.99) opacityRef.current = 1;

  groupRef.current.traverse((child) => {
    if (child.isMesh && child.material) {
      mat.transparent = true;
      mat.opacity = opacityRef.current;
    }
  });
});
```

**Davranış:**
1. Yeni model yüklenince opacity 0'dan başlar
2. `MathUtils.lerp` ile smooth interpolasyon yapılır
3. ~250ms içinde tam opak olur

### 5.3.2 Scene Dispose (Memory Cleanup)

**Dosya:** `extension-build/src/components/Model.jsx`

Eski scene değiştiğinde tüm geometry, material ve texture'lar dispose edilir:

```javascript
function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) value.dispose();
  }
  material.dispose();
}

function disposeScene(scene) {
  if (!scene) return;
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => disposeMaterial(m));
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}
```

Bu cleanup, `useEffect` return fonksiyonunda çağrılır ve scene değiştiğinde otomatik tetiklenir.

### 5.3.3 Subtle Loading Overlay

**Dosya:** `extension-build/src/components/ConfiguratorScene.jsx`

Property güncellenirken tam ekran beyaz overlay yerine sadece üstte ince bir animasyonlu progress bar gösterilir:

```jsx
{updating && (
  <div className="pcon-updating pcon-updating--subtle">
    <div className="pcon-updating__bar" />
  </div>
)}
```

**Dosya:** `extensions/pcon-3d-configurator/assets/configurator.css`

Yeni CSS sınıfları eklendi:

```css
.pcon-updating--subtle {
  background: transparent;
  align-items: flex-start;
  justify-content: stretch;
  pointer-events: none;
}

.pcon-updating__bar {
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #333, transparent);
  background-size: 200% 100%;
  animation: pcon-bar-slide 1.2s ease-in-out infinite;
}

@keyframes pcon-bar-slide {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**Davranış:**
- 3D model görüntüsü bulanıklaşmaz, mevcut model gösterilmeye devam eder
- Üstte ince bir sliding progress bar belirir
- `pointer-events: none` sayesinde kullanıcı 3D görüntüyü döndürebilmeye devam eder

---

## 5.4 Hata Durumunda Retry Mekanizması

### Sorun
Geçici ağ hataları veya sunucu 5xx cevapları durumunda kullanıcı tek hata mesajı görüyordu ve manuel tekrar denemek zorundaydı.

### Çözüm
**Dosya:** `extension-build/src/store/configurator-store.js`

`updatePropertyWithRetry` fonksiyonu eklendi:

```javascript
async updatePropertyWithRetry(key, value, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await get().updateProperty(key, value);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

**Dosya:** `extension-build/src/components/PropertySelector.jsx`

PropertySelector artık `updateProperty` yerine `updatePropertyWithRetry` kullanır:

```javascript
const updatePropertyWithRetry = useConfiguratorStore((s) => s.updatePropertyWithRetry);
// ...
onSelect={(value) => updatePropertyWithRetry(prop.id, value)}
```

**Davranış:**
- 1. deneme başarısız → 1 saniye bekle → 2. deneme
- 2. deneme başarısız → 2 saniye bekle → 3. deneme
- 3. deneme başarısız → hatayı UI'a göster
- Exponential backoff: bekleme süresi her denemede artar

---

---

## REVİZYON 5.5 — Debounce Değerini Kaldır

**Tespit:** `DEBOUNCE_MS = 150` her property tıklamasına 150ms gereksiz gecikme ekliyordu. Property selector butonları discrete click — kullanıcı butona tıkladığında yeni bir tıklama beklenmesi anlamsız.

**Değişiklik:** `extension-build/src/store/configurator-store.js`

```javascript
// Önceki:
const DEBOUNCE_MS = 150;

// Yeni:
const DEBOUNCE_MS = 0;
```

**Etki:** Kullanıcının algıladığı gecikme 150ms azaldı. AbortController zaten önceki in-flight istekleri iptal ediyor, debounce'a gerek yok.

---

## REVİZYON 5.6 — updatePropertyWithRetry Etkisizlik Düzeltmesi

**Tespit:** `updateProperty()` fonksiyonu `setTimeout` kullanıyordu ama Promise döndürmüyordu. Bu yüzden `updatePropertyWithRetry()`'daki `await get().updateProperty()` hemen resolve oluyordu ve retry mantığı hiçbir zaman tetiklenmiyordu.

**Değişiklik:** `extension-build/src/store/configurator-store.js`

setTimeout, `new Promise((resolve, reject) => { ... })` ile sarmalandı:

```javascript
async updateProperty(key, value) {
  // ... optimistic UI, cache check ...

  return new Promise((resolve, reject) => {
    updateTimer = setTimeout(async () => {
      try {
        const data = await updateProperties(...);
        // ... state güncelle ...
        resolve(data);
      } catch (err) {
        if (err.name === "AbortError") {
          resolve(undefined); // İptal normal durum, reject etme
          return;
        }
        set({ properties, updating: false, error: err.message });
        reject(err); // Gerçek hata → retry tetiklenebilir
      }
    }, DEBOUNCE_MS);
  });
}
```

**Etki:** `updatePropertyWithRetry` artık gerçek hataları yakalayıp exponential backoff ile yeniden deniyor.

---

## REVİZYON 5.7 — changedProperty Desteği

**Tespit:** Faz 3 REVİZYON 3.5 ile backend `changedProperty` bilgisini kabul ederek tek property set etme yeteneği kazandı. Frontend'in bu bilgiyi göndermesi gerekiyor.

**Değişiklik 1:** `extension-build/src/store/configurator-store.js`

```javascript
const data = await updateProperties(
  proxyBase, allProps, itemId, articleNumber, manufacturerId,
  { signal: currentAbort.signal, changedProperty: { key, value } },
);
```

**Değişiklik 2:** `extension-build/src/utils/api.js`

`changedProperty`'yi options'tan ayırarak body'ye ekleme, fetch options'a sızdırmama:

```javascript
export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId, options = {}) {
  const { changedProperty, ...fetchOptions } = options;
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({
      properties, itemId, articleNumber, manufacturerId,
      changedProperty: changedProperty || null,
    }),
    ...fetchOptions,
  });
}
```

**Etki:** Backend `changedProperty` varsa sadece 1 property set eder → property değişikliği ~2-3s → ~0.6-0.7s (Faz 3 REVİZYON 3.5 ile birlikte).

---

## Değişen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `extension-build/src/store/configurator-store.js` | Debounce 0ms, AbortController, Promise sarmalama, changedProperty, retry |
| `extension-build/src/utils/api.js` | Dış signal desteği, changedProperty body'ye ekleme |
| `extension-build/src/components/Model.jsx` | Crossfade animasyonu, scene dispose |
| `extension-build/src/components/ConfiguratorScene.jsx` | Subtle loading overlay |
| `extension-build/src/components/PropertySelector.jsx` | updatePropertyWithRetry kullanımı |
| `extensions/pcon-3d-configurator/assets/configurator.css` | Subtle progress bar CSS |

---

## Build Sonucu

```
vite v6.4.2 building for production...
✓ 357 modules transformed.
extensions/pcon-3d-configurator/assets/configurator-app.js  1,154.24 kB │ gzip: 325.96 kB
✓ built in 1.79s
```

---

## Test Kontrol Listesi

- [x] Property tıklamasında debounce yok, anında istek gider (REVİZYON 5.5)
- [x] Hızlı art arda tıklamalarda önceki istek AbortController ile iptal ediliyor
- [x] Cache hit durumunda anında güncelleme (API çağrısı atlanır)
- [x] Model geçişinde crossfade animasyonu
- [x] Eski scene dispose ediliyor (memory leak yok)
- [x] Updating sırasında subtle progress bar görünüyor
- [x] updateProperty Promise döndürüyor, retry çalışıyor (REVİZYON 5.6)
- [x] Hata durumunda 2 retry denemesi (exponential backoff)
- [x] changedProperty backend'e gönderiliyor (REVİZYON 5.7)
- [x] Extension build başarılı (325.96 KB gzip)
