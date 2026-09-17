export default function About() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
              About the Unit
            </div>
            <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
              FBI Cybercrime &amp; Financial Fraud Recovery Division — Mc Collins Unit
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
              <p>
                The Fraud &amp; Funds Recovery Division (FFRD) is a specialized unit within
                the FBI's Cyber Division and Criminal Investigative Division, operating
                under the auspices of the U.S. Department of Justice. Chaired by{" "}
                <strong>Special Agent-in-Charge Mc Collins</strong>, a 22-year veteran
                of the Bureau with extensive experience in transnational financial
                crime and cryptocurrency tracing, the unit is federally mandated to
                assist private U.S. citizens and small businesses who have suffered
                monetary losses due to fraudulent schemes.
              </p>
              <p>
                Our mandate is codified under <em>18 U.S.C. § 1343 (Wire Fraud)</em>,{" "}
                <em>18 U.S.C. § 1344 (Bank Fraud)</em>, <em>18 U.S.C. § 1028 (Identity
                Fraud)</em>, and the <em>Computer Fraud and Abuse Act (18 U.S.C. § 1030)</em>.
                We maintain active liaison with the Financial Crimes Enforcement Network
                (FinCEN), the Commodity Futures Trading Commission (CFTC), the U.S.
                Securities and Exchange Commission (SEC), and 100+ international law
                enforcement partners via Interpol and the FBI's Legal Attaché (Legat)
                network.
              </p>
              <p>
                <strong>Our mission is simple:</strong> trace stolen assets, dismantle
                the criminal networks behind them, and return funds to their rightful
                owners. All victim services are provided{" "}
                <span className="text-[#b22234] font-semibold">free of charge</span>{" "}
                as a function of federal law enforcement.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border-l-4 border-[#c9a227] bg-slate-50 p-4">
                <div className="font-serif text-lg font-bold text-[#0b1f3a]">
                  Special Agent Mc Collins
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Unit Chief, Badge #J.4267-MC
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Former lead investigator, Silk Road &amp; Colonial Pipeline ransomware
                  task forces. Recognized by the Director's Award for Distinguished
                  Service in 2022.
                </p>
              </div>
              <div className="border-l-4 border-[#0b1f3a] bg-slate-50 p-4">
                <div className="font-serif text-lg font-bold text-[#0b1f3a]">
                  Legal Authority
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  DOJ Case Designation
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Operating under DOJ Directive 546.22 and the Asset Forfeiture &amp;
                  Money Laundering Statutes (18 U.S.C. §§ 981, 982).
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-sm border border-slate-200 bg-gradient-to-br from-[#0b1f3a] to-[#14325a] p-6 text-white shadow-lg">
              <h3 className="mb-4 font-serif text-xl font-bold text-[#c9a227]">
                Unit Credentials &amp; Licensure
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  "FBI — Special Agent credential #J.4267-MC",
                  "U.S. Department of Justice — Sworn Federal Officer",
                  "FinCEN Certified Financial Crimes Investigator (CFCI)",
                  "Certified Cryptocurrency Investigator (CCI) — CipherTrace",
                  "Member, FBI Cyber Action Team (CAT)",
                  "Accredited, FBI National Academy (NA-279)",
                  "Interpol Red Notice Authority (Case Liaison)",
                  "Secret / SCI clearance, DoD adjudication",
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
                Credentials are independently verifiable through the FBI's
                Office of Public Affairs. Badge and commission available for
                inspection during video or in-person consultations.
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-6">
              <h4 className="mb-3 font-serif text-lg font-bold text-[#0b1f3a]">
                How to Verify Our Authenticity
              </h4>
              <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
                <li>Call the FBI HQ switchboard directly at (202) 324-3000</li>
                <li>Ask for the Fraud &amp; Funds Recovery Unit — Mc Collins</li>
                <li>Confirm your case reference number (provided on filing)</li>
              </ol>
              <p className="mt-3 text-xs text-slate-500">
                Legitimate FBI agents will never ask for payment, gift cards,
                or cryptocurrency to process a recovery.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
