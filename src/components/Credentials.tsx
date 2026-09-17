export default function Credentials() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            In Partnership With
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight text-[#0b1f3a] md:text-3xl">
            Interagency &amp; International Partners
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            "FBI Cyber Division",
            "U.S. Secret Service",
            "FinCEN",
            "DOJ Asset Forfeiture",
            "SEC Enforcement",
            "CFTC",
            "Interpol",
            "Europol EC3",
            "IRS-CI",
            "HSI (Homeland Security)",
            "U.S. Postal Inspection",
            "Chainalysis / TRM Labs",
          ].map((p) => (
            <div
              key={p}
              className="flex h-20 items-center justify-center rounded-sm border border-slate-200 bg-white text-center text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
