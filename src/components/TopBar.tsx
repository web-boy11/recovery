import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

export default function TopBar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="bg-[#0b1f3a] text-xs text-white/90 border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 gap-4 flex-wrap">
        {/* Official Task Force Banner */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center -space-x-1 shrink-0">
            <span className="text-sm" title="United States">🇺🇸</span>
            <span className="text-sm" title="European Union">🇪🇺</span>
            <span className="text-sm" title="United Kingdom">🇬🇧</span>
          </div>
          <span className="font-medium tracking-wide text-white/90 text-[11px] sm:text-xs">
            {t.topbar.officialNotice}
          </span>
        </div>

        {/* Language Selector & Quick Links */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* European Languages Bar */}
          <div className="flex items-center bg-white/10 rounded-md p-0.5 gap-1 border border-white/15">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                  lang === l.code
                    ? "bg-[#c9a227] text-[#0b1f3a] font-bold shadow-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title={l.label}
              >
                <span>{l.flag}</span>
                <span className="hidden md:inline">{l.label}</span>
                <span className="inline md:hidden uppercase">{l.code}</span>
              </button>
            ))}
          </div>

          <a href="#resources" className="hidden hover:text-white sm:inline text-white/70 transition">
            {t.topbar.contact}
          </a>
          <a
            href="#report"
            className="hidden hover:text-white sm:inline bg-[#b22234] hover:bg-[#9a1c2c] text-white px-2.5 py-1 rounded text-[11px] font-bold transition uppercase tracking-wider"
          >
            {t.topbar.fileReport}
          </a>
        </div>
      </div>
    </div>
  );
}
