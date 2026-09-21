// ── Official Domain Email Trial Compiler for seanjordanw@gmail.com ──────────
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  EMAIL_TEMPLATES,
  type EmailTemplateData,
} from "../src/utils/emailTemplates.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetEmail = process.argv[2] || "seanjordanw@gmail.com";

const trialData: EmailTemplateData = {
  caseRef: "FFRD-2025-918234",
  clientName: "Sean Jordan",
  email: targetEmail,
  phone: "+1 (917) 487-6372",
  fraudType: "Cryptocurrency / Digital Asset Fraud & Foreign Wire Extraction",
  lossAmount: "$185,000.00 USD",
  dateReported: new Date().toISOString().slice(0, 10),
  agentName: "Special Agent Collins McDonald",
  agentBadge: "SA-84920-WDC",
  actionUrl: "https://globalfraudrecovery.site/#report",
};

const outputDir = path.resolve(
  __dirname,
  "../public/email-templates/trial-seanjordanw"
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("================================================================================");
console.log("   FEDERAL FRAUD & FUNDS RECOVERY DIVISION — DOMAIN EMAIL TRIAL SYSTEM");
console.log("================================================================================");
console.log(`[TARGET RECIPIENT]: ${trialData.email}`);
console.log(`[OFFICIAL SENDER]:  collinsmcdonald@globalfraudrecovery.site`);
console.log(`[CASE DOCKET]:     ${trialData.caseRef}`);
console.log(`[CLAIMANT]:        ${trialData.clientName}`);
console.log(`[LOSS AMOUNT]:     ${trialData.lossAmount}`);
console.log(`[INVESTIGATOR]:    ${trialData.agentName} (${trialData.agentBadge})`);
console.log("--------------------------------------------------------------------------------");

const generatedFiles: { name: string; stage: string; subject: string; file: string }[] = [];

EMAIL_TEMPLATES.forEach((tpl, idx) => {
  const html = tpl.generateHtml(trialData);
  const subject = tpl.subject(trialData);
  const fileName = `${idx + 1}-${tpl.id}.html`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, html, "utf-8");

  generatedFiles.push({
    name: tpl.name,
    stage: tpl.stage,
    subject,
    file: fileName,
  });

  console.log(`[STAGE ${idx + 1}/7]: ${tpl.stage}`);
  console.log(`  Name:    ${tpl.name}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  File:    public/email-templates/trial-seanjordanw/${fileName}`);
  console.log("");
});

// Create Interactive Index HTML for trial viewing & verification
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Official Domain Case Trial Package — ${trialData.email}</title>
  <style>
    body { margin: 0; padding: 30px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1f3a; color: #ffffff; }
    .container { max-width: 960px; margin: 0 auto; }
    .header-box { background: linear-gradient(135deg, #14325a 0%, #0b1f3a 100%); border: 2px solid #c9a227; border-radius: 12px; padding: 24px 30px; margin-bottom: 24px; }
    h1 { font-family: Georgia, serif; font-size: 26px; color: #f5d76e; margin: 0 0 6px 0; }
    .badge { display: inline-block; background-color: #c9a227; color: #0b1f3a; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 3px 10px; border-radius: 4px; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; font-size: 13px; }
    .info-item { background: rgba(255, 255, 255, 0.07); padding: 10px 14px; border-radius: 6px; border-left: 3px solid #c9a227; }
    .info-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; }
    .info-val { font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px; }
    .card { background-color: #ffffff; border-radius: 10px; padding: 20px 24px; color: #1e293b; margin-bottom: 14px; display: flex; flex-direction: column; gap: 12px; border-left: 6px solid #0b1f3a; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    @media(min-width: 768px) {
      .card { flex-direction: row; justify-content: space-between; align-items: center; }
    }
    .card-stage { display: inline-block; font-size: 10px; font-weight: bold; text-transform: uppercase; background-color: #f1f5f9; color: #0b1f3a; padding: 3px 8px; border-radius: 4px; }
    .card-title { font-size: 16px; font-weight: bold; color: #0b1f3a; margin: 4px 0 2px 0; }
    .card-subject { font-family: Georgia, serif; font-size: 13px; color: #475569; }
    .actions { display: flex; gap: 8px; flex-shrink: 0; }
    .btn { display: inline-block; padding: 9px 16px; border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none; transition: background 0.2s; white-space: nowrap; }
    .btn-primary { background-color: #0b1f3a; color: #ffffff; }
    .btn-primary:hover { background-color: #14325a; }
    .btn-download { background-color: #f1f5f9; color: #0b1f3a; border: 1px solid #cbd5e1; }
    .btn-download:hover { background-color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-box">
      <span class="badge">Official Website Domain Suite</span>
      <h1>7-Stage Case Milestones for ${trialData.email}</h1>
      <div style="color: #cbd5e1; font-size: 13px;">
        Special Agent Collins McDonald &bull; U.S. Department of Justice &bull; FBI Cybercrime &amp; Fraud Recovery Division<br />
        Official Sender Identity: <strong>collinsmcdonald@globalfraudrecovery.site</strong>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Trial Recipient</div>
          <div class="info-val">${trialData.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Case Docket #</div>
          <div class="info-val">${trialData.caseRef}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Claimant Name</div>
          <div class="info-val">${trialData.clientName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Claimed Balance</div>
          <div class="info-val" style="color: #f5d76e;">${trialData.lossAmount}</div>
        </div>
      </div>
    </div>

    <div>
      ${generatedFiles
        .map(
          (f, idx) => `
        <div class="card">
          <div>
            <span class="card-stage">${f.stage}</span>
            <div class="card-title">${idx + 1}. ${f.name}</div>
            <div class="card-subject"><strong>Subject:</strong> ${f.subject}</div>
          </div>
          <div class="actions">
            <a href="./${f.file}" class="btn btn-primary" target="_blank">Visual Preview &rarr;</a>
            <a href="./${f.file}" download class="btn btn-download">⬇ Download HTML</a>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml, "utf-8");
console.log(`[CATALOG CREATED]: public/email-templates/trial-seanjordanw/index.html`);
console.log("================================================================================");
console.log("✓ SUCCESS: All 7 official domain templates generated cleanly for seanjordanw@gmail.com!");
console.log("================================================================================");
