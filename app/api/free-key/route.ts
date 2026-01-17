import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const BASE = process.env.CURP_API_BASE_URL || process.env.NEXT_PUBLIC_CURP_API_BASE_URL;

  if (!BASE) {
    return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });
  }

  const r = await fetch(`${BASE}/api/keys/free`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
