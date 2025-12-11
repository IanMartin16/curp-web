This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Arquitectura de Curpify

```mermaid
flowchart TD

  %% Cliente
  subgraph Cliente[Cliente / Usuario Final]
    A0[Frontend Next.js · Vercel]
    A1[Página principal / Hero]
    A2[Sección Demo · /#demo]
    A3[Página de Pricing · /pricing]
    A4[Dashboard de uso · /dashboard]
  end

  %% API de CURP
  subgraph API[CURP API · Railway]
    B1[Express Server]
    B2[Ruta POST /api/curp/validate]
    B3[Middleware x-api-key]
    B4[Servicio de validación · curp-validator.ts]
    B5[Logs a archivo · /logs/api.log y requests-YYYY-MM-DD.json]
  end

  %% Stripe
  subgraph Stripe[Stripe]
    C1[Checkout Sessions]
    C2[Payment Method]
    C3[Customer / Subscription]
    C4[Webhook Events]
  end

  %% Frontend ↔ API CURP
  A2 -->|"POST /api/curp/validate (demo sin código)"| B2
  A3 -->|"Botón Pagar con Stripe"| C1
  A4 -->|"GET /api/admin/stats"| B1

  %% Flujo interno de validación
  B2 -->|"Verifica x-api-key"| B3
  B3 -->|"Valida formato, fecha, estado, ofensivas"| B4
  B4 -->|"Guarda log de request/response"| B5

  %% Stripe Webhooks → API
  C4 -->|"POST /api/stripe/webhook"| B1
  B1 -->|"Actualiza estado de suscripción / plan"| A4


1. Componentes principales

1.Frontend (Curpify Web – Vercel)

Página principal (/) con Hero, beneficios y CTA.
Página de precios (/pricing) con planes Free, Developer y Business.
Dashboard de uso (/dashboard) que muestra consultas totales, por día y por API key.
Sección demo (/#demo) para probar la API sin escribir código.
Página de documentación (/docs) con ejemplos en cURL y Node.

2. Stripe

Checkout Sessions: se usan para crear la sesión de pago desde /pricing.
Payment Method / Customer: Stripe guarda el método de pago y el cliente.
Subscription: define el plan activo (Free / Developer / Business).
Webhook Events: Stripe envía eventos a nuestro backend cuando cambia el estado de la suscripción.

3. CURP API (Railway)

Servidor Express en TypeScript.
API pública:
POST /api/curp/validate → endpoint principal de validación.
Middleware x-api-key que valida la API key del cliente.
Servicio curp-validator.ts que valida formato, fecha, género, estado y palabras ofensivas.
API interna / admin:
POST /api/stripe/webhook → recibe eventos de Stripe.
GET /api/admin/stats → devuelve métricas de uso para el dashboard.

4. Logs locales (por ahora)

Archivo logs/api.log → línea por request/respuesta.
Archivo logs/requests-YYYY-MM-DD.json → requests estructurados por día.
En el futuro esto se moverá a una base de datos (usuarios, api_keys, usage).

2. Flujo: suscripción y cobro

1. El usuario entra a /pricing en el frontend.

2. Hace clic en el botón “Pagar con Stripe” del plan elegido.

3. El frontend llama a una ruta interna (/api/stripe/checkout) que crea una Checkout Session en Stripe y obtiene la url de pago.

4. El usuario es redirigido a la página de Stripe, donde captura sus datos de pago.

5. Cuando el pago se completa, Stripe envía un evento de webhook a
POST /api/stripe/webhook en la CURP API.

6. Nuestro webhook procesa el evento y (en la versión futura con DB):

Actualiza la suscripción del usuario.
Guarda el plan activo (Free / Developer / Business).
Marca los límites de validaciones.

7. Stripe redirige al usuario de regreso al frontend (por ejemplo a /dashboard).

Hoy la suscripción todavía no está ligada a una base de datos real, pero el flujo Stripe → Webhook → API ya está preparado para eso.

3. Flujo: demo pública sin código

1. En la landing, el usuario baja a la sección “Probar la CURP API en vivo” (/#demo).

2. Escribe una CURP de ejemplo y hace clic en “Validar CURP”.

3. El frontend llama a la CURP API usando fetch contra:
POST https://curp-api-production.up.railway.app/api/curp/validate

4. En los headers va una x-api-key especial de demo (por ejemplo cliente_demo_001), que está configurada en el backend dentro de la lista de claves válidas.

5. El middleware de API key valida que esa key esté autorizada y deja pasar la petición.

6. El servicio curp-validator.ts hace toda la lógica de validación:

Estructura de la CURP.
Fecha de nacimiento.
Género.
Estado.
Dígito verificador (opcional según configuración).
Palabras ofensivas.

7. La respuesta JSON se muestra directamente en la tarjeta del demo, tal cual la devolvería la API en producción.

4. Flujo: métricas y dashboard

1. Cada vez que llega una petición a /api/curp/validate, el backend:

Valida la CURP.
Incrementa un contador interno de uso (en memoria / logs).
Escribe una entrada en los archivos de log (api.log + requests-YYYY-MM-DD.json).

2. Cuando abres /dashboard en el frontend:

El frontend llama a GET /api/admin/stats en la CURP API.
Esa ruta agrega las métricas por día y por API key a partir de la info disponible.
El frontend muestra:
Total de consultas.
Días con tráfico.
Consultas agrupadas por API key (no-key, supersecreto_123, cliente_demo_001, etc.).

3. Esto permite ver rápidamente:

Si la API tiene uso real.
Qué API keys están generando más tráfico.
Cómo se reparte el consumo a lo largo de los días.

🔐 5. Variables de entorno importantes (resumen)

Para tener referencia rápida en la docu, puedes pegar esta tabla/resumen:
CURP API (Railway)
PORT → puerto del servidor Express.
MASTER_API_KEY → key maestra interna de Curpify (todo acceso).
VALID_CLIENT_KEYS → lista de API keys de clientes (cliente_demo_001, etc.).
(Más adelante) variables de DB: conexión, usuario, etc.
Frontend (curp-web – Vercel)
NEXT_PUBLIC_CURP_API_BASE_URL → URL base de la API (Railway).
NEXT_PUBLIC_CURP_API_KEY → API key “principal” para pruebas internas.
NEXT_PUBLIC_CURP_DEMO_API_KEY → API key que usa el demo público.
Variables de Stripe:
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_DEV, STRIPE_PRICE_BUS
STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL