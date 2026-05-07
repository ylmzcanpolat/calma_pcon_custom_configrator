# pCon Configurator — Performans Baseline (Faz 0)

> **Amaç:** Sonraki fazların kazancını **somut, tekrarlanabilir sayılarla**
> doğrulayabilmek için mevcut sistemin uçtan uca latency profilini ölçmek.
>
> Bu dosya `performance-improvement-plan.md` Faz 0 §0.4'te tanımlanan
> manuel ölçüm protokolünün **canlı ölçüm raporudur**.
>
> **Durum (2026-05-06):** ✅ Pilot ölçüm tamamlandı (calma-small / Simple kategorisi,
> browser-use subagent ile, n=2/senaryo). Faz 1 implementation'ı sonrası
> n=10+ ile genişletilecek; Mid/Complex/Prebake article'lar Faz 1+ "after"
> karşılaştırmasında ölçülecek. Ayrıntı için §4.

---

## 1. Telemetry altyapısı (Faz 0 deliverable'ları)

| Bileşen | Dosya | Çıktı |
|---|---|---|
| Backend timer + sample push | `app/services/perf-logger.server.js` | `Server-Timing` header, structured console log, Redis `pcon:perf:samples:*` |
| `init` instrumentation | `app/routes/pcon-proxy.api.pcon.init.jsx` | `[pcon/init] cache=HIT/MISS …` |
| `update` instrumentation | `app/routes/pcon-proxy.api.pcon.update.jsx` | `[pcon/update] cache=HIT/MISS …` |
| pcon-client RPC timing | `app/services/pcon-client.server.js` | `eaiws.setProp`, `eaiws.export`, `eaiws.getArticleData` markRaw |
| Frontend recorder | `extension-build/src/utils/perf.js` | `createPerfRecorder()`, `parseServerTiming()` |
| Fetch instrumentation | `extension-build/src/utils/api.js` | response'a non-enumerable `__perfMeta` iliştirir |
| Click→paint ölçümü | `extension-build/src/store/configurator-store.js` | `[pcon-perf] op=updateProperty …` + `window.__pconPerf` |

**Tüketici giriş noktaları:**

- Browser DevTools console: tıklama başına tek satır `[pcon-perf] op=… click=… response_server=… paint_state_set=… total=… server=…` log.
- Browser DevTools console: `console.table(window.__pconPerf)` ile son 50 sample tablo halinde.
- Browser DevTools Network panel → herhangi bir `/api/pcon/*` request → "Timing" sekmesinde `Server-Timing` breakdown otomatik render.
- Backend Fly.io / dev shell logları: tek satırlık `[pcon/init] cache=HIT articleNumber=… eaiws.getArticleData=… total=…ms` gibi structured loglar.
- Redis: `LRANGE pcon:perf:samples:pcon/update:<articleNumber> 0 -1` ile son 200 sample (ham `{ts, ms}` JSON listesi).

---

## 2. Manuel ölçüm protokolü

> **Tek bir kişi**, **tek bir browser profili** (default Chrome stable, vanilla),
> ve **gözlemlenen iş günü saati dışında** (paralel kullanıcı yokken) aşağıdaki
> adımları sırayla uygulayın.

### 2.1 Hazırlık

