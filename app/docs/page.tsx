// app/docs/page.tsx

const sections = [
  { id: "intro", label: "Introducción" },
  { id: "auth", label: "Autenticación" },
  { id: "endpoint", label: "Endpoint principal" },
  { id: "examples", label: "Ejemplos de uso" },
  { id: "errors", label: "Códigos de error" },
  { id: "metrics", label: "Dashboard y métricas" },
];

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4 text-sm overflow-x-auto mt-3">
    <code>{children}</code>
  </pre>
);

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 border-r border-[#1f2937] bg-[#020817] px-4 py-6 sticky top-0 h-screen">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-1">CURP API</h1>
          <p className="text-xs text-gray-400">
            Documentación para desarrolladores
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

        <div className="mt-8 text-xs text-gray-400">
          <p className="mb-1 font-semibold text-gray-300">Base URL</p>
          <CodeBlock>https://curp-api-production.up.railway.app</CodeBlock>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 md:px-10 py-8 md:py-10">
        {/* Intro */}
        <section id="intro" className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
            Documentación
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Valida CURP en milisegundos desde cualquier sistema.
          </h2>
          <p className="text-gray-300 max-w-2xl">
            La CURP API te permite validar CURP en tiempo real, obtener datos
            derivados (fecha de nacimiento, sexo y estado) y usarla en
            procesos de onboarding, KYC, formularios de clientes o
            integraciones internas.
          </p>
        </section>

        {/* Auth */}
        <section id="auth" className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Autenticación</h3>
          <p className="text-gray-300 mb-3">
            El acceso a la API se realiza mediante el header{" "}
            <code className="bg-[#020c1b] px-1 rounded border border-[#1f2937]">
              x-api-key
            </code>
            . Actualmente puedes usar:
          </p>
          <ul className="list-disc list-inside text-gray-300 text-sm mb-3">
            <li>
              Una <strong>API key de prueba</strong> que compartas manualmente
              con tus clientes.
            </li>
            <li>
              Sin API key: se permite el uso pero se contabiliza como{" "}
              <code>no-key</code> en el dashboard.
            </li>
          </ul>

          <p className="text-gray-300 text-sm mb-2">
            Ejemplo de headers mínimos:
          </p>
          <CodeBlock>{`Content-Type: application/json
x-api-key: TU_API_KEY`}</CodeBlock>
        </section>

        {/* Endpoint principal */}
        <section id="endpoint" className="mb-10">
          <h3 className="text-xl font-semibold mb-3">Endpoint principal</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Método</p>
              <p className="text-sm font-mono bg-[#020c1b] border border-[#1f2937] inline-block px-2 py-1 rounded-lg">
                POST
              </p>

              <p className="text-sm text-gray-400 mt-4 mb-1">URL</p>
              <CodeBlock>
                https://curp-api-production.up.railway.app/api/curp/validate
              </CodeBlock>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Body (JSON)</p>
              <CodeBlock>{`{
  "curp": "HECM740516HDFRSR08"
}`}</CodeBlock>

              <p className="text-xs text-gray-400 mt-2">
                <strong>curp</strong> &mdash; CURP completa de 18 caracteres.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-1">
              Respuesta exitosa (CURP válida):
            </p>
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
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-1">
              Respuesta cuando la CURP es inválida:
            </p>
            <CodeBlock>{`{
  "ok": false,
  "isValid": false,
  "error": "CURP inválida en estructura"
}`}</CodeBlock>
          </div>
        </section>

        {/* Ejemplos */}
        <section id="examples" className="mb-10">
          <h3 className="text-xl font-semibold mb-3">Ejemplos de uso</h3>

          <div className="space-y-6">
            {/* cURL */}
            <div>
              <p className="text-sm font-semibold mb-1">cURL</p>
              <CodeBlock>{`curl -X POST "https://curp-api-production.up.railway.app/api/curp/validate" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: TU_API_KEY" \\
  -d '{ "curp": "HECM740516HDFRSR08" }'`}</CodeBlock>
            </div>

            {/* Node.js */}
            <div>
              <p className="text-sm font-semibold mb-1">Node.js (fetch)</p>
              <CodeBlock>{`async function validateCurp(curp) {
  const res = await fetch(
    "https://curp-api-production.up.railway.app/api/curp/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "TU_API_KEY",
      },
      body: JSON.stringify({ curp }),
    }
  );

  const data = await res.json();
  console.log(data);
}`}</CodeBlock>
            </div>

            {/* Python */}
            <div>
              <p className="text-sm font-semibold mb-1">Python (requests)</p>
              <CodeBlock>{`import requests

url = "https://curp-api-production.up.railway.app/api/curp/validate"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "TU_API_KEY"
}
payload = { "curp": "HECM740516HDFRSR08" }

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}</CodeBlock>
            </div>

            {/* PHP */}
            <div>
              <p className="text-sm font-semibold mb-1">PHP (cURL)</p>
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
            </div>
          </div>
        </section>

        {/* Errores */}
        <section id="errors" className="mb-10">
          <h3 className="text-xl font-semibold mb-3">Códigos de error</h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <p className="font-semibold mb-1">400 – Body inválido</p>
              <p className="text-xs mb-2">
                Cuando no se envía el campo <code>curp</code> o está vacío.
              </p>
              <CodeBlock>{`{
  "ok": false,
  "error": "CURP requerida en el body"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <p className="font-semibold mb-1">400 – Longitud incorrecta</p>
              <p className="text-xs mb-2">
                La CURP debe tener exactamente 18 caracteres.
              </p>
              <CodeBlock>{`{
  "ok": false,
  "error": "Longitud inválida, una CURP debe tener 18 caracteres"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <p className="font-semibold mb-1">403 – API key inválida</p>
              <p className="text-xs mb-2">
                La API key enviada no está autorizada para consumir el servicio.
              </p>
              <CodeBlock>{`{
  "ok": false,
  "error": "API key inválida o no autorizada"
}`}</CodeBlock>
            </div>

            <div className="bg-[#020c1b] border border-[#1f2937] rounded-xl p-4">
              <p className="font-semibold mb-1">500 – Error interno</p>
              <p className="text-xs mb-2">
                Error inesperado en el servidor. Reintentar o contactar al
                administrador.
              </p>
              <CodeBlock>{`{
  "ok": false,
  "error": "Error interno en el servidor"
}`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section id="metrics" className="mb-16">
          <h3 className="text-xl font-semibold mb-3">Dashboard y métricas</h3>
          <p className="text-gray-300 mb-3">
            La API cuenta con un endpoint privado para consultar el uso
            agregado por día y por API key. Este endpoint está protegido y solo
            acepta la <strong>master API key</strong>.
          </p>

          <p className="text-sm text-gray-400 mb-1">Endpoint (admin):</p>
          <CodeBlock>GET https://curp-web.vercel.app/api/admin/stats</CodeBlock>

          <p className="text-sm text-gray-400 mt-4 mb-1">Headers:</p>
          <CodeBlock>{`x-api-key: ADMIN_API_KEY`}</CodeBlock>

          <p className="text-sm text-gray-400 mt-4 mb-1">
            Ejemplo de respuesta:
          </p>
          <CodeBlock>{`{
  "ok": true,
  "total": 26,
  "byDay": {
    "2025-12-03": 1,
    "2025-12-04": 25
  },
  "byKey": {
    "no-key": 11,
    "supersecreto_123": 15
  }
}`}</CodeBlock>

          <p className="text-xs text-gray-400 mt-3">
            Estos datos son los que ves reflejados en tu dashboard interno en{" "}
            <code>/dashboard</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
