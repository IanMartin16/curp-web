// app/api/stripe/webhook/route.ts
import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  upsertSubscription,
  deleteSubscription,
  SubscriptionStatus,
} from "@/lib/subscriptions";

export const runtime = "nodejs";        // Importante para Stripe
export const dynamic = "force-dynamic"; // Que no lo intente pre-generar

export async function POST(req: Request) {
  const body = await req.text(); // crudo, no json
  const sig = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[WEBHOOK] Falta signature o STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Webhook misconfigured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[WEBHOOK] Firma inválida:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("[WEBHOOK] checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          customer_email: session.customer_details?.email,
          subscription: session.subscription,
        });

        // Aquí normalmente haríamos cosas como:
        // - crear usuario en tu BD
        // - asociar API key a ese customer
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId = typeof sub.customer === "string"
          ? sub.customer
          : sub.customer.id;

        const price = sub.items.data[0]?.price;

        upsertSubscription({
          customerId,
          customerEmail:
            typeof sub.customer === "string" ? undefined : sub.customer.email,
          priceId: price?.id ?? "unknown",
          status: sub.status as SubscriptionStatus,
          currentPeriodEnd: sub.current_period_end,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string"
          ? sub.customer
          : sub.customer.id;

        deleteSubscription(customerId);
        break;
      }

      default:
        console.log("[WEBHOOK] Evento ignorado:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[WEBHOOK] Error procesando evento:", event.type, err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
