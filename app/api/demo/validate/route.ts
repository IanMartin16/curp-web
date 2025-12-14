import { NextResponse } from "next/server";

const BASE = process.env.CURP_API_BASE_URL || process.env.NEXT_PUBLIC_CURP_API_BASE_URL;
const DEMO_KEY = process.env.CURP_DEMO_API_KEY;

export async function POST(req: Request) {
  try {
    if (!BASE) return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });
    if (!DEMO_KEY) return NextResponse.json({ ok: false, error: "Falta CURP_DEMO_API_KEY" }, { status: 500 });

    const body = await req.json().catch(() => ({}));

    // IP real (Vercel)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const r = await fetch(`${BASE}/api/curp/validate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": DEMO_KEY,   // ✅ la key demo NO se expone al navegador
        "x-demo-ip": ip,         // ✅ para limitar por IP en Railway
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}