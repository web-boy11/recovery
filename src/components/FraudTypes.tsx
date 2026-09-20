import { useLanguage } from "../context/LanguageContext";

export default function FraudTypes() {
  const { t } = useLanguage();

  const frauds = [
    {
      title: t.fraudTypes.types.crypto.title,
      icon: "₿",
      color: "bg-[#f7931a]/10 text-[#b86e0f]",
      desc: t.fraudTypes.types.crypto.desc,
      recovery: t.fraudTypes.types.crypto.vector,
    },
    {
      title: t.fraudTypes.types.invest.title,
      icon: "📈",
      color: "bg-emerald-50 text-emerald-800",
      desc: t.fraudTypes.types.invest.desc,
      recovery: t.fraudTypes.types.invest.vector,
    },
    {
      title: t.fraudTypes.types.wire.title,
      icon: "🏦",
      color: "bg-sky-50 text-sky-800",
      desc: t.fraudTypes.types.wire.desc,
      recovery: t.fraudTypes.types.wire.vector,
    },
    {
      title: t.fraudTypes.types.romance.title,
      icon: "💔",
      color: "bg-rose-50 text-rose-800",
      desc: t.fraudTypes.types.romance.desc,
      recovery: t.fraudTypes.types.romance.vector,
    },
    {
      title: "Identity Theft & Account Takeover (US & EU)",
      icon: "🪪",
      color: "bg-violet-50 text-violet-800",
      desc: "Synthetic identity fraud, SIM-swap attacks, unauthorized European banking access, credit card exploitation, and stolen credentials.",
      recovery: "Europol EFECC / FinCEN SAR coordination; international credit freezes and banking clawbacks.",
    },
    {
      title: "Tech Support & Impersonation Scams",
      icon: "💻",
      color: "bg-amber-50 text-amber-800",
      desc: "Fake Microsoft/Apple/Bank security cold calls, fraudulent remote access trojans (AnyDesk, TeamViewer), and coerced funds transfers.",
      recovery: "IP & ISP telecommunications subpoenas; cross-border boiler-room raids with Europol and local police.",
    },
    {
      title: "Real Estate & Escrow Wire Diversion",
      icon: "🏠",
      color: "bg-teal-50 text-teal-800",
      desc: "Interception of settlement instructions, fraudulent international notary accounts, escrow hijacking, and fake overseas property syndicates.",
      recovery: "SWIFT/SEPA emergency recall; international constructive trust orders.",
    },
    {
      title: "Online Commercial & Merchant Fraud",
      icon: "📦",
      color: "bg-indigo-50 text-indigo-800",
      desc: "Wholesale non-delivery, fraudulent payment gateways, shell import/export platforms, and multi-currency merchant drain schemes.",
      recovery: "Cross-border payment processor asset freezes; international receiver appointments.",
    },
  ];

  return (
    <section id="fraud-types" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            {t.fraudTypes.badge}
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            {t.fraudTypes.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700">
            {t.fraudTypes.subtitle} (Loss threshold: $5,000 / €4,500 / £4,000+). All matters below fall within the primary investigative jurisdiction of the Collins McDonald Transatlantic Unit.
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
