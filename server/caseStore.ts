import crypto from "crypto";
import fs from "fs";
import path from "path";
import { generateCaseId } from "./email";

export type StoredMessage = {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  type: string;
  createdAt: string;
};

export type StoredNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export type StoredCase = Record<string, unknown> & {
  id: string;
  caseId?: string;
  createdAt: string;
  status: string;
  completedSteps?: string[];
  messages?: StoredMessage[];
  notifications?: StoredNotification[];
  updatedAt?: string;
};

function newId(): string {
  return crypto.randomUUID();
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function caseKey(row: StoredCase): string {
  return String(row.id || row.caseId || "");
}

function caseTimestamp(row: StoredCase): number {
  const raw = row.updatedAt || row.createdAt;
  const t = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

function mergeCaseArrays(
  primary: StoredCase[],
  secondary: StoredCase[]
): StoredCase[] {
  const byId = new Map<string, StoredCase>();
  for (const row of [...primary, ...secondary]) {
    const key = caseKey(row);
    if (!key) continue;
    const existing = byId.get(key);
    if (!existing || caseTimestamp(row) >= caseTimestamp(existing)) {
      byId.set(key, row);
    }
  }
  return Array.from(byId.values());
}

function findCaseIndex(store: { cases: StoredCase[] }, caseId: string): number {
  return store.cases.findIndex((c) => c.id === caseId || c.caseId === caseId);
}

function normalizeStoredCase(row: StoredCase): StoredCase {
  return {
    ...row,
    completedSteps: Array.isArray(row.completedSteps)
      ? row.completedSteps
      : [typeof row.status === "string" ? row.status : "PENDING"],
    messages: Array.isArray(row.messages) ? row.messages : [],
    notifications: Array.isArray(row.notifications) ? row.notifications : [],
  };
}

function resolveDataDir(): string {
  const fromEnv = process.env.CASE_DATA_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);

  const cwd = process.cwd();
  const appRoot = process.env.APP_ROOT?.trim()
    ? path.resolve(process.env.APP_ROOT.trim())
    : cwd;

  const candidates = [
    path.join(appRoot, "..", "..", "case-data"),
    path.join(appRoot, "..", "case-data"),
    path.join(cwd, "data"),
    path.join(cwd, "..", "data"),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "recovery-cases.json"))) {
      return dir;
    }
  }

  return candidates[0];
}

let cachedDataDir: string | null = null;

function getDataDir(): string {
  if (!cachedDataDir) {
    cachedDataDir = resolveDataDir();
  }
  return cachedDataDir;
}

function getCasesFile(): string {
  return path.join(getDataDir(), "recovery-cases.json");
}

function isInsideDeployFolder(dir: string): boolean {
  const appRoot = process.env.APP_ROOT?.trim()
    ? path.resolve(process.env.APP_ROOT.trim())
    : process.cwd();
  const resolved = path.resolve(dir);
  const rootResolved = path.resolve(appRoot);
  return (
    resolved === rootResolved ||
    resolved.startsWith(rootResolved + path.sep)
  );
}

function isExplicitPersistentDir(): boolean {
  return Boolean(process.env.CASE_DATA_DIR?.trim());
}

export function getCaseStorePath(): string {
  return getCasesFile();
}

function readStoreFile(filePath: string): { cases: StoredCase[] } | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as { cases?: StoredCase[] };
    return {
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
    };
  } catch {
    return null;
  }
}

function legacyCaseFilePaths(): string[] {
  const cwd = process.cwd();
  const appRoot = process.env.APP_ROOT?.trim()
    ? path.resolve(process.env.APP_ROOT.trim())
    : cwd;
  const canonical = getCasesFile();

  const candidates = [
    path.join(appRoot, "data", "recovery-cases.json"),
    path.join(cwd, "data", "recovery-cases.json"),
    path.join(cwd, "..", "data", "recovery-cases.json"),
    path.join(appRoot, "..", "data", "recovery-cases.json"),
    path.join(appRoot, "..", "case-data", "recovery-cases.json"),
    path.join(appRoot, "..", "..", "case-data", "recovery-cases.json"),
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const file of candidates) {
    const resolved = path.resolve(file);
    if (resolved === path.resolve(canonical)) continue;
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (fs.existsSync(resolved)) out.push(resolved);
  }
  return out;
}

