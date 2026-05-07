/**
 * Faz 4 — In-place material swap engine.
 *
 * Sorumluluk:
 *   - Backend'den gelen `material-patch` response'unu mevcut three.js
 *     sahnesine GLB reload OLMADAN uygulamak.
 *   - Sub-article / material-name index üzerinden target mesh'leri bulmak;
 *     texture'ları paralel yüklemek; eski material/texture'ları sızıntısız
 *     dispose etmek.
 *
 * Tasarım kararları:
 *   - **Index per-call**: `buildSceneIndex(scene)` her swap'te yeniden
 *     çalışır. Sub-millisecond cost; cache invalidation karmaşıklığını
 *     ekleme nedenimiz yok (scene değişmediği sürece sonuç deterministik).
 *   - **Material clone**: orijinal GLTF material paylaşılan referans olabilir
 *     (Three.js scene clone() material refs'i shallow kopyalar). Per-mesh
 *     `material.clone()` ile yan etkisiz swap garanti edilir.
 *   - **Selective dispose**: sadece swap'in OLUŞTURDUĞU material+texture'lar
 *     dispose edilir (`_pconSwapped` / `_pconCreated` flag'leri ile takip).
 *     İlk swap'te orijinal GLTF material'a hiç dokunulmaz; ikinci ve sonraki
 *     swap'lerde önceki clone temizlenir → leak yok, original cache korunur.
 *   - **Fail-soft**: bir patch'in target'ı bulunmazsa veya texture yüklenmezse
 *     fonksiyon throw etmez; counter olarak raporlanır. Caller (store)
 *     state'i normal güncelleyerek görsel-olmayan field'ları (price,
 *     cartProperties) yine de tutar — kabul kriteri 4.
 *
 * Plan referansı: `performance-improvement-plan.md` Faz 4 §432-440.
 */

import { TextureLoader, SRGBColorSpace } from "three";
import { buildSceneIndex, findTargetMeshes } from "./SceneIndex.js";

const sharedTextureLoader = new TextureLoader();

const hasPerf =
  typeof performance !== "undefined" && typeof performance.now === "function";
function nowMs() {
  return hasPerf ? performance.now() : Date.now();
}

/**
 * `material-patch` response'unu sahneye uygula.
 *
 * @param {object} scene THREE.Group / Scene root.
 * @param {{
 *   patches?: Array<{
 *     propClass: string,
 *     propName: string,
 *     value: any,
 *     targetSelectors?: Array<string>,
 *     material: {
 *       baseColorTextureUrl?: string|null,
 *       baseColorFactor?: string|null,
 *       metalness?: number,
 *       roughness?: number
 *     }
 *   }>
 * }} response Backend'den gelen patch JSON'u.
 * @param {object} [textureLoader] Opsiyonel custom TextureLoader; verilmezse
 *   modül singleton'u kullanılır.
 * @returns {Promise<{
 *   patchedMeshCount: number,
 *   failedPatches: number,
 *   skippedPatches: number,
 *   durationMs: number
 * }>}
 */
