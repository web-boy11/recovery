import { useState } from "react";
import Seal from "./Seal";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About the Division", href: "#about" },
  { label: "Recovery Process", href: "#process" },
  { label: "Fraud Types", href: "#fraud-types" },
  { label: "File a Report", href: "#report", highlight: true },
  { label: "Resources", href: "#resources" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
          <a href="#home" className="flex shrink-0 items-center gap-4">
            <Seal size={72} />
            <div className="hidden leading-tight sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c9a227]">
                U.S. Department of Justice
              </div>
              <div className="text-xl font-bold tracking-wide">
                Federal Bureau of Investigation
              </div>
              <div className="text-sm font-medium text-white/80">
                Cybercrime &amp; Financial Fraud Recovery — Mc Collins Unit
              </div>
            </div>
            <div className="leading-tight sm:hidden">
              <div className="text-xs font-bold">FBI</div>
              <div className="text-[10px] text-white/80">Fraud Recovery</div>
            </div>
          </a>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cases, resources, FAQs..."
                className="w-72 rounded-sm border border-white/30 bg-white/10 px-3 py-1.5 text-sm placeholder:text-white/60 focus:border-[#c9a227] focus:bg-white/20 focus:outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-[#c9a227] px-2 py-0.5 text-[11px] font-semibold text-[#0b1f3a] hover:bg-[#b8911f]">
                Search
              </button>
            </div>
            <a
              href="#report"
              className="rounded-sm bg-[#b22234] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow hover:bg-[#9a1c2c]"
            >
              Report Fraud Now
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
        <nav className="border-t border-slate-200 bg-white lg:hidden">
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
