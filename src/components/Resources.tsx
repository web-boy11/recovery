const resources = [
  {
    title: "FBI Internet Crime Complaint Center (IC3)",
    desc: "File a complaint with the IC3 if you've been a victim of internet crime. Reports are fed to federal, state, local, and international law enforcement.",
    href: "#",
    tag: "Report",
  },
  {
    title: "Federal Trade Commission — IdentityTheft.gov",
    desc: "The federal government's free, one-stop resource for identity theft recovery plans and FTC fraud reports.",
    href: "#",
    tag: "Identity Theft",
  },
  {
    title: "FinCEN — Suspicious Activity Reporting",
    desc: "Banks and financial institutions file SARs; victims should request their bank escalate any suspected fraud via a SAR filing.",
    href: "#",
    tag: "Financial",
  },
  {
    title: "SEC Investor.gov — Investment Adviser Search",
    desc: "Verify any investment professional or firm's registration status with the SEC's Investment Adviser Public Disclosure database.",
    href: "#",
    tag: "Verify",
  },
  {
    title: "DOJ Asset Forfeiture Program",
    desc: "Official information on how the Department of Justice returns seized assets to eligible crime victims.",
    href: "#",
    tag: "Forfeiture",
  },
  {
    title: "Victim Connect Resource Center",
    desc: "Confidential referrals for victims of any crime, including financial fraud, funded by the Office for Victims of Crime (OVC).",
    href: "#",
    tag: "Support",
  },
];

const docs = [
  "DOJ Asset Forfeiture Policy Manual (2024)",
  "FBI Cyber Investigations SOP Guide",
  "Privacy Act Statement (5 U.S.C. § 552a)",
  "Victim's Bill of Rights (18 U.S.C. § 3771)",
  "Guide for Filing a Civil Recovery Claim",
  "Cryptocurrency Tracing & Recovery (CJIS 17-08)",
];

export default function Resources() {
  return (
    <section id="resources" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
            Victim Resources
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
            Federal Resources &amp; Publications
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Access official government resources to supplement your case, verify
            third parties, and understand your rights as a federal crime victim.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex flex-col rounded-sm border border-slate-200 bg-white p-5 transition hover:border-[#c9a227] hover:shadow-md"
                >
                  <span className="mb-2 inline-block self-start rounded-sm bg-[#0b1f3a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {r.tag}
                  </span>
                  <h3 className="mb-2 font-serif text-base font-bold text-[#0b1f3a]">
                    {r.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">
                    {r.desc}
                  </p>
                  <span className="mt-auto text-sm font-semibold text-[#b22234]">
                    Visit resource →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-sm border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 font-serif text-lg font-bold text-[#0b1f3a]">
              Downloads &amp; Policy Documents
            </h3>
            <ul className="divide-y divide-slate-200">
              {docs.map((d) => (
                <li key={d}>
                  <a
                    href="#"
                    className="flex items-center justify-between gap-2 py-3 text-sm text-[#0b1f3a] hover:text-[#b22234]"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d}
                    </span>
                    <span className="text-xs font-semibold text-[#b22234]">PDF</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                FOIA Request
              </div>
              <p className="text-xs text-slate-600">
                To submit a Freedom of Information Act request related to a
                closed case, contact the FBI's FOIA/Privacy Act Division.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
