/**
 * Katmanlı cache warming (init sonrası background, cron, CLI) tek anahtarla
 * kapatılabilir.
 *
 * Default **OFF** (2026-05-06 stratejik geri alma):
 *
 * Article başına ~100.000 farklı property kombinasyonu olduğu doğrulandı.
 * Bu boyutta bir kombinasyon space'i için warming **fundamentally yanlış
 * strateji**:
 *   - 100K × ~5MB GLB ≈ 500GB disk
 *   - Kombinasyonların büyük çoğunluğu hiç kullanılmaz (long tail)
 *   - EAIWS gatekeeper'a sürekli yük → rate limit + diğer kullanıcılara
 *     gecikme yansıması
 *   - Net ROI negatif: warmer CPU/network kullanımı IDB+response cache
 *     kazancını aşıyor
 *
 * Bunun yerine **demand-driven cache** yaklaşımı: kullanıcının fiilen
 * tıkladığı kombinasyon Redis'e yazılır, IDB'ye düşer; sonraki ziyaretler
 * cache HIT'le döner. Bu zaten etkili (ölçüm: aynı renge dönüş 1.1ms).
 *
 * Açmak için (örn. küçük catalog'lu pilot ürünler için): `CACHE_WARMING_ENABLED=true`.
 */
export function isCacheWarmingEnabled() {
  const v = process.env.CACHE_WARMING_ENABLED;
  if (v === undefined || v === "") return false;
  return v === "1" || String(v).toLowerCase() === "true";
}
