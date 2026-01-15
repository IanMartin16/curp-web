import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: object, secret: string) {
  const body = Buffer.from(JSON.stringify(payload));
  const bodyB64 = b64url(body);

  const sig = crypto.createHmac("sha256", secret).update(bodyB64).digest();
  const sigB64 = b64url(sig);

  return `${bodyB64}.${sigB64}`;
}

function getIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return xf || "unknown";
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function GET(req: NextRequest) {
  try {
    const secret = process.env.DEMO_SIGNING_SECRET || "";
    const ttl = Number(process.env.DEMO_TTL_SECONDS || "120");
    if (!secret) return NextResponse.json({ ok: false, error: "Missing DEMO_SIGNING_SECRET" }, { status: 500 });

    const ip = getIp(req);
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      v: 1,
      iat: now,
      exp: now + ttl,
      ipHash: sha256(ip),
      nonce: crypto.randomBytes(12).toString("hex"),
    };

    const token = sign(payload, secret);
    return NextResponse.json({ ok: true, token, exp: payload.exp }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
