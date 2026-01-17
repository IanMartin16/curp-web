import Link from "next/link";

export const metadata = {
  title: "Soporte | Curpify",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 hover:underline text-sm">
          ← Volver
        </Link>

        <h1 className="text-3xl font-bold">Soporte</h1>

        <p className="text-slate-300">
          Si necesitas ayuda con integración, límites de plan o algún incidente,
          escríbenos y te respondemos lo antes posible.
        </p>

        <div className="rounded-xl border border-[#1f2937] bg-[#020c1b] p-5">
          <p className="text-slate-300 text-sm mb-1">Correo de soporte</p>
          <p className="font-mono text-emerald-400 text-sm">support@evilink.dev</p>
          <p className="text-slate-400 text-xs mt-3">
            Horario: Lunes a Viernes (MX). Para temas urgentes de Business, indica “URGENTE” en el asunto.
          </p>
        </div>

        <div className="text-slate-400 text-sm">
          También puedes revisar la <Link href="/docs" className="text-emerald-400 underline">documentación</Link>.
        </div>
      </div>
    </main>
  );
}
