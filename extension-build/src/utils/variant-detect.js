/**
 * Theme'deki seçili variant ID'sini DOM üzerinden tespit eder.
 *
 * Add to Cart butonu için doğru variant_id elde etmek üç katmanlı bir
 * stratejiyle yapılır:
 *
 *   1. **Liquid initial value** — `<div id="pcon-root" data-variant-id="...">`
 *      sayfa yüklenirken Liquid tarafından `product.selected_or_first_available_variant.id`
 *      ile basılır. Bu çoğu durumda doğrudur ve varsayılan başlangıç değeridir.
 *
 *   2. **DOM live read** — kullanıcı tema'nın `<variant-selects>` veya benzeri
 *      web component'iyle başka bir variant seçerse, seçili variant'ın id'si
 *      `<input name="id">` üzerinden okunabilir. `subscribeVariantChanges`
 *      bu değişikliği dinler ve store'u günceller.
 *
 *   3. **Runtime fallback** — global `window.ShopifyAnalytics?.meta?.selectedVariantId`
 *      bazı eski temalarda set edilir; en son çare olarak kullanılır.
 *
 * Bu modül DOM'a sıkı bağlı olmadığı sürece (tema selektör değişikliklerine
 * dayanıklı genel selektörler) çalışır.
 */

const VARIANT_INPUT_SELECTORS = [
  // Dawn modern — `variant-selects` web component
  'variant-selects input[name="id"]:checked',
  'variant-radios input[name="id"]:checked',
  // Eski Dawn / klasik product form
  'form[action$="/cart/add"] input[name="id"]',
  // Generic select dropdown
  'select[name="id"]',
  // Modern themes gizli input
  'input[name="id"][type="hidden"]',
  'input[name="id"]:not([type="hidden"]):checked',
];

export function readVariantFromDom() {
  if (typeof document === "undefined") return null;

  for (const selector of VARIANT_INPUT_SELECTORS) {
    const els = document.querySelectorAll(selector);
    for (const el of els) {
      const value = el?.value?.trim();
      if (value) return value;
    }
  }

  if (typeof window !== "undefined") {
    const fromAnalytics = window.ShopifyAnalytics?.meta?.selectedVariantId;
    if (fromAnalytics) return String(fromAnalytics);
  }

  return null;
}

/**
 * Theme'in variant değişikliklerini dinler. Modern temaların çoğu DOM event
 * sistemine dayalıdır:
 *  - `<input name="id">` üzerinde `change` event
 *  - URL'de `?variant=ID` parametresi değişimi (popstate)
 *  - Bazı temalarda custom `variant:change` event
 *
 * Tüm bu sinyalleri tek bir callback'e indirger.
 *
 * @param {(variantId: string) => void} onChange
 * @returns {() => void} unsubscribe fn
 */
export function subscribeVariantChanges(onChange) {
  if (typeof document === "undefined") return () => {};

  let lastValue = null;
  const notify = () => {
    const v = readVariantFromDom();
    if (v && v !== lastValue) {
      lastValue = v;
      onChange(v);
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    if (!target) return;
    if (
      target.matches?.(
        'input[name="id"], select[name="id"]',
      )
    ) {
      notify();
    }
  };

  const handleCustom = () => notify();
  const handlePopState = () => notify();

  document.addEventListener("change", handleChange, true);
  document.addEventListener("variant:change", handleCustom);
  document.addEventListener("on:variant:change", handleCustom);
  window.addEventListener("popstate", handlePopState);

  return () => {
    document.removeEventListener("change", handleChange, true);
    document.removeEventListener("variant:change", handleCustom);
    document.removeEventListener("on:variant:change", handleCustom);
    window.removeEventListener("popstate", handlePopState);
  };
}
