import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, Landmark, ShieldCheck, Zap, Globe, Briefcase } from 'lucide-react';

type ExchangeRecoveryViewProps = {
  onNavigate?: (view: 'clientPortal') => void;
};

export const ExchangeRecoveryView = ({ onNavigate }: ExchangeRecoveryViewProps) => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="relative mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-emerald-500"></span>
            <span className="text-emerald-400 font-mono text-xs font-bold tracking-[0.3em] uppercase">Service Protocol 02</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Exchange <span className="text-emerald-500">Recovery</span>
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed max-w-2xl">
            Strategic asset freezing and recovery operations across centralized exchanges globally. We leverage institutional relationships to reclaim missing assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: <Landmark className="w-6 h-6" />,
            title: "VASP Liaison",
            desc: "Direct communication channels with compliance departments at Tier-1, Tier-2, and offshore exchanges worldwide."
          },
          {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "KYC De-masking",
            desc: "Law-enforcement-grade processes to identify illicit actors through deposit/withdrawal correlation and IP analysis."
          },
          {
            icon: <ArrowUpDown className="w-6 h-6" />,
            title: "Transaction Reversal",
            desc: "Utilizing deep exchange integrations to facilitate the return of funds to verified owners upon successful case closure."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl border border-white/5 relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden">
           <h3 className="text-2xl font-black text-white mb-6 uppercase flex items-center gap-4">
            <Globe className="text-emerald-500" /> Global Range
          </h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Our recovery network covers 180+ jurisdictions, allowing us to serve legal notices and freeze requests even in complex international regulatory environments.
          </p>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-xl bg-white/5 border border-white/10">
               <p className="text-[10px] font-mono text-slate-500 mb-1">FREEZE RATE</p>
               <p className="text-xl font-black text-white">82.4%</p>
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10">
               <p className="text-[10px] font-mono text-slate-500 mb-1">RECOVERY VOL</p>
               <p className="text-xl font-black text-white">$400M+</p>
             </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/5 bg-emerald-500/5 relative overflow-hidden group">
           <Briefcase className="text-emerald-500 w-10 h-10 mb-6" />
           <h3 className="text-2xl font-black text-white mb-4 uppercase">Institutional Partners</h3>
           <p className="text-slate-400 leading-relaxed">
             We work alongside global banking partners and top-tier exchanges to ensure that recovered assets are handled with the highest level of security and compliance.
           </p>
           <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Protocol Sync: Continuous</span>
           </div>
        </div>
      </div>

      {/* Case Study Module */}
      <div className="glass-panel rounded-3xl p-10 border border-white/5 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={100} className="text-emerald-500" />
        </div>
        <div className="max-w-2xl">
          <p className="text-[10px] font-mono text-emerald-500 font-bold mb-4 tracking-widest">LATEST_SUCCESS_REPORT</p>
          <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">The Lazarus Liquidation Bypass</h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            In April 2024, our team successfully intercepted and froze reaching $14.2M in assets laundered through decentralized mixers. By coordinating with three independent VASP nodes, we secured the assets within 11 minutes of detection.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400">STATUS: RECOVERED</span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-500">TIME: 642s Execution</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-20">
        <button
          type="button"
          onClick={() => onNavigate?.('clientPortal')}
          className="px-10 py-5 bg-emerald-600 text-white font-manrope font-black text-sm uppercase tracking-[0.3em] rounded-xl hover:bg-emerald-500 transition-all shadow-[0_0_25px_#10b98166] active:scale-95 cursor-pointer"
        >
          Initialize Recovery Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/30">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Institutional Escrow</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Secure multi-sig custody during asset liquidation and return phases. Over $1.2B in historical transit volume.</p>
        </div>
        <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/30">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Automated Frozen Ops</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Direct API linkages with Tier-1 VASPs for sub-second freezing upon on-chain verification of stolen funds.</p>
        </div>
        <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/30">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Regulatory Reporting</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Integrated SAR generation that translates blockchain forensics into FINCEN and FATF compliant documentation.</p>
        </div>
      </div>
    </div>
  );
};
