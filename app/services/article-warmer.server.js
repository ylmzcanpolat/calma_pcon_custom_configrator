import "@easterngraphics/wcf/modules/polyfill/xmldom/index.js";
import { EaiwsSession } from "@easterngraphics/wcf/modules/eaiws/index.js";
import { InsertInfo } from "@easterngraphics/wcf/modules/eaiws/basket/index.js";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "./redis-client.server.js";
import { cacheGltf } from "./gltf-cache.server.js";
import { mapProperties } from "./property-mapper.server.js";
import { isSkippablePropertyError } from "./pcon-client.server.js";
import { buildCartProperties } from "./cart-builder.server.js";

const GATEKEEPER_URL = "https://gatekeeper.eaiws.pcon-solutions.com/v2";
const GATEKEEPER_ID = process.env.PCON_GATEKEEPER_ID || "";
const SESSION_LOCALE = process.env.PCON_LOCALE || "tr_TR";
const WARM_CONCURRENCY = parseInt(
  process.env.CACHE_WARM_CONCURRENCY || "2",
  10,
);
const MAX_RETRIES = 1;

/**
 * Warm a single article with layered strategy.
 *
 * @param {object} opts
 * @param {string} opts.articleNumber
 * @param {string} [opts.manufacturerId]
 * @param {number[]} [opts.layers] - Which layers to run (default [1,2])
 * @param {boolean} [opts.dryRun] - If true, compute what would be warmed without executing
 * @param {function} [opts.onProgress] - Progress callback ({ phase, current, total, detail })
 * @returns {Promise<WarmResult>}
 */
