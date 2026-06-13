// app/api/billing-portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
          error: "apiKey requerida",
        },
        { status: 400 }
      );
    }

    const API_BASE = process.env.CURP_API_BASE_URL;
    const INTERNAL_SECRET =
      process.env.INTERNAL_WEBHOOK_SECRET;

    const RETURN_URL =
      process.env.STRIPE_PORTAL_RETURN_URL ||
      "https://curpify.com/dashboard";

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

    const customerResponse = await fetch(
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

    const customerData = await customerResponse
      .json()
      .catch(() => null);

    if (!customerResponse.ok || !customerData?.ok) {
      console.error("billing_portal_customer_lookup_failed", {
        responseStatus: customerResponse.status,
        responseData: customerData,
      });

      return NextResponse.json(
        customerData ?? {
          ok: false,
          error: "No fue posible identificar al cliente",
        },
        { status: customerResponse.status }
      );
    }

    const customerId =
      typeof customerData.customerId === "string"
        ? customerData.customerId
        : "";

    if (!customerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe customer no encontrado",
        },
        { status: 404 }
      );
    }

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: RETURN_URL,
      });

    if (!portalSession.url) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe no devolvió URL del portal",
        },
        { status: 502 }
      );
    }

    console.info("billing_portal_session_created", {
      customerId,
    });

    return NextResponse.json({
      ok: true,
      url: portalSession.url,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    console.error("billing_portal_session_failed", {
      message,
      stack:
        error instanceof Error
          ? error.stack
          : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Error creando sesión de Billing Portal",
      },
      { status: 500 }
    );
  }
}