"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessClient() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [masked, setMasked] = useState<string | null>(null);
  const [firstTime, setFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // timeout “suave”
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 12000);

        const r = await fetch(`/api/stripe/complete?session_id=${encodeURIComponent(sessionId)}`, {
          signal: controller.signal,
          cache: "no-store",
        }).finally(() => clearTimeout(t));

        const data = await r.json();
        if (!r.ok || !data.ok) throw new Error(data?.error || "complete failed");

        if (cancelled) return;

        setFirstTime(!!data.firstTime);
        setApiKey(data.apiKey ?? null);
        setMasked(data.masked ?? null);
        if (data.apiKey || null){
          localStorage.setItem("curpify_api_key", data.apiKey);
        }
      } catch (e: any) {
        if (cancelled) return;

        if (e?.name === "AbortError") {
          setErr("Se tardó en confirmar. Recarga la página en unos segundos.");
        } else {
          setErr(e?.message || "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function copy() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    alert("✅ API Key copiada");
  }

  if (!sessionId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>✅ Pago exitoso</h2>
        <p style={{ color: "tomato" }}>
          No llegó session_id. Revisa STRIPE_SUCCESS_URL con {"{CHECKOUT_SESSION_ID}"}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">✅ Pago exitoso</h1>

        {loading && <p className="text-slate-300">Preparando tu dashboard...</p>}
        {err && <p className="text-red-400">{err}</p>}

        {!loading && !err && (
          <>
            <p className="text-slate-300 mb-4">
              Tu sesión quedó lista. Ahora puedes entrar al dashboard.
            </p>

            {apiKey ? (
              <div className="border border-emerald-500/40 bg-emerald-500/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-300 mb-2">
                  Esta es tu API Key (se muestra <b>solo una vez</b>):
                </p>
                <p className="font-mono text-sm break-all">{apiKey}</p>
                <button
                  onClick={copy}
                  className="mt-3 bg-emerald-500 text-black font-semibold rounded-lg px-3 py-2 text-sm hover:bg-emerald-400"
                >
                  Copiar
                </button>
              </div>
            ) : (
              <div className="border border-slate-700 bg-slate-900/40 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-300">
                  API Key: <span className="font-mono">{masked || "creada"}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Por seguridad, no volvemos a mostrar la key completa.
                </p>
              </div>
            )}

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400"
            >
              Ir al Dashboard
            </Link>

            {firstTime === false && (
              <p className="text-xs text-slate-400 mt-3">
                Tip: si no copiaste tu key, aún puedes verla enmascarada en el dashboard.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

