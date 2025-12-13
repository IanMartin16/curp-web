import { NextResponse } from "next/server";

const BASE = process.env.CURP_API_BASE_URL;

export async function GET() {
  try {
    if (!BASE) return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });

    const masterKey = process.env.CURP_MASTER_API_KEY;
    if (!masterKey) return NextResponse.json({ ok: false, error: "Falta CURP_MASTER_API_KEY" }, { status: 500 });

    const r = await fetch(`${BASE}/api/admin/stats`, {
      method: "GET",
      headers: { "x-api-key": masterKey },
      cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}

