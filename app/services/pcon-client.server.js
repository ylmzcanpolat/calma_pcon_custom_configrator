import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { EaiwsSession } from "@easterngraphics/wcf/modules/eaiws/index.js";
import { InsertInfo } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";
import { mapProperties } from "./property-mapper.server.js";
import { buildCartProperties } from "./cart-builder.server.js";
import { GetChoiceListOptions } from "@easterngraphics/wcf/modules/eaiws/basket";

const GATEKEEPER_BASE_URL = "https://gatekeeper.eaiws.pcon-solutions.com/v2";
const GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";
const SESSION_LOCALE = process.env.PCON_LOCALE || "tr_TR";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2000;

/**
 * EAIWS bazı durumlarda kendi döndürdüğü dahili/bağımlı değerleri
 * (örn. Numeric/Length tipi property için "_5" gibi placeholder değerler)
 * `setPropertyValue` çağrısında geri kabul etmez ve Java tarafında
 * `NumberFormatException` ya da "unknown property" hatası fırlatır.
 *
 * Bu hatalar tek bir property için lokal hatadır; tüm güncelleme akışını
 * iptal etmemeliyiz. Bu yardımcı, döngü içinde sessizce atlanması
 * gereken hata mesajlarını tespit eder.
 */
export function isSkippablePropertyError(err) {
  const message = err?.message || "";
  return (
    message.includes("unknown property") ||
    message.includes("UnknownPropertyException") ||
    message.includes("value not a number") ||
    message.includes("NumberFormatException") ||
    message.includes("value out of range") ||
    message.includes("value not allowed")
  );
}

class PconClient {
  constructor() {
    this.session = null;
    this.currentItemId = null;
    this.connectPromise = null;
  }

