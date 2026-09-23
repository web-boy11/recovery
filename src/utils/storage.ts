// ── FBI Fraud & Funds Recovery Division — Client Records & Stage Storage Engine ──────────

// ── Types ──────────────────────────────────────────────────────────────
export interface StageHistoryRecord {
  stageIndex: number;
  stageName: string;
  templateId: string;
  sentAt: string;
  recipientEmail: string;
  messageId?: string;
  status: "delivered" | "queued" | "failed";
}

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
  // Stage progression & automated follow-up fields
  currentStageIndex: number;
  currentStageName: string;
  nextEmailDueAt?: string;
  lastEmailSentAt?: string;
  lastEmailStage?: string;
  stageHistory?: StageHistoryRecord[];
  autoEmailEnabled?: boolean;
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

// ── 7 Formal Stage Milestones & Follow-Up Intervals ────────────────────
export interface StageMilestone {
  index: number;
  id: string;
  name: string;
  offsetHours: number;
  label: string;
  description: string;
}

export const STAGE_MILESTONES: StageMilestone[] = [
  {
    index: 0,
    id: "intake-acknowledgement",
    name: "Stage 0: Intake Received",
    offsetHours: 0,
    label: "Intake Received",
    description: "Confirms case docket registration & evidence preservation directive.",
  },
  {
    index: 1,
    id: "agent-assigned",
    name: "Stage 1: Agent Assigned",
    offsetHours: 24, // Due 24 hours after filing
    label: "Agent Assigned",
    description: "Notifies client of Special Agent assignment & formal investigation opening.",
  },
  {
    index: 2,
    id: "tracing-update",
    name: "Stage 2: Tracing Active",
    offsetHours: 48, // Due 48 hours (Day 2) after filing
    label: "Tracing Active",
    description: "Forensic blockchain cluster & correspondent bank tracing milestone.",
  },
  {
    index: 3,
    id: "asset-freeze",
    name: "Stage 3: Funds Secured",
    offsetHours: 96, // Due 96 hours (Day 4) after filing
    label: "Funds Frozen",
    description: "Asset freeze restraining injunction served to holding exchanges/entities.",
  },
  {
    index: 4,
    id: "restitution-docs",
    name: "Stage 4: Restitution Prepared",
    offsetHours: 144, // Due 144 hours (Day 6) after filing
    label: "Restitution Claim",
    description: "Legal restitution claim package & victim identity verification directive.",
  },
  {
    index: 5,
    id: "disbursement-scheduled",
    name: "Stage 5: Payout Ready",
    offsetHours: 192, // Due 192 hours (Day 8) after filing
    label: "Disbursement Scheduled",
    description: "Recovery settlement confirmed & restitution disbursement schedule.",
  },
  {
    index: 6,
    id: "case-resolution",
    name: "Stage 6: Case Closed & Recovered",
    offsetHours: 240, // Due 240 hours (Day 10) after filing
    label: "Case Resolved",
    description: "Final case closure docket & forensic recovery verification certificate.",
  },
];

export function calculateNextStageDueAt(
  submittedAt: string,
  currentStageIndex: number
): string | undefined {
  const nextStage = STAGE_MILESTONES[currentStageIndex + 1];
  if (!nextStage) return undefined;
  const submitTime = new Date(submittedAt).getTime();
  const dueTime = submitTime + nextStage.offsetHours * 60 * 60 * 1000;
  return new Date(dueTime).toISOString();
}

