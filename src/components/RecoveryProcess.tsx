import { useLanguage } from "../context/LanguageContext";

export default function RecoveryProcess() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t.process.steps.step1.title,
      timeline: "Within 24 hours (US & Europe)",
      desc: t.process.steps.step1.desc,
      points: [
        "Victim submits confidential intake form. Preliminary assessment conducted within 24 business hours.",
        "Primary case officer and Europol / Interpol liaison assigned to your file.",
        "Issuance of permanent, cryptographically traceable Case Reference Number (FFRD-YYYY-XXXXXX).",
        "All data protected under Privacy Act of 1974 (US) and EU General Data Protection Regulation (GDPR).",
      ],
    },
    {
      num: "02",
      title: t.process.steps.step2.title,
      timeline: "Days 1–7",
      desc: t.process.steps.step2.desc,
      points: [
        "Cyber Forensics Team images transaction hashes (TXIDs), bank routing, SEPA wire logs, and server communication.",
        "Chainalysis and Elliptic blockchain intelligence deployed to trace cross-chain swaps and mixer obfuscation.",
        "International subpoenas drafted for custodial exchanges (Binance, Coinbase, Kraken, OKX, Bybit) and tier-1 banks.",
      ],
    },
    {
      num: "03",
      title: t.process.steps.step3.title,
      timeline: "Days 7–21",
      desc: t.process.steps.step3.desc,
      points: [
        "Emergency asset freeze injunctions filed with US Federal Courts and European national judicial authorities.",
        "SWIFT recall protocols, SEPA emergency hold orders, and exchange freezing orders served simultaneously.",
        "International Letters Rogatory and Mutual Legal Assistance Treaties (MLAT) dispatched to offshore havens.",
      ],
    },
    {
      num: "04",
      title: t.process.steps.step4.title,
      timeline: "Weeks 3–12",
      desc: t.process.steps.step4.desc,
      points: [
        "Attribution specialists deconstruct money-mule networks and shell entity structures across borders.",
        "Judicial forfeiture complaints filed in federal court and European member state jurisdictions (Regulation 2018/1805).",
        "Parallel criminal proceedings opened targeting the organized syndicates and boiler-room operators.",
      ],
    },
    {
      num: "05",
      title: t.process.steps.step5.title,
      timeline: "Weeks 8–16",
      desc: t.process.steps.step5.desc,
      points: [
        "Seized funds placed into official governmental escrow accounts pending judicial restitution orders.",
        "Judicial restitution decree issued naming registered claimants as legally certified restitution beneficiaries.",
      ],
    },
    {
      num: "06",
      title: t.process.steps.step6.title,
      timeline: "Months 4–18",
      desc: t.process.steps.step6.desc,
      points: [
        "Restitution capital transferred directly to victim's verified domestic (US/UK) or European (SEPA/IBAN) bank account.",
        "Official case closure letter provided with full judicial accounting and certificate of resolution.",
        "No recovery fees, clearance charges, or taxes are ever deducted from recovered sums.",
      ],
    },
  ];

  return (
    <section id="process" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            {t.process.badge}
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            {t.process.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700">
            {t.process.subtitle} Operational framework aligned with US Department of Justice standards and European Union cross-border asset recovery regulations.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-[#0b1f3a]/20 lg:block" />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`grid gap-6 lg:grid-cols-2 lg:gap-12 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={`${i % 2 === 0 ? "lg:text-right" : ""}`}>
                  <div className="inline-flex w-full items-center gap-4 rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-[#0b1f3a] font-serif text-2xl font-bold text-[#c9a227] lg:order-none">
                      {s.num}
                    </div>
                    <div className={`${i % 2 === 0 ? "lg:text-right" : ""} flex-1`}>
                      <h3 className="font-serif text-xl font-bold text-[#0b1f3a]">
                        {s.title}
                      </h3>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#b22234]">
                        Timeline: {s.timeline}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-sm border-l-4 border-[#c9a227] bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800 mb-3">{s.desc}</p>
                  <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
                    {s.points.map((p, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#b22234]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-sm border-l-4 border-[#0b1f3a] bg-[#0b1f3a]/5 p-6">
          <p className="text-sm leading-relaxed text-slate-700">
            <strong className="text-[#0b1f3a]">Transatlantic Jurisdictional Notice:</strong> The Mc Collins Unit operates in direct coordination with Europol EC3, Interpol, and European national authorities. Cases reported within{" "}
            <strong className="text-[#b22234]">72 hours</strong> of the fraudulent wire or cryptocurrency transfer yield the highest probability of urgent asset freeze before cashout.
          </p>
        </div>
      </div>
    </section>
  );
}
