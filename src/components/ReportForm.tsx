import { useState, useEffect, useCallback } from "react";
import {
  saveSubmission,
  saveFormDraft,
  getFormDraft,
  clearFormDraft,
  type FormDraft,
} from "../utils/storage";

const paymentOptions = [
  "Bank Wire",
  "ACH Transfer",
  "Bitcoin (BTC)",
  "Ethereum (ERC-20)",
  "USDT/Stablecoin",
  "Credit/Debit Card",
  "Gift Card",
  "Cash App / Zelle / Venmo",
];

const contactOptions = [
  "Phone Call",
  "Encrypted Email",
  "In-Person Field Office",
  "Signal / Encrypted Messaging",
];

const emptyForm: FormDraft = {
  fullName: "",
  dob: "",
  email: "",
  phone: "",
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
      // Auto-hide the restored banner after 5 seconds
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
              File a Confidential Report
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-[#0b1f3a]">
              Initiate Your Case Intake
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-slate-700">
              Submit this confidential intake form and a sworn agent will
              contact you within 24 business hours. All submissions are
              encrypted (TLS 1.3) and protected under the Privacy Act of 1974.
            </p>

            <div className="space-y-4 text-sm">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-[#0b1f3a]">24/7 Hotline</div>
                <div className="text-lg font-bold text-[#b22234]">1-800-324-4372</div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-[#0b1f3a]">Encrypted Email</div>
                <div className="text-slate-700">mccollins.unit@fbi.dhs.gov</div>
              </div>
              <div className="rounded-sm border-l-4 border-[#c9a227] bg-amber-50 p-4 text-xs text-amber-900">
                <strong>Do NOT</strong> destroy any evidence (phones, laptops,
                emails) even if you believe the scam is over. Forensic
                preservation is critical.
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
                  Intake Received
                </h3>
                <p className="text-sm text-emerald-800">
                  Your case reference number is{" "}
                  <strong>{caseRef}</strong>. A sworn agent from the Mc Collins
                  Unit will contact you within 24 business hours via your
                  preferred method.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-sm border border-slate-200 bg-slate-50 p-6 lg:p-8"
              >
                <h3 className="mb-6 font-serif text-xl font-bold text-[#0b1f3a]">
                  Confidential Victim Intake Form (CVIF)
                </h3>

                {/* Restored draft notification */}
                {restored && (
                  <div className="mb-4 rounded border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-800">
                    <strong>Welcome back!</strong> Your previous form progress
                    has been restored. Continue where you left off.
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Full Legal Name"
                    value={form.fullName ?? ""}
                    onChange={(v) => updateField("fullName", v)}
                    required
                  />
                  <Field
                    label="Date of Birth"
                    type="date"
                    value={form.dob ?? ""}
                    onChange={(v) => updateField("dob", v)}
                    required
                  />
                  <Field
                    label="Email Address"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(v) => updateField("email", v)}
                    required
                  />
                  <Field
                    label="Phone (with area code)"
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={(v) => updateField("phone", v)}
                    required
                  />
                  <Field
                    label="City / State of Residence"
                    value={form.cityState ?? ""}
                    onChange={(v) => updateField("cityState", v)}
                    required
                  />
                  <Field
                    label="Last 4 of SSN (for identity verification)"
                    value={form.ssn4 ?? ""}
                    onChange={(v) => updateField("ssn4", v)}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <LabeledSelect
                    label="Fraud Type"
                    value={form.fraudType ?? ""}
                    onChange={(v) => updateField("fraudType", v)}
                    required
                  >
                    <option value="">-- Select category --</option>
                    <option>Cryptocurrency / Digital Asset Fraud</option>
                    <option>Investment / Securities Fraud</option>
                    <option>Wire Transfer / ACH / BEC Fraud</option>
                    <option>Romance / Confidence Scam</option>
                    <option>Tech Support / Government Impersonation</option>
                    <option>Identity Theft / Account Takeover</option>
                    <option>Real Estate / Escrow Fraud</option>
                    <option>Other (describe below)</option>
                  </LabeledSelect>
                  <LabeledSelect
                    label="Approximate Loss (USD)"
                    value={form.lossRange ?? ""}
                    onChange={(v) => updateField("lossRange", v)}
                    required
                  >
                    <option value="">-- Select range --</option>
                    <option>Under $5,000</option>
                    <option>$5,000 – $25,000</option>
                    <option>$25,000 – $100,000</option>
                    <option>$100,000 – $500,000</option>
                    <option>$500,000 – $1,000,000</option>
                    <option>Over $1,000,000</option>
                  </LabeledSelect>
                  <Field
                    label="Date Fraud Was Discovered"
                    type="date"
                    value={form.dateDiscovered ?? ""}
                    onChange={(v) => updateField("dateDiscovered", v)}
                    required
                  />
                  <Field
                    label="Date of Initial Transfer"
                    type="date"
                    value={form.dateInitialTransfer ?? ""}
                    onChange={(v) => updateField("dateInitialTransfer", v)}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Method of Payment{" "}
                    <span className="text-[#b22234]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    {paymentOptions.map((m) => (
                      <label
                        key={m}
                        className="flex items-center gap-2 rounded border border-slate-300 bg-white px-2 py-1.5"
                      >
                        <input
                          type="checkbox"
                          checked={(form.paymentMethods ?? []).includes(m)}
                          onChange={() => togglePayment(m)}
                          className="accent-[#b22234]"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Transaction IDs / Wallet Addresses / Wire Reference Numbers
                  </label>
                  <textarea
                    rows={3}
                    value={form.transactionIds ?? ""}
                    onChange={(e) =>
                      updateField("transactionIds", e.target.value)
                    }
                    placeholder="Paste all known transaction hashes, beneficiary wallet addresses, Fedwire/IMAD/OMAD numbers, etc."
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0b1f3a] focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Narrative — Describe the Fraud in Your Own Words
                  </label>
                  <textarea
                    rows={5}
                    value={form.narrative ?? ""}
                    onChange={(e) => updateField("narrative", e.target.value)}
                    placeholder="Include how you were contacted, names/usernames of the perpetrators, platforms used (WhatsApp, Telegram, dating site, etc.), and any websites or phone numbers involved."
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0b1f3a] focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {contactOptions.map((c) => (
                      <label key={c} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="contact"
                          value={c}
                          checked={form.contactMethod === c}
                          onChange={() => updateField("contactMethod", c)}
                          className="accent-[#b22234]"
                        />
                        {c}
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
                    I certify under penalty of perjury under the laws of the
                    United States of America that the foregoing is true and
                    correct (18 U.S.C. § 1001). I understand that this
                    submission is to a federal law enforcement agency and that
                    false statements may result in criminal prosecution. I
                    acknowledge receipt of the FBI Privacy Act Statement.
                  </span>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-sm bg-[#b22234] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#9a1c2c] md:w-auto"
                >
                  Submit Encrypted Intake Form →
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Transmission is encrypted via TLS 1.3. Your information is not
                  shared outside of law enforcement.
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
