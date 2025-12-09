import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs"; // IMPORTANTE para webhooks

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // el body debe venir crudo
    const headersList = req.headers;
    const sig = req.headers.get("stripe-signature");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { ok: false, error: "Webhook signature missing" },
        { status: 400 }
      );
    }

    // Verificar evento
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("❌ Error verificando webhook:", err.message);
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Procesar evento
    switch (event.type) {
      case "checkout.session.completed":
        console.log("💚 Pago completado:", event.data.object);
        break;

      case "customer.subscription.created":
        console.log("🟦 Suscripción creada:", event.data.object);
        break;

      case "customer.subscription.deleted":
        console.log("❌ Suscripción cancelada:", event.data.object);
        break;

      default:
        console.log("Evento no manejado:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
};