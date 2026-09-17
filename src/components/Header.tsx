import { useState } from "react";
import Seal from "./Seal";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { label: t.header.nav.home, href: "#home" },
    { label: t.header.nav.about, href: "#about" },
    { label: t.header.nav.process, href: "#process" },
    { label: t.header.nav.fraudTypes, href: "#fraud-types" },
    { label: t.header.nav.report, href: "#report", highlight: true },
    { label: t.header.nav.resources, href: "#resources" },
    { label: t.header.nav.faq, href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
          <a href="#home" className="flex shrink-0 items-center gap-4">
            <Seal size={72} />
            <div className="hidden leading-tight sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c9a227] flex items-center gap-1.5">
                <span>{t.header.department}</span>
                <span className="text-white/60">·</span>
                <span className="text-[10px] text-white/70 bg-white/10 px-1.5 py-0.2 rounded">EU / US Mandate</span>
              </div>
              <div className="text-xl font-bold tracking-wide">
                {t.header.agency}
              </div>
              <div className="text-sm font-medium text-white/80">
                {t.header.unit}
              </div>
            </div>
            <div className="leading-tight sm:hidden">
              <div className="text-xs font-bold">FBI &bull; Europol EC3</div>
              <div className="text-[10px] text-white/80">Transatlantic Recovery</div>
            </div>
          </a>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <div className="relative">
              <input
                type="text"
                placeholder={t.header.searchPlaceholder}
                className="w-72 rounded-sm border border-white/30 bg-white/10 px-3 py-1.5 text-sm placeholder:text-white/60 focus:border-[#c9a227] focus:bg-white/20 focus:outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-[#c9a227] px-2 py-0.5 text-[11px] font-semibold text-[#0b1f3a] hover:bg-[#b8911f]">
                {t.header.searchBtn}
              </button>
            </div>
            <a
              href="#report"
              className="rounded-sm bg-[#b22234] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow hover:bg-[#9a1c2c]"
            >
              {t.header.reportBtn}
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="ml-auto rounded border border-white/40 p-2 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center px-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`border-b-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                item.highlight
                  ? "border-[#b22234] text-[#b22234] hover:bg-red-50"
                  : "border-transparent text-[#0b1f3a] hover:border-[#0b1f3a] hover:bg-slate-50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Nav */}
      {open && (
        <nav className="border-t border-slate-200 bg-white lg:hidden p-2">
          {/* Mobile Language Selector */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Language / Sprache / Langue / Idioma
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    lang === l.code
                      ? "bg-[#0b1f3a] text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-slate-100 px-4 py-3 text-sm font-semibold ${
                  item.highlight ? "bg-red-50 text-[#b22234]" : "text-[#0b1f3a]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
