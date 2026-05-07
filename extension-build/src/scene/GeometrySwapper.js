/**
 * Faz 5 — In-place geometry-delta engine.
 *
 * Sorumluluk:
 *   - Backend `geometry-delta` response'unu mevcut three.js sahnesine GLB
 *     reload OLMADAN uygulamak.
 *   - Removed sub-article'lar için sahnedeki node'u remove + dispose etmek.
 *   - Changed sub-article'lar için yeni GLB'yi yükle, eski node'un
 *     transform'unu kopyala, eski node'u remove + dispose et, yeniyi ekle.
 *   - Added sub-article'lar için yeni GLB'yi yükle ve scene root'una ekle
 *     (transform identity — pCon export'u kendi koordinat sistemini koruyor
 *     varsayımı; uygulanmazsa konum göründüğü yerde sıfırlanır ve operatör
 *     `_fellBackToFullGlb` path'ine yönlendirme yapar).
 *   - SceneIndex'i incremental olarak güncellemek (Map'lere set/delete).
 *
 * Tasarım kararları (paralel: `MaterialSwapper`):
 *   - **Index per-call**: `buildSceneIndex(scene)` her swap'te yeniden
 *     çalışır. Sub-millisecond cost; cache invalidation gereksiz.
 *   - **Paralel load**: GLTFLoader.loadAsync ile changed+added GLB'leri
 *     paralel yüklenir; hepsi hazır olduğunda single tick içinde uygulanır
 *     ve "yarısı eski yarısı yeni" görsel artifacti olmaz.
 *   - **Fail-soft**: bir GLB load başarısız olursa o sub-article skip edilir;
 *     diğerleri uygulanır. Top-level throw yalnızca tüm changed+added
 *     başarısız olursa (caller `error` state'e geçer).
 *   - **Dispose**: removed + changed (eski node) için geometry/material/
 *     texture dispose. `Model.jsx`'in disposeScene/disposeMaterial helper'ları
 *     export değil; burada paralel implementation yapıyoruz (küçük; +30 satır).
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 5 §502-504.
 */

import {
  buildSceneIndex,
  addSubArticleToIndex,
  removeSubArticleFromIndex,
} from "./SceneIndex.js";

const hasPerf =
  typeof performance !== "undefined" && typeof performance.now === "function";
function nowMs() {
  return hasPerf ? performance.now() : Date.now();
}

/**
 * `geometry-delta` response'unu sahneye uygula.
 *
 * @param {object} scene THREE.Group / Scene root (Model.jsx'in published
 *   `sceneRef`'i).
 * @param {{
 *   changedSubArticles?: Array<{id:string, geometryId:string, gltfUrl:string}>,
 *   addedSubArticles?:   Array<{id:string, geometryId:string, gltfUrl:string}>,
 *   removedSubArticles?: Array<string>
 * }} delta Backend response.
 * @param {object} gltfLoader Three.js GLTFLoader instance (DRACOLoader
 *   configured; Model.jsx tarafından store'a publish edilir).
 * @returns {Promise<{
 *   added: number,
 *   removed: number,
 *   changed: number,
 *   failed: number,
 *   durationMs: number
 * }>}
 */
