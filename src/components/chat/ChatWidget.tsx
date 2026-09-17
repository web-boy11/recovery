import { useState, useEffect, useRef, useCallback } from "react";
import Seal from "../Seal";
import type { ChatMessage } from "../../utils/chatStore";
import {
  getChatMessages,
  addChatMessage,
  getChatMode,
  setChatMode,
  getBotResponse,
  getAgentResponse,
} from "../../utils/chatStore";

// ── Global Chatway Type Declaration ─────────────────────────────────────
declare global {
  interface Window {
    $chatway?: {
      openChatwayWidget: () => void;
      closeChatwayWidget: () => void;
      hideChatwayIcon: () => void;
      showChatwayIcon: () => void;
      isChatwayWidgetOpen: () => boolean;
      sendMessage: (msg: string) => void;
    };
    $chatwayOnLoad?: () => void;
  }
}

const WELCOME_TEXT =
  "Welcome to the FBI Fraud & Funds Recovery Support portal. I am an automated intake assistant connected directly to Special Agent Mc Collins' unit. How may we assist with your case today?";

const QUICK_ACTIONS = [
  "Check Case Status",
  "Report New Fraud",
  "Talk to Live Agent",
];

// ── Typing Indicator ───────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="flex flex-col items-start max-w-[80%]">
        <span className="text-[10px] text-slate-500 ml-1 mb-0.5 font-medium">
          FBI Bot
        </span>
        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full bg-slate-400"
            style={{
              animation: "chatBounce 1.2s ease-in-out infinite",
              animationDelay: "0ms",
            }}
          />
          <span
            className="inline-block w-2 h-2 rounded-full bg-slate-400"
            style={{
              animation: "chatBounce 1.2s ease-in-out infinite",
              animationDelay: "200ms",
            }}
          />
          <span
            className="inline-block w-2 h-2 rounded-full bg-slate-400"
            style={{
              animation: "chatBounce 1.2s ease-in-out infinite",
              animationDelay: "400ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  const isAgent = message.sender === "agent";

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="flex flex-col items-end max-w-[80%]">
          <div
            className="text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm"
            style={{ backgroundColor: "#b22234" }}
          >
            {message.text}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 mr-1">{time}</span>
        </div>
      </div>
    );
  }

  const label = isAgent ? "Special Agent Mc Collins" : "FBI Intake Bot";
  const bgClass = isAgent ? "" : "bg-slate-100";
  const bgStyle = isAgent ? { backgroundColor: "#0b1f3a" } : undefined;
  const textClass = isAgent ? "text-white" : "text-slate-800";

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="flex flex-col items-start max-w-[80%]">
        <div className="flex items-center gap-1.5 ml-1 mb-0.5">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {label}
          </span>
          {isAgent && (
            <span className="bg-[#c9a227] text-[#0b1f3a] text-[9px] font-bold px-1.5 py-0.2 rounded">
              VERIFIED
            </span>
          )}
        </div>
        <div
          className={`${bgClass} ${textClass} rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-line`}
          style={bgStyle}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 ml-1">{time}</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatwayAvailable, setChatwayAvailable] = useState(false);
  const [isChatwayOpen, setIsChatwayOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<"bot" | "agent">("bot");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Sync with Chatway SDK & observe container state ───────────────────
  useEffect(() => {
    const updateChatwayStatus = () => {
      const container = document.querySelector(".chatway--container");
      const hasSdk = typeof window !== "undefined" && Boolean(window.$chatway);
      if (hasSdk || container) {
        setChatwayAvailable(true);
      }
      if (container) {
        const isCurrentlyOpen = container.classList.contains("widget--open");
        setIsChatwayOpen(isCurrentlyOpen);
        if (isCurrentlyOpen) {
          setUnreadCount(0);
        }
      }
    };

    updateChatwayStatus();

    // Check periodically for Chatway script injection
    const interval = setInterval(updateChatwayStatus, 800);

    // Mutation observer for real-time class changes on Chatway
    const observer = new MutationObserver(() => {
      updateChatwayStatus();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // ── Load persisted state on mount ────────────────────────────────────
  useEffect(() => {
    const stored = getChatMessages();
    const storedMode = getChatMode();
    setMode(storedMode);

    if (stored.length === 0) {
      const welcomeMsg = addChatMessage("bot", WELCOME_TEXT);
      setMessages([welcomeMsg]);
    } else {
      setMessages(stored);
      setShowQuickActions(false);
    }
  }, []);

  // ── Auto-scroll on new messages ──────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Focus input when panel opens ─────────────────────────────────────
  useEffect(() => {
    if (isOpen && !chatwayAvailable) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
    }
  }, [isOpen, chatwayAvailable]);

  // ── Toggle Widget (Chatway or Internal Fallback) ──────────────────────
  const toggleWidget = useCallback(() => {
    if (window.$chatway && typeof window.$chatway.openChatwayWidget === "function") {
      if (isChatwayOpen) {
        window.$chatway.closeChatwayWidget();
        setIsChatwayOpen(false);
      } else {
        window.$chatway.openChatwayWidget();
        setIsChatwayOpen(true);
      }
    } else {
      // Fallback custom dialog
      setIsOpen((prev) => !prev);
      setUnreadCount(0);
    }
  }, [isChatwayOpen]);

  // ── Close Active Widget ──────────────────────────────────────────────
  const closeWidget = useCallback(() => {
    if (window.$chatway && typeof window.$chatway.closeChatwayWidget === "function") {
      window.$chatway.closeChatwayWidget();
    }
    setIsChatwayOpen(false);
    setIsOpen(false);
  }, []);

  // ── Handle Bot Reply for Fallback ────────────────────────────────────
  const handleBotReply = useCallback((userText: string) => {
    setIsTyping(true);
    const delay = 1000 + Math.random() * 500;

    setTimeout(() => {
      const response = getBotResponse(userText);

      if (response === "__CONNECT_AGENT__") {
        const connectingMsg = addChatMessage(
          "bot",
          "Connecting your session with a sworn live agent from the Mc Collins Unit…"
        );
        setMessages((prev) => [...prev, connectingMsg]);
        setIsTyping(false);

        setTimeout(() => {
          const joinMsg = addChatMessage(
            "agent",
            "Special Agent Mc Collins has joined this encrypted channel. Please provide your Case Reference or describe the fraudulent incident."
          );
          setChatMode("agent");
          setMode("agent");
          setMessages((prev) => [...prev, joinMsg]);
        }, 1800);
      } else {
        const botMsg = addChatMessage("bot", response);
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }
    }, delay);
  }, []);

  // ── Handle Agent Reply for Fallback ──────────────────────────────────
  const handleAgentReply = useCallback(() => {
    setIsTyping(true);
    const delay = 1800 + Math.random() * 800;

    setTimeout(() => {
      const response = getAgentResponse();
      const agentMsg = addChatMessage("agent", response);
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  // ── Send Message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // If Chatway is open and available, send to Chatway chatbot
      if (window.$chatway && typeof window.$chatway.sendMessage === "function") {
        window.$chatway.sendMessage(trimmed);
        return;
      }

      const userMsg = addChatMessage("user", trimmed);
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowQuickActions(false);

      if (mode === "agent") {
        handleAgentReply();
      } else {
        handleBotReply(trimmed);
      }
    },
    [mode, handleBotReply, handleAgentReply]
  );

  // ── Handle Quick Action ──────────────────────────────────────────────
  const handleQuickAction = (action: string) => {
    if (window.$chatway && typeof window.$chatway.openChatwayWidget === "function") {
      window.$chatway.openChatwayWidget();
      if (typeof window.$chatway.sendMessage === "function") {
        window.$chatway.sendMessage(action);
      }
    } else {
      sendMessage(action);
    }
  };

  const isAnyWidgetActive = isChatwayOpen || isOpen;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chatPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.35); }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Official FBI Inscription Header Docked Over Chatway ────────── */}
      {isChatwayOpen && (
        <aside
          aria-label="FBI Fraud Recovery Support Header"
          className="fixed bottom-[calc(min(704px,100%-104px)+92px)] right-3 md:right-5 z-[2147483647] w-[calc(100%-24px)] max-w-[400px] overflow-hidden rounded-t-xl border border-slate-700 bg-gradient-to-r from-[#0b1f3a] via-[#14325a] to-[#0b1f3a] text-white shadow-2xl transition-all"
          style={{ animation: "chatSlideIn 0.25s ease-out" }}
        >
          {/* Top Gold Security Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f5d76e] to-[#c9a227]" />

          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Seal size={38} />
                <div>
                  <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-white">
                    FBI Fraud Recovery Support
                  </h3>
                  <p className="text-[10px] text-white/75">
                    Cybercrime &amp; Asset Recovery · Mc Collins Unit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded bg-[#c9a227]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#f5d76e] border border-[#c9a227]/40">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c9a227] animate-pulse" />
                  LIVE
                </span>
                <button
                  onClick={closeWidget}
                  className="flex h-6 w-6 items-center justify-center rounded text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label="Close Chatway Dialog"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Inscription Sub-banner */}
            <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-2 text-[10px]">
              <span className="text-[#c9a227] font-semibold flex items-center gap-1">
                <svg className="w-3 h-3 text-[#c9a227]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 002 0V7z" clipRule="evenodd" />
                </svg>
                Active Bot &amp; Agent Sync
              </span>
              <span className="text-white/60 tracking-wider">
                TLS 1.3 ENCRYPTED
              </span>
            </div>

            {/* Quick Action Chips connected to Chatbot */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/90 hover:bg-[#c9a227] hover:text-[#0b1f3a] transition-all border border-white/15 hover:border-[#c9a227]"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* ── Fallback Custom Dialog (Shown if Chatway is offline) ───────── */}
      {isOpen && !chatwayAvailable && (
        <aside
          aria-label="FBI Fraud Recovery Support Offline Dialog"
          className="fixed bottom-24 right-3 md:right-5 z-[2147483647] flex flex-col w-[calc(100%-24px)] max-w-[390px] h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl"
          style={{ animation: "chatSlideIn 0.25s ease-out" }}
        >
          {/* Header */}
          <div className="bg-[#0b1f3a] text-white px-4 py-3 shrink-0 border-b border-[#c9a227]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Seal size={36} />
                <div>
                  <h3 className="font-serif text-sm font-bold leading-tight">
                    FBI Fraud Recovery Support
                  </h3>
                  <p className="text-[10px] text-[#c9a227] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Special Agent Mc Collins Unit
                  </p>
                </div>
              </div>
              <button
                onClick={closeWidget}
                className="w-7 h-7 rounded hover:bg-white/15 flex items-center justify-center text-white text-sm"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode banner */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  backgroundColor: mode === "agent" ? "#c9a227" : "#00ff29",
                }}
              />
              {mode === "agent"
                ? "Live Agent: Special Agent Mc Collins"
                : "Automated Intake Bot"}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Encrypted Channel
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-slate-50/50">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            {showQuickActions && messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 my-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-[#0b1f3a] transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Type your inquiry or case details..."
                disabled={isTyping}
                className="flex-1 text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="bg-[#0b1f3a] hover:bg-[#14325a] disabled:opacity-40 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Official FBI Themed Customer Service Launcher Button ───────── */}
      <div className="fixed bottom-5 right-4 md:right-6 z-[2147483646] flex flex-col items-end gap-1.5">
        <button
          onClick={toggleWidget}
          className="group relative flex items-center gap-3 rounded-full border-2 border-[#c9a227] bg-[#0b1f3a] px-4 py-2.5 text-white shadow-2xl transition-all duration-200 hover:scale-[1.03] hover:bg-[#14325a] active:scale-95"
          style={{
            boxShadow:
              "0 10px 25px -3px rgba(11, 31, 58, 0.4), 0 4px 10px -2px rgba(201, 162, 39, 0.3)",
          }}
          aria-label="Toggle FBI Fraud Recovery Support Customer Service"
        >
          {/* Official Seal / Shield */}
          <div className="relative flex shrink-0 items-center justify-center">
            <Seal size={36} />
            <span
              className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1f3a] bg-emerald-400"
              style={{ animation: "chatPulse 2s ease-in-out infinite" }}
            />
          </div>

          {/* Inscription: FBI Fraud Recovery Support */}
          <div className="flex flex-col text-left pr-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xs md:text-sm font-bold tracking-wide text-white">
                FBI Fraud Recovery Support
              </span>
              <span className="hidden sm:inline-block rounded bg-[#c9a227] px-1.5 py-0.2 text-[9px] font-extrabold uppercase text-[#0b1f3a]">
                OFFICIAL
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#f5d76e] tracking-tight">
              {isAnyWidgetActive
                ? "Click to minimize customer service"
                : "Active Live Agent & Chatbot Assistance"}
            </span>
          </div>

          {/* Icon indicator */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-[#c9a227] group-hover:text-[#0b1f3a] transition-colors">
            {isAnyWidgetActive ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            )}
          </div>

          {/* Unread badge */}
          {!isAnyWidgetActive && unreadCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 min-w-[22px] h-[22px] rounded-full bg-[#b22234] text-white text-[11px] font-bold flex items-center justify-center px-1 border-2 border-white shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
