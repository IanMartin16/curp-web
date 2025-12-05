// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, email } = body as { plan: "developer" | "business"; email?: string };

    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "Plan requerido" },
        { status: 400 }
      );
    }

    // Mapear plan → priceId de Stripe
    const priceId =
      plan === "developer"
        ? process.env.STRIPE_PRICE_DEV
        : process.env.STRIPE_PRICE_BUS;

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "Price ID no configurado" },
        { status: 500 }
      );
    }

    const successUrl =
      process.env.STRIPE_SUCCESS_URL ?? "https://curp-web.vercel.app/dashboard";
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL ?? "https://curp-web.vercel.app/payment-failed";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      customer_email: email, // opcional: si se lo pides en la UI
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error: any) {
    console.error("Error en /api/checkout", error);
    return NextResponse.json(
      { ok: false, error: "Error creando sesión de pago" },
      { status: 500 }
    );
  }
}
