import Link from "next/link";

export const metadata = {
  title: "Términos | Curpify",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 hover:underline text-sm">
          ← Volver
        </Link>

        <h1 className="text-3xl font-bold">Términos de servicio</h1>

        <p className="text-slate-300 text-sm">
          Última actualización: 2026-01-16
        </p>

        <section className="space-y-3 text-slate-300">
          <h2 className="text-xl font-semibold">1. Servicio</h2>
          <p>
            Curpify provee una API para validar CURP localmente y extraer datos básicos.
            El servicio se ofrece “tal cual” y puede cambiar o mejorar con el tiempo.
          </p>

          <h2 className="text-xl font-semibold">2. Uso permitido</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar la API respetando los límites del plan.</li>
            <li>No abusar del servicio (bots, scraping masivo, intentos de evadir rate limits).</li>
            <li>No usar la API para actividades ilegales.</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Rate limits</h2>
          <p>
            Cada plan tiene límites. Si se exceden, la API responde con <b>429</b>.
            Los límites pueden ajustarse por seguridad y estabilidad del servicio.
          </p>

          <h2 className="text-xl font-semibold">4. Pagos y cancelación</h2>
          <p>
            Los planes de pago se cobran vía Stripe. Puedes cancelar en cualquier momento desde el Portal.
            La cancelación evita cobros futuros; el acceso permanece activo según la configuración del ciclo de facturación.
          </p>

          <h2 className="text-xl font-semibold">5. Responsabilidad</h2>
          <p>
            Curpify no garantiza disponibilidad continua sin interrupciones. Para planes Business se puede ofrecer soporte prioritario.
            El usuario es responsable de la implementación y el uso de la API en su sistema.
          </p>

          <h2 className="text-xl font-semibold">6. Contacto</h2>
          <p>
            Para soporte: <b>support@evilink.dev</b>.
          </p>
        </section>
      </div>
    </main>
  );
}

