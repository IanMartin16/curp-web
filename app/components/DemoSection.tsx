// app/components/DemoSection.tsx
"use client";

import { useState } from "react";

type DemoResult = {
  ok?: boolean;
  valid?: boolean;
  curp?: string;
  normalized?: string;
  status?: string;
  summary?: string;
  errors?: any[];
  [key: string]: any;
};

const SAMPLE_CURPS = [
  {
    label: "Ejemplo válido",
    value: "MAVM990101HDFRRL07",
  },
  {
    label: "Formato inválido",
    value: "MAVM990101XXX",
  },
];

export function DemoSection() {
  const [curp, setCurp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleValidate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const c = curp.trim().toUpperCase();

      if (!c) {
        throw new Error("Ingresa una CURP para validar.");
      }

      const res = await fetch("/api/demo/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ curp: c }),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        setError(data.error || "No se pudo validar la CURP.");
        return;
      }

      setResult(data);
    } catch (e: any) {
      console.error("Error en demo:", e);
      setError(e?.message || "Error de red, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    result?.valid === true ||
    result?.isValid === true ||
    result?.status === "valid";

  return (
    <section
      id="demo"
      className="mt-20 border-y border-slate-800/80 bg-slate-950/60 px-4 py-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Demo público
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Prueba Curpify sin configuración.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
            Este demo valida CURP sin API key y tiene límite por IP. Para
            consumir tu plan, usa el Dashboard o integra la API protegida con{" "}
            <span className="font-mono text-slate-300">x-api-key</span>.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#020c1b] p-5 shadow-lg">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Live Validation
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Demo CURP
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300">
                  Sin API key
                </span>
                <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300">
                  Límite por IP
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={curp}
                onChange={(e) => setCurp(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleValidate();
                }}
                placeholder="MAVM990101HDFRRL07"
                className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500/70"
              />

              <button
                onClick={handleValidate}
                disabled={loading || !curp}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Validando...
                  </>
                ) : (
                  "Validar demo"
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="mr-1 text-slate-500">Ejemplos:</span>

              {SAMPLE_CURPS.map((sample) => (
                <button
                  key={sample.value}
                  type="button"
                  onClick={() => {
                    setCurp(sample.value);
                    setResult(null);
                    setError(null);
                  }}
                  className="rounded-full border border-slate-700 bg-black/20 px-3 py-1 transition hover:border-emerald-500/60 hover:text-emerald-300"
                >
                  {sample.label}:{" "}
                  <span className="font-mono">{sample.value}</span>
                </button>
              ))}
            </div>

            <div className="min-h-[150px] overflow-x-auto rounded-2xl border border-slate-800 bg-black/25 p-4 text-sm">
              {loading && (
                <div className="flex h-[110px] items-center justify-center text-slate-400">
                  Validando CURP...
                </div>
              )}

              {!loading && error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm font-semibold text-red-300">
                    No se pudo validar
                  </p>
                  <p className="mt-1 text-sm text-red-200">{error}</p>
                </div>
              )}

              {!loading && !error && result && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isValid ? "text-emerald-300" : "text-amber-300"
                        }`}
                      >
                        {isValid ? "CURP aceptada por el demo" : "Requiere revisión"}
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {result.summary ||
                          (isValid
                            ? "La CURP cumple con la validación básica del demo."
                            : "La CURP no pasó la validación básica del demo.")}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                        isValid
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {isValid ? "Aceptada" : "No válida"}
                    </span>
                  </div>

                  <details className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <summary className="cursor-pointer text-sm text-slate-300 hover:text-white">
                      Ver respuesta JSON
                    </summary>

                    {!isValid && result?.reasons?.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-200">
                        {result.reasons.map((reason: string, idx: number) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    )}

                    <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-100">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {!loading && !error && !result && (
                <div className="flex h-[110px] flex-col items-center justify-center text-center">
                  <p className="text-sm font-semibold text-slate-300">
                    Aquí aparecerá el resultado del demo.
                  </p>
                  <p className="mt-1 max-w-md text-xs text-slate-500">
                    Usa una CURP sintética de ejemplo o escribe otra para ver la
                    respuesta de validación.
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-slate-500">
              El demo público es independiente de las API keys. Las validaciones
              con consumo real se realizan desde el Dashboard o desde la API
              protegida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
