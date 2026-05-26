# Email setup (Resend)

Form emails are sent through **[Resend](https://resend.com)** when your **Node API** is running (`npm start` on Hostinger).

Firestore still saves every submission even if email fails.

---

## 1. Create a Resend account

1. Sign up at [resend.com](https://resend.com).
2. **API Keys** → Create key → copy `re_...`.

---

## 2. Verify your domain (production)

1. Resend → **Domains** → Add `cryptorecoveryasset.com`.
2. Add the DNS records Resend shows (SPF/DKIM) in Hostinger DNS.
3. Wait until status is **Verified**.

Then set:

```
RESEND_FROM=Crypto Recovery <info@cryptorecoveryasset.com>
```

---

## 3. Environment variables

**Hostinger → Node.js app → Environment variables:**

```
NODE_ENV=production
RESEND_API_KEY=re_your_key_here
RESEND_FROM=Crypto Recovery <info@cryptorecoveryasset.com>
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

Redeploy after saving.

**Testing before domain verify:** use  
`RESEND_FROM=Crypto Recovery <onboarding@resend.dev>`  
(Resend only delivers test mail to the email on your Resend account.)

---

## 4. Node app must be running

Open: `https://cryptorecoveryasset.com/api/health`

- **Good:** JSON with `"emailProvider":"resend"` and `"emailConfigured":true`
- **Bad:** HTML or 404 → static hosting only; see `HOSTINGER_DEPLOY.md`

Test send:  
`https://cryptorecoveryasset.com/api/debug-email?to=info@cryptorecoveryasset.com`

---

## 5. Static hosting only (no Node API)

Either:

- Fix Hostinger Node (recommended), **or**
- Set **EmailJS** build vars (`VITE_EMAILJS_*`) — see `.env.example`, **or**
- Deploy Firebase Functions (see repo `functions/`)

Resend cannot run from the browser (API key must stay on the server).
