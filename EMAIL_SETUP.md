# Email setup

The Node server sends form emails when `/api/health` shows `"emailConfigured": true`.

**SMTP (Titan) is used first** if `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set.  
Otherwise **Resend** is used if `RESEND_API_KEY` is set.

---

## Option A — Titan SMTP (recommended for your inbox)

**Hostinger → Node.js app → Environment variables:**

```
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

**Titan tips:**

- If 2FA is on, create an **App Password** in Titan (Settings → Security) and use it as `SMTP_PASS`.
- Remove `RESEND_API_KEY` if you only want SMTP (SMTP wins when both are set).

**Test after redeploy:**

1. `https://cryptorecoveryasset.com/api/health` → `"emailProvider":"smtp"`
2. `https://cryptorecoveryasset.com/api/debug-email?to=info@cryptorecoveryasset.com`
3. Check Titan inbox + spam for `info@cryptorecoveryasset.com`

---

## Option B — Resend

```
RESEND_API_KEY=re_...
RESEND_FROM=Crypto Recovery <info@cryptorecoveryasset.com>
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

Verify domain at resend.com. Used only when SMTP is not configured.

---

## Logs

- `[SMTP] Ready — ...` → Titan SMTP active
- `[Resend] Ready — ...` → Resend active (no SMTP vars)
- `[Email] Not configured` → add env vars and restart
