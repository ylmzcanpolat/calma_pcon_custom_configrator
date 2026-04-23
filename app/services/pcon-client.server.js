import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { EaiwsSession } from "@easterngraphics/wcf/modules/eaiws/index.js";
import { InsertInfo } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";

const GATEKEEPER_BASE_URL = "https://gatekeeper.eaiws.pcon-solutions.com/v2";
const GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";
const SESSION_LOCALE = process.env.PCON_LOCALE || "tr_TR";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2000;

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
    const body = { locale: SESSION_LOCALE };

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

    return {
      server: data.server,
      sessionId: data.sessionId,
      keepAliveInterval: data.keepAliveInterval,
    };
  }

  async _doConnect() {
    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      try {
        console.log(`[PconClient] Connection attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS}`);

        const gkSession = await this._createGatekeeperSession();
        console.log(`[PconClient] Gatekeeper session created on ${gkSession.server}`);

        this.session = new EaiwsSession();

        const keepAliveMs = (gkSession.keepAliveInterval || 60) * 1000;
        const connected = this.session.connect(
          gkSession.server,
          gkSession.sessionId,
          keepAliveMs,
        );

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

    const choiceLists = await session.basket.getAllChoiceLists(itemId, {
      enableBooleanPropType: true,
    });

    const gltfUrl = await session.basket.getExportedGeometry(itemId, [
      "format=GLTF",
    ]);

    const currency = articleData.currency || (await session.basket.getCurrency());

    const properties = this._mapProperties(articleData, choiceLists);

    const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

    return {
      itemId,
      price,
      gltfUrl,
      properties,
      currency,
      articleNumber: articleData.baseArticleNumber,
      manufacturerId: articleData.manufacturerId,
      seriesId: articleData.seriesId,
      shortText: articleData.shortText,
    };
  }

  async setPropertyValue(itemId, properties) {
    const session = await this.ensureSession();
    const targetItemId = itemId || this.currentItemId;

    if (!targetItemId) {
      throw new Error("No active article item. Call getArticleData first.");
    }

    for (const { propClass, propName, value } of properties) {
      try {
        await session.basket.setPropertyValue(
          targetItemId,
          propClass,
          propName,
          value,
        );
      } catch (err) {
        if (err.message?.includes("unknown property") || err.message?.includes("UnknownPropertyException")) {
          continue;
        }
        throw err;
      }
    }

    const articleData = await session.basket.getArticleData(targetItemId, {
      enableBooleanPropType: true,
    });

    const choiceLists = await session.basket.getAllChoiceLists(targetItemId, {
      enableBooleanPropType: true,
    });

    const gltfUrl = await session.basket.getExportedGeometry(targetItemId, [
      "format=GLTF",
    ]);

    const currency = articleData.currency || (await session.basket.getCurrency());
    const price = articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

    const validOptions = choiceLists.map((cl) => ({
      id: `${cl.propClass}.${cl.propName}`,
      options: (cl.values || []).map((pv) => ({
        value: pv.value,
        label: pv.text,
        available: pv.selectable !== false,
      })),
    }));

    return {
      price,
      gltfUrl,
      validOptions,
      currency,
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

  _mapProperties(articleData, choiceLists) {
    if (!articleData.properties) return [];

    const choiceMap = new Map();
    for (const cl of choiceLists) {
      choiceMap.set(`${cl.propClass}.${cl.propName}`, cl.values || []);
    }

    return articleData.properties
      .filter((prop) => prop.visible)
      .map((prop) => {
        const key = `${prop.propClass}.${prop.propName}`;
        const choices = choiceMap.get(key) || [];

        let type = "text";
        if (prop.choiceList && choices.length > 0) {
          const hasIcons = choices.some((c) => c.smallIcon || c.largeIcon || c.image);
          type = hasIcons ? "color" : "select";
        }

        return {
          id: key,
          propClass: prop.propClass,
          propName: prop.propName,
          label: prop.propText,
          type,
          editable: prop.editable,
          options: choices.map((pv) => ({
            value: pv.value,
            label: pv.text,
            icon: pv.smallIcon || pv.image || null,
            available: pv.selectable !== false,
          })),
          currentValue: prop.value?.value ?? "",
        };
      });
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
