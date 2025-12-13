import { NextResponse } from "next/server";

const BASE =
  process.env.CURP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_CURP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
  try {
    if (!BASE) return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });

    const ADMIN_KEY = process.env.CURP_ADMIN_API_KEY || process.env.ADMIN_API_KEY;
    if (!ADMIN_KEY) return NextResponse.json({ ok: false, error: "Falta CURP_ADMIN_API_KEY" }, { status: 500 });

    const body = await req.json().catch(() => ({}));

    const r = await fetch(`${BASE}/api/admin/keys/revoke`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-key": ADMIN_KEY,
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

