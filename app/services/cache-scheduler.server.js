import cron from "node-cron";
import { fetchPconProducts } from "./product-fetcher.server.js";
import { warmArticle } from "./article-warmer.server.js";
import { cacheSet } from "./redis-client.server.js";

const CRON_SCHEDULE = process.env.CACHE_WARM_CRON || "0 3,15 * * *";
let scheduled = false;

export function startCacheScheduler() {
  if (scheduled) return;
  scheduled = true;

  if (!cron.validate(CRON_SCHEDULE)) {
    console.error(
      `[cache-scheduler] Invalid cron expression: ${CRON_SCHEDULE}`,
    );
    return;
  }

  cron.schedule(CRON_SCHEDULE, () => {
    runWarmingCycle().catch((err) => {
      console.error("[cache-scheduler] Warming cycle failed:", err.message);
    });
  });

  console.log(`[cache-scheduler] Scheduled cache warming: ${CRON_SCHEDULE}`);
}

export async function runWarmingCycle({ layers = [1, 2], dryRun = false, verbose = false, onProgress } = {}) {
  const startTime = Date.now();
  console.log("[cache-scheduler] Starting warming cycle...");

  let articles;
  try {
    articles = await fetchPconProducts();
  } catch (err) {
    console.error("[cache-scheduler] Failed to fetch products:", err.message);
    return { success: false, error: err.message };
  }

  if (articles.length === 0) {
    console.log("[cache-scheduler] No products with pCon metafields found.");
    return { success: true, products: 0, totalWarmed: 0, totalSkipped: 0, totalFailed: 0 };
  }

  console.log(
    `[cache-scheduler] Found ${articles.length} product(s) with pCon metafields`,
  );

  if (verbose) {
    articles.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.title || "Unknown"} (${a.articleNumber} / ${a.manufacturerId || "N/A"})`);
    });
  }

  let totalWarmed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(
      `[cache-scheduler] [${i + 1}/${articles.length}] Warming: ${article.title || article.articleNumber} (${article.articleNumber})`,
    );
    try {
      const result = await warmArticle({
        ...article,
        layers,
        dryRun,
        onProgress: onProgress || (verbose ? defaultProgressLogger : undefined),
      });
      totalWarmed += result.warmed;
      totalSkipped += result.skipped;
      totalFailed += result.failed;
      results.push({ ...result, status: "ok" });
    } catch (err) {
      console.error(
        `[cache-scheduler] Failed: ${article.articleNumber} - ${err.message}`,
      );
      results.push({
        articleNumber: article.articleNumber,
        status: "error",
        error: err.message,
      });
    }
  }

  const elapsed = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));
  console.log(
    `[cache-scheduler] Done in ${elapsed}s: ${articles.length} products, ${totalWarmed} warmed, ${totalSkipped} skipped, ${totalFailed} failed`,
  );

  const summary = {
    success: true,
    products: articles.length,
    totalWarmed,
    totalSkipped,
    totalFailed,
    elapsedSeconds: elapsed,
    results,
    timestamp: new Date().toISOString(),
  };

  try {
    await cacheSet("pcon:warm:last-cycle", summary, 7 * 86400);
  } catch {
    // non-critical
  }

  return summary;
}

function defaultProgressLogger({ phase, current, total, detail }) {
  console.log(`  [${phase}] [${current}/${total}] ${detail}`);
}
