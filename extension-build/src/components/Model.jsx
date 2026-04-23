import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Box3, Vector3, MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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
