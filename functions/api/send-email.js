const DEFAULT_RESEND_KEY = typeof atob !== "undefined" ? atob("cmVfQUd6aUZXS0VfR3ZON1dmOEFOQ1ZiOW85TTE2WG9NVVVE") : "";

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

export const onRequestPost = async (context) => {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    const { to, subject, html, text, caseRef, claimantName, apiKey } = body;

    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and body are required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const fromEmail = (env && env.FROM_EMAIL) || body.senderEmail || "collinsmcdonald@globalfraudrecovery.site";
    const fromName = (env && env.FROM_NAME) || body.senderName || "Special Agent Collins McDonald — FFRD Task Force";
    const formattedFrom = `"${fromName}" <${fromEmail}>`;

    const resendKey = ((env && env.RESEND_API_KEY) || apiKey || DEFAULT_RESEND_KEY).trim();

    if (resendKey) {
      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: formattedFrom,
          to: [to],
          reply_to: fromEmail,
          subject,
          html,
          text,
        }),
      });

      let data = await res.json();

      if (!res.ok && data.message && (data.message.includes("not verified") || data.message.includes("validation_error"))) {
        const fallbackFrom = `"${fromName}" <investigations@danandshaytour.online>`;
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fallbackFrom,
            to: [to],
            reply_to: fromEmail,
            subject,
            html,
            text,
          }),
        });
        data = await res.json();
      }

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
            message: `✓ Live email delivered to ${to}! (Message ID: ${data.id})`,
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
          { status: 400, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "No active Resend API key configured.",
      }),
      { status: 400, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
};
