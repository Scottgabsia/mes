import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { apiPost } from "./api";
import {
  isEmailJsConfigured,
  sendIntakeEmailViaEmailJs,
} from "./emailjs";

export type IntakeSubmission = Record<string, unknown> & {
  secureComms: string;
  operatorAlias?: string;
  createdAt?: unknown;
};

/**
 * Production intake flow: save to server first (admin panel + case lookup),
 * then Firestore (best effort), then EmailJS only if the API is unreachable.
 */
export async function submitRecoveryCase(
  submissionData: IntakeSubmission
): Promise<{
  caseId?: string;
  serverSaved: boolean;
  emailSent: boolean;
}> {
  const { createdAt, ...apiData } = submissionData;
  const payload = {
    ...apiData,
    timestamp: new Date().toISOString(),
  };

  let caseId: string | undefined;
  let serverSaved = false;
  let emailSent = false;

  const { ok, data, error } = await apiPost<{
    success?: boolean;
    caseId?: string;
    emailSent?: boolean;
  }>("/api/submit-recovery", payload);

  if (ok && data?.success) {
    serverSaved = true;
    caseId = data.caseId;
    emailSent = Boolean(data.emailSent);
  } else if (isEmailJsConfigured()) {
    try {
      await sendIntakeEmailViaEmailJs(payload);
      emailSent = true;
    } catch (err) {
      console.warn("EmailJS intake failed:", err);
    }
  }

  if (error) {
    console.warn("Intake API:", error);
  }

  try {
    await addDoc(collection(db, "recovery_requests"), {
      ...submissionData,
      ...(caseId ? { caseId } : {}),
      createdAt: createdAt ?? serverTimestamp(),
    });
  } catch (fsError) {
    console.warn("Firestore intake save failed (server store is primary):", fsError);
  }

  return { caseId, serverSaved, emailSent };
}
