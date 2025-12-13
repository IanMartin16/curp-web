import { NextResponse } from "next/server";

const BASE = process.env.CURP_API_BASE_URL!;
const ADMIN = process.env.ADMIN_API_KEY!;

export async function GET() {
  if (!BASE || !ADMIN) {
    return NextResponse.json(
      { ok: false, error: "Faltan envs CURP_API_BASE_URL o ADMIN_API_KEY" },
      { status: 500 }
    );
  }

  const r = await fetch(`${BASE}/api/admin/keys`, {
    headers: { "x-admin-key": ADMIN },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: Request) {
  if (!BASE || !ADMIN) {
    return NextResponse.json(
      { ok: false, error: "Faltan envs CURP_API_BASE_URL o ADMIN_API_KEY" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const r = await fetch(`${BASE}/api/admin/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN,
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
