// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type PaidPlan = "developer" | "business";

const PRICES: Record<PaidPlan, string | undefined> = {
  developer: process.env.STRIPE_PRICE_DEV,
  business: process.env.STRIPE_PRICE_BUS,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawPlan =
      typeof body?.plan === "string"
        ? body.plan.trim().toLowerCase()
        : "";

    if (rawPlan === "free") {
      return NextResponse.json(
        {
          ok: false,
          error: "El plan Free no requiere checkout",
        },
        { status: 400 }
      );
    }

    if (rawPlan !== "developer" && rawPlan !== "business") {
      return NextResponse.json(
        {
          ok: false,
          error: `Plan inválido: ${rawPlan || "missing"}`,
        },
        { status: 400 }
      );
    }

    const plan: PaidPlan = rawPlan;
    const priceId = PRICES[plan];

    if (!priceId) {
      return NextResponse.json(
        {
          ok: false,
          error: `Price ID no configurado para el plan ${plan}`,
        },
        { status: 500 }
      );
    }

    const successUrl = process.env.STRIPE_SUCCESS_URL;
    const cancelUrl = process.env.STRIPE_CANCEL_URL;

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Faltan STRIPE_SUCCESS_URL o STRIPE_CANCEL_URL",
        },
        { status: 500 }
      );
    }

    console.info("curpify_checkout_starting", {
      plan,
      priceId,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      metadata: {
        product: "curpify",
        plan,
      },

      subscription_data: {
        metadata: {
          product: "curpify",
          plan,
        },
      },
    });

    if (!session.url) {
      console.error("curpify_checkout_missing_url", {
        sessionId: session.id,
        plan,
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Stripe no devolvió una URL de checkout",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    console.error("curpify_checkout_failed", {
      message,
      stack:
        error instanceof Error
          ? error.stack
          : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno creando la sesión de pago",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Método no permitido",
    },
    { status: 405 }
  );
}