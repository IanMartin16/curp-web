"use client";

import { useEffect } from "react";

const sections = [
  { id: "intro", label: "Introducción" },
  { id: "auth", label: "Autenticación" },
  { id: "validate", label: "Validar CURP" },
  { id: "examples", label: "Ejemplos" },
  { id: "errors", label: "Códigos de error" },
  { id: "limits", label: "Límites y uso" },
  { id: "metrics", label: "Dashboard y métricas" },
  { id: "best", label: "Buenas prácticas" },
  { id: "changelog", label: "Changelog" },
];

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4 text-sm overflow-x-auto mt-3 whitespace-pre-wrap">
    <code>{children}</code>
  </pre>
);

export default function DocsPage() {
  useEffect(() => {
    const handler = () => {};
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* SIDEBAR */}
      <aside className="hidden md:block w-64 border-r border-[#1f2937] bg-[#020817] px-4 py-6 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Curpify Docs</h1>
          <p className="text-xs text-gray-400 mt-1">
            Documentación oficial para desarrolladores
          </p>
        </div>

        <nav className="space-y-2 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-[#020c1b] hover:text-white transition"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-1">Base URL</p>
          <CodeBlock>https://curp-api-production.up.railway.app</CodeBlock>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 px-4 md:px-10 py-10 space-y-20">

        {/* INTRO */}
        <section id="intro">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
            Documentación
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Valida CURP en milisegundos con Curpify.
          </h2>
          <p className="text-gray-300 max-w-2xl">
            Curpify es una API moderna, veloz y confiable para validar CURP
            desde cualquier plataforma. La API proporciona validación de estructura,
            fecha de nacimiento, género, estado y dígito verificador.
          </p>
        </section>

        {/* AUTH */}
        <section id="auth">
          <h3 className="text-2xl font-bold mb-3">Autenticación</h3>
          <p className="text-gray-300 mb-3">
            Todas las solicitudes requieren incluir una API Key en el header:
          </p>

          <CodeBlock>{`x-api-key: TU_API_KEY`}</CodeBlock>

          <p className="text-gray-300 mt-4 text-sm">
            Se permite usar la API sin key, pero se registra como <code>no-key</code> en
            el dashboard. Para producción, usa una API Key válida.
          </p>
        </section>

        {/* VALIDATE */}
        <section id="validate">
          <h3 className="text-2xl font-bold mb-3">Validar CURP</h3>
          <p className="text-gray-300 mb-4">
            Este es el endpoint principal para validar CURP en Curpify.
          </p>

          <h4 className="text-lg font-semibold mb-1">Endpoint</h4>
          <CodeBlock>POST https://curp-api-production.up.railway.app/api/curp/validate</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">Body (JSON)</h4>
          <CodeBlock>{`{
  "curp": "HECM740516HDFRSR08"
}`}</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">Respuesta exitosa</h4>
          <CodeBlock>{`{
  "ok": true,
  "curp": "HECM740516HDFRSR08",
  "isValid": true,
  "data": {
    "year": 1974,
    "month": 5,
    "day": 16,
    "gender": "H",
    "state": "DF"
  }
}`}</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">Respuesta inválida</h4>
          <CodeBlock>{`{
  "ok": false,
  "isValid": false,
  "error": "CURP inválida en estructura"
}`}</CodeBlock>
        </section>

        {/* EXAMPLES */}
        <section id="examples">
          <h3 className="text-2xl font-bold mb-3">Ejemplos de uso</h3>

          <h4 className="text-lg font-semibold mb-1">cURL</h4>
          <CodeBlock>{`curl -X POST "https://curp-api-production.up.railway.app/api/curp/validate" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: TU_API_KEY" \\
  -d '{ "curp": "HECM740516HDFRSR08" }'`}</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">Node.js</h4>
          <CodeBlock>{`const res = await fetch("https://curp-api-production.up.railway.app/api/curp/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "TU_API_KEY"
  },
  body: JSON.stringify({ curp: "HECM740516HDFRSR08" })
});

const data = await res.json();
console.log(data);`}</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">Python</h4>
          <CodeBlock>{`import requests

url = "https://curp-api-production.up.railway.app/api/curp/validate"
payload = { "curp": "HECM740516HDFRSR08" }

r = requests.post(url, json=payload)
print(r.json())`}</CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-1">PHP</h4>
          <CodeBlock>{`<?php
$payload = json_encode(["curp" => "HECM740516HDFRSR08"]);

$ch = curl_init("https://curp-api-production.up.railway.app/api/curp/validate");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-api-key: TU_API_KEY"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}</CodeBlock>
        </section>

        {/* ERRORS */}
        <section id="errors">
          <h3 className="text-2xl font-bold mb-3">Códigos de error</h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <h4 className="font-semibold mb-1">400 – Body inválido</h4>
              <CodeBlock>{`{
  "ok": false,
  "error": "CURP requerida en el body"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <h4 className="font-semibold mb-1">400 – Longitud incorrecta</h4>
              <CodeBlock>{`{
  "ok": false,
  "error": "Longitud inválida, una CURP debe tener 18 caracteres"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <h4 className="font-semibold mb-1">403 – API key inválida</h4>
              <CodeBlock>{`{
  "ok": false,
  "error": "API key inválida o no autorizada"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <h4 className="font-semibold mb-1">500 – Error interno</h4>
              <CodeBlock>{`{
  "ok": false,
  "error": "Error interno en el servidor"
}`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* LIMITS */}
        <section id="limits">
          <h3 className="text-2xl font-bold mb-3">Límites y uso</h3>
          <p className="text-gray-300 mb-3">
            Curpify ofrece diferentes límites de acuerdo con el plan contratado:
          </p>

          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✔ Plan Free — 500 validaciones al mes</li>
            <li>✔ Developer — 50,000 validaciones al mes</li>
            <li>✔ Business — 250,000 validaciones o más</li>
            <li>✔ Enterprise — volumen a la medida</li>
          </ul>
        </section>

        {/* METRICS */}
        <section id="metrics">
          <h3 className="text-2xl font-bold mb-3">Dashboard y métricas</h3>
          <p className="text-gray-300 mb-4">
            Curpify incluye un dashboard con estadísticas en tiempo real:
          </p>

          <CodeBlock>{`GET https://curp-web.vercel.app/api/admin/stats`}</CodeBlock>

          <p className="text-gray-300 mt-4 text-sm">Ejemplo de respuesta:</p>
          <CodeBlock>{`{
  "ok": true,
  "total": 26,
  "byDay": {
    "2025-12-04": 25
  },
  "byKey": {
    "super_key": 15
  }
}`}</CodeBlock>
        </section>

        {/* BEST PRACTICES */}
        <section id="best">
          <h3 className="text-2xl font-bold mb-3">Buenas prácticas</h3>

          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✔ Validar CURP antes de enviarla (18 caracteres)</li>
            <li>✔ Usar always backend para llamadas sensibles</li>
            <li>✔ Regenerar API keys cada cierto tiempo</li>
            <li>✔ Cachear resultados repetidos</li>
            <li>✔ Usar /dashboard para monitoreo</li>
          </ul>
        </section>

        {/* CHANGELOG */}
        <section id="changelog" className="pb-20">
          <h3 className="text-2xl font-bold mb-3">Changelog</h3>

          <p className="text-gray-300 text-sm mb-2">v1.0.0 — Lanzamiento inicial</p>
          <p className="text-gray-300 text-sm mb-2">v1.1.0 — Dashboard agregado</p>
          <p className="text-gray-300 text-sm mb-2">v1.2.0 — Mejoras en validación</p>
          <p className="text-gray-300 text-sm">v2.0.0 — (Futuro) Validación RFC</p>
        </section>

      </main>
    </div>
  );
}
