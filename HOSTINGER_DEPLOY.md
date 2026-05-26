# Deploy on Hostinger (Node.js + GitHub)

## Why `/api/health` returns HTML or 404

If `https://cryptorecoveryasset.com/api/health` is **not** JSON (`{"status":"online","runtime":"node",...}`), the domain is **not** hitting the Node process. Common causes:

1. **Output directory** set to `dist` → Hostinger serves static files only; the API never runs.
2. A **separate static website** is still attached to the domain.
3. **Entry file** wrong (must be `app.cjs` at repo root, not `dist/server.cjs` alone).
4. Node app not **redeployed** after env or config changes.

---

## Hostinger hPanel — Node.js Web App (correct settings)

| Setting | Value |
|---------|--------|
| Type | **Websites** → **Node.js Apps** → Import from GitHub |
| Repository | `Scottgabsia/mes` |
| Framework | **Other** |
| Node.js version | **20** |
| Install command | `npm ci` or `npm install` |
| Build command | `npm install && npm run build` |
| Start command | `npm start` (uses `app.cjs`; builds automatically if `dist/` is missing) |
| **Output directory** | **leave empty** (do not use `dist` for static-only) |
| **Entry file** | **`app.cjs`** |

**Domain:** In the Node.js app → **Domains**, attach `cryptorecoveryasset.com` (and `www` if used). Remove or disable any **other** website on the same domain (old static upload / “Website Builder”).

After saving, click **Deploy** or **Redeploy**.

### Log: `dist/server.cjs not found`

Hostinger started the app before a build finished. **Fix:** set Build command to `npm install && npm run build`, Entry file to `app.cjs`, pull latest GitHub (auto-build on start). Then **Redeploy**.

---

## Environment variables (email via Resend)

**hPanel → Websites → your Node.js app → Environment variables:**

```
NODE_ENV=production
RESEND_API_KEY=re_your_key_from_resend.com
RESEND_FROM=Crypto Recovery <info@cryptorecoveryasset.com>
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

Verify `cryptorecoveryasset.com` in Resend before using your domain in `RESEND_FROM`. See **EMAIL_SETUP.md**.

Do **not** set `PORT` — Hostinger sets it automatically.

Redeploy after changing env vars.

---

## Verify after deploy

1. `https://cryptorecoveryasset.com/api/health`  
   - **Good:** `{"status":"online","runtime":"node","smtpConfigured":true,...}`  
   - **Bad:** HTML or Hostinger 404 → domain still on static hosting; fix table above

2. Test email:  
   `https://cryptorecoveryasset.com/api/debug-email?to=info@cryptorecoveryasset.com`

3. Submit the intake form; check **info@cryptorecoveryasset.com** (and spam).

---

## Option B: Static site + EmailJS (no Node API)

If you keep static-only hosting, set **build-time** variables in Hostinger and redeploy:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_ADMIN_EMAIL=info@cryptorecoveryasset.com
```

The form will send via EmailJS from the browser. SMTP env vars only apply when Node is running.

---

## Option C: Static site + Firebase Functions API

See `EMAIL_SETUP.md` and set `VITE_API_BASE_URL` to your deployed function URL, then rebuild.

---

## Local test

```bash
npm run build
npm start
```

Visit http://localhost:3000/api/health — should return JSON with `"runtime":"node"`.