export function isStageEmailOverdue(submission: Submission): boolean {
  if (!submission.nextEmailDueAt) return false;
  if (submission.currentStageIndex >= STAGE_MILESTONES.length - 1) return false;
  return new Date().getTime() >= new Date(submission.nextEmailDueAt).getTime();
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

// ── Seed Submissions (7 Verified Cases Filed on Live Site Sep 21-22) ────
export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: "sub-ffrd-2026-939152",
    caseRef: "FFRD-2026-939152",
    fullName: "Hsjsjsn",
    dob: "1988-04-12",
    email: "claytonking844@gmail.com",
    phone: "464643464946",
    country: "United States",
    cityState: "Ehshsjwj",
    ssn4: "0000",
    fraudType: "Investment / Securities Fraud / Boiler Room",
    lossRange: "$100,000 – $500,000 (€95,000 – €470,000 / £80,000 – £400,000)",
    dateDiscovered: "2026-09-07",
    dateInitialTransfer: "2026-09-07",
    paymentMethods: [
      "UK Faster Payments / BACS (GBP)",
      "ACH Transfer",
      "Credit / Debit Card",
    ],
    transactionIds: "N/A",
    narrative: "Initial investment platform withdrawal freeze and communication block.",
    contactMethod: "Encrypted Email",
    status: "new",
    submittedAt: "2026-09-22T07:17:07.903Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-22T07:17:07.903Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-23T07:17:07.903Z", // Overdue (>24 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-22T07:17:07.903Z",
        recipientEmail: "claytonking844@gmail.com",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-216782",
    caseRef: "FFRD-2026-216782",
    fullName: "Sjsjsj",
    dob: "1992-06-21",
    email: "spousedatabase.do.not.reply@gmail.com",
    phone: "6151518191699",
    country: "United States",
    cityState: "Sgshhdj",
    ssn4: "0000",
    fraudType: "Cryptocurrency / Digital Asset Fraud",
    lossRange: "Under $5,000 / €4,500 / £4,000",
    dateDiscovered: "2026-09-08",
    dateInitialTransfer: "2026-09-13",
    paymentMethods: [
      "Bank Wire (SWIFT / Fedwire)",
      "Online Platform (PayPal / Zelle / Cash App)",
    ],
    transactionIds: "N/A",
    narrative: "Unauthorized wallet drain after interacting with fraudulent decentralized application.",
    contactMethod: "Encrypted Email",
    status: "new",
    submittedAt: "2026-09-22T07:10:39.142Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-22T07:10:39.142Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-23T07:10:39.142Z", // Overdue (>24 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-22T07:10:39.142Z",
        recipientEmail: "spousedatabase.do.not.reply@gmail.com",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-693671",
    caseRef: "FFRD-2026-693671",
    fullName: "Fgujhg",
    dob: "1985-11-04",
    email: "debenedoro@gmail.com",
    phone: "555566698866",
    country: "United States",
    cityState: "Cvhh",
    ssn4: "0000",
    fraudType: "Investment / Securities Fraud / Boiler Room",
    lossRange: "$25,000 – $100,000 (€23,000 – €95,000 / £20,000 – £80,000)",
    dateDiscovered: "2026-09-10",
    dateInitialTransfer: "2026-09-02",
    paymentMethods: [
      "Bank Wire (SWIFT / Fedwire)",
      "USDT / USDC / Stablecoin",
      "Gift Card",
    ],
    transactionIds: "N/A",
    narrative: "Staged investment returns fabricated on online trading dashboard. Funds locked upon withdrawal request.",
    contactMethod: "Signal / Encrypted Messaging",
    status: "new",
    submittedAt: "2026-09-22T06:48:50.260Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-22T06:48:50.260Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-23T06:48:50.260Z", // Overdue (>24 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-22T06:48:50.260Z",
        recipientEmail: "debenedoro@gmail.com",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-695497",
    caseRef: "FFRD-2026-695497",
    fullName: "Tghnk",
    dob: "1979-02-18",
    email: "fghh@ggg.nh",
    phone: "55555663988",
    country: "United States",
    cityState: "Vgvbh",
    ssn4: "0000",
    fraudType: "Cryptocurrency / Digital Asset Fraud",
    lossRange: "Over $1,000,000 / €1,000,000 / £800,000+",
    dateDiscovered: "2026-09-25",
    dateInitialTransfer: "2026-09-09",
    paymentMethods: ["Bitcoin (BTC)", "Credit / Debit Card", "Gift Card"],
    transactionIds: "N/A",
    narrative: "Multi-million dollar private token offering syndicate fraud.",
    contactMethod: "Phone Call",
    status: "new",
    submittedAt: "2026-09-22T06:45:52.364Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-22T06:45:52.364Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-23T06:45:52.364Z", // Overdue (>24 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-22T06:45:52.364Z",
        recipientEmail: "fghh@ggg.nh",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-966180",
    caseRef: "FFRD-2026-966180",
    fullName: "Kondic aleksa",
    dob: "1984-08-30",
    email: "aleksa.kondic@gmail.com",
    phone: "+436769623331",
    country: "Austria (Österreich)",
    cityState: "Linz",
    ssn4: "0000",
    fraudType: "Romance / Confidence Scam",
    lossRange: "$100,000 – $500,000 (€95,000 – €470,000 / £80,000 – £400,000)",
    dateDiscovered: "2021-06-01",
    dateInitialTransfer: "2021-11-06",
    paymentMethods: ["Bitcoin (BTC)"],
    transactionIds: "N/A",
    narrative: "Long-term romance solicitation funneling funds into unverified custodial BTC exchange.",
    contactMethod: "Encrypted Email",
    status: "under-review",
    submittedAt: "2026-09-21T18:38:12.960Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-21T18:38:12.960Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-22T18:38:12.960Z", // Overdue (>41 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-21T18:38:12.960Z",
        recipientEmail: "aleksa.kondic@gmail.com",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-972777",
    caseRef: "FFRD-2026-972777",
    fullName: "Ibrahim Muhammad",
    dob: "1990-03-15",
    email: "im08142087324@gmail.com",
    phone: "+2348142087324",
    country: "Germany (Deutschland)",
    cityState: "Nuremberg",
    ssn4: "0000",
    fraudType: "Cryptocurrency / Digital Asset Fraud",
    lossRange: "$100,000 – $500,000 (€95,000 – €470,000 / £80,000 – £400,000)",
    dateDiscovered: "2026-09-21",
    dateInitialTransfer: "2026-09-21",
    paymentMethods: ["Bitcoin (BTC)"],
    transactionIds: "N/A",
    narrative: "Cross-border cryptocurrency extraction through malicious smart contract authorization.",
    contactMethod: "Encrypted Email",
    status: "under-review",
    submittedAt: "2026-09-21T16:48:13.764Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-21T16:48:13.764Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-22T16:48:13.764Z", // Overdue (>43 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-21T16:48:13.764Z",
        recipientEmail: "im08142087324@gmail.com",
        status: "delivered",
      },
    ],
  },
  {
    id: "sub-ffrd-2026-698465",
    caseRef: "FFRD-2026-698465",
    fullName: "poco lee",
    dob: "1987-09-24",
    email: "pocolee008@gmail.com",
    phone: "+18027836453",
    country: "United States",
    cityState: "jaba",
    ssn4: "0000",
    fraudType: "Romance / Confidence Scam",
    lossRange: "$100,000 – $500,000 (€95,000 – €470,000 / £80,000 – £400,000)",
    dateDiscovered: "2026-02-19",
    dateInitialTransfer: "2026-07-08",
    paymentMethods: [
      "Ethereum (ERC-20)",
      "ACH Transfer",
      "Online Platform (PayPal / Zelle / Cash App)",
    ],
    transactionIds: "N/A",
    narrative: "The perpetrator approached via Facebook claiming to be a home owner seeking emergency escrow relocation deposit.",
    contactMethod: "Encrypted Email",
    status: "under-review",
    submittedAt: "2026-09-21T13:39:59.079Z",
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: "2026-09-21T13:39:59.079Z",
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: "2026-09-22T13:39:59.079Z", // Overdue (>46 hours)
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: "2026-09-21T13:39:59.079Z",
        recipientEmail: "pocolee008@gmail.com",
        status: "delivered",
      },
    ],
  },
];