export async function warmArticle({
  articleNumber,
  manufacturerId,
  layers = [1, 2],
  dryRun = false,
  onProgress,
}) {
  const log = (msg) => console.log(`[article-warmer] ${msg}`);
  const progress = onProgress || (() => {});

  if (!GATEKEEPER_ID) {
    throw new Error("PCON_GATEKEEPER_ID is not set");
  }

  log(`Connecting to Gatekeeper...`);
  const gkRes = await fetch(`${GATEKEEPER_URL}/session/${GATEKEEPER_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: SESSION_LOCALE }),
  });

  if (!gkRes.ok) {
    const body = await gkRes.text().catch(() => "");
    throw new Error(`Gatekeeper error: ${gkRes.status} ${body}`);
  }

  const gk = await gkRes.json();
  log(`Gatekeeper OK → server=${gk.server}`);

  const session = new EaiwsSession();
  session.connect(gk.server, gk.sessionId, 60000);

  const startTime = Date.now();
  const stats = {
    articleNumber,
    lastWarmed: new Date().toISOString(),
    totalCombinations: 0,
    warmed: 0,
    skipped: 0,
    failed: 0,
    durationSeconds: 0,
  };

  try {
    log(
      `Inserting article ${articleNumber} (mfr=${manufacturerId || "N/A"})...`,
    );
    const topFolder = await session.basket.getTopFolderId();
    const info = new InsertInfo();
    info.baseArticleNumber = articleNumber;
    if (manufacturerId) info.manufacturerId = manufacturerId;
    const itemId = await session.basket.insertOFMLArticle(
      topFolder,
      null,
      info,
    );
    log(`Article inserted → itemId=${itemId}`);

    // --- Layer 1: Default config (init) ---
    if (layers.includes(1)) {
      progress({ phase: "layer1", current: 0, total: 1, detail: "Init data" });

      const initKey = generateCacheKey("init", {
        articleNumber,
        manufacturerId: manufacturerId || "",
      });

      const existingInit = await cacheGet(initKey);
      if (existingInit) {
        stats.skipped++;
        log(`Layer 1: Init data... CACHED`);
        progress({
          phase: "layer1",
          current: 1,
          total: 1,
          detail: "CACHED",
        });
      } else if (dryRun) {
        stats.totalCombinations++;
        log(`Layer 1: Init data... DRY-RUN (would warm)`);
      } else {
        log(`Layer 1: Init data...`);
        const [articleData, choiceLists, gltfUrl] = await Promise.all([
          session.basket.getArticleData(itemId, {
            fetchCatalogImage: true,
            enableBooleanPropType: true,
          }),
          session.basket.getAllChoiceLists(itemId, {
            fetchCatalogImage: true,
            enableBooleanPropType: true,
          }),
          session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
        ]);
        const currency =
          articleData.currency || (await session.basket.getCurrency());
        const price =
          articleData.pdSalesPrice ?? articleData.pdPurchasePrice ?? 0;

        const properties = await mapProperties(articleData, choiceLists);
        const localGltf = await cacheGltf(gltfUrl);
        const cartProperties = buildCartProperties(articleData, choiceLists);

        await cacheSet(initKey, {
          price,
          gltfUrl: localGltf,
          originalGltfUrl: gltfUrl,
          properties,
          currency,
          itemId,
          cartProperties,
        });
        stats.warmed++;
        stats.totalCombinations++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`Layer 1: Init data... OK (${elapsed}s)`);
        progress({
          phase: "layer1",
          current: 1,
          total: 1,
          detail: `OK (${elapsed}s)`,
        });
      }
    }

    const [articleData, choiceLists] = await Promise.all([
      session.basket.getArticleData(itemId, {
        fetchCatalogImage: true,
        enableBooleanPropType: true,
      }),
      session.basket.getAllChoiceLists(itemId, {
        fetchCatalogImage: true,
        enableBooleanPropType: true,
      }),
    ]);
    const currency =
      articleData.currency || (await session.basket.getCurrency());

    const properties = await mapProperties(articleData, choiceLists);
    const baseProps = {};
    for (const p of properties) {
      if (p.currentValue) baseProps[p.id] = p.currentValue;
    }

    const editableProps = properties.filter(
      (p) => p.editable && p.options && p.options.length > 1,
    );

    // --- Layer 2: Single property changes ---
    if (layers.includes(2)) {
      const layer2Combos = buildLayer2Combinations(
        editableProps,
        baseProps,
        articleNumber,
        manufacturerId,
      );

      log(
        `Layer 2: ${layer2Combos.length} single-property combinations to warm`,
      );
      stats.totalCombinations += layer2Combos.length;

      if (dryRun) {
        log(`Layer 2: DRY-RUN — ${layer2Combos.length} combinations skipped`);
      } else {
        const layer2Result = await warmCombinations({
          session,
          itemId,
          combinations: layer2Combos,
          currency,
          log,
          progress,
          phase: "layer2",
        });
        stats.warmed += layer2Result.warmed;
        stats.skipped += layer2Result.skipped;
        stats.failed += layer2Result.failed;
      }
    }

    // --- Layer 3: Two-property combinations ---
    if (layers.includes(3)) {
      const layer3Combos = buildLayer3Combinations(
        editableProps,
        baseProps,
        articleNumber,
        manufacturerId,
      );

      log(
        `Layer 3: ${layer3Combos.length} two-property combinations to warm`,
      );
      stats.totalCombinations += layer3Combos.length;

      if (dryRun) {
        log(`Layer 3: DRY-RUN — ${layer3Combos.length} combinations skipped`);
      } else {
        const layer3Result = await warmCombinations({
          session,
          itemId,
          combinations: layer3Combos,
          currency,
          log,
          progress,
          phase: "layer3",
        });
        stats.warmed += layer3Result.warmed;
        stats.skipped += layer3Result.skipped;
        stats.failed += layer3Result.failed;
      }
    }

    stats.durationSeconds = parseFloat(
      ((Date.now() - startTime) / 1000).toFixed(1),
    );

    // Save warming metadata to Redis
    const metaKey = `pcon:warm:status:${articleNumber}`;
    await cacheSet(metaKey, stats, 7 * 86400);

    log(
      `Completed: warmed=${stats.warmed}, skipped=${stats.skipped}, failed=${stats.failed}, total time=${stats.durationSeconds}s`,
    );

    return stats;
  } finally {
    session.disconnect();
  }
}

function buildLayer2Combinations(
  editableProps,
  baseProps,
  articleNumber,
  manufacturerId,
) {
  const combos = [];
  for (const prop of editableProps) {
    for (const opt of prop.options) {
      if (!opt.available || opt.value === prop.currentValue) continue;
      const propsToCache = { ...baseProps, [prop.id]: opt.value };
      const cacheKey = generateCacheKey("update", {
        articleNumber: articleNumber || "",
        manufacturerId: manufacturerId || "",
        ...propsToCache,
      });
      combos.push({
        cacheKey,
        propsToCache,
        label: `${prop.id}=${opt.value}`,
      });
    }
  }
  return combos;
}

function buildLayer3Combinations(
  editableProps,
  baseProps,
  articleNumber,
  manufacturerId,
) {
  const combos = [];
  const topProps = editableProps.slice(0, 3);

  for (let i = 0; i < topProps.length; i++) {
    for (let j = i + 1; j < topProps.length; j++) {
      const propA = topProps[i];
      const propB = topProps[j];

      for (const optA of propA.options) {
        if (!optA.available) continue;
        for (const optB of propB.options) {
          if (!optB.available) continue;
          if (
            optA.value === propA.currentValue &&
            optB.value === propB.currentValue
          )
            continue;

          const propsToCache = {
            ...baseProps,
            [propA.id]: optA.value,
            [propB.id]: optB.value,
          };
          const cacheKey = generateCacheKey("update", {
            articleNumber: articleNumber || "",
            manufacturerId: manufacturerId || "",
            ...propsToCache,
          });
          combos.push({
            cacheKey,
            propsToCache,
            label: `${propA.id}=${optA.value} & ${propB.id}=${optB.value}`,
          });
        }
      }
    }
  }
  return combos;
}

/**
 * Warm a list of combinations with concurrency control and retry.
 */
async function warmCombinations({
  session,
  itemId,
  combinations,
  currency,
  log,
  progress,
  phase,
}) {
  let warmed = 0;
  let skipped = 0;
  let failed = 0;
  let completed = 0;
  const total = combinations.length;

  const queue = [...combinations];

  async function worker() {
    while (queue.length > 0) {
      const combo = queue.shift();
      if (!combo) break;
      completed++;

      const existing = await cacheGet(combo.cacheKey);
      if (existing) {
        skipped++;
        log(`[${completed}/${total}] SKIP (cached) ${combo.label}`);
        progress({
          phase,
          current: completed,
          total,
          detail: `CACHED ${combo.label}`,
        });
        continue;
      }

      let success = false;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const comboStart = Date.now();
          log(
            `[${completed}/${total}] Warming ${combo.label}${attempt > 0 ? ` (retry ${attempt})` : ""}...`,
          );

          const propertyList = Object.entries(combo.propsToCache).map(
            ([key, value]) => {
              const [propClass, propName] = key.split(".");
              return { propClass, propName, value };
            },
          );

          for (const { propClass, propName, value } of propertyList) {
            if (value === null || value === undefined || value === "") {
              continue;
            }

            try {
              await session.basket.setPropertyValue(
                itemId,
                propClass,
                propName,
                value,
              );
            } catch (propErr) {
              if (isSkippablePropertyError(propErr)) {
                continue;
              }
              throw propErr;
            }
          }

          const [updatedData, updatedChoices, updatedGltf] = await Promise.all([
            session.basket.getArticleData(itemId, {
              fetchCatalogImage: true,
              enableBooleanPropType: true,
            }),
            session.basket.getAllChoiceLists(itemId, {
              fetchCatalogImage: true,
              enableBooleanPropType: true,
            }),
            session.basket.getExportedGeometry(itemId, ["format=GLTF"]),
          ]);
          const updatedLocalGltf = await cacheGltf(updatedGltf);
          const updatedPrice =
            updatedData.pdSalesPrice ?? updatedData.pdPurchasePrice ?? 0;

          const updatedProperties = await mapProperties(
            updatedData,
            updatedChoices,
          );
          const updatedCartProperties = buildCartProperties(
            updatedData,
            updatedChoices,
          );

          await cacheSet(combo.cacheKey, {
            price: updatedPrice,
            gltfUrl: updatedLocalGltf,
            originalGltfUrl: updatedGltf,
            properties: updatedProperties,
            currency,
            cartProperties: updatedCartProperties,
          });

          warmed++;
          const elapsed = ((Date.now() - comboStart) / 1000).toFixed(1);
          log(`[${completed}/${total}] OK ${combo.label} (${elapsed}s)`);
          progress({
            phase,
            current: completed,
            total,
            detail: `OK ${combo.label} (${elapsed}s)`,
          });
          success = true;
          break;
        } catch (err) {
          if (attempt < MAX_RETRIES) {
            log(
              `[${completed}/${total}] RETRY ${combo.label}: ${err.message}`,
            );
            await new Promise((r) => setTimeout(r, 1000));
          } else {
            console.warn(
              `[article-warmer] [${completed}/${total}] FAIL ${combo.label}: ${err.message}`,
            );
            progress({
              phase,
              current: completed,
              total,
              detail: `FAIL ${combo.label}`,
            });
          }
        }
      }

      if (!success) failed++;
    }
  }

  const workers = [];
  const concurrency = Math.min(WARM_CONCURRENCY, combinations.length);
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  const phaseLabel = phase.replace("layer", "Layer ");
  log(`${phaseLabel} complete: ${warmed} warmed, ${skipped} cached, ${failed} failed`);

  return { warmed, skipped, failed };
}

