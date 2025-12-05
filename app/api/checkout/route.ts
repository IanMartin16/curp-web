// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const PRICES: Record<string, string | undefined> = {
  developer: process.env.STRIPE_PRICE_DEV,
  business: process.env.STRIPE_PRICE_BUS,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body?.plan as "developer" | "business" | "free" | undefined;

    // El plan FREE no pasa por Stripe
    if (plan === "free") {
      return NextResponse.json(
        {
          ok: false,
          error: "El plan Free no requiere checkout",
        },
        { status: 400 }
      );
    }

    if (!plan || !PRICES[plan]) {
      return NextResponse.json(
        {
          ok: false,
          error: `Plan inválido o price ID no configurado: ${plan}`,
        },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SUCCESS_URL || !process.env.STRIPE_CANCEL_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan STRIPE_SUCCESS_URL o STRIPE_CANCEL_URL",
        },
        { status: 500 }
      );
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: PRICES[plan]!,
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      // Opcional: para luego relacionar con cliente
      // customer_email: "test@example.com",
    });

    return NextResponse.json(
      {
        ok: true,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en /api/checkout:", error);
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
    { ok: false, error: "Método no permitido" },
    { status: 405 }
  );
}
