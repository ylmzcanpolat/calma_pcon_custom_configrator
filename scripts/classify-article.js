#!/usr/bin/env node

/**
 * Faz 1 — Property Classification CLI
 *
 * Bir article için property classification map'ini empirical olarak
 * üretir, terminale tablo halinde basar ve sonucu Redis'e
 * (`pcon:classify:<articleNumber>:<manufacturerId>`, TTL 30 gün) yazar.
 *
 * Usage:
 *   npm run classify -- --article=11.0231.W --manufacturer=NURUS
 *   npm run classify -- --article=11.0231.W                      # mfr opsiyonel
 *
 * Hata durumunda non-zero exit code döner ki CI/script orchestration
 * doğru shakedown yapabilsin.
 */

import "dotenv/config";
import { performance } from "perf_hooks";
import { getPconClient } from "../app/services/pcon-client.server.js";
import {
  classifyEmpirically,
  buildClassificationKey,
} from "../app/services/property-classifier.server.js";
import { disconnectRedis } from "../app/services/redis-client.server.js";

function parseArgs(argv) {
  const opts = { article: null, manufacturer: null };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--article=")) {
      opts.article = a.slice("--article=".length);
    } else if (a === "--article") {
      opts.article = args[++i];
    } else if (a.startsWith("--manufacturer=")) {
      opts.manufacturer = a.slice("--manufacturer=".length);
    } else if (a === "--manufacturer") {
      opts.manufacturer = args[++i];
    } else if (a === "--help" || a === "-h") {
      printUsageAndExit(0);
    }
  }
  return opts;
}

function printUsageAndExit(code) {
  console.log(
    "Usage: npm run classify -- --article=<articleNumber> [--manufacturer=<manufacturerId>]",
  );
  process.exit(code);
}

async function main() {
  const { article, manufacturer } = parseArgs(process.argv);
  if (!article) {
    console.error("[classify-article] --article is required");
    printUsageAndExit(1);
  }

  console.log(
    `[classify-article] Loading properties for ${article}` +
      (manufacturer ? `:${manufacturer}` : "") +
      "...",
  );

  // Property listesini şared pcon-client üzerinden al — empirical
  // classifier kendi bağımsız session'ını ayrıca açacak.
  const pcon = getPconClient();
  const articleStart = performance.now();
  const data = await pcon.getArticleData(article, manufacturer || undefined);
  console.log(
    `[classify-article] Got ${data.properties?.length || 0} properties in ` +
      `${((performance.now() - articleStart) / 1000).toFixed(1)}s`,
  );

  if (!data.properties || data.properties.length === 0) {
    console.warn("[classify-article] No properties found; nothing to classify");
    return { result: {}, properties: [] };
  }

  console.log("[classify-article] Running empirical classifier...");
  const empStart = performance.now();
  const result = await classifyEmpirically(
    article,
    manufacturer || undefined,
    data.properties,
  );
  const empSec = ((performance.now() - empStart) / 1000).toFixed(1);

  // Pretty print: console.table tablo şeklinde gösterir.
  const rows = data.properties.map((p) => ({
    id: p.id,
    label: p.label,
    options: Array.isArray(p.options) ? p.options.length : 0,
    classification: result[p.id] || "(no result)",
  }));
  console.log("\n[classify-article] Result:");
  console.table(rows);

  console.log(
    `\n[classify-article] Empirical took ${empSec}s for ${rows.length} properties`,
  );
  console.log(
    `[classify-article] Redis cache updated → key=${buildClassificationKey(article, manufacturer || undefined)}`,
  );

  return { result, properties: data.properties };
}

main()
  .then(async () => {
    // PCon client + Redis bağlantısını temiz kapat ki Node process exit etsin.
    try {
      await getPconClient().disconnect();
    } catch {
      /* zaten kapalı olabilir */
    }
    try {
      await disconnectRedis();
    } catch {
      /* idem */
    }
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("[classify-article] FAILED:", err.message);
    if (err.stack) console.error(err.stack);
    try {
      await getPconClient().disconnect();
    } catch {
      /* ignore */
    }
    try {
      await disconnectRedis();
    } catch {
      /* ignore */
    }
    process.exit(1);
  });
