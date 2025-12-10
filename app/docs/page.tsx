// app/docs/page.tsx
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-100">
      {/* NAVBAR simple */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#1f2937]">
        <a href="/" className="text-xl font-bold">
          Curpify
        </a>

        <div className="flex items-center gap-6 text-sm">
          <a href="/docs" className="text-emerald-400 font-semibold">
            Docs
          </a>
          <a href="/pricing" className="text-gray-300 hover:text-white">
            Pricing
          </a>
          <a href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 md:px-0 py-10 space-y-10">
        {/* Título */}
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            Documentación
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            API de validación de CURP
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Curpify es una API REST para validar CURP mexicanas: formato, fecha
            de nacimiento, género, estado y dígito verificador. Pensada para
            onboarding de clientes, formularios y sistemas de identidad.
          </p>
        </header>

        {/* Autenticación */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Autenticación</h2>
          <p className="text-slate-300 text-sm">
            La API usa una <span className="font-mono">API key</span> en el
            header <span className="font-mono">x-api-key</span>. Cada cliente
            tendrá su propia key, que podrás gestionar desde tu panel de
            administración (próximo release).
          </p>

          <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-xs md:text-sm font-mono overflow-x-auto">
            <p>// Ejemplo de header</p>
            <p>GET /api/curp/validate HTTP/1.1</p>
            <p>Host: tu-dominio.com</p>
            <p>x-api-key: TU_API_KEY_AQUI</p>
            <p>Content-Type: application/json</p>
          </div>

          <p className="text-xs text-slate-400">
            Para el demo público del sitio usamos una API key especial interna
            de Curpify. En producción debes usar tu propia key.
          </p>
        </section>

        {/* Endpoint principal */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Endpoint principal</h2>

          <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-xs md:text-sm font-mono overflow-x-auto space-y-2">
            <p>// POST /api/curp/validate</p>
            <p>{"{"}</p>
            <p>  "curp": "HECM740516HDFRSR08"</p>
            <p>{"}"}</p>
          </div>

          <p className="text-slate-300 text-sm">
            El cuerpo debe enviarse en JSON con el campo{" "}
            <span className="font-mono">curp</span>. La API responde con un
            objeto que indica si la CURP es válida y los datos derivados.
          </p>

          <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-xs md:text-sm font-mono overflow-x-auto">
            <p>// Respuesta de ejemplo</p>
            <p>{"{"}</p>
            <p>  "ok": true,</p>
            <p>  "curp": "HECM740516HDFRSR08",</p>
            <p>  "isValid": true,</p>
            <p>  "data": {"{"}</p>
            <p>    "year": 1974,</p>
            <p>    "month": 5,</p>
            <p>    "day": 16,</p>
            <p>    "gender": "H",</p>
            <p>    "state": "DF"</p>
            <p>  {"}"}</p>
            <p>{"}"}</p>
          </div>
        </section>

        {/* Ejemplos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Ejemplos de uso</h2>

          {/* cURL */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">cURL</h3>
            <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-xs md:text-sm font-mono overflow-x-auto">
              <p>curl -X POST \</p>
              <p>  "https://curp-api-production.up.railway.app/api/curp/validate" \</p>
              <p>  -H "Content-Type: application/json" \</p>
              <p>  -H "x-api-key: TU_API_KEY_AQUI" \</p>
              <p>  -d '{"{"}"curp":"HECM740516HDFRSR08"{"}"}'</p>
            </div>
          </div>

          {/* Node.js */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">Node.js (fetch)</h3>
            <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-xs md:text-sm font-mono overflow-x-auto">
              <p>{"async function validateCurp() {"}</p>
              <p>  const res = await fetch(</p>
              <p>    "https://curp-api-production.up.railway.app/api/curp/validate",</p>
              <p>    {"{"}</p>
              <p>      method: "POST",</p>
              <p>      headers: {"{"}</p>
              <p>        "Content-Type": "application/json",</p>
              <p>        "x-api-key": "TU_API_KEY_AQUI",</p>
              <p>      {"}"},</p>
              <p>      body: JSON.stringify({"{"} curp: "HECM740516HDFRSR08" {"}"}),</p>
              <p>    {"}"}</p>
              <p>  );</p>
              <p>  const data = await res.json();</p>
              <p>  console.log(data);</p>
              <p>{"}"}</p>
            </div>
          </div>
        </section>

        {/* Link a Demo */}
        <section className="border-t border-slate-800 pt-6 flex justify-between items-center text-sm text-slate-300">
          <span>¿Prefieres verlo en la web primero?</span>
          <Link
            href="/#demo"
            className="px-4 py-2 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400"
          >
            Probar demo sin código
          </Link>
        </section>
      </main>
    </div>
  );
}
