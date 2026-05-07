import { authenticate } from "../shopify.server";
import { getPconClient } from "../services/pcon-client.server";
import {
  generateCacheKey,
  cacheGet,
  cacheSet,
} from "../services/redis-client.server";
import { cacheGltf, upgradeCacheEntryWithLocalGltf } from "../services/gltf-cache.server";
import { warmCacheInBackground } from "../services/cache-warmer.server";
import { isCacheWarmingEnabled } from "../services/cache-warming-config.server";
import {
  createPerfTimer,
  recordTimerSamples,
} from "../services/perf-logger.server";
import { classifyProperties } from "../services/property-classifier.server";
import { buildSubArticleSnapshot } from "../services/gltf-enricher.server";

const LOCAL_GLTF_PREFIX = "/apps/pcon-configurator/gltf/";

/**
 * Sync GLB enrichment sadece Faz 4/5 frontend yolları aktifken faydalı:
 * mesh-mapping olmadığı sürece enriched extras boşa CPU/disk maliyeti
 * üretir. Default'ta (material-patch + geometry-delta OFF) fire-and-forget
 * davranışına dön → init süresi ~7s yavaşlama yaşamaz.
 *
 * Her iki feature flag'den biri açıksa sync enrichment yine devreye girer
 * (frontend SceneIndex pconSubArticleId metadata'sına ihtiyaç duyar).
 */
function shouldEnrichSync() {
  // eslint-disable-next-line no-undef
  return (
    process.env.PCON_MATERIAL_PATCH_ENABLED === "true" ||
    process.env.PCON_GEOMETRY_DELTA_ENABLED === "true"
  );
}

