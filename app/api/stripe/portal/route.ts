import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = body?.apiKey as string | undefined;

    if (!apiKey) return NextResponse.json({ ok: false, error: "Missing apiKey" }, { status: 400 });

    const API_BASE = process.env.CURP_API_BASE_URL;
    const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET;

    if (!API_BASE || !INTERNAL_SECRET) {
      return NextResponse.json({ ok: false, error: "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET" }, { status: 500 });
    }

    const r = await fetch(`${API_BASE}/api/stripe/customer-by-key?api_key=${encodeURIComponent(apiKey)}`, {
      headers: { "x-internal-secret": INTERNAL_SECRET },
      cache: "no-store",
    });

    const data = await r.json();
    if (!r.ok || !data.ok) return NextResponse.json(data, { status: r.status });

    const session = await stripe.billingPortal.sessions.create({
      customer: data.customerId,
      return_url: process.env.STRIPE_PORTAL_RETURN_URL || "http://localhost:3000/dashboard",
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
