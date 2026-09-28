const KEY = "cra_last_intake_v1";

export type IntakeSession = {
  caseId?: string;
  email: string;
  operatorAlias?: string;
  phone?: string;
  estimatedValue?: number;
  targetNetwork?: string;
  incidentVector?: string;
  caseNarrative?: string;
  createdAt?: string;
};

export function saveIntakeSession(session: IntakeSession): void {
  const payload = JSON.stringify(session);
  try {
    sessionStorage.setItem(KEY, payload);
    localStorage.setItem(KEY, payload);
  } catch {
    /* private mode */
  }
}

export function loadIntakeSession(): IntakeSession | null {
  try {
    const raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IntakeSession;
    if (!parsed?.email || typeof parsed.email !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function intakeSessionToCase(session: IntakeSession) {
  const caseId = session.caseId?.trim() || "";
  return {
    id: caseId || session.email,
    caseId: caseId || undefined,
    storageSource: "server" as const,
    firestoreDocId: null,
    secureComms: session.email,
    email: session.email,
    operatorAlias: session.operatorAlias,
    name: session.operatorAlias,
    phone: session.phone,
    estimatedValue: session.estimatedValue,
    targetNetwork: session.targetNetwork,
    incidentVector: session.incidentVector,
    caseNarrative: session.caseNarrative,
    status: "PENDING",
    createdAt: session.createdAt || new Date().toISOString(),
  };
}
