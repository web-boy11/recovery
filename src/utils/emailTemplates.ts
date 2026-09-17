// ── FBI Fraud & Funds Recovery Division — Email Templates System ──────────

export interface EmailTemplateData {
  caseRef: string;
  clientName: string;
  email: string;
  phone?: string;
  fraudType: string;
  lossAmount: string;
  dateReported: string;
  agentName?: string;
  agentBadge?: string;
  actionUrl?: string;
}

export interface EmailTemplateMeta {
  id: string;
  name: string;
  stage: string;
  badgeColor: string;
  subject: (data: EmailTemplateData) => string;
  preheader: string;
  description: string;
  generateHtml: (data: EmailTemplateData) => string;
  generateText: (data: EmailTemplateData) => string;
}

// ── Common Styling Helpers ───────────────────────────────────────────────
const STYLES = {
  navy: "#0b1f3a",
  navyLight: "#14325a",
  gold: "#c9a227",
  goldLight: "#f5d76e",
  red: "#b22234",
  slateBg: "#f1f5f9",
  cardBg: "#ffffff",
  border: "#e2e8f0",
  textPrimary: "#1e293b",
  textMuted: "#64748b",
};

function getProgressTrackerHtml(currentStep: number): string {
  const steps = [
    "Intake",
    "Agent Review",
    "Tracing",
    "Asset Freeze",
    "Restitution",
    "Closed",
  ];

  const items = steps
    .map((step, idx) => {
      const isCompleted = idx < currentStep;
      const isCurrent = idx === currentStep;
      const circleBg = isCompleted || isCurrent ? STYLES.navy : "#cbd5e1";
      const textColor = isCompleted || isCurrent ? STYLES.navy : "#94a3b8";
      const fontWeight = isCurrent ? "bold" : "normal";
      const checkMark = isCompleted ? "&#10003;" : `${idx + 1}`;

      return `
        <td align="center" style="padding: 0 4px; vertical-align: top; width: 16.6%;">
          <div style="width: 26px; height: 26px; line-height: 26px; border-radius: 50%; background-color: ${circleBg}; color: #ffffff; font-size: 11px; font-weight: bold; margin: 0 auto 6px auto; text-align: center; border: 2px solid ${isCurrent ? STYLES.gold : circleBg};">
            ${checkMark}
          </div>
          <div style="font-size: 10px; color: ${textColor}; font-weight: ${fontWeight}; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">
            ${step}
          </div>
        </td>
      `;
    })
    .join("");

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 22px 0; padding: 16px 8px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
      <tr>
        ${items}
      </tr>
    </table>
  `;
}

function getHeaderHtml(stageTitle: string, badgeText: string): string {
  return `
    <!-- Top Security Gold Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #c9a227 0%, #f5d76e 50%, #c9a227 100%);"></div>

    <!-- Main Header -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #0b1f3a 0%, #14325a 100%); padding: 26px 32px; border-bottom: 2px solid #c9a227;">
      <tr>
        <td style="vertical-align: middle;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right: 16px; vertical-align: middle;">
                <div style="width: 54px; height: 54px; border-radius: 50%; background-color: #ffffff; border: 2px solid #c9a227; text-align: center; line-height: 52px; font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #0b1f3a;">
                  &#9878;
                </div>
              </td>
              <td style="vertical-align: middle;">
                <div style="font-size: 10px; font-weight: bold; color: #c9a227; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2px;">
                  U.S. Department of Justice &bull; FBI Cybercrime Division
                </div>
                <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 19px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px; line-height: 1.2;">
                  Fraud &amp; Funds Recovery Task Force
                </div>
                <div style="font-size: 12px; color: #cbd5e1; margin-top: 2px;">
                  Special Agent Mc Collins Investigatory Unit
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" style="vertical-align: middle;">
          <span style="display: inline-block; background-color: rgba(201, 162, 39, 0.2); color: #f5d76e; border: 1px solid #c9a227; padding: 5px 12px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            ${badgeText}
          </span>
        </td>
      </tr>
    </table>

    <!-- Notice Banner -->
    <div style="background-color: #08152a; padding: 10px 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-size: 11px; color: #94a3b8; font-weight: 500;">
            <strong style="color: #ffffff;">NOTICE TYPE:</strong> ${stageTitle}
          </td>
          <td align="right" style="font-size: 11px; color: #94a3b8;">
            <span style="color: #22c55e;">&#9679;</span> TLS 1.3 ENCRYPTED TRANSMISSION
          </td>
        </tr>
      </table>
    </div>
  `;
}

function getCaseCardHtml(data: EmailTemplateData): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0b1f3a; border-radius: 6px; margin: 20px 0; font-size: 13px;">
      <tr>
        <td style="padding: 16px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 8px; width: 50%;">
                <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Case Reference</span><br />
                <strong style="color: #0b1f3a; font-family: 'Roboto Mono', monospace; font-size: 14px;">${data.caseRef}</strong>
              </td>
              <td style="padding-bottom: 8px; width: 50%;">
                <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Registered Claimant</span><br />
                <strong style="color: #1e293b; font-size: 13px;">${data.clientName}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 6px;">
                <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Fraud Classification</span><br />
                <span style="color: #1e293b;">${data.fraudType}</span>
              </td>
              <td style="padding-top: 6px;">
                <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Reported Claim Amount</span><br />
                <strong style="color: #b22234; font-size: 13px;">${data.lossAmount}</strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function getFooterHtml(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1f3a; color: #94a3b8; padding: 28px 32px; font-size: 11px; line-height: 1.6; border-top: 2px solid #c9a227;">
      <tr>
        <td>
          <div style="font-weight: bold; color: #ffffff; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            Federal Bureau of Investigation &bull; Fraud &amp; Funds Recovery Division
          </div>
          <div style="color: #cbd5e1; margin-bottom: 12px;">
            J. Edgar Hoover Building &bull; 935 Pennsylvania Avenue NW &bull; Washington, D.C. 20535<br />
            Official Victim Assistance Line: <strong>1-800-324-4372</strong> &bull; Secure Encrypted Relay: <strong>mccollins.unit@fbi.dhs.gov</strong>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; color: #64748b; font-size: 10px;">
            <strong>CONFIDENTIALITY &amp; PRIVACY ACT NOTICE (5 U.S.C. § 552a):</strong> The contents of this official electronic mail transmission, including any attachments, are intended exclusively for the named addressee and contain privileged law enforcement information. Unauthorized reading, duplication, or dissemination is strictly prohibited and subject to civil and criminal penalties under 18 U.S.C. §§ 1030 &amp; 1001. If you received this transmission in error, immediately notify the sender and purge all copies.
          </div>
        </td>
      </tr>
    </table>
  `;
}

