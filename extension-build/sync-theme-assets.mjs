/**
 * sync-theme-assets.mjs
 *
 * pCon 3D Configurator extension asset'lerini canlı Liquid temasına
 * (calma) kopyalar. Code-splitting sonrası build birden fazla .js emit
 * ettiği için (configurator-app.js + pcon-chunk-*.js) TÜM emit edilen
 * dosyaların temaya kopyalanması ZORUNLUDUR — aksi halde dinamik import
 * edilen engine chunk'ı 404 verir.
 *
 * Ne kopyalanır:
 *   - configurator-app.js        (ESM giriş — stabil ad)
 *   - pcon-chunk-*.js            (content-hash'li async chunk'lar: engine, excel)
 *   - pcon-*.js / pcon-*.css     (varsa emit edilen diğer chunk/asset'ler)
 *   - configurator.js            (elle yazılan bootloader)
 *   - configurator.css           (stiller)
 *
 * Stale temizlik: temadaki eski pcon-chunk-*.js dosyaları (önceki
 * deploy'lardan kalan hash'ler) kopyalamadan önce silinir; birikmeyi önler.
 *
 * Kullanım:
 *   node extension-build/sync-theme-assets.mjs
 *   CALMA_ASSETS_DIR=/farkli/yol node extension-build/sync-theme-assets.mjs
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename } from "node:path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  rmSync,
  statSync,
} from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SRC_DIR = resolve(__dirname, "../extensions/pcon-3d-configurator/assets");

// Tema assets dizini — CALMA_ASSETS_DIR ile override edilebilir.
const DEST_DIR =
  process.env.CALMA_ASSETS_DIR ||
  resolve(__dirname, "../../../../../shops/nurus/calma/assets");

function fail(msg) {
  console.error(`\x1b[31m[sync-theme-assets] ${msg}\x1b[0m`);
  process.exit(1);
}

if (!existsSync(SRC_DIR)) {
  fail(`Source assets dir not found: ${SRC_DIR}`);
}
if (!existsSync(DEST_DIR)) {
  fail(
    `Theme assets dir not found: ${DEST_DIR}\n` +
      `  Set CALMA_ASSETS_DIR to the correct theme assets path and retry.`,
  );
}

// Kopyalanacak dosyalar: build çıktısı + elle yazılan bootloader/stiller.
// KRİTİK: build chunk'ları YALNIZCA "pcon-chunk-" prefix'iyle eşleşir.
// Bu sayede temanın alakasız "pcon-*.js" dosyaları (ör. pcon-sync.js)
// ne kopyalama ne de stale temizlik tarafından ASLA etkilenmez.
const STATIC_FILES = ["configurator.js", "configurator.css"];
const CHUNK_RE = /^pcon-chunk-.*\.(js|css)$/;
const isBuildJs = (name) =>
  name === "configurator-app.js" || CHUNK_RE.test(name);

const srcFiles = readdirSync(SRC_DIR);
const toCopy = srcFiles.filter(
  (f) => isBuildJs(f) || STATIC_FILES.includes(f),
);

if (!toCopy.includes("configurator-app.js")) {
  fail("configurator-app.js not found in build output — run build first.");
}

// 1) Temadaki stale pcon-chunk-*.js / pcon-*.js dosyalarını temizle.
//    (yalnızca build ürünü hash'li chunk'lar; el yazımı dosyalara dokunulmaz)
let removed = 0;
for (const f of readdirSync(DEST_DIR)) {
  if (CHUNK_RE.test(f) && !toCopy.includes(f)) {
    rmSync(join(DEST_DIR, f));
    removed++;
    console.log(`  - removed stale ${f}`);
  }
}

// 2) Yeni dosyaları kopyala.
let copied = 0;
for (const f of toCopy) {
  const src = join(SRC_DIR, f);
  if (!statSync(src).isFile()) continue;
  copyFileSync(src, join(DEST_DIR, basename(f)));
  copied++;
  console.log(`  + ${f}`);
}

console.log(
  `\x1b[32m[sync-theme-assets] done → ${DEST_DIR}\x1b[0m ` +
    `(${copied} copied, ${removed} stale removed)`,
);
