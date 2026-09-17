const frauds = [
  {
    title: "Cryptocurrency & Digital Asset Fraud",
    icon: "₿",
    color: "bg-[#f7931a]/10 text-[#b86e0f]",
    desc: "Fake exchanges, pig-butchering scams (Shāzhūpán), DeFi/rug pull schemes, romance scams inducing crypto transfers, fake airdrops, phishing for seed phrases, and ransomware-related extortion.",
    recovery: "Chainalysis/MLAT tracing; exchange cooperation; mixer de-obfuscation.",
  },
  {
    title: "Investment & Securities Fraud",
    icon: "📈",
    color: "bg-emerald-50 text-emerald-800",
    desc: "Boiler-room operations, Ponzi/pyramid schemes, unregistered securities offerings, binary options fraud, 'guaranteed return' forex/crypto trading scams, and microcap pump-and-dump schemes.",
    recovery: "SEC/CFTC coordination; receiver appointment; DTC/transfer agent freeze.",
  },
  {
    title: "Wire Transfer & ACH Fraud",
    icon: "🏦",
    color: "bg-sky-50 text-sky-800",
    desc: "Business Email Compromise (BEC), CEO/imposter fraud, unauthorized ACH debits, real estate closing fund diversion, payroll diversion, and fraudulent international wire transfers.",
    recovery: "SWIFT recall requests; correspondent bank subpoenas; UCC Article 4A actions.",
  },
  {
    title: "Romance & Confidence Scams",
    icon: "💔",
    color: "bg-rose-50 text-rose-800",
    desc: "Catfishing on dating platforms leading to wire/crypto transfers, 'soldier in need' impersonation, and emergency impersonation scams perpetrated via social engineering over extended periods.",
    recovery: "Mule account mapping; IP attribution; synchronous coordination with HSI.",
  },
  {
    title: "Identity Theft & Account Takeover",
    icon: "🪪",
    color: "bg-violet-50 text-violet-800",
    desc: "Stimulus/SSA impersonation, synthetic identity fraud, bank account takeover via SIM-swap, credit card fraud, and fraudulent loan origination using stolen PII.",
    recovery: "FTC/FinCEN SAR review; credit bureau holds; clawback via Reg E / Reg Z.",
  },
  {
    title: "Tech Support & Impersonation Scams",
    icon: "💻",
    color: "bg-amber-50 text-amber-800",
    desc: "Fake Microsoft/Apple/Amazon support cold calls, IRS/SSA impersonation, refund scams requiring purchase of gift cards, and remote-access trojan (RAT) exfiltration of banking credentials.",
    recovery: "Gift card subpoenas (Apple, Google, Amazon, Target); RAT forensics; ISP records.",
  },
  {
    title: "Real Estate & Escrow Fraud",
    icon: "🏠",
    color: "bg-teal-50 text-teal-800",
    desc: "Interception of closing disclosures, fake title companies, notary impersonation, quitclaim deed forgery, and rental/foreclosure relief scams.",
    recovery: "Title insurance claim coordination; county recorder liens; constructive trust action.",
  },
  {
    title: "Online Purchase & Auction Fraud",
    icon: "📦",
    color: "bg-indigo-50 text-indigo-800",
    desc: "Non-delivery of goods, counterfeit goods, fake online storefronts, overpayment/refund scams, and marketplace impersonation on social commerce platforms.",
    recovery: "Payment processor chargebacks; merchant account freezes; platform cooperation.",
  },
];

export default function FraudTypes() {
  return (
    <section id="fraud-types" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            Scope of Jurisdiction
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            Fraud Categories We Investigate
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The Mc Collins Unit accepts cases involving U.S. citizen victims
            with provable losses exceeding $5,000 (cases under this threshold
            are routed to our partners at the FBI IC3 and FTC). All matters
            below fall within our primary investigative jurisdiction.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {frauds.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col rounded-sm border border-slate-200 bg-white p-5 transition hover:border-[#c9a227] hover:shadow-md"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-sm text-2xl ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="mb-2 font-serif text-base font-bold leading-snug text-[#0b1f3a]">
                {f.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                {f.desc}
              </p>
              <div className="mt-auto border-t border-slate-100 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Recovery Vector
                </div>
                <div className="mt-1 text-xs font-medium text-slate-700">
                  {f.recovery}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
