import React from "react";
import { Download, ExternalLink, X } from "lucide-react";

type DocumentPdfModalProps = {
  title: string;
  filename: string;
  loadPdf: () => Promise<{ ok: boolean; blob?: Blob; error?: string }>;
  preview?: React.ReactNode;
  onClose: () => void;
};

export const DocumentPdfModal = ({
  title,
  filename,
  loadPdf,
  preview,
  onClose,
}: DocumentPdfModalProps) => {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [touchDevice, setTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  React.useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const result = await loadPdf();
      if (cancelled) return;
      if (!result.ok || !result.blob) {
        setError(result.error || "Could not open the PDF.");
        setLoading(false);
        return;
      }
      revoked = URL.createObjectURL(result.blob);
      setBlobUrl(revoked);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [loadPdf]);

  const openPdf = () => {
    if (!blobUrl) return;
    window.open(blobUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = () => {
    if (!blobUrl) return;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-[#0a0e16] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-manrope font-black text-white uppercase tracking-tight truncate">
            {title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openPdf}
              disabled={!blobUrl}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:brightness-110 disabled:opacity-40 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              Open
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!blobUrl}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5"
            >
              <Download size={13} />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto bg-[#f7f3e8]">
          {loading && (
            <p className="text-center text-slate-600 font-mono text-xs uppercase tracking-widest py-16">
              Loading signed PDF…
            </p>
          )}
          {error && (
            <div className="p-6 space-y-4">
              <p className="text-center text-red-700 font-mono text-xs uppercase tracking-widest">
                {error}
              </p>
              {preview}
            </div>
          )}
          {!loading && !error && blobUrl && touchDevice && (
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-center text-slate-700 text-sm">
                Tap <span className="font-semibold">Open</span> to view the signed
                PDF, or <span className="font-semibold">Download</span> to save it.
              </p>
              {preview}
            </div>
          )}
          {!loading && !error && blobUrl && !touchDevice && (
            <iframe
              title={title}
              src={blobUrl}
              className="w-full h-full min-h-[70vh] bg-[#f7f3e8]"
            />
          )}
        </div>
      </div>
    </div>
  );
};
