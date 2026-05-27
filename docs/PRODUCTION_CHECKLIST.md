# Production checklist — Crypto Recovery Asset

Use this after every deploy to Hostinger so **intake, admin panel, client portal, email, and messaging** keep working.

## 1. Hostinger Node.js (required)

| Setting | Value |
|---------|--------|
| Entry file | `app.cjs` |
| Start command | `npm start` |
| Build command | `npm install && npm run build` |
| Output directory | **empty** (not `dist` alone) |
| Node | 20.x |

Attach the domain only to this Node app (no parallel static site on the same domain).

## 2. Environment variables

```env
NODE_ENV=production
ADMIN_EMAIL=info@cryptorecoveryasset.com

SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_app_password
```

Optional but recommended on Hostinger:

```env
CASE_DATA_DIR=/home/u123456789/domains/cryptorecoveryasset.com/data
```

Create that folder in File Manager so **cases survive redeploys**. Without it, cases live in `data/` under the app root (may reset on some hosts).

Do **not** set `VITE_API_BASE_URL` to Firebase unless you intentionally use Functions as backup — the live case store runs on **same-origin Node**.

## 3. Health check (must pass)

Open: `https://cryptorecoveryasset.com/api/health`

Expected JSON includes:

- `"runtime": "node"`
- `"smtpConfigured": true` (or Resend configured)
- `"caseStore": { "writable": true, "casesFile": "..." }`
- `"platform": { "intakeSubmit": true, "caseLookup": true, ... }`

If you see **HTML** instead of JSON, the domain is not on Node — fix Hostinger settings.

## 4. Firebase (admin login only)

1. Firebase Console → Authentication → enable **Email/Password**
2. Create user: `info@cryptorecoveryasset.com` (or your admin email)
3. Admin login: `/admin/login`

Firestore rules are optional for day-to-day ops — **server case file** is the source of truth for:

- Admin case list  
- Client case lookup by email  
- Messaging & milestones  
- Keyphrase storage & admin email alert  

## 5. Feature smoke test

| Step | Action | Expected |
|------|--------|----------|
| A | Submit home or contact form | Admin email + case in admin panel |
| B | Case lookup with that email | Client dashboard opens |
| C | Admin sends message | Client sees it within ~5s |
| D | Client sends message | Admin sees it in panel |
| E | Admin toggles milestone / status | Client status updates |
| F | Client submits keyphrase (ANALYSIS phase) | Success UI + admin email `[KEYPHRASE]` |

## 6. What runs where

```
Browser → same-origin /api/* → Node (dist/server.cjs)
                              → data/recovery-cases.json
                              → SMTP / Resend → ADMIN_EMAIL
```

Forms call **`/api/submit-recovery` first** (then Firestore as backup). Never rely on Firestore alone for client permissions.

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Admin panel empty | Redeploy Node; check `/api/health` `caseStore.writable` |
| “Access denied” on case lookup | Redeploy; lookup uses `/api/case-lookup` not Firestore |
| Keyphrase permission error | Redeploy; uses `/api/case/:id/keyphrase` |
| No admin email | Set SMTP_* in hPanel; test `/api/debug-email?to=...` |
| Cases disappear after deploy | Set `CASE_DATA_DIR` to persistent path |

## 8. Deploy command (local)

```bash
npm run build
npm start
# http://localhost:3000/api/health
```

Push to `main` on GitHub, then **Redeploy** in Hostinger hPanel.
