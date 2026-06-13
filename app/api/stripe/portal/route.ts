import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey =
      typeof body?.apiKey === "string"
        ? body.apiKey.trim()
        : "";

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing apiKey",
        },
        { status: 400 }
      );
    }

    const API_BASE = process.env.CURP_API_BASE_URL;
    const INTERNAL_SECRET =
      process.env.INTERNAL_WEBHOOK_SECRET;

    if (!API_BASE || !INTERNAL_SECRET) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${API_BASE}/api/stripe/customer-by-key`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-internal-secret": INTERNAL_SECRET,
        },
        body: JSON.stringify({
          apiKey,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      return NextResponse.json(
        data ?? {
          ok: false,
          error: "Invalid response from Curpify API",
        },
        { status: response.status }
      );
    }

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer: data.customerId,
        return_url:
          process.env.STRIPE_PORTAL_RETURN_URL ||
          "http://localhost:3000/dashboard",
      });

    return NextResponse.json(
      {
        ok: true,
        url: portalSession.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("stripe_portal_session_failed", {
      message: error?.message,
      stack: error?.stack,
    });

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error",
      },
      { status: 500 }
    );
  }
}