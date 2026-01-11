"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "idle" | "loading" | "ok" | "error";

export default function SuccessClient() {
  const sp = useSearchParams();

  // ✅ lee session_id directo del URL
  const sessionId = useMemo(() => sp.get("session_id"), [sp]);

  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [masked, setMasked] = useState<string | null>(null);

  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    (async () => {
      setStatus("loading");
      setErr(null);

      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 15000); // 15s timeout

      try {
        const r = await fetch(
          `/api/stripe/complete?session_id=${encodeURIComponent(sessionId)}`,
          { signal: ac.signal, cache: "no-store" }
        );

        // 🔥 leer como texto primero (por si regresa HTML, redirect, etc.)
        const txt = await r.text();
        let data: any = null;

        try {
          data = JSON.parse(txt);
        } catch {
          // no era JSON
        }

        if (!r.ok) {
          const msg = data?.error || txt?.slice?.(0, 200) || `HTTP ${r.status}`;
          throw new Error(`HTTP ${r.status}: ${msg}`);
        }

        if (!data?.ok) {
          throw new Error(data?.error || "complete failed");
        }

        // apiKey solo se muestra una vez si backend así lo manda
        const key = data.apiKey ?? null;

        // masked puede venir como "masked" o "apiKeyMasked" según tu backend
        const m =
          data.masked ??
          data.apiKeyMasked ??
          (key ? maskKey(key) : null);

        if (!mounted) return;

        setApiKey(key);
        setMasked(m);
        setStatus("ok");
      } catch (e: any) {
        if (!mounted) return;

        if (e?.name === "AbortError") {
          setErr("Timeout confirmando pago (15s). Reintenta recargando la página.");
        } else {
          setErr(e?.message || "error");
        }
        setStatus("error");
      } finally {
        clearTimeout(t);
      }
    })();

    return () => {
      mounted = false;
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
        {status === "error" && err && <p className="text-red-400">{err}</p>}

        {status === "ok" && (
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
          </>
        )}
      </div>
    </div>
  );
}

// helper: enmascara una key (curp_xxx...yyy)
function maskKey(key: string) {
  if (key.length <= 10) return "********";
  return `${key.slice(0, 8)}…${key.slice(-4)}`;
}

