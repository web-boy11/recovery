// ── Types ──────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "agent";
  text: string;
  timestamp: string;
}

// ── Keys ───────────────────────────────────────────────────────────────
const MESSAGES_KEY = "ffrd_chat_messages";
const MODE_KEY = "ffrd_chat_mode";

// ── Messages ───────────────────────────────────────────────────────────
export function getChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function addChatMessage(
  sender: ChatMessage["sender"],
  text: string
): ChatMessage {
  const messages = getChatMessages();
  const msg: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sender,
    text,
    timestamp: new Date().toISOString(),
  };
  messages.push(msg);
  saveChatMessages(messages);
  return msg;
}

export function clearChatMessages(): void {
  localStorage.removeItem(MESSAGES_KEY);
}

// ── Chat mode ──────────────────────────────────────────────────────────
export function getChatMode(): "bot" | "agent" {
  return (localStorage.getItem(MODE_KEY) as "bot" | "agent") || "bot";
}

export function setChatMode(mode: "bot" | "agent"): void {
  localStorage.setItem(MODE_KEY, mode);
}

// ── Bot responses ──────────────────────────────────────────────────────
const botResponses: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "greetings"],
    response:
      "Welcome to the FBI Fraud & Funds Recovery Division support. I'm an automated assistant here to help. How can I assist you today?",
  },
  {
    keywords: ["status", "case", "check", "update", "progress", "reference"],
    response:
      'To check your case status, please provide your case reference number (format: FFRD-YYYY-XXXXXX). You can also check via our Case Status section on the main page.',
  },
  {
    keywords: ["how long", "time", "timeline", "when", "duration", "days"],
    response:
      "The typical recovery timeline varies by case complexity:\n• Simple wire fraud: 30–60 days\n• Cryptocurrency recovery: 60–90 days\n• International cases: 90–180 days\n\nYour assigned agent will provide case-specific timelines.",
  },
  {
    keywords: ["report", "file", "submit", "form", "complaint"],
    response:
      'You can file a confidential report using our intake form. Scroll down to the "File a Report" section or click the "Report Fraud Now" button in the navigation. All submissions are encrypted.',
  },
  {
    keywords: ["cost", "fee", "charge", "pay", "price", "money"],
    response:
      "The FBI does not charge fees for fraud investigation or recovery services. If anyone contacts you requesting payment to process your case, that itself may be a scam. Please report it immediately.",
  },
  {
    keywords: ["agent", "human", "person", "live", "speak", "talk", "representative"],
    response: "__CONNECT_AGENT__",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    response:
      "You're welcome. If you need further assistance, don't hesitate to ask. Stay safe and vigilant.",
  },
  {
    keywords: ["evidence", "proof", "document", "screenshot"],
    response:
      "Preserve all evidence: screenshots, emails, transaction receipts, chat logs, phone records, and wallet addresses. Do NOT delete anything, even if the scam appears to be over. Store copies in a secure location.",
  },
];

const agentResponses = [
  "I'm reviewing your information now. One moment please...",
  "Thank you for that detail. Let me look into this for you.",
  "I understand your concern. Let me check our systems.",
  "I've noted that information. Is there anything else you'd like to add?",
  "That's very helpful. I'm documenting this for your case file.",
  "I appreciate your patience. I'm coordinating with our forensic team.",
];

export function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  for (const entry of botResponses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }

  return "Thank you for your message. For detailed assistance, I can connect you with a live agent. Just type \"talk to agent\" or use our intake form to file a formal report.";
}

export function getAgentResponse(): string {
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

