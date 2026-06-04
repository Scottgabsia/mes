import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../constants';

interface WhatsAppSupportPanelProps {
  className?: string;
  showFooterNote?: boolean;
}

export function WhatsAppSupportPanel({
  className = '',
  showFooterNote = true,
}: WhatsAppSupportPanelProps) {
  return (
    <div
      className={`p-6 glass-panel border-l-2 border-emerald-500 rounded-xl relative overflow-hidden ${className}`}
    >
      <p className="font-mono text-[10px] text-emerald-500/70 mb-1 tracking-widest uppercase">
        SECURE_COMMS_CHANNEL
      </p>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        Chat with our recovery team on WhatsApp.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full relative group/wa block"
      >
        <div className="absolute -inset-1 bg-emerald-600 rounded-xl blur opacity-25 group-hover/wa:opacity-50 transition duration-500" />
        <div className="relative w-full bg-emerald-600 text-white font-mono font-black uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-[1px]">
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </div>
      </a>
      {showFooterNote && (
        <p className="text-[8px] font-mono text-slate-500 mt-3 uppercase tracking-wider text-center">
          Opens in WhatsApp · Include your case ID if you already have one
        </p>
      )}
    </div>
  );
}
