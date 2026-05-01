/**
 * `POST /apps/<proxy>/api/pcon/cart-payload`
 *
 * Cart-add anında frontend bu endpoint'i çağırır. Body:
 *
 *   {
 *     properties: { "PROPCLASS.PROPNAME": "value", ... },
 *     itemId: "<eaiws-item-id>" | null,
 *     articleNumber: "P12.01.101",
 *     manufacturerId: "NRUS",
 *     quantity: 1
 *   }
 *
 * Akış:
 *   1. EAIWS session'ında konfigürasyonu kur (`setPropertyValue` —
 *      stale itemId durumunda article'ı yeniden insert edip retry eder,
 *      mevcut update route ile aynı pattern).
 *   2. `generateCartAssets(itemId)` → fresh OBX URL, attachment image,
 *      catalog image. URL'ler session-bound olduğu için cache'lenmez.
 *   3. `buildCartProperties(articleData, choiceLists)` → güncel static
 *      cart payload (sıralı placeholder'lar dahil).
 *   4. `mergeCartAssets(staticCart, runtime)` → dinamik alanları
 *      (request_id, basket_id, quantity, asset URL'leri) yerleştirir.
 *
 * Response:
 *   {
 *     cartProperties: { ...legacy `finalProperties` formatında ... },
 *     itemId: "<aktif-eaiws-item-id>"
 *   }
 *
 * Frontend bu `cartProperties`'i olduğu gibi `cart/add.js` POST gövdesinin
 * `properties` alanına gömer.
 */

import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  mergeCartAssets,
  generateRequestId,
  generateBasketId,
} from "../services/cart-builder.server";

export async function action({ request }) {
  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    properties,
    itemId,
    articleNumber,
    manufacturerId = "",
    quantity = 1,
  } = body;

  if (!properties || typeof properties !== "object") {
    return Response.json(
      { error: "properties object is required" },
      { status: 400 },
    );
  }

  if (!articleNumber) {
    return Response.json(
      { error: "articleNumber is required" },
      { status: 400 },
    );
  }

  const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

  const propertyList = Object.entries(properties).map(([key, value]) => {
    const [propClass, propName] = key.split(".");
    return { propClass, propName, value };
  });

  try {
    const pcon = getPconClient();

    // 1. Konfigürasyonu kur. itemId yoksa veya stale ise article'ı yeniden
    // insert edip retry et — update route'undaki ile aynı pattern.
    let activeItemId = itemId || null;
    let updateResult;

    const ensureFresh = async () => {
      const fresh = await pcon.getArticleData(articleNumber, manufacturerId);
      activeItemId = fresh.itemId;
      updateResult = await pcon.setPropertyValue(activeItemId, propertyList);
    };

    if (!activeItemId) {
      await ensureFresh();
    } else {
      try {
        updateResult = await pcon.setPropertyValue(activeItemId, propertyList);
      } catch (err) {
        const isStaleItem =
          err.message?.includes("unknown item id") ||
          err.message?.includes("UnknownItemIdException");
        if (!isStaleItem) throw err;
        console.log(
          "[pcon/cart-payload] Stale itemId, re-inserting article...",
        );
        await ensureFresh();
      }
    }

    // 2. Fresh asset URL'leri (OBX, attachment, article image)
    const assets = await pcon.generateCartAssets(activeItemId);

    // 3. Static cartProperties — updateResult'dan al; tazeyiz, eldeki
    //    catalogImage/articleData session-bound ama bu istek scope'unda valid.
    const staticCart = updateResult?.cartProperties || null;

    if (!staticCart) {
      throw new Error("Failed to build static cart properties");
    }

    // 4. Dinamik alanları yerleştir.
    const cartProperties = mergeCartAssets(staticCart, {
      requestId: generateRequestId(),
      basketId: generateBasketId(),
      quantity: safeQuantity,
      attachmentUrl: assets.attachmentUrl,
      obxUrl: assets.obxUrl,
      articleImageUrl: assets.articleImageUrl,
    });

    return Response.json({
      cartProperties,
      itemId: activeItemId,
    });
  } catch (err) {
    console.error("[pcon/cart-payload] Error:", err.message);
    return Response.json(
      {
        error: "Failed to build cart payload",
        detail: err.message,
      },
      { status: 500 },
    );
  }
}
