import React from "react";
import { Check, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { OfficialDocument } from "./OfficialDocument";
import { SignaturePad } from "./SignaturePad";
import { DocumentPdfModal } from "./DocumentPdfModal";
import {
  DOCUMENT_TYPES,
  formatRecoveredAmount,
  type CaseDocumentType,
} from "../lib/caseStages";
import {
  clientDocumentSignatureUrl,
  fetchClientDocumentPdf,
  submitClientDocumentSignature,
} from "../lib/caseClientApi";
import type { ClientCaseRecord } from "../lib/caseLookupApi";

type ClientDocumentSigningProps = {
  caseData: ClientCaseRecord;
  onCaseUpdate: (next: ClientCaseRecord) => void;
};

function caseCustomerName(caseData: ClientCaseRecord): string {
  return String(caseData.operatorAlias || caseData.name || "").trim();
}

export const ClientDocumentSigning = ({
  caseData,
  onCaseUpdate,
}: ClientDocumentSigningProps) => {
  const signed = caseData.signedDocuments || {};
  const firstPending =
    DOCUMENT_TYPES.find((doc) => !signed[doc.id])?.id || "funds_confirmation";
  const [activeType, setActiveType] =
    React.useState<CaseDocumentType>(firstPending);
  const [padReset, setPadReset] = React.useState(0);
  const [signerName, setSignerName] = React.useState(caseCustomerName(caseData));
  const [signature, setSignature] = React.useState<string | null>(null);
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewing, setViewing] = React.useState<CaseDocumentType | null>(null);

  React.useEffect(() => {
    setSignerName((prev) => prev.trim() || caseCustomerName(caseData));
  }, [caseData.operatorAlias, caseData.name]);

  const caseId = String(caseData.caseId || caseData.id);
  const email = String(caseData.secureComms || caseData.email || "");
  const amount = Number(caseData.recoveredAmount || 0);
  const currency = caseData.recoveredAmountCurrency || "USD";
  const bothSigned = Boolean(
    signed.funds_confirmation && signed.legal_compliance
  );
  const currentSigned = signed[activeType];
  const displayName = signerName.trim() || caseCustomerName(caseData) || "Client";

  const resetSigningSurface = (nextType?: CaseDocumentType) => {
    setSignature(null);
    setAcknowledged(false);
    setError(null);
    setPadReset((n) => n + 1);
    if (nextType) setActiveType(nextType);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!signerName.trim() || signerName.trim().length < 2) {
      setError("Enter the legal name that should appear on the document.");
      return;
    }
    if (!signature) {
      setError("Draw your signature on the pad before submitting.");
      return;
    }
    if (!acknowledged) {
      setError("Confirm that you have reviewed and acknowledge this document.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitClientDocumentSignature(caseId, email, {
        documentType: activeType,
        signerName: signerName.trim(),
        signatureDataUrl: signature,
        acknowledged: true,
      });
      if (!result.ok || !result.case) {
        throw new Error(result.error || "Signing failed");
      }
      onCaseUpdate(result.case);
      const nextPending = DOCUMENT_TYPES.find(
        (doc) => !result.case?.signedDocuments?.[doc.id]
      );
      resetSigningSurface(nextPending?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signing failed");
    } finally {
      setSubmitting(false);
    }
  };

  const viewButtons = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {DOCUMENT_TYPES.filter((doc) => signed[doc.id]).map((doc) => (
        <button
          key={doc.id}
          type="button"
          onClick={() => setViewing(doc.id)}
          className="px-5 py-4 rounded-xl bg-blue-600 text-white font-manrope font-black text-[11px] uppercase tracking-[0.18em] hover:brightness-110"
        >
          View PDF · {doc.shortLabel}
        </button>
      ))}
    </div>
  );

  const loadViewingPdf = React.useCallback(() => {
    if (!viewing) {
      return Promise.resolve({ ok: false as const, error: "No document selected" });
    }
    return fetchClientDocumentPdf(caseId, email, viewing);
  }, [caseId, email, viewing]);

  const viewingMeta = viewing ? signed[viewing] : undefined;
  const pdfModal = viewing && (
    <DocumentPdfModal
      title={
        DOCUMENT_TYPES.find((d) => d.id === viewing)?.title || "Signed document"
      }
      filename={`${caseId.slice(0, 10)}-${viewing}.pdf`}
      loadPdf={loadViewingPdf}
      preview={
        <OfficialDocument
          documentType={viewing}
          caseId={caseId}
          clientName={viewingMeta?.signerName || displayName}
          recoveredAmount={amount}
          currency={currency}
          signerName={viewingMeta?.signerName || displayName}
          signedAt={viewingMeta?.signedAt}
          signatureDataUrl={clientDocumentSignatureUrl(caseId, email, viewing)}
        />
      }
      onClose={() => setViewing(null)}
    />
  );

  if (bothSigned) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 mx-auto flex items-center justify-center mb-6 text-white">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-manrope font-black text-white uppercase tracking-tight mb-3">
            Documents executed
          </h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Both official documents have been signed and stored. They can no
            longer be changed. Recovered amount:{" "}
            <span className="text-emerald-300 font-bold">
              {formatRecoveredAmount(amount, currency)}
            </span>
            .
          </p>
        </div>
        {viewButtons}
        {pdfModal}
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 sm:p-8 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-manrope font-black text-white uppercase tracking-tight">
            Required: Review and sign documents
          </h3>
          <p className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">
            Phase 06 // Document acknowledgement
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        Review each official instrument, confirm the recovered amount, and sign.
        After you submit, signing is locked and you can only open the stored PDF.
      </p>

      <div className="flex flex-wrap gap-2">
        {DOCUMENT_TYPES.map((doc) => {
          const done = Boolean(signed[doc.id]);
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => resetSigningSurface(doc.id)}
              className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest border ${
                activeType === doc.id
                  ? "bg-blue-600 border-blue-400 text-white"
                  : done
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              <FileText size={12} className="inline mr-2" />
              {doc.shortLabel}
              {done ? " · Signed" : ""}
            </button>
          );
        })}
      </div>

      {currentSigned ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
          <p className="text-sm text-slate-200">
            This document has been signed and submitted. Signing is closed.
          </p>
          <button
            type="button"
            onClick={() => setViewing(activeType)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-manrope font-black text-[11px] uppercase tracking-[0.18em]"
          >
            View PDF
          </button>
        </div>
      ) : (
        <>
          <OfficialDocument
            documentType={activeType}
            caseId={caseId}
            clientName={displayName}
            recoveredAmount={amount}
            currency={currency}
            signatureDataUrl={signature}
            signerName={displayName}
          />

          <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
            <label className="block space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Full legal name
              </span>
              <input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                required
              />
            </label>

            <SignaturePad
              key={`${activeType}-${padReset}`}
              onChange={setSignature}
              disabled={submitting}
            />

            <button
              type="button"
              onClick={() => setAcknowledged((prev) => !prev)}
              className={`w-full flex items-start gap-3 text-left p-4 rounded-xl border-2 transition-all ${
                acknowledged
                  ? "border-amber-400 bg-amber-500/15 text-white"
                  : "border-white/20 bg-black/40 text-slate-300 hover:border-amber-400/60"
              }`}
            >
              <span
                className={`mt-0.5 w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center ${
                  acknowledged
                    ? "bg-amber-500 border-amber-400 text-slate-950"
                    : "border-white/40 bg-transparent"
                }`}
              >
                {acknowledged && <Check size={16} strokeWidth={3} />}
              </span>
              <span className="text-sm leading-relaxed">
                I have reviewed this document, acknowledge the recovered funds
                details where shown, and will follow the actions provided by the
                blockchain company for settlement.
              </span>
            </button>

            {error && (
              <p className="text-xs font-mono text-red-400 uppercase">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !acknowledged}
              className="w-full sm:w-auto px-10 py-4 bg-amber-500 text-slate-950 rounded-xl font-manrope font-black text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {submitting ? "Storing signed document..." : "Sign and submit"}
            </button>
          </form>
        </>
      )}
      {pdfModal}
    </div>
  );
};
