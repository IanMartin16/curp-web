// lib/stripe.ts
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // No hacemos throw en build, solo avisamos.
  console.warn("⚠️ STRIPE_SECRET_KEY no está configurada");
}

// Si no hay key, pasamos string vacío: fallará solo si se usa Stripe.
export const stripe = new Stripe(secretKey ?? "");
