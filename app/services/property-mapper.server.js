import { cacheIcon } from "./icon-cache.server.js";

const LOG_PROPERTIES = process.env.PCON_LOG_PROPERTIES !== "0";

/**
 * Property IDs (`propClass.propName`) that are hidden from the storefront
 * configurator UI even when EAIWS exposes them as visible/editable. The init
 * and update responses both rely on `mapProperties()` to enforce this filter,
 * so hidden IDs disappear from every response uniformly.
 */
export const HIDDEN_PROPERTY_IDS = new Set([
  "MT_TEXT.Meta_Dimension",
]);

export function isHiddenPropertyId(id) {
  return HIDDEN_PROPERTY_IDS.has(id);
}

/**
 * Shared property mapping utility used by PconClient and article-warmer.
 * Extracts visible properties from EAIWS articleData and maps them with
 * their choice list options, icons, and current values.
 *
 * Icon URLs returned by EAIWS are session-bound and stop working once the
 * session expires. We proxy them through our app by downloading them to a
 * local disk cache and returning a stable public URL served by the app proxy.
 */
export async function mapProperties(articleData, choiceLists) {
  if (!articleData.properties) return [];

  const choiceMap = new Map();
  for (const cl of choiceLists) {
    choiceMap.set(`${cl.propClass}.${cl.propName}`, cl.values || []);
  }

  const allProps = articleData.properties;
  const visibleProps = allProps.filter(
    (prop) =>
      prop.visible &&
      !HIDDEN_PROPERTY_IDS.has(`${prop.propClass}.${prop.propName}`),
  );

  if (LOG_PROPERTIES) {
    logRawProperties(allProps, choiceMap);
  }

  return Promise.all(
    visibleProps.map(async (prop) => {
      const key = `${prop.propClass}.${prop.propName}`;
      const choices = choiceMap.get(key) || [];

      let type = "text";
      if (prop.choiceList && choices.length > 0) {
        const hasIcons = choices.some(
          (c) => c.smallIcon || c.largeIcon || c.image,
        );
        type = hasIcons ? "color" : "select";
      }

      const options = await Promise.all(
        choices.map(async (pv) => {
          const remoteIcon = pv.smallIcon || pv.image || null;
          const icon = remoteIcon ? await cacheIcon(remoteIcon) : null;
          return {
            value: pv.value,
            label: pv.text,
            icon,
            available: pv.selectable !== false,
          };
        }),
      );

      return {
        id: key,
        propClass: prop.propClass,
        propName: prop.propName,
        label: prop.propText,
        type,
        eaiwsType: prop.type,
        editable: prop.editable,
        options,
        currentValue: prop.value?.value ?? "",
      };
    }),
  );
}

/**
 * EAIWS'ten gelen ham property listesini terminale tablo şeklinde basar.
 * Hangi property'leri filtreleyeceğimize karar verirken bu çıktıyı
 * referans alıyoruz. `PCON_LOG_PROPERTIES=0` ile kapatılabilir.
 */
function logRawProperties(props, choiceMap) {
  const rows = props.map((prop) => {
    const id = `${prop.propClass}.${prop.propName}`;
    const choices = choiceMap.get(id) || [];
    return {
      id,
      label: prop.propText ?? "",
      type: prop.type ?? "",
      visible: prop.visible ? "Y" : "N",
      editable: prop.editable ? "Y" : "N",
      choiceList: prop.choiceList ? "Y" : "N",
      options: choices.length,
      value: prop.value?.value ?? "",
    };
  });

  const headers = {
    id: "id",
    label: "label",
    type: "type",
    visible: "vis",
    editable: "edit",
    choiceList: "list",
    options: "opts",
    value: "value",
  };

  const widths = {};
  for (const key of Object.keys(headers)) {
    widths[key] = Math.max(
      String(headers[key]).length,
      ...rows.map((r) => String(r[key]).length),
    );
  }

  const fmt = (row) =>
    Object.keys(headers)
      .map((k) => String(row[k]).padEnd(widths[k]))
      .join("  ");

  console.log(`[property-mapper] Raw EAIWS properties (${rows.length})`);
  console.log("[property-mapper] " + fmt(headers));
  console.log(
    "[property-mapper] " +
      fmt(
        Object.fromEntries(
          Object.keys(headers).map((k) => [k, "-".repeat(widths[k])]),
        ),
      ),
  );
  for (const row of rows) {
    console.log("[property-mapper] " + fmt(row));
  }
}
