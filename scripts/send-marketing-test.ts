import dotenv from "dotenv";
dotenv.config();

import {
  isEmailConfigured,
  logEmailStartup,
  sendMarketingEmail,
} from "../server/email";
import type { MarketingTemplateId } from "../server/marketingEmails";

async function main() {
  const to = process.argv[2];
  const templateId = (process.argv[3] || "scam_recovery_campaign") as MarketingTemplateId;
  const firstName = process.argv[4];

  if (!to) {
    console.error("Usage: npx tsx scripts/send-marketing-test.ts <email> [templateId] [firstName]");
    process.exit(1);
  }

  if (!isEmailConfigured()) {
    console.error("Email not configured. Set SMTP_* or RESEND_API_KEY in .env");
    process.exit(1);
  }

  logEmailStartup();

  const result = await sendMarketingEmail({
    to,
    templateId,
    vars: firstName ? { firstName } : {},
  });

  console.log("Sent:", { to, templateId, ...result });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
