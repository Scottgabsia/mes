import { apiPost } from "./api";
import { trackIntakeLead } from "./adsTracking";

function isEmailJsConfigured(): boolean {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return Boolean(
    env?.VITE_EMAILJS_SERVICE_ID?.trim() &&
      env?.VITE_EMAILJS_TEMPLATE_ID?.trim() &&
      env?.VITE_EMAILJS_PUBLIC_KEY?.trim()
  );
}

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
  const { createdAt: _createdAt, ...apiData } = submissionData;
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
      const { sendIntakeEmailViaEmailJs } = await import("./emailjs");
      await sendIntakeEmailViaEmailJs(payload);
      emailSent = true;
    } catch (err) {
      console.warn("EmailJS intake failed:", err);
    }
  }

  if (error) {
    console.warn("Intake API:", error);
  }

  const persistFirestore = () =>
    Promise.all([import("firebase/firestore"), import("./firebase")])
      .then(([{ collection, addDoc, serverTimestamp }, { db }]) =>
        addDoc(collection(db, "recovery_requests"), {
          ...submissionData,
          ...(caseId ? { caseId } : {}),
          createdAt: submissionData.createdAt ?? serverTimestamp(),
        })
      )
      .catch((fsError) => {
        console.warn(
          "Firestore intake save failed (server store is primary):",
          fsError
        );
      });

  if (serverSaved || emailSent) {
    trackIntakeLead({
      formId: String(submissionData.formSource || "intake"),
      service: String(
        submissionData.service || submissionData.incidentVector || ""
      ),
      value: Number(submissionData.estimatedValue) || 0,
    });
    void persistFirestore();
    return { caseId, serverSaved, emailSent };
  }

  await persistFirestore();
  return { caseId, serverSaved, emailSent };
}
