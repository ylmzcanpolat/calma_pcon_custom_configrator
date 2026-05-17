/**
 * POST /apps/pcon-configurator/api/gatekeeper-session
 *
 * Frontend extension'dan gelen gatekeeper session açma isteğini
 * backend üzerinden proxy'ler. PCON_GATEKEEPER_ID asla frontend'e
 * sızmaz — sadece bu server-side route içinde okunur.
 *
 * Request body: { locale?: string }
 * Response:     { server: string, sessionId: string, keepAliveInterval: number }
 */

import { authenticate } from "../shopify.server";

export async function action({ request }) {
  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // Body boş ya da geçersiz JSON — locale default'a düşer.
  }

  const locale = body.locale ?? "en_US";

  const gkId = process.env.PCON_GATEKEEPER_ID;
  if (!gkId) {
    console.error("[gatekeeper-session] PCON_GATEKEEPER_ID is not set");
    return Response.json(
      { error: "Gatekeeper ID not configured" },
      { status: 500 },
    );
  }

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
