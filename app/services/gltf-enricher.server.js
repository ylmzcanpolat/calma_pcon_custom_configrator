/**
 * Faz 3 — GLB Sub-Article Hierarchy Enricher
 *
 * Sorumluluk:
 *   - EAIWS `getItemProperties(itemId, { subArticles: true })` yanıtından
 *     DFS-flat bir sub-article snapshot'ı üretmek (`buildSubArticleSnapshot`).
 *   - Bir GLB buffer'ını alıp her node'unun `extras` alanına pCon
 *     sub-article ID + material adı yazmak (`enrichGlbWithSubArticleMetadata`).
 *
 * Tasarım notları:
 *   - Bu modül **fail-soft**: parse veya yazım hatasında orijinal buffer'ı
 *     `enriched: false` ile döndürür ve console.warn ile geçer. Pipeline'ı
 *     asla bozmamalı (plan §422 risk maddesi).
 *   - GLB ↔ sub-article eşlemesi iki katmanlı:
 *       1) `gltf.nodes[]` array'ine DFS sırasıyla yazılır (pCon GLB
 *          export'u sub-article'ları sıralı emit eder; Faz 4 bu sırayı
 *          birinci öncelik olarak okur).
 *       2) Tüm snapshot ek olarak `gltf.scene[*].extras.pconSubArticles`
 *          alanına yazılır; node-order eşleme bozulursa frontend bu
 *          fallback üzerinden lookup yapabilir.
 *   - Mevcut `gltf-pipeline` dependency'si yetiyor; ayrı bir
 *     `@gltf-transform/core` paketi eklemiyoruz (test edildi:
 *     `parseGlb` + `gltfToGlb` node.extras roundtrip'i koruyor).
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 3 §373-422.
 */

import { Buffer } from "buffer";

// gltf-pipeline CommonJS modülü; Node ESM içinde alt-modül `require`
// imkanımız yok, top-level `import` ile namespace alıp default'tan picker.
// `processGlb` = parseGlb + processGltf + gltfToGlb; customStages opsiyonu
// sayesinde aynı pipeline içinde node.extras yazımı + (opsiyonel) Draco
// compression yapabiliyoruz.
import gltfPipelinePkg from "gltf-pipeline";

const _processGlb =
  gltfPipelinePkg?.processGlb || gltfPipelinePkg?.default?.processGlb;

/**
 * EAIWS `getItemProperties([itemId], { subArticles: true })` yanıtından
 * DFS sırasında flat bir snapshot listesi üretir. Snapshot şu şekildedir:
 *
 *   [
 *     { id: "<articleNumber>", geometryId: "...", name: "...",
 *       manufacturerId: "...", depth: 0, path: "0", materials: [],
 *       itemId: "<basket-itemId>" | undefined },
 *     { id: "...", geometryId: "...", ..., depth: 1, path: "0/0" },
 *     ...
 *   ]
 *
 * Top-level item kendisi de listeye girer (depth=0). Sub-article'lar
 * onun altında DFS sırasıyla, `depth` ve `path` indeks-bazlı ID ile.
 *
 * `materials` alanı şimdilik boş array — pCon `ArticleProperties` doğrudan
 * material adı vermez; Faz 2 `getMaterialPatch` veya frontend Faz 4'te
 * material override JSON'undan zenginleştirilebilir. Field'ı snapshot
 * şemasında bulundurmak Faz 4 sözleşmesini stabil tutar.
 *
 * Faz 5 — opsiyonel `basketItemArray` parametresi:
 *   `getAllItems([rootItemId], { subItems: true, geometryIds: true })`
 *   sonucu (flat `Array<BasketItem>`) verilirse her snapshot entry'ine
 *   EAIWS basket'teki **gerçek itemId** alanı eklenir. Eklenme:
 *     1. Top-level entry: `itemPropertiesArray[i].itemId` üzerinden eşlenir.
 *     2. Nested sub-article entry'leri: parent BasketItem'in
 *        `subArticleIds[idx]` order-paralel olarak walk edilir
 *        (ArticleProperties.subArticles ile aynı sırada gelir).
 *
 *   Geriye uyumluluk: `basketItemArray` yoksa `itemId` field'ı `undefined`
 *   bırakılır ve consumer null check yapar (Faz 4 mesh-mapping akışı bu
 *   alana ihtiyaç duymaz).
 *
 * @param {Array} itemPropertiesArray EAIWS getItemProperties dönüşü
 *   (`Array<ItemProperties>`). Tek item bekliyoruz ama loop güvenli.
 * @param {Array} [basketItemArray] EAIWS getAllItems dönüşü
 *   (`Array<BasketItem>`); itemId enrichment için.
 * @returns {Array<{id:string, geometryId:string, name:string,
 *   manufacturerId:string|null, depth:number, path:string, materials:Array,
 *   itemId:string|undefined}>}
 */
