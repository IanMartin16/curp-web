import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

async function safeJson(
  response: Response,
  stage: string
): Promise<any> {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `${stage}: non-JSON response (${response.status}): ${text.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `${stage}: invalid JSON (${response.status}): ${text.slice(0, 200)}`
    );
  }
}

export async function GET(req: NextRequest) {
  let stage = "start";

  const sessionId =
    req.nextUrl.searchParams.get("session_id");

    stage = "validate-stripe-session";

  try {
    if (!sessionId) {
      return json(400, {
        ok: false,
        error: "Missing session_id",
      });
    }

    const CURP_API_BASE =
      process.env.CURP_API_BASE_URL;

    const INTERNAL_SECRET =
      process.env.INTERNAL_WEBHOOK_SECRET;

    if (!CURP_API_BASE || !INTERNAL_SECRET) {
      return json(500, {
        ok: false,
        error:
          "Missing CURP_API_BASE_URL or INTERNAL_WEBHOOK_SECRET",
      });
    }

    console.info("stripe_complete_started", {
      sessionId,
    });

    stage = "retrieve-stripe-session";

    let session;

    try {
      session =
        await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
      console.error(
        "stripe_complete_session_retrieve_failed",
        {
          sessionId,
          message: error?.message,
          stack: error?.stack,
        }
      );

      throw new Error(
        `retrieve-session: ${error?.message || "failed"}`
      );
    }

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : null;

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : null;

    const plan = session.metadata?.plan;

    console.info("stripe_complete_session_retrieved", {
      sessionId: session.id,
      subscriptionId,
      customerId,
      plan: plan ?? null,
      paymentStatus: session.payment_status,
      mode: session.mode,
    });

    if (
      !subscriptionId ||
      (plan !== "developer" && plan !== "business")
    ) {
      return json(400, {
        ok: false,
        error:
          "Missing or invalid subscriptionId/plan in Stripe session",
        debug: {
          subscriptionId,
          plan: plan ?? null,
          hasMetadata: Boolean(session.metadata),
        },
      });
    }

    stage = "fulfill";
    const fulfillResp = await fetch(
      `${CURP_API_BASE}/api/stripe/fulfill`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-internal-secret": INTERNAL_SECRET,
        },
        body: JSON.stringify({
          plan,
          email:
            session.customer_details?.email ?? null,
          customerId,
          subscriptionId,
          sessionId,
        }),
        cache: "no-store",
      }
    );

    stage = "parse-fulfill";
    const fulfillData = await safeJson(
      fulfillResp,
      "fulfill"
    );

    console.info("stripe_complete_fulfill_response", {
      sessionId,
      subscriptionId,
      responseStatus: fulfillResp.status,
      responseOk: fulfillResp.ok,
      dataOk: fulfillData?.ok ?? false,
      existing: fulfillData?.existing ?? null,
      error: fulfillData?.error ?? null,
      debug: fulfillData,
    });

    if (!fulfillResp.ok || !fulfillData?.ok) {
      return json(502, {
        ok: false,
        stage: "fulfill",
        error:
          fulfillData?.error || "fulfill failed",
        debug: fulfillData,
      });
    }

    stage = "reveal-once";
    const revealResp = await fetch(
      `${CURP_API_BASE}/api/stripe/reveal-once?session_id=${encodeURIComponent(sessionId)}`,
      {
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
        },
        cache: "no-store",
      }
    );

    stage = "parse-reveal";
    const revealData = await safeJson(
      revealResp,
      "reveal-once"
    );

    stage = "completed";

    console.info("stripe_complete_reveal_response", {
      sessionId,
      responseStatus: revealResp.status,
      responseOk: revealResp.ok,
      dataOk: revealData?.ok ?? false,
      firstTime: revealData?.firstTime ?? null,
      hasApiKey:
        typeof revealData?.apiKey === "string",
      hasMasked:
        typeof revealData?.masked === "string",
    });

    if (!revealResp.ok || !revealData?.ok) {
      return json(502, {
        ok: false,
        stage: "reveal-once",
        error:
          revealData?.error ||
          "reveal-once failed",
        debug: revealData,
      });
    }

    return json(200, {
      ok: true,
      apiKey:
        typeof revealData.apiKey === "string"
          ? revealData.apiKey
          : null,
      masked:
        typeof revealData.masked === "string"
          ? revealData.masked
          : null,
      firstTime:
        typeof revealData.firstTime === "boolean"
          ? revealData.firstTime
          : null,
    });
  } catch (error: any) {
    console.error("stripe_complete_failed", {
      sessionId,
      message: error?.message,
      stack: error?.stack,
    });

    return json(500, {
      ok: false,
      error:
        error?.message || "complete failed",
    });
  }
}