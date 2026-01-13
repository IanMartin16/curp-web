import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

async function safeJson(r: Response) {
  const ct = r.headers.get("content-type") || "";
  const text = await r.text();
  if (!ct.includes("application/json")) {
    return { ok: false, error: `Upstream non-JSON (${r.status}): ${text.slice(0, 200)}` };
  }
  return JSON.parse(text);
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") || "";
    if (!apiKey) return json(401, { ok: false, error: "Missing API key" });

    const days = req.nextUrl.searchParams.get("days") || "14";

    const API_BASE = process.env.CURP_API_BASE_URL;
    if (!API_BASE) return json(500, { ok: false, error: "Missing CURP_API_BASE_URL" });

    const r = await fetch(`${API_BASE}/api/dashboard/daily?days=${encodeURIComponent(days)}`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });

    const data = await safeJson(r);
    return json(r.status, data);
  } catch (e: any) {
    return json(500, { ok: false, error: e?.message || "Error" });
  }
}
