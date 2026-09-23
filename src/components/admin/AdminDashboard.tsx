import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  exportSubmissionsCsv,
  advanceSubmissionStage,
  toggleAutoEmail,
  isStageEmailOverdue,
  syncSubmissionsWithRemote,
  STAGE_MILESTONES,
  type Submission,
} from "../../utils/storage";
import {
  sendStageEmail,
  processDueStageEmails,
} from "../../utils/emailService";
import EmailModal from "./EmailModal";

interface AdminDashboardProps {
  onLogout: () => void;
}

// ── Status badge config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  Submission["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  new: {
    label: "New",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  "under-review": {
    label: "Under Review",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
};

const ALL_STATUSES: Submission["status"][] = ["new", "under-review", "resolved"];

// ── Detail Modal with 7-Stage Tracker & Communications Docket ─────────
function DetailModal({
  submission,
  onClose,
  onOpenEmail,
  onAdvanceStage,
}: {
  submission: Submission;
  onClose: () => void;
  onOpenEmail: (s: Submission) => void;
  onAdvanceStage: (s: Submission) => void;
}) {
  const s = submission;
  const currentStageIdx = s.currentStageIndex ?? 0;
  const isOverdue = isStageEmailOverdue(s);
  const nextStage = STAGE_MILESTONES[currentStageIdx + 1];

  const fields: { label: string; value: string }[] = [
    { label: "Case Reference", value: s.caseRef },
    { label: "Full Name", value: s.fullName },
    { label: "Date of Birth", value: s.dob },
    { label: "Email Address", value: s.email },
    { label: "Phone Number", value: s.phone },
    { label: "Country / Location", value: `${s.country || "United States"} / ${s.cityState}` },
    { label: "SSN (last 4)", value: s.ssn4 ? `••••${s.ssn4}` : "N/A" },
    { label: "Fraud Classification", value: s.fraudType },
    { label: "Reported Loss Amount", value: s.lossRange },
    { label: "Date Discovered", value: s.dateDiscovered },
    { label: "Initial Transfer Date", value: s.dateInitialTransfer || "N/A" },
    {
      label: "Payment / Transfer Methods",
      value: (s.paymentMethods ?? []).join(", ") || "N/A",
    },
    { label: "Transaction IDs / Hashes", value: s.transactionIds || "N/A" },
    { label: "Preferred Contact Channel", value: s.contactMethod },
    { label: "Investigation Status", value: STATUS_CONFIG[s.status]?.label || s.status },
    {
      label: "Initial Filing Timestamp",
      value: new Date(s.submittedAt).toLocaleString(),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-700/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 py-4 bg-[#0b1f3a] text-white flex items-center justify-between shrink-0 border-b-2 border-[#c9a227]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#c9a227] text-lg font-serif font-bold">CASE DOCKET:</span>
              <h3 className="text-lg font-mono font-bold text-white tracking-wider">
                {s.caseRef}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Claimant: <strong className="text-white">{s.fullName}</strong> ({s.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* 7-Step Interactive Visual Progression Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]">
                Investigation &amp; Recovery Stage Timeline
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0b1f3a] text-[#f5d76e]">
                Stage {currentStageIdx + 1} of 7: {STAGE_MILESTONES[currentStageIdx]?.label}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {STAGE_MILESTONES.map((milestone) => {
                const isPassed = milestone.index < currentStageIdx;
                const isCurrent = milestone.index === currentStageIdx;
                return (
                  <div key={milestone.id} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-[#0b1f3a] text-[#f5d76e] ring-2 ring-[#c9a227] shadow"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? "✓" : milestone.index + 1}
                    </div>
                    <span
                      className={`text-[9px] mt-1 line-clamp-1 ${
                        isCurrent
                          ? "font-bold text-[#0b1f3a]"
                          : isPassed
                          ? "text-emerald-700 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {milestone.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Next Email Status & Overdue Alert */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Next Scheduled Follow-Up: </span>
                {nextStage ? (
                  <span className="font-bold text-slate-800">
                    {nextStage.name} (
                    {s.nextEmailDueAt
                      ? new Date(s.nextEmailDueAt).toLocaleString()
                      : "Schedule pending"}
                    )
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">✓ Case Final Stage Completed</span>
                )}
              </div>

              {isOverdue && nextStage && (
                <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                  ⚠️ 24h Milestone Overdue — Stage {nextStage.index + 1} Due Now!
                </span>
              )}
            </div>
          </div>

          {/* Core Case Details Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Filing Credentials &amp; Transaction Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              {fields.map((f) => (
                <div key={f.label} className={f.label === "Transaction IDs / Hashes" ? "sm:col-span-2" : ""}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {f.label}
                  </p>
                  <p className="text-xs text-slate-800 font-medium break-words">{f.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Victim Narrative / Incident Description
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {s.narrative || "No narrative provided."}
            </div>
          </div>

          {/* Stage Communication Docket History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Official Email Communications Sent to Claimant
            </h4>
            {s.stageHistory && s.stageHistory.length > 0 ? (
              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden text-xs">
                {s.stageHistory.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-white transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-[#0b1f3a]">{item.stageName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Delivered to: <span className="font-mono text-blue-700">{item.recipientEmail}</span>
                        {item.messageId && (
                          <span className="ml-2 font-mono text-slate-400">ID: {item.messageId}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.sentAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No formal stage updates dispatched yet.</p>
            )}
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {nextStage && (
              <button
                onClick={() => onAdvanceStage(s)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#0b1f3a] to-[#14325a] hover:from-[#14325a] hover:to-[#0b1f3a] text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-[#c9a227] shadow transition"
              >
                <span className="text-[#f5d76e]">⚡</span>
                <span>Dispatch {nextStage.name} Now</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenEmail(s);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition"
            >
              ✉️ Open in Composer
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Change Credentials Modal ───────────────────────────────────────────
function ChangeCredentialsModal({ onClose }: { onClose: () => void }) {
  const currentUsername = localStorage.getItem("ffrd_admin_user") || "admin";
  const [currentPass, setCurrentPass] = useState("");
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validPass = localStorage.getItem("ffrd_admin_pass") || "admin123";

    if (currentPass !== validPass) {
      setError("Current password is incorrect.");
      return;
    }
    if (!newUsername.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    localStorage.setItem("ffrd_admin_user", newUsername.trim());
    if (newPassword) {
      localStorage.setItem("ffrd_admin_pass", newPassword);
    }
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#0b1f3a] flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-serif">
            Admin Security Credentials
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/60 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
              ✓ Credentials updated successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30"
            />
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0b1f3a] text-white text-xs font-bold rounded-lg hover:bg-[#14325a] transition"
            >
              Update Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Stats Card Component ───────────────────────────────────────────────
function StatsCard({
  label,
  count,
  color,
  icon,
  subtitle,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold font-serif text-slate-800">{count}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [emailSubmission, setEmailSubmission] = useState<Submission | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalTab, setEmailModalTab] = useState<"compose" | "trial" | "settings" | "history">("compose");
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);

  // Batch stage email execution state
  const [isBatchSending, setIsBatchSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    caseRef: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Load submissions & remote sync
  const refreshData = useCallback(() => {
    setSubmissions(getSubmissions());
  }, []);

  useEffect(() => {
    refreshData();

    // Trigger background cloud sync to pull filings across browsers
    syncSubmissionsWithRemote().then((synced) => {
      if (synced && synced.length > 0) {
        setSubmissions(synced);
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ffrd_submissions" || !e.key) {
        refreshData();
      }
    };
    window.addEventListener("storage", handleStorage);
    const timer = setInterval(refreshData, 3000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(timer);
    };
  }, [refreshData]);

  // Submissions due for automated stage follow-up
  const dueSubmissions = useMemo(() => {
    return submissions.filter(
      (s) => s.autoEmailEnabled !== false && isStageEmailOverdue(s)
    );
  }, [submissions]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.caseRef.toLowerCase().includes(q) ||
        (s.currentStageName && s.currentStageName.toLowerCase().includes(q))
    );
  }, [submissions, search]);

  // Stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const newCount = submissions.filter((s) => s.status === "new").length;
    const reviewCount = submissions.filter((s) => s.status === "under-review").length;
    const resolvedCount = submissions.filter((s) => s.status === "resolved").length;
    const overdueCount = dueSubmissions.length;
    return { total, newCount, reviewCount, resolvedCount, overdueCount };
  }, [submissions, dueSubmissions]);

  function handleStatusChange(id: string, status: Submission["status"]) {
    updateSubmissionStatus(id, status);
    setOpenStatusDropdown(null);
    refreshData();
  }

  function handleDelete(id: string) {
    deleteSubmission(id);
    setConfirmDeleteId(null);
    refreshData();
  }

  function handleLogout() {
    sessionStorage.removeItem("ffrd_admin_auth");
    onLogout();
  }

  // Quick single-case stage email dispatch
  async function handleQuickSendStage(sub: Submission) {
    const nextStageIdx = (sub.currentStageIndex ?? 0) + 1;
    if (nextStageIdx >= STAGE_MILESTONES.length) return;

    setToastMessage({
      type: "info",
      text: `Dispatching ${STAGE_MILESTONES[nextStageIdx]?.name} to ${sub.email}...`,
    });

    try {
      const res = await sendStageEmail(sub, nextStageIdx);
      refreshData();
      if (res.success && !res.simulated) {
        setToastMessage({
          type: "success",
          text: `✓ ${STAGE_MILESTONES[nextStageIdx]?.name} delivered to ${sub.email}! Case advanced.`,
        });
      } else if (res.simulated) {
        setToastMessage({
          type: "info",
          text: `Stage docketed for ${sub.email} (${res.message})`,
        });
      } else {
        setToastMessage({
          type: "error",
          text: `❌ Stage email dispatch failed: ${res.message}`,
        });
      }
    } catch (err) {
      setToastMessage({
        type: "error",
        text: `Error dispatching stage email: ${String(err)}`,
      });
    }
  }

  // Batch dispatch all overdue stage follow-up emails
  async function handleBatchDispatchDue() {
    if (dueSubmissions.length === 0) return;
    setIsBatchSending(true);
    setToastMessage({
      type: "info",
      text: `Starting automated stage progression for ${dueSubmissions.length} cases...`,
    });

    try {
      const res = await processDueStageEmails((current, total, caseRef) => {
        setBatchProgress({ current, total, caseRef });
      });

      refreshData();
      setToastMessage({
        type: "success",
        text: `✓ Automated follow-up complete: ${res.succeeded} emails delivered, ${res.failed} failed. Cases advanced!`,
      });
    } catch (err) {
      setToastMessage({
        type: "error",
        text: `Batch dispatch encountered an issue: ${String(err)}`,
      });
    } finally {
      setIsBatchSending(false);
      setBatchProgress(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#0b1f3a] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#c9a227] rounded-full" />
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide font-serif">
                  FFRD Case Management &amp; Automated Email Operations
                </h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                  Federal Fraud &amp; Funds Recovery Division &bull; Central Docket
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#home"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </a>
              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition"
                title="Change admin username or password"
              >
                <svg className="w-3.5 h-3.5 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Credentials
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#b22234] hover:bg-[#8b1a2b] rounded-lg transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : toastMessage.type === "error"
              ? "bg-red-600 text-white"
              : "bg-[#0b1f3a] text-white border border-[#c9a227]"
          }`}
        >
          <span>{toastMessage.type === "success" ? "✓" : toastMessage.type === "error" ? "⚠️" : "⚡"}</span>
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            label="Total Case Filings"
            count={stats.total}
            color="#0b1f3a"
            subtitle="Verified Client Records"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            label="Follow-Up Due (+24h)"
            count={stats.overdueCount}
            color="#b22234"
            subtitle="Awaiting Stage Email"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Active Investigations"
            count={stats.reviewCount}
            color="#f59e0b"
            subtitle="Under Forensic Review"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <StatsCard
            label="Resolved / Recovered"
            count={stats.resolvedCount}
            color="#10b981"
            subtitle="Closed Restitutions"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── Top Automated Stage Follow-Up Banner ── */}
        {dueSubmissions.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400 rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-400/30 flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#0b1f3a] text-base">
                    Automated Stage Follow-Up Due ({dueSubmissions.length} Case{dueSubmissions.length > 1 ? "s" : ""})
                  </h3>
                  <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full animate-pulse">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  These individuals filed over 24 hours ago and are waiting for their next official stage email (e.g. <strong>Stage 1: Special Agent Assignment</strong>). Dispatch them in one click to keep your mailing system and claimant records strictly in check.
                </p>
              </div>
            </div>

            <button
              onClick={handleBatchDispatchDue}
              disabled={isBatchSending}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border border-[#c9a227] transition disabled:opacity-50 shrink-0 transform active:scale-95"
            >
              {isBatchSending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    Dispatching {batchProgress?.current || 0}/{batchProgress?.total || dueSubmissions.length}...
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#f5d76e] text-base">🚀</span>
                  <span>Dispatch All {dueSubmissions.length} Due Stage Emails</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Search + actions bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by claimant name, email, or case docket reference…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30 focus:border-[#0b1f3a]/40 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEmailSubmission(null);
                  setEmailModalTab("trial");
                  setIsEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0b1f3a] to-[#14325a] hover:from-[#14325a] hover:to-[#0b1f3a] border border-[#c9a227] rounded-lg shadow-sm transition"
                title="Run 7-stage test sequence"
              >
                <span className="text-[#f5d76e]">🚀</span>
                <span>7-Stage Trial Suite</span>
              </button>
              <button
                onClick={() => {
                  setEmailSubmission(null);
                  setEmailModalTab("compose");
                  setIsEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0b1f3a] bg-[#c9a227]/20 border border-[#c9a227] hover:bg-[#c9a227]/35 rounded-lg transition"
              >
                <span>📧</span> Case Email Center
              </button>
              <button
                onClick={() => {
                  refreshData();
                  syncSubmissionsWithRemote().then((res) => {
                    if (res) setSubmissions(res);
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                title="Sync submissions across all devices"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync &amp; Refresh
              </button>
              <button
                onClick={() => exportSubmissionsCsv()}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-white bg-[#0b1f3a] hover:bg-[#162d4f] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <svg
                className="mx-auto w-12 h-12 text-slate-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-base font-semibold text-slate-600">No submissions found</p>
              <p className="text-xs text-slate-400 mt-1">
                {search ? "Try adjusting your search criteria." : "New victim intake submissions will appear here automatically."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Case Ref
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Claimant Name
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Contact Email
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Current Milestone &amp; Follow-Up
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      Loss Range
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Filing Date
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => {
                    const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.new;
                    const stageIdx = s.currentStageIndex ?? 0;
                    const isOverdue = isStageEmailOverdue(s);
                    const nextStage = STAGE_MILESTONES[stageIdx + 1];

                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => setSelectedSubmission(s)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-[#0b1f3a]">
                            {s.caseRef}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">{s.fullName}</span>
                          <span className="text-[11px] text-slate-500 md:hidden block">{s.email}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs hidden md:table-cell">
                          {s.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0b1f3a]/10 text-[#0b1f3a] w-fit">
                              <span>Stage {stageIdx + 1}/7:</span>
                              <span>{s.currentStageName || STAGE_MILESTONES[stageIdx]?.label}</span>
                            </span>

                            {isOverdue && nextStage && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded w-fit animate-pulse">
                                ⚠️ {nextStage.name} Due (+24h)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium hidden lg:table-cell">
                          {s.lossRange}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
                          {new Date(s.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Fast Next Stage Dispatch Button */}
                            {nextStage && (
                              <button
                                onClick={() => handleQuickSendStage(s)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition flex items-center gap-1 ${
                                  isOverdue
                                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse"
                                    : "bg-slate-100 hover:bg-slate-200 text-[#0b1f3a] border-slate-300"
                                }`}
                                title={`Dispatch ${nextStage.name} to ${s.email}`}
                              >
                                <span>⚡</span>
                                <span className="hidden xl:inline">Send {nextStage.label}</span>
                              </button>
                            )}

                            {/* Status dropdown */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenStatusDropdown(
                                    openStatusDropdown === s.id ? null : s.id
                                  )
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0b1f3a] hover:bg-slate-100 transition"
                                title="Change status"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                              </button>
                              {openStatusDropdown === s.id && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                                  {ALL_STATUSES.map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(s.id, status)}
                                      disabled={s.status === status}
                                      className={`w-full text-left px-3 py-2 text-xs font-medium transition flex items-center gap-2 ${
                                        s.status === status
                                          ? "text-slate-300 cursor-not-allowed"
                                          : "text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].dot}`}
                                      />
                                      {STATUS_CONFIG[status].label}
                                      {s.status === status && (
                                        <span className="ml-auto text-[10px] text-slate-400">
                                          current
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Open Email Center */}
                            <button
                              onClick={() => {
                                setEmailSubmission(s);
                                setIsEmailModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Open case in email center"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </button>

                            {/* Delete */}
                            {confirmDeleteId === s.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(s.id)}
                                  className="px-2 py-1 text-[10px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 text-[10px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(s.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Delete submission"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {selectedSubmission && (
        <DetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onOpenEmail={(s) => {
            setEmailSubmission(s);
            setIsEmailModalOpen(true);
          }}
          onAdvanceStage={(s) => {
            handleQuickSendStage(s);
            setSelectedSubmission(null);
          }}
        />
      )}

      {/* Email Communications Center modal */}
      {isEmailModalOpen && (
        <EmailModal
          submission={emailSubmission}
          submissions={submissions}
          initialTab={emailModalTab}
          onClose={() => {
            setIsEmailModalOpen(false);
            setEmailSubmission(null);
            setEmailModalTab("compose");
            refreshData();
          }}
        />
      )}

      {/* Change Admin Credentials Modal */}
      {isCredentialsModalOpen && (
        <ChangeCredentialsModal
          onClose={() => setIsCredentialsModalOpen(false)}
        />
      )}
    </div>
  );
}
