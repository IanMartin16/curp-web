// app/components/SiteFooter.tsx

import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-[#020817] py-8 text-sm text-slate-400">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          Curpify © {year}. Powered by evi_link devs.
          Contact: support@evilink.dev
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
          <Link href="/docs" className="hover:text-slate-200">
            Docs
          </Link>
          <Link href="/pricing" className="hover:text-slate-200">
            Pricing
          </Link>
          <Link href="/#demo" className="hover:text-slate-200">
            Demo
          </Link>
          <Link href="/dashboard" className="hover:text-slate-200">
            Dashboard
          </Link>
          {/* Ajusta la URL de GitHub cuando publiques el repo */}
          <a
            href="https://github.com/tu-usuario/curpify"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200"
          >
            GitHub
          </a>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hover:text-slate-200 cursor-default">
            Términos
          </span>
          <span className="hover:text-slate-200 cursor-default">
            Privacidad
          </span>
        </nav>
      </div>
    </footer>
  );
}

