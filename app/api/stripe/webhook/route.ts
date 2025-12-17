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

  const plan =
    (session.metadata?.plan as "developer" | "business" | undefined) ??
    (session.subscription && (session.metadata?.plan as any));

  const customerId = (session.customer as string) || null;
  const subscriptionId = (session.subscription as string) || null;
  const email = session.customer_details?.email || null;

  if (!plan || !subscriptionId) {
    console.log("⚠️ No hay plan o subscriptionId en la sesión:", session.id);
    break;
  }

  // 🔥 Aquí “avisamos” al backend para que cree la API key en Postgres
  const r = await fetch(`${process.env.CURP_API_BASE_URL}/api/stripe/fulfill`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": process.env.INTERNAL_WEBHOOK_SECRET || "",
    },
    body: JSON.stringify({
      plan,
      email,
      customerId,
      subscriptionId,
      sessionId: session.id,
    }),
  });

  const data = await r.json().catch(() => ({}));
  console.log("✅ Fulfill response:", r.status, data);

  break;
  }

}

  return NextResponse.json({ ok: true }, { status: 200 });
}
