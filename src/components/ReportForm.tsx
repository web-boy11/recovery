import { useState, useEffect, useCallback } from "react";
import {
  saveSubmission,
  saveFormDraft,
  getFormDraft,
  clearFormDraft,
  type FormDraft,
} from "../utils/storage";
import { useLanguage } from "../context/LanguageContext";
import { WhatsAppBadge, OFFICIAL_PHONE, WHATSAPP_URL } from "./WhatsAppBadge";

const paymentOptions = [
  "Bank Wire (SWIFT / Fedwire)",
  "SEPA Transfer / Instant (EUR)",
  "UK Faster Payments / BACS (GBP)",
  "Revolut / Wise Transfer",
  "ACH Transfer",
  "Bitcoin (BTC)",
  "Ethereum (ERC-20)",
  "USDT / USDC / Stablecoin",
  "Credit / Debit Card",
  "Gift Card",
  "Online Platform (PayPal / Zelle / Cash App)",
];

const countryList = [
  "United States",
  "United Kingdom",
  "Germany (Deutschland)",
  "France",
  "Spain (España)",
  "Italy (Italia)",
  "Netherlands (Nederland)",
  "Switzerland (Schweiz / Suisse)",
  "Austria (Österreich)",
  "Belgium (Belgique / België)",
  "Ireland",
  "Portugal",
  "Sweden (Sverige)",
  "Norway (Norge)",
  "Denmark (Danmark)",
  "Finland (Suomi)",
  "Poland (Polska)",
  "Canada",
  "Australia",
  "Other European Country",
  "Other International",
];

const contactOptions = [
  "Encrypted Email",
  "Phone Call",
  "Signal / Encrypted Messaging",
  "In-Person Field Office / Europol Liaison",
];

const emptyForm: FormDraft = {
  fullName: "",
  dob: "",
  email: "",
  phone: "",
  country: "United States",
  cityState: "",
  ssn4: "",
  fraudType: "",
  lossRange: "",
  dateDiscovered: "",
  dateInitialTransfer: "",
  paymentMethods: [],
  transactionIds: "",
  narrative: "",
  contactMethod: "",
};

