/**
 * Katmanlı cache warming (init sonrası background, cron, CLI) tek anahtarla
 * kapatılabilir. Varsayılan: kapalı — kombinasyon sayısı yüksek ürünlerde
 * singleton pCon client ile event loop riski oluşturduğu için production'da
 * açılmadan önce ayrı session pool / queue tasarımı gerekir.
 *
 * Açmak için: CACHE_WARMING_ENABLED=1 (veya "true")
 */
export function isCacheWarmingEnabled() {
  const v = process.env.CACHE_WARMING_ENABLED;
  if (v === undefined || v === "") return false;
  return v === "1" || String(v).toLowerCase() === "true";
}
