# Marketing email templates

Professional HTML campaigns for Crypto Recovery Asset, using the same table-based layout as the case confirmation email (Gmail-safe CTAs, light theme).

## Templates

| ID | Purpose |
|----|---------|
| `scam_recovery_campaign` | **Flagship** — common scams, law enforcement message, “Start Your Recovery Journey” CTA |
| `nurture_72_hour` | Critical steps in the first 72 hours after a scam |
| `trust_social_proof` | Credibility — success rate, zero upfront, reviews link |
| `educational_red_flags` | How to spot fake recovery firms |
| `re_engagement` | Follow-up for stalled leads or incomplete intake |

Source: `server/marketingEmails.ts`  
Flagship design: `server/marketingScamRecoveryEmail.ts`  
Shared layout: `server/emailLayout.ts`

### Subject line options (`scam_recovery_campaign`)

1. Don't Fall for Crypto Withdrawal Scams  
2. **Trace & Recover Stolen Crypto Safely** *(default)*  
3. Protect Your Digital Assets Today  

Change default in `SCAM_RECOVERY_DEFAULT_SUBJECT` inside `marketingScamRecoveryEmail.ts`.

## Preview locally

```bash
npm run email:previews
```

Open `public/email-previews/index.html` in a browser (or serve via `npm run dev` and visit `/email-previews/`).

## Preview on server (admin)

List templates:

```
GET /api/marketing-emails
Authorization: Bearer <admin token>
```

Render HTML in browser:

```
GET /api/marketing-email-preview?template=nurture_72_hour&firstName=Alex&caseId=DF-8829-QX-04
```

## Send a test email (admin)

```bash
curl -X POST https://cryptorecoveryasset.com/api/send-marketing-email \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "you@example.com",
    "templateId": "nurture_72_hour",
    "firstName": "Alex",
    "caseId": "DF-8829-QX-04"
  }'
```

## Bulk / newsletter sends

For marketing blasts:

1. Use a proper list tool (Titan campaigns, Mailchimp, etc.) **or** send via `sendMarketingEmail()` from a controlled admin script.
2. Always include an **unsubscribe** link — pass `unsubscribeUrl` in template vars when you wire list management.
3. Keep SPF/DKIM/DMARC aligned (`EMAIL_SETUP.md`).
4. Do not email people who did not opt in; case confirmation emails are transactional, marketing templates are promotional.

## Customizing copy

Edit the template object in `server/marketingEmails.ts`:

- `subject` — inbox title
- `preheader` — hidden preview line (Gmail snippet)
- `buildHtml` / `buildText` — body content

After edits, run `npm run email:previews` and review in browser before sending.

## What to work on next

Tell us which direction you want:

- New templates (case milestone, analyst assigned, payment contingency reminder)
- Tone changes (more formal / more empathetic)
- Shorter versions for SMS follow-up links
- Automated triggers (e.g. send `nurture_72_hour` 24h after form submit)
