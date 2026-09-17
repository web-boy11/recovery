const steps = [
  {
    num: "01",
    title: "Confidential Intake & Triage",
    timeline: "Within 24 hours of report submission",
    points: [
      "Victim submits a Confidential Victim Intake Form (CVIF) via this portal or calls the 24/7 hotline.",
      "A sworn FBI agent is assigned as your primary case officer within 24 business hours.",
      "You receive a unique, trackable Case Reference Number (format: FFRD-YYYY-XXXXXX).",
      "Initial consultation is conducted via encrypted video conference or in-person at your nearest field office.",
      "All information is protected under the Privacy Act of 1974 (5 U.S.C. § 552a) and FBI CJIS security policy.",
    ],
  },
  {
    num: "02",
    title: "Evidence Collection & Forensic Preservation",
    timeline: "Days 1–7",
    points: [
      "Our Cyber Forensics Team (CFT) images and preserves all digital evidence: wallet addresses, wire confirmations, email headers, chat logs, IP logs, and transaction hashes.",
      "Blockchain analytics tools (Chainalysis, TRM Labs, Elliptic) are deployed to trace on-chain fund flows in real time.",
      "Subpoenas are drafted for financial institutions, exchanges, payment processors, and telecom providers under 18 U.S.C. § 2703 (Stored Communications Act).",
      "A sworn affidavit and asset freeze petition are prepared for federal magistrate judge review.",
    ],
  },
  {
    num: "03",
    title: "Ex Parte Temporary Restraining Order (TRO)",
    timeline: "Days 7–21",
    points: [
      "An Assistant U.S. Attorney (AUSA) assigned to your case presents probable cause before a federal judge.",
      "Under 18 U.S.C. § 1345 and § 983, the Court issues an ex parte TRO freezing defendant-held assets domestically.",
      "Letters Rogatory and Mutual Legal Assistance Treaty (MLAT) requests are dispatched to foreign jurisdictions for accounts held offshore.",
      "Financial institutions are served with lawful subpoenas compelling immediate preservation of funds pending civil forfeiture proceedings.",
    ],
  },
  {
    num: "04",
    title: "Tracing, Attribution & Network Mapping",
    timeline: "Weeks 3–12 (overlaps with TRO phase)",
    points: [
      "Blockchain attribution specialists deconstruct tumbler (mixer), chain-hopping, and peel-chain laundering techniques.",
      "Crypto exchange KYC data is compiled to identify suspect individuals, mule accounts, and incorporated shell entities.",
      "Suspicious Activity Reports (SARs) from FinCEN are subpoenaed and cross-referenced.",
      "Where applicable, parallel criminal proceedings are opened alongside civil asset recovery.",
    ],
  },
  {
    num: "05",
    title: "Asset Seizure & Civil Forfeiture Complaint",
    timeline: "Weeks 8–16",
    points: [
      "Seized assets (fiat, cryptocurrency, real property, vehicles, securities) are placed into the DOJ Asset Forfeiture Fund pending resolution.",
      "A Verified Complaint for Civil Forfeiture in Rem is filed in the U.S. District Court.",
      "Notice of the forfeiture action is published and served on all known claimant-respondents per 18 U.S.C. § 983(a).",
      "Where assets belong to identifiable victims, a Motion for Expedited Restitution is filed.",
    ],
  },
  {
    num: "06",
    title: "Recovery, Adjudication & Return of Funds",
    timeline: "Months 4–18 (case-dependent)",
    points: [
      "Following court order, the DOJ Asset Forfeiture Fund releases recovered assets to verified victims.",
      "A Victim Verification Protocol (VVP) confirms identity, loss amount, and chain-of-title via notarized declarations and banking records.",
      "Funds are returned via U.S. Treasury check or direct ACH transfer — never via wire to third parties, gift cards, or cryptocurrency.",
      "You receive a formal closure letter from Agent Mc Collins's office and a certificate of cooperation.",
      "Where applicable, victim impact statements are routed to the Criminal Division for sentencing proceedings.",
    ],
  },
];

export default function RecoveryProcess() {
  return (
    <section id="process" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            Standard Operating Procedures
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            The Federal Funds Recovery Process
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Every case accepted by the Mc Collins Unit follows a formalized,
            six-phase procedure aligned with the U.S. Department of Justice's
            <em> Asset Forfeiture Policy Manual</em> and the FBI's
            <em> Cyber Investigations Standard Operating Guide</em>. While
            timelines vary by case complexity and jurisdictional hurdles,
            the following framework applies to all accepted matters.
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
                  <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
                    {s.points.map((p, idx) => (
                      <li key={idx} className="flex gap-3">
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
            <strong className="text-[#0b1f3a]">Important Note:</strong> The FBI
            does not guarantee full recovery of funds in any matter. Recovery
            percentages depend on the timeliness of reporting, fund movement,
            jurisdictional constraints, and solvency of downstream receivers.
            However, cases reported within{" "}
            <strong className="text-[#b22234]">72 hours</strong> of the initial
            fraudulent transfer historically yield a{" "}
            <strong>77% partial-to-full recovery rate</strong>, per our 2024
            Performance and Accountability Report.
          </p>
        </div>
      </div>
    </section>
  );
}
