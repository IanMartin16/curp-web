"use client";

import { useEffect, useState } from "react";

type ServiceStatus = "operational" | "degraded" | "maintenance" | "down";

type StatusSummaryResponse = {
  overall_status: ServiceStatus;
  operational: number;
  degraded: number;
  maintenance: number;
  down: number;
  last_updated: string;
};

const STATUS_HUB_BASE_URL =
  process.env.NEXT_PUBLIC_STATUS_HUB_API_URL || "https://status-hub-api-production.up.railway.app";

function getStatusLabel(status: ServiceStatus): string {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "maintenance":
      return "Maintenance";
    case "down":
      return "Down";
    default:
      return status;
  }
}

function getStatusClasses(status: ServiceStatus): string {
  switch (status) {
    case "operational":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
    case "degraded":
      return "border-amber-500/25 bg-amber-500/10 text-amber-300";
    case "maintenance":
      return "border-sky-500/25 bg-sky-500/10 text-sky-300";
    case "down":
      return "border-rose-500/25 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export default function ServiceHealthCompact() {
  const [summary, setSummary] = useState<StatusSummaryResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`${STATUS_HUB_BASE_URL}/v1/status/summary`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = (await res.json()) as StatusSummaryResponse;
        if (mounted) setSummary(data);
      } catch {
        // silencio intencional en la versión compacta
      }
    }

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!summary) {
    return (
      <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 md:inline-flex">
        Status...
      </div>
    );
  }

  return (
    <div
      className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium md:inline-flex ${getStatusClasses(
        summary.overall_status
      )}`}
      title={`Operational: ${summary.operational} · Degraded: ${summary.degraded} · Maintenance: ${summary.maintenance} · Down: ${summary.down}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-90" />
      <span>{getStatusLabel(summary.overall_status)}</span>
    </div>
  );
}