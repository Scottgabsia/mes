import fs from "fs";
import path from "path";
import { generateCaseId } from "./email";

export type StoredCase = Record<string, unknown> & {
  id: string;
  caseId?: string;
  createdAt: string;
  status: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
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
  };

  store.cases.unshift(entry);
  if (store.cases.length > 500) {
    store.cases = store.cases.slice(0, 500);
  }
  writeStore(store);
  return entry;
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
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
  return [...store.cases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateRecoveryCaseStatus(
  caseId: string,
  status: string
): StoredCase | null {
  const store = ensureStore();
  const idx = store.cases.findIndex(
    (c) => c.id === caseId || c.caseId === caseId
  );
  if (idx === -1) return null;
  store.cases[idx] = {
    ...store.cases[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.cases[idx];
}
