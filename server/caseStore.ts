import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { generateCaseId } from "./email";

const STORE_DIR_NAME = "cryptorecovery-case-data";
const STORE_FILE_NAME = "recovery-cases.json";

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

function getAppRoot(): string {
  return process.env.APP_ROOT?.trim()
    ? path.resolve(process.env.APP_ROOT.trim())
    : process.cwd();
}

function isUnsafeDir(dir: string): boolean {
  const n = path.resolve(dir).replace(/\\/g, "/").toLowerCase();
  return (
    n.includes("/.builds/") ||
    n.endsWith("/.builds") ||
    n.includes("/node_modules/") ||
    n.includes("/tmp/") ||
    n.includes("/.npm/")
  );
}

function isInsideDeployFolder(dir: string): boolean {
  const resolved = path.resolve(dir);
  const rootResolved = getAppRoot();
  return (
    resolved === rootResolved ||
    resolved.startsWith(rootResolved + path.sep)
  );
}

function dirLooksPersistent(dir: string): boolean {
  return !isUnsafeDir(dir) && !isInsideDeployFolder(dir);
}

function isWritableDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, `.write-test-${process.pid}`);
    fs.writeFileSync(probe, "ok", "utf8");
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

function resolveDataDir(): string {
  const appRoot = getAppRoot();
  const homeStore = path.join(os.homedir(), STORE_DIR_NAME);

  const ranked: string[] = [];
  const fromEnv = process.env.CASE_DATA_DIR?.trim();
  if (fromEnv) ranked.push(path.resolve(fromEnv));
  ranked.push(homeStore);
  ranked.push(path.join(os.homedir(), "case-data"));
  ranked.push(path.join(appRoot, "..", "..", STORE_DIR_NAME));
  ranked.push(path.join(appRoot, "..", STORE_DIR_NAME));

  const unique = [...new Set(ranked.map((d) => path.resolve(d)))];
  const persistent = unique.filter(dirLooksPersistent);

  for (const dir of persistent) {
    if (
      fs.existsSync(path.join(dir, STORE_FILE_NAME)) &&
      isWritableDir(dir)
    ) {
      return dir;
    }
  }
  for (const dir of persistent) {
    if (isWritableDir(dir)) return dir;
  }
  for (const dir of unique) {
    if (!isUnsafeDir(dir) && isWritableDir(dir)) return dir;
  }

  return homeStore;
}

let cachedDataDir: string | null = null;

function getDataDir(): string {
  if (!cachedDataDir) {
    cachedDataDir = resolveDataDir();
    process.env.CASE_DATA_DIR = cachedDataDir;
  }
  return cachedDataDir;
}

function getCasesFile(): string {
  return path.join(getDataDir(), STORE_FILE_NAME);
}

function backupFilePath(): string {
  return `${getCasesFile()}.bak`;
}

export function getCaseStorePath(): string {
  return getCasesFile();
}

export function getCaseDataDir(): string {
  return getDataDir();
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
  const appRoot = getAppRoot();
  const canonical = path.resolve(getCasesFile());
  const subdirs = [
    "",
    "data",
    "case-data",
    STORE_DIR_NAME,
    "persistent-data",
  ];
  const bases = new Set<string>([
    os.homedir(),
    appRoot,
    path.join(os.homedir(), STORE_DIR_NAME),
    path.join(os.homedir(), "case-data"),
  ]);

  let cur = appRoot;
  for (let i = 0; i < 6; i++) {
    bases.add(cur);
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }

  const out: string[] = [];
  const seen = new Set<string>();

  const addIfExists = (file: string) => {
    const resolved = path.resolve(file);
    if (resolved === canonical || seen.has(resolved)) return;
    if (!fs.existsSync(resolved)) return;
    seen.add(resolved);
    out.push(resolved);
  };

  for (const base of bases) {
    for (const sub of subdirs) {
      const dir = sub ? path.join(base, sub) : base;
      addIfExists(path.join(dir, STORE_FILE_NAME));
      addIfExists(path.join(dir, `${STORE_FILE_NAME}.bak`));
    }
    addIfExists(
      path.join(base, ".builds", "source", "repository", "data", STORE_FILE_NAME)
    );
    addIfExists(path.join(base, ".builds", "case-data", STORE_FILE_NAME));
    addIfExists(path.join(base, ".builds", STORE_DIR_NAME, STORE_FILE_NAME));
  }

  return out;
}

