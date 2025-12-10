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
