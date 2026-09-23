/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Cloudflare Pages Advanced Mode Worker — Production-Grade
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Handles:
 *   1. /api/send-email  — Resend-powered transactional email dispatch
 *   2. /api/submissions — Case submission sync across devices
 *   3. Static asset serving via env.ASSETS with SPA fallback
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
  if (ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) return origin;
  return "*";
}

function corsHeaders(request) {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(request),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PATCH, DELETE",
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

let inMemorySubmissions = [];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestId = request.headers.get("cf-ray") || crypto.randomUUID();

    // ── 1. Route: /api/submissions ────────────────────────────────────────
    if (url.pathname === "/api/submissions" || url.pathname === "/submissions") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      if (request.method === "GET") {
        try {
          if (env && env.SUBMISSIONS_KV) {
            const raw = await env.SUBMISSIONS_KV.get("submissions");
            const data = raw ? JSON.parse(raw) : [];
            return jsonResponse(data, 200, request);
          }
          return jsonResponse(inMemorySubmissions, 200, request);
        } catch (err) {
          return jsonResponse({ error: err.message }, 500, request);
        }
      }

      if (request.method === "POST") {
        try {
          const submission = await request.json();
          if (!submission || !submission.caseRef) {
            return jsonResponse({ error: "Missing required submission or caseRef." }, 400, request);
          }

          if (env && env.SUBMISSIONS_KV) {
            const raw = await env.SUBMISSIONS_KV.get("submissions");
            let list = raw ? JSON.parse(raw) : [];
            const idx = list.findIndex((s) => s.caseRef === submission.caseRef);
            if (idx >= 0) {
              list[idx] = { ...list[idx], ...submission };
            } else {
              list.unshift(submission);
            }
            await env.SUBMISSIONS_KV.put("submissions", JSON.stringify(list));
          } else {
            const idx = inMemorySubmissions.findIndex((s) => s.caseRef === submission.caseRef);
            if (idx >= 0) {
              inMemorySubmissions[idx] = { ...inMemorySubmissions[idx], ...submission };
            } else {
              inMemorySubmissions.unshift(submission);
            }
          }

          return jsonResponse({ success: true, caseRef: submission.caseRef }, 200, request);
        } catch (err) {
          return jsonResponse({ error: err.message }, 500, request);
        }
      }
    }

    // ── 2. Route: /api/send-email & /.netlify/functions/send-email ──────────
    if (
      url.pathname === "/api/send-email" ||
      url.pathname === "/.netlify/functions/send-email"
    ) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request),
        });
      }

      if (request.method === "GET") {
        return jsonResponse(
          {
            status: "operational",
            service: "Email Dispatch Engine",
            version: "2.1.0",
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

        // Input validation
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

        const fromEmail =
          body.senderEmail ||
          (env && env.FROM_EMAIL) ||
          "collinsmcdonald@globalfraudrecovery.site";
        const fromName =
          body.senderName ||
          (env && env.FROM_NAME) ||
          "Special Agent Collins McDonald — FFRD Task Force";
        const formattedFrom = `"${fromName}" <${fromEmail}>`;
        const replyTo =
          body.replyTo ||
          (fromEmail.includes("noreply")
            ? "support@globalfraudrecovery.site"
            : fromEmail);

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
              error: "No Resend API key configured.",
              requestId,
            },
            400,
            request
          );
        }

        const emailPayload = {
          from: formattedFrom,
          to: [to],
          reply_to: replyTo,
          subject,
          html,
          text,
        };

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });

        const data = await res.json();

        if (res.ok) {
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

    // ── 3. Static Assets & SPA Fallback ───────────────────────────────────
    try {
      let response = await env.ASSETS.fetch(request);

      if (
        response.status === 404 &&
        request.method === "GET" &&
        !url.pathname.includes(".")
      ) {
        response = await env.ASSETS.fetch(new URL("/", request.url));
      }

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