1. Server'ın canlıda olduğundan emin olun (`fly logs --app …` veya `npm run dev`).
2. **Chrome stable**, Incognito **OLMAYAN** bir tab. (Incognito'da `sessionStorage` farklı izolasyonda olabilir.)
3. DevTools açın → **Console** sekmesi (tüm `[pcon-perf]` ve `[pcon/init|update]` log'ları burada görüntülenecek).
4. DevTools → **Network** sekmesi → "Disable cache" tikini **kapatın** (cache HIT/MISS senaryolarını ayırt edebilesiniz).
5. (Opsiyonel) DevTools → **Network** → Throttling profilini önce **No throttling** ile başlatın; her senaryo bittikten sonra **Fast 3G** ile tekrarlayın.
6. Test edilecek article'ın PDP URL'ini hazır tutun.

### 2.2 Tek bir senaryonun ölçümü

1. PDP'yi aç ya da `Ctrl/Cmd+Shift+R` ile **hard reload** (cache MISS senaryosu için).
2. Configurator yüklenince spinner kaybolur — bu noktada console'da `[pcon-perf] op=initialize …` satırını görmelisin.
3. **En az 5 farklı property değişimi** yap (renk, kumaş, kaplama, vb. karışık seç). Her birinde:
   - Console'a `[pcon-perf] op=updateProperty propId=… click=0ms response_server=…ms paint_state_set=…ms total=…ms server=eaiws.setProp:…,eaiws.export:…` satırı düşmeli.
   - Network panelinde `/api/pcon/update` isteğinin "Timing" sekmesinde `Server-Timing` breakdown'unu doğrula.
4. Console'a şu komutu yapıştır ve sonucu kopyala:
   ```js
   console.table(window.__pconPerf)
   ```
5. Kopyalanan tabloyu aşağıdaki "Ölçümler" bölümündeki ilgili article'ın satırına ekle (markdown table veya raw blob).
6. Backend tarafı için Redis'ten istatistik okumak için (opsiyonel):
   ```bash
   # Tüm ring'leri listele
   redis-cli --scan --pattern "pcon:perf:samples:*" | head

   # Bir ring'in son 200 sample'ını al
   redis-cli LRANGE "pcon:perf:samples:pcon/update:<articleNumber>" 0 -1
   ```
   veya backend kodu içinden:
   ```js
   import { getPerfStats } from "./app/services/perf-logger.server.js";
   await getPerfStats("pcon/update", "<articleNumber>");
   // → { count, p50, p95, p99, min, max, mean }
   ```

### 2.3 Senaryo seti

Plan §0.4'teki S1–S7 setinin minimal alt-kümesi:

| ID | Senaryo | Ön koşul |
|---|---|---|
| **S1** | Cold init (Redis MISS, .cache/gltf yok) | Redis'te `pcon:init:<hash>` silinmiş; browser hard reload |
| **S2** | Warm init (HIT) | S1 sonrası, hard reload |
| **S4** | Renk/kumaş değişimi | Init bittikten sonra appearance property tıkla |
| **S5** | Geometri property değişimi | PRIZ_TIPI / MEDIAWALL gibi |
| **S6** | Çoklu property (5 ardışık) | 5 farklı property hızlı arka arkaya |
| **S7** | Cart add | Konfigürasyon bitti, "Add to Cart" |

Her senaryoyu **en az 5 kez** tekrarla; sapma > %50 ise 10'a çıkar.

---

## 3. Test article seti

| Etiket | URL | Manufacturer | Neden seçildi | Faz 0 ölçüldü mü? |
|---|---|---|---|---|
| **Simple** | [calma-small](https://nuruscalma.myshopify.com/products/calma-small) | Nurus | Az property + küçük GLB. Cold MISS pipeline'ının taban maliyeti. | ✅ Pilot (n=2/senaryo) |
| **Mid** | [calma-medium](https://nuruscalma.myshopify.com/products/calma-medium), [calma-for-u](https://nuruscalma.myshopify.com/products/calma-for-u) | Nurus | Orta boy pod ailesi. | ⏳ Faz 1 sonrası "after" karşılaştırma için saklı |
| **Complex** | [calma-large](https://nuruscalma.myshopify.com/products/calma-large), [calma-xlarge](https://nuruscalma.myshopify.com/products/calma-xlarge-188-x-220), [calma-xxlarge](https://nuruscalma.myshopify.com/products/calma-xxlarge-276-x-220), [calma-for-all](https://nuruscalma.myshopify.com/products/calma-for-all-188-x-220) | Nurus | Çok property + büyük GLB. Faz 5'te en fazla kazanç beklenen senaryo. | ⏳ Faz 1/2 sonrası |
| **Prebake'lenmiş** | _hen​üz seçilmedi_ | — | `article-warmer.server.js` ile L1+L2+L3 warm edilmiş. "Best case" cache HIT. | ⏳ Pre-bake script çalıştıktan sonra |

> **Pilot kararı (koordinatör notu):** Faz 0 baseline için tek "Simple" article
> (calma-small) ile yapılan pilot ölçüm, fazların önceliklendirmesini netleştirmek
> için yeterli sinyali verdi (S4 vs S5 ayrımının olmaması, cold/warm farkı,
> ardışık değişimde local-cache HIT davranışı). Kalan article'lar **Faz 1 sonrası
> "before/after" karşılaştırma** için saklanıyor — Faz 0'da hepsini ölçmek
> her implementation phase'inden sonra tekrar ölçüm gerektirecek redundant
> bir maliyet getirirdi.

---

## 4. Ölçümler

> **Pilot ölçüm yöntemi:** Browser-use subagent (cursor-ide-browser MCP)
> tarafından canlı [calma-small](https://nuruscalma.myshopify.com/products/calma-small)
> sayfasında, vanilla Chrome, no throttling, Redis cache temizlenmiş başlangıç
> durumuyla, **2026-05-06** tarihinde yapıldı. Telemetri verisi `[pcon-perf]`
> console log satırlarından parse edildi.
>
> **n=2 uyarısı:** P95/P99 hesaplamak için n çok düşük. Tablodaki "P50" pratikte
> 2 ölçümün ortalaması, "max" en yüksek değer. Faz 1 implementation'ından sonra
> n=10+ ile P95 hesaplaması yapılacak. Bu pilot, **fazların önceliklendirmesi
> için referans noktası** — kesin baseline değil.

### 4.1 Article: _Simple_ — calma-small

#### No throttling (n=2 her senaryo, ortalama / max)

| Senaryo | total click→paint (ms) | server total (ms) | eaiws.setProp (ms) | eaiws.export (ms) | cache | propertyId örneği |
|---|---|---|---|---|---|---|
| **S1** cold init   | 1178 / 1178 (n=1) | 832 / 832 | — | — | MISS | (init pipeline; `eaiws.insertOFMLArticle=599`) |
| **S2** warm init   | 223 / 231 (n=2)   | **7.5 / 9** | — | — | HIT  | (full cached init, eaiws phases atlandı) |
| **S4** appearance  | 2123 / 2165 (n=2) | 1803 / 1838 | 812 / 940 | **910 / 1068** | MISS | `DUVAR.KECE_RENK_DUVAR`, `DUVAR.YUZEY_RENK_DUVAR` |
| **S5** geometry    | 2011 / 2140 (n=2) | 1603 / 1640 | 690 / 729 | 786 / 792 | MISS | `GENEL.PRIZ_TIPI`, `TAVAN.SPRINKLER` |
| **S6** 3 ardışık¹  | 3838 / 3838 (n=1 tam) | — | — | — | mixed | totals=[1701, **256**², 1880] |
| **S7** cart add    | _ölçülemedi_³     | — | — | — | — | — |

**Notlar (Simple):**

¹ Plan §0.4'te S6 = "5 ardışık" yazıyordu; UI'daki dropdown-aç-seç akışı 5
  hızlı tıklamayı pratik kılmadığı için **3'e indirildi** (koordinatör kararı).
  3 değişim de queue/cache davranışını gösterir.

² **Kritik bulgu:** S6 Run 1'in ortadaki değişiminin sadece 256 ms tutması,
  client-side property cache'inin (`extension-build/src/store/configurator-store.js`
  içindeki local cache) çalıştığını gösteriyor; aynı `(itemId + propsHash)`
  daha önce görüldüğünde GLB indirme adımı atlanıyor. Bu, "yeni kombinasyon"
  yolunun yavaşlığını izole etmemize yarar — Faz 1'in hedefi tam olarak bu yolu
  hızlandırmak.

³ S7 (cart add) — Add-to-Cart butonu "ADDING…" durumuna geçti ama agent ne
  cart drawer ne de tanımlı bir `/cart/add` ya da `/cart-payload` endpoint
  isabeti yakalayamadı. Bu **kapsam dışı bir fonksiyonel tespit** olabilir
  veya cart akışı custom bir endpoint kullanıyordur. Faz 0 kapsamında
  cart akışına dokunmuyoruz; "regression baseline" için bu satır boş bırakıldı.
  → **Açık iş**: Geliştiriciden cart endpoint'inin gerçek yolu teyit edilmeli.

#### Fast 3G

| Senaryo | total click→paint | server total | eaiws.setProp | eaiws.export | cache HIT/MISS |
|---|---|---|---|---|---|
| _Tüm satırlar_ | _ölçülmedi (Faz 1 sonrası "after" testinde eklenecek)_ | — | — | — | — |

> Fast 3G ölçümü Faz 0'da yapılmadı. Sebep: pilot agent oturum sürekliliği için
> bir tema (no-throttling) içinde kaldı; throttling değişimi DevTools state
> kirliliği yaratıyor. Faz 1 implementation'ı bittikten sonra hem before hem
> after Fast 3G ölçümü tek seansda yapılacak.

### 4.2 Article: _Mid_ ve _Complex_

> **Faz 0'da kasten ölçülmedi.** calma-medium / calma-large / xlarge / xxlarge / for-all
> ürünleri için ölçüm Faz 1 implementation'ı sonrası "before vs after"
> karşılaştırması olarak yapılacak — bu sayede:
>
> 1. Aynı protokolü iki kez koşmak zorunda kalmıyoruz (Faz 0'da before, Faz 1'de
>    yine before + after).
> 2. Faz 1'in gerçek kazancını **birden fazla article boyutunda** doğrulayabiliyoruz.
> 3. Pilot zaten S4 ≈ S5 sürelerini ortaya koyduğu için, fazların ROI sıralaması
>    daha fazla baseline veri olmadan da netleşti.

### 4.3 Article: _Prebake'lenmiş_

> Pre-bake script'i (`article-warmer.server.js`) **henüz Faz 0'da çalıştırılmadı**.
> Pre-bake "best case" senaryosu Faz 1 (objectHash cache stabilizasyonu) ve
> Faz 4 (warm-up otomasyonu) tamamlandıktan sonra ölçülecek.

---

## 5. Cache HIT/MISS oranı

> Backend log'larında `[pcon/init] cache=HIT|MISS` ve `[pcon/update] cache=HIT|MISS`
> satırlarını sayarak doldur. (Örn. son 100 isteğin %X'i HIT.)

### 5.1 Pilot oturum sırasında (calma-small, ~12 istek)

| Endpoint | HIT | MISS | HIT oranı | Yorum |
|---|---|---|---|---|
| `/api/pcon/init`   | 2 | 1 | %66 | Cold reload sonrası iki warm reload |
| `/api/pcon/update` | 1 | 8 | %11 | Sadece S6 Run 1'in 2. tıklaması (aynı kombinasyon) HIT yakaladı |

**Yorum (koordinatör):** Update HIT oranı pilot için çok düşük çünkü her tıklama
yeni bir `(itemId + propsHash)` kombinasyonu üretti. Gerçek kullanıcı trafiğinde
bu oran çok daha yüksek olmalı (popüler kombinasyonlar tekrar edilir). **Faz 1
acceptance criteria'sı**: production'da %50+ HIT oranını hedeflemek için
Redis sample setinden ölçüm alınmalı (`getPerfStats` API'siyle).

### 5.2 Production trafiğinde

> _Boş — Redis'teki `pcon:perf:samples:*` ring buffer'ı yeterince dolu olunca
> (örn. ~500 istek) doldurulacak._

---

## 6. Bilinen koşullar / notlar

- **Test ortamı:** Production-equivalent canlı kurulum, https://nuruscalma.myshopify.com
- **Browser:** Chrome stable (browser-use subagent kontrolünde)
- **Tarih:** 2026-05-06
- **Test eden:** Browser-use subagent (cursor-ide-browser MCP), koordinatör Claude
- **Network:** No throttling
- **Redis durumu:** Test başlangıcında elle FLUSHDB yapıldı (kullanıcı tarafından)

### Pilot sırasında ortaya çıkan tespitler

1. **S4 (renk) ≈ S5 (geometri) süresi.** EAIWS, property tipine bakmaksızın aynı
   `setProp + getExportedGeometry` pipeline'ını çalıştırıyor. Bu, plandaki
   **Faz 2 (appearance-only material patch)** kazanımının teorik maksimumunun
   gerçekten ~1.5 sn olduğunu doğruluyor.

2. **Local property cache çalışıyor.** S6 Run 1'de aynı property kombinasyonu
   tekrar gördüğünde local cache HIT (256 ms vs 1701/1880 ms). Faz 1'in
   `URL applyUrlProperties` yolu için bu cache zaten zincirin doğru ucunda;
   "fresh user click" yolunu da aynı cache'e bağlamak Faz 1'in ana işi.

3. **`applyUrlProperties` hızlı, `updateProperty` yavaş.** İki yol da aynı
   backend endpoint'ini çağırmasına rağmen, `applyUrlProperties` (sayfa reload'unda
   URL'den restore) `eaiws.export = ~9 ms` raporluyor (objectHash GLB cache HIT),
   ama `updateProperty` (kullanıcı tıklaması) `eaiws.export = ~800-1070 ms`.
   **Anlamı**: GLB-by-objectHash cache mevcut ama tıklama yolunda atlanıyor —
   muhtemelen kullanıcı tıklaması her seferinde benzersiz bir hash üretiyor
   (tüm property snapshot'ı + sıralama farkı). **Bu Faz 1'in birinci işidir:
   hash stabilizasyonu.**

4. **Cart endpoint'i tespit edilemedi.** Add-to-Cart butonu "ADDING…" durumunda
   takıldı ama beklenen network çağrısı görülmedi. Faz 0 cart akışına dokunmuyor
   ama Faz 1 öncesi geliştiriciden teyit alınmalı (custom mı yoksa standart
   Shopify cart endpoint'i mi?).

5. **`THREE.Clock` deprecation warning.** Console'da görüldü, performansı
   etkilemiyor; future three.js güncellemesinde adresslenebilir.

### Pilot kapsamı dışında bırakılanlar (bilinçli)

- Mid/Complex/Prebake article'lar — Faz 1+ "after" karşılaştırma için saklı.
- Fast 3G throttling — Faz 1 sonrası tek seansda before/after birlikte.
- S1 Run 2 (cold) — Redis tekrar temizleme efor/risk dengesi nedeniyle yapılmadı.
- n=10+ ile P95 — Faz 1 sonrası tüm ölçümler n=10+ koşulacak.

---

## 7. "Beklenen etkiler" tablosunun ölçümlerle güncellenmiş hali

> Plan §1'deki "Beklenen etkiler" tablosunun "Şu an" sütunu pilot ölçümle
> dolduruldu. n=2 olduğu için "ortalama / max" verildi; P50/P95 sadece Faz 1
> sonrası n=10+ ile anlamlı olacak.

| Senaryo | Şu an (pilot ortalama / max, ms) | Hedef (Faz 5 sonu) | Δ potansiyeli |
|---|---|---|---|
| İlk sayfa açılışı (cold MISS) | **1178 / 1178** | 4–7 sn¹ | _Faz 0 baseline'ı zaten hedeften daha iyi; Complex article'da test gerek_ |
| İlk sayfa açılışı (warm HIT)  | **223 / 231** | 1–2 sn² | ✅ Hedefin altında (Redis cache çalışıyor) |
| Renk/kumaş değişimi           | **2123 / 2165** | <300 ms | **~%85 düşüş gerek** (Faz 2 ana hedefi) |
| Geometri-etkileyen property   | **2011 / 2140** | 600–1500 ms | ~%40 düşüş gerek (Faz 5 sub-article delta) |
| Cart add                      | _ölçülemedi_ (endpoint tespit edilemedi) | dokunulmuyor | regression baseline yeniden alınmalı |

¹ Plan'daki "4-7 sn" hedefi Complex article için yazıldı (~8MB GLB).
  calma-small "Simple" kategorisi olduğu için zaten 1.2 sn'ye iniyor.
  Complex article ölçümü Faz 1 sonrası alınacak.

² calma-small için warm init zaten hedefin altında. Bu, Faz 1'de **ne kadar
  alana zarar verirsek vermeyelim, baseline'ın bu metriği bozmaması gerektiği**
  anlamına geliyor (regression koruması).

### Sonraki ölçüm noktaları

- **Faz 1 sonu**: aynı 6 senaryo, n=10, hem calma-small hem calma-xlarge,
  no throttling + Fast 3G. "After" sütunu eklenecek.
- **Faz 2 sonu**: özellikle S4 (renk) ölçümü; hedef <300 ms doğrulanmalı.
- **Faz 5 sonu**: S5 (geometri) ve S6 (5 ardışık) ölçümü; sub-article
  delta'nın gerçek kazancı görülecek.
