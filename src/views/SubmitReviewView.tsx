import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BadgeCheck, 
  Star, 
  Send, 
  MessageSquare, 
  Shield, 
  CheckCircle2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface SubmitReviewViewProps {
  onBack: () => void;
}

export const SubmitReviewView: React.FC<SubmitReviewViewProps> = ({ onBack }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    rating: 5,
    platform: 'GOOGLE',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-[800px] mx-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-12 rounded-2xl border border-emerald-500/30 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/50">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-manrope font-black text-white uppercase tracking-tight mb-4">Transmission Successful</h2>
            <div className="bg-slate-900/80 p-6 rounded-xl border border-white/5 mb-8 inline-block max-w-md">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Thank you, your review has been received by our reputation management system.
              </p>
              <div className="flex items-start gap-3 text-left p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-300/80 font-mono leading-tight uppercase">
                  Notice: Your review will be published and accepted onto the public ledger once it has been verified to comply with Google Review Policy and Trustpilot community guidelines.
                </p>
              </div>
            </div>
            <div>
              <button 
                onClick={onBack}
                className="px-8 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:brightness-110 transition-all"
              >
                RETURN_TO_REVIEWS
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-[800px] mx-auto min-h-screen">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors font-mono text-[9px] sm:text-[10px] uppercase tracking-widest mb-8 group"
      >
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> BACK_TO_FEED
      </button>

      <div className="mb-8 sm:mb-12 border-l-4 border-blue-600 pl-4 sm:pl-6">
        <h1 className="text-xl sm:text-3xl lg:text-4xl text-white font-manrope font-extrabold tracking-tight mb-2 uppercase">
          <span className="text-blue-500 opacity-50 font-mono">[</span>
          SUBMIT_CASE_TESTIMONIAL
          <span className="text-blue-500 opacity-50 font-mono">]</span>
        </h1>
        <p className="text-slate-500 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">ENCRYPTED_UPLINK: ACTIVE</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Send className="w-32 h-32 text-white" />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500/50"></span> PUBLIC_NAME
              </label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ENTER_IDENTIFIER..."
                className="w-full bg-[#05070a] border border-white/10 rounded px-4 py-3 text-white font-mono text-xs tracking-wider focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500/50"></span> SECURE_EMAIL
              </label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="BYPASS_REDACTION..."
                className="w-full bg-[#05070a] border border-white/10 rounded px-4 py-3 text-white font-mono text-xs tracking-wider focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500/50"></span> SATISFACTION_METRIC
              </label>
              <div className="flex gap-2 p-2 bg-[#05070a] border border-white/5 rounded w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= formData.rating ? 'text-blue-500 fill-blue-500 shadow-[0_0_10px_#3b82f6]' : 'text-slate-700'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500/50"></span> TARGET_PLATFORM
              </label>
              <div className="flex gap-2">
                {['GOOGLE', 'TRUSTPILOT'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, platform: p})}
                    className={`flex-1 py-3 px-4 rounded border font-mono text-[10px] font-bold tracking-widest transition-all uppercase ${
                      formData.platform === p 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                        : 'bg-[#05070a] border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-3 bg-blue-500/50"></span> TESTIMONIAL_CONTENT
            </label>
            <textarea 
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="DESCRIBE_YOUR_RECOVERY_EXPERIENCE..."
              rows={5}
              className="w-full bg-[#05070a] border border-white/10 rounded px-4 py-3 text-white font-manrope text-sm focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-start gap-4 mb-8 bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono uppercase">
                Privacy Clause: Your email will remain confidential and will only be used for verification purposes. By submitting, you grant permission to publish this review across our secure channels.
              </p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-600 text-white font-bold text-xs uppercase tracking-[0.3em] rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  TRANSMITTING_DATA...
                </>
              ) : (
                <>
                  <BadgeCheck className="w-4 h-4" /> BROADCAST_TESTIMONIAL
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
