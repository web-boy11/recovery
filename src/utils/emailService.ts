// ── FBI Fraud & Funds Recovery Division — Domain Email Dispatch & Stage Engine ──────────
import {
  EMAIL_TEMPLATES,
  type EmailTemplateData,
} from "./emailTemplates";
import {
  getEmailServiceSettings,
  recordSentEmail,
  advanceSubmissionStage,
  getDueSubmissions,
  STAGE_MILESTONES,
  type Submission,
  type SentEmailRecord,
} from "./storage";

export interface DispatchEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  caseRef: string;
  claimantName: string;
  templateId: string;
  templateName: string;
  stage?: string;
  senderName?: string;
  senderEmail?: string;
  replyTo?: string;
}

export interface DispatchResult {
  success: boolean;
  method: SentEmailRecord["sentMethod"];
  message: string;
  record: SentEmailRecord;
  simulated?: boolean;
}

export interface TrialStepResult {
  step: number;
  templateId: string;
  templateName: string;
  subject: string;
  to: string;
  success: boolean;
  method: SentEmailRecord["sentMethod"];
  message: string;
  deliveryStatus: string;
  html: string;
  text: string;
}

export interface TrialRunReport {
  targetEmail: string;
  caseRef: string;
  claimantName: string;
  totalTemplates: number;
  successful: number;
  timestamp: string;
  steps: TrialStepResult[];
}

export const TRIAL_TARGET_EMAIL = "collinsmcdonald@globalfraudrecovery.site";
export const OFFICIAL_DOMAIN_EMAIL = "collinsmcdonald@globalfraudrecovery.site";
export const OFFICIAL_SENDER_NAME = "Special Agent Collins McDonald — FFRD Task Force";

/**
 * Core dispatch function.
 * Sends directly from the official website domain via the serverless API (/api/send-email).
 */
