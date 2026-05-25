# Deploy on Hostinger (Node.js + GitHub)

## Why emails did not work (important)

If `https://yourdomain.com/api/health` shows your **website homepage** (HTML) instead of JSON like `{"smtpConfigured":true}`, the site is **static-only**. The email API never runs — form data may save to Firebase, but **no email is sent**.

**Fix:** Use **Node.js Web App** (not static website / not “upload dist only”).

---

## Hostinger hPanel settings (Node.js Web App)

| Setting | Value |
|---------|--------|
| Type | **Node.js Apps** → Import from GitHub |
| Framework | **Other** |
| Node.js version | **20** |
| Install command | `npm ci` or `npm install` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Output directory | `dist` |
| Entry file | `dist/server.cjs` |

Point your domain to this **Node.js app**, not a separate static site.

---

## Environment variables (required for email)

**hPanel → Websites → your Node.js app → Environment variables:**

```
NODE_ENV=production
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_titan_password_or_app_password
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

Do **not** set `PORT` — Hostinger sets it automatically.

After changing env vars, click **Redeploy / Restart** the app.

---

## Verify after deploy

1. Open `https://yourdomain.com/api/health`  
   - **Good:** JSON with `"smtpConfigured": true`  
   - **Bad:** HTML homepage → still static hosting; fix Node.js app + domain

2. Test email:  
   `https://yourdomain.com/api/debug-email?to=info@cryptorecoveryasset.com`

3. Submit the intake form and check **info@cryptorecoveryasset.com** (and spam folder).

---

## Option B: Static site + Firebase Functions API

If you must keep **static** hosting on Hostinger:

1. Install Firebase CLI, login, and from project root run:
   ```bash
   cd functions && npm install && cd ..
   firebase functions:secrets:set SMTP_PASS
   firebase deploy --only functions
   ```
   Also set other SMTP vars in [Google Cloud Console](https://console.cloud.google.com/functions) → your function → Environment variables.

2. Add to Hostinger **build** environment variables:
   ```
   VITE_API_BASE_URL=https://us-central1-mysterybritishsh-1748710084193.cloudfunctions.net/mes
   ```

3. Rebuild and redeploy the frontend.

---

## Titan email tips

- If 2FA is on, use an **App Password** as `SMTP_PASS`, not your normal login password.
- Check spam/junk for test messages.

---

## Local test

```bash
npm run build
npm start
```

Visit http://localhost:3000/api/health
