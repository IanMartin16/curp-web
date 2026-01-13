import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

async function safeJson(r: Response) {
  const ct = r.headers.get("content-type") || "";
  const text = await r.text();
  if (!ct.includes("application/json")) {
    throw new Error(`Non-JSON from upstream: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) return json(400, { ok: false, error: "Missing session_id" });

    const CURP_API_BASE = process.env.CURP_API_BASE_URL; // https://curp-api....railway.app
    const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET;

    if (!CURP_API_BASE || !INTERNAL_SECRET) {
      return json(500, { ok: false, error: "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET" });
    }

    // 1) Stripe = fuente de verdad
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
    const customerId = typeof session.customer === "string" ? session.customer : null;

    // OJO: Si tu plan no está en metadata, puedes inferirlo por price_id, pero por ahora metadata.
    const plan = (session.metadata?.plan as "developer" | "business" | undefined) ?? undefined;

    if (!subscriptionId || !plan) {
      return json(400, {
        ok: false,
        error: "Missing subscriptionId or plan in Stripe session metadata",
        debug: { subscriptionId, plan, hasMetadata: !!session.metadata },
      });
    }

    // 2) Asegurar que exista api_key en tu DB (idempotente)
    const fulfillResp = await fetch(`${CURP_API_BASE}/api/stripe/fulfill`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        plan,
        email: session.customer_details?.email ?? null,
        customerId,
        subscriptionId,
        sessionId,
      }),
      cache: "no-store",
    });

    const fulfillData = await safeJson(fulfillResp);
    if (!fulfillResp.ok || !fulfillData.ok) {
      return json(502, { ok: false, error: fulfillData?.error || "fulfill failed", debug: fulfillData });
    }

    // 3) Ahora sí: revelar SOLO una vez (si ya se mostró, regresa masked y apiKey:null)
    const revealResp = await fetch(
      `${CURP_API_BASE}/api/stripe/reveal-once?session_id=${encodeURIComponent(sessionId)}`,
      {
        headers: { "x-internal-secret": INTERNAL_SECRET },
        cache: "no-store",
      }
    );

    const revealData = await safeJson(revealResp);
    if (!revealResp.ok || !revealData.ok) {
      return json(502, { ok: false, error: revealData?.error || "reveal-once failed", debug: revealData });
    }

    // ✅ lo que consume SuccessClient
    return json(200, {
      ok: true,
      apiKey: revealData.apiKey ?? null,
      masked: revealData.masked ?? null,
      firstTime: revealData.firstTime ?? null,
    });
  } catch (e: any) {
    return json(500, { ok: false, error: e?.message || "complete failed" });
  }
}


