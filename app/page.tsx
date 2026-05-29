import Link from "next/link";
import { DemoSection } from "./components/DemoSection";
import ServiceHealthCompact from "./components/ServiceHealthCompact";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-12">
          <div className="leading-tight">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/curpify-logo-full.png"
              alt="Curpify"
              className="h-15 w-auto"
            />
          </a>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Identity Validation
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-sm">
          <a href="/docs" className="text-gray-300 transition hover:text-white">
            Docs
          </a>
          <a href="/pricing" className="text-gray-300 transition hover:text-white">
            Pricing
          </a>
          <a href="/dashboard" className="text-gray-300 transition hover:text-white">
            Dashboard
          </a>

          <ServiceHealthCompact />

          <a
            href="/docs"
            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black transition hover:bg-emerald-400"
          >
            Probar API
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden text-center max-w-5xl mx-auto mt-20 px-4">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Curpify v1.5 · CURP & RFC Validation
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight">
          Validación de identidad para flujos de RH, onboarding y sistemas internos.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Valida CURP y RFC desde una API simple o desde un dashboard listo para
          equipos no técnicos. Rápido, medible y preparado para producción.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#demo"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/10"
          >
            Probar demo sin API key
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-slate-600 text-slate-100 hover:bg-slate-800"
          >
             Ir al dashboard
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-slate-700 text-slate-300 hover:border-emerald-500/60 hover:text-emerald-300"
          >
            Ver docs
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-[#020c1b]/80 p-4">
            <p className="text-emerald-300 font-semibold">CURP + RFC</p>
            <p className="mt-1 text-slate-400">
              Normalización, estructura y dígito verificador.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#020c1b]/80 p-4">
            <p className="text-emerald-300 font-semibold">Dashboard no técnico</p>
            <p className="mt-1 text-slate-400">
              Valida identidad sin usar Postman ni código.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#020c1b]/80 p-4">
            <p className="text-emerald-300 font-semibold">API developer-first</p>
            <p className="mt-1 text-slate-400">
              Consumo medido por API key y métricas en tiempo real.
            </p>
          </div>
        </div>

        {/* BADGES DE CONFIANZA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm text-slate-300">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Tiempo promedio de respuesta &lt; 80ms</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span>Dashboard + API Key usage</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span>Diseñado para producción</span>
          </div>
        </div>
      </section>

      {/* DEMO WIDGET */}
        <section id="demo" className="mt-20">
          <div className="max-w-3xl mx-auto px-6 text-center mb-6">
            <span className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
              Demo público
            </span>

            <h2 className="mt-4 text-3xl font-bold">
              Prueba Curpify sin configuración.
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Este demo no usa API key y tiene límite por IP. Para consumir tu plan,
              utiliza el Dashboard o integra la API protegida con <span className="font-mono">x-api-key</span>.
            </p>
          </div>

          <DemoSection />
        </section>

      {/* SECTION tipo Stripe */}
      <section className="mt-32 max-w-6xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Una consola simple para validar identidad mexicana.
        </h2>

        <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
          Curpify combina API, dashboard y métricas para validar CURP y RFC en flujos
          de RH, onboarding, formularios y sistemas internos.
        </p>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Validación CURP/RFC</h3>
            <p className="text-gray-300 text-sm">
              Normalización, estructura, fecha y dígito verificador en una respuesta clara.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Dashboard para equipos</h3>
            <p className="text-gray-300 text-sm">
              Valida identidad desde la consola sin depender de integraciones técnicas.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">API para developers</h3>
            <p className="text-gray-300 text-sm">
              Integra Curpify con HTTP estándar, API keys y consumo medido por plan.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Métricas en tiempo real</h3>
            <p className="text-gray-300 text-sm">
              Consulta uso diario, validaciones recientes y consumo mensual.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Control por API key</h3>
            <p className="text-gray-300 text-sm">
              Cada validación queda asociada a una key activa y a su plan correspondiente.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Listo para soft launch</h3>
            <p className="text-gray-300 text-sm">
              Pensado para pruebas reales, feedback temprano y adopción gradual.
            </p>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-300 mb-6">
            Curpify es gratis en el plan básico. Empieza a validar CURP hoy
            mismo.
          </p>

          <a
            href="/pricing"
            className="px-8 py-3 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition"
          >
            Comenzar gratis
          </a>
        </div>
      </section>

      {/* EJEMPLOS DE INTEGRACIÓN */}
      <section className="mt-24 max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Ejemplos de uso en producción
        </h2>
        <p className="text-gray-300 mb-8 text-center max-w-2xl mx-auto">
          Integra Curpify en minutos usando HTTP estándar. El endpoint clasico de CURP sigue disponible 
          para mantener compatibilidad con integraciones existentes.
          <span className="font-semibold">cURL</span> y{" "}
          <span className="font-semibold">JavaScript (fetch)</span>.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-sm font-mono">
          {/* cURL */}
          <div className="rounded-xl border border-slate-800 bg-[#020617] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                cURL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Terminal
              </span>
            </div>
            <pre className="text-xs whitespace-pre-wrap text-slate-100">
              {`curl -X POST https://curp-api-production.up.railway.app/api/curp/validate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: TU_API_KEY_AQUI" \\
  -d '{ "curp": "BUMA920505MDFJLK09" }'`}
            </pre>
          </div>

          {/* JS FETCH */}
          <div className="rounded-xl border border-slate-800 bg-[#020617] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                JavaScript (fetch)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Frontend / Node
              </span>
            </div>
            <pre className="text-xs whitespace-pre-wrap text-slate-100">
              {`async function validarCurp(curp) {
  const res = await fetch(
    "https://curp-api-production.up.railway.app/api/curp/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "TU_API_KEY_AQUI",
      },
      body: JSON.stringify({ curp }),
    }
  );

  const data = await res.json();
  console.log(data);
}`}
            </pre>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Tip: para validacion CURP/RFC desde interfaz visual, usa el Dashboard. Para integraciones existentes
          el endpoint clasico de CURP continúa disponible.
        </p>
      </section>
    </div>
  );
}