export async function applyGeometryDelta(scene, delta, gltfLoader) {
  const t0 = nowMs();

  const changed = Array.isArray(delta?.changedSubArticles)
    ? delta.changedSubArticles
    : [];
  const added = Array.isArray(delta?.addedSubArticles)
    ? delta.addedSubArticles
    : [];
  const removed = Array.isArray(delta?.removedSubArticles)
    ? delta.removedSubArticles
    : [];

  if (!scene) {
    return { added: 0, removed: 0, changed: 0, failed: 0, durationMs: 0 };
  }
  if (!gltfLoader || typeof gltfLoader.loadAsync !== "function") {
    throw new Error(
      "applyGeometryDelta requires a GLTFLoader instance with loadAsync()",
    );
  }

  const sceneIndex = buildSceneIndex(scene);

  // Step 1 — removed: SceneIndex'ten lookup, parent.remove + dispose.
  let removedCount = 0;
  for (const subArticleId of removed) {
    const nodes = removeSubArticleFromIndex(sceneIndex, subArticleId);
    for (const node of nodes) {
      if (!node) continue;
      const parent = node.parent;
      if (parent && typeof parent.remove === "function") {
        parent.remove(node);
      }
      disposeSubtree(node);
      removedCount++;
    }
  }

  // Step 2 — changed + added GLB'lerini paralel yükle.
  // changed[i] olan eski node ile pair'lenir (transform'u kopyalanır).
  const loadAll = [...changed, ...added];
  const loadResults = await Promise.all(
    loadAll.map((entry) =>
      gltfLoader
        .loadAsync(entry.gltfUrl)
        .then((gltf) => ({ ok: true, entry, gltf }))
        .catch((err) => {
          console.warn(
            `[geometry-swap] load failed for ${entry?.id} (${entry?.gltfUrl}): ${err.message}`,
          );
          return { ok: false, entry, err };
        }),
    ),
  );

  let changedCount = 0;
  let addedCount = 0;
  let failedCount = 0;

  // Step 3 — apply changed: eski node'u bul, transform'unu kopyala, yeniyi
  // aynı parent'a ekle, eskiyi remove + dispose. Lookup `subArticleMap`
  // üzerinden (henüz silinmedi).
  for (let i = 0; i < changed.length; i++) {
    const result = loadResults[i];
    if (!result?.ok) {
      failedCount++;
      continue;
    }
    const { entry, gltf } = result;
    const newRoot = gltf.scene || gltf.scenes?.[0];
    if (!newRoot) {
      failedCount++;
      continue;
    }

    const oldNodes = removeSubArticleFromIndex(sceneIndex, entry.id);
    if (oldNodes.length === 0) {
      // Sub-article ID sahnede yok — fallback: scene root'a ekle (added gibi
      // davran). Pratikte bu olmaz; backend changed listesi sahnede mevcut
      // sub-article'ları işaret eder. Defensive yine de.
      newRoot.userData = newRoot.userData || {};
      newRoot.userData.pconSubArticleId = entry.id;
      newRoot.userData.pconGeometryId = entry.geometryId || null;
      scene.add(newRoot);
      addSubArticleToIndex(sceneIndex, entry.id, newRoot);
      addedCount++;
      continue;
    }

    // İlk eski node'un transform'unu yeniye kopyala (bir sub-article birden
    // fazla mesh'e bölünmüş olabilir ama tek bir replace node'u var; pCon
    // sub-article'ları top-level olarak gltf.scene içinde tek root tutar).
    const anchor = oldNodes[0];
    if (anchor?.parent) {
      newRoot.position.copy(anchor.position);
      newRoot.quaternion.copy(anchor.quaternion);
      newRoot.scale.copy(anchor.scale);
      newRoot.userData = newRoot.userData || {};
      newRoot.userData.pconSubArticleId = entry.id;
      newRoot.userData.pconGeometryId = entry.geometryId || null;

      const parent = anchor.parent;
      parent.add(newRoot);
      // Eski node'lar (anchor dahil) parent'tan çıkar + dispose.
      for (const oldNode of oldNodes) {
        if (oldNode.parent) oldNode.parent.remove(oldNode);
        disposeSubtree(oldNode);
      }
      addSubArticleToIndex(sceneIndex, entry.id, newRoot);
      changedCount++;
    } else {
      // Anchor parent'ı yok (silinmiş?) → defensive add.
      scene.add(newRoot);
      addSubArticleToIndex(sceneIndex, entry.id, newRoot);
      addedCount++;
    }
  }

  // Step 4 — apply added: scene root'una ekle, identity transform.
  for (let i = 0; i < added.length; i++) {
    const result = loadResults[changed.length + i];
    if (!result?.ok) {
      failedCount++;
      continue;
    }
    const { entry, gltf } = result;
    const newRoot = gltf.scene || gltf.scenes?.[0];
    if (!newRoot) {
      failedCount++;
      continue;
    }
    newRoot.userData = newRoot.userData || {};
    newRoot.userData.pconSubArticleId = entry.id;
    newRoot.userData.pconGeometryId = entry.geometryId || null;
    scene.add(newRoot);
    addSubArticleToIndex(sceneIndex, entry.id, newRoot);
    addedCount++;
  }

  const durationMs = Math.round((nowMs() - t0) * 100) / 100;

  console.log(
    `[geometry-swap] removed=${removedCount} changed=${changedCount} added=${addedCount} failed=${failedCount} durationMs=${durationMs}`,
  );

  // Tüm changed+added load fail ettiyse (ve removed yoksa) — caller'ın
  // hata state'ine geçmesi için throw. Aksi halde partial başarı kabul.
  if (
    failedCount > 0 &&
    changedCount === 0 &&
    addedCount === 0 &&
    removedCount === 0
  ) {
    throw new Error(
      `applyGeometryDelta: all ${failedCount} sub-article loads failed`,
    );
  }

  return {
    added: addedCount,
    removed: removedCount,
    changed: changedCount,
    failed: failedCount,
    durationMs,
  };
}

/**
 * Bir Object3D subtree'sindeki tüm geometry/material/texture'ları dispose
 * eder. `Model.jsx`'in disposeScene helper'ıyla paralel; export edilmediği
 * için burada minimal kopyası.
 */
function disposeSubtree(root) {
  if (!root || typeof root.traverse !== "function") return;
  root.traverse((child) => {
    if (!child.isMesh) return;
    if (child.geometry && typeof child.geometry.dispose === "function") {
      try {
        child.geometry.dispose();
      } catch {
        /* dispose throw etmemeli; defensive */
      }
    }
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const mat of mats) {
      disposeMaterial(mat);
    }
  });
}

function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) {
      try {
        value.dispose();
      } catch {
        /* defensive */
      }
    }
  }
  try {
    material.dispose();
  } catch {
    /* defensive */
  }
}
