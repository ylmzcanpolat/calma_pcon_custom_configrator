/**
 * Faz 4 — Sub-article / material lookup index for an in-memory three.js scene.
 *
 * Sorumluluk:
 *   - Bir GLB sahnesini gezerek pCon sub-article ID'leri ve material adlarını
 *     mesh referanslarına bağlayan Map'leri kurmak.
 *   - `MaterialSwapper.applyMaterialPatch` için patch → target mesh listesi
 *     resolve'unda kullanılan saf bir lookup utility.
 *
 * Kaynak metadata sözleşmesi (Faz 3 — `app/services/gltf-enricher.server.js`):
 *   - Her `gltf.nodes[i]` → `extras.pconSubArticleId`, `extras.pconMaterialName`,
 *     `extras.pconGeometryId`, `extras.pconDepth`, `extras.pconPath`.
 *   - `gltf.scenes[*].extras.pconSubArticles` → flat snapshot listesi.
 *
 * Three.js GLTFLoader davranışı: `extras` alanı her Object3D'nin
 * `userData`'sına kopyalanır (loader üzerine kurulu sözleşme). Bu modül
 * userData üzerinden okur, GLB-spesifik parsing yapmaz.
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 4 §454.
 */

/**
 * Bir THREE.Group sahnesini gezerek lookup map'leri kurar. Pure function;
 * scene mutate edilmez. Çağrı maliyeti `O(n)` (n = sahnedeki node sayısı);
 * tipik bir GLB için sub-millisecond.
 *
 * Indeksleme **mesh ile sınırlı değildir**: `pconSubArticleId` extras'ı
 * gltf-enricher tarafından `gltf.nodes[]` üzerine yazılır ve bu node'lar
 * Three.js'te Group veya Mesh olabilir. Bu nedenle herhangi bir Object3D
 * tipi index'lenir; `findTargetMeshes` daha sonra mesh descendant'ları
 * collect eder.
 *
 * @param {object} scene THREE.Group / THREE.Object3D (GLB scene root).
 * @returns {{
 *   subArticleMap: Map<string, Array<object>>,
 *   materialMap: Map<string, Array<object>>,
 *   propertyTagMap: Map<string, Array<object>>,
 *   sceneSnapshot: Array|null,
 *   sceneRoot: object
 * }}
 */
export function buildSceneIndex(scene) {
  const subArticleMap = new Map();
  const materialMap = new Map();
  const propertyTagMap = new Map();

  if (!scene || typeof scene.traverse !== "function") {
    return {
      subArticleMap,
      materialMap,
      propertyTagMap,
      sceneSnapshot: null,
      sceneRoot: scene || null,
    };
  }

  const sceneSnapshot =
    scene.userData && Array.isArray(scene.userData.pconSubArticles)
      ? scene.userData.pconSubArticles
      : null;

  scene.traverse((node) => {
    const ud = node && node.userData;
    if (!ud || typeof ud !== "object") return;

    if (ud.pconSubArticleId) {
      const id = String(ud.pconSubArticleId);
      let bucket = subArticleMap.get(id);
      if (!bucket) {
        bucket = [];
        subArticleMap.set(id, bucket);
      }
      bucket.push(node);
    }

    if (ud.pconMaterialName) {
      const name = String(ud.pconMaterialName);
      let bucket = materialMap.get(name);
      if (!bucket) {
        bucket = [];
        materialMap.set(name, bucket);
      }
      bucket.push(node);
    }

    if (Array.isArray(ud.pconPropertyTags)) {
      for (const tag of ud.pconPropertyTags) {
        if (!tag) continue;
        const key = String(tag);
        let bucket = propertyTagMap.get(key);
        if (!bucket) {
          bucket = [];
          propertyTagMap.set(key, bucket);
        }
        bucket.push(node);
      }
    }
  });

  return {
    subArticleMap,
    materialMap,
    propertyTagMap,
    sceneSnapshot,
    sceneRoot: scene,
  };
}

/**
 * Bir patch için target mesh listesini resolve eder. Strateji sırası
 * (ilk eşleşmede dur):
 *
 *   1. `patch.targetSelectors` — her selector:
 *        `sub:<id>`     → subArticleMap[id]
 *        `mesh:<glob>`  → ad bazlı regex match (sahnenin tamamında)
 *   2. `pconMaterialName === ${propClass}.${propName}` match.
 *   3. `pconPropertyTags` includes `${propClass}.${propName}` veya `propName`.
 *   4. Hiçbiri yoksa → boş array (caller fallback yapacak; örn. swap atla).
 *
 * Çıkış mesh'leri **uniq**: aynı mesh birden fazla selector ile match olsa
 * bile bir kez döner. Mesh olmayan node'lar (Group, Object3D) traverse
 * edilerek descendant mesh'ler collect edilir.
 *
 * @param {object} sceneIndex `buildSceneIndex` çıktısı.
 * @param {{
 *   propClass?: string,
 *   propName?: string,
 *   targetSelectors?: Array<string>
 * }} patch
 * @returns {Array<object>} Eşsiz mesh listesi.
 */
