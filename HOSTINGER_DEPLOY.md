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

## Build error: `TAR_ENTRY_ERROR Unknown system error -122`

Linux error **-122** is **EDQUOT** (disk quota or inode/file-count limit exceeded). Hostinger is not failing on your code. `npm` ran out of room while unpacking `node_modules` (often `lucide-react` or `motion`, which contain thousands of tiny files).

The failing path is usually:

`/home/u695441817/domains/cryptorecoveryasset.com/.builds/source/repository/node_modules/...`

`.builds` is Hostinger’s Git deploy cache. Failed installs leave half-written `node_modules` behind, so the next deploy has even less space.

### 1. Check usage

hPanel → **Usage** (or **Disk Usage**). Note both:

- **Disk space**
- **Inodes** (number of files) — this is the usual limit on shared plans

### 2. Free space (do this before Redeploy)

In **File Manager** (enable hidden files) or SSH, go to:

`/home/u695441817/domains/cryptorecoveryasset.com/`

Delete these if they exist (do **not** delete `data`, `case-data`, or `cryptorecovery-case-data`):

- `.builds/` — old GitHub build copies
- `.npm/` — npm cache
- leftover `node_modules/` inside the Node app folder and any old clone
- Hostinger **Trash** (deleted files still count until emptied)
- old backups / unused websites on the same account

SSH (if enabled):

```bash
cd /home/u695441817/domains/cryptorecoveryasset.com
rm -rf .builds .npm
find . -name node_modules -type d -prune -print
# review the list, then remove leftover install folders only — never data/case-data
```

### 3. Redeploy

hPanel → Node.js app:

| Setting | Value |
|---------|--------|
| Install command | `npm ci --omit=optional --no-audit --no-fund` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Entry file | `app.cjs` |
| Output directory | leave empty |

Click **Redeploy**.

If it still fails at `-122`, the account is still over quota. Upgrade the Hostinger plan or delete more files until Usage is well under the limit, then redeploy again.

---

## Environment variables (email)

**Titan SMTP (recommended):**

```
NODE_ENV=production
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@cryptorecoveryasset.com
SMTP_PASS=your_titan_app_password
ADMIN_EMAIL=info@cryptorecoveryasset.com
```

Or **Resend** — see **EMAIL_SETUP.md**. SMTP is used when both are set.

Do **not** set `PORT` — Hostinger sets it automatically.

Redeploy after changing env vars.

---

## Persistent case data (critical — read this)

**Every GitHub redeploy replaces the app folder.** Cases must live in a folder Hostinger does **not** wipe: your **home directory**, not `data/` inside the Node app and not `.builds`.

The app now defaults to:

```
/home/u695441817/cryptorecovery-case-data
```

It also scans leftover `recovery-cases.json` files (old `data/`, `case-data/`, even `.builds`) and merges them on startup. Writes are atomic with a `.bak` backup.

**Recommended:** set this in hPanel → Node.js app → Environment variables:

```env
CASE_DATA_DIR=/home/u695441817/cryptorecovery-case-data
```

1. In **File Manager**, go up to `/home/u695441817/` (or use SSH) and create folder `cryptorecovery-case-data` if it does not exist.
2. Add `CASE_DATA_DIR` above.
3. **Do not delete** `cryptorecovery-case-data` when you clean `.builds` or `node_modules`.
4. **Redeploy** the Node app.

After deploy, open `/api/health` and confirm:

- `"caseStore": { "writable": true, "persistent": true }`
- `"caseCount"` matches your cases
- No `warning` about deploy folder

If admin looks empty after a past deploy, open admin on the **same browser** you used before — a **Restore cases to server** button appears if this browser still has the last list cached.

If you had cases before this fix, search File Manager for **`recovery-cases.json`** (old app `data/` folder or email backups) and copy it into `cryptorecovery-case-data`, then restart/redeploy once.

Full feature checklist: **`docs/PRODUCTION_CHECKLIST.md`**

## Verify after deploy

1. `https://cryptorecoveryasset.com/api/health`  
   - **Good:** `{"status":"online","runtime":"node","smtpConfigured":true,"caseStore":{"writable":true},...}`  
   - **Bad:** HTML or Hostinger 404 → domain still on static hosting; fix table above

2. Test email:  
   `https://cryptorecoveryasset.com/api/debug-email?to=info@cryptorecoveryasset.com`

3. Submit the intake form; check **info@cryptorecoveryasset.com** (and spam).

4. Admin: `/admin/login` → cases list → messaging + milestones on a test case.

5. Client: case lookup by email → messages + keyphrase (when status is ANALYSIS).

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
