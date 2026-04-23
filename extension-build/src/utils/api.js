const DEFAULT_TIMEOUT = 15000;

export async function pconFetch(proxyBase, endpoint, options = {}) {
  const url = `${proxyBase}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || DEFAULT_TIMEOUT,
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export function initArticle(proxyBase, articleNumber, manufacturerId) {
  const params = new URLSearchParams({ articleNumber });
  if (manufacturerId) params.set("manufacturerId", manufacturerId);
  return pconFetch(proxyBase, `/api/pcon/init?${params}`);
}

export function updateProperties(proxyBase, properties, itemId, articleNumber, manufacturerId) {
  return pconFetch(proxyBase, "/api/pcon/update", {
    method: "POST",
    body: JSON.stringify({ properties, itemId, articleNumber, manufacturerId }),
  });
}
