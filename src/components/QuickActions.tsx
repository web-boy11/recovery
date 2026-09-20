import { WhatsAppIcon, WhatsAppBadge, OFFICIAL_PHONE, WHATSAPP_URL } from "./WhatsAppBadge";

const actions = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Report a Scam",
    desc: "Initiate a confidential case file with our unit.",
    href: "#report",
    color: "bg-[#b22234]",
    isWhatsApp: false,
    external: false,
  },
  {
    icon: (
      <WhatsAppIcon className="h-7 w-7 fill-white" />
    ),
    title: "WhatsApp Dispatch",
    desc: OFFICIAL_PHONE,
    href: WHATSAPP_URL,
    color: "bg-[#25D366]",
    isWhatsApp: true,
    external: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Field Offices",
    desc: "56 field offices across the United States.",
    href: "#offices",
    color: "bg-[#0b1f3a]",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Check Your Case",
    desc: "Existing case file? Get a status update.",
    href: "#check-case",
    color: "bg-[#0b1f3a]",
  },
];

export default function QuickActions() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <a
              key={a.title}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel={a.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c9a227] hover:shadow-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm ${a.color} text-white group-hover:bg-[#c9a227] group-hover:text-[#0b1f3a]`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold text-[#0b1f3a]">{a.title}</span>
                  {a.isWhatsApp && (
                    <WhatsAppBadge label="WhatsApp" size="sm" variant="solid" />
                  )}
                </div>
                <div className="text-sm font-medium text-slate-600 truncate">{a.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
