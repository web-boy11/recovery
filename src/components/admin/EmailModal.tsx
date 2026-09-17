import { useState, useMemo } from "react";
import type { Submission } from "../../utils/storage";
import {
  EMAIL_TEMPLATES,
  type EmailTemplateData,
} from "../../utils/emailTemplates";
import Seal from "../Seal";

interface EmailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export default function EmailModal({ submission, onClose }: EmailModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    EMAIL_TEMPLATES[0].id
  );
  const [viewMode, setViewMode] = useState<"visual" | "html" | "text">("visual");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Form state initialized from selected submission or realistic default
  const [formData, setFormData] = useState<EmailTemplateData>({
    caseRef: submission?.caseRef || "FFRD-2025-784912",
    clientName: submission?.fullName || "David Richardson",
    email: submission?.email || "victim.claimant@example.com",
    phone: submission?.phone || "(555) 234-8901",
    fraudType:
      submission?.fraudType || "Cryptocurrency / Digital Asset Fraud",
    lossAmount: submission?.lossRange || "$145,000.00 USD",
    dateReported: submission?.dateDiscovered || new Date().toISOString().slice(0, 10),
    agentName: "Special Agent Mc Collins",
    agentBadge: "SA-84920-WDC",
  });

  const [showConfig, setShowConfig] = useState(false);

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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([emailHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.caseRef}-${currentTemplate.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([emailHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] overflow-hidden flex flex-col border border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] flex items-center justify-between shrink-0 border-b-2 border-[#c9a227]">
          <div className="flex items-center gap-3">
            <Seal size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white font-serif tracking-wide">
                  Case Update Communications Center
                </h3>
                <span className="bg-[#c9a227] text-[#0b1f3a] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  7 TEMPLATES
                </span>
              </div>
              <p className="text-xs text-white/70">
                Official DOJ/FBI Client Status Notifications &bull; Target:{" "}
                <span className="text-[#f5d76e] font-semibold">
                  {formData.clientName} ({formData.email})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                showConfig
                  ? "bg-[#c9a227] text-[#0b1f3a]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              title="Edit variables"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {showConfig ? "Hide Variables" : "Edit Details"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Optional Variable Config Panel ── */}
        {showConfig && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Case Ref</label>
              <input
                type="text"
                value={formData.caseRef}
                onChange={(e) =>
                  setFormData({ ...formData, caseRef: e.target.value })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Claimant Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Loss Amount</label>
              <input
                type="text"
                value={formData.lossAmount}
                onChange={(e) =>
                  setFormData({ ...formData, lossAmount: e.target.value })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Lead Agent</label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) =>
                  setFormData({ ...formData, agentName: e.target.value })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
          </div>
        )}

        {/* ── Subheader / Template Selector Bar ── */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider whitespace-nowrap">
              Select Stage:
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

          {/* View Mode Switcher */}
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

        {/* ── Subject Line Banner ── */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0 flex items-center justify-between gap-2 text-xs">
          <div className="truncate flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Subject:
            </span>
            <span className="font-mono text-slate-900 font-semibold truncate">
              {subjectLine}
            </span>
          </div>
          <button
            onClick={() => handleCopy(subjectLine, "subject")}
            className="shrink-0 text-blue-700 hover:text-blue-900 font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition"
          >
            {copiedType === "subject" ? "✓ Copied" : "Copy Subject"}
          </button>
        </div>

        {/* ── Content View Area ── */}
        <div className="flex-1 overflow-hidden bg-slate-200/70 p-3 md:p-6">
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
            <div className="w-full h-full bg-white rounded-xl p-6 overflow-auto font-mono text-xs text-slate-800 border border-slate-300 shadow-inner">
              <pre className="whitespace-pre-wrap">{emailText}</pre>
            </div>
          )}
        </div>

        {/* ── Modal Footer Controls ── */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <strong>Template {EMAIL_TEMPLATES.findIndex((t) => t.id === currentTemplate.id) + 1} of 7:</strong>{" "}
            {currentTemplate.description}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewTab}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
              title="Open standalone preview in new tab"
            >
              ↗ Open in Tab
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
              title="Download standalone HTML file"
            >
              ⬇ Download .HTML
            </button>
            <button
              onClick={() => handleCopy(emailText, "text")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
            >
              {copiedType === "text" ? "✓ Text Copied!" : "📋 Copy Plain Text"}
            </button>
            <button
              onClick={() => handleCopy(emailHtml, "html")}
              className="px-4 py-2 bg-[#0b1f3a] hover:bg-[#14325a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copiedType === "html" ? "✓ HTML Copied!" : "Copy Full HTML Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

