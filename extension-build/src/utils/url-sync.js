export function readUrlProperties() {
  const params = new URLSearchParams(window.location.search);
  const properties = {};
  for (const [key, value] of params) {
    if (key.includes(".")) {
      properties[key] = value;
    }
  }
  return properties;
}

export function writeUrlProperties(properties) {
  const url = new URL(window.location.href);

  for (const key of [...url.searchParams.keys()]) {
    if (key.includes(".")) {
      url.searchParams.delete(key);
    }
  }

  for (const [key, value] of Object.entries(properties)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  window.history.replaceState(null, "", url.toString());
}
