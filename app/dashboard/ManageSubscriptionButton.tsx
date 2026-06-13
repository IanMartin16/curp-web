"use client";

import { useState } from "react";

type ManageSubscriptionButtonProps = {
  apiKey: string;
};

export default function ManageSubscriptionButton({
  apiKey,
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    try {
      setLoading(true);
      setError(null);

      const normalizedApiKey = apiKey.trim();

      if (!normalizedApiKey) {
        throw new Error("No se encontró una API key válida");
      }

      const response = await fetch("/api/billing-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: normalizedApiKey,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok || !data?.url) {
        throw new Error(
          data?.error || "No fue posible abrir el portal de suscripción"
        );
      }

      window.location.assign(data.url);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error abriendo el portal";

      console.error("manage_subscription_portal_failed", {
        message,
      });

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={openPortal}
        disabled={loading || !apiKey.trim()}
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Abriendo portal..."
          : "Administrar suscripción"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}