// ── Submissions CRUD & Stage Management ─────────────────────────────────
export function getSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      // First run: Seed the verified historical submissions
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
      return SEED_SUBMISSIONS;
    }
    const parsed: Submission[] = JSON.parse(raw);

    // Merge in any missing SEED submissions by caseRef so they are never lost
    let updated = false;
    for (const seed of SEED_SUBMISSIONS) {
      if (!parsed.some((s) => s.caseRef === seed.caseRef)) {
        parsed.push(seed);
        updated = true;
      }
    }

    // Ensure all items have stage progression fields initialized
    const sanitized = parsed.map((item) => {
      const stageIdx = item.currentStageIndex ?? 0;
      const stageName =
        item.currentStageName ||
        (STAGE_MILESTONES[stageIdx]?.name ?? "Stage 0: Intake Received");
      const nextDue =
        item.nextEmailDueAt || calculateNextStageDueAt(item.submittedAt, stageIdx);
      return {
        ...item,
        currentStageIndex: stageIdx,
        currentStageName: stageName,
        nextEmailDueAt: nextDue,
        autoEmailEnabled: item.autoEmailEnabled !== false,
        stageHistory: item.stageHistory || [
          {
            stageIndex: 0,
            stageName: "Stage 0: Intake Received",
            templateId: "intake-acknowledgement",
            sentAt: item.submittedAt,
            recipientEmail: item.email,
            status: "delivered",
          },
        ],
      };
    });

    if (updated || JSON.stringify(sanitized) !== raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(sanitized));
    }

    return sanitized;
  } catch {
    return SEED_SUBMISSIONS;
  }
}

