# Deploy on Hostinger (Node.js + GitHub)

## Why `/api/health` returns HTML or 404

If `https://cryptorecoveryasset.com/api/health` is **not** JSON (`{"status":"online","runtime":"node",...}`), the domain is **not** hitting the Node process. Common causes:

1. **Entry file** missing or wrong → Hostinger serves **only** the output folder (`dist/browser`) with no Node API.
2. **Build command** is `ng build` → build fails or wrong output (this repo uses `npm run build`).
3. A **separate static website** is still attached to the domain.
4. Node app not **redeployed** after env or config changes.

---

## Hostinger hPanel — Angular framework preset (this repo)

This site is **React + Vite + Express**, not Angular CLI. Using the **Angular** preset in hPanel is fine — use these **exact** overrides (Hostinger may pre-fill `ng build` and `dist/.../browser`; change them):

| Setting | Value |
|---------|--------|
| Type | **Websites** → **Node.js Apps** → Import from GitHub |
| Repository | `Scottgabsia/mes` |
| Framework | **Angular** (preset) |
| Node.js version | **20** |
| Install command | `npm ci` or `npm install` |
| **Build command** | **`npm run build`** — not `ng build` |
| **Start command** | **`npm start`** |
| **Output directory** | **`dist/browser`** |
| **Entry file** | **`app.cjs`** (repo root) |

If build logs show `ng: command not found`, the build command is still set to Angular CLI — switch it to `npm run build` and redeploy.

**Better preset (optional):** **Vite** or **Express** with the same build/start/entry values above.

**Domain:** In the Node.js app → **Domains**, attach `cryptorecoveryasset.com` (and `www` if used). Remove or disable any **other** website on the same domain (old static upload / “Website Builder”).

After saving, click **Deploy** or **Redeploy**.

---

## Environment variables (email via SMTP)

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