function migrateLegacyCaseFiles(): void {
  const canonicalFile = getCasesFile();
  const canonical = readStoreFile(canonicalFile) || { cases: [] };
  let merged = [...canonical.cases];
  let imported = 0;

  for (const legacyPath of legacyCaseFilePaths()) {
    const legacy = readStoreFile(legacyPath);
    if (!legacy?.cases.length) continue;
    const before = merged.length;
    merged = mergeCaseArrays(merged, legacy.cases);
    const added = merged.length - before;
    if (added > 0) {
      imported += added;
      console.log(
        `[CaseStore] Imported ${added} case(s) from legacy file ${legacyPath}`
      );
    }
  }

  if (merged.length > canonical.cases.length) {
    writeStore({ cases: merged });
    console.log(
      `[CaseStore] Migration complete — ${merged.length} total case(s) at ${canonicalFile}`
    );
  } else if (imported === 0 && canonical.cases.length === 0) {
    const legacyPaths = legacyCaseFilePaths();
    if (legacyPaths.length > 0) {
      console.warn(
        `[CaseStore] Legacy case files exist but could not be read. Check permissions on:`,
        legacyPaths.join(", ")
      );
    }
  }
}

export function initCaseStore(): void {
  migrateLegacyCaseFiles();
  ensureStore();
  const dir = getDataDir();
  try {
    fs.accessSync(dir, fs.constants.W_OK);
  } catch {
    console.warn(
      `[CaseStore] Directory may not be writable: ${dir}. Set CASE_DATA_DIR to a persistent path on Hostinger.`
    );
  }
  if (isInsideDeployFolder(dir) && !isExplicitPersistentDir()) {
    console.warn(
      `[CaseStore] WARNING: Cases are stored inside the deploy folder (${dir}). ` +
        `They will be LOST on the next GitHub redeploy. Set CASE_DATA_DIR in hPanel ` +
        `to e.g. /home/USER/domains/cryptorecoveryasset.com/data`
    );
  }
}

export function getCaseStoreDiagnostics(): {
  dataDir: string;
  casesFile: string;
  caseCount: number;
  writable: boolean;
  persistent: boolean;
  warning?: string;
} {
  const store = ensureStore();
  const dataDir = getDataDir();
  let writable = true;
  try {
    fs.accessSync(dataDir, fs.constants.W_OK);
  } catch {
    writable = false;
  }

  const persistent =
    isExplicitPersistentDir() || !isInsideDeployFolder(dataDir);

  let warning: string | undefined;
  if (!writable) {
    warning =
      "Case data directory is not writable. Set CASE_DATA_DIR to a folder you created in Hostinger File Manager.";
  } else if (!persistent) {
    warning =
      "Cases are stored inside the app deploy folder and will be erased on redeploy. Set CASE_DATA_DIR to a path outside the repo (see HOSTINGER_DEPLOY.md).";
  } else if (store.cases.length === 0) {
    warning =
      "No cases in store. If clients had cases before a deploy, set CASE_DATA_DIR to the folder that still contains recovery-cases.json or restore from backup.";
  }

  return {
    dataDir,
    casesFile: getCasesFile(),
    caseCount: store.cases.length,
    writable,
    persistent,
    warning,
  };
}

function ensureStore(): { cases: StoredCase[] } {
  const dataDir = getDataDir();
  const casesFile = getCasesFile();

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(casesFile)) {
    const empty = { cases: [] as StoredCase[] };
    fs.writeFileSync(casesFile, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  try {
    const raw = fs.readFileSync(casesFile, "utf8");
    const parsed = JSON.parse(raw) as { cases?: StoredCase[] };
    return { cases: Array.isArray(parsed.cases) ? parsed.cases : [] };
  } catch {
    return { cases: [] };
  }
}

function writeStore(store: { cases: StoredCase[] }) {
  const dataDir = getDataDir();
  const casesFile = getCasesFile();
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(casesFile, JSON.stringify(store, null, 2), "utf8");
}

export function getRecoveryCaseById(caseId: string): StoredCase | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1) return null;
  const normalized = normalizeStoredCase(store.cases[idx]);
  store.cases[idx] = normalized;
  return normalized;
}

export function caseMatchesEmail(
  caseRow: StoredCase,
  email: string
): boolean {
  const target = normalizeEmail(email);
  if (!target) return false;
  return (
    normalizeEmail(caseRow.secureComms) === target ||
    normalizeEmail(caseRow.email) === target
  );
}

export function appendRecoveryCase(
  payload: Record<string, unknown>
): StoredCase {
  const store = ensureStore();
  const caseId =
    (typeof payload.caseId === "string" && payload.caseId) || generateCaseId();
  const createdAt =
    typeof payload.createdAt === "string"
      ? payload.createdAt
      : new Date().toISOString();

  const entry: StoredCase = {
    ...payload,
    id: caseId,
    caseId,
    createdAt,
    status: (payload.status as string) || "PENDING",
    storageSource: "server",
    completedSteps: Array.isArray(payload.completedSteps)
      ? (payload.completedSteps as string[])
      : ["PENDING"],
    messages: [],
    notifications: [],
  };

  store.cases.unshift(entry);
  if (store.cases.length > 500) {
    store.cases = store.cases.slice(0, 500);
  }
  writeStore(store);
  console.log(
    `[CaseStore] Saved case ${caseId} for ${String(payload.secureComms || payload.email || "unknown")} → ${getCasesFile()}`
  );
  return entry;
}

