/**
 * Cloudflare Worker: Live Email Dispatch for globalfraudrecovery.site
 *
 * Instructions:
 * 1. In Cloudflare Dashboard -> "Workers & Pages" -> "Create application"
 * 2. Choose the "Workers" tab (NOT Pages) -> Click "Create Worker" (Hello World)
 * 3. Click "Deploy" -> then click "Edit code"
 * 4. Paste this entire file and click "Deploy"
 * 5. Copy the generated URL (e.g. https://recovery-email.xxxx.workers.dev)
 * 6. Paste it into your website Admin Settings ("Cloudflare Worker / Custom Endpoint URL")
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Content-Type": "application/json",
    };

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Health Check
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ status: "online", message: "Recovery Email Dispatch Worker is operational" }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Handle POST Email Dispatch via Resend
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const { to, subject, html, text, caseRef } = body;

        if (!to || !subject || (!html && !text)) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing required fields: to, subject, and body (html or text) are required." }),
            { status: 400, headers: corsHeaders }
          );
        }

        const defaultResendKey = typeof atob !== "undefined" ? atob("cmVfQUd6aUZXS0VfR3ZON1dmOEFOQ1ZiOW85TTE2WG9NVVVE") : "";
        const resendApiKey = (env && env.RESEND_API_KEY) || body.apiKey || defaultResendKey;
        const senderEmail = body.senderEmail || body.fromEmail || "collinsmcdonald@globalfraudrecovery.site";
        const senderName = body.senderName || body.fromName || "Special Agent Collins McDonald — FFRD Task Force";
        const formattedFrom = `"${senderName}" <${senderEmail}>`;
        const replyTo = body.replyTo || (senderEmail.includes("noreply") ? "support@globalfraudrecovery.site" : senderEmail);

        // Direct dispatch to Resend API
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: formattedFrom,
            to: [to],
            reply_to: replyTo,
            subject: subject,
            html: html,
            text: text,
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
              message: `✓ Live email delivered to ${to}! (Message ID: ${data.id})`,
              caseRef: caseRef,
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
          JSON.stringify({ success: false, error: err.message || String(err) }),
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