function wrapEmail(
  data: EmailTemplateData,
  stageTitle: string,
  badgeText: string,
  bodyHtml: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${stageTitle} — ${data.caseRef}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    a { color: #0b1f3a; text-decoration: underline; }
    .btn:hover { background-color: #08152a !important; }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #e2e8f0;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 0 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td>
              ${getHeaderHtml(stageTitle, badgeText)}
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; color: #1e293b; font-size: 14px; line-height: 1.65;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              ${getFooterHtml()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── 7 Formal Case Email Templates ────────────────────────────────────────

export const EMAIL_TEMPLATES: EmailTemplateMeta[] = [
  // ── 1. Case Intake & Formal Acknowledgement ────────────────────────────
  {
    id: "intake-acknowledgement",
    name: "Case Intake & Formal Receipt",
    stage: "Stage 0: Intake Received",
    badgeColor: "#3b82f6",
    subject: (d) => `[OFFICIAL RECEIPT] Case Docket Opened — Ref: ${d.caseRef}`,
    preheader:
      "Formal receipt of victim intake report under Privacy Act of 1974. Case docket opened.",
    description:
      "Sent immediately after victim submits the intake form to confirm case registration and evidence preservation.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Confidential Victim Intake Acknowledged
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          This automated electronic notice confirms that your <strong>Confidential Victim Intake Form (CVIF)</strong> has been formally received and cataloged into the Federal Cybercrime Case Management System under the purview of the <strong>Mc Collins Fraud &amp; Funds Recovery Task Force</strong>.
        </p>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(0)}

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px; margin-bottom: 8px;">
          Immediate Evidence Preservation Directive
        </h3>
        <div style="background-color: #fffbeb; border-left: 4px solid #c9a227; padding: 14px 16px; border-radius: 4px; font-size: 13px; color: #92400e; margin-bottom: 18px;">
          <strong>CRITICAL INSTRUCTION:</strong> Pursuant to forensic evidentiary protocols, do <strong>NOT</strong> delete, overwrite, or alter any electronic records related to this incident. Maintain all:
          <ul style="margin: 6px 0 0 0; padding-left: 20px; line-height: 1.6;">
            <li>Chat transcripts (Telegram, WhatsApp, Signal, dating apps, SMS)</li>
            <li>Cryptocurrency transaction hashes (TXIDs) and deposit/withdrawal wallet addresses</li>
            <li>Bank wire receipts, Fedwire IMAD/OMAD trace identifiers, and account statements</li>
            <li>Originating website URLs, telephone numbers, and email headers</li>
          </ul>
        </div>

        <p>
          Your submission is currently queued for priority triage. An assigned Special Agent or certified forensic examiner will complete secondary verification and contact you within <strong>24 business hours</strong> via your designated secure communication channel.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0b1f3a;">
              <a href="${d.actionUrl || "#home"}" class="btn" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 6px;">
                Access Case Status Portal &rarr;
              </a>
            </td>
          </tr>
        </table>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          In Service to the Public,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">Cybercrime &amp; Financial Exploitation Intake Division</strong><br />
          Federal Bureau of Investigation &bull; Mc Collins Unit
        </p>
      `;
      return wrapEmail(d, "CASE INTAKE ACKNOWLEDGEMENT", "INTAKE REGISTERED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Case Intake Received & Registered
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}
Category: ${d.fraudType}
Reported Loss: ${d.lossAmount}

Dear ${d.clientName},

Your Confidential Victim Intake Form has been received and logged under Case Reference ${d.caseRef}.

CRITICAL EVIDENCE PRESERVATION NOTICE:
Please preserve all electronic evidence, including Telegram/WhatsApp chats, wire transaction receipts, wallet addresses, and email headers. Do not delete any records.

An investigator from the Mc Collins Unit will contact you within 24 business hours.

Inquiries: 1-800-324-4372 | mccollins.unit@fbi.dhs.gov`,
  },

  // ── 2. Special Agent Assignment & Initial Evaluation ───────────────────
  {
    id: "agent-assigned",
    name: "Investigating Agent Assignment",
    stage: "Stage 1: Agent Assigned",
    badgeColor: "#0b1f3a",
    subject: (d) => `[CASE UPDATE] Special Agent Assigned — Case Ref: ${d.caseRef}`,
    preheader:
      "Sworn Special Agent assigned to investigate and coordinate asset recovery.",
    description:
      "Informs the victim that a dedicated Special Agent has accepted the case and opened formal discovery.",
    generateHtml: (d) => {
      const agent = d.agentName || "Special Agent Mc Collins";
      const badge = d.agentBadge || "SA-84920-WDC";

      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Formal Assignment of Investigating Special Agent
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          Following initial evidentiary review, your case has met federal threshold requirements under <strong>18 U.S.C. § 1343 (Wire Fraud)</strong> and has been accepted for formal investigative action.
        </p>

        <!-- Agent Credential Box -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; margin: 18px 0;">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width: 48px; vertical-align: top; padding-right: 14px;">
                    <div style="width: 42px; height: 42px; border-radius: 50%; background-color: #0b1f3a; color: #c9a227; text-align: center; line-height: 40px; font-size: 20px; font-weight: bold;">
                      &#128100;
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.5px;">Assigned Lead Investigator</div>
                    <div style="font-size: 16px; font-weight: bold; color: #0b1f3a; margin-top: 2px;">${agent}</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 2px;">
                      Federal Credential Badge: <strong>#${badge}</strong> &bull; Cyber &amp; Asset Recovery Division
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(1)}

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px;">
          Preliminary Investigative Scope
        </h3>
        <p>
          Agent Mc Collins has opened active subpoenas and blockchain analytics requests targeting the primary beneficiary accounts and wallet nodes identified in your CVIF filing. Our division works in direct coordination with:
        </p>
        <ul style="color: #475569; font-size: 13px; line-height: 1.6;">
          <li>Financial Crimes Enforcement Network (FinCEN)</li>
          <li>Department of Justice National Cryptocurrency Enforcement Team (NCET)</li>
          <li>International Asset Tracing Corridors &amp; Partner Exchanges</li>
        </ul>

        <p>
          You will receive milestone alerts as evidentiary findings are returned. If additional documentation is required, you will be notified directly through our encrypted portal.
        </p>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Respectfully Submitted,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">${agent}</strong>, Supervisory Special Agent<br />
          Cybercrime &amp; Complex Financial Fraud Task Force &bull; Federal Bureau of Investigation
        </p>
      `;
      return wrapEmail(d, "AGENT ASSIGNMENT NOTICE", "CASE UNDER INVESTIGATION", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Special Agent Assigned
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}
Lead Investigator: ${d.agentName || "Special Agent Mc Collins"} (Badge #${d.agentBadge || "SA-84920-WDC"})

Dear ${d.clientName},

Your case has passed secondary triage and has been assigned to Special Agent Mc Collins. Active forensic tracing and inter-agency discovery are now officially underway.

You will be notified as destination exchange nodes and beneficiary accounts are identified.`,
  },

  // ── 3. Forensic Tracing & Asset Locating Update ────────────────────────
  {
    id: "tracing-update",
    name: "Forensic Asset Tracing Milestone",
    stage: "Stage 2: Tracing Active",
    badgeColor: "#6366f1",
    subject: (d) => `[INVESTIGATION UPDATE] Asset Tracing Milestone — Case Ref: ${d.caseRef}`,
    preheader:
      "Forensic cluster analysis identified beneficiary nodes and exchange routing.",
    description:
      "Notifies the client that stolen assets have been mapped across blockchain hops or correspondent bank wires.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Forensic Asset Tracing Milestone Achieved
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          We are pleased to inform you that our Forensic Cyber Analytics Unit has successfully identified the downstream transaction hops and terminal deposit endpoints associated with your reported loss of <strong>${d.lossAmount}</strong>.
        </p>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(2)}

        <!-- Forensic Findings Box -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <div style="font-size: 12px; font-weight: bold; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            Verified Forensic Findings:
          </div>
          <ul style="color: #166534; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Terminal Destination:</strong> Verified Virtual Asset Service Provider (VASP) &amp; Foreign Correspondent Entity</li>
            <li><strong>Asset Status:</strong> Tracing confidence score: <strong>98.4% (Direct Cluster Match)</strong></li>
            <li><strong>Legal Action:</strong> Emergency Preservation Letters (18 U.S.C. § 2703(f)) dispatched to holding entities</li>
          </ul>
        </div>

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px;">
          Next Phase: Judicial Freezing Directive
        </h3>
        <p>
          Now that the asset trail has been mapped to institutional endpoints, our legal liaisons are filing the emergency seizure warrant and mutual legal assistance requests to lock the funds and prevent off-ramping.
        </p>
        <p style="color: #64748b; font-size: 12px;">
          <em>Note: To preserve operational security and prevent the perpetrators from attempting secondary dissipation, specific counterparty institution names are kept confidential until freezing warrants are executed.</em>
        </p>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          In Diligent Service,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">Special Agent Mc Collins</strong><br />
          Cyber Division Forensic Analysis &bull; Federal Bureau of Investigation
        </p>
      `;
      return wrapEmail(d, "FORENSIC ASSET TRACE UPDATE", "ASSETS PINPOINTED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Forensic Tracing Milestone Achieved
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}

The Cyber Forensic Analytics team has successfully traced the stolen asset flow to identified terminal exchange/banking endpoints with a 98.4% confidence score.

Emergency Preservation Letters under 18 U.S.C. § 2703(f) have been served to holding entities. Freezing petitions are currently in preparation.`,
  },

  // ── 4. Asset Freeze & Legal Injunction Notice ──────────────────────────
  {
    id: "asset-freeze",
    name: "Asset Freeze & Injunction Order",
    stage: "Stage 3: Funds Secured",
    badgeColor: "#10b981",
    subject: (d) => `[CRITICAL UPDATE] Asset Freeze Injunction Executed — Case: ${d.caseRef}`,
    preheader:
      "Emergency restraining order and asset hold executed pursuant to 18 U.S.C. § 981.",
    description:
      "Confirms that legal freeze orders were served and assets have been immobilized to prevent loss.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Asset Restraining Order &amp; Freeze Executed
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          We are pleased to provide this critical operational update. Pursuant to <strong>18 U.S.C. §§ 981 &amp; 982</strong> and cooperating international bilateral treaties, an emergency <strong>Asset Seizure and Freezing Injunction</strong> has been officially executed.
        </p>

        <!-- Success Callout -->
        <div style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <div style="color: #059669; font-size: 28px; line-height: 1;">&#128274;</div>
          <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #065f46; margin-top: 6px;">
            Target Accounts Successfully Immobilized
          </div>
          <div style="color: #047857; font-size: 13px; margin-top: 4px;">
            The perpetrators cannot withdraw, transfer, or liquidate the seized assets.
          </div>
        </div>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(3)}

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px; margin-bottom: 8px;">
          Statutory Holding &amp; Restitution Process
        </h3>
        <p>
          The frozen assets have been placed under federal custodial escrow pending formal forfeiture proceedings and restitution allocation. During this statutory period:
        </p>
        <ol style="color: #475569; font-size: 13px; line-height: 1.6; padding-left: 20px;">
          <li>A federal magistrate reviews the forfeiture filing and asset claim documents.</li>
          <li>The holding institution reconciles the frozen balance against the certified claim amount of <strong>${d.lossAmount}</strong>.</li>
          <li>Upon final clearance, restitution payout paperwork will be transmitted to you for bank disbursement.</li>
        </ol>

        <p>
          Please maintain strict confidentiality regarding this action to ensure full compliance with court-mandated discovery rules.
        </p>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Under Court Authority,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">Special Agent Mc Collins</strong><br />
          Lead Case Agent &bull; Asset Forfeiture &amp; Restitution Task Force
        </p>
      `;
      return wrapEmail(d, "ASSET FREEZE INJUNCTION", "ASSETS IMMOBILIZED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Asset Freeze Order Executed
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}

Pursuant to 18 U.S.C. §§ 981 & 982, an emergency legal freeze has been successfully executed against the destination accounts/wallets holding your defrauded assets.

The perpetrators have been locked out. Assets are held in custodial escrow pending court-authorized restitution repatriation.`,
  },

  // ── 5. Evidence / Documentation Request ────────────────────────────────
  {
    id: "evidence-request",
    name: "Evidentiary Document Verification Notice",
    stage: "Action Required: Evidence Submission",
    badgeColor: "#f59e0b",
    subject: (d) => `[ACTION REQUIRED] Supplementary Evidentiary Documents Needed — Ref: ${d.caseRef}`,
    preheader:
      "Urgent evidentiary items required to substantiate asset restitution claims.",
    description:
      "Requests specific supplementary proof (wire slips, chat transcripts, ID) with a secure upload deadline.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #b22234; margin-top: 0; margin-bottom: 12px;">
          Action Required: Supplementary Evidentiary Documentation
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          In order to substantiate your formal claim with the judicial review board and expedite asset release, our case auditors require supplementary evidentiary documentation for Case Reference <strong>${d.caseRef}</strong>.
        </p>

        ${getCaseCardHtml(d)}

        <!-- Checklist Box -->
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; padding: 18px; border-radius: 6px; margin: 20px 0;">
          <div style="font-size: 13px; font-weight: bold; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
            Requested Verification Items:
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #78350f; line-height: 1.6;">
            <tr>
              <td style="padding: 4px 0;">&#9745; <strong>1. Original Bank Wire Confirmation:</strong> Official PDF statement showing originating routing number and Fedwire IMAD/OMAD code.</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">&#9745; <strong>2. Crypto Platform Withdrawal Slips:</strong> Complete screenshot or CSV showing exact transaction hashes, date/time, and fee.</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">&#9745; <strong>3. Full Communication Transcripts:</strong> Unedited exported chats (WhatsApp, Telegram, or email chains) with the perpetrators.</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">&#9745; <strong>4. Government Photo Identification:</strong> Clear color scan of State Driver’s License or U.S. Passport for victim identity verification.</td>
            </tr>
          </table>
        </div>

        <p style="color: #b22234; font-weight: bold; font-size: 13px;">
          SUBMISSION WINDOW: Please transmit these records within <strong>72 business hours</strong> to ensure active preservation priority on the held assets.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 22px 0;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #b22234;">
              <a href="${d.actionUrl || "#report"}" class="btn" style="display: inline-block; padding: 12px 26px; font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 6px;">
                Upload Evidentiary Files Securely &rarr;
              </a>
            </td>
          </tr>
        </table>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Case Audit Team &bull; Fraud &amp; Funds Recovery Division<br />
          Federal Bureau of Investigation
        </p>
      `;
      return wrapEmail(d, "EVIDENTIARY SUBMISSION DIRECTIVE", "DOCUMENTS REQUIRED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Supplementary Evidentiary Documents Required
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}

To validate your claim before the judicial board, please submit:
1. Certified Bank Wire Confirmation / Crypto withdrawal receipts
2. Complete chat logs with perpetrators (WhatsApp/Telegram/Email)
3. Government-issued Photo Identification (Driver's License/Passport)

Please transmit within 72 business hours via your secure case channel.`,
  },

  // ── 6. Restitution Verification & Payout Clearance ─────────────────────
  {
    id: "restitution-approved",
    name: "Restitution Payout Clearance",
    stage: "Stage 4: Recovery Milestone",
    badgeColor: "#059669",
    subject: (d) => `[RESTITUTION CLEARANCE] Recovered Asset Restitution Approved — Ref: ${d.caseRef}`,
    preheader:
      "Magistrate clearance issued for repatriation of verified victim assets.",
    description:
      "Notifies the victim that funds have cleared judicial review and are authorized for restitution disbursement.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Judicial Restitution Clearance &amp; Payout Authorization
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          We are pleased to deliver this official determination: <strong>The United States District Court and Task Force Review Board have formally approved the Restitution Disbursement Order</strong> for Case Reference <strong>${d.caseRef}</strong>.
        </p>

        <!-- Payout Clearance Banner -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; margin: 20px 0;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #166534; letter-spacing: 1px;">
                Approved Restitution Fund Balance
              </div>
              <div style="font-family: Georgia, serif; font-size: 32px; font-weight: bold; color: #15803d; margin: 6px 0;">
                ${d.lossAmount}
              </div>
              <div style="font-size: 12px; color: #166534;">
                Disbursement Authorized &bull; Federal Escrow Clearance #US-REC-${Math.floor(100000 + Math.random() * 900000)}
              </div>
            </td>
          </tr>
        </table>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(4)}

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px; margin-bottom: 8px;">
          Repatriation &amp; Wire Verification Steps
        </h3>
        <p>
          To ensure strict adherence to federal Anti-Money Laundering (AML) standards, funds may only be disbursed to a domestic bank account matching your verified legal identity:
        </p>
        <ol style="color: #475569; font-size: 13px; line-height: 1.6; padding-left: 20px;">
          <li>Your assigned Special Agent will initiate contact to verify receiving routing numbers.</li>
          <li>A test verification deposit or Fedwire pre-notification will be transmitted.</li>
          <li>Upon final confirmation, the certified restitution balance will be released.</li>
        </ol>

        <!-- Official Security Notice -->
        <div style="background-color: #fef2f2; border-left: 4px solid #b22234; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #991b1b; margin: 18px 0;">
          <strong>ZERO-FEE ASSURANCE:</strong> The FBI and Department of Justice <strong>NEVER</strong> charge processing fees, release taxes, or courier payments to repatriate recovered victim assets. Any request for upfront payment is fraudulent.
        </div>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Approved by Authority of the Task Force,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">Special Agent Mc Collins</strong><br />
          Federal Asset Forfeiture &amp; Restitution Bureau
        </p>
      `;
      return wrapEmail(d, "RESTITUTION REPATRIATION CLEARANCE", "FUNDS CLEARED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Restitution Payout Clearance Approved
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}
Authorized Amount: ${d.lossAmount}

Federal Court and Division Review have officially cleared the restitution disbursement for your case.

Agent Mc Collins will coordinate the final receiving bank account verification. The FBI NEVER charges fees or taxes to release recovered funds.`,
  },

  // ── 7. Final Case Resolution & Official Audit Certificate ──────────────
  {
    id: "case-resolved",
    name: "Case Resolution & Audit Certificate",
    stage: "Stage 5: Case Closed",
    badgeColor: "#0b1f3a",
    subject: (d) => `[CASE CLOSED] Official Resolution & Certificate of Restitution — Case: ${d.caseRef}`,
    preheader:
      "Final case closure report and official restitution audit certificate.",
    description:
      "Final formal closure letter after funds have been repatriated, including post-scam security advice.",
    generateHtml: (d) => {
      const body = `
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0b1f3a; margin-top: 0; margin-bottom: 12px;">
          Certificate of Case Resolution &amp; Restitution Completion
        </h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">
          Dear <strong>${d.clientName}</strong>,
        </p>
        <p>
          The Federal Bureau of Investigation Fraud &amp; Funds Recovery Division officially certifies that all investigatory actions, court filings, and restitution disbursements for Case Reference <strong>${d.caseRef}</strong> have reached full completion.
        </p>

        <!-- Certificate Box -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 3px double #c9a227; border-radius: 8px; padding: 24px; text-align: center; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td>
              <div style="font-size: 11px; font-weight: bold; color: #c9a227; text-transform: uppercase; letter-spacing: 2px;">
                Official Certificate of Restitution
              </div>
              <div style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #0b1f3a; margin: 8px 0;">
                CASE RESOLVED &bull; RESTITUTION DISBURSED
              </div>
              <div style="font-size: 13px; color: #475569; margin-bottom: 12px;">
                Total Claim Settled: <strong style="color: #0b1f3a;">${d.lossAmount}</strong>
              </div>
              <div style="font-family: 'Roboto Mono', monospace; font-size: 11px; color: #64748b;">
                Docket ID: ${d.caseRef} &bull; Date of Closure: ${new Date().toLocaleDateString()}
              </div>
            </td>
          </tr>
        </table>

        ${getCaseCardHtml(d)}

        ${getProgressTrackerHtml(5)}

        <h3 style="font-size: 14px; font-weight: bold; color: #0b1f3a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px; margin-bottom: 8px;">
          Long-Term Security Recommendations
        </h3>
        <p style="color: #475569; font-size: 13px; line-height: 1.6;">
          To protect your identity and personal assets from secondary exploitation:
        </p>
        <ul style="color: #475569; font-size: 13px; line-height: 1.6; padding-left: 20px;">
          <li>Implement a credit freeze across all three major credit bureaus (Equifax, Experian, TransUnion).</li>
          <li>Change passwords on all primary financial and email accounts; activate hardware-based multi-factor authentication (MFA).</li>
          <li>Be cautious of unsolicited calls claiming to be from "recovery agencies"—the federal case is closed.</li>
        </ul>

        <p>
          On behalf of the Department of Justice and the Mc Collins Task Force, we commend your cooperation and diligence throughout this complex recovery proceeding.
        </p>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Respectfully Discharged,<br />
          <strong style="color: #0b1f3a; font-size: 13px;">Special Agent Mc Collins</strong><br />
          Supervisory Special Agent &bull; Mc Collins Recovery Task Force<br />
          Federal Bureau of Investigation &bull; United States Department of Justice
        </p>
      `;
      return wrapEmail(d, "CASE RESOLUTION CERTIFICATE", "CASE CLOSED", body);
    },
    generateText: (d) => `OFFICIAL NOTICE: Case Resolution & Restitution Certificate
Case Reference: ${d.caseRef}
Claimant: ${d.clientName}
Total Settled: ${d.lossAmount}

All investigatory proceedings, legal actions, and asset restitution transfers have been successfully executed and concluded. Case Docket ${d.caseRef} is officially marked as CLOSED.

Thank you for your cooperation with the Mc Collins Task Force.`,
  },
];

