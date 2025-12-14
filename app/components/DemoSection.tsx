// app/components/DemoSection.tsx
"use client";

import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CURP_API_BASE_URL ??
  "https://curp-api-production.up.railway.app";

// 👇 aseguramos que NUNCA sea undefined
const DEMO_API_KEY =
  process.env.NEXT_PUBLIC_CURP_DEMO_API_KEY ?? "cliente_demo_001";

export function DemoSection() {
  const [curp, setCurp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleValidate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/curp/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
//          "x-api-key": DEMO_API_KEY,
        },
        body: JSON.stringify({ curp }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        setError(data.error || "No se pudo validar la CURP.");
      } else {
        setResult(data);
      }
    } catch (e) {
      console.error("Error en demo:", e);
      setError("Error de red, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <section
      id="demo"
      className="mt-24 border-t border-slate-800 bg-slate-950/60 py-16 px-4"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* TÍTULO */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Probar la CURP API en vivo
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            Escribe una CURP de ejemplo y mira la respuesta de Curpify en tiempo
            real. Ideal para producto, legales o gente no técnica.
          </p>
        </div>

        {/* INPUT + BOTÓN */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={curp}
            onChange={(e) => setCurp(e.target.value.toUpperCase())}
            placeholder="HECM740516HDFRSR08"
            className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleValidate}
            disabled={loading || !curp}
            className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Validando...
              </>
            ) : (
              "Validar CURP"
            )}
          </button>
        </div>

        {/* RESULTADO */}
        <div className="min-h-[120px] rounded-md border border-slate-800 bg-slate-900/60 p-4 text-sm font-mono text-slate-100 overflow-x-auto">
          {error && <div className="text-red-400">{error}</div>}

          {!error && result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Respuesta de la API</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/40">
                  200 OK
                </span>
              </div>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          {!error && !result && !loading && (
            <span className="text-slate-500">
              Aquí aparecerá la respuesta JSON de tu API. Usa la CURP de
              ejemplo o escribe otra.
            </span>
          )}
        </div>

        {/* CURPs DE EJEMPLO RÁPIDO */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="text-slate-500 mr-2">Ejemplos:</span>
          {["HECM740516HDFRSR08", "GOCJ800101HDFLNS09", "BEAJ900202MDFRRL05"].map(
            (sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setCurp(sample)}
                className="rounded-full border border-slate-700 px-3 py-1 hover:border-emerald-500 hover:text-emerald-400 transition"
              >
                {sample}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
