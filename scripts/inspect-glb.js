#!/usr/bin/env node

/**
 * Faz 3 — GLB Inspector
 *
 * Bir GLB dosyasını parse eder ve `nodes[i].extras.pconSubArticleId`,
 * `pconMaterialName`, vb. Faz 3 metadata'sının yazılıp yazılmadığını
 * raporlar. Frontend Faz 4 öncesi enrich işleminin doğruluğunu manuel
 * doğrulamak için (plan §414-417 KK1/KK2).
 *
 * Usage:
 *   node scripts/inspect-glb.js <path-to-glb>
 *   node scripts/inspect-glb.js .cache/gltf/abc123.enriched.glb
 *
 * Çıktı:
 *   - Toplam node sayısı
 *   - Kaç node'da `pconSubArticleId` bulunduğu
 *   - İlk 10 node için isim + extras snapshot
 *   - `scenes[*].extras.pconSubArticles` snapshot uzunluğu
 */

import { readFile } from "fs/promises";
import { resolve } from "path";

import gltfPipelinePkg from "gltf-pipeline";

const _glbToGltf =
  gltfPipelinePkg?.glbToGltf || gltfPipelinePkg?.default?.glbToGltf;

async function main() {
  const argPath = process.argv[2];
  if (!argPath) {
    console.error("Usage: node scripts/inspect-glb.js <path-to-glb>");
    process.exit(2);
  }

  const fullPath = resolve(process.cwd(), argPath);
  let buffer;
  try {
    buffer = await readFile(fullPath);
  } catch (err) {
    console.error(`Failed to read ${fullPath}: ${err.message}`);
    process.exit(2);
  }

  // `glbToGltf` Draco-compressed GLB'yi de güvenle parse eder ve gltf JSON
  // döner (bizim için sadece okuma — customStages/dracoOptions yok).
  // `keepUnusedElements: true` enriched node'ların silinmemesini garanti eder.
  let gltf;
  try {
    if (typeof _glbToGltf !== "function") {
      console.error("gltf-pipeline `glbToGltf` export missing");
      process.exit(2);
    }
    const result = await _glbToGltf(buffer, { keepUnusedElements: true });
    gltf = result.gltf || result;
  } catch (err) {
    console.error(`GLB parse failed: ${err.message}`);
    process.exit(2);
  }

  const nodes = Array.isArray(gltf.nodes) ? gltf.nodes : [];
  const enrichedNodes = nodes.filter(
    (n) => n?.extras && n.extras.pconSubArticleId,
  );
  const sceneSnap =
    Array.isArray(gltf.scenes) &&
    gltf.scenes[0]?.extras?.pconSubArticles
      ? gltf.scenes[0].extras.pconSubArticles
      : null;

  console.log("─".repeat(60));
  console.log(`GLB:                ${fullPath}`);
  console.log(`File size (bytes):  ${buffer.length}`);
  console.log(`Total nodes:        ${nodes.length}`);
  console.log(`Enriched nodes:     ${enrichedNodes.length}`);
  console.log(
    `Scene snapshot:     ${sceneSnap ? `${sceneSnap.length} entries` : "absent"}`,
  );
  console.log(
    `extensionsUsed:     ${(gltf.extensionsUsed || []).join(", ") || "<none>"}`,
  );
  console.log("─".repeat(60));

  const sample = nodes.slice(0, 10);
  console.log(`First ${sample.length} nodes:`);
  for (let i = 0; i < sample.length; i++) {
    const n = sample[i];
    const extrasStr = n?.extras
      ? JSON.stringify(n.extras).slice(0, 200)
      : "<no extras>";
    console.log(`  [${i}] name="${n?.name || ""}" extras=${extrasStr}`);
  }

  if (sceneSnap) {
    console.log("");
    console.log(`scene[0].extras.pconSubArticles (first 5):`);
    for (const entry of sceneSnap.slice(0, 5)) {
      console.log(`  - ${JSON.stringify(entry)}`);
    }
  }

  // Exit code semantics for CI: 0 if at least one node enriched OR scene
  // snapshot present; 1 if neither (enrichment never ran on this file).
  if (enrichedNodes.length === 0 && !sceneSnap) {
    console.log("");
    console.log("WARN: no Faz 3 metadata detected on this GLB");
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("inspect-glb fatal:", err);
  process.exit(2);
});
