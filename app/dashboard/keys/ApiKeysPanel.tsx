"use client";

import { useEffect, useMemo, useState } from "react";

type PlanType = "free" | "developer" | "business";

type ApiKeyRecord = {
  id: string;
  key: string;
  label: string;
  plan: PlanType;
  active: boolean;
  createdAt: string;
  revokedAt?: string | null;
};

export default function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [plan, setPlan] = useState<PlanType>("free");
  const [creating, setCreating] = useState(false);

  const activeKeys = useMemo(() => keys.filter(k => k.active), [keys]);

  async function loadKeys() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/keys", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Error cargando keys");
      setKeys(data.keys || []);
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    alert("✅ Copiada al portapapeles");
  }

  async function createKey() {
    setCreating(true);
    try {
      const r = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || undefined, plan }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Error creando key");
      setLabel("");
      await loadKeys();
      alert("✅ Key creada");
    } catch (e: any) {
      alert("❌ " + (e.message || "Error"));
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id: string) {
    if (!confirm("¿Seguro que quieres revocar esta key?")) return;
    try {
      const r = await fetch("/api/admin/keys/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Error revocando key");
      await loadKeys();
      alert("✅ Key revocada");
    } catch (e: any) {
      alert("❌ " + (e.message || "Error"));
    }
  }

  return (
    <div className="space-y-6">
      {/* Crear */}
      <div className="border border-slate-800 bg-[#020617] rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Generar nueva key</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (opcional) ej: App móvil"
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          />

          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as PlanType)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="free">free</option>
            <option value="developer">developer</option>
            <option value="business">business</option>
          </select>

          <button
            onClick={createKey}
            disabled={creating}
            className="bg-emerald-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-400 disabled:opacity-60"
          >
            {creating ? "Creando..." : "Generar key"}
          </button>
        </div>
      </div>

      {/* Listado */}
      <div className="border border-slate-800 bg-[#020617] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Keys activas ({activeKeys.length})</h2>
          <button
            onClick={loadKeys}
            className="border border-slate-700 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
          >
            Refrescar
          </button>
        </div>

        {loading && <p className="text-slate-300 text-sm">Cargando...</p>}
        {err && <p className="text-red-400 text-sm">{err}</p>}

        <div className="space-y-3">
          {keys.map((k) => (
            <div
              key={k.id}
              className="border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm text-slate-300">
                  <span className="font-semibold text-white">{k.label}</span>{" "}
                  <span className="text-slate-400">({k.plan})</span>{" "}
                  {!k.active && <span className="text-red-400">• revocada</span>}
                </div>
                <div className="text-xs text-slate-400 mt-1 break-all">
                  {k.key}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copy(k.key)}
                  className="border border-slate-700 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
                >
                  Copiar
                </button>

                {k.active && (
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="border border-red-500/60 text-red-300 rounded-lg px-3 py-2 text-sm hover:bg-red-500/10"
                  >
                    Revocar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && keys.length === 0 && (
          <p className="text-slate-300 text-sm">No hay keys.</p>
        )}
      </div>
    </div>
  );
}
