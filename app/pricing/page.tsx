// app/pricing/page.tsx

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "Ideal para pruebas, demos y side projects.",
    highlight: false,
    cta: "Empezar gratis",
    features: [
      "Hasta 500 validaciones de CURP al mes",
      "Sin tarjeta de crédito",
      "Acceso al endpoint principal",
      "Acceso a /docs",
      "Sin SLA garantizado",
    ],
  },
  {
    name: "Developer",
    price: "$199 MXN",
    tagline: "Para desarrolladores y pequeños proyectos en producción.",
    highlight: true,
    cta: "Hablar con ventas",
    features: [
      "~50,000 validaciones de CURP al mes",
      "Prioridad media en la cola de procesamiento",
      "Acceso a logs y dashboard",
      "Soporte por correo",
      "Ideal para formularios de clientes y KYC básico",
    ],
  },
  {
    name: "Business",
    price: "$599 MXN",
    tagline: "Para equipos que necesitan volumen y estabilidad.",
    highlight: false,
    cta: "Hablar con ventas",
    features: [
      "Hasta 250,000 validaciones de CURP al mes",
      "Dashboard y métricas avanzadas",
      "Prioridad alta y mayor límite de rate limit",
      "Soporte prioritario",
      "Apto para bancos, fintechs y ERPs",
    ],
  },
  {
    name: "Enterprise",
    price: "A la medida",
    tagline: "Integraciones a la medida y alto volumen.",
    highlight: false,
    cta: "Agendar llamada",
    features: [
      "Millones de validaciones al mes",
      "Contrato y SLA personalizados",
      "Soporte dedicado",
      "Ambientes separados (staging / prod)",
      "Features a la medida",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white px-4 md:px-12 py-10">
      {/* Header */}
      <header className="max-w-3xl mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
          Pricing
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Planes simples para validar CURP en producción.
        </h1>
        <p className="text-gray-300">
          Empieza con el plan Free para probar la API y cuando estés listo
          pásate a un plan de pago. Los límites y precios son orientativos:
          podremos ajustarlos contigo según tu volumen y caso de uso.
        </p>
      </header>

      {/* Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col justify-between bg-[#020c1b] border rounded-2xl p-5 ${
              plan.highlight
                ? "border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
                : "border-[#1f2937]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.highlight && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/40">
                    Recomendado
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-300 mb-4">{plan.tagline}</p>

              <div className="mb-4">
                <p className="text-3xl font-bold">{plan.price}</p>
                {plan.name !== "Enterprise" && (
                  <p className="text-xs text-gray-400 mt-1">al mes</p>
                )}
              </div>

              <ul className="text-sm text-gray-300 space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-2 w-full text-sm font-medium py-2.5 rounded-xl border transition ${
                plan.highlight
                  ? "bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400"
                  : "bg-transparent border-[#1f2937] text-gray-100 hover:border-emerald-500 hover:text-emerald-400"
              }`}
              // TODO: aquí luego conectamos Stripe / formulario de contacto
              onClick={() => {
                alert(
                  "Esta es una demo. Más adelante aquí conectaremos Stripe o un formulario de contacto para este plan."
                );
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </section>

      {/* FAQ / nota final */}
      <section className="mt-12 max-w-3xl text-sm text-gray-300">
        <h3 className="text-lg font-semibold mb-2">¿Cómo funcionan los planes?</h3>
        <p className="mb-3">
          De momento estos planes son una referencia. La API ya está lista para
          producción y puedes comenzar a usarla hoy mismo. Más adelante
          integraremos sistema de usuarios, facturación y panel para que
          administres tus propias API keys y consumos.
        </p>
        <p className="mb-1">
          Si necesitas un volumen específico o tienes requisitos especiales
          (por ejemplo, banca, fintech, gobierno), lo ideal es un plan Business
          o Enterprise a la medida.
        </p>
      </section>
    </div>
  );
}
