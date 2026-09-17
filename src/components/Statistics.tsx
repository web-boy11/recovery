const stats = [
  { value: "$418M", label: "Assets recovered for U.S. victims, FY 2024", sub: "Audited by DOJ OIG" },
  { value: "77%", label: "Recovery rate when reported within 72 hours", sub: "vs. 11% after 30 days" },
  { value: "3,247", label: "Victims assisted across all 50 states", sub: "since Unit stand-up (2019)" },
  { value: "$2.1B", label: "Global fraud proceeds frozen or seized", sub: "in cooperative MLAT actions" },
];

export default function Statistics() {
  return (
    <section className="bg-[#0b1f3a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#c9a227]">
            Performance Metrics
          </div>
          <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
            Measurable Results for American Victims
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l-4 border-[#c9a227] pl-5">
              <div className="font-serif text-4xl font-bold text-[#c9a227] md:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium text-white/90">{s.label}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
