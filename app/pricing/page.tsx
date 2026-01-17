"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PlanId = "free" | "developer" | "business";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const router = useRouter();
  const [loadingFree, setLoadingFree] = useState(false);

  // ✅ FREE: crea key y manda a dashboard
  const handleFreeKey = async () => {
    try {
      setLoadingFree(true);

      // Este endpoint lo montamos en CURP-API:
      // POST https://curp-api.../api/keys/free
      // En curp-web lo ideal es tener un proxy /api/free-key.
      const r = await fetch("/api/free-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await r.json();

      if (!r.ok || !data?.ok || !data?.item?.key) {
        console.error(data);
        alert(data?.error || "No pude generar tu API key gratis. Intenta otra vez.");
        return;
      }

      localStorage.setItem("curpify_api_key", data.item.key);

      // opcional: también guarda masked para UI rápida
      if (data.item.key_masked) localStorage.setItem("curpify_api_key_masked", data.item.key_masked);

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Error generando tu API key gratis.");
    } finally {
      setLoadingFree(false);
    }
  };

  // ✅ STRIPE: solo developer/business
  const handleCheckout = async (plan: PlanId) => {
    if (plan === "free") return; // ya no usamos esto para free

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

      router.push(data.url);
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
          Empieza con Free para probar la API. Si ya vas en serio, sube a Developer o Business.
          Cancelas cuando quieras desde Stripe.
        </p>

      </section>

      {/* Grid de planes */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">

      {/* Free */}
      <div className="rounded-2xl border border-[#1f2937] bg-[#020c1b] p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1">Free</h2>
        <p className="text-gray-300 text-sm mb-4">
        Ideal para pruebas rápidas.
        </p>

        <p className="text-3xl font-bold mb-1">$0</p>
        <p className="text-gray-400 text-xs mb-6">al mes</p>

      <ul className="text-sm text-gray-200 space-y-2 mb-6">
        <li>• Hasta 50 validaciones al mes</li>
        <li>• Dashboard de uso (con API key)</li>
        <li>• Sin tarjeta de crédito</li>
        <li>• Acceso a /docs</li>
      </ul>

      {/* CTA principal: crear key gratis */}
        <button
          onClick={handleFreeKey}
          disabled={loadingFree}
          className="mt-auto w-full rounded-xl bg-emerald-500 text-black px-4 py-3 text-sm font-semibold hover:bg-emerald-400 transition disabled:opacity-60"
          >
          {loadingFree ? "Creando tu API key..." : "Crear API key gratis"}
        </button>

      {/* CTA secundario: demo */}
        <button
          onClick={() => router.push("/demo")}
          className="mt-3 w-full rounded-xl border border-slate-600 text-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-700/30 transition"
          >
          Try demo (sin API key)
        </button>
      </div>

        {/* Developer (recomendado) */}
        <div className="rounded-2xl border border-emerald-500 bg-[#020c1b] p-6 flex flex-col relative shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <span className="absolute -top-3 right-4 text-xs px-3 py-1 rounded-full bg-emerald-500 text-black font-semibold">
            Recomendado
          </span>

          <h2 className="text-lg font-semibold mb-1">Developer</h2>
          <p className="text-gray-300 text-sm mb-4">
            Para desarrolladores y proyectos chicos en producción.
          </p>

          <p className="text-3xl font-bold mb-1">$199 MXN</p>
          <p className="text-gray-400 text-xs mb-6">al mes</p>

          <ul className="text-sm text-gray-200 space-y-2 mb-6">
            <li>• Hasta <b>5,000</b> validaciones de CURP al mes</li>
            <li>• Dashboard de uso</li>
            <li>• Logs y métricas básicas</li>
            <li>• Soporte por correo</li>
            <li>• Ideal para formularios y KYC básico</li>
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
            <li>• Hasta <b>50,000</b> validaciones de CURP al mes</li>
            <li>• Prioridad alta</li>
            <li>• Dashboard + logs + métricas</li>
            <li>• Soporte prioritario</li>
            <li>• Integraciones / soporte técnico</li>
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

      {/* Link de docs abajo */}
      <section className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-400">
        ¿Dudas o necesitas un plan a la medida?{" "}
        <a href="/docs" className="text-emerald-400 underline">
          Revisa la documentación
        </a>{" "}
        o escríbenos a <span className="text-slate-200">support@evilink.dev</span>.
      </section>
    </main>
  );
}
