/**
 * POST /apps/pcon-configurator/api/gatekeeper-session
 *
 * Frontend extension'dan gelen gatekeeper session açma isteğini
 * backend üzerinden proxy'ler. Gatekeeper ID'ler asla frontend'e
 * sızmaz — sadece bu server-side route içinde okunur.
 *
 * Multiple gatekeeper: gatekeeper ID, giriş yapmış müşterinin region
 * tag'inden türetilen `region` alanına göre seçilir. Region değeri
 * (hassas değil) frontend'den gelir; gatekeeper ID (env'de saklı) burada
 * eşlenir. Bilinmeyen/boş region veya giriş yapmamış ziyaretçi → UK/default.
 *
 * Request body: { locale?: string, region?: string }
 * Response:     { server: string, sessionId: string, keepAliveInterval: number }
 */

import { authenticate } from "../shopify.server";

/**
 * Region → gatekeeper ID (env) eşlemesi.
 *
 * .env değişkenleri:
 *   PCON_GATEKEEPER_ID_EASTERN_EUROPE  → region_eastern_europe
 *   PCON_GATEKEEPER_ID_WESTERN_EUROPE  → region_western_europe
 *   PCON_GATEKEEPER_ID_UK              → region_uk (opsiyonel; yoksa
 *                                        PCON_GATEKEEPER_ID'ye düşer)
 *
 * UK, boş (giriş yok) veya bilinmeyen region → UK/default gatekeeper.
 * Bölgeye özel değişken eksikse yine UK/default'a güvenli şekilde düşer.
 */
function resolveGatekeeperId(region) {
  const normalized = String(region || "").trim().toLowerCase();
  const ukDefault =
    process.env.PCON_GATEKEEPER_ID_UK || process.env.PCON_GATEKEEPER_ID || "";

  if (normalized === "eastern_europe") {
    return process.env.PCON_GATEKEEPER_ID_EASTERN_EUROPE || ukDefault;
  }
  if (normalized === "western_europe") {
    return process.env.PCON_GATEKEEPER_ID_WESTERN_EUROPE || ukDefault;
  }
  // "uk", "" (guest) veya bilinmeyen değer → UK/default.
  return ukDefault;
}

export async function action({ request }) {
  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // Body boş ya da geçersiz JSON — locale/region default'a düşer.
  }

  const locale = body.locale ?? "en_US";
  const region = body.region ?? "";

  const gkId = resolveGatekeeperId(region);
  if (!gkId) {
    console.error(
      "[gatekeeper-session] No gatekeeper ID configured (region:",
      region || "(none)",
      ") — set PCON_GATEKEEPER_ID (or region-specific vars).",
    );
    return Response.json(
      { error: "Gatekeeper ID not configured" },
      { status: 500 },
    );
  }

  console.log(
    "[gatekeeper-session] region:",
    region || "(none)",
    "→ gatekeeper selected.",
  );

  let gkResponse;
  try {
    gkResponse = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${gkId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      },
    );
  } catch (err) {
    console.error("[gatekeeper-session] Network error:", err.message);
    return Response.json(
      { error: "Failed to reach gatekeeper service" },
      { status: 502 },
    );
  }

  if (!gkResponse.ok) {
    const text = await gkResponse.text().catch(() => "");
    console.error("[gatekeeper-session] Gatekeeper error:", gkResponse.status, text);
    return Response.json(
      { error: "Gatekeeper session could not be opened" },
      { status: 502 },
    );
  }

  const data = await gkResponse.json();
  // { server: string, sessionId: string, keepAliveInterval: number }
  return Response.json(data);
}