export async function sendEmail(
  options: DispatchEmailOptions
): Promise<DispatchResult> {
  const settings = getEmailServiceSettings();
  const provider = settings.provider || "domain-api";

  // 1. Primary: Serverless Website Domain Email Dispatch (/api/send-email)
  if (provider === "domain-api" || !provider) {
    try {
      const endpoints = Array.from(
        new Set(
          [
            settings.customApiUrl ? settings.customApiUrl.trim() : null,
            "https://recovery-email-api.seanjordanw.workers.dev/",
            "/api/send-email",
            "/.netlify/functions/send-email",
          ].filter(Boolean) as string[]
        )
      );
      let response: Response | null = null;
      let lastErr: unknown = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: options.to,
              subject: options.subject,
              html: options.html,
              text: options.text,
              caseRef: options.caseRef,
              claimantName: options.claimantName,
              templateId: options.templateId,
              stage: options.stage,
              senderName: options.senderName || settings.senderName || OFFICIAL_SENDER_NAME,
              senderEmail: options.senderEmail || settings.senderEmail || OFFICIAL_DOMAIN_EMAIL,
              replyTo: options.replyTo || options.senderEmail || OFFICIAL_DOMAIN_EMAIL,
              apiKey: settings.apiKey || undefined,
              smtpConfig: settings.smtpHost
                ? {
                    host: settings.smtpHost,
                    port: settings.smtpPort || 465,
                    secure: settings.smtpSecure !== false,
                    user: settings.smtpUser || OFFICIAL_DOMAIN_EMAIL,
                    pass: settings.smtpPass || "",
                  }
                : undefined,
            }),
          });
          if (response.ok) break;
        } catch (e) {
          lastErr = e;
        }
      }

      if (response) {
        if (response.ok) {
          const data = await response.json();
          const record = recordSentEmail({
            caseRef: options.caseRef,
            claimantName: options.claimantName,
            recipientEmail: options.to,
            templateId: options.templateId,
            templateName: options.templateName,
            subject: options.subject,
            sentMethod: data.provider === "smtp" ? "smtp" : "domain-api",
            status: data.simulated ? "logged" : "delivered",
          });

          return {
            success: true,
            method: data.provider === "smtp" ? "smtp" : "domain-api",
            message: data.message || `✓ Officially dispatched from ${options.senderEmail || OFFICIAL_DOMAIN_EMAIL} to ${options.to}!`,
            record,
            simulated: data.simulated,
          };
        } else {
          const errData = await response.json().catch(() => ({
            error: `Server returned ${response?.status}: ${response?.statusText || "Endpoint error"}`,
          }));
          console.error("[Email Engine Error]:", errData);
          return {
            success: false,
            method: "domain-api",
            message: errData.error || errData.message || `Server dispatch failed (${response.status})`,
            record: recordSentEmail({
              caseRef: options.caseRef,
              claimantName: options.claimantName,
              recipientEmail: options.to,
              templateId: options.templateId,
              templateName: options.templateName,
              subject: options.subject,
              sentMethod: "domain-api",
              status: "failed",
            }),
          };
        }
      }
    } catch (err) {
      console.warn("Domain serverless dispatch error:", err);
      return {
        success: false,
        method: "domain-api",
        message: err instanceof Error ? err.message : String(err),
        record: recordSentEmail({
          caseRef: options.caseRef,
          claimantName: options.claimantName,
          recipientEmail: options.to,
          templateId: options.templateId,
          templateName: options.templateName,
          subject: options.subject,
          sentMethod: "domain-api",
          status: "failed",
        }),
      };
    }
  }

  // 2. EmailJS Service Provider (Optional alternate)
  if (
    provider === "emailjs" &&
    settings.serviceId &&
    settings.templateId &&
    settings.publicKey
  ) {
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: settings.serviceId,
          template_id: settings.templateId,
          user_id: settings.publicKey,
          template_params: {
            to_email: options.to,
            recipient_email: options.to,
            subject: options.subject,
            message_html: options.html,
            message_text: options.text,
            case_ref: options.caseRef,
            claimant_name: options.claimantName,
            agent_name: OFFICIAL_SENDER_NAME,
            sender_name: settings.senderName || OFFICIAL_SENDER_NAME,
            from_email: OFFICIAL_DOMAIN_EMAIL,
          },
        }),
      });

      if (response.ok) {
        const record = recordSentEmail({
          caseRef: options.caseRef,
          claimantName: options.claimantName,
          recipientEmail: options.to,
          templateId: options.templateId,
          templateName: options.templateName,
          subject: options.subject,
          sentMethod: "emailjs",
          status: "delivered",
        });
        return {
          success: true,
          method: "emailjs",
          message: `Dispatched via EmailJS to ${options.to}`,
          record,
        };
      }
    } catch (err) {
      console.warn("EmailJS dispatch failed:", err);
    }
  }

  // 3. Custom Webhook Provider
  if (provider === "webhook" && settings.webhookUrl) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (settings.webhookAuthHeader) {
        headers["Authorization"] = settings.webhookAuthHeader;
      }

      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          from: OFFICIAL_DOMAIN_EMAIL,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          caseRef: options.caseRef,
          claimantName: options.claimantName,
          templateId: options.templateId,
          sentAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const record = recordSentEmail({
          caseRef: options.caseRef,
          claimantName: options.claimantName,
          recipientEmail: options.to,
          templateId: options.templateId,
          templateName: options.templateName,
          subject: options.subject,
          sentMethod: "webhook",
          status: "delivered",
        });
        return {
          success: true,
          method: "webhook",
          message: `Dispatched via Webhook from ${OFFICIAL_DOMAIN_EMAIL} to ${options.to}`,
          record,
        };
      }
    } catch (err) {
      console.warn("Webhook dispatch failed:", err);
    }
  }

  // 4. Default Direct Audit Docket Recording
  const record = recordSentEmail({
    caseRef: options.caseRef,
    claimantName: options.claimantName,
    recipientEmail: options.to,
    templateId: options.templateId,
    templateName: options.templateName,
    subject: options.subject,
    sentMethod: "direct",
    status: "delivered",
  });

  return {
    success: true,
    method: "direct",
    message: `Officially docketed for ${options.to} (${options.caseRef}) from ${OFFICIAL_DOMAIN_EMAIL}`,
    record,
  };
}

