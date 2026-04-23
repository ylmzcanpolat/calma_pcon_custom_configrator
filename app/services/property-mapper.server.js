/**
 * Shared property mapping utility used by PconClient and article-warmer.
 * Extracts visible properties from EAIWS articleData and maps them with
 * their choice list options, icons, and current values.
 */
export function mapProperties(articleData, choiceLists) {
  if (!articleData.properties) return [];

  const choiceMap = new Map();
  for (const cl of choiceLists) {
    choiceMap.set(`${cl.propClass}.${cl.propName}`, cl.values || []);
  }

  return articleData.properties
    .filter((prop) => prop.visible)
    .map((prop) => {
      const key = `${prop.propClass}.${prop.propName}`;
      const choices = choiceMap.get(key) || [];

      let type = "text";
      if (prop.choiceList && choices.length > 0) {
        const hasIcons = choices.some(
          (c) => c.smallIcon || c.largeIcon || c.image,
        );
        type = hasIcons ? "color" : "select";
      }

      return {
        id: key,
        propClass: prop.propClass,
        propName: prop.propName,
        label: prop.propText,
        type,
        editable: prop.editable,
        options: choices.map((pv) => ({
          value: pv.value,
          label: pv.text,
          icon: pv.smallIcon || pv.image || null,
          available: pv.selectable !== false,
        })),
        currentValue: prop.value?.value ?? "",
      };
    });
}
