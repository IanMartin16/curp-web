// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs"; // IMPORTANTE para webhooks

export async function POST(req: NextRequest) {
  // 1) Sacamos la firma del header
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "Webhook signature missing" },
      { status: 400 }
    );
  }

  // 2) Leemos el body crudo
  const body = await req.text();

  let event: Stripe.Event;

  // 3) Verificamos firma
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Error verificando webhook:", err.message);
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // 4) Manejo de eventos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout completado:", session.id);
      // Aquí después conectamos con tu sistema de API keys / planes
      break;
    }

    default:
      console.log(`ℹ️ Evento no manejado: ${event.type}`);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
