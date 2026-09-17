import { useState, type FormEvent } from "react";
import Seal from "../Seal";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a brief auth delay for realism
    setTimeout(() => {
      const validUser = localStorage.getItem("ffrd_admin_user") || "admin";
      const validPass = localStorage.getItem("ffrd_admin_pass") || "admin123";

      if (username === validUser && password === validPass) {
        sessionStorage.setItem("ffrd_admin_auth", "true");
        onLogin();
      } else {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1f3a] px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Top gold accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#e0c068] to-[#c9a227]" />

          <div className="p-8">
            {/* Seal and heading */}
            <div className="flex flex-col items-center mb-8">
              <Seal size={90} />
              <h1 className="mt-4 text-xl font-bold text-white tracking-wide font-serif">
                FFRD Admin Portal
              </h1>
              <p className="mt-1 text-sm text-slate-400 tracking-wide">
                Authorized Personnel Only
              </p>
            </div>

            {/* Security notice */}
            <div className="mb-6 p-3 rounded-lg bg-[#b22234]/10 border border-[#b22234]/30">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#b22234] mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-[#b22234]/90 leading-relaxed">
                  This is a restricted federal system. Unauthorized access attempts are
                  logged and may result in criminal prosecution under 18 U.S.C. § 1030.
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/60 focus:border-[#c9a227]/60 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/60 focus:border-[#c9a227]/60 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c9a227] hover:bg-[#b89220] disabled:opacity-60 disabled:cursor-not-allowed text-[#0b1f3a] font-bold text-sm uppercase tracking-wider rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure Login
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="px-8 py-3 bg-white/3 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 tracking-wider">
              ENCRYPTED SESSION • AES-256 • TLS 1.3
            </p>
          </div>
        </div>

        {/* Back to site link */}
        <div className="mt-6 text-center">
          <a
            href="#home"
            className="text-sm text-slate-400 hover:text-[#c9a227] transition-colors"
          >
            ← Return to Public Site
          </a>
        </div>
      </div>
    </div>
  );
}
