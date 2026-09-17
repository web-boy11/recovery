import { useState } from "react";
import { hasConsent, grantConsent } from "../utils/sessionManager";

export default function CookieConsent() {
  const [visible, setVisible] = useState(!hasConsent());

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t-2 border-[#c9a227] bg-[#0b1f3a] px-4 py-4 shadow-2xl">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-6 w-6 shrink-0 text-[#c9a227]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              strokeLinecap="round"
            />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-white">
              Cookie &amp; Session Notice
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              This website uses cookies and local storage to save your session
              progress, including form drafts, scroll position, and chat history.
              This data stays on your device and is not transmitted to any
              server. By accepting, you consent to this data being stored
              locally.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {
              grantConsent();
              setVisible(false);
            }}
            className="rounded-sm bg-[#c9a227] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0b1f3a] shadow transition hover:bg-[#b8911f]"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="rounded-sm border border-white/30 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-white hover:text-white"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

