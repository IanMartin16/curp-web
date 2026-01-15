// app/api/demo/validate/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function safeJson(r: Response) {
  const ct = r.headers.get("content-type") || "";
  const text = await r.text();
  if (!ct.includes("application/json")) {
    return { ok: false, error: `Upstream non-JSON (${r.status}): ${text.slice(0, 200)}` };
  }
  return JSON.parse(text);
}

export async function POST(req: Request) {
  try {
    const API_BASE = process.env.CURP_API_BASE_URL || process.env.NEXT_PUBLIC_CURP_API_BASE_URL;

    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const curp = String(body?.curp || "").trim().toUpperCase();

    if (!curp) {
      return NextResponse.json({ ok: false, error: "Falta curp en body" }, { status: 400 });
    }

    // ✅ Opción simple: DEMO = NO mandes x-api-key (tu apiKeyMiddleware permite demo en /validate)
    const r = await fetch(`${API_BASE}/api/curp/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ curp }),
      cache: "no-store",
    });

    const data = await safeJson(r);
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "demo validate failed" }, { status: 500 });
  }
}
