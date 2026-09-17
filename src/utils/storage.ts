// ── Types ──────────────────────────────────────────────────────────────
export interface Submission {
  id: string;
  caseRef: string;
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  country?: string;
  cityState: string;
  ssn4: string;
  fraudType: string;
  lossRange: string;
  dateDiscovered: string;
  dateInitialTransfer: string;
  paymentMethods: string[];
  transactionIds: string;
  narrative: string;
  contactMethod: string;
  status: "new" | "under-review" | "resolved";
  submittedAt: string;
}

export interface FormDraft {
  fullName?: string;
  dob?: string;
  email?: string;
  phone?: string;
  country?: string;
  cityState?: string;
  ssn4?: string;
  fraudType?: string;
  lossRange?: string;
  dateDiscovered?: string;
  dateInitialTransfer?: string;
  paymentMethods?: string[];
  transactionIds?: string;
  narrative?: string;
  contactMethod?: string;
  savedAt?: string;
}

// ── Keys ───────────────────────────────────────────────────────────────
const SUBMISSIONS_KEY = "ffrd_submissions";
const DRAFT_KEY = "ffrd_form_draft";

// ── Helpers ────────────────────────────────────────────────────────────
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateCaseRef(): string {
  return `FFRD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

// ── Submissions CRUD ───────────────────────────────────────────────────
export function getSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(
  data: Omit<Submission, "id" | "caseRef" | "status" | "submittedAt">
): Submission {
  const submissions = getSubmissions();
  const entry: Submission = {
    ...data,
    id: generateId(),
    caseRef: generateCaseRef(),
    status: "new",
    submittedAt: new Date().toISOString(),
  };
  submissions.unshift(entry);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  return entry;
}

export function updateSubmissionStatus(
  id: string,
  status: Submission["status"]
): void {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    submissions[idx].status = status;
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }
}

export function deleteSubmission(id: string): void {
  const submissions = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

// ── CSV Export ──────────────────────────────────────────────────────────
export function exportSubmissionsCsv(): void {
  const submissions = getSubmissions();
  if (submissions.length === 0) return;

  const headers = [
    "Case Ref",
    "Full Name",
    "Email",
    "Phone",
    "Country",
    "City/State",
    "Fraud Type",
    "Loss Range",
    "Date Discovered",
    "Date Initial Transfer",
    "Payment Methods",
    "Status",
    "Submitted At",
  ];

  const escape = (v: string) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = submissions.map((s) =>
    [
      s.caseRef,
      s.fullName,
      s.email,
      s.phone,
      s.country || "United States",
      s.cityState,
      s.fraudType,
      s.lossRange,
      s.dateDiscovered,
      s.dateInitialTransfer,
      (s.paymentMethods ?? []).join("; "),
      s.status,
      s.submittedAt,
    ]
      .map(escape)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ffrd-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Form Draft ─────────────────────────────────────────────────────────
export function saveFormDraft(data: FormDraft): void {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ ...data, savedAt: new Date().toISOString() })
  );
}

export function getFormDraft(): FormDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearFormDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

// ── Sent Email Communications Log ─────────────────────────────────────
export interface SentEmailRecord {
  id: string;
  caseRef: string;
  claimantName: string;
  recipientEmail: string;
  templateId: string;
  templateName: string;
  subject: string;
  sentMethod: "gmail" | "outlook" | "mailto" | "direct" | "clipboard";
  sentAt: string;
}

const SENT_EMAILS_KEY = "ffrd_sent_emails";

export function getSentEmails(): SentEmailRecord[] {
  try {
    const raw = localStorage.getItem(SENT_EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordSentEmail(
  record: Omit<SentEmailRecord, "id" | "sentAt">
): SentEmailRecord {
  const records = getSentEmails();
  const newEntry: SentEmailRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sentAt: new Date().toISOString(),
  };
  records.unshift(newEntry);
  localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(records));
  return newEntry;
}

export function deleteSentEmailRecord(id: string): void {
  const records = getSentEmails().filter((r) => r.id !== id);
  localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(records));
}

// ── In-Dashboard Direct Email Service Settings ─────────────────────────
export interface EmailServiceSettings {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  senderName?: string;
  senderEmail?: string;
}

const EMAIL_SETTINGS_KEY = "ffrd_email_settings";

export function getEmailServiceSettings(): EmailServiceSettings {
  try {
    const raw = localStorage.getItem(EMAIL_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {
      senderName: "Special Agent Mc Collins — FFRD",
      senderEmail: "mccollins.unit@fbi.dhs.gov",
    };
  } catch {
    return {
      senderName: "Special Agent Mc Collins — FFRD",
      senderEmail: "mccollins.unit@fbi.dhs.gov",
    };
  }
}

export function saveEmailServiceSettings(settings: EmailServiceSettings): void {
  localStorage.setItem(EMAIL_SETTINGS_KEY, JSON.stringify(settings));
}