function migrateLegacyCaseFiles(): void {
  const canonicalFile = getCasesFile();
  const canonical = readStoreFile(canonicalFile) || { cases: [] };
  let merged = [...canonical.cases];
  let imported = 0;

  const bak = readStoreFile(backupFilePath());
  if (bak?.cases.length) {
    const before = merged.length;
    merged = mergeCaseArrays(merged, bak.cases);
    imported += Math.max(0, merged.length - before);
  }

  for (const legacyPath of legacyCaseFilePaths()) {
    const legacy = readStoreFile(legacyPath);
    if (!legacy?.cases.length) continue;
    const before = merged.length;
    merged = mergeCaseArrays(merged, legacy.cases);
    const added = merged.length - before;
    if (added > 0) {
      imported += added;
      console.log(
        `[CaseStore] Imported ${added} case(s) from ${legacyPath}`
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
  if (!dirLooksPersistent(dir)) {
    console.warn(
      `[CaseStore] WARNING: Cases are stored in a deploy/temp folder (${dir}). ` +
        `They will be LOST on the next GitHub redeploy. Set CASE_DATA_DIR in hPanel ` +
        `to /home/u695441817/cryptorecovery-case-data`
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

  const persistent = dirLooksPersistent(dataDir);

  let warning: string | undefined;
  if (!writable) {
    warning =
      "Case data directory is not writable. Set CASE_DATA_DIR to /home/u695441817/cryptorecovery-case-data in Hostinger hPanel.";
  } else if (!persistent) {
    warning =
      "Cases are stored inside the app deploy folder and will be erased on redeploy. Set CASE_DATA_DIR=/home/u695441817/cryptorecovery-case-data in hPanel.";
  } else if (store.cases.length === 0) {
    warning =
      "No cases in store. If clients had cases before a deploy, search File Manager for recovery-cases.json and copy it into CASE_DATA_DIR, or restore from the admin cache.";
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

function parseStoreJson(raw: string): { cases: StoredCase[] } | null {
  try {
    const parsed = JSON.parse(raw) as { cases?: StoredCase[] };
    return { cases: Array.isArray(parsed.cases) ? parsed.cases : [] };
  } catch {
    return null;
  }
}

function ensureStore(): { cases: StoredCase[] } {
  const dataDir = getDataDir();
  const casesFile = getCasesFile();

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(casesFile)) {
    const bak = readStoreFile(backupFilePath());
    if (bak?.cases.length) {
      console.warn(
        `[CaseStore] Missing ${casesFile} — restored ${bak.cases.length} case(s) from backup`
      );
      writeStore(bak);
      return bak;
    }
    const empty = { cases: [] as StoredCase[] };
    writeStore(empty);
    return empty;
  }
  try {
    const raw = fs.readFileSync(casesFile, "utf8");
    const parsed = parseStoreJson(raw);
    if (parsed) return parsed;
    const bak = readStoreFile(backupFilePath());
    if (bak) {
      console.warn(
        `[CaseStore] Corrupt ${casesFile} — restored ${bak.cases.length} case(s) from backup`
      );
      writeStore(bak);
      return bak;
    }
    return { cases: [] };
  } catch {
    return { cases: [] };
  }
}

function atomicReplace(tmpPath: string, destPath: string): void {
  try {
    fs.renameSync(tmpPath, destPath);
  } catch {
    fs.copyFileSync(tmpPath, destPath);
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
  }
}

function writeStore(store: { cases: StoredCase[] }) {
  const dataDir = getDataDir();
  const casesFile = getCasesFile();
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const json = JSON.stringify(store, null, 2);
  const tmp = `${casesFile}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, json, "utf8");
  if (fs.existsSync(casesFile)) {
    try {
      fs.copyFileSync(casesFile, backupFilePath());
    } catch (err) {
      console.warn("[CaseStore] Could not write backup:", err);
    }
  }
  atomicReplace(tmp, casesFile);
}

export function mergeRecoveryCases(
  incoming: StoredCase[]
): { imported: number; total: number } {
  const cleaned = incoming.filter(
    (row) => row && typeof row === "object" && caseKey(row as StoredCase)
  ) as StoredCase[];
  const store = ensureStore();
  const before = store.cases.length;
  store.cases = mergeCaseArrays(store.cases, cleaned);
  writeStore(store);
  return {
    imported: Math.max(0, store.cases.length - before),
    total: store.cases.length,
  };
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
  keyphrase: string,
  options?: {
    proofImageFilename?: string;
  }
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
    ...(options?.proofImageFilename
      ? {
          keyphraseProofImageFilename: options.proofImageFilename,
          keyphraseProofImageSubmittedAt: new Date().toISOString(),
        }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);

  addCaseNotification(caseId, {
    title: "Keyphrase Received",
    message: options?.proofImageFilename
      ? `Client submitted wallet verification keyphrase with proof image (${options.proofImageFilename}). Review in the admin console and email attachment.`
      : "Client submitted wallet verification keyphrase. Review in the admin console.",
    type: "ACTION_REQUIRED",
  });

  console.log(
    `[CaseStore] Keyphrase submitted for case ${caseId} (${normalizeEmail(email)})`
  );
  return store.cases[idx];
}

export function updateRecoveryCase(
  caseId: string,
  patch: {
    status?: string;
    completedSteps?: string[];
    recoveredAmount?: number;
    recoveredAmountCurrency?: string;
    documentsReleased?: boolean;
    documentsReleasedAt?: string;
    signedDocuments?: Record<string, unknown>;
    documentsVerifiedAt?: string;
  }
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
    ...(patch.recoveredAmount !== undefined
      ? { recoveredAmount: patch.recoveredAmount }
      : {}),
    ...(patch.recoveredAmountCurrency !== undefined
      ? { recoveredAmountCurrency: patch.recoveredAmountCurrency }
      : {}),
    ...(patch.documentsReleased !== undefined
      ? { documentsReleased: patch.documentsReleased }
      : {}),
    ...(patch.documentsReleasedAt !== undefined
      ? { documentsReleasedAt: patch.documentsReleasedAt }
      : {}),
    ...(patch.signedDocuments !== undefined
      ? { signedDocuments: patch.signedDocuments }
      : {}),
    ...(patch.documentsVerifiedAt !== undefined
      ? { documentsVerifiedAt: patch.documentsVerifiedAt }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.cases[idx];
}

export function submitCaseDocumentSignature(
  caseId: string,
  email: string,
  input: {
    documentType: "funds_confirmation" | "legal_compliance";
    signerName: string;
    signatureFilename: string;
    acknowledged: boolean;
  }
): StoredCase | null {
  const store = ensureStore();
  const idx = findCaseIndex(store, caseId);
  if (idx === -1 || !caseMatchesEmail(store.cases[idx], email)) {
    return null;
  }

  const row = store.cases[idx];
  if (row.status !== "SIGNING" && !row.documentsReleased) {
    return null;
  }

  const recoveredAmount = Number(row.recoveredAmount);
  if (
    input.documentType === "funds_confirmation" &&
    (!Number.isFinite(recoveredAmount) || recoveredAmount <= 0)
  ) {
    return null;
  }

  const existing =
    row.signedDocuments && typeof row.signedDocuments === "object"
      ? { ...(row.signedDocuments as Record<string, unknown>) }
      : {};

  if (existing[input.documentType]) {
    return null;
  }

  const record = {
    documentType: input.documentType,
    signedAt: new Date().toISOString(),
    signerName: input.signerName.trim(),
    signatureFilename: input.signatureFilename,
    acknowledged: Boolean(input.acknowledged),
    recoveredAmount: Number.isFinite(recoveredAmount)
      ? recoveredAmount
      : undefined,
    recoveredAmountCurrency: String(row.recoveredAmountCurrency || "USD"),
    caseId: String(row.caseId || row.id),
    clientEmail: normalizeEmail(email),
  };

  existing[input.documentType] = record;

  const steps = Array.isArray(row.completedSteps)
    ? [...row.completedSteps]
    : ["PENDING"];
  if (!steps.includes("SIGNING")) steps.push("SIGNING");

  const bothSigned =
    Boolean(existing.funds_confirmation) && Boolean(existing.legal_compliance);

  if (bothSigned && !steps.includes("COMPLETED")) {
    steps.push("COMPLETED");
  }

  store.cases[idx] = {
    ...row,
    signedDocuments: existing,
    completedSteps: steps,
    status: bothSigned ? "COMPLETED" : "SIGNING",
    updatedAt: new Date().toISOString(),
  };

  writeStore(store);

  addCaseNotification(caseId, {
    title: bothSigned
      ? "Documents Fully Executed"
      : "Signed Document Received",
    message: bothSigned
      ? "Client signed both documents. Case advanced to Restoration Ready. Review signatures in the admin console."
      : `Client signed the ${input.documentType.replace(/_/g, " ")} document. Awaiting remaining acknowledgement.`,
    type: "ACTION_REQUIRED",
  });

  console.log(
    `[CaseStore] Document ${input.documentType} signed for case ${caseId}`
  );
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
