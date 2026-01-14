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
    // si viene "2026-01-13T00:00:00.000Z" o "2026-01-13"
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return isoOrDate;
    return d.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
  }


  const masked = summary?.masked || maskedLocal;

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

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

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
            <h2 className="font-semibold mb-2">Última validación</h2>
            {!last ? (
              <p className="text-slate-400 text-sm">Aún no hay consultas registradas.</p>
          ) : (
            <div className="text-sm text-slate-200">
              <div>CURP: <span className="font-mono">{last.curpMasked}</span></div>
              <div>Status: {last.statusCode}</div>
              <div>Resultado: {last.success ? "✅ válida" : "❌ inválida"}</div>
              <div>Fecha: {new Date(last.createdAt).toLocaleString("es-MX")}</div>
            </div>
            )}
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
              <div key={d.day} className="flex items-center gap-3">
                <div className="w-24 text-xs text-slate-400 font-mono">{d.day}</div>
                <div className="flex-1 bg-black/30 rounded">
                  <div
                    className="h-3 rounded bg-emerald-500/80"
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


        {/* Uso diario */}
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-5">
          <h2 className="font-semibold mb-2">Uso por día</h2>

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
                    <th className="text-left py-2">CURP</th>
                    <th className="text-left py-2">Resultado</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">ms</th>
                  </tr>
                </thead>
              <tbody>
                {recent.map((it, idx) => (
                  <tr key={idx} className="border-t border-slate-800">
                    <td className="py-2">
                      {new Date(it.ts).toLocaleString("es-MX")}
                    </td>
                    <td className="py-2 font-mono">{it.curpMasked}</td>
                    <td className="py-2">{it.success ? "✅ válida" : "❌ inválida"}</td>
                    <td className="py-2">{it.statusCode}</td>
                    <td className="py-2">{it.durationMs ?? "-"}</td>
                  </tr>
                 ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

          {!apiKey ? (
            <p className="text-slate-400 text-sm">Guarda tu API key para ver el uso.</p>
          ) : loading && !daily ? (
            <p className="text-slate-300 text-sm">Cargando...</p>
          ) : usageDaily?.items?.length ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="text-left py-2">Día</th>
                    <th className="text-right py-2">Consultas</th>
                  </tr>
                </thead>
                <tbody>
                  {usageDaily.items.map((it) => (
                    <tr key={it.day} className="border-t border-slate-800">
                      <td className="py-2 font-mono">{it.day}</td>
                      <td className="py-2 text-right">{it.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Aún no hay uso registrado en este periodo.</p>
          )}
        </div>
      </div>
    </div>
  );
  
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 border border-slate-800 rounded-xl p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
