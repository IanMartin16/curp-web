// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Webhook no configurado" }, { status: 400 });
  }

  let event;

  try {
    const body = await req.text(); // importante: text, no json
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Error verificando webhook:", err.message);
    return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        // Aquí puedes obtener:
        const customerId = session.customer as string;
        const email = session.customer_details?.email;
        const subscriptionId = session.subscription as string;

        console.log("✅ Nueva suscripción activa:", { customerId, email, subscriptionId });

        // TODO: Aquí actualizarías tu BD:
        // - Crear usuario si no existe
        // - Guardar customerId, subscriptionId, plan, etc.
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        console.log("❌ Suscripción cancelada:", subscription.id);

        // TODO: desactivar API key o poner plan Free
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Webhook no configurado" }, { status: 400 });
  }

  let event;

  try {
    const body = await req.text(); // importante: text, no json
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Error verificando webhook:", err.message);
    return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        // Aquí puedes obtener:
        const customerId = session.customer as string;
        const email = session.customer_details?.email;
        const subscriptionId = session.subscription as string;

        console.log("✅ Nueva suscripción activa:", { customerId, email, subscriptionId });

        // TODO: Aquí actualizarías tu BD:
        // - Crear usuario si no existe
        // - Guardar customerId, subscriptionId, plan, etc.
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        console.log("❌ Suscripción cancelada:", subscription.id);

        // TODO: desactivar API key o poner plan Free
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