export function buildSubArticleSnapshot(itemPropertiesArray, basketItemArray) {
  const out = [];
  if (!Array.isArray(itemPropertiesArray)) return out;

  // Faz 5 — itemId lookup table. Flat `getAllItems(..., { subItems: true })`
  // çıktısı zaten her sub-article için ayrı BasketItem entry'si içerir;
  // itemId → BasketItem map'i ile O(1) lookup yaparız.
  const basketById = Array.isArray(basketItemArray) && basketItemArray.length > 0
    ? new Map(
        basketItemArray
          .filter((b) => b && typeof b.itemId === "string")
          .map((b) => [b.itemId, b]),
      )
    : null;

  function walk(article, basketItem, depth, path) {
    if (!article || typeof article !== "object") return;
    const baseArt = article.baseArticleNumber
      ? String(article.baseArticleNumber)
      : null;
    const geo = article.geometryId ? String(article.geometryId) : null;
    // ID önceliği: baseArticleNumber > geometryId > path. Frontend Faz 4
    // bu ID üzerinden lookup yapacak, dolayısıyla deterministik olmalı.
    const id = baseArt || geo || path;
    out.push({
      id,
      geometryId: geo,
      name: article.shortText ? String(article.shortText) : id,
      manufacturerId: article.manufacturerId
        ? String(article.manufacturerId)
        : null,
      depth,
      path,
      materials: [],
      itemId: basketItem?.itemId,
    });
    if (Array.isArray(article.subArticles)) {
      const subIds = Array.isArray(basketItem?.subArticleIds)
        ? basketItem.subArticleIds
        : [];
      article.subArticles.forEach((sub, idx) => {
        const childBasket =
          basketById && subIds[idx] ? basketById.get(subIds[idx]) : null;
        walk(sub, childBasket, depth + 1, `${path}/${idx}`);
      });
    }
  }

  itemPropertiesArray.forEach((item, idx) => {
    if (!item?.article) return;
    const rootBasket =
      basketById && typeof item.itemId === "string"
        ? basketById.get(item.itemId)
        : null;
    walk(item.article, rootBasket, 0, String(idx));
  });

  return out;
}

/**
 * `gltf.nodes[]` üzerine snapshot entry'lerini DFS sırasıyla yazar.
 * Sub-article sayısı node sayısından az veya çok olabilir; eşleşen
 * indekslere yazılır, fazlası snapshot olarak `scene.extras`'da kalır.
 *
 * Naming convention: node'un mevcut `name` alanı "SubArt_" ile başlamıyorsa
 * üzerine `SubArt_<id>__<material>` yazılır (`material` boşsa sadece
 * `SubArt_<id>`). Frontend `scene.getObjectByName(/^SubArt_<id>/)` ile
 * hızlı lookup yapabilsin (plan §391).
 *
 * @returns {number} kaç node'a extras yazıldı.
 */
function writeNodeExtras(gltf, snapshot) {
  if (!gltf || !Array.isArray(gltf.nodes) || gltf.nodes.length === 0) return 0;
  if (!Array.isArray(snapshot) || snapshot.length === 0) return 0;

  const limit = Math.min(gltf.nodes.length, snapshot.length);
  let written = 0;
  for (let i = 0; i < limit; i++) {
    const node = gltf.nodes[i];
    const entry = snapshot[i];
    if (!node || !entry) continue;

    const existingExtras = node.extras && typeof node.extras === "object"
      ? node.extras
      : {};
    node.extras = {
      ...existingExtras,
      pconSubArticleId: entry.id,
      pconMaterialName: null,
      pconGeometryId: entry.geometryId || null,
      pconDepth: entry.depth,
      pconPath: entry.path,
    };

    // Yalnızca mevcut isim deterministik bir SubArt_ pattern'ı değilse
    // yeniden adlandır; orijinal ad anlamlı olabilir (örn. mesh-author
    // tarafından verilen "Cushion_L"), bu durumda korumayı tercih ediyoruz
    // ve sadece extras yolu üzerinden ID veriyoruz. **Plan §391** node
    // name'i de yazmamızı öneriyor; biz "SubArt_" prefix'ini kullanıyoruz
    // ama orijinali alt suffix olarak saklıyoruz ki debugging mümkün olsun.
    const currentName = typeof node.name === "string" ? node.name : "";
    if (!currentName.startsWith("SubArt_")) {
      const safeId = String(entry.id).replace(/[^A-Za-z0-9_-]/g, "_");
      const suffix = currentName ? `__${currentName}` : "";
      node.name = `SubArt_${safeId}${suffix}`;
    }

    written++;
  }

  // Scene'in extras'ına tüm snapshot'ı yaz — node-order eşleme bozulduysa
  // frontend Faz 4 bu fallback üzerinden lookup yapabilir.
  if (Array.isArray(gltf.scenes)) {
    for (const scene of gltf.scenes) {
      if (!scene) continue;
      const sceneExtras =
        scene.extras && typeof scene.extras === "object" ? scene.extras : {};
      scene.extras = { ...sceneExtras, pconSubArticles: snapshot };
    }
  }

  return written;
}