  async connect() {
    if (this.session?.isValid) return true;

    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = this._doConnect();
    try {
      return await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  async _createGatekeeperSession() {
    if (!GATEKEEPER_ID) {
      throw new Error("PCON_GATEKEEPER_ID environment variable is not set");
    }

    const url = `${GATEKEEPER_BASE_URL}/session/${GATEKEEPER_ID}`;
    const body = { locale: "en" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorId = errorData?.error?.id || "unknown";
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`Gatekeeper session failed [${errorId}]: ${errorMsg}`);
    }

    const data = await response.json();

/*     console.log("data", data); */

    return {
      server: data.server,
      sessionId: data.sessionId,
      keepAliveInterval: data.keepAliveInterval,
    };
  }

  async _doConnect() {
    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      try {
        /* console.log(`[PconClient] Connection attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS}`); */

        const gkSession = await this._createGatekeeperSession();
        /* console.log(`[PconClient] Gatekeeper session created on ${gkSession.server}`); */

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
    if (!this.session?.isValid) {
      await this.connect();
    }
    return this.session;
  }

  async getArticleData(articleNumber, manufacturerId) {
    const session = await this.ensureSession();

    const topFolderId = await session.basket.getTopFolderId();

    const insertInfo = new InsertInfo();
    insertInfo.baseArticleNumber = articleNumber;
    if (manufacturerId) insertInfo.manufacturerId = manufacturerId;

    const itemId = await session.basket.insertOFMLArticle(topFolderId, null, insertInfo);
    this.currentItemId = itemId;

    const articleData = await session.basket.getArticleData(itemId, {
      fetchCatalogImage: true,
      enableBooleanPropType: true,
    });

    const tOptions = new GetChoiceListOptions();
    tOptions.enableBooleanPropType = true;
    tOptions.highResPropValueIcons = true;
    tOptions.fetchPropValueImages = true;

    const choiceLists = await session.basket.getAllChoiceLists(itemId, tOptions);

    const gltfUrl = await session.basket.getExportedGeometry(itemId, [
      "format=GLTF",
    ]);

    const currency = articleData.currency || (await session.basket.getCurrency());

    const properties = await mapProperties(articleData, choiceLists);

    const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

    const cartProperties = buildCartProperties(articleData, choiceLists);

    return {
      itemId,
      price,
      gltfUrl,
      properties,
      currency,
      cartProperties,
      articleNumber: articleData.baseArticleNumber,
      manufacturerId: articleData.manufacturerId,
      seriesId: articleData.seriesId,
      shortText: articleData.shortText,
    };
  }

  async setPropertyValue(itemId, propertyList) {
    const session = await this.ensureSession();
    const targetItemId = itemId || this.currentItemId;

    if (!targetItemId) {
      throw new Error("No active article item. Call getArticleData first.");
    }

    for (const { propClass, propName, value } of propertyList) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      try {
        await session.basket.setPropertyValue(
          targetItemId,
          propClass,
          propName,
          value,
        );
      } catch (err) {
        if (isSkippablePropertyError(err)) {
          console.warn(
            `[PconClient] Skipping property ${propClass}.${propName}=${value}: ${err.message}`,
          );
          continue;
        }
        throw err;
      }
    }

    const articleData = await session.basket.getArticleData(targetItemId, {
      fetchCatalogImage: true,
      fetchCatalogIcon: true,
      enableBooleanPropType: true,
    });

    const tOptions = new GetChoiceListOptions();
    tOptions.enableBooleanPropType = true;
    tOptions.highResPropValueIcons = true;
    tOptions.fetchPropValueImages = true;

    const choiceLists = await session.basket.getAllChoiceLists(targetItemId, tOptions);

    console.log("choiceLists", JSON.stringify(choiceLists, null, 2));

    const gltfUrl = await session.basket.getExportedGeometry(targetItemId, [
      "format=GLTF",
    ]);

    const currency = articleData.currency || (await session.basket.getCurrency());
    const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

    const properties = await mapProperties(articleData, choiceLists);

    const cartProperties = buildCartProperties(articleData, choiceLists);

    return {
      price,
      gltfUrl,
      properties,
      currency,
      cartProperties,
    };
  }

  async exportGltf(itemId) {
    const session = await this.ensureSession();
    const targetItemId = itemId || this.currentItemId;

    if (!targetItemId) {
      throw new Error("No active article item. Call getArticleData first.");
    }

    return session.basket.getExportedGeometry(targetItemId, ["format=GLTF"]);
  }

  /**
   * Cart-add anında çağrılır. Şu anki konfigürasyon için legacy middleware'in
   * `finalProperties` body'sinde beklediği üç dinamik EAIWS asset URL'sini
   * üretir:
   *
   *  - `obxUrl`         → `basket.copy([itemId], ...)` ile cut buffer'a alınmış
   *                        OBX dosyası (legacy `_obx_url`). Aynı dosya
   *                        `_reopen_url`'in `obx=` parametresinde de kullanılır.
   *  - `attachmentUrl`  → `basket.getGeneratedImage(itemId, [...])` ile üretilen
   *                        konfigürasyonun render edilmiş JPG'si (legacy
   *                        `_attachment`).
   *  - `articleImageUrl` → güncel `articleData.catalogImage` (session-bound;
   *                        legacy `_article_image`). Stale catalog image
   *                        cache'inden kaçınmak için her seferinde fresh
   *                        çekilir.
   *
   * URL'ler EAIWS session'ına bağlıdır; session expire olunca geçersizleşir.
   * Bu nedenle cache'lenmez, her cart-add'de yeniden üretilir.
   */
  async generateCartAssets(itemId) {
    const session = await this.ensureSession();
    const targetItemId = itemId || this.currentItemId;

    if (!targetItemId) {
      throw new Error("No active article item. Call getArticleData first.");
    }

    // copy() ve getGeneratedImage() basket üzerinde okuma operasyonlarıdır;
    // paralel çalıştırarak round-trip latency'i yarıya iniyoruz.
    // articleData'yı da paralel çekiyoruz ki güncel catalogImage URL'i
    // (session-bound) elde edebilelim.
    const [obxUrl, attachmentUrl, articleData] = await Promise.all([
      session.basket.copy([targetItemId], null, null, {}),
      session.basket.getGeneratedImage(targetItemId, [
        "format=JPG",
        "width=800",
        "height=800",
      ]),
      session.basket.getArticleData(targetItemId, {
        fetchCatalogImage: true,
        enableBooleanPropType: true,
      }),
    ]);

    return {
      obxUrl: obxUrl || "",
      attachmentUrl: attachmentUrl || "",
      articleImageUrl: articleData?.catalogImage || "",
    };
  }

  async disconnect() {
    if (this.session?.isValid) {
      try {
        this.session.disconnect();
        console.log("[PconClient] Session disconnected");
      } catch (err) {
        console.error("[PconClient] Error disconnecting session:", err.message);
      }
    }
    this.session = null;
    this.currentItemId = null;
  }

}

let instance = null;

export function getPconClient() {
  if (!instance) {
    instance = new PconClient();
  }
  return instance;
}

export default PconClient;
