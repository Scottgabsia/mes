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

  return (
    <article className="bg-[#f7f3e8] text-slate-900 rounded-sm border border-[#d4c7a1] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-visible">
      <div className="h-2 bg-gradient-to-r from-[#1e3a5f] via-[#c9a227] to-[#14532d]" />
      <div className="px-6 sm:px-10 py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#d4c7a1] pb-5">
          <div>
            <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#1e3a5f]">
              Crypto Recovery Assets Agency
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mt-1">
              {preview.title}
            </h2>
            <p className="text-[10px] font-mono text-slate-600 mt-2 uppercase tracking-widest">
              Ref {preview.reference}
            </p>
          </div>
          <div className="text-right text-[10px] font-mono text-slate-600 uppercase tracking-wider">
            <p>Official instrument</p>
            <p>Issued {issued}</p>
            <p>Case {caseId.slice(0, 10).toUpperCase()}</p>
          </div>
        </header>

        <div className="rounded-lg border border-[#1e3a5f]/30 bg-white px-5 py-4">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1e3a5f] mb-1">
            Client name
          </p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a]">
            {signerName || clientName || "—"}
          </p>
        </div>

        {preview.amountLine && (
          <div className="rounded-lg border-2 border-[#1e3a5f] bg-white px-5 py-4 text-center">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1e3a5f] mb-1">
              Recovered amount
            </p>
            <p className="text-3xl sm:text-4xl font-serif font-black text-[#14532d]">
              {preview.amountLine}
            </p>
          </div>
        )}

        <div className="space-y-3 text-[13px] leading-relaxed font-serif text-slate-800">
          {preview.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-col gap-5 pt-4 pb-4">
          <div className="border-t border-slate-400 pt-3 min-h-[88px]">
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">
              Client signature
            </p>
            {signatureDataUrl ? (
              <img
                src={signatureDataUrl}
                alt="Client signature"
                className="h-16 object-contain bg-white/70 rounded"
              />
            ) : (
              <p className="text-xs italic text-slate-400">Awaiting signature</p>
            )}
            <p className="mt-2 text-sm font-serif font-semibold text-[#0f172a]">
              {signerName || clientName}
            </p>
          </div>
          <DocumentStampRow className="w-full justify-end" />
        </div>
      </div>
    </article>
  );
};
