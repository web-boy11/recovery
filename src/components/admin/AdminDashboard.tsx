import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  exportSubmissionsCsv,
  type Submission,
} from "../../utils/storage";
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

// ── Detail Modal ───────────────────────────────────────────────────────
function DetailModal({
  submission,
  onClose,
  onOpenEmail,
}: {
  submission: Submission;
  onClose: () => void;
  onOpenEmail: (s: Submission) => void;
}) {
  const s = submission;

  const fields: { label: string; value: string }[] = [
    { label: "Case Reference", value: s.caseRef },
    { label: "Full Name", value: s.fullName },
    { label: "Date of Birth", value: s.dob },
    { label: "Email", value: s.email },
    { label: "Phone", value: s.phone },
    { label: "Country", value: s.country || "United States" },
    { label: "City / State", value: s.cityState },
    { label: "SSN (last 4)", value: s.ssn4 ? `••••${s.ssn4}` : "N/A" },
    { label: "Fraud Type", value: s.fraudType },
    { label: "Estimated Loss", value: s.lossRange },
    { label: "Date Discovered", value: s.dateDiscovered },
    { label: "Date of Initial Transfer", value: s.dateInitialTransfer || "N/A" },
    {
      label: "Payment Methods",
      value: (s.paymentMethods ?? []).join(", ") || "N/A",
    },
    { label: "Transaction IDs", value: s.transactionIds || "N/A" },
    { label: "Preferred Contact", value: s.contactMethod },
    { label: "Status", value: STATUS_CONFIG[s.status].label },
    {
      label: "Submitted",
      value: new Date(s.submittedAt).toLocaleString(),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 py-4 bg-[#0b1f3a] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">
              Submission Detail
            </h3>
            <p className="text-xs text-[#c9a227] tracking-wider mt-0.5">
              {s.caseRef}
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
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.label} className={f.label === "Transaction IDs" ? "sm:col-span-2" : ""}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  {f.label}
                </p>
                <p className="text-sm text-slate-800 break-words">{f.value || "—"}</p>
              </div>
            ))}
          </div>

          {/* Narrative */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Narrative / Description
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {s.narrative || "No narrative provided."}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenEmail(s);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-[#c9a227] shadow transition"
          >
            📧 Send Update Email
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
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
  const currentUsername =
    localStorage.getItem("ffrd_admin_user") || "admin";
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
    if (newPassword.length < 5) {
      setError("New password must be at least 5 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    localStorage.setItem("ffrd_admin_user", newUsername.trim());
    localStorage.setItem("ffrd_admin_pass", newPassword);
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#0b1f3a] text-white flex items-center justify-between border-b-2 border-[#c9a227]">
          <div>
            <h3 className="font-serif font-bold text-base">Change Admin Credentials</h3>
            <p className="text-[11px] text-[#c9a227] mt-0.5">Update your secret login access</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
              ✓ Credentials updated successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Enter current password (default: admin123)"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
            />
          </div>

          <div className="border-t border-slate-200 pt-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              New Admin Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 5 characters"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0b1f3a] hover:bg-[#14325a] rounded-lg shadow"
            >
              Save New Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Stats Card ─────────────────────────────────────────────────────────
function StatsCard({
  label,
  count,
  color,
  icon,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-800">{count}</p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
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
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);

  // Load submissions
  const refreshData = useCallback(() => {
    setSubmissions(getSubmissions());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.caseRef.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  // Stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const newCount = submissions.filter((s) => s.status === "new").length;
    const reviewCount = submissions.filter((s) => s.status === "under-review").length;
    const resolvedCount = submissions.filter((s) => s.status === "resolved").length;
    return { total, newCount, reviewCount, resolvedCount };
  }, [submissions]);

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
                  FFRD Admin Dashboard
                </h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                  Federal Fraud &amp; Funds Recovery Division
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
                Change Password
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Total Submissions"
            count={stats.total}
            color="#0b1f3a"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            label="New"
            count={stats.newCount}
            color="#3b82f6"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Under Review"
            count={stats.reviewCount}
            color="#f59e0b"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <StatsCard
            label="Resolved"
            count={stats.resolvedCount}
            color="#10b981"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

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
                placeholder="Search by name, email, or case reference…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/30 focus:border-[#0b1f3a]/40 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEmailSubmission(null);
                  setIsEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-[#0b1f3a] bg-[#c9a227]/20 border border-[#c9a227] hover:bg-[#c9a227]/35 rounded-lg transition"
              >
                <span>📧</span> Client Email Center
              </button>
              <button
                onClick={refreshData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => exportSubmissionsCsv()}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#0b1f3a] hover:bg-[#162d4f] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            /* Empty state */
            <div className="py-16 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-600 mb-1">
                {search ? "No matching submissions" : "No submissions yet"}
              </h3>
              <p className="text-sm text-slate-400">
                {search
                  ? "Try adjusting your search terms."
                  : "When users submit fraud reports, they'll appear here."}
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
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      Fraud Type
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      Loss Range
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => {
                    const cfg = STATUS_CONFIG[s.status];
                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => setSelectedSubmission(s)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-[#0b1f3a]">
                            {s.caseRef}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {s.fullName}
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                          {s.email}
                        </td>
                        <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                          {s.fraudType}
                        </td>
                        <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
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
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
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

                            {/* Send Email */}
                            <button
                              onClick={() => {
                                setEmailSubmission(s);
                                setIsEmailModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Generate case update email"
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

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>
                Showing {filtered.length} of {submissions.length} submission
                {submissions.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase">
                Click any row to view full details
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Click-outside handler for status dropdown */}
      {openStatusDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenStatusDropdown(null)}
        />
      )}

      {/* Detail modal */}
      {selectedSubmission && (
        <DetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onOpenEmail={(s) => {
            setEmailSubmission(s);
            setIsEmailModalOpen(true);
          }}
        />
      )}

      {/* Email Communications Center modal */}
      {isEmailModalOpen && (
        <EmailModal
          submission={emailSubmission}
          submissions={submissions}
          onClose={() => {
            setIsEmailModalOpen(false);
            setEmailSubmission(null);
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
