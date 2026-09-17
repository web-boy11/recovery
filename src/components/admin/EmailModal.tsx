import { useState, useMemo, useEffect } from "react";
import type { Submission } from "../../utils/storage";
import {
  EMAIL_TEMPLATES,
  type EmailTemplateData,
} from "../../utils/emailTemplates";
import {
  recordSentEmail,
  getSentEmails,
  deleteSentEmailRecord,
  type SentEmailRecord,
} from "../../utils/storage";
import Seal from "../Seal";

interface EmailModalProps {
  submission: Submission | null;
  submissions?: Submission[];
  onClose: () => void;
}

export default function EmailModal({
  submission,
  submissions = [],
  onClose,
}: EmailModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    EMAIL_TEMPLATES[0].id
  );
  const [viewMode, setViewMode] = useState<"visual" | "html" | "text">("visual");
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Track which submission is selected in the quick-selector
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    submission?.id || (submissions.length > 0 ? submissions[0].id : "custom")
  );

  // Form state initialized from selected submission or clean defaults
  const initialSub = submission || (submissions.length > 0 ? submissions[0] : null);
  const [formData, setFormData] = useState<EmailTemplateData>({
    caseRef: initialSub?.caseRef || "FFRD-2025-784912",
    clientName: initialSub?.fullName || "David Richardson",
    email: initialSub?.email || "",
    phone: initialSub?.phone || "(555) 234-8901",
    fraudType:
      initialSub?.fraudType || "Cryptocurrency / Digital Asset Fraud",
    lossAmount: initialSub?.lossRange || "$145,000.00 USD",
    dateReported:
      initialSub?.dateDiscovered || new Date().toISOString().slice(0, 10),
    agentName: "Special Agent Mc Collins",
    agentBadge: "SA-84920-WDC",
  });

  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(false);
  const [showSendMenu, setShowSendMenu] = useState<boolean>(false);
  const [sentHistory, setSentHistory] = useState<SentEmailRecord[]>([]);

  // Load sent history on mount
  useEffect(() => {
    setSentHistory(getSentEmails());
  }, []);

  // Update form if initial submission prop changes
  useEffect(() => {
    if (submission) {
      setSelectedSubmissionId(submission.id);
      setFormData({
        caseRef: submission.caseRef,
        clientName: submission.fullName,
        email: submission.email || "",
        phone: submission.phone || "",
        fraudType: submission.fraudType || "Cryptocurrency / Digital Asset Fraud",
        lossAmount: submission.lossRange || "$50,000+",
        dateReported: submission.dateDiscovered || new Date().toISOString().slice(0, 10),
        agentName: "Special Agent Mc Collins",
        agentBadge: "SA-84920-WDC",
      });
    }
  }, [submission]);

  // Handle switching claimant from dropdown
  function handleSelectSubmission(subId: string) {
    setSelectedSubmissionId(subId);
    if (subId === "custom") {
      setFormData((prev) => ({
        ...prev,
        clientName: "",
        email: "",
        caseRef: `FFRD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      }));
      return;
    }

    const found = submissions.find((s) => s.id === subId);
    if (found) {
      setFormData({
        caseRef: found.caseRef,
        clientName: found.fullName,
        email: found.email,
        phone: found.phone || "",
        fraudType: found.fraudType || "Cryptocurrency / Digital Asset Fraud",
        lossAmount: found.lossRange || "$50,000+",
        dateReported:
          found.dateDiscovered || new Date().toISOString().slice(0, 10),
        agentName: "Special Agent Mc Collins",
        agentBadge: "SA-84920-WDC",
      });
    }
  }

  const currentTemplate = useMemo(() => {
    return (
      EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      EMAIL_TEMPLATES[0]
    );
  }, [selectedTemplateId]);

  const subjectLine = useMemo(() => {
    return currentTemplate.subject(formData);
  }, [currentTemplate, formData]);

  const emailHtml = useMemo(() => {
    return currentTemplate.generateHtml(formData);
  }, [currentTemplate, formData]);

  const emailText = useMemo(() => {
    return currentTemplate.generateText(formData);
  }, [currentTemplate, formData]);

  // Count history for current case
  const caseHistory = useMemo(() => {
    return sentHistory.filter(
      (h) => h.caseRef === formData.caseRef || h.recipientEmail === formData.email
    );
  }, [sentHistory, formData.caseRef, formData.email]);

  // Validation
  function validateRecipientEmail(): boolean {
    const trimmed = formData.email.trim();
    if (!trimmed) {
      setFeedback({
        type: "error",
        text: "Please enter the claimant's email address in the input field above before sending.",
      });
      setIsDetailsCollapsed(false);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setFeedback({
        type: "error",
        text: `"${trimmed}" does not look like a valid email address. Please check and try again.`,
      });
      setIsDetailsCollapsed(false);
      return false;
    }
    return true;
  }

  // 1. Send via Web Gmail
  function handleSendGmail() {
    if (!validateRecipientEmail()) return;
    const recipient = formData.email.trim();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipient
    )}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(
      emailText
    )}`;
    window.open(url, "_blank");

    recordSentEmail({
      caseRef: formData.caseRef,
      claimantName: formData.clientName,
      recipientEmail: recipient,
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      subject: subjectLine,
      sentMethod: "gmail",
    });
    setSentHistory(getSentEmails());
    setShowSendMenu(false);
    setFeedback({
      type: "success",
      text: `✓ Gmail compose window opened for ${recipient}! Transmission logged in sent history.`,
    });
  }

  // 2. Send via Outlook Web
  function handleSendOutlook() {
    if (!validateRecipientEmail()) return;
    const recipient = formData.email.trim();
    const url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(
      recipient
    )}&subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(
      emailText
    )}`;
    window.open(url, "_blank");

    recordSentEmail({
      caseRef: formData.caseRef,
      claimantName: formData.clientName,
      recipientEmail: recipient,
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      subject: subjectLine,
      sentMethod: "outlook",
    });
    setSentHistory(getSentEmails());
    setShowSendMenu(false);
    setFeedback({
      type: "success",
      text: `✓ Outlook compose window opened for ${recipient}! Transmission logged in sent history.`,
    });
  }

  // 3. Send via Default Mail App (Mailto)
  function handleSendMailto() {
    if (!validateRecipientEmail()) return;
    const recipient = formData.email.trim();
    const mailtoUrl = `mailto:${encodeURIComponent(
      recipient
    )}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(
      emailText
    )}`;
    window.location.href = mailtoUrl;

    recordSentEmail({
      caseRef: formData.caseRef,
      claimantName: formData.clientName,
      recipientEmail: recipient,
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      subject: subjectLine,
      sentMethod: "mailto",
    });
    setSentHistory(getSentEmails());
    setShowSendMenu(false);
    setFeedback({
      type: "success",
      text: `✓ System email client opened for ${recipient}! Transmission logged in sent history.`,
    });
  }

  // 4. Copy Formatted Rich Visual Email (Paste directly into Gmail/Outlook)
  async function handleCopyFormattedVisual() {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const blobHtml = new Blob([emailHtml], { type: "text/html" });
        const blobText = new Blob([emailText], { type: "text/plain" });
        const item = new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(emailHtml);
      }

      recordSentEmail({
        caseRef: formData.caseRef,
        claimantName: formData.clientName,
        recipientEmail: formData.email.trim() || "Manual Clipboard Paste",
        templateId: currentTemplate.id,
        templateName: currentTemplate.name,
        subject: subjectLine,
        sentMethod: "clipboard",
      });
      setSentHistory(getSentEmails());
      setShowSendMenu(false);
      setFeedback({
        type: "success",
        text: "✓ Rich formatted email copied! In Gmail or Outlook, press Ctrl+V to paste the full FBI design with official seal and colors.",
      });
    } catch {
      await navigator.clipboard.writeText(emailHtml);
      setFeedback({
        type: "info",
        text: "✓ HTML code copied to clipboard.",
      });
    }
  }

  // 5. Mark as Sent manually
  function handleMarkAsSent() {
    if (!validateRecipientEmail()) return;
    const recipient = formData.email.trim();
    recordSentEmail({
      caseRef: formData.caseRef,
      claimantName: formData.clientName,
      recipientEmail: recipient,
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      subject: subjectLine,
      sentMethod: "direct",
    });
    setSentHistory(getSentEmails());
    setShowSendMenu(false);
    setFeedback({
      type: "success",
      text: `✓ Case communication recorded as SENT to ${recipient}!`,
    });
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setFeedback({
      type: "info",
      text: `✓ ${label} copied to clipboard.`,
    });
  };

  const handleDownload = () => {
    const blob = new Blob([emailHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.caseRef}-${currentTemplate.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback({
      type: "info",
      text: `✓ Downloaded ${formData.caseRef}-${currentTemplate.id}.html`,
    });
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([emailHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  function handleDeleteHistoryItem(id: string) {
    deleteSentEmailRecord(id);
    setSentHistory(getSentEmails());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[94vh] overflow-hidden flex flex-col border border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header ── */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] flex items-center justify-between shrink-0 border-b-2 border-[#c9a227]">
          <div className="flex items-center gap-3">
            <Seal size={38} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white font-serif tracking-wide">
                  Case Update Communications Center
                </h3>
                <span className="bg-[#c9a227] text-[#0b1f3a] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {EMAIL_TEMPLATES.length} TEMPLATES
                </span>
              </div>
              <p className="text-xs text-white/70">
                Official DOJ/FBI Client Status Notifications &bull; Recipient:{" "}
                <span className="text-[#f5d76e] font-semibold font-mono">
                  {formData.email || "(No email entered yet)"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="bg-white/10 p-0.5 rounded-lg flex text-xs font-semibold">
              <button
                onClick={() => setActiveTab("compose")}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === "compose"
                    ? "bg-[#c9a227] text-[#0b1f3a] shadow-sm font-bold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                ✉️ Compose
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${
                  activeTab === "history"
                    ? "bg-[#c9a227] text-[#0b1f3a] shadow-sm font-bold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                📜 Sent Log
                {sentHistory.length > 0 && (
                  <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                    {sentHistory.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition ml-2"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Feedback Notification Toast ── */}
        {feedback && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-b border-emerald-200"
                : feedback.type === "error"
                ? "bg-red-50 text-red-900 border-b border-red-200"
                : "bg-blue-50 text-blue-900 border-b border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{feedback.type === "success" ? "✓" : feedback.type === "error" ? "⚠️" : "ℹ️"}</span>
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-700 text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Main Tab: COMPOSE ── */}
        {activeTab === "compose" && (
          <>
            {/* ── RECIPIENT & CLAIMANT INPUT PANEL (Prominently Displayed) ── */}
            <div className="bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]">
                    Claimant &amp; Recipient Information
                  </h4>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    (Enter or edit claimant details below)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {submissions.length > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-slate-500 font-semibold hidden md:inline">
                        Load From:
                      </span>
                      <select
                        value={selectedSubmissionId}
                        onChange={(e) => handleSelectSubmission(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                      >
                        <option value="custom">➕ Enter Custom / New Claimant</option>
                        <optgroup label="Website Submissions">
                          {submissions.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.fullName} ({sub.caseRef}) — {sub.email}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
                  >
                    {isDetailsCollapsed ? "▼ Show Details Form" : "▲ Collapse"}
                  </button>
                </div>
              </div>

              {/* Editable Fields Grid */}
              {!isDetailsCollapsed && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Recipient Email Address - Highlighted */}
                  <div className="sm:col-span-2 lg:col-span-2 bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[#0b1f3a] font-bold text-xs flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Claimant Email Address (Recipient) <span className="text-red-500">*</span>
                      </label>
                      {formData.email && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          ✓ Ready to dispatch
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="e.g. claimant.victim@domain.com"
                      required
                      className="w-full px-3 py-2 border-2 border-blue-300 focus:border-[#0b1f3a] rounded bg-white text-slate-900 font-mono text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                    {!formData.email.trim() && (
                      <p className="mt-1 text-[11px] text-red-600 font-medium">
                        ⚠️ Please type the claimant&apos;s email address to send them this update.
                      </p>
                    )}
                  </div>

                  {/* Claimant Name */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Claimant Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      placeholder="e.g. David Richardson"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>

                  {/* Case Ref */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Case Reference #
                    </label>
                    <input
                      type="text"
                      value={formData.caseRef}
                      onChange={(e) =>
                        setFormData({ ...formData, caseRef: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>

                  {/* Loss Amount */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Claim / Loss Amount
                    </label>
                    <input
                      type="text"
                      value={formData.lossAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, lossAmount: e.target.value })
                      }
                      placeholder="e.g. $145,000.00 USD"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>

                  {/* Fraud Classification */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Fraud Classification
                    </label>
                    <input
                      type="text"
                      value={formData.fraudType}
                      onChange={(e) =>
                        setFormData({ ...formData, fraudType: e.target.value })
                      }
                      placeholder="e.g. Cryptocurrency Fraud"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>

                  {/* Special Agent Name */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Investigating Agent
                    </label>
                    <input
                      type="text"
                      value={formData.agentName}
                      onChange={(e) =>
                        setFormData({ ...formData, agentName: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>

                  {/* Special Agent Badge */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      Agent Badge / Credentials
                    </label>
                    <input
                      type="text"
                      value={formData.agentBadge}
                      onChange={(e) =>
                        setFormData({ ...formData, agentBadge: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Subheader / Stage Selector & Mode Bar ── */}
            <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider whitespace-nowrap">
                  Stage Template:
                </span>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full max-w-md bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
                >
                  {EMAIL_TEMPLATES.map((t, i) => (
                    <option key={t.id} value={t.id}>
                      {i + 1}. {t.name} ({t.stage})
                    </option>
                  ))}
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs self-end">
                <button
                  onClick={() => setViewMode("visual")}
                  className={`px-3 py-1 rounded font-medium transition ${
                    viewMode === "visual"
                      ? "bg-[#0b1f3a] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Visual Preview
                </button>
                <button
                  onClick={() => setViewMode("html")}
                  className={`px-3 py-1 rounded font-medium transition ${
                    viewMode === "html"
                      ? "bg-[#0b1f3a] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  HTML Code
                </button>
                <button
                  onClick={() => setViewMode("text")}
                  className={`px-3 py-1 rounded font-medium transition ${
                    viewMode === "text"
                      ? "bg-[#0b1f3a] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Plain Text
                </button>
              </div>
            </div>

            {/* ── Subject & Target Line Banner ── */}
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 shrink-0 flex items-center justify-between gap-3 text-xs">
              <div className="truncate flex items-center gap-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  To:
                </span>
                <span className="font-mono text-blue-800 font-semibold bg-blue-100/60 px-2 py-0.5 rounded truncate">
                  {formData.email ? `${formData.clientName} <${formData.email}>` : "⚠️ (Please enter email above)"}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Subject:
                </span>
                <span className="font-serif text-slate-900 font-semibold truncate">
                  {subjectLine}
                </span>
              </div>
              <button
                onClick={() => handleCopyText(subjectLine, "Subject Line")}
                className="shrink-0 text-blue-700 hover:text-blue-900 font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition"
              >
                Copy Subject
              </button>
            </div>

            {/* ── Content View Area ── */}
            <div className="flex-1 overflow-hidden bg-slate-200/70 p-2 sm:p-4">
              {viewMode === "visual" && (
                <div className="w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border border-slate-300">
                  <iframe
                    title="Email Visual Preview"
                    srcDoc={emailHtml}
                    className="w-full h-full border-none"
                  />
                </div>
              )}

              {viewMode === "html" && (
                <div className="w-full h-full bg-slate-900 rounded-xl p-4 overflow-auto font-mono text-xs text-emerald-400 border border-slate-700">
                  <pre className="whitespace-pre-wrap">{emailHtml}</pre>
                </div>
              )}

              {viewMode === "text" && (
                <div className="w-full h-full bg-white rounded-xl p-5 overflow-auto font-mono text-xs text-slate-800 border border-slate-300 shadow-inner">
                  <pre className="whitespace-pre-wrap">{emailText}</pre>
                </div>
              )}
            </div>

            {/* ── Modal Footer Controls & Send Action Center ── */}
            <div className="px-5 py-3 bg-white border-t border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">
                  Stage {EMAIL_TEMPLATES.findIndex((t) => t.id === currentTemplate.id) + 1} of 7:
                </span>{" "}
                {currentTemplate.description}
                {caseHistory.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    ✓ Sent {caseHistory.length} time{caseHistory.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Secondary tools */}
                <button
                  onClick={handleOpenNewTab}
                  className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Open standalone preview"
                >
                  ↗ Tab
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Download HTML file"
                >
                  ⬇ HTML
                </button>
                <button
                  onClick={() => handleCopyText(emailText, "Plain Text Body")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Copy plain text message"
                >
                  📋 Copy Text
                </button>
                <button
                  onClick={handleCopyFormattedVisual}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1.5"
                  title="Copy formatted email to paste directly into Gmail or Outlook"
                >
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Formatted (Ctrl+V)
                </button>

                {/* Primary SEND Button with Quick Options */}
                <div className="relative">
                  <div className="inline-flex rounded-lg shadow">
                    <button
                      onClick={handleSendGmail}
                      className="px-4 py-2 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold uppercase tracking-wider rounded-l-lg border-r border-[#14325a] flex items-center gap-1.5 transition"
                      title="Open in Gmail compose addressed to claimant"
                    >
                      <span className="text-[#f5d76e]">✉️</span>
                      Send via Gmail
                    </button>
                    <button
                      onClick={() => setShowSendMenu(!showSendMenu)}
                      className="px-2 py-2 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs rounded-r-lg border-l border-white/10 transition"
                      title="More sending methods"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Send Options Dropdown Menu */}
                  {showSendMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 text-xs">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Dispatch To: {formData.email || "(Enter email above)"}
                      </div>

                      <button
                        onClick={handleSendGmail}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-800 font-semibold transition"
                      >
                        <span className="text-red-500 font-bold">G</span> Send via Web Gmail
                      </button>

                      <button
                        onClick={handleSendOutlook}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-800 font-semibold transition"
                      >
                        <span className="text-blue-500 font-bold">O</span> Send via Outlook / Hotmail
                      </button>

                      <button
                        onClick={handleSendMailto}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-800 font-semibold transition"
                      >
                        <span className="text-slate-600 font-bold">✉</span> Send via Default Mail App (Mailto)
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleMarkAsSent}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-lg flex items-center gap-2 text-emerald-800 font-semibold transition"
                      >
                        <span>✓</span> Mark as Sent in Audit Log
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Main Tab: SENT AUDIT LOG ── */}
        {activeTab === "history" && (
          <div className="flex-1 overflow-auto p-5 bg-slate-50">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#0b1f3a] text-white flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base">Sent Communications Audit Log</h4>
                  <p className="text-xs text-slate-300">
                    Record of all official email updates dispatched to victims and claimants
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("compose")}
                  className="px-3 py-1.5 bg-[#c9a227] text-[#0b1f3a] font-bold text-xs rounded-lg shadow hover:bg-[#d6b038] transition"
                >
                  + New Email
                </button>
              </div>

              {sentHistory.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-4xl block mb-2">📭</span>
                  <p className="text-sm font-semibold text-slate-600">No sent emails recorded yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When you dispatch or mark emails as sent, they will appear in this history log.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="px-4 py-3 text-left">Date / Time</th>
                        <th className="px-4 py-3 text-left">Case Ref</th>
                        <th className="px-4 py-3 text-left">Claimant</th>
                        <th className="px-4 py-3 text-left">Recipient Email</th>
                        <th className="px-4 py-3 text-left">Template Dispatched</th>
                        <th className="px-4 py-3 text-left">Method</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sentHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(item.sentAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-[#0b1f3a]">
                            {item.caseRef}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {item.claimantName}
                          </td>
                          <td className="px-4 py-3 font-mono text-blue-700">
                            {item.recipientEmail}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {item.templateName}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              {item.sentMethod}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteHistoryItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                              title="Delete record"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
