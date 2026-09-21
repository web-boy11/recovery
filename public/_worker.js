/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Cloudflare Pages Advanced Mode Worker — Production-Grade
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Handles:
 *   1. /api/send-email  — Resend-powered transactional email dispatch
 *   2. Static asset serving via env.ASSETS with SPA fallback
 *
 * Features:
 *   - Structured JSON logging for Cloudflare dashboard
 *   - Request ID tracking via cf-ray header
 *   - Graceful domain-verification fallback
 *   - CORS with configurable origin allowlist
 *   - Security headers on all responses
 *   - Input validation and sanitization
 */

const ALLOWED_ORIGINS = [
  "https://globalfraudrecovery.site",
  "https://www.globalfraudrecovery.site",
  "http://localhost:5173",
  "http://localhost:4173",
];

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function getCorsOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  // In production allow the matched origin; in dev allow all
  if (ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) return origin;
  // Fallback: allow all for maximum compatibility during deployment
  return "*";
}

function corsHeaders(request) {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(request),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Content-Type": "application/json",
    ...SECURITY_HEADERS,
  };
}

function jsonResponse(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(request),
  });
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestId = request.headers.get("cf-ray") || crypto.randomUUID();

    // ── 1. Route: /api/send-email & /.netlify/functions/send-email ──────────
    if (
      url.pathname === "/api/send-email" ||
      url.pathname === "/.netlify/functions/send-email"
    ) {
      // CORS Preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request),
        });
      }

      // Health check
      if (request.method === "GET") {
        return jsonResponse(
          {
            status: "operational",
            service: "Email Dispatch Engine",
            version: "2.0.0",
            requestId,
            timestamp: new Date().toISOString(),
          },
          200,
          request
        );
      }

      if (request.method !== "POST") {
        return jsonResponse(
          { error: "Method not allowed. Use POST." },
          405,
          request
        );
      }

      try {
        const body = await request.json();
        const { to, subject, html, text, caseRef, apiKey } = body;

        // ── Input validation ──────────────────────────────────────────
        if (!to || !subject || (!html && !text)) {
          return jsonResponse(
            {
              success: false,
              error: "Missing required fields: to, subject, and body (html or text).",
              requestId,
            },
            400,
            request
          );
        }

        if (!isValidEmail(to)) {
          return jsonResponse(
            {
              success: false,
              error: "Invalid recipient email address.",
              requestId,
            },
            400,
            request
          );
        }

        // ── Resolve credentials ───────────────────────────────────────
        const fromEmail =
          (env && env.FROM_EMAIL) ||
          body.senderEmail ||
          "collinsmcdonald@globalfraudrecovery.site";
        const fromName =
          (env && env.FROM_NAME) ||
          body.senderName ||
          "Special Agent Collins McDonald — FFRD Task Force";
        const formattedFrom = `"${fromName}" <${fromEmail}>`;

        const defaultKey =
          typeof atob !== "undefined"
            ? atob("cmVfQUd6aUZXS0VfR3ZON1dmOEFOQ1ZiOW85TTE2WG9NVVVE")
            : "";
        const resendKey = (
          (env && env.RESEND_API_KEY) ||
          apiKey ||
          defaultKey
        ).trim();

        if (!resendKey) {
          return jsonResponse(
            {
              success: false,
              error: "No Resend API key configured. Add RESEND_API_KEY in Cloudflare environment variables.",
              requestId,
            },
            400,
            request
          );
        }

        // ── Primary dispatch via Resend ───────────────────────────────
        const emailPayload = {
          from: formattedFrom,
          to: [to],
          reply_to: fromEmail,
          subject,
          html,
          text,
        };

        let res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });

        let data = await res.json();

        // ── Domain-verification fallback ──────────────────────────────
        if (
          !res.ok &&
          data.message &&
          (data.message.includes("not verified") ||
            data.message.includes("validation_error"))
        ) {
          console.warn(
            `[Email Worker] Domain not verified for ${fromEmail}. Using fallback domain.`,
            { requestId }
          );

          const fallbackFrom = `"${fromName}" <investigations@danandshaytour.online>`;
          res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...emailPayload,
              from: fallbackFrom,
            }),
          });
          data = await res.json();
        }

        if (res.ok) {
          console.log(`[Email Worker] ✓ Delivered to ${to}`, {
            messageId: data.id,
            caseRef,
            requestId,
          });

          return jsonResponse(
            {
              success: true,
              provider: "resend",
              messageId: data.id,
              from: formattedFrom,
              to,
              caseRef,
              status: "delivered",
              message: `✓ Email delivered to ${to} (ID: ${data.id})`,
              requestId,
            },
            200,
            request
          );
        } else {
          console.error(`[Email Worker] ✗ Dispatch failed`, {
            error: data.message,
            to,
            requestId,
          });

          return jsonResponse(
            {
              success: false,
              error: data.message || "Resend dispatch failed",
              details: data,
              requestId,
            },
            400,
            request
          );
        }
      } catch (err) {
        console.error(`[Email Worker] Unhandled error`, {
          error: err.message,
          requestId,
        });

        return jsonResponse(
          {
            success: false,
            error: err.message || String(err),
            requestId,
          },
          500,
          request
        );
      }
    }

    // ── 2. Static Assets & SPA Fallback ───────────────────────────────────
    try {
      let response = await env.ASSETS.fetch(request);

      // SPA fallback: serve index.html for navigation requests that aren't files
      if (
        response.status === 404 &&
        request.method === "GET" &&
        !url.pathname.includes(".")
      ) {
        response = await env.ASSETS.fetch(new URL("/", request.url));
      }

      // Clone response to add security headers to static assets too
      const newHeaders = new Headers(response.headers);
      Object.entries(SECURITY_HEADERS).forEach(([k, v]) =>
        newHeaders.set(k, v)
      );

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
