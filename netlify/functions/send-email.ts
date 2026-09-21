import type { Handler, HandlerEvent } from "@netlify/functions";
import nodemailer from "nodemailer";

interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  caseRef?: string;
  claimantName?: string;
  templateId?: string;
  stage?: string;
  senderName?: string;
  senderEmail?: string;
  smtpConfig?: {
    host?: string;
    port?: number;
    secure?: boolean;
    user?: string;
    pass?: string;
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body: SendEmailPayload = JSON.parse(event.body || "{}");
    const { to, subject, html, text, caseRef, claimantName, stage, smtpConfig } = body;

    if (!to || !subject || (!html && !text)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields: to, subject, and body (html or text) are required.",
        }),
      };
    }

    const fromEmail =
      process.env.FROM_EMAIL ||
      body.senderEmail ||
      "collinsmcdonald@globalfraudrecovery.site";
    const fromName =
      process.env.FROM_NAME ||
      body.senderName ||
      "Special Agent Collins McDonald — FFRD Task Force";
    const formattedFrom = `"${fromName}" <${fromEmail}>`;

    // ── 1. Resend API Dispatch (if configured) ──────────────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: formattedFrom,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (resendRes.ok) {
        const resendData = await resendRes.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            provider: "resend",
            messageId: resendData.id,
            from: formattedFrom,
            to,
            caseRef,
            status: "delivered",
          }),
        };
      }
    }

    // ── 2. Brevo API Dispatch (if configured) ───────────────────────────────
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromEmail },
          to: [{ email: to, name: claimantName || to }],
          subject,
          htmlContent: html,
          textContent: text,
        }),
      });

      if (brevoRes.ok) {
        const brevoData = await brevoRes.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            provider: "brevo",
            messageId: brevoData.messageId,
            from: formattedFrom,
            to,
            caseRef,
            status: "delivered",
          }),
        };
      }
    }

    // ── 3. Domain SMTP Dispatch (nodemailer) ────────────────────────────────
    const smtpHost = smtpConfig?.host || process.env.SMTP_HOST;
    const smtpPort = smtpConfig?.port || (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465);
    const smtpUser = smtpConfig?.user || process.env.SMTP_USER;
    const smtpPass = smtpConfig?.pass || process.env.SMTP_PASS;
    const smtpSecure =
      smtpConfig?.secure !== undefined
        ? smtpConfig.secure
        : process.env.SMTP_SECURE === "true" || smtpPort === 465;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: formattedFrom,
        to,
        subject,
        html,
        text,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          provider: "smtp",
          messageId: info.messageId,
          from: formattedFrom,
          to,
          caseRef,
          status: "delivered",
        }),
      };
    }

    // ── 4. Fallback Audit Log (if no external credentials provided yet) ─────
    console.log(`[DOMAIN DISPATCH LOGGED]: From: ${formattedFrom} -> To: ${to} | Ref: ${caseRef || "N/A"} | Subject: ${subject}`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        provider: "domain-engine",
        simulated: true,
        from: formattedFrom,
        to,
        caseRef,
        status: "logged",
        message: `Dispatched from official domain identity (${fromEmail}). To deliver live to inboxes, provide SMTP_HOST/USER/PASS in .env or Settings.`,
      }),
    };
  } catch (err: unknown) {
    console.error("Email dispatch failed:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Failed to dispatch email from domain: ${errorMessage}`,
      }),
    };
  }
};

