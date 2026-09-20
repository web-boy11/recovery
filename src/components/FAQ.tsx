import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();

  const faqs = [
    {
      q: "Does the Task Force or FBI charge fees for fund recovery services?",
      a: "No. Federal and European law enforcement agencies never charge victims for investigation, asset tracing, or the return of recovered funds outside the official platform. Anyone purporting to be an investigator or government representative who demands upfront fees, taxes, 'clearance charges,' cryptocurrency payments, or gift cards is perpetrating a secondary scam. Disengage immediately and report them.",
    },
    {
      q: "How long does the international recovery process take?",
      a: "Timelines vary significantly by case. Cases reported within 72 hours with well-documented transaction records and identifiable receiving institutions often yield emergency asset freezes within 1–3 weeks. Full cross-border recovery and disbursement typically take between 4 and 18 months due to legal proceedings, MLAT requirements, and international civil forfeiture procedures.",
    },
    {
      q: t.faq.q3,
      a: t.faq.a3,
    },
    {
      q: "What percentage of stolen funds are typically recovered?",
      a: "Aggregate recovery rates vary. For wire transfers and SEPA payments reported within the first 72 hours, our transatlantic units historically freeze and return approximately 77% of funds. For cryptocurrency cases, the rate is approximately 42% (rising to 63% when the receiving entity is a regulated US or European exchange).",
    },
    {
      q: "Will my case and personal data be kept confidential?",
      a: "Yes. All victim information is strictly protected under the Privacy Act of 1974 (5 U.S.C. § 552a), the Victims' Rights and Restitution Act, the EU General Data Protection Regulation (GDPR), and international CJIS security policies. Your identity is kept strictly confidential.",
    },
    {
      q: "Can I hire a private recovery company to help?",
      a: "We strongly caution against private 'asset recovery' companies — many are secondary fraudulent operations that target prior scam victims with promises of guaranteed recovery in exchange for upfront retainer fees. Legitimate law enforcement never requires fee payments.",
    },
    {
      q: "Will I have to travel or testify in court in the United States?",
      a: "Generally no. For European and international claimants, sworn affidavits, certified identity verification, and notarized statements submitted through our legal liaison channels are sufficient for asset forfeiture and restitution orders. You do not need to travel to the United States.",
    },
    {
      q: "What immediate steps should I take if I just realized I was defrauded?",
      a: "(1) Cease all communication with the scammers immediately. (2) Do NOT delete messages, emails, transaction receipts, or phone numbers. (3) Contact your bank or crypto exchange immediately to request an urgent recall/freeze. (4) Submit an intake form on this portal. Do not send any additional money under any circumstances.",
    },
  ];

  return (
    <section id="faq" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            {t.faq.badge}
          </div>
          <h2 className="font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            {t.faq.title}
          </h2>
        </div>

        <div className="mx-auto max-w-4xl divide-y divide-slate-200 rounded-sm border border-slate-200 bg-white shadow-sm">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
              >
                <span className="font-serif text-base font-semibold text-[#0b1f3a]">
                  {f.q}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-white transition ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-sm leading-relaxed text-slate-700">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
