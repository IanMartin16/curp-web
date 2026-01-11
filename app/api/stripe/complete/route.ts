import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: `Payment not completed: ${session.payment_status}` },
        { status: 402 }
      );
    }

    const plan =
      (session.metadata?.plan as "developer" | "business" | undefined) ||
      ((session.subscription as any)?.metadata?.plan as "developer" | "business" | undefined);

    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    const email =
      session.customer_details?.email ||
      (typeof session.customer !== "string" ? (session.customer as any)?.email : null) ||
      null;

    if (!plan || !subscriptionId) {
      return NextResponse.json(
        { ok: false, error: "Missing plan or subscriptionId in Stripe session" },
        { status: 500 }
      );
    }

    const apiBase = process.env.CURP_API_BASE_URL; // ej: https://curp-api-production.up.railway.app
    const internalSecret = process.env.INTERNAL_WEBHOOK_SECRET;

    if (!apiBase || !internalSecret) {
      return NextResponse.json(
        { ok: false, error: "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    const r = await fetch(`${apiBase}/stripe/fulfill`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": internalSecret,
      },
      body: JSON.stringify({
        plan,
        email,
        customerId,
        subscriptionId,
        sessionId,
      }),
    });

    const data = await r.json();

    if (!r.ok || !data.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Fulfill failed" },
        { status: 500 }
      );
    }

    // data.key trae { id, key, plan, ... } (tu curp-api ya lo regresa)
    return NextResponse.json({
      ok: true,
      apiKey: data.key?.key,
      plan,
      existing: data.existing === true,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
