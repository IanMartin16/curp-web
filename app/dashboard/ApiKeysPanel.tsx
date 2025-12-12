"use client";

import { useEffect, useState } from "react";

type Plan = "free" | "developer" | "business";

interface ApiKeyItem {
  id: string;
  key: string;
  label: string;
  plan: Plan;
  active: boolean;
  createdAt: string;
  revokedAt: string | null;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_CURP_API_BASE_URL ||
  "https://curp-api-production.up.railway.app";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";

export function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [plan, setPlan] = useState<Plan>("free");
  const [error, setError] = useState<string | null>(null);

  async function loadKeys() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/keys`, {
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "No se pudieron cargar las keys");
      } else {
        setKeys(data.keys);
      }
    } catch {
      setError("Error de red al cargar keys");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ label, plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "No se pudo crear la key");
      } else {
        setKeys((prev) => [...prev, data.key]);
        setLabel("");
        setPlan("free");
      }
    } catch {
      setError("Error de red al crear key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("¿Revocar esta API key?")) return;

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/keys/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "No se pudo revocar la key");
      } else {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, ...data.key } : k))
        );
      }
    } catch {
      setError("Error de red al revocar key");
    }
  }

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key);
  }

  return (
    <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold mb-4">API keys</h2>

      {error && (
        <div className="mb-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Formulario crear nueva */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nombre de la key (ej. Backend interno)"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as Plan)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        >
          <option value="free">Free</option>
          <option value="developer">Developer</option>
          <option value="business">Business</option>
        </select>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {creating ? "Creando..." : "Generar key"}
        </button>
      </div>

      {/* Tabla de keys */}
      {loading ? (
        <p className="text-sm text-slate-400">Cargando keys...</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-slate-400">
          Todavía no hay API keys creadas.
        </p>
      ) : (
        <div className="space-y-2 text-sm">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
            >
              <div>
                <div className="font-mono text-xs">
                  {k.key}
                </div>
                <div className="text-xs text-slate-400">
                  {k.label} — plan {k.plan} —{" "}
                  {k.active ? "Activa" : "Revocada"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(k.key)}
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs"
                >
                  Copiar
                </button>
                {k.active && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="rounded-md border border-red-500 text-red-300 px-3 py-1 text-xs"
                  >
                    Revocar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
