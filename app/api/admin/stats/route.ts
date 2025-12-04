import { NextResponse } from "next/server";

const API_BASE_URL = process.env.CURP_API_BASE_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function GET() {
  if (!API_BASE_URL || !ADMIN_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "Faltan variables de entorno en el servidor (CURP_API_BASE_URL o ADMIN_API_KEY).",
      },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        "x-api-key": ADMIN_API_KEY,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error obteniendo stats:", err);
    return NextResponse.json(
      { ok: false, error: "Error al obtener estadísticas del backend." },
      { status: 500 }
    );
  }
}
