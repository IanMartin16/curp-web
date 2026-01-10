import { NextResponse } from "next/server";

const API_BASE =
  process.env.CURP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_CURP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL;

const INTERNAL_SECRET = process.env.INTERNAL_WEBHOOK_SECRET; // MISMA que en curp-api

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json().catch(() => ({}))) as { sessionId?: string };
    if (!sessionId) return NextResponse.json({ ok: false, error: "Falta sessionId" }, { status: 400 });

    if (!API_BASE) return NextResponse.json({ ok: false, error: "Falta CURP_API_BASE_URL" }, { status: 500 });
    if (!INTERNAL_SECRET) return NextResponse.json({ ok: false, error: "Falta INTERNAL_WEBHOOK_SECRET" }, { status: 500 });

    const r = await fetch(`${API_BASE}/api/stripe/dashboard-session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));

    // si ok -> set cookie
    if (r.ok && data?.ok && data?.token) {
      const res = NextResponse.json(data, { status: 200 });
      res.cookies.set("curpify_session", String(data.token), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });
      return res;
    }

    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
