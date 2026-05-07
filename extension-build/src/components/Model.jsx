import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Box3, Vector3, MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import useConfiguratorStore from "../store/configurator-store.js";
import {
  isIdbEnabled,
  idbGet,
  idbSet,
  extractObjectHash,
} from "../utils/idb-gltf-cache.js";

const MAX_CACHE_ENTRIES = 5;
const FADE_SPEED = 4;

const gltfCache = new Map();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.preload();

const sharedLoader = new GLTFLoader();
sharedLoader.setDRACOLoader(dracoLoader);

function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) {
      value.dispose();
    }
  }
  material.dispose();
}

function disposeScene(scene) {
  if (!scene) return;
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => disposeMaterial(m));
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}

function evictOldestCacheEntry() {
  if (gltfCache.size <= MAX_CACHE_ENTRIES) return;

  let oldestKey = null;
  let oldestTime = Infinity;

  for (const [key, entry] of gltfCache) {
    if (entry._accessTime < oldestTime) {
      oldestTime = entry._accessTime;
      oldestKey = key;
    }
  }

  if (oldestKey) {
    const entry = gltfCache.get(oldestKey);
    if (entry?.scene) {
      disposeScene(entry.scene);
    }
    gltfCache.delete(oldestKey);
  }
}

export default function Model({ url, onProgress }) {
  const [gltf, setGltf] = useState(() => {
    const cached = gltfCache.get(url);
    if (cached) cached._accessTime = Date.now();
    return cached || null;
  });
  const [error, setError] = useState(null);
  const groupRef = useRef();
  const opacityRef = useRef(0);
  const fadeCompleteRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const { camera } = useThree();
  const prevUrlRef = useRef(url);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    if (gltfCache.has(url)) {
      const cached = gltfCache.get(url);
      cached._accessTime = Date.now();
      setGltf(cached);
      if (onProgress) onProgress(100);
      return;
    }

    if (onProgress) onProgress(0);

    // Faz 6 — Network fetch + parse fallback yolu (IDB MISS veya flag OFF).
    // Mevcut davranış bytewise korunur — `sharedLoader.load(...)` üç-callback
    // imzası aynen.
    function loadFromNetwork() {
      sharedLoader.load(
        url,
        (loaded) => {
          if (cancelled) return;
          loaded._accessTime = Date.now();
          gltfCache.set(url, loaded);
          evictOldestCacheEntry();
          setGltf(loaded);
          if (onProgress) onProgress(100);
        },
        (progress) => {
          if (cancelled || !progress.total) return;
          const percent = (progress.loaded / progress.total) * 100;
          if (onProgress) onProgress(Math.round(percent));
        },
        (err) => {
          if (cancelled) return;
          setError(err);
        },
      );
    }

    // Faz 6 — IndexedDB cache (PCON_IDB_CACHE flag-gated, default OFF).
    // Cache HIT: GLB buffer'ı diskten oku; `GLTFLoader.parse(buffer, "")` ile
    // network'e çıkmadan parse et — refresh sonrasında bile mil-saniye
    // seviyesinde paint.
    // Cache MISS veya flag OFF: ham `fetch(url)` ile ArrayBuffer'ı çek,
    // IDB'ye yaz (flag ON ise) ve parse et. Yazma fail-soft (quota → skip).
    // Hash extract edilemezse (non-standard URL) klasik network path'ine düş.
    const idbOn = isIdbEnabled();
    const hash = idbOn ? extractObjectHash(url) : null;

    if (!idbOn || !hash) {
      loadFromNetwork();
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const cachedBuffer = await idbGet(hash);
        if (cancelled) return;

        if (cachedBuffer) {
          // HIT — sahibi `parse` callback'leri sync; cancel için kontrol et.
          sharedLoader.parse(
            cachedBuffer,
            "",
            (loaded) => {
              if (cancelled) return;
              loaded._accessTime = Date.now();
              gltfCache.set(url, loaded);
              evictOldestCacheEntry();
              setGltf(loaded);
              if (onProgress) onProgress(100);
            },
            (err) => {
              if (cancelled) return;
              console.warn(
                "[idb-cache] parse failed; falling back to network:",
                err?.message || err,
              );
              loadFromNetwork();
            },
          );
          return;
        }

        // MISS — fetch + IDB write + parse.
        let response;
        try {
          response = await fetch(url);
        } catch (err) {
          if (cancelled) return;
          console.warn("[idb-cache] fetch failed; using GLTFLoader fallback:", err?.message || err);
          loadFromNetwork();
          return;
        }
        if (cancelled) return;
        if (!response.ok) {
          console.warn("[idb-cache] HTTP " + response.status + "; using GLTFLoader fallback");
          loadFromNetwork();
          return;
        }

        const buf = await response.arrayBuffer();
        if (cancelled) return;

        // Fire-and-forget IDB write (caller-await etmiyoruz; parse'ı bloke
        // etmesin). idbSet zaten flag/error guard'lı.
        idbSet(hash, buf, "gltf");

        sharedLoader.parse(
          buf,
          "",
          (loaded) => {
            if (cancelled) return;
            loaded._accessTime = Date.now();
            gltfCache.set(url, loaded);
            evictOldestCacheEntry();
            setGltf(loaded);
            if (onProgress) onProgress(100);
          },
          (err) => {
            if (cancelled) return;
            setError(err);
          },
        );
      } catch (err) {
        if (cancelled) return;
        console.warn("[idb-cache] unexpected error; using GLTFLoader fallback:", err?.message || err);
        loadFromNetwork();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, onProgress]);

  useEffect(() => {
    const prevUrl = prevUrlRef.current;
    prevUrlRef.current = url;

    if (prevUrl && prevUrl !== url && gltfCache.has(prevUrl)) {
      const entry = gltfCache.get(prevUrl);
      let isStillReferenced = false;

      for (const [key] of gltfCache) {
        if (key !== prevUrl && gltfCache.get(key) === entry) {
          isStillReferenced = true;
          break;
        }
      }

      if (!isStillReferenced && gltfCache.size > MAX_CACHE_ENTRIES) {
        disposeScene(entry.scene);
        gltfCache.delete(prevUrl);
      }
    }
  }, [url]);

  const scene = useMemo(() => (gltf ? gltf.scene.clone(true) : null), [gltf]);

  // Faz 4 — Sahne mount edildiğinde store'a publish et. Store'daki
  // `updateProperty` action'ı `material-patch` response geldiğinde bu
  // referans üzerinden `applyMaterialPatch` çağırır (GLB reload yok).
  // gltfUrl değiştiğinde Model.jsx zaten unmount/remount olur (key={gltfUrl}
  // — bkz. ConfiguratorScene.jsx); o yüzden scene değişimi yeni mount
  // demektir ve sceneRef organik olarak güncellenir.
  const setSceneRef = useConfiguratorStore((s) => s.setSceneRef);
  useEffect(() => {
    if (!scene || typeof setSceneRef !== "function") return;
    setSceneRef(scene);
  }, [scene, setSceneRef]);
  useEffect(
    () => () => {
      if (typeof setSceneRef === "function") setSceneRef(null);
    },
    [setSceneRef],
  );

  // Faz 5 — DRACO-configured GLTFLoader instance'ını store'a publish et.
  // GeometrySwapper sub-article GLB'lerini `gltfLoader.loadAsync(url)` ile
  // yükler; aynı DRACOLoader binding'i sayesinde hem enriched parent
  // GLB'leri hem de sub-article GLB'leri (gerekirse Draco-compressed)
  // tek bir loader üzerinden çözülür. Module-level `sharedLoader` zaten
  // singleton; setGltfLoader idempotent (subscriber'ı yok, re-render
  // tetiklemez).
  const setGltfLoader = useConfiguratorStore((s) => s.setGltfLoader);
  useEffect(() => {
    if (typeof setGltfLoader === "function") setGltfLoader(sharedLoader);
    return () => {
      if (typeof setGltfLoader === "function") setGltfLoader(null);
    };
  }, [setGltfLoader]);

  const restoreMaterials = useCallback((group) => {
    if (!group) return;
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        for (const mat of mats) {
          if (mat._origTransparent !== undefined) {
            mat.transparent = mat._origTransparent;
            mat.needsUpdate = true;
            delete mat._origTransparent;
          }
          if (mat._origOpacity !== undefined) {
            mat.opacity = mat._origOpacity;
            delete mat._origOpacity;
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!scene) return;

    if (groupRef.current) {
      groupRef.current.visible = false;
    }

    opacityRef.current = 0;
    fadeCompleteRef.current = false;

    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    scene.position.sub(center);

    if (gltf?.cameras?.length > 0) {
      const gltfCam = gltf.cameras[0];
      const camNode = gltf.scene.getObjectByProperty("uuid", gltfCam.uuid);
      if (camNode) {
        const worldPos = new Vector3();
        camNode.getWorldPosition(worldPos);
        worldPos.sub(center);
        camera.position.copy(worldPos);
        if (gltfCam.fov) {
          camera.fov = MathUtils.radToDeg(gltfCam.fov);
        }
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        setVisible(true);
        return () => { disposeScene(scene); };
      }
    }

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(fov / 2));

    camera.position.set(
      -distance * 0.35,
      size.y * 0.05,
      distance * 1.5,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    setVisible(true);

    return () => {
      disposeScene(scene);
    };
  }, [scene, camera, gltf]);

  useFrame((_, delta) => {
    if (!groupRef.current || !visible) return;

    if (fadeCompleteRef.current) return;

    opacityRef.current = MathUtils.lerp(opacityRef.current, 1, delta * FADE_SPEED);

    if (opacityRef.current > 0.99) {
      opacityRef.current = 1;
      fadeCompleteRef.current = true;
      restoreMaterials(groupRef.current);
      return;
    }

    groupRef.current.visible = opacityRef.current > 0.01;

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        for (const mat of mats) {
          const isGlass = mat.transparent || mat.opacity < 1 ||
            (mat.transmission !== undefined && mat.transmission > 0);
          if (isGlass && mat._origTransparent === undefined) continue;

          if (mat._origTransparent === undefined) {
            mat._origTransparent = mat.transparent;
            mat._origOpacity = mat.opacity;
          }
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      }
    });
  });

  if (error) {
    throw error;
  }

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef} visible={visible}>
      <primitive object={scene} />
    </group>
  );
}
