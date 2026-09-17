// ── Cookie helpers ─────────────────────────────────────────────────────
function setCookie(name: string, value: string, days = 30): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// ── Keys ───────────────────────────────────────────────────────────────
const SCROLL_KEY = "ffrd_scroll_pos";
const SECTION_KEY = "ffrd_last_section";
const VISIT_KEY = "ffrd_last_visit";
const CONSENT_KEY = "ffrd_cookie_consent";

// ── Consent ────────────────────────────────────────────────────────────
export function hasConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === "true";
}

export function grantConsent(): void {
  localStorage.setItem(CONSENT_KEY, "true");
}

// ── Scroll position ────────────────────────────────────────────────────
export function saveScrollPosition(): void {
  if (!hasConsent()) return;
  setCookie(SCROLL_KEY, String(Math.round(window.scrollY)));

  // Also save the closest visible section id
  const sections = document.querySelectorAll("section[id]");
  let closest = "";
  let closestDist = Infinity;
  sections.forEach((s) => {
    const rect = s.getBoundingClientRect();
    const dist = Math.abs(rect.top);
    if (dist < closestDist) {
      closestDist = dist;
      closest = s.id;
    }
  });
  if (closest) {
    setCookie(SECTION_KEY, closest);
  }
}

export function restoreScrollPosition(): void {
  if (!hasConsent()) return;

  // Prefer section-based restoration (more reliable across layout changes)
  const section = getCookie(SECTION_KEY);
  if (section) {
    const el = document.getElementById(section);
    if (el) {
      // Small delay to ensure layout is rendered
      setTimeout(() => {
        el.scrollIntoView({ behavior: "auto" });
      }, 100);
      return;
    }
  }

  // Fallback to pixel position
  const pos = getCookie(SCROLL_KEY);
  if (pos) {
    setTimeout(() => {
      window.scrollTo({ top: parseInt(pos, 10), behavior: "auto" });
    }, 100);
  }
}

// ── Last visit tracking ────────────────────────────────────────────────
export function recordVisit(): void {
  if (!hasConsent()) return;
  setCookie(VISIT_KEY, new Date().toISOString());
}

export function getLastVisit(): string | null {
  return getCookie(VISIT_KEY);
}

export function isReturningUser(): boolean {
  return getCookie(VISIT_KEY) !== null;
}

// ── Init / Teardown ────────────────────────────────────────────────────
let scrollTimer: ReturnType<typeof setTimeout> | null = null;

function handleScroll(): void {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(saveScrollPosition, 500);
}

export function initSessionTracking(): () => void {
  if (!hasConsent()) return () => {};

  restoreScrollPosition();
  recordVisit();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("beforeunload", saveScrollPosition);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("beforeunload", saveScrollPosition);
    if (scrollTimer) clearTimeout(scrollTimer);
  };
}

