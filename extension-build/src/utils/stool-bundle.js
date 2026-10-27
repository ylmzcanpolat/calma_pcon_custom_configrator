/**
 * Calma Small + ücretsiz Gravity Stool bağı.
 *
 * Konfigürasyonda "STOOL OPTION" = YES seçiliyse, app bloğunun "Stool product"
 * ayarında seçilen ürünün (Gravity Stool) döşeme seçimine uyan varyantı Calma
 * ile aynı istekte, Calma'nın nested (child) satırı olarak sepete eklenir.
 *
 * Satırlar `_bundle_id` (ortak) + `_bundle_role` ("parent" | "child") ile
 * birbirine bağlanır. Shopify'ın nested ilişkisi Draft Order'a taşınmadığı
 * için tema, Generate Quote, preorder endpoint'leri ve Axapta payload'ı bu
 * iki property'yi okur — key isimleri bu tüketicilerle sözleşmedir.
 */

export const BUNDLE_ID_KEY = "_bundle_id";
export const BUNDLE_ROLE_KEY = "_bundle_role";

const STOOL_OPTION = { label: "STOOL OPTION" };
const STOOL_YES = "YES";
const MATERIAL_SOURCE = {
  id: "[Character]NRUS_DOSEME_SERI_DUVAR",
  label: "GROUP OF INTERIOR WALLS",
};
const COLOR_SOURCE = {
  id: "[Character]NRUS_DOSEME_RENK_DUVAR",
  label: "COLOUR OF INTERIOR WALLS",
};
const MATERIAL_OPTION = "Upholstery Material";
const COLOR_OPTION = "Upholstery Color";

function norm(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function codeOf(value) {
  return norm(value).split(" - ")[0];
}

function findProperty(properties, { id, label }) {
  return (
    (id && properties.find((p) => p.id === id)) ||
    properties.find((p) => norm(p.label) === norm(label)) ||
    null
  );
}

function selectedLabel(prop) {
  if (!prop || prop.currentValue == null || prop.currentValue === "") return "";
  const option = (prop.options || []).find((o) => o.value === prop.currentValue);
  return String(option?.label ?? prop.currentValue);
}

function findVariant(variants, materialIdx, colorIdx, material, color, compare) {
  return variants.find(
    (v) =>
      compare(v.options?.[materialIdx], material) &&
      compare(v.options?.[colorIdx], color),
  );
}

/**
 * @param {{ stool: object|null, properties: object[] }} args
 * @returns {null | { error: string } | { variantId: number, material: string, color: string }}
 *   null → stool eklenmeyecek (ürün ayarlı değil veya stool seçilmemiş)
 */
export function resolveStoolLine({ stool, properties }) {
  if (!stool || !Array.isArray(stool.variants) || stool.variants.length === 0) {
    return null;
  }
  if (norm(selectedLabel(findProperty(properties, STOOL_OPTION))) !== STOOL_YES) {
    return null;
  }

  const material = selectedLabel(findProperty(properties, MATERIAL_SOURCE));
  const color = selectedLabel(findProperty(properties, COLOR_SOURCE));
  if (!material || !color) {
    return {
      error: "Please select the interior wall group and colour for the included stool.",
    };
  }

  const options = (stool.options || []).map(norm);
  const materialIdx = options.indexOf(norm(MATERIAL_OPTION));
  const colorIdx = options.indexOf(norm(COLOR_OPTION));
  if (materialIdx === -1 || colorIdx === -1) {
    return { error: "The included stool product is not set up correctly." };
  }

  const variant =
    findVariant(stool.variants, materialIdx, colorIdx, material, color, (a, b) => norm(a) === norm(b)) ||
    findVariant(stool.variants, materialIdx, colorIdx, material, color, (a, b) => codeOf(a) === codeOf(b));

  if (!variant) {
    return {
      error: `No matching stool found for ${material} / ${color}. Please contact us.`,
    };
  }

  return {
    variantId: Number(variant.id),
    material: variant.options[materialIdx],
    color: variant.options[colorIdx],
  };
}

export function createBundleId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildStoolProperties({ stoolLine, includedWith, currency, bundleId }) {
  return {
    [MATERIAL_OPTION]: stoolLine.material,
    [COLOR_OPTION]: stoolLine.color,
    "Included with": includedWith,
    _Configuration_Price: "0",
    _currency: currency || "EUR",
    [BUNDLE_ID_KEY]: bundleId,
    [BUNDLE_ROLE_KEY]: "child",
  };
}
