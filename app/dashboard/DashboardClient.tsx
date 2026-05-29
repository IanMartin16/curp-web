"use client";

import { useEffect, useMemo, useState } from "react";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

type Summary = {
  ok: boolean;
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  masked?: string;
  periodStart?: string;
  periodEnd?: string;
  error?: string;
};

type Daily = {
  ok: boolean;
  items: Array<{ day: string; count: number }>;
  error?: string;
};

type IdentityValidationResult = {
  valid: boolean;
  status: "valid" | "invalid";
  type: "curp" | "rfc" | "unknown";
  personType?: "physical" | "moral" | "unknown";
  normalized: string;
  summary: string;
  errors: Array<{
    code: string;
    field: string;
    message: string;
  }>;
  metadata: {
    source: string;
    version: string;
  };
};

export default function DashboardClient() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const [usageDays, setUsageDays] = useState<14 | 30 | 60>(14);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [usageDaily, setUsageDaily] = useState<Daily | null>(null);

  const [recent, setRecent] = useState<any[] | null>(null);
  const [recentErr, setRecentErr] = useState<string | null>(null);

  const [days, setDays] = useState(14);
  const [daily, setDaily] = useState<{ day: string; used: number }[] | null>(null);
  const [dailyErr, setDailyErr] = useState<string | null>(null);

  const [identityValue, setIdentityValue] = useState("");
  const [identityLoading, setIdentityLoading] = useState(false);
  const [identityResult, setIdentityResult] = useState<IdentityValidationResult | null>(null);
  const [identityErr, setIdentityErr] = useState<string | null>(null);
  const [ copiedIdentity, setCopiedIdentity ] = useState(false);

  

  useEffect(() => {
    const k = localStorage.getItem("curpify_api_key");
    if (k) setApiKey(k);
  }, []);

  const [last, setLast] = useState<any>(null);

    useEffect(() => {
      if (!apiKey) return;

      (async () => {
        const r = await fetch("/api/dashboard/last", {
          headers: { "x-api-key": apiKey },
          cache: "no-store",
        });
        const data = await r.json();
        if (data?.ok) setLast(data.item);
      })();
    }, [apiKey]);

    useEffect(() => {
    if (!apiKey) return;

    (async () => {
      try {
        setDailyErr(null);
        setDaily(null);

        const r = await fetch(`/api/dashboard/daily?days=${days}`, {
          headers: { "x-api-key": apiKey },
          cache: "no-store",
        });

        const data = await r.json();
        if (!r.ok || !data.ok) throw new Error(data?.error || "daily failed");

        setDaily(data.items || []);
      } catch (e: any) {
        setDailyErr(e?.message || "error");
        setDaily([]);
      }
    })();
  }, [apiKey, days]);


  useEffect(() => {
    if (!apiKey) return;

    (async () => {
      try {
        setRecentErr(null);
        const r = await fetch("/api/dashboard/recent?limit=10", {
          headers: { "x-api-key": apiKey },
          cache: "no-store",
        });
        const data = await r.json();
        if (!r.ok || !data.ok) throw new Error(data?.error || "recent failed");
        setRecent(data.items || []);
      } catch (e: any) {
        setRecentErr(e?.message || "error");
        setRecent(null);
      }
    })();
  }, [apiKey]);

  const maskedLocal = useMemo(() => {
    if (!apiKey) return null;
    if (apiKey.length <= 10) return "****";
    return apiKey.slice(0, 6) + "..." + apiKey.slice(-4);
  }, [apiKey]);

  function saveKey() {
    const k = input.trim();
    if (!k) return;
    localStorage.setItem("curpify_api_key", k);
    setApiKey(k);
    setInput("");
    alert("✅ API Key guardada en este dispositivo");
  }

  function clearKey() {
    localStorage.removeItem("curpify_api_key");
    setApiKey(null);
    setSummary(null);
    setDaily(null);
    setErr(null);

    setIdentityValue("");
    setIdentityResult(null);
    setIdentityErr(null);
    setRecent(null);
    setLast(null);
  }

  async function loadData(k: string, d: number) {
    setLoading(true);
    setErr(null);

    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/dashboard/summary", {
          headers: { "x-api-key": k },
          cache: "no-store",
        }),
        fetch(`/api/dashboard/daily?days=${encodeURIComponent(String(d))}`, {
          headers: { "x-api-key": k },
          cache: "no-store",
        }),
      ]);

      const s = (await r1.json()) as Summary;
      const di = (await r2.json()) as Daily;

      if (!r1.ok || !s.ok) throw new Error(s.error || "No pude cargar summary");
      if (!r2.ok || !di.ok) throw new Error(di.error || "No pude cargar daily");

      setSummary(s);
      setUsageDaily(di);
    } catch (e: any) {
      setErr(e?.message || "Error");
      setSummary(null);
      setUsageDaily(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!apiKey) return;
    loadData(apiKey, usageDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, usageDays]);

  function fmtDay(isoOrDate: string) {
    const value = String(isoOrDate || "");

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  function Stat({ label, value }: { label: string; value: string }) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-black/25 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      </div>
    );
  }

