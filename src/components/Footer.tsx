import Seal from "./Seal";
import { useLanguage } from "../context/LanguageContext";
import { WhatsAppBadge, OFFICIAL_PHONE, WHATSAPP_URL } from "./WhatsAppBadge";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-[#0b1f3a] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <Seal size={64} />
                <div className="font-serif text-base font-bold leading-tight">
                  FBI Cybercrime &amp;<br />Transatlantic Task Force
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Operating in joint partnership between the FBI Cyber Division, U.S. Department of Justice, and Europol EC3, assisting victims across the United States, United Kingdom, and European Union.
              </p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[#c9a227] font-semibold">
                  🇺🇸 United States
                </span>
                <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[#c9a227] font-semibold">
                  🇪🇺 European Union
                </span>
                <span className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[#c9a227] font-semibold">
                  🇬🇧 UK
                </span>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                Victim Services
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#report" className="hover:text-[#c9a227]">File a Confidential Report</a></li>
                <li><a href="#process" className="hover:text-[#c9a227]">Recovery Process (6 Stages)</a></li>
                <li><a href="#faq" className="hover:text-[#c9a227]">FAQ &amp; Jurisdiction</a></li>
                <li><a href="#fraud-types" className="hover:text-[#c9a227]">Recognized Fraud Types</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Europol EC3 Joint Actions</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Restitution Declarations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                About the Division
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#about" className="hover:text-[#c9a227]">About Agent Collins McDonald</a></li>
                <li><a href="#fraud-types" className="hover:text-[#c9a227]">Transatlantic Jurisdiction</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Budapest Convention Accord</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Interpol Red Notice Authority</a></li>
                <li><a href="#" className="hover:text-[#c9a227]">Case Resolution Statistics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-[#c9a227]">
                International Contacts
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider text-white/60">24/7 International Dispatch</span>
                    <WhatsAppBadge label="WhatsApp" size="sm" variant="solid" />
                  </div>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-white hover:text-[#25D366] transition-colors"
                  >
                    <span>{OFFICIAL_PHONE}</span>
                    <span className="text-[10px] font-normal text-emerald-400 underline">Chat on WhatsApp &rarr;</span>
                  </a>
                </li>
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">Washington D.C. Headquarters</div>
                  <div>J. Edgar Hoover Building<br />935 Pennsylvania Ave NW<br />Washington, DC 20535</div>
                </li>
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">Europol Task Force Liaison</div>
                  <div>Eisenhowerlaan 73<br />2517 KK The Hague, Netherlands</div>
                </li>
                <li>
                  <div className="text-xs uppercase tracking-wider text-white/60">Encrypted Email Relay</div>
                  <div className="font-mono text-xs text-[#c9a227]">collins.mcdonald@fbi.dhs.gov</div>
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
              © {new Date().getFullYear()} {t.footer.title}. {t.footer.rights}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <a href="#" className="hover:text-white">Privacy Act &amp; GDPR Compliance</a>
              <a href="#" className="hover:text-white">Transatlantic Protocols</a>
              <a href="#" className="hover:text-white">FOIA</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/50">
            {t.footer.disclaimer} {t.footer.address}
          </div>
        </div>
      </div>
    </footer>
  );
}