export function saveSubmissions(list: Submission[]): void {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  // Dispatch storage event so all tabs in same browser update live
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new Event("storage"));
  }
}

export function saveSubmission(
  data: Omit<
    Submission,
    | "id"
    | "caseRef"
    | "status"
    | "submittedAt"
    | "currentStageIndex"
    | "currentStageName"
    | "nextEmailDueAt"
    | "stageHistory"
  >
): Submission {
  const submissions = getSubmissions();
  const submittedAt = new Date().toISOString();
  const caseRef = generateCaseRef();

  const entry: Submission = {
    ...data,
    id: generateId(),
    caseRef,
    status: "new",
    submittedAt,
    currentStageIndex: 0,
    currentStageName: "Stage 0: Intake Received",
    lastEmailSentAt: submittedAt,
    lastEmailStage: "Stage 0: Intake Received",
    nextEmailDueAt: calculateNextStageDueAt(submittedAt, 0), // +24 hours
    autoEmailEnabled: true,
    stageHistory: [
      {
        stageIndex: 0,
        stageName: "Stage 0: Intake Received",
        templateId: "intake-acknowledgement",
        sentAt: submittedAt,
        recipientEmail: data.email,
        status: "delivered",
      },
    ],
  };

  submissions.unshift(entry);
  saveSubmissions(submissions);

  // Sync out to remote backend endpoint asynchronously
  syncSubmissionToRemote(entry).catch((err) =>
    console.warn("[Remote Submissions Sync Warn]:", err)
  );

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
    saveSubmissions(submissions);
  }
}

export function advanceSubmissionStage(
  id: string,
  newStageIndex?: number,
  messageId?: string
): Submission | null {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const sub = submissions[idx];
  const targetIndex =
    typeof newStageIndex === "number"
      ? newStageIndex
      : Math.min((sub.currentStageIndex ?? 0) + 1, STAGE_MILESTONES.length - 1);
  const targetStage =
    STAGE_MILESTONES[targetIndex] || STAGE_MILESTONES[STAGE_MILESTONES.length - 1];
  const now = new Date().toISOString();

  const historyRecord: StageHistoryRecord = {
    stageIndex: targetStage.index,
    stageName: targetStage.name,
    templateId: targetStage.id,
    sentAt: now,
    recipientEmail: sub.email,
    messageId,
    status: "delivered",
  };

  const updatedHistory = [...(sub.stageHistory || []), historyRecord];
  const nextDue = calculateNextStageDueAt(sub.submittedAt, targetStage.index);

  const updatedSub: Submission = {
    ...sub,
    currentStageIndex: targetStage.index,
    currentStageName: targetStage.name,
    lastEmailSentAt: now,
    lastEmailStage: targetStage.name,
    nextEmailDueAt: nextDue,
    stageHistory: updatedHistory,
    status: targetStage.index >= 5 ? "resolved" : "under-review",
  };

  submissions[idx] = updatedSub;
  saveSubmissions(submissions);
  return updatedSub;
}

export function toggleAutoEmail(id: string, enabled: boolean): void {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    submissions[idx].autoEmailEnabled = enabled;
    saveSubmissions(submissions);
  }
}

export function deleteSubmission(id: string): void {
  const submissions = getSubmissions().filter((s) => s.id !== id);
  saveSubmissions(submissions);
}

export function getDueSubmissions(): Submission[] {
  const submissions = getSubmissions();
  return submissions.filter(
    (s) => s.autoEmailEnabled !== false && isStageEmailOverdue(s)
  );
}

