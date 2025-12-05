"use client";

import { useState } from "react";
import Link from "next/link";

type PlanId = "free" | "developer" | "business";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const handleCheckout = async (plan: PlanId) => {
    // Free no va a Stripe
    if (plan === "free") {
      window.location.href = "/docs";
      return;
    }

    try {
      setLoadingPlan(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!data.ok || !data.url) {
        console.error(data);
        alert("No se pudo iniciar el pago. Intenta más tarde.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error iniciando el pago.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-16">
      <section className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Planes simples para validar CURP en producción.
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Empieza con el plan Free para probar la API y cuando estés listo
          pásate a un plan de pago. Los límites y precios son orientativos:
          podremos ajustarlos contigo según tu volumen y caso de uso.
        </p>
      </section>

      {/* Grid de planes */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
        {/* Free */}
        <div className="rounded-2xl border border-[#1f2937] bg-[#020c1b] p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-1">Free</h2>
          <p className="text-gray-300 text-sm mb-4">
            Ideal para pruebas, demos y side projects.
          </p>

          <p className="text-3xl font-bold mb-1">$0</p>
          <p className="text-gray-400 text-xs mb-6">al mes</p>

          <ul className="text-sm text-gray-200 space-y-2 mb-6">
            <li>• Hasta 500 validaciones de CURP al mes</li>
            <li>• Sin tarjeta de crédito</li>
            <li>• Acceso al endpoint principal</li>
            <li>• Acceso a /docs</li>
            <li>• Sin SLA garantizado</li>
          </ul>

          <button
            onClick={() => handleCheckout("free")}
            className="mt-auto w-full rounded-xl border border-emerald-500 text-emerald-400 px-4 py-3 text-sm font-semibold hover:bg-emerald-500/10 transition"
          >
            Empezar gratis
          </button>
        </div>

        {/* Developer (recomendado) */}
        <div className="rounded-2xl border border-emerald-500 bg-[#020c1b] p-6 flex flex-col relative shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <span className="absolute -top-3 right-4 text-xs px-3 py-1 rounded-full bg-emerald-500 text-black font-semibold">
            Recomendado
          </span>

          <h2 className="text-lg font-semibold mb-1">Developer</h2>
          <p className="text-gray-300 text-sm mb-4">
            Para desarrolladores y pequeños proyectos en producción.
          </p>

          <p className="text-3xl font-bold mb-1">$199 MXN</p>
          <p className="text-gray-400 text-xs mb-6">al mes</p>

          <ul className="text-sm text-gray-200 space-y-2 mb-6">
            <li>• ~50,000 validaciones de CURP al mes</li>
            <li>• Prioridad media en la cola de procesamiento</li>
            <li>• Acceso a logs y dashboard</li>
            <li>• Soporte por correo</li>
            <li>• Ideal para formularios de clientes y KYC básico</li>
          </ul>

          <button
            onClick={() => handleCheckout("developer")}
            className="mt-auto w-full rounded-xl bg-emerald-500 text-black px-4 py-3 text-sm font-semibold hover:bg-emerald-400 transition disabled:opacity-60"
            disabled={loadingPlan === "developer"}
          >
            {loadingPlan === "developer" ? "Redirigiendo..." : "Elegir plan Developer"}
          </button>
        </div>

        {/* Business */}
        <div className="rounded-2xl border border-[#1f2937] bg-[#020c1b] p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-1">Business</h2>
          <p className="text-gray-300 text-sm mb-4">
            Para equipos que necesitan volumen y estabilidad.
          </p>

          <p className="text-3xl font-bold mb-1">$599 MXN</p>
          <p className="text-gray-400 text-xs mb-6">al mes</p>

          <ul className="text-sm text-gray-200 space-y-2 mb-6">
            <li>• Hasta 500,000 validaciones de CURP al mes</li>
            <li>• Prioridad alta en procesamiento</li>
            <li>• SLA y soporte prioritario</li>
            <li>• Acceso completo a logs, métricas y dashboard</li>
            <li>• Integraciones y soporte técnico personalizado</li>
          </ul>

          <button
            onClick={() => handleCheckout("business")}
            className="mt-auto w-full rounded-xl border border-emerald-500 text-emerald-400 px-4 py-3 text-sm font-semibold hover:bg-emerald-500/10 transition disabled:opacity-60"
            disabled={loadingPlan === "business"}
          >
            {loadingPlan === "business" ? "Redirigiendo..." : "Elegir plan Business"}
          </button>
        </div>
      </section>

      {/* Link de docs abajo, por si acaso */}
      <section className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-400">
        ¿Tienes dudas sobre los límites o necesitas un plan a la medida?{" "}
        <Link href="/docs" className="text-emerald-400 underline">
          Revisa la documentación o contáctanos
        </Link>
        .
      </section>
    </main>
  );
}