export function findTargetMeshes(sceneIndex, patch) {
  if (!sceneIndex || !patch) return [];

  const { subArticleMap, materialMap, propertyTagMap, sceneRoot } = sceneIndex;
  const collected = new Set();

  function harvest(nodes) {
    if (!Array.isArray(nodes) || nodes.length === 0) return;
    for (const node of nodes) {
      if (!node) continue;
      if (node.isMesh) {
        collected.add(node);
        continue;
      }
      if (typeof node.traverse === "function") {
        node.traverse((child) => {
          if (child && child.isMesh) collected.add(child);
        });
      }
    }
  }

  // 1) targetSelectors
  if (Array.isArray(patch.targetSelectors) && patch.targetSelectors.length > 0) {
    for (const raw of patch.targetSelectors) {
      if (typeof raw !== "string") continue;
      const selector = raw.trim();
      if (!selector) continue;

      if (selector.startsWith("sub:")) {
        const id = selector.slice(4);
        if (id) harvest(subArticleMap.get(id));
        continue;
      }

      if (selector.startsWith("mesh:")) {
        const pattern = selector.slice(5);
        const re = patternToRegex(pattern);
        if (!re || !sceneRoot || typeof sceneRoot.traverse !== "function") continue;
        sceneRoot.traverse((node) => {
          if (node && node.isMesh && typeof node.name === "string" && re.test(node.name)) {
            collected.add(node);
          }
        });
      }
    }

    if (collected.size > 0) return Array.from(collected);
  }

  // 2) materialMap fallback
  const matKey =
    patch.propClass && patch.propName
      ? `${patch.propClass}.${patch.propName}`
      : null;
  if (matKey) {
    harvest(materialMap.get(matKey));
    if (collected.size > 0) return Array.from(collected);
  }

  // 3) propertyTagMap fallback
  if (matKey) {
    harvest(propertyTagMap.get(matKey));
  }
  if (collected.size === 0 && patch.propName) {
    harvest(propertyTagMap.get(patch.propName));
  }
  if (collected.size > 0) return Array.from(collected);

  // 4) empty — caller handles (skip swap, no error).
  return [];
}

/**
 * Faz 5 — Incremental index update.
 *
 * `GeometrySwapper.applyGeometryDelta` sahneye yeni bir sub-article node
 * eklediğinde, `subArticleMap`'i sıfırdan rebuild etmek yerine sadece
 * yeni mapping'i ekleriz. Bu sayede O(1) cost; büyük sahnelerde
 * `buildSceneIndex`'in O(n) traverse'una göre marjinal kazanç ama
 * arch düzgünlüğü açısından önemli.
 *
 * @param {{subArticleMap:Map}} sceneIndex `buildSceneIndex` çıktısı.
 * @param {string} subArticleId
 * @param {object} node THREE.Object3D (Group veya Mesh).
 */
export function addSubArticleToIndex(sceneIndex, subArticleId, node) {
  if (!sceneIndex || !sceneIndex.subArticleMap || !subArticleId || !node) {
    return;
  }
  const id = String(subArticleId);
  let bucket = sceneIndex.subArticleMap.get(id);
  if (!bucket) {
    bucket = [];
    sceneIndex.subArticleMap.set(id, bucket);
  }
  if (!bucket.includes(node)) bucket.push(node);
}

/**
 * Faz 5 — Incremental index removal.
 *
 * Bir sub-article ID'sine ait tüm node'ları indeksten kaldırır. Caller
 * (`GeometrySwapper`) ayrıca node'u sahne grafiğinden de remove + dispose
 * eder; bu fonksiyon yalnızca lookup map'lerini temiz tutar.
 *
 * @returns {Array<object>} Indeksten silinen node referansları (caller'ın
 *   dispose pipeline'ına geçirmesi için).
 */
export function removeSubArticleFromIndex(sceneIndex, subArticleId) {
  if (!sceneIndex || !sceneIndex.subArticleMap || !subArticleId) {
    return [];
  }
  const id = String(subArticleId);
  const bucket = sceneIndex.subArticleMap.get(id);
  if (!bucket || bucket.length === 0) return [];
  sceneIndex.subArticleMap.delete(id);
  return bucket.slice();
}

/**
 * `mesh:<glob>` selector'undaki pattern'ı regex'e çevirir. Glob sadece `*`
 * (zero-or-more karakter) wildcard'ını destekler; diğer regex meta-karakterleri
 * literal olarak escape edilir.
 */
function patternToRegex(pattern) {
  if (!pattern) return null;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  try {
    return new RegExp(`^${escaped}$`);
  } catch {
    return null;
  }
}