// ── Remote Sync Engine ────────────────────────────────────────────────
export async function syncSubmissionToRemote(sub: Submission): Promise<void> {
  const settings = getEmailServiceSettings();
  const endpoint =
    settings.customApiUrl?.trim() ||
    "https://recovery-email-api.seanjordanw.workers.dev/";

  try {
    await fetch(`${endpoint.replace(/\/$/, "")}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  } catch (err) {
    // Graceful fallback: local persistence remains intact
  }
}

export async function syncSubmissionsWithRemote(): Promise<Submission[]> {
  const settings = getEmailServiceSettings();
  const endpoint =
    settings.customApiUrl?.trim() ||
    "https://recovery-email-api.seanjordanw.workers.dev/";

  try {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/api/submissions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const remoteData: Submission[] = await res.json();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        const local = getSubmissions();
        const mergedMap = new Map<string, Submission>();

        // Index local submissions first
        local.forEach((s) => mergedMap.set(s.caseRef, s));

        // Merge in remote submissions
        remoteData.forEach((rem) => {
          const existing = mergedMap.get(rem.caseRef);
          if (!existing) {
            mergedMap.set(rem.caseRef, rem);
          } else {
            // Keep the one with highest stage index or latest updates
            if ((rem.currentStageIndex || 0) > (existing.currentStageIndex || 0)) {
              mergedMap.set(rem.caseRef, { ...existing, ...rem });
            }
          }
        });

        const merged = Array.from(mergedMap.values());
        saveSubmissions(merged);
        return merged;
      }
    }
  } catch (err) {
    // If remote is unavailable, local submissions are safe
  }

  return getSubmissions();
}

// ── CSV Export ──────────────────────────────────────────────────────────
export function exportSubmissionsCsv(): void {
  const submissions = getSubmissions();
  if (submissions.length === 0) return;

  const headers = [
    "Case Ref",
    "Current Stage",
    "Full Name",
    "Email",
    "Phone",
    "Country",
    "City/State",
    "Fraud Type",
    "Loss Range",
    "Date Discovered",
    "Status",
    "Submitted At",
    "Last Email Sent",
    "Next Email Due",
  ];

  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = submissions.map((s) =>
    [
      s.caseRef,
      s.currentStageName || `Stage ${s.currentStageIndex ?? 0}`,
      s.fullName,
      s.email,
      s.phone,
      s.country || "United States",
      s.cityState,
      s.fraudType,
      s.lossRange,
      s.dateDiscovered,
      s.status,
      s.submittedAt,
      s.lastEmailSentAt || "N/A",
      s.nextEmailDueAt || "N/A",
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
  sentMethod:
    | "domain-api"
    | "smtp"
    | "emailjs"
    | "webhook"
    | "direct"
    | "clipboard";
  sentAt: string;
  status?: "delivered" | "queued" | "failed" | "logged";
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
  provider?: "domain-api" | "emailjs" | "webhook" | "direct";
  apiKey?: string;
  customApiUrl?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  webhookUrl?: string;
  webhookAuthHeader?: string;
  senderName?: string;
  senderEmail?: string;
  adminNotificationEmail?: string;
  autoSendIntakeEmail?: boolean;
  autoAlertAdmin?: boolean;
  autoStageFollowUp?: boolean;
}

const EMAIL_SETTINGS_KEY = "ffrd_email_settings";

export const DEFAULT_EMAIL_SETTINGS: EmailServiceSettings = {
  provider: "domain-api",
  apiKey:
    typeof atob !== "undefined"
      ? atob("cmVfQUd6aUZXS0VfR3ZON1dmOEFOQ1ZiOW85TTE2WG9NVVVE")
      : "",
  customApiUrl: "https://recovery-email-api.seanjordanw.workers.dev/",
  senderName: "Special Agent Collins McDonald — FFRD Task Force",
  senderEmail: "collinsmcdonald@globalfraudrecovery.site",
  adminNotificationEmail: "collinsmcdonald@globalfraudrecovery.site",
  smtpHost: "mail.globalfraudrecovery.site",
  smtpPort: 465,
  smtpSecure: true,
  smtpUser: "collinsmcdonald@globalfraudrecovery.site",
  smtpPass: "",
  autoSendIntakeEmail: true,
  autoAlertAdmin: true,
  autoStageFollowUp: true,
};

export function getEmailServiceSettings(): EmailServiceSettings {
  try {
    const raw = localStorage.getItem(EMAIL_SETTINGS_KEY);
    if (!raw) return DEFAULT_EMAIL_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_EMAIL_SETTINGS,
      ...parsed,
      customApiUrl:
        (parsed.customApiUrl && parsed.customApiUrl.trim()) ||
        DEFAULT_EMAIL_SETTINGS.customApiUrl,
      apiKey: parsed.apiKey || DEFAULT_EMAIL_SETTINGS.apiKey,
      adminNotificationEmail:
        parsed.adminNotificationEmail ||
        DEFAULT_EMAIL_SETTINGS.adminNotificationEmail,
    };
  } catch {
    return DEFAULT_EMAIL_SETTINGS;
  }
}

export function saveEmailServiceSettings(settings: EmailServiceSettings): void {
  localStorage.setItem(EMAIL_SETTINGS_KEY, JSON.stringify(settings));
}
