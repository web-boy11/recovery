import { useState } from "react";
import { hasConsent, grantConsent } from "../utils/sessionManager";

export default function CookieConsent() {
  const [visible, setVisible] = useState(!hasConsent());

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie & Session Notice"
      className="fixed bottom-5 left-4 sm:left-6 z-[2147483647] w-[calc(100%-32px)] sm:w-auto sm:max-w-md rounded-xl border-2 border-[#c9a227] bg-[#0b1f3a] p-5 text-white shadow-2xl backdrop-blur-md"
      style={{
        boxShadow:
          "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 162, 39, 0.3)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Security / Cookie Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#f5d76e]">
          <svg
            className="h-5 w-5"
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
        </div>

        <div>
          <h4 className="font-serif text-sm font-bold text-white tracking-wide">
            Official Privacy &amp; Session Notice
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
            This portal uses local cookies and browser storage to preserve your
            case intake drafts, scroll position, and chat history. This data
            remains confidential on your device.
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                grantConsent();
                setVisible(false);
              }}
              className="rounded-lg bg-[#c9a227] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0b1f3a] shadow-md transition hover:bg-[#d8b135] active:scale-95"
            >
              Accept &amp; Continue
            </button>
            <button
              onClick={() => setVisible(false)}
              className="rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-white hover:text-white active:scale-95"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