/**
 * Bir GLB buffer'ını alıp pCon sub-article metadata'sıyla enrich eder.
 *
 * Davranış:
 *   - subArticleTree boş veya geçersizse → noop (`enriched: false`).
 *   - GLB parse hatası → fail-soft, orijinal buffer döner.
 *   - Aksi takdirde → `gltf.nodes[i].extras` ve `gltf.scenes[*].extras`
 *     yazılır, geri serialize edilir.
 *
 * `subArticleTree` parametresi iki şekilde kabul edilir:
 *   1. Ham EAIWS `Array<ItemProperties>` (recursive tree) — bu durumda
 *      içeride `buildSubArticleSnapshot` ile flatten'lanır.
 *   2. `buildSubArticleSnapshot` çıktısı flat array — direkt kullanılır.
 *
 * @param {Buffer} glbBuffer Ham veya Draco-compressed GLB.
 * @param {Array} subArticleTree Yukarıdaki iki formdan biri.
 * @param {object} [opts]
 * @param {boolean} [opts.compressDraco=false] true ise enrich + Draco
 *   compress tek geçişte yapılır (processGlb pipeline). Caller `cacheGltf`
 *   içinde Draco'yu önceden uyguluyorsa false bırakır.
 * @returns {Promise<{ buffer: Buffer, enriched: boolean, nodesWritten: number,
 *   subArticleCount: number }>}
 */
export async function enrichGlbWithSubArticleMetadata(
  glbBuffer,
  subArticleTree,
  opts = {},
) {
  const compressDraco = opts.compressDraco === true;

  if (!Buffer.isBuffer(glbBuffer) || glbBuffer.length === 0) {
    return { buffer: glbBuffer, enriched: false, nodesWritten: 0, subArticleCount: 0 };
  }

  // Snapshot normalleştirmesi: ham EAIWS array geldiyse flatten;
  // zaten flat-friendly entry'lerse olduğu gibi al.
  let snapshot;
  if (Array.isArray(subArticleTree) && subArticleTree.length > 0) {
    const first = subArticleTree[0];
    if (first && typeof first === "object" && "article" in first) {
      snapshot = buildSubArticleSnapshot(subArticleTree);
    } else if (
      first &&
      typeof first === "object" &&
      ("id" in first || "geometryId" in first || "path" in first)
    ) {
      snapshot = subArticleTree;
    } else {
      snapshot = [];
    }
  } else {
    snapshot = [];
  }

  if (snapshot.length === 0) {
    return { buffer: glbBuffer, enriched: false, nodesWritten: 0, subArticleCount: 0 };
  }

  if (typeof _processGlb !== "function") {
    console.warn(
      "[gltf-enricher] gltf-pipeline `processGlb` export missing; skipping enrichment",
    );
    return {
      buffer: glbBuffer,
      enriched: false,
      nodesWritten: 0,
      subArticleCount: snapshot.length,
    };
  }

  try {
    // Tek geçiş: customStage içinde node extras yaz; opsiyonel olarak
    // Draco compress da uygulanır. `keepUnusedElements: true` — extras
    // eklediğimiz nodes referanssız olsa bile silinmesin (production
    // GLB'lerde nadiren olur, ama enrichment akışı için güvenli default).
    let nodesWritten = 0;
    const processOpts = {
      keepUnusedElements: true,
      customStages: [
        (gltf) => {
          nodesWritten = writeNodeExtras(gltf, snapshot);
        },
      ],
    };
    if (compressDraco) {
      processOpts.dracoOptions = { compressionLevel: 7 };
    }

    const result = await _processGlb(glbBuffer, processOpts);
    const buffer = Buffer.isBuffer(result.glb)
      ? result.glb
      : Buffer.from(result.glb);
    return {
      buffer,
      enriched: true,
      nodesWritten,
      subArticleCount: snapshot.length,
    };
  } catch (err) {
    console.warn(
      `[gltf-enricher] enrichment failed (${err.message}); returning original buffer`,
    );
    return {
      buffer: glbBuffer,
      enriched: false,
      nodesWritten: 0,
      subArticleCount: snapshot.length,
    };
  }
}
