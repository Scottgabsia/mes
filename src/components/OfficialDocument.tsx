import React from "react";
import { DocumentStampRow } from "./OfficialSeals";
import {
  buildDocumentPreview,
  type CaseDocumentType,
} from "../lib/caseStages";

type OfficialDocumentProps = {
  documentType: CaseDocumentType;
  caseId: string;
  clientName: string;
  recoveredAmount: number;
  currency?: string;
  signatureDataUrl?: string | null;
  signerName?: string;
  signedAt?: string;
};

export const OfficialDocument = ({
  documentType,
  caseId,
  clientName,
  recoveredAmount,
  currency = "USD",
  signatureDataUrl,
  signerName,
  signedAt,
}: OfficialDocumentProps) => {
  const preview = buildDocumentPreview({
    documentType,
    caseId,
    clientName,
    recoveredAmount,
    currency,
  });
  const issued = signedAt
    ? new Date(signedAt).toLocaleString()
    : new Date().toLocaleDateString();
  const displayName = signerName || clientName || "—";

  return (
    <article className="w-full max-w-full overflow-x-hidden bg-[#f7f3e8] text-slate-900 rounded-sm border border-[#d4c7a1] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
      <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#1e3a5f] via-[#c9a227] to-[#14532d]" />
      <div className="px-3.5 py-5 sm:px-9 sm:py-8 space-y-4 sm:space-y-5">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6 border-b border-[#d4c7a1] pb-3 sm:pb-4">
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[9px] font-mono tracking-[0.18em] sm:tracking-[0.35em] uppercase text-[#1e3a5f] break-words">
              Crypto Recovery Assets Agency
            </p>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#0f172a] mt-1 leading-snug">
              {preview.title}
            </h2>
            <p className="text-[9px] sm:text-[10px] font-mono text-slate-600 mt-1.5 sm:mt-2 uppercase tracking-widest break-all">
              Ref {preview.reference}
            </p>
          </div>
          <div className="text-left md:text-right text-[9px] sm:text-[10px] font-mono text-slate-600 uppercase tracking-wider md:shrink-0">
            <p>Official instrument</p>
            <p>Issued {issued}</p>
            <p className="break-all">Case {caseId.slice(0, 12).toUpperCase()}</p>
          </div>
        </header>

        <div className="rounded-lg border border-[#1e3a5f]/30 bg-white px-3.5 py-3 sm:px-5 sm:py-4">
          <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] text-[#1e3a5f] mb-1">
            Client name
          </p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] break-words leading-snug">
            {displayName}
          </p>
        </div>

        {preview.amountLine && (
          <div className="rounded-lg border-2 border-[#1e3a5f] bg-white px-3.5 py-3 sm:px-5 sm:py-4 text-center">
            <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] text-[#1e3a5f] mb-1">
              Recovered amount
            </p>
            <p className="text-2xl sm:text-4xl font-serif font-black text-[#14532d] leading-tight [overflow-wrap:anywhere]">
              {preview.amountLine}
            </p>
          </div>
        )}

        <div className="space-y-3 text-[12px] sm:text-[13px] leading-relaxed font-serif text-slate-800">
          {preview.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6 border-t border-slate-400 pt-4 pb-3">
          <div className="min-w-0 min-h-[72px] sm:min-h-[92px] flex-1">
            <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">
              Client signature
            </p>
            {signatureDataUrl ? (
              <img
                src={signatureDataUrl}
                alt="Client signature"
                className="h-12 sm:h-14 max-w-full object-contain object-left bg-white/70 rounded"
              />
            ) : (
              <p className="text-xs italic text-slate-400">Awaiting signature</p>
            )}
            <p className="mt-2 text-sm font-serif font-semibold text-[#0f172a] break-words">
              {displayName}
            </p>
          </div>
          <DocumentStampRow className="mx-auto md:mx-0" />
        </div>
      </div>
    </article>
  );
};
