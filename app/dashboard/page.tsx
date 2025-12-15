// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0  
import { ApiKeysPanel } from "./ApiKeysPanel";


type StatsResponse = {
  ok: boolean;
  total: number;
  byDay: Record<string, number>;
  byKey: Record<string, number>;
  demoUsedToday?: number;
  demoUniqueToday?: number;
};

async function getStats(): Promise<StatsResponse | null> {
  // En prod usamos el dominio fijo de Vercel
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://curpify.com"
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error al obtener stats:", res.status);
      return null;
    }

    const data = (await res.json()) as StatsResponse;
    return data;
  } catch (e) {
    console.error("Error getStats:", e);
    return null;
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  if (!stats || !stats.ok) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-sm text-gray-300">
            No se pudieron obtener las estadísticas. Verifica que el backend
            esté arriba y que el endpoint <code>/api/admin/stats</code> funcione.
          </p>
        </div>
        <ApiKeysPanel />
      </div>
    );
  }

  const safe = stats ?? { total: 0, byDay: {}, byKey: {} };

  const total = safe.total ?? 0;
  const byDay = safe.byDay ?? {};
  const byKey = safe.byKey ?? {};
  const demoUsedToday = safe.demoUsedToday ?? 0;
  const demoUniqueToday = safe.demoUniqueToday ?? 0;


  const days = Object.entries(byDay).sort(([a], [b]) => (a < b ? 1 : -1));
  const keys = Object.entries(byKey);


  return (
    <div className="min-h-screen bg-[#020817] text-white px-4 py-8 md:px-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard de uso</h1>
        <p className="text-gray-300">
          Estadísticas de consumo de tu API de CURP en tiempo real.
        </p>
      </header>

      {/* Cards resumen */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Consultas totales</p>
          <p className="text-3xl font-semibold">{total}</p>
        </div>

        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Días con tráfico</p>
          <p className="text-3xl font-semibold">{days.length}</p>
        </div>

        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">API Keys activas</p>
          <p className="text-3xl font-semibold">{keys.length}</p>
        </div>

        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Demos hoy</p>
          <p className="text-3xl font-semibold">{demoUsedToday}</p>
          <p className="text-xs text-gray-500 mt-1">Validaciones sin API key</p>
        </div>

        <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Usuarios demo hoy</p>
          <p className="text-3xl font-semibold">{demoUniqueToday}</p>
          <p className="text-xs text-gray-500 mt-1">IPs únicas (anon)</p>
        </div>
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabla por día */}
        <section className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Consultas por día</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-2 border-b border-[#1f2937]">
                    Fecha
                  </th>
                  <th className="text-right py-2 border-b border-[#1f2937]">
                    Consultas
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map(([day, count]) => (
                  <tr key={day}>
                    <td className="py-2">{day}</td>
                    <td className="py-2 text-right">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabla por API key */}
        <section className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Consultas por API key</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-2 border-b border-[#1f2937]">
                    API Key
                  </th>
                  <th className="text-right py-2 border-b border-[#1f2937]">
                    Consultas
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.map(([key, count]) => (
                  <tr key={key}>
                    <td className="py-2">{key}</td>
                    <td className="py-2 text-right">{count as number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
