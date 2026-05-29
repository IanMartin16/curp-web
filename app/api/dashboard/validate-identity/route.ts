// app/api/dashboard/validate-identity/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.CURP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

async function safeJson(r: Response) {
  const ct = r.headers.get("content-type") || "";
  const text = await r.text();

  if (!ct.includes("application/json")) {
    return {
      ok: false,
      error: `Upstream non-JSON (${r.status}): ${text.slice(0, 200)}`,
    };
  }

  return JSON.parse(text);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") || "";
    if (!apiKey) return json(401, { ok: false, error: "Missing API key" });

    const API_BASE = process.env.CURP_API_BASE_URL;
    if (!API_BASE) {
      return json(500, { ok: false, error: "Missing CURP_API_BASE_URL" });
    }

    const body = await req.json().catch(() => ({}));

    const r = await fetch(`${API_BASE}/api/v1/validate/identity`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await safeJson(r);
    return json(r.status, data);
  } catch (e: any) {
    return json(500, {
      ok: false,
      error: e?.message || "validate identity failed",
    });
  }
}