async function refreshDashboardData(k: string) {
  await loadData(k, usageDays);

  try {
    const [lastRes, recentRes, dailyRes] = await Promise.all([
      fetch("/api/dashboard/last", {
        headers: { "x-api-key": k },
        cache: "no-store",
      }),
      fetch("/api/dashboard/recent?limit=10", {
        headers: { "x-api-key": k },
        cache: "no-store",
      }),
      fetch(`/api/dashboard/daily?days=${days}`, {
        headers: { "x-api-key": k },
        cache: "no-store",
      }),
    ]);

    const lastData = await lastRes.json();
    const recentData = await recentRes.json();
    const dailyData = await dailyRes.json();

    if (lastData?.ok) setLast(lastData.item);
    if (recentData?.ok) setRecent(recentData.items || []);
    if (dailyData?.ok) setDaily(dailyData.items || []);
  } catch (e) {
    console.warn("Dashboard refresh failed", e);
  }
}

async function validateIdentityFromDashboard() {
  if (!apiKey) {
    setIdentityErr("Guarda tu API key para validar desde el dashboard.");
    return;
  }

  const value = identityValue.trim();

  if (!value) {
    setIdentityErr("Ingresa una CURP o RFC para validar.");
    return;
  }

  setIdentityLoading(true);
  setIdentityErr(null);
  setIdentityResult(null);
  setCopiedIdentity(false);

  try {
    const r = await fetch("/api/dashboard/validate-identity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ value }),
      cache: "no-store",
    });

    const data = (await r.json()) as IdentityValidationResult & {
      error?: string;
    };

    if (!r.ok) {
      throw new Error(data?.error || "No pude validar la identidad.");
    }

    setIdentityResult(data);

    setSummary((prev) => {
      if (!prev) return prev;

      const nextUsed = prev.used + 1;

      return {
        ...prev,
        used: nextUsed,
        remaining: Math.max(prev.limit - nextUsed, 0),
      };
    });

await refreshDashboardData(apiKey);

    // refresca usage después de validar
    await refreshDashboardData(apiKey);
  } catch (e: any) {
    setIdentityErr(e?.message || "Error al validar identidad.");
  } finally {
    setIdentityLoading(false);
  }
}

