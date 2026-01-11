import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return json(400, { ok: false, error: "Missing session_id" });
    }

    // 1) Trae la session desde Stripe (fuente de verdad)
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // En suscripciones, normalmente vienen aquí:
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;

    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    const plan =
      (session.metadata?.plan as "developer" | "business" | undefined) ?? undefined;

    if (!subscriptionId || !plan) {
      return json(400, {
        ok: false,
        error: "Missing subscriptionId or plan in Stripe session metadata",
        debug: {
          subscriptionId,
          plan,
          hasMetadata: !!session.metadata,
        },
      });
    }

    // 2) Llama a tu curp-api para crear/obtener la key (idempotente)
    const CURP_API_BASE = process.env.CURP_API_BASE_URL; // ej: https://curp-api-production.up.railway.app
    const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET; // el mismo que validas en curp-api (x-internal-secret)

    if (!CURP_API_BASE || !INTERNAL_SECRET) {
      return json(500, {
        ok: false,
        error: "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET in Vercel env",
      });
    }

    const fulfill = await fetch(`${CURP_API_BASE}/api/stripe/fulfill`, {
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

    // OJO: por si curp-api devuelve HTML por error, lo protegemos
    const contentType = fulfill.headers.get("content-type") || "";
    const text = await fulfill.text();

    if (!contentType.includes("application/json")) {
      return json(502, {
        ok: false,
        error: "curp-api returned non-JSON response",
        debug: text.slice(0, 300),
      });
    }

    const data = JSON.parse(text);

    if (!fulfill.ok || !data.ok) {
      return json(502, {
        ok: false,
        error: data?.error || "fulfill failed",
        debug: data,
      });
    }

    // data.key.key debe ser tu API key (depende cómo lo regreses)
    return json(200, {
      ok: true,
      apiKey: data.key?.key ?? null,
      existing: data.existing ?? false,
    });
  } catch (e: any) {
    return json(500, { ok: false, error: e?.message || "complete failed" });
  }
}
