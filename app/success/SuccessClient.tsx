"use client";

import { useEffect, useState } from "react";

export default function SuccessClient({ sessionId }: { sessionId: string | null }) {
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"error">("idle");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    (async () => {
      try {
        setStatus("loading");
        const r = await fetch(`/api/stripe/complete?session_id=${encodeURIComponent(sessionId)}`);
        const data = await r.json();
        if (!r.ok || !data.ok) throw new Error(data?.error || "complete failed");

        setApiKey(data.apiKey || null);
        setStatus("ok");
      } catch (e: any) {
        setError(e?.message || "error");
        setStatus("error");
      }
    })();
  }, [sessionId]);

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
    <div style={{ padding: 24 }}>
      <h2>✅ Pago exitoso</h2>

      {status === "loading" && <p>Confirmando pago...</p>}
      {status === "error" && <p style={{ color: "tomato" }}>{error}</p>}

      {status === "ok" && (
        <>
          <p>Tu API Key (cópiala ahora, solo una vez):</p>
          <pre style={{ padding: 12, borderRadius: 8, background: "#111", color: "#0f0" }}>
            {apiKey || "No API Key"}
          </pre>
        </>
      )}
    </div>
  );
}