async function copyNormalizedIdentity() {
  if (!identityResult?.normalized) return;

  try {
    await navigator.clipboard.writeText(identityResult.normalized);
    setCopiedIdentity(true);

    setTimeout(() => {
      setCopiedIdentity(false);
    }, 1500);
  } catch (e) {
    console.warn("No pude copiar el identificador", e);
  }
}

  const masked = summary?.masked || maskedLocal;

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#020c1b] p-6 shadow-lg">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  ✓
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    Curpify Console
                  </p>
                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    Identity Validation Dashboard
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Valida CURP y RFC desde una API simple o desde un dashboard listo para
                equipos no técnicos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300">
                v1.5
              </span>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Identity Validation
              </span>

              {apiKey && (
                <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300">
                  Key activa: <span className="font-mono">{masked}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
          <h2 className="font-semibold mb-2">Tu API Key</h2>

          {apiKey ? (
            <>
              <p className="text-slate-300 text-sm">
                Guardada en este dispositivo: <span className="font-mono">{masked}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => loadData(apiKey, usageDays)}
                  className="bg-slate-200 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-white"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Actualizar"}
                </button>

                <button
                  onClick={clearKey}
                  className="bg-slate-800 border border-slate-700 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-slate-700"
                >
                  Quitar key
                </button>

                <ManageSubscriptionButton apiKey={apiKey} />
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-300 text-sm mb-3">
                Pega tu API key para ver tus estadísticas (se guarda solo en este navegador).
              </p>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="curp_...."
                  className="w-full bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={saveKey}
                  className="bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400"
                >
                  Guardar
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Validar identidad */}
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h2 className="font-semibold">Validar identidad</h2>
              <p className="text-slate-400 text-sm mt-1">
                Valida CURP o RFC desde el dashboard usando tu API key activa.
              </p>
            </div>

            <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Identity Validation v1.5
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-2">
            <input
              value={identityValue}
              onChange={(e) => setIdentityValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") validateIdentityFromDashboard();
              }}
              placeholder="Ingresa una CURP o RFC"
              className="w-full bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500/70"
              disabled={!apiKey || identityLoading}
            />

            <button
              onClick={validateIdentityFromDashboard}
              disabled={!apiKey || identityLoading}
              className="bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {identityLoading ? "Validando..." : "Validar"}
            </button>
          </div>

              {!apiKey && (
                <p className="text-slate-500 text-sm mt-3">
                  Guarda tu API key para habilitar la validación desde el dashboard.
                </p>
              )}

              {identityErr && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm text-red-300">{identityErr}</p>
                </div>
              )}

              {identityResult && (
                <div
                  className={`mt-4 rounded-xl border p-4 ${
                    identityResult.valid
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            identityResult.valid ? "text-emerald-300" : "text-amber-300"
                          }`}
                        >
                          {identityResult.valid ? "Identidad válida" : "Requiere revisión"}
                        </p>

                        <p className="text-white font-semibold mt-1">
                          {identityResult.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs uppercase text-slate-300">
                          {identityResult.type}
                        </span>

                        {identityResult.personType && identityResult.personType !== "unknown" && (
                          <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300">
                            {identityResult.personType === "physical"
                              ? "Persona física"
                              : "Persona moral"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-slate-400 text-xs">Valor normalizado</p>

                          {identityResult.normalized && (
                            <button
                              type="button"
                              onClick={copyNormalizedIdentity}
                              className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
                            >
                              {copiedIdentity ? "Copiado" : "Copiar"}
                            </button>
                          )}
                        </div>

                        <p className="font-mono text-slate-100 mt-2 break-all">
                          {identityResult.normalized || "-"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                        <p className="text-slate-400 text-xs">Motor</p>
                        <p className="text-slate-100 mt-1">
                          {identityResult.metadata?.source} v{identityResult.metadata?.version}
                        </p>
                      </div>
                    </div>

                    {identityResult.errors?.length > 0 && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-slate-300 hover:text-white">
                          Ver detalle técnico
                        </summary>

                        <div className="mt-3 space-y-2">
                          {identityResult.errors.map((error, idx) => (
                            <div
                              key={`${error.code}-${idx}`}
                              className="rounded-lg border border-slate-800 bg-black/20 p-3 text-sm"
                            >
                              <p className="font-mono text-amber-300">{error.code}</p>
                              <p className="text-slate-300 mt-1">{error.message}</p>
                              <p className="text-slate-500 text-xs mt-1">Campo: {error.field}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>

        {/* Estado */}
        {err && (
          <div className="bg-[#020c1b] border border-red-500/40 rounded-xl p-5">
            <p className="text-red-400">{err}</p>
          </div>
        )}

        {/* Resumen */}
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Resumen del mes</h2>

            <select
              value={usageDays}
              onChange={(e) => setUsageDays(Number(e.target.value) as any)}
              className="bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              disabled={!apiKey}
            >
              <option value={14}>Últimos 14 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={60}>Últimos 60 días</option>
            </select>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-black/20 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Última validación
                </p>

                {!last ? (
                  <p className="mt-2 text-sm text-slate-400">
                    Aún no hay consultas registradas.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-sm text-slate-100">
                      {last.identityMasked ?? last.rfcMasked ?? last.curpMasked ?? "-"}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {new Date(last.createdAt).toLocaleString("es-MX", {
                        hour12: true,
                      })}
                    </p>
                  </>
                )}
              </div>

              {last && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs uppercase text-slate-300">
                    {last.identityType ?? "identity"}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    last.success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {last.success ? "Válido" : "Requiere revisión"}
                  </span>

                  <span className="rounded-full border border-slate-700 bg-black/30 px-3 py-1 text-xs text-slate-400">
                    HTTP {last.statusCode}
                </span>
              </div>
            )}
          </div>
        </div>

          {!apiKey ? (
            <p className="text-slate-400 text-sm mt-3">Guarda tu API key para ver el resumen.</p>
          ) : loading && !summary ? (
            <p className="text-slate-300 text-sm mt-3">Cargando...</p>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
              <Stat label="Plan" value={summary.plan} />
              <Stat label="Límite" value={String(summary.limit)} />
              <Stat label="Usadas" value={String(summary.used)} />
              <Stat label="Restantes" value={String(summary.remaining)} />
              {(summary.periodStart || summary.periodEnd) && (
                <p className="text-xs text-slate-400 md:col-span-4">
                  Periodo: {summary.periodStart} → {summary.periodEnd}
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm mt-3">Sin datos.</p>
          )}
        </div>

        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Uso diario</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDays(14)}
                className={`px-3 py-1 rounded-lg text-sm border ${days === 14 ? "bg-emerald-500 text-black border-emerald-500" : "border-slate-700 text-slate-200"}`}
              >
                14 días
              </button>
              <button
                onClick={() => setDays(30)}
                className={`px-3 py-1 rounded-lg text-sm border ${days === 30 ? "bg-emerald-500 text-black border-emerald-500" : "border-slate-700 text-slate-200"}`}
              >
                30 días
              </button>
            </div>
          </div>

            {dailyErr && <p className="text-red-400 text-sm mt-2">{dailyErr}</p>}

            {!daily ? (
              <p className="text-slate-400 text-sm mt-2">Cargando…</p>
              ) : daily.length === 0 ? (
              <p className="text-slate-400 text-sm mt-2">Aún no hay uso registrado.</p>
              ) : (
            <>
            {/* mini barras */}
              {(() => {
                const max = Math.max(...daily.map((d) => d.used), 1);
                return (
                  <div className="mt-4 space-y-2">
                    {daily.map((d) => (
                      <div key={d.day} className="flex items-center gap-4">
                        <div className="w-28 text-xs text-slate-400 font-mono">{fmtDay(d.day)}</div>
                        <div className="flex-1 rounded-full bg-black/30">
                          <div
                            className="h-2.5 rounded-full bg-emerald-500/80"
                            style={{ width: `${Math.max(2, Math.round((d.used / max) * 100))}%` }}
                            title={`${d.used}`}
                          />
                        </div>
                        <div className="w-10 text-right text-xs text-slate-300">{d.used}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* Últimas validaciones */}
          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
            <h2 className="font-semibold mb-2">Últimas validaciones</h2>

            {recentErr && <p className="text-red-400 text-sm">{recentErr}</p>}

            {!recent ? (
              <p className="text-slate-400 text-sm">Cargando…</p>
            ) : recent.length === 0 ? (
              <p className="text-slate-400 text-sm">Aún no hay historial.</p>
            ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Identificador</th>
                    <th className="text-left py-2">Resultado</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">ms</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((it: any, idx: number) => (
                    <tr key={idx} className="border-t border-slate-800">
                      <td className="py-2">{new Date(it.ts).toLocaleString("es-MX", { hour12: true })}</td>
                      <td className="py-2 font-mono">
                        {it.identityMasked ?? it.rfcMasked ?? it.curpMasked ?? it.identity ?? it.rfc ?? it.curp ?? "-"}
                      </td>
                      <td className="py-2">{it.success ? "✅ válida" : "❌ inválida"}</td>
                      <td className="py-2">{it.statusCode ?? it.status_code ?? "-"}</td>
                      <td className="py-2">{it.durationMs ?? it.duration_ms ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
)};
