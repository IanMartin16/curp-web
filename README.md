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

<-- aquí va el diagrama -->

flowchart TD

subgraph Cliente [Cliente / Usuario Final]
    A0[Frontend Next.js - Vercel]
    A1[Página de Pricing]
    A2[Checkout Button]
    A3[Dashboard de Uso]
end

subgraph Stripe [Stripe]
    B1[Checkout Sessions]
    B2[Payment Method]
    B3[Customer Object]
    B4[Subscription Object]
    B5[Webhook Events]
end

subgraph Backend [Backend Next.js API Routes]
    C1[/api/checkout]
    C2[/api/billing-portal]
    C3[/api/stripe/webhook]
    C4[/api/admin/stats]
end

subgraph API_CURP [API de Validación - Railway]
    D1[/api/validate]
    D2[Logs de uso (memoria/KV)]
    D3[Rate Limits por API Key]
end

%% Flujo de compra
A2 --> |POST| C1 --> |create session| B1 --> |redirect URL| A2
B1 --> B2 --> B3 --> B4
B5 --> |payment.succeeded| C3
B5 --> |customer.subscription.updated| C3
C3 --> C4

%% Flujo de validación de CURP
A0 --> |fetch| D1 --> D2 --> C4 --> A3
