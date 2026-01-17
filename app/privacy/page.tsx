import Link from "next/link";

export const metadata = {
  title: "Privacidad | Curpify",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 hover:underline text-sm">
          ← Volver
        </Link>

        <h1 className="text-3xl font-bold">Aviso de privacidad</h1>

        <p className="text-slate-300 text-sm">
          Última actualización: 2026-01-16
        </p>

        <section className="space-y-4 text-slate-300">
          <h2 className="text-xl font-semibold">1. Datos que procesamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><b>API Key</b> (para autenticación y límites).</li>
            <li><b>Metadatos técnicos</b> (IP, endpoint, status code, duración) para seguridad y métricas.</li>
            <li><b>CURP</b> enviada al endpoint: puede registrarse en logs según tu configuración.</li>
          </ul>

          <h2 className="text-xl font-semibold">2. Finalidad</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Operar la API (validación y respuesta).</li>
            <li>Aplicar rate limits por plan y prevenir abuso.</li>
            <li>Mostrar métricas en dashboard (uso por mes/día y últimas validaciones).</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Retención</h2>
          <p>
            Los logs pueden conservarse por un periodo razonable para auditoría, soporte y seguridad.
            Si necesitas eliminación por cumplimiento interno, contáctanos.
          </p>

          <h2 className="text-xl font-semibold">4. Terceros</h2>
          <p>
            Los pagos se procesan con Stripe. Curpify no almacena información de tarjetas.
          </p>

          <h2 className="text-xl font-semibold">5. Contacto</h2>
          <p>
            Para preguntas de privacidad: <b>support@curpify.com</b>.
          </p>
        </section>
      </div>
    </main>
  );
}
