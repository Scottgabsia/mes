import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';

interface RecoveryConfirmationViewProps {
  onBackToDashboard: () => void;
}

export const RecoveryConfirmationView = ({ onBackToDashboard }: RecoveryConfirmationViewProps) => {
  return (
    <main className="pt-40 pb-32 px-6 lg:px-12 max-w-[800px] mx-auto min-h-screen relative z-10 flex flex-col items-center text-center">
      {/* Success Icon */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
      >
        <CheckCircle2 className="text-blue-400 w-12 h-12" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-blue-500/30"></div>
          <span className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em]">Submission Received</span>
          <div className="h-px w-8 bg-blue-500/30"></div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-manrope font-extrabold text-white mb-8 uppercase tracking-tighter">
          INTAKE <span className="text-blue-500">RECEIVED</span>
        </h1>

        <div className="glass-panel p-8 rounded-2xl border border-white/5 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-scan"></div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 text-slate-300">
              <Mail className="text-blue-500 w-6 h-6" />
              <p className="text-lg font-manrope leading-relaxed">
                Thank you. Your forensic request has been <span className="text-white font-bold">successfully transmitted</span>. 
                Our intake department has been notified and we have received your details in our secure monitoring system.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
              <Clock className="text-blue-500/60 w-5 h-5" />
              <p className="text-sm font-manrope italic">
                Our forensic analysts are currently conducting a preliminary review of your data. 
                Kindly note that we have received your submission and we will get back to you shortly via your provided contact methods.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onBackToDashboard}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-manrope font-extrabold uppercase tracking-widest flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_#0062ff44] group cursor-pointer"
          >
            <LayoutDashboard size={18} />
            Click to access your dashboard
          </button>
          
          <div className="flex items-center gap-2 px-6 py-4 rounded-lg border border-white/5 bg-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Case ID: #DF-8829-PENDING</span>
          </div>
        </div>
      </motion.div>

      {/* Grid background effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    </main>
  );
};
