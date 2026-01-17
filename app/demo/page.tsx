"use client";

import {DemoSection} from "../components/DemoSection";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-16">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Demo</h1>
        <p className="text-gray-300 text-sm md:text-base mb-8">
          Prueba Curpify sin API key (modo demo). Ideal para enseñar el producto.
        </p>

        <DemoSection />
      </section>
    </main>
  );
}
