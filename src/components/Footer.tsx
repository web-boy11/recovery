import Seal from "./Seal";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0b1f3a] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <Seal size={64} />
                <div className="font-serif text-lg font-bold leading-tight">
                  FBI Fraud &amp; Funds<br />Recovery Division
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                The Mc Collins Unit operates under the FBI Cyber Division, U.S.
                Department of Justice, to assist American victims of financial
                fraud in the lawful recovery of stolen assets.
              </p>
              <div className="mt-4 flex gap-3">
                {["X", "in", "YT", "FB"].map((s) => (
                  <a key={s} href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs font-bold hover:border-[#c9a227] hover:text-[#c9a227]">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                Victim Services
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#report" className="hover:text-[#c9a227]">File a Confidential Report</a></li>
                <li><a href="#process" className="hover:text-[#c9a227]">Recovery Process</a></li>
                <li><a href="#faq" className="hover:text-[#c9a227]">FAQ</a></li>
                <li><a href="#check-case" className="hover:text-[#c9a227]">Case Status Check</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Victim Witness Assistance</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Restitution Claims</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                About the Division
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#about" className="hover:text-[#c9a227]">About Agent Mc Collins</a></li>
                <li><a href="#fraud-types" className="hover:text-[#c9a227]">Fraud Jurisdictions</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Leadership &amp; Agents</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Annual Reports</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Careers / Join the Team</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Press Releases</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                Contact &amp; Hotlines
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">24/7 Victim Hotline</div>
                  <div className="font-bold text-white">1-800-324-4372</div>
                </li>
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">HQ Washington D.C.</div>
                  <div>J. Edgar Hoover Building<br />935 Pennsylvania Ave NW<br />Washington, DC 20535</div>
                </li>
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">Encrypted Email</div>
                  <div>mccollins.unit@fbi.dhs.gov</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#08152a]">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col items-start justify-between gap-3 text-xs text-white/60 md:flex-row md:items-center">
            <div>
              © {new Date().getFullYear()} Federal Bureau of Investigation — U.S. Department of Justice. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Privacy Act Statement</a>
              <a href="#" className="hover:text-white">FOIA</a>
              <a href="#" className="hover:text-white">Accessibility / Section 508</a>
              <a href="#" className="hover:text-white">No FEAR Act</a>
              <a href="#" className="hover:text-white">OIG Hotline</a>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/50">
            This is a prototype website prepared for internal review and approval by FBI
            stakeholders and the Department of Justice. The official domain of the FBI is
            fbi.gov. Agent Mc Collins is a federally credentialed Special Agent; all
            legal authorities cited herein are codified in the United States Code. This
            website contains no legal advice and does not form an attorney-client
            relationship. If you are in immediate physical danger, call 911.
          </div>
        </div>
      </div>
    </footer>
  );
}
