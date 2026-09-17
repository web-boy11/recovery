import { useState } from "react";

const faqs = [
  {
    q: "Does the FBI charge fees for fund recovery services?",
    a: "No. The FBI and other federal law enforcement agencies never charge victims for investigation, asset tracing, or the return of recovered funds. Anyone purporting to be an FBI agent or government representative who demands upfront fees, taxes, 'clearance charges,' cryptocurrency payments, or gift cards is perpetrating a secondary scam. Disengage immediately and call our hotline.",
  },
  {
    q: "How long does the recovery process take?",
    a: "Timelines vary significantly by case. Cases reported within 72 hours with well-documented transaction records and identifiable receiving institutions often yield emergency asset freezes within 1–3 weeks. Full recovery and disbursement can take between 4 and 18 months due to legal proceedings, MLAT requirements, and civil forfeiture procedures. You will receive written status updates every 30 days.",
  },
  {
    q: "Do I qualify for assistance if I'm not a U.S. citizen?",
    a: "The Mc Collins Unit's primary mandate is assisting private U.S. citizens (citizens, legal permanent residents, and U.S.-incorporated small businesses). Non-U.S. persons victimized by perpetrators operating from or targeting the United States may be referred to our International Affairs Division for coordination with their home-country authorities.",
  },
  {
    q: "What percentage of stolen funds are typically recovered?",
    a: "Aggregate recovery rates vary. For wire transfers reported within the first 72 hours, we historically freeze and return approximately 77% of funds. For cryptocurrency cases, the rate is approximately 42% (rising to 63% when the receiving entity is a regulated exchange). For cases reported beyond 30 days, recovery rates decline to roughly 11%.",
  },
  {
    q: "Will my case be kept confidential?",
    a: "Yes. All victim information is protected under the Privacy Act of 1974 (5 U.S.C. § 552a), the Victims' Rights and Restitution Act (42 U.S.C. § 10607), and FBI CJIS security policy. Your identity is not disclosed to subjects of investigation except where required by court order, and victim impact statements may be submitted under seal.",
  },
  {
    q: "Can I hire a private recovery company to help?",
    a: "We strongly caution against 'recovery room' services — many are themselves secondary scam operations that contact prior fraud victims offering to recover their funds for an upfront fee. Legitimate legal representation is permitted, but federal agents will always speak directly with victims to verify claims. You do not need to pay any third party to qualify for FBI assistance.",
  },
  {
    q: "Will I have to testify in court?",
    a: "Not necessarily. In civil asset forfeiture proceedings, a sworn declaration is often sufficient. If parallel criminal prosecution proceeds and your testimony is required, our Victim Witness Assistance Program (VWAP) will coordinate with you, provide protection if appropriate, and guide you through the federal court process.",
  },
  {
    q: "What should I do right now if I just realized I've been scammed?",
    a: "(1) Cease all contact with the scammers immediately. (2) Do NOT delete messages, emails, apps, or transaction history. (3) Call your bank or exchange immediately to initiate a recall/chargeback. (4) Submit an intake form on this site or call 1-800-324-4372. Do not transfer additional funds even if promised a 'refund.'",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            Frequently Asked Questions
          </div>
          <h2 className="font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            Victim Information &amp; Clarifications
          </h2>
        </div>

        <div className="mx-auto max-w-4xl divide-y divide-slate-200 rounded-sm border border-slate-200 bg-white">
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
