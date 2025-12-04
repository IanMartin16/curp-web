"use client";

import { useState } from "react";

type CurpData = {
  year: number;
  month: number;
  day: number;
  gender: string;
  state: string;
} | null;

type CurpResponse = {
  ok: boolean;
  curp: string;
  isValid: boolean;
  reasons?: string[];
  data?: CurpData;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const API_KEY = process.env.NEXT_PUBLIC_CURP_API_KEY || "";  

export default function Home() {
  const [curp, setCurp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CurpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!curp.trim()) {
      setError("Por favor ingresa una CURP para validar.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/curp/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
    "x-api-key": API_KEY, },
        body: JSON.stringify({ curp }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Respuesta no es JSON válido (status ${res.status})`);
      }

      if (!res.ok) {
        setError(
          data?.error ||
            `Error del servidor (status ${res.status}). Revisa la API.`
        );
        return;
      }

      setResult(data as CurpResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = () => {
    if (!result) return null;

    if (result.isValid) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          CURP válida
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-400/60 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        CURP no válida
      </span>
    );
  };

  const renderSummaryCard = () => {
    if (!result) return null;

    const d = result.data;

    return (
      <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-50">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-emerald-300/80">
              CURP analizada
            </p>
            <p className="font-mono text-sm md:text-base">{result.curp}</p>
          </div>
          {renderStatusBadge()}
        </div>

        {result.isValid && d && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs md:text-sm">
            <div>
              <p className="text-emerald-300/80 text-[11px] uppercase">
                Fecha nac.
              </p>
              <p className="font-medium">
                {String(d.day).padStart(2, "0")}/
                {String(d.month).padStart(2, "0")}/{d.year}
              </p>
            </div>
            <div>
              <p className="text-emerald-300/80 text-[11px] uppercase">
                Sexo
              </p>
              <p className="font-medium">{d.gender === "H" ? "Hombre" : "Mujer"}</p>
            </div>
            <div>
              <p className="text-emerald-300/80 text-[11px] uppercase">
                Estado
              </p>
              <p className="font-medium">{d.state}</p>
            </div>
            <div>
              <p className="text-emerald-300/80 text-[11px] uppercase">
                Estructura
              </p>
              <p className="font-medium">
                {result.isValid ? "Correcta" : "Con errores"}
              </p>
            </div>
          </div>
        )}

        {!result.isValid && result.reasons && result.reasons.length > 0 && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-100">
            <p className="mb-1 font-semibold text-red-200">
              Motivos por los que no es válida:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              {result.reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950 text-slate-50 flex flex-col">
      {/* Barra superior */}
      <header className="border-b border-emerald-800/40 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/50">
              C
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                CURP<span className="text-emerald-400">API</span>
              </p>
              <p className="text-[11px] text-emerald-200/70">
                Validación estructural profesional
              </p>
            </div>
          </div>
          <nav className="hidden text-xs md:flex gap-4 text-slate-300">
            <span className="hover:text-emerald-400 cursor-pointer">
              Demo
            </span>
            <span className="hover:text-emerald-400 cursor-pointer">
              Features
            </span>
            <span className="hover:text-emerald-400 cursor-pointer">
              Pricing (próximamente)
            </span>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-6xl w-full space-y-10">
          {/* Hero */}
          <div className="grid gap-10 md:grid-cols-[1.3fr,1fr] items-start">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-emerald-200">
                API para validación de identidad
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Valida CURP{" "}
                <span className="text-emerald-400">en milisegundos</span>{" "}
                desde cualquier sistema.
              </h1>
              <p className="text-slate-300 text-sm md:text-base mb-5 max-w-xl">
                Ideal para onboarding, KYC, formularios de clientes o
                integraciones internas. Diseñada para ser simple de integrar
                y visualmente clara para tus equipos.
              </p>
              <ul className="text-sm text-slate-300 space-y-2 mb-6">
                <li>• Validación de estructura, fecha de nacimiento y estado.</li>
                <li>• API REST lista para producción.</li>
                <li>• Dashboard y planes de precios en camino.</li>
              </ul>
              <p className="text-xs text-emerald-200/80">
                De la vista nace el amor: esta demo es el primer paso hacia tu
                suite de APIs profesional.
              </p>
            </div>

            {/* Tarjeta: probar API */}
            <div className="bg-slate-950/80 border border-emerald-700/60 rounded-2xl p-6 shadow-xl shadow-emerald-500/20">
              <h2 className="text-lg font-semibold mb-1">
                Probar la CURP API
              </h2>
              <p className="text-xs text-slate-300 mb-4">
                Envía una CURP y mira en tiempo real cómo responde tu backend.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="curp"
                    className="block text-xs font-medium mb-1 text-slate-200"
                  >
                    CURP
                  </label>
                  <input
                    id="curp"
                    type="text"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-emerald-700 bg-slate-950 px-3 py-2 text-sm font-mono tracking-wide text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="GOML920101HDFRRN09"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-200 bg-red-900/40 border border-red-700 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Validando..." : "Validar CURP"}
                </button>
              </form>

              {renderSummaryCard()}
            </div>
          </div>

          {/* Respuesta en crudo + features */}
          <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr] items-start">
            {/* JSON crudo */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-slate-100">
                Respuesta cruda de la API
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Ideal para desarrolladores: esto es exactamente lo que verás
                al consumir el endpoint desde tus servicios.
              </p>
              <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 text-xs text-emerald-100 font-mono overflow-x-auto">
                {result ? (
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                ) : (
                  <pre className="text-slate-500">
{`{
  "ok": true,
  "curp": "GOML920101HDFRRN09",
  "isValid": true,
  "data": {
    "year": 1992,
    "month": 1,
    "day": 1,
    "gender": "H",
    "state": "DF"
  }
}`}
                  </pre>
                )}
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 text-xs">
              <div className="rounded-2xl border border-emerald-700/60 bg-emerald-500/5 p-4">
                <h4 className="font-semibold mb-1 text-emerald-200">
                  Listo para SaaS
                </h4>
                <p className="text-slate-200">
                  Este front puede expandirse a dashboard con métricas,
                  consumo por API key, planes y facturación.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <h4 className="font-semibold mb-1 text-slate-100">
                  Integración sencilla
                </h4>
                <p className="text-slate-300">
                  Endpoint REST estándar que puedes consumir desde cualquier
                  lenguaje: Node, Java, Python, mainframe vía gateway, etc.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <h4 className="font-semibold mb-1 text-slate-100">
                  Escalable
                </h4>
                <p className="text-slate-300">
                  Diseñado pensando en despliegues en Railway, Render o AWS,
                  con posibilidad de rate limiting y API keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-[11px] text-slate-500">
        CURP API · Construida por ti · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
