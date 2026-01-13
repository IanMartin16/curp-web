"use client";

import { useState } from "react";

export default function ManageSubscriptionButton({ apiKey }: { apiKey: string }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    try {
      setLoading(true);

      const r = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) throw new Error(data?.error || "Portal error");

      window.location.href = data.url;
    } catch (e: any) {
      alert("❌ " + (e?.message || "Error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="inline-flex items-center justify-center bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400 disabled:opacity-60"
    >
      {loading ? "Abriendo portal..." : "Administrar suscripción"}
    </button>
  );
}