export default function ReportForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormDraft>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [caseRef, setCaseRef] = useState("");
  const [restored, setRestored] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const draft = getFormDraft();
    if (draft) {
      setForm((prev) => ({ ...prev, ...draft }));
      setRestored(true);
      setTimeout(() => setRestored(false), 5000);
    }
  }, []);

  // Auto-save draft on changes (debounced)
  const saveDraft = useCallback(() => {
    const hasAnyValue = Object.entries(form).some(([key, val]) => {
      if (key === "paymentMethods") return (val as string[]).length > 0;
      return typeof val === "string" && val.trim() !== "";
    });
    if (hasAnyValue) {
      saveFormDraft(form);
    }
  }, [form]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 800);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const updateField = (field: keyof FormDraft, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const togglePayment = (method: string) => {
    setForm((prev) => {
      const methods = prev.paymentMethods ?? [];
      return {
        ...prev,
        paymentMethods: methods.includes(method)
          ? methods.filter((m) => m !== method)
          : [...methods, method],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = saveSubmission({
      fullName: form.fullName ?? "",
      dob: form.dob ?? "",
      email: form.email ?? "",
      phone: form.phone ?? "",
      country: form.country ?? "United States",
      cityState: form.cityState ?? "",
      ssn4: form.ssn4 ?? "",
      fraudType: form.fraudType ?? "",
      lossRange: form.lossRange ?? "",
      dateDiscovered: form.dateDiscovered ?? "",
      dateInitialTransfer: form.dateInitialTransfer ?? "",
      paymentMethods: form.paymentMethods ?? [],
      transactionIds: form.transactionIds ?? "",
      narrative: form.narrative ?? "",
      contactMethod: form.contactMethod ?? "",
    });
    setCaseRef(result.caseRef);
    setSubmitted(true);
    clearFormDraft();
  };

  return (
    <section id="report" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#b22234]">
              {t.report.badge}
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a]">
              {t.report.title}
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-slate-700">
              {t.report.desc}
            </p>

            <div className="space-y-4 text-sm">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-semibold text-[#0b1f3a]">{t.report.hotlineLabel}</div>
                  <WhatsAppBadge label="WhatsApp" size="sm" variant="solid" />
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between text-lg font-bold text-[#075E54] hover:text-[#25D366] transition-colors"
                  title="Open encrypted chat on WhatsApp"
                >
                  <span>{OFFICIAL_PHONE}</span>
                  <span className="text-[11px] font-medium text-white bg-[#25D366] px-2 py-0.5 rounded shadow-sm group-hover:bg-[#20ba59]">
                    Chat &rarr;
                  </span>
                </a>
                <div className="mt-1 text-[11px] text-slate-500">
                  Official WhatsApp &amp; International Encrypted Relay
                </div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-[#0b1f3a]">{t.report.emailLabel}</div>
                <a
                  href="mailto:collinsmcdonald@globalfraudrecovery.site"
                  className="text-slate-700 font-mono text-xs hover:text-[#0b1f3a] hover:underline"
                >
                  collinsmcdonald@globalfraudrecovery.site
                </a>
              </div>
              <div className="rounded-sm border-l-4 border-[#c9a227] bg-amber-50 p-4 text-xs text-amber-900">
                {t.report.evidenceWarning}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="rounded-sm border-2 border-emerald-400 bg-emerald-50 p-10 text-center">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M22 11.08V12a10 10 0 11-5.93-9.14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 4L12 14.01l-3-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="mb-2 font-serif text-2xl font-bold text-emerald-900">
                  {t.report.successTitle}
                </h3>
                <p className="text-sm text-emerald-800">
                  {t.report.successDesc.replace("{caseRef}", caseRef)}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-sm border border-slate-200 bg-slate-50 p-6 lg:p-8"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h3 className="font-serif text-xl font-bold text-[#0b1f3a]">
                    {t.report.formTitle}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a] bg-[#c9a227]/20 border border-[#c9a227] px-2 py-0.5 rounded">
                    US &bull; EU &bull; UK Jurisdiction
                  </span>
                </div>

                {/* Restored draft notification */}
                {restored && (
                  <div className="mb-4 rounded border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-800">
                    <strong>Draft Restored:</strong> Your previous form progress has been loaded.
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={t.report.fields.fullName}
                    value={form.fullName ?? ""}
                    onChange={(v) => updateField("fullName", v)}
                    required
                  />
                  <Field
                    label={t.report.fields.dob}
                    type="date"
                    value={form.dob ?? ""}
                    onChange={(v) => updateField("dob", v)}
                    required
                  />
                  <Field
                    label={t.report.fields.email}
                    type="email"
                    value={form.email ?? ""}
                    onChange={(v) => updateField("email", v)}
                    required
                  />
                  <Field
                    label={t.report.fields.phone}
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={(v) => updateField("phone", v)}
                    required
                  />
                  <LabeledSelect
                    label={t.report.fields.country}
                    value={form.country ?? "United States"}
                    onChange={(v) => updateField("country", v)}
                    required
                  >
                    {countryList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </LabeledSelect>
                  <Field
                    label={t.report.fields.cityRegion}
                    value={form.cityState ?? ""}
                    onChange={(v) => updateField("cityState", v)}
                    required
                  />
                  <Field
                    label={t.report.fields.nationalId}
                    value={form.ssn4 ?? ""}
                    onChange={(v) => updateField("ssn4", v)}
                  />
                  <LabeledSelect
                    label={t.report.fields.fraudType}
                    value={form.fraudType ?? ""}
                    onChange={(v) => updateField("fraudType", v)}
                    required
                  >
                    <option value="">-- Select category --</option>
                    <option>Cryptocurrency / Digital Asset Fraud</option>
                    <option>Investment / Securities Fraud / Boiler Room</option>
                    <option>Wire Transfer / SEPA / ACH Fraud</option>
                    <option>Romance / Confidence Scam</option>
                    <option>Tech Support / Fake Law Enforcement Impersonation</option>
                    <option>Identity Theft / Account Takeover</option>
                    <option>Real Estate / Escrow Fraud</option>
                    <option>Other (describe in narrative)</option>
                  </LabeledSelect>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <LabeledSelect
                    label={t.report.fields.lossRange}
                    value={form.lossRange ?? ""}
                    onChange={(v) => updateField("lossRange", v)}
                    required
                  >
                    <option value="">-- Select loss range --</option>
                    <option>Under $5,000 / €4,500 / £4,000</option>
                    <option>$5,000 – $25,000 (€4,500 – €23,000 / £4,000 – £20,000)</option>
                    <option>$25,000 – $100,000 (€23,000 – €95,000 / £20,000 – £80,000)</option>
                    <option>$100,000 – $500,000 (€95,000 – €470,000 / £80,000 – £400,000)</option>
                    <option>$500,000 – $1,000,000 (€470,000 – €950,000 / £400,000 – £800,000)</option>
                    <option>Over $1,000,000 / €1,000,000 / £800,000+</option>
                  </LabeledSelect>
                  <Field
                    label={t.report.fields.dateDiscovered}
                    type="date"
                    value={form.dateDiscovered ?? ""}
                    onChange={(v) => updateField("dateDiscovered", v)}
                    required
                  />
                  <Field
                    label={t.report.fields.dateInitialTransfer}
                    type="date"
                    value={form.dateInitialTransfer ?? ""}
                    onChange={(v) => updateField("dateInitialTransfer", v)}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {t.report.fields.paymentMethod}{" "}
                    <span className="text-[#b22234]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {paymentOptions.map((m) => (
                      <label
                        key={m}
                        className="flex items-center gap-2 rounded border border-slate-300 bg-white px-2.5 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(form.paymentMethods ?? []).includes(m)}
                          onChange={() => togglePayment(m)}
                          className="accent-[#b22234]"
                        />
                        <span className="text-slate-700 font-medium">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {t.report.fields.transactionIds}
                  </label>
                  <textarea
                    rows={3}
                    value={form.transactionIds ?? ""}
                    onChange={(e) =>
                      updateField("transactionIds", e.target.value)
                    }
                    placeholder="Paste known blockchain hashes (TXIDs), destination wallet addresses, IBAN/BIC numbers, SWIFT/IMAD references..."
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-mono focus:border-[#0b1f3a] focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {t.report.fields.narrative}
                  </label>
                  <textarea
                    rows={5}
                    value={form.narrative ?? ""}
                    onChange={(e) => updateField("narrative", e.target.value)}
                    placeholder="Describe how the perpetrators established contact, names/aliases used, communication channels (WhatsApp, Telegram, website URLs), and timeline of events..."
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0b1f3a] focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {t.report.fields.contactMethod}
                  </label>
                  <div className="flex flex-wrap gap-4 text-xs">
                    {contactOptions.map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          value={c}
                          checked={form.contactMethod === c}
                          onChange={() => updateField("contactMethod", c)}
                          className="accent-[#b22234]"
                        />
                        <span className="text-slate-800 font-medium">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 rounded border border-slate-300 bg-white p-3 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 accent-[#b22234]"
                  />
                  <span>
                    I certify under penalty of perjury under applicable federal and international treaty laws that the information provided is truthful and accurate to the best of my knowledge. I understand this report initiates an official law enforcement inquiry and is governed by strict privacy standards.
                  </span>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-sm bg-[#b22234] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#9a1c2c] md:w-auto"
                >
                  {t.report.submitBtn} →
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Transatlantic encrypted transmission (TLS 1.3). Protected under U.S. Federal and European Union cross-border confidentiality protocols.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
        {label} {required && <span className="text-[#b22234]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0b1f3a] focus:outline-none"
      />
    </div>
  );
}

function LabeledSelect({
  label,
  required,
  value,
  onChange,
  children,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
        {label} {required && <span className="text-[#b22234]">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0b1f3a] focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}
