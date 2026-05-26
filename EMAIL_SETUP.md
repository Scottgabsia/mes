# Why email works on localhost but not on cryptorecoveryasset.com

## The problem

| | Localhost | Live site (current) |
|---|-----------|---------------------|
| What runs | `npm run dev` → Node + Express | Static HTML/JS only |
| `/api/submit-recovery` | ✅ Works | ❌ 404 / HTML (no server) |
| Hostinger env vars | N/A | **Ignored** (nothing reads them) |

Open: **https://cryptorecoveryasset.com/api/health**

- If you see **JSON** → Node API is running (env vars matter).
- If you see **HTML or 404** → static hosting only → **emails cannot send**.

---

## Fix A — Hostinger Node.js app (best)

1. hPanel → **Node.js Apps** (not static website).
2. Connect GitHub repo `Scottgabsia/mes`.
3. **Build:** `npm run build` · **Start:** `npm start` · **Node 20**
4. Point **cryptorecoveryasset.com** to this Node app.
5. Add environment variables:

```
NODE_ENV=production
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_password
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

6. Redeploy → test `/api/health` → submit form.

---

## Fix B — Keep static Hostinger + Firebase email API

The site code now calls Firebase when production has no `/api`:

`https://us-central1-mysterybritishsh-1748710084193.cloudfunctions.net/mes`

### One-time setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login` (use the Google account that owns the Firebase project)
3. Copy SMTP settings:
   ```bash
   cp .env.example functions/.env
   # edit functions/.env with SMTP_PASS
   ```
4. Deploy:
   ```bash
   npm run deploy:functions
   ```
5. Redeploy the **website** on Hostinger (pull latest GitHub).

Test:  
`https://us-central1-mysterybritishsh-1748710084193.cloudfunctions.net/mes/api/health`  
should return `"smtpConfigured": true`.

---

## Quick test after either fix

- Form submit → email to **info@cryptorecoveryasset.com**
- Check spam folder
- Titan 2FA → use **App Password** as `SMTP_PASS`
