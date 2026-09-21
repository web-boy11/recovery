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
  getEmailServiceSettings,
  saveEmailServiceSettings,
  type SentEmailRecord,
  type EmailServiceSettings,
} from "../../utils/storage";
import {
  sendEmail,
  runTrialAllTemplates,
  TRIAL_TARGET_EMAIL,
  OFFICIAL_DOMAIN_EMAIL,
  OFFICIAL_SENDER_NAME,
  type TrialRunReport,
} from "../../utils/emailService";
import Seal from "../Seal";

interface EmailModalProps {
  submission: Submission | null;
  submissions?: Submission[];
  initialTab?: "compose" | "trial" | "settings" | "history";
  onClose: () => void;
}

export default function EmailModal({
  submission,
  submissions = [],
  initialTab = "compose",
  onClose,
}: EmailModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    EMAIL_TEMPLATES[0].id
  );
  const [viewMode, setViewMode] = useState<"visual" | "html" | "text">("visual");
  const [activeTab, setActiveTab] = useState<"compose" | "trial" | "settings" | "history">(initialTab);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

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
    agentName: "Special Agent Collins McDonald",
    agentBadge: "SA-84920-WDC",
  });

  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(false);
  const [sentHistory, setSentHistory] = useState<SentEmailRecord[]>([]);

  // ── Trial Run State ─────────────────────────────────────────────────────
  const [trialEmail, setTrialEmail] = useState<string>(TRIAL_TARGET_EMAIL);
  const [trialRunning, setTrialRunning] = useState<boolean>(false);
  const [trialProgress, setTrialProgress] = useState<{
    step: number;
    total: number;
    templateName: string;
    status: string;
  } | null>(null);
  const [trialReport, setTrialReport] = useState<TrialRunReport | null>(null);

  // ── Email Service Settings State ────────────────────────────────────────
  const [emailSettings, setEmailSettings] = useState<EmailServiceSettings>(
    getEmailServiceSettings()
  );

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
        agentName: "Special Agent Collins McDonald",
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
        agentName: "Special Agent Collins McDonald",
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

  // 1. Official Website Domain Dispatch
  async function handleDirectApiSend() {
    if (!validateRecipientEmail()) return;
    const recipient = formData.email.trim();
    setIsSending(true);

    try {
      const res = await sendEmail({
        to: recipient,
        subject: subjectLine,
        html: emailHtml,
        text: emailText,
        caseRef: formData.caseRef,
        claimantName: formData.clientName,
        templateId: currentTemplate.id,
        templateName: currentTemplate.name,
        stage: currentTemplate.stage,
      });

      setSentHistory(getSentEmails());
      if (res.simulated) {
        setFeedback({
          type: "error",
          text: `⚠️ NOT DELIVERED TO INBOX: Case was saved to docket, but email was NOT sent to ${recipient} because your SMTP password is missing. Go to the Settings tab, enter your password, and click Save.`,
        });
      } else {
        setFeedback({
          type: "success",
          text: res.message,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: `Failed to dispatch email from domain: ${String(err)}`,
      });
    } finally {
      setIsSending(false);
    }
  }


  // 2. Copy Formatted Rich Visual Email (Paste directly into an email composer)
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
      setFeedback({
        type: "success",
        text: "✓ Rich formatted email copied! Press Ctrl+V in your composer to paste the full design with official seal, header, and typography.",
      });
    } catch {
      await navigator.clipboard.writeText(emailHtml);
      setFeedback({
        type: "info",
        text: "✓ HTML code copied to clipboard.",
      });
    }
  }

  // 6. Mark as Sent manually
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

  // ── Execute Trial Sequence for seanjordanw@gmail.com ───────────────────
  async function handleExecuteTrial() {
    const target = trialEmail.trim();
    if (!target) {
      setFeedback({
        type: "error",
        text: "Please enter a valid target email address for the trial run.",
      });
      return;
    }

    setTrialRunning(true);
    setTrialProgress({
      step: 0,
      total: EMAIL_TEMPLATES.length,
      templateName: "Initializing Trial Run...",
      status: "starting",
    });

    try {
      const report = await runTrialAllTemplates(target, (step, total, name, status) => {
        setTrialProgress({ step, total, templateName: name, status });
      });

      setTrialReport(report);
      setSentHistory(getSentEmails());
      setFeedback({
        type: "success",
        text: `✓ All 7 trial emails successfully executed and logged for ${target}!`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: `Trial dispatch encountered an issue: ${String(err)}`,
      });
    } finally {
      setTrialRunning(false);
    }
  }

  // Dispatch a single stage from the official domain
  async function handleDispatchSingleStage(tplId: string) {
    const target = trialEmail.trim() || TRIAL_TARGET_EMAIL;
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === tplId) || EMAIL_TEMPLATES[0];
    const sampleCase: EmailTemplateData = {
      caseRef: "FFRD-2025-918234",
      clientName: "Sean Jordan",
      email: target,
      phone: "+1 (917) 487-6372",
      fraudType: "Cryptocurrency / Digital Asset Fraud & Foreign Wire Extraction",
      lossAmount: "$185,000.00 USD",
      dateReported: new Date().toISOString().slice(0, 10),
      agentName: "Special Agent Collins McDonald",
      agentBadge: "SA-84920-WDC",
      actionUrl: "https://globalfraudrecovery.site/#report",
    };

    setIsSending(true);
    setFeedback({
      type: "info",
      text: `Dispatching ${tpl.name} to ${target}...`,
    });

    try {
      const res = await sendEmail({
        to: target,
        subject: tpl.subject(sampleCase),
        html: tpl.generateHtml(sampleCase),
        text: tpl.generateText(sampleCase),
        caseRef: sampleCase.caseRef,
        claimantName: sampleCase.clientName,
        templateId: tpl.id,
        templateName: tpl.name,
        stage: tpl.stage,
      });
      setSentHistory(getSentEmails());
      if (res.simulated) {
        setFeedback({
          type: "error",
          text: `⚠️ Stage recorded to docket, but NOT sent to ${target}: Domain SMTP password is missing in Settings.`,
        });
      } else {
        setFeedback({
          type: "success",
          text: `✓ Stage [${tpl.stage}] successfully dispatched from ${OFFICIAL_DOMAIN_EMAIL} to ${target}!`,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: `Failed to dispatch stage: ${String(err)}`,
      });
    } finally {
      setIsSending(false);
    }
  }

  // Test Domain Connection
  async function handleTestDomainConnection() {
    setIsSending(true);
    setFeedback({
      type: "info",
      text: `Testing domain outbound delivery from ${emailSettings.senderEmail || OFFICIAL_DOMAIN_EMAIL}...`,
    });

    try {
      const res = await sendEmail({
        to: emailSettings.adminNotificationEmail || TRIAL_TARGET_EMAIL,
        subject: "Task Force Domain Mail Delivery Verification Test",
        html: `<div style="font-family: sans-serif; padding: 20px; color: #0b1f3a;">
          <h2 style="color: #0b1f3a; border-bottom: 2px solid #c9a227; padding-bottom: 8px;">Domain Dispatch System Online</h2>
          <p>This is an official automated test transmission from <strong>${emailSettings.senderEmail || OFFICIAL_DOMAIN_EMAIL}</strong> to verify that outbound domain email routing is operational.</p>
          <p style="font-size: 12px; color: #64748b;">Dispatched via FFRD Serverless Relay Engine.</p>
        </div>`,
        text: `Domain Dispatch System Online\nThis is an official automated test transmission from ${emailSettings.senderEmail || OFFICIAL_DOMAIN_EMAIL} to verify that outbound domain email routing is operational.`,
        caseRef: "TEST-DIAG-01",
        claimantName: "System Diagnostics",
        templateId: "system-test",
        templateName: "System Diagnostics Test",
        stage: "Diagnostic",
      });

      setSentHistory(getSentEmails());
      if (res.simulated) {
        setFeedback({
          type: "error",
          text: `⚠️ TEST NOT DELIVERED TO INBOX: Password is missing. Please enter your SMTP Password in the field below, then click "Save Dispatch Settings" and test again.`,
        });
      } else {
        setFeedback({
          type: "success",
          text: res.message,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: `Domain connection test error: ${String(err)}`,
      });
    } finally {
      setIsSending(false);
    }
  }


  // Download all 7 HTML files bundle
  function handleDownloadTrialBundle() {
    const target = trialEmail.trim() || TRIAL_TARGET_EMAIL;
    const sampleCase: EmailTemplateData = {
      caseRef: "FFRD-2025-918234",
      clientName: "Sean Jordan",
      email: target,
      phone: "+1 (917) 487-6372",
      fraudType: "Cryptocurrency / Digital Asset Fraud & Foreign Wire Extraction",
      lossAmount: "$185,000.00 USD",
      dateReported: new Date().toISOString().slice(0, 10),
      agentName: "Special Agent Collins McDonald",
      agentBadge: "SA-84920-WDC",
      actionUrl: "https://globalfraudrecovery.site/#report",
    };

    EMAIL_TEMPLATES.forEach((tpl, idx) => {
      setTimeout(() => {
        const html = tpl.generateHtml(sampleCase);
        const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Trial-${idx + 1}-${tpl.id}-${target.replace(/[@.]/g, "_")}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }, idx * 150);
    });

    setFeedback({
      type: "info",
      text: `✓ Triggered download of all 7 trial HTML files for ${target}`,
    });
  }

  // Save Email Settings
  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    saveEmailServiceSettings(emailSettings);
    setFeedback({
      type: "success",
      text: "✓ Email delivery and task force alert settings saved successfully!",
    });
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
                  Case Communications &amp; Email Dispatch Center
                </h3>
                <span className="bg-[#c9a227] text-[#0b1f3a] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {EMAIL_TEMPLATES.length} STAGES
                </span>
              </div>
              <p className="text-xs text-white/70">
                Official Law Enforcement Electronic Relay &bull; Trial Target:{" "}
                <span className="text-[#f5d76e] font-semibold font-mono">
                  {TRIAL_TARGET_EMAIL}
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
                onClick={() => setActiveTab("trial")}
                className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${
                  activeTab === "trial"
                    ? "bg-[#c9a227] text-[#0b1f3a] shadow-sm font-bold"
                    : "text-amber-300 hover:text-white bg-amber-400/20"
                }`}
              >
                🚀 Trial (7 Stages)
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
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 ${
                  activeTab === "settings"
                    ? "bg-[#c9a227] text-[#0b1f3a] shadow-sm font-bold"
                    : "text-white/80 hover:text-white"
                }`}
                title="Delivery Settings"
              >
                ⚙️ Settings
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

        {/* ── TAB 1: COMPOSE ── */}
        {activeTab === "compose" && (
          <>
            {/* Live Delivery Inactive Banner */}
            {!emailSettings.smtpPass && !emailSettings.apiKey && (
              <div className="bg-amber-50 border-b border-amber-300 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>
                    <strong>Live Inbox Delivery Inactive:</strong> Domain email credentials (SMTP password or API key) are not set. Emails are logged locally only.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="px-3 py-1 bg-[#0b1f3a] text-white text-[11px] font-bold uppercase tracking-wider rounded-md hover:bg-[#14325a] transition shrink-0 self-start sm:self-auto shadow-sm"
                >
                  Enter Password in Settings &rarr;
                </button>
              </div>
            )}

            {/* Claimant Info Panel */}
            <div className="bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]">
                    Claimant &amp; Recipient Information
                  </h4>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    (Target Case &amp; Recipient Details)
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
                    {isDetailsCollapsed ? "▼ Show Form" : "▲ Collapse"}
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
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="e.g. claimant.victim@domain.com"
                        required
                        className="flex-1 px-3 py-2 border-2 border-blue-300 focus:border-[#0b1f3a] rounded bg-white text-slate-900 font-mono text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, email: TRIAL_TARGET_EMAIL })}
                        className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shrink-0 transition"
                        title="Set to trial recipient"
                      >
                        Set to {TRIAL_TARGET_EMAIL}
                      </button>
                    </div>
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

            {/* Template Selector Bar */}
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

            {/* Subject Banner */}
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

            {/* Content View Area */}
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

            {/* Modal Footer Controls */}
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
                >
                  📋 Copy Text
                </button>
                <button
                  onClick={handleCopyFormattedVisual}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1.5"
                  title="Copy formatted email to paste directly into your email client"
                >
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Formatted (Ctrl+V)
                </button>

                {/* Mark Sent in Docket Button */}
                <button
                  onClick={handleMarkAsSent}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Mark as sent in case docket audit log without network transmission"
                >
                  ✓ Mark Sent in Docket
                </button>

                {/* Official Website Domain Dispatch Button */}
                <button
                  onClick={handleDirectApiSend}
                  disabled={isSending}
                  className="px-4 py-2 bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] hover:from-[#14325a] hover:to-[#0b1f3a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md border border-[#c9a227] flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50"
                  title="Dispatch official transmission directly from collinsmcdonald@globalfraudrecovery.site"
                >
                  <span className="text-[#f5d76e]">{isSending ? "⏳" : "⚡"}</span>
                  <span>{isSending ? "Dispatching..." : "Dispatch Domain Email"}</span>
                  <span className="text-[10px] text-[#f5d76e] font-mono hidden sm:inline">
                    (@globalfraudrecovery.site)
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── TAB 2: TRIAL RUN (7 STAGES) ── */}
        {activeTab === "trial" && (
          <div className="flex-1 overflow-auto p-5 bg-slate-50 flex flex-col gap-5">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 bg-[#0b1f3a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#c9a227]">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#c9a227]/20 border border-[#c9a227] px-2.5 py-0.5 rounded text-[11px] font-bold text-[#f5d76e] uppercase tracking-wider mb-1">
                    🚀 Live 7-Stage Trial Engine
                  </div>
                  <h4 className="font-serif font-bold text-lg text-white">
                    Execute Trial Sequence &bull; All 7 Case Templates
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Transmits complete investigatory milestones in progression to verify template rendering and delivery.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadTrialBundle}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition"
                    title="Download all 7 HTML files"
                  >
                    ⬇ Download All 7
                  </button>
                </div>
              </div>

              {/* Target Address Card */}
              <div className="p-6 border-b border-slate-200 bg-amber-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Trial Recipient Email Address:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={trialEmail}
                        onChange={(e) => setTrialEmail(e.target.value)}
                        className="flex-1 max-w-md px-3 py-2 text-sm font-mono font-semibold text-[#0b1f3a] bg-white border-2 border-[#c9a227] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]"
                        placeholder="e.g. seanjordanw@gmail.com"
                      />
                      {trialEmail !== TRIAL_TARGET_EMAIL && (
                        <button
                          type="button"
                          onClick={() => setTrialEmail(TRIAL_TARGET_EMAIL)}
                          className="text-xs text-blue-700 underline font-semibold px-2 py-1"
                        >
                          Reset to {TRIAL_TARGET_EMAIL}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Target: <strong className="text-[#0b1f3a]">{trialEmail}</strong>. Each template will be compiled with case docket <code className="bg-slate-200 px-1 rounded text-slate-800">FFRD-2025-918234</code>, claimant <strong>Sean Jordan</strong>, and loss amount <strong>$185,000.00 USD</strong>.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={handleExecuteTrial}
                      disabled={trialRunning}
                      className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition ${
                        trialRunning
                          ? "bg-slate-400 text-white cursor-wait"
                          : "bg-[#0b1f3a] hover:bg-[#14325a] text-white border border-[#c9a227]"
                      }`}
                    >
                      {trialRunning ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Dispatching {trialProgress?.step || 0}/7...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#c9a227]">⚡</span>
                          <span>Start 7-Stage Trial Dispatch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Animated Progress Tracker Bar */}
                {trialProgress && (
                  <div className="mt-4 pt-4 border-t border-amber-200/60">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>
                        Stage {trialProgress.step} of {trialProgress.total}: {trialProgress.templateName}
                      </span>
                      <span className="text-blue-700 font-mono">
                        {Math.round((trialProgress.step / trialProgress.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0b1f3a] via-[#c9a227] to-[#10b981] transition-all duration-300"
                        style={{
                          width: `${(trialProgress.step / trialProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7 Templates Progression Grid */}
              <div className="p-6">
                <h5 className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider mb-4">
                  The 7 Official Case Templates in Progression:
                </h5>

                <div className="space-y-3">
                  {EMAIL_TEMPLATES.map((tpl, idx) => {
                    const stepResult = trialReport?.steps.find((s) => s.step === idx + 1);
                    const isCurrentlyActive = trialProgress?.step === idx + 1;
                    const sampleCase: EmailTemplateData = {
                      caseRef: "FFRD-2025-918234",
                      clientName: "Sean Jordan",
                      email: trialEmail,
                      phone: "+1 (917) 487-6372",
                      fraudType: "Cryptocurrency / Digital Asset Fraud",
                      lossAmount: "$185,000.00 USD",
                      dateReported: new Date().toISOString().slice(0, 10),
                      agentName: "Special Agent Collins McDonald",
                      agentBadge: "SA-84920-WDC",
                    };
                    const subject = tpl.subject(sampleCase);

                    return (
                      <div
                        key={tpl.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          stepResult
                            ? "bg-emerald-50/70 border-emerald-300"
                            : isCurrentlyActive
                            ? "bg-amber-50 border-[#c9a227] shadow"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              stepResult
                                ? "bg-emerald-600 text-white"
                                : isCurrentlyActive
                                ? "bg-[#c9a227] text-[#0b1f3a] animate-bounce"
                                : "bg-slate-100 text-slate-600 border border-slate-300"
                            }`}
                          >
                            {stepResult ? "✓" : idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {tpl.stage}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">
                                {tpl.name}
                              </span>
                            </div>
                            <p className="text-xs font-serif text-[#0b1f3a] font-semibold mt-0.5">
                              {subject}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {tpl.description}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons for individual template */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleDispatchSingleStage(tpl.id)}
                            disabled={isSending}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0b1f3a] text-xs font-bold rounded-lg border border-slate-300 transition flex items-center gap-1 disabled:opacity-50"
                            title="Dispatch this stage directly from official domain"
                          >
                            <span className="text-[#c9a227]">⚡</span> Dispatch
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              setFormData({
                                ...formData,
                                clientName: "Sean Jordan",
                                email: trialEmail,
                                caseRef: "FFRD-2025-918234",
                                lossAmount: "$185,000.00 USD",
                              });
                              setActiveTab("compose");
                            }}
                            className="px-2.5 py-1.5 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold rounded-lg transition"
                          >
                            Preview &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: EMAIL DELIVERY SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="flex-1 overflow-auto p-5 bg-slate-50">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#0b1f3a] text-white flex items-center justify-between border-b-2 border-[#c9a227]">
                <div>
                  <h4 className="font-serif font-bold text-base">
                    Email System &amp; Dispatch Integration Settings
                  </h4>
                  <p className="text-xs text-slate-300">
                    Configure automated law enforcement dispatch, EmailJS, webhooks, and administrative alert routing.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                {/* Active Provider Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Active Delivery Provider
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col gap-1 ${
                        emailSettings.provider === "domain-api" || !emailSettings.provider
                          ? "border-[#0b1f3a] bg-blue-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="provider"
                          value="domain-api"
                          checked={emailSettings.provider === "domain-api" || !emailSettings.provider}
                          onChange={() =>
                            setEmailSettings({ ...emailSettings, provider: "domain-api" })
                          }
                          className="accent-[#0b1f3a]"
                        />
                        <span className="font-bold text-slate-900">Official Website Domain Dispatch</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Recommended
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] pl-5">
                        Dispatches directly from <strong>{OFFICIAL_DOMAIN_EMAIL}</strong> via serverless SMTP/API.
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col gap-1 ${
                        emailSettings.provider === "webhook"
                          ? "border-[#0b1f3a] bg-blue-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="provider"
                          value="webhook"
                          checked={emailSettings.provider === "webhook"}
                          onChange={() =>
                            setEmailSettings({ ...emailSettings, provider: "webhook" })
                          }
                          className="accent-[#0b1f3a]"
                        />
                        <span className="font-bold text-slate-900">Webhook / REST API</span>
                      </div>
                      <span className="text-slate-500 text-[11px] pl-5">
                        Postmark, Resend, Brevo, Zapier or custom serverless endpoint.
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col gap-1 ${
                        emailSettings.provider === "direct"
                          ? "border-[#0b1f3a] bg-blue-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="provider"
                          value="direct"
                          checked={emailSettings.provider === "direct"}
                          onChange={() =>
                            setEmailSettings({ ...emailSettings, provider: "direct" })
                          }
                          className="accent-[#0b1f3a]"
                        />
                        <span className="font-bold text-slate-900">Audit Docket Log Only</span>
                      </div>
                      <span className="text-slate-500 text-[11px] pl-5">
                        Records cases to docket without live email transmission.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Domain Email Credentials Subpanel */}
                {(emailSettings.provider === "domain-api" || !emailSettings.provider) && (
                  <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                          Website Domain Dispatch &amp; SMTP Parameters
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          All outbound emails are sent from your official domain identity: <code className="font-bold text-[#0b1f3a]">{OFFICIAL_DOMAIN_EMAIL}</code>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTestDomainConnection}
                        disabled={isSending}
                        className="px-3 py-1.5 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold rounded-lg border border-[#c9a227] shadow transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <span>{isSending ? "⏳" : "⚡"}</span>
                        <span>{isSending ? "Testing..." : "Test Domain Dispatch"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Official Sender Email (Domain)
                        </label>
                        <input
                          type="email"
                          value={emailSettings.senderEmail || OFFICIAL_DOMAIN_EMAIL}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              senderEmail: e.target.value,
                            })
                          }
                          placeholder={OFFICIAL_DOMAIN_EMAIL}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Official Sender Name / Title
                        </label>
                        <input
                          type="text"
                          value={emailSettings.senderName || OFFICIAL_SENDER_NAME}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              senderName: e.target.value,
                            })
                          }
                          placeholder={OFFICIAL_SENDER_NAME}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          SMTP Mail Host
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpHost || "mail.globalfraudrecovery.site"}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              smtpHost: e.target.value,
                            })
                          }
                          placeholder="mail.globalfraudrecovery.site"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">
                            Port
                          </label>
                          <input
                            type="number"
                            value={emailSettings.smtpPort || 465}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                smtpPort: parseInt(e.target.value, 10) || 465,
                              })
                            }
                            placeholder="465"
                            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-semibold">
                            <input
                              type="checkbox"
                              checked={emailSettings.smtpSecure !== false}
                              onChange={(e) =>
                                setEmailSettings({
                                  ...emailSettings,
                                  smtpSecure: e.target.checked,
                                })
                              }
                              className="accent-[#0b1f3a] w-3.5 h-3.5 rounded"
                            />
                            <span>SSL/TLS (Port 465)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          SMTP Username (Full Email)
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpUser || OFFICIAL_DOMAIN_EMAIL}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              smtpUser: e.target.value,
                            })
                          }
                          placeholder={OFFICIAL_DOMAIN_EMAIL}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={emailSettings.smtpPass || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              smtpPass: e.target.value,
                            })
                          }
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                        <label className="block text-slate-800 font-bold mb-1">
                          OR: Domain API Key (Resend / Brevo / Transactional API)
                        </label>
                        <input
                          type="password"
                          value={emailSettings.apiKey || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              apiKey: e.target.value,
                            })
                          }
                          placeholder="re_xxxxxxxxxxxxxxxxx (Resend API key) or xkeysib-xxxx (Brevo API key)"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Recommended for <strong>Cloudflare Pages</strong>. Enter your Resend (<code>re_...</code>) or Brevo (<code>xkeysib-...</code>) API key here for guaranteed 100% inbox delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* EmailJS Credentials Subpanel */}
                {emailSettings.provider === "emailjs" && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                      EmailJS Configuration Parameters
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Service ID
                        </label>
                        <input
                          type="text"
                          value={emailSettings.serviceId || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              serviceId: e.target.value,
                            })
                          }
                          placeholder="e.g. service_xxxx"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Template ID
                        </label>
                        <input
                          type="text"
                          value={emailSettings.templateId || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              templateId: e.target.value,
                            })
                          }
                          placeholder="e.g. template_xxxx"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Public Key / User ID
                        </label>
                        <input
                          type="text"
                          value={emailSettings.publicKey || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              publicKey: e.target.value,
                            })
                          }
                          placeholder="e.g. user_xxxx"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Webhook Configuration Subpanel */}
                {emailSettings.provider === "webhook" && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                      Webhook / Endpoint Configuration
                    </h5>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          POST Endpoint URL
                        </label>
                        <input
                          type="url"
                          value={emailSettings.webhookUrl || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              webhookUrl: e.target.value,
                            })
                          }
                          placeholder="https://api.yourdomain.com/send-email or https://hooks.zapier.com/..."
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          Authorization Header (Optional)
                        </label>
                        <input
                          type="text"
                          value={emailSettings.webhookAuthHeader || ""}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              webhookAuthHeader: e.target.value,
                            })
                          }
                          placeholder="Bearer your_secret_token"
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin & Automated Dispatch Rules */}
                <div className="border-t border-slate-200 pt-5 space-y-4">
                  <h5 className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                    Administrative Notification Routing
                  </h5>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">
                    <label className="block text-[#0b1f3a] font-bold mb-1">
                      Lead Investigator / Agency Notification Inbox
                    </label>
                    <input
                      type="email"
                      value={emailSettings.adminNotificationEmail || TRIAL_TARGET_EMAIL}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          adminNotificationEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-slate-900 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
                    />
                    <p className="text-[11px] text-amber-800 mt-1">
                      All new victim fraud filings will trigger an immediate priority case dossier forwarded to this address.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailSettings.autoSendIntakeEmail !== false}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            autoSendIntakeEmail: e.target.checked,
                          })
                        }
                        className="accent-[#0b1f3a] w-4 h-4 rounded"
                      />
                      <span className="text-slate-800 font-medium">
                        Automatically dispatch <strong>Stage 0 Case Intake Docket</strong> receipt to claimant upon form submission.
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailSettings.autoAlertAdmin !== false}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            autoAlertAdmin: e.target.checked,
                          })
                        }
                        className="accent-[#0b1f3a] w-4 h-4 rounded"
                      />
                      <span className="text-slate-800 font-medium">
                        Automatically alert Agency Notification Inbox (<strong>{emailSettings.adminNotificationEmail || TRIAL_TARGET_EMAIL}</strong>) on every submission.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
                  >
                    Save Dispatch Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 4: SENT AUDIT LOG ── */}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("trial")}
                    className="px-3 py-1.5 bg-[#c9a227] text-[#0b1f3a] font-bold text-xs rounded-lg shadow hover:bg-[#d6b038] transition"
                  >
                    🚀 Run 7-Stage Trial
                  </button>
                  <button
                    onClick={() => setActiveTab("compose")}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition"
                  >
                    + Compose
                  </button>
                </div>
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