/**
 * Sends a specific stage milestone email to a claimant and automatically advances their case stage.
 */
export async function sendStageEmail(
  submission: Submission,
  stageIndex: number,
  options?: {
    senderEmail?: string;
    senderName?: string;
    replyTo?: string;
  }
): Promise<DispatchResult> {
  const tpl =
    EMAIL_TEMPLATES[stageIndex] ||
    EMAIL_TEMPLATES.find((t) => t.id === STAGE_MILESTONES[stageIndex]?.id) ||
    EMAIL_TEMPLATES[0];

  const caseData: EmailTemplateData = {
    caseRef: submission.caseRef,
    clientName: submission.fullName,
    email: submission.email,
    phone: submission.phone,
    fraudType: submission.fraudType || "Cryptocurrency / Financial Fraud",
    lossAmount: submission.lossRange || "Undisclosed",
    dateReported: submission.dateDiscovered || new Date().toISOString().slice(0, 10),
    agentName: "Special Agent Collins McDonald",
    agentBadge: "SA-84920-WDC",
    actionUrl: "https://globalfraudrecovery.site/#report",
  };

  const subject = tpl.subject(caseData);
  const html = tpl.generateHtml(caseData);
  const text = tpl.generateText(caseData);

  const senderEmail =
    options?.senderEmail || "collinsmcdonald@globalfraudrecovery.site";
  const senderName =
    options?.senderName || OFFICIAL_SENDER_NAME;
  const replyTo =
    options?.replyTo || options?.senderEmail || "collinsmcdonald@globalfraudrecovery.site";

  const res = await sendEmail({
    to: submission.email,
    subject,
    html,
    text,
    caseRef: submission.caseRef,
    claimantName: submission.fullName,
    templateId: tpl.id,
    templateName: tpl.name,
    stage: tpl.stage,
    senderEmail,
    senderName,
    replyTo,
  });

  if (res.success && !res.simulated) {
    advanceSubmissionStage(submission.id, stageIndex, res.record?.id);
  }

  return res;
}

/**
 * Checks all active submissions and dispatches overdue stage emails.
 * Applies a 1,000ms delay between dispatches to strictly respect Resend's 2 req/s rate limit.
 */