/** Find the most recent case submitted with this email (server store). */
export function findRecoveryCaseByEmail(email: string): StoredCase | null {
  const target = normalizeEmail(email);
  if (!target) return null;

  const store = ensureStore();
  const matches = store.cases.filter((c) => {
    const comms = normalizeEmail(c.secureComms);
    const em = normalizeEmail(c.email);
    return comms === target || em === target;
  });

  if (matches.length === 0) return null;

  return matches.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
}

export function listRecoveryCases(): StoredCase[] {
  const store = ensureStore();
  store.cases = store.cases.map(normalizeStoredCase);
  return [...store.cases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function submitCaseKeyphrase(
  caseId: string,
  email: string,
  keyphrase: string
): StoredCase | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1 || !caseMatchesEmail(store.cases[idx], email)) {
    return null;
  }

  const trimmed = keyphrase.trim();
  if (!trimmed) return null;

  const existingSteps = Array.isArray(store.cases[idx].completedSteps)
    ? [...store.cases[idx].completedSteps!]
    : ["PENDING"];
  for (const step of ["ANALYSIS", "PROCESSING"]) {
    if (!existingSteps.includes(step)) existingSteps.push(step);
  }

  store.cases[idx] = {
    ...store.cases[idx],
    walletKeyphrase: trimmed,
    status: "PROCESSING",
    completedSteps: existingSteps,
    keyphraseSubmittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);

  addCaseNotification(caseId, {
    title: "Keyphrase Received",
    message:
      "Client submitted wallet verification keyphrase. Review in the admin console.",
    type: "ACTION_REQUIRED",
  });

  console.log(
    `[CaseStore] Keyphrase submitted for case ${caseId} (${normalizeEmail(email)})`
  );
  return store.cases[idx];
}

export function updateRecoveryCase(
  caseId: string,
  patch: { status?: string; completedSteps?: string[] }
): StoredCase | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1) return null;
  store.cases[idx] = {
    ...store.cases[idx],
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.completedSteps !== undefined
      ? { completedSteps: patch.completedSteps }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.cases[idx];
}

export function updateRecoveryCaseStatus(
  caseId: string,
  status: string
): StoredCase | null {
  return updateRecoveryCase(caseId, { status });
}

export function addCaseMessage(
  caseId: string,
  input: {
    text: string;
    sender: string;
    senderId: string;
    type: string;
  }
): StoredMessage | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1) return null;

  const entry: StoredMessage = {
    id: newId(),
    text: input.text,
    sender: input.sender,
    senderId: input.senderId,
    type: input.type,
    createdAt: new Date().toISOString(),
  };

  const messages = Array.isArray(store.cases[idx].messages)
    ? [...store.cases[idx].messages!]
    : [];
  messages.push(entry);
  store.cases[idx] = { ...store.cases[idx], messages };
  writeStore(store);
  return entry;
}

export function addCaseNotification(
  caseId: string,
  input: {
    title: string;
    message: string;
    type: string;
  }
): StoredNotification | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1) return null;

  const entry: StoredNotification = {
    id: newId(),
    title: input.title,
    message: input.message,
    type: input.type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const notifications = Array.isArray(store.cases[idx].notifications)
    ? [...store.cases[idx].notifications!]
    : [];
  notifications.unshift(entry);
  store.cases[idx] = { ...store.cases[idx], notifications };
  writeStore(store);
  return entry;
}

export function markNotificationsRead(
  caseId: string,
  email: string,
  notificationId?: string
): boolean {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1 || !caseMatchesEmail(store.cases[idx], email)) return false;

  const notifications = Array.isArray(store.cases[idx].notifications)
    ? [...store.cases[idx].notifications!]
    : [];

  let changed = false;
  for (let i = 0; i < notifications.length; i++) {
    if (notificationId && notifications[i].id !== notificationId) continue;
    if (!notificationId || notifications[i].id === notificationId) {
      notifications[i] = { ...notifications[i], read: true };
      changed = true;
      if (notificationId) break;
    }
  }

  if (!changed) return false;
  store.cases[idx] = { ...store.cases[idx], notifications };
  writeStore(store);
  return true;
}
