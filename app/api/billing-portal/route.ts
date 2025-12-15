// app/api/billing-portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { ok: false, error: "customerId requerido" },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url:
        process.env.STRIPE_SUCCESS_URL ??
        "https://curpify.com/dashboard",
    });

    return NextResponse.json({ ok: true, url: portalSession.url });
  } catch (error) {
    console.error("Error en /api/billing-portal", error);
    return NextResponse.json(
      { ok: false, error: "Error creando sesión de billing portal" },
      { status: 500 }
    );
  }
}
