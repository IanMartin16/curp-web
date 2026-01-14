import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") || "";
    if (!apiKey) return NextResponse.json({ ok: false, error: "Missing API key" }, { status: 401 });

    const API_BASE = process.env.CURP_API_BASE_URL;
    if (!API_BASE) return NextResponse.json({ ok: false, error: "Missing CURP_API_BASE_URL" }, { status: 500 });

    const r = await fetch(`${API_BASE}/api/dashboard/last`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });

    const text = await r.text();
    const ct = r.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? JSON.parse(text)
      : { ok: false, error: `Upstream non-JSON (${r.status}): ${text.slice(0, 200)}` };

    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
