/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Standalone Cloudflare Worker: Email Dispatch
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DEPLOYMENT (for standalone Workers, NOT Pages):
 * 1. Cloudflare Dashboard → "Workers & Pages" → "Create application"
 * 2. Choose "Workers" tab → Click "Create Worker" (Hello World)
 * 3. Click "Deploy" → then click "Edit code"
 * 4. Paste this entire file and click "Deploy"
 * 5. Copy the generated URL (e.g. https://recovery-email.xxxx.workers.dev)
 * 6. Paste it into your website Admin Settings ("Cloudflare Worker / Custom Endpoint URL")
 *
 * Environment Variables (set in Worker Settings → Variables):
 *   RESEND_API_KEY  — Your Resend API key (re_...)
 *   FROM_EMAIL      — Sender email (default: collinsmcdonald@globalfraudrecovery.site)
 *   FROM_NAME       — Sender display name
 *
 * NOTE: If you are using Cloudflare Pages (not standalone Workers), the email
 * API is already handled by /public/_worker.js. This file is only needed if
 * you deploy a SEPARATE worker for email dispatch.
 */

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Content-Type": "application/json",
    };

    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Health Check
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "operational",
          service: "Email Dispatch Worker (Standalone)",
          version: "2.0.0",
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Email Dispatch via POST
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
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: corsHeaders }
    );
  },
};
