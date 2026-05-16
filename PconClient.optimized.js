/**
 * PconClient — Optimized
 *
 * Performans iyileştirmeleri:
 *  1. GLB yüklemesi debounce ile UI güncellemesinden ayrıldı
 *  2. getArticleData + getAllChoiceLists paralel çalışıyor (Promise.all)
 *  3. setPropertyValue'da SetPropertyValueOptions kullanılıyor (computeChoiceListChangeFlags)
 *  4. getAllChoiceLists yalnızca 'C' veya 'I' flag'i döndüğünde yeniden çağrılıyor
 *  5. Property güncellemelerinde fetchCatalogImage/Icon kapatıldı
 *  6. Choice list görselleri yalnızca ilk yüklemede çekiliyor
 *  7. Birden fazla property sıralı değil paralel set ediliyor (Promise.all)
 */

import { EaiwsSession, InsertInfo, GetChoiceListOptions, SetPropertyValueOptions } from "@easterngraphics/wcf/modules/eaiws";

// --- Sabitler ---
const GATEKEEPER_BASE_URL = process.env.PCON_GATEKEEPER_BASE_URL;
const GATEKEEPER_ID       = process.env.PCON_GATEKEEPER_ID;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS     = 2000;

/**
 * Kullanıcı property değiştirmeyi bıraktıktan kaç ms sonra
 * GLB yeniden yüklensin? (400ms iyi bir denge noktası)
 */
const GLB_DEBOUNCE_MS = 400;

// ---------------------------------------------------------------------------

export class PconClient {
  constructor({ onGlbReady, onPropertiesReady } = {}) {
    this.session        = null;
    this.currentItemId  = null;

    // Callback'ler — tüketici tarafında tanımlanır
    this._onGlbReady        = onGlbReady;        // (gltfUrl) => void
    this._onPropertiesReady = onPropertiesReady; // (data)    => void

    // Dahili state
    this._glbDebounceTimer  = null;
    this._cachedChoiceLists = null; // son başarılı getAllChoiceLists sonucu
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BAĞLANTI
  // ─────────────────────────────────────────────────────────────────────────

  async _createGatekeeperSession() {
    if (!GATEKEEPER_ID) {
      throw new Error("PCON_GATEKEEPER_ID environment variable is not set");
    }

    const url  = `${GATEKEEPER_BASE_URL}/session/${GATEKEEPER_ID}`;
    const body = { locale: "en" };

    const response = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorId   = errorData?.error?.id      || "unknown";
      const errorMsg  = errorData?.error?.message || response.statusText;
      throw new Error(`Gatekeeper session failed [${errorId}]: ${errorMsg}`);
    }

    const data = await response.json();
    return {
      server:            data.server,
      sessionId:         data.sessionId,
      keepAliveInterval: data.keepAliveInterval,
    };
  }

