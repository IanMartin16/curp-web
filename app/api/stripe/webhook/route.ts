// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs"; // IMPORTANTE para webhooks

async function syncSubscription(
  event: Stripe.Event,
  subscription: Stripe.Subscription
) {
  const item = subscription.items?.data?.[0] ?? null;

  const priceId = item?.price?.id ?? null;

  const productId =
    typeof item?.price?.product === "string"
      ? item.price.product
      : item?.price?.product?.id ?? null;

  /*
   * En algunas versiones/configuraciones de Stripe el final del periodo
   * puede venir en el item. Como respaldo usamos cancel_at.
   */
  const currentPeriodEnd =
    item?.current_period_end ??
    subscription.cancel_at ??
    null;

  const response = await fetch(
    `${process.env.CURP_API_BASE_URL}/api/stripe/sync-subscription`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret":
          process.env.INTERNAL_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd:
          subscription.cancel_at_period_end ?? false,
        currentPeriodEnd,
        priceId,
        productId,
      }),
      cache: "no-store",
    }
  );

  const responseText = await response.text();

  let responseData: unknown;

  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = responseText;
  }

  if (!response.ok) {
    console.error("curpify_subscription_sync_failed", {
      eventId: event.id,
      eventType: event.type,
      subscriptionId: subscription.id,
      stripeStatus: subscription.status,
      cancelAtPeriodEnd:
        subscription.cancel_at_period_end,
      currentPeriodEnd,
      responseStatus: response.status,
      responseData,
    });

    throw new Error(
      `Subscription sync failed with status ${response.status}`
    );
  }

  console.info("curpify_subscription_sync_completed", {
    eventId: event.id,
    eventType: event.type,
    subscriptionId: subscription.id,
    stripeStatus: subscription.status,
    cancelAtPeriodEnd:
      subscription.cancel_at_period_end,
    currentPeriodEnd,
  });
}

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
    const session =
      event.data.object as Stripe.Checkout.Session;

    const plan = session.metadata?.plan as
      | "developer"
      | "business"
      | undefined;

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : null;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : null;

    const email =
      session.customer_details?.email ?? null;

    if (!plan || !subscriptionId) {
      console.error("stripe_checkout_missing_data", {
        eventId: event.id,
        sessionId: session.id,
        plan,
        subscriptionId,
      });

      break;
    }

    const response = await fetch(
      `${process.env.CURP_API_BASE_URL}/api/stripe/fulfill`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-internal-secret":
            process.env.INTERNAL_WEBHOOK_SECRET || "",
        },
        body: JSON.stringify({
          plan,
          email,
          customerId,
          subscriptionId,
          sessionId: session.id,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("curpify_fulfill_failed", {
        eventId: event.id,
        sessionId: session.id,
        responseStatus: response.status,
        data,
      });

      throw new Error(
        `Fulfill failed with status ${response.status}`
      );
    }

    break;
  }

  case "customer.subscription.updated":
  case "customer.subscription.deleted": {
    const subscription =
      event.data.object as Stripe.Subscription;

    await syncSubscription(event, subscription);
    break;
  }

  case "invoice.paid": {
    console.info("stripe_invoice_paid", {
      eventId: event.id,
      invoiceId: event.data.object.id,
    });
    break;
  }

  case "invoice.payment_failed": {
    console.warn("stripe_invoice_payment_failed", {
      eventId: event.id,
      invoiceId: event.data.object.id,
    });
    break;
  }

  default: {
    console.info("stripe_event_ignored", {
      eventId: event.id,
      eventType: event.type,
    });
  }
}
  return NextResponse.json({ ok: true }, { status: 200 });
}
