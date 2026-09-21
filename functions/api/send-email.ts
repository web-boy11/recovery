interface Env {
  RESEND_API_KEY?: string;
  BREVO_API_KEY?: string;
  FROM_EMAIL?: string;
  FROM_NAME?: string;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body: any = await request.json();
    const { to, subject, html, text, caseRef, claimantName, apiKey } = body;

    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and body are required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const fromEmail = env.FROM_EMAIL || body.senderEmail || "collinsmcdonald@globalfraudrecovery.site";
    const fromName = env.FROM_NAME || body.senderName || "Special Agent Collins McDonald — FFRD Task Force";
    const formattedFrom = `"${fromName}" <${fromEmail}>`;

    const activeApiKey = (apiKey || "").trim();
    const resendKey = (env.RESEND_API_KEY || "").trim() || (activeApiKey.startsWith("re_") ? activeApiKey : undefined);
    const brevoKey = (env.BREVO_API_KEY || "").trim() || (activeApiKey.startsWith("xkeysib-") ? activeApiKey : undefined);
    const genericKey = (!resendKey && !brevoKey && activeApiKey) ? activeApiKey : undefined;

    // ── 1. Resend Dispatch (https://resend.com) ─────────────────────────────
    if (resendKey || (genericKey && genericKey.startsWith("re_"))) {
      const keyToUse = resendKey || genericKey;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${keyToUse}`,
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

      const data: any = await res.json();
      if (res.ok) {
        return new Response(
          JSON.stringify({
            success: true,
            provider: "resend",
            messageId: data.id,
            from: formattedFrom,
            to,
            caseRef,
            status: "delivered",
            message: `✓ Officially dispatched to ${to} from ${fromEmail}!`,
          }),
          { status: 200, headers: corsHeaders }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Resend error: ${data.message || JSON.stringify(data)}`,
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // ── 2. Brevo Dispatch (https://brevo.com) ───────────────────────────────
    if (brevoKey || (genericKey && genericKey.startsWith("xkeysib-"))) {
      const keyToUse = brevoKey || genericKey;
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": keyToUse,
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

      const data: any = await res.json();
      if (res.ok) {
        return new Response(
          JSON.stringify({
            success: true,
            provider: "brevo",
            messageId: data.messageId,
            from: formattedFrom,
            to,
            caseRef,
            status: "delivered",
            message: `✓ Officially dispatched to ${to} from ${fromEmail}!`,
          }),
          { status: 200, headers: corsHeaders }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Brevo error: ${data.message || JSON.stringify(data)}`,
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // ── 3. Generic Bearer Token / Custom Provider ───────────────────────────
    if (genericKey) {
      // Try Resend first with generic key
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${genericKey}`,
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

      const data: any = await res.json();
      if (res.ok) {
        return new Response(
          JSON.stringify({
            success: true,
            provider: "resend",
            messageId: data.id,
            from: formattedFrom,
            to,
            caseRef,
            status: "delivered",
            message: `✓ Officially dispatched to ${to} from ${fromEmail}!`,
          }),
          { status: 200, headers: corsHeaders }
        );
      }
    }

    // ── 4. Fallback Audit Log (Missing API Key) ──────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        provider: "cloudflare-pages",
        simulated: true,
        from: formattedFrom,
        to,
        caseRef,
        status: "logged",
        message: `Cloudflare Pages function received request for ${to}. To deliver live into inboxes, provide your API Key in the Settings tab or Cloudflare Pages Environment variables.`,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
};
