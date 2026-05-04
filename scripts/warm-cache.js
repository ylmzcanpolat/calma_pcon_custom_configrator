#!/usr/bin/env node

/**
 * CLI cache warmer for pCon 3D Configurator.
 *
 * Usage:
 *   npm run warm-cache                                   # Warm all products (Layer 1+2)
 *   npm run warm-cache -- --article P12.01.101 --manufacturer NRUS
 *   npm run warm-cache -- --layers 1,2                   # Layer 1+2 only
 *   npm run warm-cache -- --layers 1,2,3                 # Full (includes two-prop combos)
 *   npm run warm-cache -- --dry-run                      # Show plan without executing
 *   npm run warm-cache -- --verbose                      # Detailed progress output
 */

import "dotenv/config";
import { warmArticle } from "../app/services/article-warmer.server.js";
import { disconnectRedis } from "../app/services/redis-client.server.js";
import { isCacheWarmingEnabled } from "../app/services/cache-warming-config.server.js";

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    article: null,
    manufacturer: null,
    layers: [1, 2],
    dryRun: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--article":
        opts.article = args[++i];
        break;
      case "--manufacturer":
        opts.manufacturer = args[++i];
        break;
      case "--layers":
        opts.layers = args[++i].split(",").map(Number).filter(Boolean);
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--verbose":
        opts.verbose = true;
        break;
      default:
        if (!args[i].startsWith("--") && !opts.article) {
          opts.article = args[i];
        } else if (!args[i].startsWith("--") && opts.article && !opts.manufacturer) {
          opts.manufacturer = args[i];
        }
        break;
    }
  }
  return opts;
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

async function main() {
  if (!isCacheWarmingEnabled()) {
    console.log(
      "[warm-cache] Disabled: set CACHE_WARMING_ENABLED=1 in the environment to run this script.",
    );
    return;
  }

  const opts = parseArgs(process.argv);
  let articles;

  console.log("[warm-cache] Fetching pCon products from Shopify...");

  if (opts.article) {
    articles = [
      {
        articleNumber: opts.article,
        manufacturerId: opts.manufacturer || "",
        title: opts.article,
      },
    ];
    console.log(`[warm-cache] Using specified article: ${opts.article}`);
  } else {
    try {
      const { fetchPconProducts } = await import(
        "../app/services/product-fetcher.server.js"
      );
      articles = await fetchPconProducts();
    } catch (err) {
      console.error(
        "[warm-cache] Could not fetch from Shopify:",
        err.message,
      );
      console.log("[warm-cache] Falling back to default article");
      articles = [
        { articleNumber: "P12.01.101", manufacturerId: "NRUS", title: "Default Article" },
      ];
    }
  }

  if (articles.length === 0) {
    console.log("[warm-cache] No products to warm.");
    return;
  }

  console.log(`[warm-cache] Found ${articles.length} products with pCon metafields:`);
  articles.forEach((a, i) => {
    console.log(
      `  ${i + 1}. ${a.title || "Unknown"} (${a.articleNumber} / ${a.manufacturerId || "N/A"})`,
    );
  });

  console.log(`[warm-cache] Layers: ${opts.layers.join(", ")}`);
  if (opts.dryRun) console.log("[warm-cache] DRY-RUN mode — no actual warming");
  console.log("");

  let totalWarmed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  const globalStart = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(
      `[warm-cache] [${i + 1}/${articles.length}] Warming: ${article.title || article.articleNumber} (${article.articleNumber})`,
    );

    const progressCallback = opts.verbose
      ? ({ phase, current, total, detail }) => {
          console.log(`[warm-cache]   [${phase}] [${current}/${total}] ${detail}`);
        }
      : undefined;

    try {
      const result = await warmArticle({
        articleNumber: article.articleNumber,
        manufacturerId: article.manufacturerId,
        layers: opts.layers,
        dryRun: opts.dryRun,
        onProgress: progressCallback,
      });

      totalWarmed += result.warmed;
      totalSkipped += result.skipped;
      totalFailed += result.failed;

      console.log(
        `[warm-cache]   ✓ ${article.title || article.articleNumber} done (${formatDuration(result.durationSeconds)})`,
      );
    } catch (err) {
      console.error(
        `[warm-cache]   ✗ Failed for ${article.articleNumber}: ${err.message}`,
      );
    }

    console.log("");
  }

  const totalSeconds = (Date.now() - globalStart) / 1000;
  console.log("[warm-cache] Summary:");
  console.log(`  Products: ${articles.length}`);
  console.log(`  Total warmed: ${totalWarmed}`);
  console.log(`  Total skipped: ${totalSkipped}`);
  console.log(`  Total failed: ${totalFailed}`);
  console.log(`  Total time: ${formatDuration(totalSeconds)}`);
}

main()
  .catch((err) => {
    console.error("[warm-cache] Fatal error:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectRedis().catch(() => {});
    process.exit(process.exitCode || 0);
  });
