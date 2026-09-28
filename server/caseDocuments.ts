import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { StoredCase } from "./caseStore";
import { getCaseDataDir } from "./caseStore";

export type CaseDocumentType = "funds_confirmation" | "legal_compliance";

export type SignedDocumentRecord = {
  documentType: CaseDocumentType;
  signedAt: string;
  signerName: string;
  signatureFilename: string;
  acknowledged: boolean;
  recoveredAmount?: number;
  recoveredAmountCurrency?: string;
  caseId: string;
  clientEmail: string;
  verifiedByAdmin?: boolean;
  verifiedAt?: string;
};

const DOC_TYPES = new Set<CaseDocumentType>([
  "funds_confirmation",
  "legal_compliance",
]);

const MAX_SIGNATURE_BYTES = 800 * 1024;

export function isCaseDocumentType(value: unknown): value is CaseDocumentType {
  return typeof value === "string" && DOC_TYPES.has(value as CaseDocumentType);
}

function signedDocsDir(caseId: string): string {
  const dir = path.join(getCaseDataDir(), "signed-docs", caseId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function parseDataUrlImage(dataUrl: string): {
  mimeType: string;
  buffer: Buffer;
} | null {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=\s]+)$/i.exec(
    dataUrl.trim()
  );
  if (!match) return null;
  const mimeType = match[1].toLowerCase().replace("image/jpg", "image/jpeg");
  const buffer = Buffer.from(match[2].replace(/\s+/g, ""), "base64");
  if (!buffer.length || buffer.length > MAX_SIGNATURE_BYTES) return null;
  return { mimeType, buffer };
}

export function getSignedDocuments(
  row: StoredCase
): Partial<Record<CaseDocumentType, SignedDocumentRecord>> {
  const raw = row.signedDocuments;
  if (!raw || typeof raw !== "object") return {};
  return raw as Partial<Record<CaseDocumentType, SignedDocumentRecord>>;
}

export function bothDocumentsSigned(row: StoredCase): boolean {
  const docs = getSignedDocuments(row);
  return Boolean(docs.funds_confirmation && docs.legal_compliance);
}

export function persistSignatureFile(
  caseId: string,
  documentType: CaseDocumentType,
  dataUrl: string
): string {
  const parsed = parseDataUrlImage(dataUrl);
  if (!parsed) {
    throw new Error(
      "Invalid signature image. Draw your signature or upload a PNG/JPEG under 800KB."
    );
  }
  const ext = parsed.mimeType.includes("png")
    ? "png"
    : parsed.mimeType.includes("webp")
      ? "webp"
      : "jpg";
  const filename = `${documentType}-signature-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const fullPath = path.join(signedDocsDir(caseId), filename);
  fs.writeFileSync(fullPath, parsed.buffer);
  return filename;
}

export function readSignatureFile(
  caseId: string,
  filename: string
): { mimeType: string; buffer: Buffer } | null {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  const fullPath = path.join(getCaseDataDir(), "signed-docs", caseId, filename);
  if (!fs.existsSync(fullPath)) return null;
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  return { mimeType, buffer };
}

export function writeSignedDocumentMeta(
  caseId: string,
  record: SignedDocumentRecord
): void {
  const metaPath = path.join(
    signedDocsDir(caseId),
    `${record.documentType}.json`
  );
  fs.writeFileSync(metaPath, JSON.stringify(record, null, 2), "utf8");
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
  const currency = options.currency || "USD";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(options.recoveredAmount);
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