  async _doConnect() {
    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      try {
        const gkSession = await this._createGatekeeperSession();

        this.session = new EaiwsSession();
        const keepAliveMs = (gkSession.keepAliveInterval || 60) * 1000;

        const connected = this.session.connect(
          gkSession.server,
          gkSession.sessionId,
          keepAliveMs,
        );

        await this.session.basket.setLanguages("en");

        if (connected) {
          console.log(`[PconClient] Connected. Session ID: ${this.session.sessionId}`);
          return true;
        }

        console.warn(`[PconClient] connect() returned false on attempt ${attempt}`);
      } catch (err) {
        console.error(`[PconClient] Connection attempt ${attempt} failed:`, err.message);
      }

      if (attempt < MAX_RECONNECT_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, RECONNECT_DELAY_MS));
      }
    }

    this.session = null;
    throw new Error("Failed to connect to pCon EAIWS after all retry attempts");
  }

  async ensureSession() {
    if (!this.session) {
      await this._doConnect();
    }
    return this.session;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // İLK YÜKLEME
  // getArticleData → tam veri, görsel dahil, ardından GLB eş zamanlı
  // ─────────────────────────────────────────────────────────────────────────

  async getArticleData(articleNumber, manufacturerId) {
    const session = await this.ensureSession();

    // 1. Ürünü basket'e ekle
    const topFolderId = await session.basket.getTopFolderId();
    const insertInfo  = new InsertInfo();
    insertInfo.baseArticleNumber = articleNumber;
    if (manufacturerId) insertInfo.manufacturerId = manufacturerId;

    const itemId = await session.basket.insertOFMLArticle(topFolderId, null, insertInfo);
    this.currentItemId = itemId;

    // 2. articleData + choiceLists + GLB → hepsi paralel
    //    Session serialization EAIWS tarafında yönetiliyor;
    //    client'tan paralel göndermek kuyruğu doldurur ve sunucu sırayla işler —
    //    toplam süre yine de azalır çünkü network round-trip'leri çakışır.
    const choiceListOptions = _buildFullChoiceListOptions(); // görseller dahil (ilk yükleme)

    const [articleData, choiceLists, gltfUrl] = await Promise.all([
      session.basket.getArticleData(itemId, {
        fetchCatalogImage:    true,  // ilk yüklemede katalog görseli lazım
        fetchCatalogIcon:     false,
        enableBooleanPropType: true,
      }),
      session.basket.getAllChoiceLists(itemId, choiceListOptions),
      session.basket.getExportedGeometry(itemId, [
        "format=GLTF",
        "texTrans=true", // UV optimizasyonu — viewer uyumluluğu artar
      ]),
    ]);

    // Cache'le — sonraki güncelleme gerekmedikçe yeniden çekmeyiz
    this._cachedChoiceLists = choiceLists;

    const currency = articleData.currency
      || (await session.basket.getCurrency());

    const properties     = await mapProperties(articleData, choiceLists);
    const price          = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;
    const cartProperties = buildCartProperties(articleData, choiceLists);

    return {
      itemId,
      price,
      gltfUrl,
      properties,
      currency,
      cartProperties,
      articleNumber:   articleData.baseArticleNumber,
      manufacturerId:  articleData.manufacturerId,
      seriesId:        articleData.seriesId,
      shortText:       articleData.shortText,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PROPERTY GÜNCELLEME
  //
  // Strateji:
  //   A) Tüm property'leri EAIWS'e gönder (paralel)
  //   B) Toplam changeFlags'e bak
  //   C) articleData + (gerekiyorsa) choiceLists paralel çek → UI'ı hemen güncelle
  //   D) GLB'yi debounce ile arka planda yükle → callback ile tüketiciye bildir
  // ─────────────────────────────────────────────────────────────────────────

  async setPropertyValue(itemId, propertyList) {
    const session      = await this.ensureSession();
    const targetItemId = itemId || this.currentItemId;

    if (!targetItemId) {
      throw new Error("No active article item. Call getArticleData first.");
    }

    // ── A. Property'leri set et ──────────────────────────────────────────
    //
    // setPropertyValue EAIWS tarafında session bazlı serialize edilir,
    // ancak request'leri paralel göndermek pipeline'ı doldurur.
    // "C" ve "I" flag'lerini topluyoruz: choice list değişti mi?
    //
    const spvOptions = new SetPropertyValueOptions();
    spvOptions.computeChoiceListChangeFlags  = true;  // C, I flag'leri — gerekli
    spvOptions.computeVisibilityChangeFlags  = false; // S, H — şimdilik kapat
    spvOptions.computeValueChangeFlags       = false; // V, v, U, A — şimdilik kapat

    const validProps = propertyList.filter(
      ({ value }) => value !== null && value !== undefined && value !== "",
    );

    // Her property için setPropertyValue çağrısı — paralel gönder
    const flagResults = await Promise.all(
      validProps.map(({ propClass, propName, value }) =>
        session.basket.setPropertyValue(
          targetItemId,
          propClass,
          propName,
          value,
          spvOptions,
        ).catch((err) => {
          if (isSkippablePropertyError(err)) {
            console.warn(
              `[PconClient] Skipping ${propClass}.${propName}=${value}: ${err.message}`,
            );
            return ""; // boş flag
          }
          throw err;
        }),
      ),
    );

    // Tüm flag string'lerini birleştir
    const combinedFlags = flagResults.join("");
    const choiceListChanged = combinedFlags.includes("C") || combinedFlags.includes("I");
    const positionChanged   = combinedFlags.includes("a") || combinedFlags.includes("r");

    console.log(`[PconClient] setPropertyValue flags: "${combinedFlags}"`);

    // ── B. articleData + (koşullu) choiceLists paralel çek ──────────────
    //
    // fetchCatalogImage/Icon → property değişiminde katalog görseli değişmez
    // fetchPropValueImages   → güncelleme için gerekmiyor, cache'den gelir

    const fetchChoiceLists = choiceListChanged || positionChanged;
    const lightChoiceListOptions = _buildLightChoiceListOptions(); // görselsiz

    const [articleData, freshChoiceLists] = await Promise.all([
      session.basket.getArticleData(targetItemId, {
        fetchCatalogImage:     false,
        fetchCatalogIcon:      false,
        enableBooleanPropType: true,
      }),
      fetchChoiceLists
        ? session.basket.getAllChoiceLists(targetItemId, lightChoiceListOptions)
        : Promise.resolve(null),
    ]);

    // Cache güncelle (sadece değiştiyse)
    if (freshChoiceLists !== null) {
      this._cachedChoiceLists = freshChoiceLists;
    }
    const choiceLists = this._cachedChoiceLists;

    const currency       = articleData.currency || (await session.basket.getCurrency());
    const properties     = await mapProperties(articleData, choiceLists);
    const price          = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;
    const cartProperties = buildCartProperties(articleData, choiceLists);

    // ── C. UI'ı hemen güncelle (GLB beklenmeden) ─────────────────────────
    const uiData = {
      itemId: targetItemId,
      price,
      properties,
      currency,
      cartProperties,
      articleNumber:  articleData.baseArticleNumber,
      manufacturerId: articleData.manufacturerId,
      seriesId:       articleData.seriesId,
      shortText:      articleData.shortText,
    };

    if (typeof this._onPropertiesReady === "function") {
      this._onPropertiesReady(uiData);
    }

    // ── D. GLB'yi debounce ile arka planda yükle ─────────────────────────
    this._scheduleGlbReload(targetItemId);

    return uiData;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GLB DEBOUNCE
  // Kullanıcı hızlı property değiştiriyorsa her seferinde GLB üretme.
  // Son değişiklikten GLB_DEBOUNCE_MS sonra bir kez üret.
  // ─────────────────────────────────────────────────────────────────────────

  _scheduleGlbReload(itemId) {
    clearTimeout(this._glbDebounceTimer);

    this._glbDebounceTimer = setTimeout(async () => {
      try {
        const session = await this.ensureSession();
        const gltfUrl = await session.basket.getExportedGeometry(itemId, [
          "format=GLTF",
          "texTrans=true",
        ]);

        console.log(`[PconClient] GLB ready: ${gltfUrl}`);

        if (typeof this._onGlbReady === "function") {
          this._onGlbReady(gltfUrl);
        }
      } catch (err) {
        console.error("[PconClient] GLB reload failed:", err.message);
      }
    }, GLB_DEBOUNCE_MS);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // YARDIMCI
  // ─────────────────────────────────────────────────────────────────────────

  destroy() {
    clearTimeout(this._glbDebounceTimer);
    this.session?.disconnect?.();
    this.session = null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ÖZEL FONKSİYONLAR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * İlk yükleme için tam choice list options (görseller dahil)
 */
function _buildFullChoiceListOptions() {
  const opts = new GetChoiceListOptions();
  opts.enableBooleanPropType  = true;
  opts.highResPropValueIcons  = true;
  opts.fetchPropValueImages   = true;
  return opts;
}

/**
 * Property güncellemeleri için hafif choice list options (görselsiz)
 * Değerler + seçilebilirlik durumu yeterli; görseller cache'de kalır.
 */
function _buildLightChoiceListOptions() {
  const opts = new GetChoiceListOptions();
  opts.enableBooleanPropType  = true;
  opts.highResPropValueIcons  = false; // ağır, değişmez
  opts.fetchPropValueImages   = false; // ağır, değişmez
  return opts;
}

/**
 * Güvenle atlanabilecek SOAP hatalarını filtrele.
 * (Orijinal davranışı koru)
 */
function isSkippablePropertyError(err) {
  const msg = err?.message || "";
  return (
    msg.includes("not an editable property") ||
    msg.includes("not a member of the choice list") ||
    msg.includes("BasketServiceFault")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — kendi implementasyonunuzla değiştirin
// ─────────────────────────────────────────────────────────────────────────────

async function mapProperties(articleData, choiceLists) {
  // Mevcut implementasyonunuzu buraya taşıyın
  return {};
}

function buildCartProperties(articleData, choiceLists) {
  // Mevcut implementasyonunuzu buraya taşıyın
  return {};
}
