import { cacheIcon } from "./icon-cache.server.js";

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

  const visibleProps = articleData.properties.filter((prop) => prop.visible);

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
        editable: prop.editable,
        options,
        currentValue: prop.value?.value ?? "",
      };
    }),
  );
}
