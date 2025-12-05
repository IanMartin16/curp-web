// lib/stripe.ts
import Stripe from "stripe";

// OJO: aquí ya no lanzamos error en build.
// Si la key no está, Stripe fallará en tiempo de ejecución,
// pero no romperá el deploy de Vercel.
const secretKey = process.env.STRIPE_SECRET_KEY ?? "sk_test_no_key_configured";

export const stripe = new Stripe(secretKey);
