#!/usr/bin/env node

/**
 * Faz 0 — Material Adı Doğrulama (Go/No-Go)
 *
 * GLB'deki material isimleriyle pCon `getArticleData` property ID'lerini
 * karşılaştırır. %60+ eşleşme → sonraki fazlara devam; altı → dur.
 *
 * Usage:
 *   node scripts/validate-material-mapping.js <glb-path> [properties.json]
 *
 * properties.json formatı: [{id: "PROPCLASS.PROPNAME", ...}, ...]
 * (getArticleData çıktısındaki properties dizisini doğrudan kaydet)
 *
 * Çıktı:
 *   - Toplam material sayısı
 *   - Eşleşen material sayısı ve yüzdesi
 *   - Her material için: name | eşleşen propId | EŞLEŞTI / EŞLEŞMEDI
 *   - Son satır: DEVAM veya DUR kararı
 */

import { readFile } from "fs/promises";
import { resolve } from "path";

import gltfPipelinePkg from "gltf-pipeline";

const _glbToGltf =
  gltfPipelinePkg?.glbToGltf || gltfPipelinePkg?.default?.glbToGltf;

/** "PROPCLASS.PROPNAME" → "propclass_propname" */
function normalizeId(str) {
  return str.toLowerCase().replace(/[._]/g, "_");
}

async function main() {
  const glbArg = process.argv[2];
  const propsArg = process.argv[3];

  if (!glbArg) {
    console.error(
      "Usage: node scripts/validate-material-mapping.js <glb-path> [properties.json]",
    );
    process.exit(2);
  }

  // --- GLB parse ---
  const glbPath = resolve(process.cwd(), glbArg);
  let buffer;
  try {
    buffer = await readFile(glbPath);
  } catch (err) {
    console.error(`GLB okunamadı: ${glbPath}\n${err.message}`);
    process.exit(2);
  }

  if (typeof _glbToGltf !== "function") {
    console.error("gltf-pipeline `glbToGltf` export bulunamadı");
    process.exit(2);
  }

  let gltf;
  try {
    const result = await _glbToGltf(buffer, { keepUnusedElements: true });
    gltf = result.gltf || result;
  } catch (err) {
    console.error(`GLB parse hatası: ${err.message}`);
    process.exit(2);
  }

  const materials = Array.isArray(gltf.materials) ? gltf.materials : [];
  if (materials.length === 0) {
    console.warn("UYARI: GLB içinde hiç material bulunamadı.");
  }

  // --- Properties yükle (opsiyonel) ---
  let propIds = [];
  if (propsArg) {
    const propsPath = resolve(process.cwd(), propsArg);
    try {
      const raw = await readFile(propsPath, "utf8");
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.error("properties.json bir dizi olmalı: [{id: '...', ...}]");
        process.exit(2);
      }
      propIds = parsed
        .map((p) => p?.id)
        .filter(Boolean);
    } catch (err) {
      console.error(`properties.json okunamadı: ${propsPath}\n${err.message}`);
      process.exit(2);
    }
  }

  const normalizedPropIds = propIds.map((id) => ({
    original: id,
    normalized: normalizeId(id),
  }));

  // --- Eşleştirme ---
  const rows = materials.map((mat) => {
    const name = mat?.name || "<unnamed>";
    const normName = normalizeId(name);

    let matchedId = null;
    for (const { original, normalized } of normalizedPropIds) {
      if (normName.includes(normalized) || normalized.includes(normName)) {
        matchedId = original;
        break;
      }
    }

    return { name, matchedId };
  });

  const matchedCount = rows.filter((r) => r.matchedId !== null).length;
  const totalCount = rows.length;
  const pct = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  // --- Çıktı ---
  const COL_NAME = 40;
  const COL_PROP = 36;
  const COL_STATUS = 12;

  const sep = "─".repeat(COL_NAME + COL_PROP + COL_STATUS + 6);

  console.log(sep);
  console.log(`GLB Dosyası : ${glbPath}`);
  console.log(`Properties  : ${propsArg ? resolve(process.cwd(), propsArg) : "(verilmedi — sadece material listesi)"}`);
  console.log(`Toplam mat. : ${totalCount}`);
  if (propIds.length > 0) {
    console.log(`Eşleşen     : ${matchedCount} / ${totalCount}  (${pct}%)`);
  }
  console.log(sep);

  const hdr = [
    "MATERIAL ADI".padEnd(COL_NAME),
    "EŞLEŞEN PROP ID".padEnd(COL_PROP),
    "SONUÇ".padEnd(COL_STATUS),
  ].join(" | ");
  console.log(hdr);
  console.log(sep);

  for (const { name, matchedId } of rows) {
    const col1 = name.slice(0, COL_NAME).padEnd(COL_NAME);
    const col2 = propIds.length === 0
      ? "(prop verilmedi)".padEnd(COL_PROP)
      : (matchedId ?? "—").slice(0, COL_PROP).padEnd(COL_PROP);
    const col3 =
      propIds.length === 0
        ? "—"
        : matchedId !== null
          ? "EŞLEŞTI"
          : "EŞLEŞMEDI";
    console.log(`${col1} | ${col2} | ${col3}`);
  }

  console.log(sep);

  if (propIds.length === 0) {
    console.log(
      "\nNOT: properties.json argümanı verilmedi — eşleştirme yapılamadı.",
    );
    console.log(
      "Komut: node scripts/validate-material-mapping.js <glb> <properties.json>",
    );
    process.exit(0);
  }

  // --- Karar ---
  const THRESHOLD = 60;
  console.log("");
  if (pct >= THRESHOLD) {
    console.log(
      `KARAR: %${pct} eşleşme ≥ %${THRESHOLD} → DEVAM (sonraki fazlara geçilebilir)`,
    );
    process.exit(0);
  } else {
    console.log(
      `KARAR: %${pct} eşleşme < %${THRESHOLD} → DUR (material isimleri uyuşmuyor, plan gözden geçirilmeli)`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("validate-material-mapping fatal:", err);
  process.exit(2);
});
