import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(11,31,58,0.88), rgba(11,31,58,0.92)), url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a]/95 via-[#0b1f3a]/85 to-[#8b1a2b]/30" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <div className="max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-[#c9a227]/60 bg-[#c9a227]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#f5d76e]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#c9a227]" />
            {t.hero.badge}
          </div>
          <h1 className="mb-6 font-serif text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t.hero.titleLine1} <br />
            <span className="text-[#c9a227]">{t.hero.titleGold}</span>
          </h1>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {t.hero.body}
          </p>

          <div className="mb-10 flex flex-wrap gap-4">
            <a
              href="#report"
              className="rounded-sm bg-[#b22234] px-7 py-3.5 text-base font-bold uppercase tracking-wider shadow-lg ring-1 ring-red-300/30 transition hover:bg-[#9a1c2c] hover:shadow-xl"
            >
              {t.hero.ctaReport}
            </a>
            <a
              href="#process"
              className="rounded-sm border-2 border-white/70 bg-white/10 px-7 py-3.5 text-base font-bold uppercase tracking-wider backdrop-blur hover:bg-white hover:text-[#0b1f3a]"
            >
              {t.hero.ctaProcess}
            </a>
          </div>

          <div className="grid max-w-3xl grid-cols-2 gap-6 border-t border-white/20 pt-8 md:grid-cols-4">
            {[
              { num: t.hero.stats.recovered, label: t.hero.stats.recoveredLabel },
              { num: t.hero.stats.victims, label: t.hero.stats.victimsLabel },
              { num: t.hero.stats.agents, label: t.hero.stats.agentsLabel },
              { num: t.hero.stats.hotline, label: t.hero.stats.hotlineLabel },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl font-bold text-[#c9a227] md:text-3xl">
                  {s.num}
                </div>
                <div className="text-xs uppercase tracking-wider text-white/75">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