export async function applyMaterialPatch(scene, response, textureLoader) {
  const t0 = nowMs();

  const patches = Array.isArray(response?.patches) ? response.patches : [];

  if (!scene || patches.length === 0) {
    return {
      patchedMeshCount: 0,
      failedPatches: 0,
      skippedPatches: 0,
      durationMs: 0,
    };
  }

  const loader = textureLoader || sharedTextureLoader;
  const sceneIndex = buildSceneIndex(scene);

  // Step 1 — patch başına target mesh listesi (sync).
  const resolved = patches.map((patch) => ({
    patch,
    meshes: findTargetMeshes(sceneIndex, patch),
  }));

  // Step 2 — texture'ları paralel yükle. Promise.all dışında bekleyen
  // mesh swap'i yok → hepsi hazır olduğunda single frame içinde uygulanır
  // ve "yarısı eski yarısı yeni" görsel artifacti olmaz.
  const texturePromises = patches.map(async (patch) => {
    const url = patch?.material?.baseColorTextureUrl;
    if (!url) return null;
    try {
      const tex = await loader.loadAsync(url);
      // GLB albedo texture'ları sRGB; r3f Canvas zaten outputColorSpace=SRGB
      // ile config'lenmiş (ConfiguratorScene.jsx). Texture seviyesinde de
      // belirtmezsek three.js linear varsayar → renkler yanlış mapping olur.
      tex.colorSpace = SRGBColorSpace;
      // Bu texture'ı bizim oluşturduğumuzu işaretle; sonraki swap'te
      // sadece bu flag'li texture'ları dispose ederiz (orijinal GLB
      // texture'ları korunur).
      tex._pconCreated = true;
      return tex;
    } catch (err) {
      console.warn(
        `[material-swap] texture load failed for ${url}: ${err.message}`,
      );
      return null;
    }
  });

  const textures = await Promise.all(texturePromises);

  // Step 3 — apply per patch (sync, hızlı).
  let patchedMeshCount = 0;
  let failedPatches = 0;
  let skippedPatches = 0;

  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    const meshes = resolved[i].meshes;
    const texture = textures[i];

    if (!meshes || meshes.length === 0) {
      // Hiç target yok → fail-soft. Backend `targetSelectors` boş veya
      // sub-article enrichment olmayan eski GLB → frontend'in mesh-name
      // fallback'i de tutmadı. Patch atlanır, state state-only update'le
      // devam eder (kabul kriteri 4).
      skippedPatches++;
      continue;
    }

    let appliedThisPatch = 0;
    for (const mesh of meshes) {
      try {
        applyToMesh(mesh, patch.material, texture);
        appliedThisPatch++;
      } catch (err) {
        console.warn(
          `[material-swap] apply failed for mesh ${mesh?.name || "?"}: ${err.message}`,
        );
      }
    }

    if (appliedThisPatch === 0) {
      failedPatches++;
    } else {
      patchedMeshCount += appliedThisPatch;
    }
  }

  const durationMs = Math.round((nowMs() - t0) * 100) / 100;

  // Tek satırlık structured log — perf recorder'a entegre olmadan da
  // browser console'unda fark edilebilir olmalı (plan §469: <300 ms hedef).
  console.log(
    `[material-swap] meshCount=${patchedMeshCount} failed=${failedPatches} skipped=${skippedPatches} durationMs=${durationMs}`,
  );

  return {
    patchedMeshCount,
    failedPatches,
    skippedPatches,
    durationMs,
  };
}

/**
 * Bir mesh'e (ya da material array sahibi mesh'e) yeni material'ı uygula.
 * Önceki material'ı **sadece bizim önceki swap'imiz** ise dispose eder
 * (`_pconSwapped` flag'i). Orijinal GLTF material'a hiç dokunulmaz;
 * scene clone'u dispose ettiğinde Model.jsx kendi disposeScene'inde halleder.
 */
function applyToMesh(mesh, materialDef, texture) {
  if (!mesh || !mesh.material) return;

  const wrap = (oldMat) => {
    const cloned = cloneAndPatch(oldMat, materialDef, texture);
    cloned._pconSwapped = true;

    if (oldMat && oldMat._pconSwapped) {
      // Önceki bizim swap'imiz idi → güvenle dispose et (texture dahil).
      disposeSwappedMaterial(oldMat);
    }
    return cloned;
  };

  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map(wrap);
  } else {
    mesh.material = wrap(mesh.material);
  }
}

/**
 * `material.clone()` + patch field'larını yaz. Material'ın orijinal
 * `.map`'i (mevcut texture) shared olabilir; yeni `texture` varsa onu
 * yazıyoruz, yoksa eski map korunuyor (smooth transition; backend texture
 * vermediği durum için graceful).
 */
function cloneAndPatch(material, def, texture) {
  const cloned = material.clone();

  if (texture) {
    cloned.map = texture;
  }

  if (def && typeof def.baseColorFactor === "string" && def.baseColorFactor) {
    if (cloned.color && typeof cloned.color.set === "function") {
      try {
        cloned.color.set(def.baseColorFactor);
      } catch {
        // Geçersiz hex → rengi olduğu gibi bırak.
      }
    }
  }

  if (def && typeof def.metalness === "number" && "metalness" in cloned) {
    cloned.metalness = def.metalness;
  }
  if (def && typeof def.roughness === "number" && "roughness" in cloned) {
    cloned.roughness = def.roughness;
  }

  cloned.needsUpdate = true;
  return cloned;
}

/**
 * Önceki swap'in yarattığı material + texture'ları dispose et. Sadece
 * `_pconCreated` flag'li texture'ları dispose ederiz; orijinal GLB
 * texture'ları (envMap, normalMap vs.) shared olabilir → onlara dokunmayız.
 */
function disposeSwappedMaterial(material) {
  if (!material) return;

  const map = material.map;
  if (map && map._pconCreated) {
    try {
      map.dispose();
    } catch {
      // Three.js dispose throw etmemeli; defensive.
    }
  }

  try {
    material.dispose();
  } catch {
    // Material dispose hatasını yutuyoruz; çağıran swap pipeline'ı
    // bozulmasın.
  }
}