export async function processDueStageEmails(
  onProgress?: (
    current: number,
    total: number,
    caseRef: string,
    status: string
  ) => void
): Promise<{ processed: number; succeeded: number; failed: number }> {
  const dueList = getDueSubmissions();
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < dueList.length; i++) {
    const sub = dueList[i];
    const nextStageIndex = (sub.currentStageIndex ?? 0) + 1;

    if (nextStageIndex >= EMAIL_TEMPLATES.length) continue;

    if (onProgress) {
      onProgress(i + 1, dueList.length, sub.caseRef, "dispatching");
    }

    try {
      const res = await sendStageEmail(sub, nextStageIndex);
      if (res.success && !res.simulated) {
        succeeded++;
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }

    if (onProgress) {
      onProgress(i + 1, dueList.length, sub.caseRef, "completed");
    }

    // Rate-limiting throttle
    if (i < dueList.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { processed: dueList.length, succeeded, failed };
}

/**
 * Executes a full 7-template trial sequence sent from the website domain.
 * Applies a 1,000ms pause between each template to prevent rate-limit throttling.
 */
export async function runTrialAllTemplates(
  targetEmail: string = TRIAL_TARGET_EMAIL,
  onStepProgress?: (step: number, total: number, templateName: string, status: string) => void
): Promise<TrialRunReport> {
  const trialCaseData: EmailTemplateData = {
    caseRef: "FFRD-2025-918234",
    clientName: "David Richardson",
    email: targetEmail.trim() || TRIAL_TARGET_EMAIL,
    phone: "+1 (917) 487-6372",
    fraudType: "Cryptocurrency / Digital Asset Fraud & Foreign Wire Extraction",
    lossAmount: "$185,000.00 USD",
    dateReported: new Date().toISOString().slice(0, 10),
    agentName: "Special Agent Collins McDonald",
    agentBadge: "SA-84920-WDC",
    actionUrl: "https://globalfraudrecovery.site/#report",
  };

  const steps: TrialStepResult[] = [];
  const total = EMAIL_TEMPLATES.length;

  for (let i = 0; i < total; i++) {
    const tpl = EMAIL_TEMPLATES[i];
    const subject = tpl.subject(trialCaseData);
    const html = tpl.generateHtml(trialCaseData);
    const text = tpl.generateText(trialCaseData);

    if (onStepProgress) {
      onStepProgress(i + 1, total, tpl.name, "dispatching");
    }

    // Throttle 1,000ms to stay within provider limits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await sendEmail({
      to: trialCaseData.email,
      subject,
      html,
      text,
      caseRef: trialCaseData.caseRef,
      claimantName: trialCaseData.clientName,
      templateId: tpl.id,
      templateName: tpl.name,
      stage: tpl.stage,
      senderEmail: OFFICIAL_DOMAIN_EMAIL,
      senderName: OFFICIAL_SENDER_NAME,
      replyTo: OFFICIAL_DOMAIN_EMAIL,
    });

    steps.push({
      step: i + 1,
      templateId: tpl.id,
      templateName: tpl.name,
      subject,
      to: trialCaseData.email,
      success: result.success,
      method: result.method,
      message: result.message,
      deliveryStatus: result.simulated ? "Logged to Docket" : "Dispatched via Domain",
      html,
      text,
    });

    if (onStepProgress) {
      onStepProgress(i + 1, total, tpl.name, "completed");
    }
  }

  return {
    targetEmail: trialCaseData.email,
    caseRef: trialCaseData.caseRef,
    claimantName: trialCaseData.clientName,
    totalTemplates: total,
    successful: steps.filter((s) => s.success).length,
    timestamp: new Date().toISOString(),
    steps,
  };
}

/**
 * Handles automated intake notification:
 * 1. Dispatches Stage 0 (Case Intake & Formal Receipt) to claimant upon submission.
 * 2. Dispatches an urgent case alert to the agency notification inbox.
 */