export async function loader({ request }) {
  // Faz 0 telemetry: tüm loader path'i tek bir timer altında. `Server-Timing`
  // header'ı response'a iliştirilir; structured log tek satır console.log.
  const timer = createPerfTimer("pcon/init");

  await authenticate.public.appProxy(request);
  timer.mark("auth");

  const url = new URL(request.url);
  const articleNumber = url.searchParams.get("articleNumber");
  const manufacturerId = url.searchParams.get("manufacturerId");

  if (!articleNumber) {
    return Response.json(
      { error: "articleNumber is required" },
      { status: 400 },
    );
  }

  const cacheKey = generateCacheKey("init", {
    articleNumber,
    manufacturerId: manufacturerId || "",
  });

  const cached = await cacheGet(cacheKey);
  timer.mark("cache.lookup");
  // Cache versioning: yeni format `_request_id` placeholder'ı içerir
  // (cart-payload endpoint'inde overwrite edilir). Eski entry'ler bu
  // placeholder'a sahip olmayabilir (deploy öncesi yazılmış); o durumda
  // cache atlanıp tazelenir, böylece legacy anahtar sırası garanti edilir.
  if (
    cached &&
    cached.cartProperties &&
    cached.cartProperties._request_id !== undefined
  ) {
    // GLB URL seçimi:
    //   - cached.gltfUrl zaten enriched local ise → kullan.
    //   - Faz 4/5 ON ise → sync enrich + cache promote (bir sonraki HIT
    //     instant döner).
    //   - Faz 4/5 OFF ise (default) → fire-and-forget; raw cache local URL
    //     veya pCon CDN URL ile devam et (mesh-mapping zaten devre dışı,
    //     enriched şart değil).
    let gltfUrl = cached.gltfUrl;
    const isEnrichedLocal =
      gltfUrl &&
      gltfUrl.startsWith(LOCAL_GLTF_PREFIX) &&
      gltfUrl.endsWith(".enriched.glb");

    if (!isEnrichedLocal) {
      const sourceUrl = cached.originalGltfUrl || cached.gltfUrl;
      const cachedSubArticles = Array.isArray(cached.subArticles)
        ? cached.subArticles
        : null;
      const wantSync =
        shouldEnrichSync() && cachedSubArticles && cachedSubArticles.length > 0;

      if (wantSync) {
        try {
          const enrichedUrl = await cacheGltf(sourceUrl, {
            subArticleTree: cachedSubArticles,
          });
          if (enrichedUrl && enrichedUrl !== sourceUrl) {
            gltfUrl = enrichedUrl;
            const promotedFlag = enrichedUrl.endsWith(".enriched.glb");
            await cacheSet(cacheKey, {
              ...cached,
              gltfUrl: enrichedUrl,
              originalGltfUrl: sourceUrl,
              enriched: promotedFlag,
            });
          } else {
            gltfUrl = sourceUrl;
          }
        } catch (err) {
          console.warn(
            `[pcon/init] HIT sync enrichment failed for ${articleNumber}: ${err.message}`,
          );
          gltfUrl = sourceUrl;
        }
      } else {
        // Default fast path: gltfUrl raw (CDN veya local raw) → kullan,
        // background upgrade tetikle (subArticleTree varsa enrichment'a
        // hazırla, future-proof).
        upgradeCacheEntryWithLocalGltf(
          cacheKey,
          sourceUrl,
          cachedSubArticles,
        );
        gltfUrl = cached.gltfUrl?.startsWith(LOCAL_GLTF_PREFIX)
          ? cached.gltfUrl
          : sourceUrl;
      }
    }

    // Faz 1: Cache HIT'te classifications field'ı yoksa transparent enrich.
    // Eski cache entry'leri (Faz 1 öncesi yazılmış) bu alana sahip değil;
    // heuristic+override sync döner, eksikse empirical fire-and-forget
    // arka planda tetiklenir. Cache entry'sini yeniden yazmıyoruz —
    // bir sonraki MISS'te zaten doğru format yazılacak.
    let classifications = cached.classifications;
    if (!classifications) {
      classifications = await classifyProperties(
        articleNumber,
        manufacturerId,
        cached.properties || [],
      );
    }
    timer.mark("classify");

    // Faz 3: HIT'te subArticles snapshot'ı varsa response'a olduğu gibi
    // geçir; eski entry'lerde yoksa boş array ile devam et (transparent
    // re-enrich yapmıyoruz — Faz 4 öncesi frontend bu metadata'yı
    // tüketmiyor; bir sonraki MISS'te doğru format yazılacak).
    const subArticles = Array.isArray(cached.subArticles)
      ? cached.subArticles
      : [];

    timer.mark("done");
    console.log(timer.toLogString({ cache: "HIT", articleNumber }));
    void recordTimerSamples(timer, { articleNumber });

    return Response.json(
      { ...cached, gltfUrl, classifications, subArticles },
      { headers: { "Server-Timing": timer.toServerTimingHeader() } },
    );
  }

  try {
    const pcon = getPconClient();
    const data = await pcon.getArticleData(articleNumber, manufacturerId, timer);
    // Yüksek seviye `pcon.client` label'ı: pcon-client içindeki sub-RPC'ler
    // (`eaiws.getArticleData`, `eaiws.export`, …) ayrıca `markRaw` ile
    // yazılır; bu mark cursor'u ilerletir ve mapProperties/buildCart vb.
    // CPU işlerini de kapsayan agregat süreyi tek bir phase'e koyar.
    timer.mark("pcon.client");

    // Faz 1: classifications field'ı response'a ve cache'e eklenir.
    // Heuristic+override sync döner; empirical sonuç Redis'te yoksa
    // arka planda tetiklenir (init request'i bloke olmaz). Bu çağrı
    // mil-saniye seviyesinde tamamlanmalı (sadece bir Redis GET).
    const classifications = await classifyProperties(
      articleNumber,
      manufacturerId,
      data.properties,
    );
    timer.mark("classify");

    // Faz 3: Sub-article hierarchy snapshot'ı. `getItemProperties` çağrısı
    // EAIWS RPC'si — phase'i `eaiws.getItemProperties` ile timer'a yazılır
    // (`pcon.getItemProperties` içinde `_measureRpc` zaten markRaw atıyor).
    // Hata olursa fail-soft: snapshot boş kalır, response yine döner,
    // gltf-cache enrichment skip edilir. Eski Faz 0/1 davranışı korunur.
    let subArticleTreeRaw = null;
    let subArticles = [];
    try {
      subArticleTreeRaw = await pcon.getItemProperties(
        data.itemId,
        { subArticles: true },
        timer,
      );
      subArticles = buildSubArticleSnapshot(subArticleTreeRaw);
    } catch (err) {
      console.warn(
        `[pcon/init] sub-article snapshot failed for ${articleNumber}: ${err.message}`,
      );
    }
    timer.mark("subArticles.snapshot");

    // GLB enrichment davranışı feature flag'lere göre dallanır:
    //   - Faz 4/5 ON → sync enrich (frontend mesh-mapping pconSubArticleId
    //     metadata'sına ihtiyaç duyar). İlk MISS 3-7s yavaşlar; subsequent
    //     HIT'ler instant enriched URL döner.
    //   - Default (Faz 4/5 OFF) → fire-and-forget. İlk MISS hızlı (1-2s);
    //     enrichment background'da kuyruğa girer, future-proof olur.
    let enrichedGltfUrl = data.gltfUrl;
    let enrichedFlag = false;

    if (shouldEnrichSync()) {
      try {
        const localUrl = await cacheGltf(data.gltfUrl, {
          subArticleTree: subArticleTreeRaw,
        });
        if (localUrl && localUrl !== data.gltfUrl) {
          enrichedGltfUrl = localUrl;
          enrichedFlag = localUrl.endsWith(".enriched.glb");
        }
      } catch (err) {
        console.warn(
          `[pcon/init] sync enrichment failed for ${articleNumber}, falling back to pCon CDN: ${err.message}`,
        );
      }
      timer.mark("local.upgrade.sync");
    }

    const result = {
      price: data.price,
      gltfUrl: enrichedGltfUrl,
      originalGltfUrl: data.gltfUrl,
      properties: data.properties,
      currency: data.currency,
      itemId: data.itemId,
      cartProperties: data.cartProperties || null,
      classifications,
      subArticles,
      enriched: enrichedFlag,
    };

    await cacheSet(cacheKey, result);
    timer.mark("cache.set");

    // Background fire-and-forget — sync yapmadıysak ya da fail ettiyse,
    // bir sonraki HIT'in enriched URL alabilmesi için arka planda hazırla.
    if (!enrichedFlag) {
      upgradeCacheEntryWithLocalGltf(cacheKey, data.gltfUrl, subArticleTreeRaw);
    }

    if (isCacheWarmingEnabled()) {
      warmCacheInBackground(articleNumber, manufacturerId, data.properties);
    }

    timer.mark("done");
    console.log(
      timer.toLogString({
        cache: "MISS",
        articleNumber,
        gltfUrl: data.gltfUrl,
      }),
    );
    void recordTimerSamples(timer, { articleNumber });

    return Response.json(result, {
      headers: { "Server-Timing": timer.toServerTimingHeader() },
    });
  } catch (err) {
    timer.mark("error");
    console.error("[pcon/init] Error:", err.message);
    console.log(
      timer.toLogString({ cache: "ERROR", articleNumber, error: err.message }),
    );
    void recordTimerSamples(timer, { articleNumber });
    return Response.json(
      { error: "Failed to initialize pCon article", detail: err.message },
      {
        status: 500,
        headers: { "Server-Timing": timer.toServerTimingHeader() },
      },
    );
  }
}
