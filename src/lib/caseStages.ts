/** Canonical recovery case stages — shared by admin + client portal. */

export type CaseStageId =
  | "PENDING"
  | "INITIALIZING"
  | "ANALYSIS"
  | "PROCESSING"
  | "RECOVERY"
  | "SIGNING"
  | "COMPLETED";

export type CaseDocumentType = "funds_confirmation" | "legal_compliance";

export const CASE_STAGES: {
  id: CaseStageId;
  label: string;
  clientTitle: string;
  showInClientTimeline: boolean;
}[] = [
  {
    id: "PENDING",
    label: "Intake Received",
    clientTitle: "Intake Received",
    showInClientTimeline: true,
  },
  {
    id: "INITIALIZING",
    label: "Metadata Extraction",
    clientTitle: "Metadata Extraction",
    showInClientTimeline: true,
  },
  {
    id: "ANALYSIS",
    label: "Wallet Verification Journey Analysis",
    clientTitle: "Wallet Verification Journey",
    showInClientTimeline: true,
  },
  {
    id: "PROCESSING",
    label: "Transaction Forensic Trace",
    clientTitle: "Transaction Forensic Trace",
    showInClientTimeline: true,
  },
  {
    id: "RECOVERY",
    label: "Asset Recovery",
    clientTitle: "Asset Recovery",
    showInClientTimeline: true,
  },
  {
    id: "SIGNING",
    label: "Document Acknowledgement",
    clientTitle: "Document Acknowledgement",
    showInClientTimeline: true,
  },
  {
    id: "COMPLETED",
    label: "Restoration Ready",
    clientTitle: "Restoration Ready",
    showInClientTimeline: false,
  },
];

export const CLIENT_TIMELINE_STAGES = CASE_STAGES.filter(
  (s) => s.showInClientTimeline
);

export const DOCUMENT_TYPES: {
  id: CaseDocumentType;
  title: string;
  shortLabel: string;
}[] = [
  {
    id: "funds_confirmation",
    title: "Funds Recovery Confirmation",
    shortLabel: "Funds Confirmation",
  },
  {
    id: "legal_compliance",
    title: "Legal & Compliance Acknowledgement",
    shortLabel: "Legal & Compliance",
  },
];

export function stageIndex(status: string): number {
  const idx = CASE_STAGES.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
}

export function clientTimelineIndex(status: string): number {
  if (status === "COMPLETED") return CLIENT_TIMELINE_STAGES.length - 1;
  const idx = CLIENT_TIMELINE_STAGES.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
}

export function buildDocumentPreview(options: {
  documentType: CaseDocumentType;
  caseId: string;
  clientName: string;
  recoveredAmount: number;
  currency?: string;
}): {
  title: string;
  reference: string;
  paragraphs: string[];
  amountLine?: string;
} {
  const amount = formatRecoveredAmount(
    options.recoveredAmount,
    options.currency || "USD"
  );
  const ref = `CRA-${options.caseId.slice(0, 10).toUpperCase()}-${options.documentType === "funds_confirmation" ? "FRC" : "LCA"}`;

  if (options.documentType === "funds_confirmation") {
    return {
      title: "Funds Recovery Confirmation",
      reference: ref,
      amountLine: amount,
      paragraphs: [
        `This confirms that Crypto Recovery Assets Agency has completed asset recovery procedures for case ${options.caseId} on behalf of ${options.clientName}.`,
        `The recovered amount of ${amount} has been verified through forensic trace and exchange compliance channels.`,
        "By signing, the client acknowledges receipt of this confirmation and agrees to follow the next-step instructions provided by the blockchain company / custodial partner for final settlement.",
        "This instrument is issued under the agency’s corporate authentication and compliance certification seals and is retained for audit and verification.",
      ],
    };
  }

  return {
    title: "Legal & Compliance Acknowledgement",
    reference: ref,
    paragraphs: [
      `This Legal & Compliance Acknowledgement relates to recovery case ${options.caseId} for ${options.clientName}.`,
      "The client confirms that information provided during intake and investigation was accurate to the best of their knowledge, and that recovered funds will be received only through authorised settlement channels.",
      "The client acknowledges applicable AML/KYC obligations, agrees not to circumvent compliance controls, and authorises Crypto Recovery Assets Agency to retain this signed record for regulatory and dispute-resolution purposes.",
      "Signing this document does not constitute a guarantee of additional recoveries beyond amounts already confirmed in the Funds Recovery Confirmation.",
    ],
  };
}

export function formatRecoveredAmount(
  amount: number | string | undefined | null,
  currency = "USD"
): string {
  const n = typeof amount === "string" ? Number(amount) : Number(amount);
  if (!Number.isFinite(n) || n < 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
