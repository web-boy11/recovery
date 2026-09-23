/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Standalone Cloudflare Worker: Email Dispatch & Case Submissions Hub
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Handles:
 *   1. /api/send-email  — Official domain email transmission via Resend API
 *   2. /api/submissions — Case records sync and storage across devices
 *
 * Environment Variables (set in Worker Settings → Variables):
 *   RESEND_API_KEY  — Your Resend API key (re_...)
 *   FROM_EMAIL      — Default sender email (default: collinsmcdonald@globalfraudrecovery.site)
 *   FROM_NAME       — Default sender display name
 */

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// In-memory cache for submissions when KV namespace is not bound
let inMemorySubmissions = [];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PATCH, DELETE",
      "Content-Type": "application/json",
    };

    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Health Check
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return new Response(
        JSON.stringify({
          status: "operational",
          service: "Email Dispatch & Case Records Hub (Standalone)",
          version: "2.1.0",
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Submissions API (/api/submissions or /submissions)
    if (url.pathname === "/api/submissions" || url.pathname === "/submissions") {
      // GET: Return all submissions
      if (request.method === "GET") {
        try {
          if (env && env.SUBMISSIONS_KV) {
            const raw = await env.SUBMISSIONS_KV.get("submissions");
            const data = raw ? JSON.parse(raw) : [];
            return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
          }
          return new Response(JSON.stringify(inMemorySubmissions), {
            status: 200,
            headers: corsHeaders,
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: corsHeaders,
          });
        }
      }

      // POST: Add or update a submission
      if (request.method === "POST") {
        try {
          const submission = await request.json();
          if (!submission || !submission.caseRef) {
            return new Response(
              JSON.stringify({ error: "Missing required submission object or caseRef." }),
              { status: 400, headers: corsHeaders }
            );
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

          return new Response(
            JSON.stringify({ success: true, caseRef: submission.caseRef }),
            { status: 200, headers: corsHeaders }
          );
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: corsHeaders,
          });
        }
      }
    }

    // 4. Email Dispatch via POST (/ or /api/send-email)
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const { to, subject, html, text, caseRef } = body;

        if (!to || !subject || (!html && !text)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Missing required fields: to, subject, and body (html or text).",
            }),
            { status: 400, headers: corsHeaders }
          );
        }

        if (!isValidEmail(to)) {
          return new Response(
            JSON.stringify({ success: false, error: "Invalid recipient email address." }),
            { status: 400, headers: corsHeaders }
          );
        }

        const defaultResendKey =
          typeof atob !== "undefined"
            ? atob("cmVfQUd6aUZXS0VfR3ZON1dmOEFOQ1ZiOW85TTE2WG9NVVVE")
            : "";
        const resendApiKey =
          (env && env.RESEND_API_KEY) || body.apiKey || defaultResendKey;
        const senderEmail =
          body.senderEmail ||
          body.fromEmail ||
          (env && env.FROM_EMAIL) ||
          "collinsmcdonald@globalfraudrecovery.site";
        const senderName =
          body.senderName ||
          body.fromName ||
          (env && env.FROM_NAME) ||
          "Special Agent Collins McDonald — FFRD Task Force";
        const formattedFrom = `"${senderName}" <${senderEmail}>`;
        const replyTo =
          body.replyTo ||
          (senderEmail.includes("noreply")
            ? "support@globalfraudrecovery.site"
            : senderEmail);

        // Primary dispatch via Resend
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: formattedFrom,
            to: [to],
            reply_to: replyTo,
            subject,
            html,
            text,
          }),
        });

        const data = await resendResponse.json();

        if (resendResponse.ok) {
          return new Response(
            JSON.stringify({
              success: true,
              provider: "resend",
              messageId: data.id,
              status: "delivered",
              message: `✓ Email delivered to ${to} (ID: ${data.id})`,
              caseRef,
            }),
            { status: 200, headers: corsHeaders }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: data.message || "Resend dispatch failed",
              details: data,
            }),
            { status: resendResponse.status, headers: corsHeaders }
          );
        }
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: err.message || String(err),
          }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers: corsHeaders }
    );
  },
};
