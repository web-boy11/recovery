import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  EMAIL_TEMPLATES,
  type EmailTemplateData,
} from "../src/utils/emailTemplates";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, "../public/email-templates");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sampleData: EmailTemplateData = {
  caseRef: "FFRD-2025-849201",
  clientName: "David Richardson",
  email: "d.richardson@example.com",
  phone: "(555) 234-8901",
  fraudType: "Cryptocurrency / Digital Asset Fraud",
  lossAmount: "$145,000.00 USD",
  dateReported: "2025-01-14",
  agentName: "Special Agent Collins McDonald",
  agentBadge: "SA-84920-WDC",
  actionUrl: "https://globalfraudrecovery.site/#report",
};

// Generate individual HTML templates
EMAIL_TEMPLATES.forEach((tpl, idx) => {
  const html = tpl.generateHtml(sampleData);
  const fileName = `${idx + 1}-${tpl.id}.html`;
  const filePath = path.join(targetDir, fileName);
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`Generated: ${fileName}`);
});

// Generate an Index Catalog HTML file to browse all templates
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FBI Fraud Recovery Task Force — Case Email Templates Catalog</title>
  <style>
    body { margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1f3a; color: #ffffff; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-family: Georgia, serif; font-size: 28px; margin-bottom: 6px; color: #f5d76e; }
    p.subtitle { color: #94a3b8; font-size: 14px; margin-top: 0; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .card { background-color: #ffffff; border-radius: 10px; padding: 20px 24px; color: #1e293b; display: flex; justify-content: space-between; align-items: center; border-left: 6px solid #c9a227; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .card-title { font-size: 17px; font-weight: bold; color: #0b1f3a; margin-bottom: 4px; }
    .card-stage { display: inline-block; font-size: 11px; font-weight: bold; text-transform: uppercase; background-color: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; margin-bottom: 6px; }
    .card-desc { font-size: 13px; color: #64748b; margin: 0; }
    .btn { display: inline-block; background-color: #0b1f3a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: bold; transition: background 0.2s; white-space: nowrap; margin-left: 16px; }
    .btn:hover { background-color: #14325a; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Official Case Update Email Templates</h1>
    <p class="subtitle">U.S. Department of Justice &bull; FBI Cybercrime &amp; Fraud Recovery Division &bull; Collins McDonald Unit</p>
    <div class="grid">
      ${EMAIL_TEMPLATES.map(
        (tpl, idx) => `
        <div class="card">
          <div>
            <span class="card-stage">${tpl.stage}</span>
            <div class="card-title">${idx + 1}. ${tpl.name}</div>
            <p class="card-desc">${tpl.description}</p>
          </div>
          <a href="./${idx + 1}-${tpl.id}.html" class="btn" target="_blank">Preview Template &rarr;</a>
        </div>
      `
      ).join("")}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(targetDir, "index.html"), indexHtml, "utf-8");
console.log("Generated: index.html catalog");