export async function sendIntakeNotification(
  submission: Submission
): Promise<{ victimSent: boolean; adminAlertSent: boolean }> {
  const settings = getEmailServiceSettings();
  const adminEmail = (settings.adminNotificationEmail || OFFICIAL_DOMAIN_EMAIL).trim();

  let victimSent = false;
  let adminAlertSent = false;

  const caseData: EmailTemplateData = {
    caseRef: submission.caseRef,
    clientName: submission.fullName,
    email: submission.email,
    phone: submission.phone,
    fraudType: submission.fraudType || "Cryptocurrency / Financial Fraud",
    lossAmount: submission.lossRange || "Undisclosed",
    dateReported: submission.dateDiscovered || new Date().toISOString().slice(0, 10),
    agentName: "Special Agent Collins McDonald",
    agentBadge: "SA-84920-WDC",
    actionUrl: "https://globalfraudrecovery.site/#report",
  };

  // 1. Send Stage 0 Intake Receipt & Evidence Directive to the victim
  if (settings.autoSendIntakeEmail && submission.email) {
    const intakeTpl = EMAIL_TEMPLATES[0];
    const victimSubject = intakeTpl.subject(caseData);
    const victimHtml = intakeTpl.generateHtml(caseData);
    const victimText = intakeTpl.generateText(caseData);

    const res = await sendEmail({
      to: submission.email,
      subject: victimSubject,
      html: victimHtml,
      text: victimText,
      caseRef: submission.caseRef,
      claimantName: submission.fullName,
      templateId: intakeTpl.id,
      templateName: intakeTpl.name,
      stage: intakeTpl.stage,
      senderName: "Global Fraud Recovery — Case Intake",
      senderEmail: "noreply@globalfraudrecovery.site",
      replyTo: "support@globalfraudrecovery.site",
    });
    victimSent = res.success;
  }

  // 2. Send Intake Alert to Admin / Task Force Notification Inbox
  if (settings.autoAlertAdmin && adminEmail) {
    const adminSubject = `[PRIORITY INTAKE ALERT] New Case Registered — Ref: ${submission.caseRef} (${submission.fullName})`;
    const adminText = `OFFICIAL PRIORITY ALERT: NEW CASE INTAKE REGISTERED
======================================================
Case Reference: ${submission.caseRef}
Claimant:       ${submission.fullName}
Contact Email:  ${submission.email}
Phone Number:   ${submission.phone}
Country/Region: ${submission.country || "United States"} / ${submission.cityState}
Fraud Category: ${submission.fraudType}
Reported Loss:  ${submission.lossRange}
Date Discovered: ${submission.dateDiscovered}
Initial Transfer: ${submission.dateInitialTransfer || "N/A"}
Payment Methods: ${(submission.paymentMethods ?? []).join(", ") || "N/A"}
TXIDs / Hashes: ${submission.transactionIds || "N/A"}
Preferred Contact: ${submission.contactMethod}

Victim Narrative:
${submission.narrative || "No narrative provided."}
======================================================
Official Dispatch Relay: ${OFFICIAL_DOMAIN_EMAIL}
Lead Investigatory Agent: Special Agent Collins McDonald (SA-84920-WDC)`;

    const adminHtml = `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1f3a; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 2px solid #c9a227;">
    <div style="background: #0b1f3a; padding: 20px; color: #ffffff;">
      <div style="color: #c9a227; font-size: 11px; font-weight: bold; letter-spacing: 1px;">PRIORITY LAW ENFORCEMENT DISPATCH</div>
      <h2 style="margin: 6px 0 0 0; font-family: Georgia, serif; font-size: 20px;">New Victim Intake Docket Registered</h2>
      <div style="color: #cbd5e1; font-size: 12px; margin-top: 4px;">Task Force Case Ref: <strong>${submission.caseRef}</strong></div>
    </div>
    <div style="padding: 24px; font-size: 13px; line-height: 1.6;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 35%;">Claimant Name:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0b1f3a;">${submission.fullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Claimant Email:</td>
          <td style="padding: 8px 0; font-family: monospace; color: #1d4ed8;">${submission.email}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;">${submission.phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Fraud Type:</td>
          <td style="padding: 8px 0;">${submission.fraudType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Reported Loss:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #b22234; font-size: 14px;">${submission.lossRange}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Transaction IDs / Hashes:</td>
          <td style="padding: 8px 0; font-family: monospace; font-size: 11px;">${submission.transactionIds || "None provided"}</td>
        </tr>
      </table>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-top: 12px;">
        <strong style="color: #0b1f3a; font-size: 12px;">Narrative Summary:</strong>
        <p style="margin: 6px 0 0 0; color: #475569; font-size: 12px; white-space: pre-wrap;">${submission.narrative || "No narrative entered."}</p>
      </div>
    </div>
    <div style="background: #f1f5f9; padding: 14px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
      Federal Bureau of Investigation &bull; Special Agent Collins McDonald Investigatory Task Force &bull; ${OFFICIAL_DOMAIN_EMAIL}
    </div>
  </div>
</body>
</html>`;

    const res = await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
      text: adminText,
      caseRef: submission.caseRef,
      claimantName: submission.fullName,
      templateId: "admin-intake-alert",
      templateName: "Intake Priority Alert (Admin)",
      stage: "Administrative Alert",
      senderName: "FFRD Task Force — Automated Dispatch Alert",
      senderEmail: "noreply@globalfraudrecovery.site",
      replyTo: submission.email || "support@globalfraudrecovery.site",
    });
    adminAlertSent = res.success;
  }

  return { victimSent, adminAlertSent };
}
