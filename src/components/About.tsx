import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
              {t.about.badge}
            </div>
            <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
              {t.about.title}
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>
                <strong>{t.about.missionBold}</strong> {t.about.p3}{" "}
                <span className="text-[#b22234] font-semibold">{t.about.freeNotice}</span>
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border-l-4 border-[#c9a227] bg-slate-50 p-4">
                <div className="font-serif text-lg font-bold text-[#0b1f3a]">
                  {t.about.leaderName}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {t.about.leaderTitle}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {t.about.leaderBio}
                </p>
              </div>
              <div className="border-l-4 border-[#0b1f3a] bg-slate-50 p-4">
                <div className="font-serif text-lg font-bold text-[#0b1f3a]">
                  {t.about.legalTitle}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {t.about.legalSub}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {t.about.legalBio}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-sm border border-slate-200 bg-gradient-to-br from-[#0b1f3a] to-[#14325a] p-6 text-white shadow-lg">
              <h3 className="mb-4 font-serif text-xl font-bold text-[#c9a227]">
                {t.about.credTitle}
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  "FBI — Special Agent credential #J.4267-MC",
                  "U.S. Department of Justice — Sworn Federal Officer",
                  "Europol EC3 Joint Task Force Liaison Accreditation",
                  "Interpol Financial Crime Centre (IFCACC) Accredited",
                  "FinCEN Certified Financial Crimes Investigator (CFCI)",
                  "Certified Cryptocurrency Investigator (CCI) — Chainalysis / CipherTrace",
                  "UK National Crime Agency (NCA) Transatlantic Partner",
                  "Budapest Convention & MLAT Treaty Enforcement Authority",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-white/20 pt-4 text-xs text-white/70">
                Credentials independently verifiable through the FBI Office of Public Affairs and Europol Liaison Headquarters.
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-6">
              <h4 className="mb-3 font-serif text-lg font-bold text-[#0b1f3a]">
                {t.about.verifyTitle}
              </h4>
              <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
                <li>{t.about.verifyStep1}</li>
                <li>{t.about.verifyStep2}</li>
                <li>{t.about.verifyStep3}</li>
              </ol>
              <p className="mt-3 text-xs text-slate-500">
                {t.about.verifyWarning}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
