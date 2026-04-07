"use client";

import { useEffect, useMemo, useState } from "react";

type ServiceStatus = "operational" | "degraded" | "maintenance" | "down";

type StatusSummaryResponse = {
  overall_status: ServiceStatus;
  operational: number;
  degraded: number;
  maintenance: number;
  down: number;
  last_updated: string;
};

type ServiceStatusItem = {
  name: string;
  display_name: string;
  status: ServiceStatus;
  latency_ms: number | null;
  last_checked: string;
  message: string | null;
};

type StatusResponse = {
  overall_status: ServiceStatus;
  last_updated: string;
  services: ServiceStatusItem[];
};

type WidgetData = {
  summary: StatusSummaryResponse | null;
  status: StatusResponse | null;
};

const POLL_INTERVAL_MS = 60_000;

// Ajusta esta base URL según tu entorno.
// En local puede ser "http://127.0.0.1:8080"
// En prod puedes apuntar al dominio desplegado.
const STATUS_HUB_BASE_URL =
  process.env.NEXT_PUBLIC_STATUS_HUB_API_URL || "http://127.0.0.1:8080";

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

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
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "degraded":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "maintenance":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "down":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export default function ServiceHealthWidget() {
  const [data, setData] = useState<WidgetData>({ summary: null, status: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoints = useMemo(
    () => ({
      summary: `${STATUS_HUB_BASE_URL}/v1/status/summary`,
      status: `${STATUS_HUB_BASE_URL}/v1/status`,
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [summaryRes, statusRes] = await Promise.all([
          fetch(endpoints.summary, { cache: "no-store" }),
          fetch(endpoints.status, { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !statusRes.ok) {
          throw new Error("Failed to fetch service health.");
        }

        const [summary, status] = await Promise.all([
          summaryRes.json() as Promise<StatusSummaryResponse>,
          statusRes.json() as Promise<StatusResponse>,
        ]);

        if (!mounted) return;

        setData({ summary, status });
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [endpoints]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div className="text-sm text-white/70">Loading service health...</div>
      </section>
    );
  }

  if (error || !data.summary || !data.status) {
    return (
      <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 backdrop-blur-sm">
        <div className="text-sm text-rose-300">
          Unable to load service health.
        </div>
        {error ? <div className="mt-2 text-xs text-rose-200/80">{error}</div> : null}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/45">
            Service Health
          </div>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Evilink Services
          </h3>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm ${getStatusClasses(
            data.summary.overall_status
          )}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-90" />
          <span>{getStatusLabel(data.summary.overall_status)}</span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Operational" value={data.summary.operational} />
        <MetricCard label="Degraded" value={data.summary.degraded} />
        <MetricCard label="Maintenance" value={data.summary.maintenance} />
        <MetricCard label="Down" value={data.summary.down} />
      </div>

      <div className="space-y-3">
        {data.status.services.map((service) => (
          <div
            key={service.name}
            className="rounded-xl border border-white/8 bg-black/20 p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">
                  {service.display_name}
                </div>
                <div className="mt-1 text-xs text-white/45">{service.name}</div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                  service.status
                )}`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                <span>{getStatusLabel(service.status)}</span>
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-white/70 md:grid-cols-3">
              <div>
                <span className="text-white/45">Latency:</span>{" "}
                {service.latency_ms !== null ? `${service.latency_ms} ms` : "—"}
              </div>
              <div>
                <span className="text-white/45">Last check:</span>{" "}
                {formatDate(service.last_checked)}
              </div>
              <div>
                <span className="text-white/45">Message:</span>{" "}
                {service.message || "No details"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-white/40">
        Last updated: {formatDate(data.summary.last_updated)}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}