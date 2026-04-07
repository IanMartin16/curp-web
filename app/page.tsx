import Link from "next/link";
import { DemoSection } from "./components/DemoSection";
import ServiceHealthCompact from "./components/ServiceHealthCompact";

const API_BASE_URL = process.env.NEXT_PUBLIC_CURP_API_BASE_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_CURP_API_KEY || "";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-12">
        <a href="/" className="text-2xl font-bold tracking-tight text-white">
          Curpify
        </a>

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
      <section className="text-center max-w-3xl mx-auto mt-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Valida CURP en milisegundos.
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          Una API moderna, rápida y confiable para validar CURP desde cualquier
          sistema. Perfecta para onboarding, formularios de clientes,
          automatizaciones internas y KYC.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#demo"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
          >
            Probar API sin código
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold border border-slate-600 text-slate-100 hover:bg-slate-800"
          >
            Ver planes y precios
          </Link>
        </div>

        <ul className="text-gray-300 text-sm space-y-2 mb-10 mt-8">
          <li>✔ Respuestas inmediatas (avg &lt; 80 ms)</li>
          <li>✔ Validación de estructura, fecha de nacimiento, género y estado</li>
          <li>✔ Dashboard y métricas en tiempo real</li>
          <li>✔ API Keys ilimitadas</li>
          <li>✔ Documentación clara y estilo developer-first</li>
        </ul>

        <div className="flex justify-center gap-4">
          <a
            href="/docs"
            className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition"
          >
            Probar la API
          </a>

          <a
            href="/docs"
            className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:border-emerald-500 hover:text-emerald-400 transition"
          >
            Ver documentación
          </a>
        </div>

        {/* BADGES DE CONFIANZA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm text-slate-300">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Tiempo promedio de respuesta &lt; 80ms</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span>+{90} validaciones registradas en pruebas</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span>Diseñado para producción y KYC</span>
          </div>
        </div>
      </section>

      {/* DEMO WIDGET */}
      <DemoSection />

      {/* SECTION tipo Stripe */}
      <section className="mt-32 max-w-6xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          La forma más rápida y confiable de validar CURP en México.
        </h2>

        <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
          Curpify ofrece una API ultra veloz, documentación clara y métricas en
          tiempo real. Perfecta para onboarding, formularios, procesos de
          identidad y plataformas que requieren validación inmediata.
        </p>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Validación instantánea
            </h3>
            <p className="text-gray-300 text-sm">
              Promedio menor a 80ms. Perfecto para formularios y procesos
              críticos.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Integración en minutos
            </h3>
            <p className="text-gray-300 text-sm">
              Ejemplos claros en cURL, Node, Python y PHP. Implementa rápido.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Validación completa
            </h3>
            <p className="text-gray-300 text-sm">
              Estructura, fecha, género, estado y dígito verificador.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Dashboard en tiempo real
            </h3>
            <p className="text-gray-300 text-sm">
              Métricas por día, por API key y consumo total.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">
              Diseñado para producción
            </h3>
            <p className="text-gray-300 text-sm">
              Logs internos, monitoreo y límites configurados.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Escalable</h3>
            <p className="text-gray-300 text-sm">
              Desde 500 hasta miles de validaciones mensuales.
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

      {/* BENEFICIOS */}
      <section className="mt-24 max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          ¿Por qué elegir Curpify?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-gray-300 text-sm">
          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Ultra rápido
            </h3>
            <p>
              Validación optimizada con tiempos promedio menores a 80ms, ideal
              para formularios en tiempo real.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Fácil de integrar
            </h3>
            <p>
              API REST simple, ejemplos en múltiples lenguajes y documentación
              estilo Stripe.
            </p>
          </div>

          <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Listo para producción
            </h3>
            <p>
              Dashboard de uso, métricas en tiempo real y soporte para API Keys
              ilimitadas.
            </p>
          </div>
        </div>
      </section> {/* 👈 cierre que faltaba */}

      {/* EJEMPLOS DE INTEGRACIÓN */}
      <section className="mt-24 max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Ejemplos de uso en producción
        </h2>
        <p className="text-gray-300 mb-8 text-center max-w-2xl mx-auto">
          Integra Curpify en minutos usando HTTP estándar. Aquí tienes ejemplos
          en <span className="font-semibold">cURL</span> y{" "}
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
          Tip: en producción usa tu propia API key desde el dashboard de
          Curpify. En el plan Free tienes hasta 500 validaciones mensuales.
        </p>
      </section>

      {/* HISTORIA */}
      <section className="mt-24 max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-4">Nuestra historia</h2>

        <p className="text-gray-300 mb-4">
          Curpify nace como respuesta a una necesidad real: validar CURP de
          forma rápida, clara y accesible. Miles de sistemas en México requieren
          validación de identidad, pero se enfrentan a procesos lentos, manuales
          o poco confiables.
        </p>

        <p className="text-gray-300 mb-4">
          Nosotros creemos que la validación de identidad debe ser tan simple
          como hacer un request a una API. Así comenzó Curpify: una plataforma
          pensada para desarrolladores, optimizada para la velocidad y lista
          para producción.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3">Misión</h3>
        <p className="text-gray-300 mb-4">
          Hacer que la validación de identidad en México sea rápida, accesible y
          sencilla para todos los desarrolladores.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3">Visión</h3>
        <p className="text-gray-300 mb-4">
          Construir la plataforma número uno de validación de identidad en
          México y Latinoamérica, empezando por CURP y expandiéndonos hacia RFC,
          NSS, INE digital y validaciones avanzadas.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3">Valores</h3>
        <ul className="text-gray-300 space-y-2">
          <li>✔ Simplicidad</li>
          <li>✔ Velocidad</li>
          <li>✔ Confiabilidad</li>
          <li>✔ Transparencia</li>
          <li>✔ Developer-first</li>
        </ul>
      </section>
    </div>
  );
}


