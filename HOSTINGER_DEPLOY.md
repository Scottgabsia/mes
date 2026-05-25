# Deploy on Hostinger (Node.js + GitHub)

## Hostinger hPanel settings

| Setting | Value |
|---------|--------|
| Framework | **Other** (or Express if listed) |
| Node.js version | **20** |
| Install command | `npm ci` or `npm install` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Output directory | `dist` |
| Entry file | `dist/server.cjs` |

## Environment variables (required for email)

Add these in **hPanel → Websites → your app → Environment variables**:

```
NODE_ENV=production
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_titan_password_or_app_password
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

`PORT` is set automatically by Hostinger — do not override it.

Optional (only if you use Gemini in the app):

```
GEMINI_API_KEY=your_key
```

## After deploy — verify

1. Open `https://yourdomain.com/api/health` — expect `"smtpConfigured": true`
2. Open `https://yourdomain.com/api/debug-email?to=info@cryptorecoveryasset.com` — test email
3. Submit the **INTAKE_INITIALIZATION** form — check **info@cryptorecoveryasset.com**

## Do not commit secrets

- `.env` is gitignored — set SMTP password only in Hostinger env vars
- Never push `SMTP_PASS` to GitHub

## Local production test (before pushing)

```bash
npm run build
npm start
```

Visit http://localhost:3000
