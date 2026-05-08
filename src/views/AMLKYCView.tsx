import React from 'react';
import { UserCheck, ShieldAlert, Landmark, Search, BookOpen, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export const AMLKYCView = () => {
  return (
    <main className="pt-40 pb-32 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen relative z-10">
      <div className="max-w-3xl mb-20 text-center mx-auto">
        <h1 className="text-4xl lg:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
          AML/KYC <span className="text-blue-500">STANDARDS</span>
        </h1>
        <p className="text-xl text-slate-400 font-manrope leading-relaxed">
          Our recovery operations are built on institutional-grade Anti-Money Laundering (AML) and Know Your Customer (KYC) frameworks, ensuring every recovery is legal, ethical, and verifiable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
         <div className="glass-panel p-8 rounded-3xl border border-blue-500/10 bg-blue-500/5">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
               <ShieldAlert className="text-blue-500" /> Illicit Flow Detection
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
               We utilize industry-leading transaction monitoring nodes to detect Sanctions violations (OFAC, UN, EU), Darknet interactions, and mixer activity in real-time.
            </p>
            <div className="space-y-4">
               {['PEP/Sanctions Screening', 'Watchlist Monitoring', 'UBO Discovery'].map(item => (
                 <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-slate-400">
                    <span className="uppercase tracking-widest">{item}</span>
                    <span className="text-blue-400 font-bold tracking-tighter">ENFORCED</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
               <UserCheck className="text-blue-500" /> Identity Verification
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
               Before any recovery operation, we conduct deep verification of ownership through automated biometric matching and secure document retrieval.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">VER_ACCURACY</p>
                  <p className="text-xl font-bold text-white">99.98%</p>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">CHECK_LATENCY</p>
                  <p className="text-xl font-bold text-white">&lt; 30s</p>
               </div>
            </div>
         </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 lg:p-16 border border-white/5 bg-slate-950/40 relative mb-20">
        <h3 className="text-3xl font-black text-white mb-12 uppercase text-center tracking-tight italic">Regulatory <span className="text-blue-500">Framework</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { icon: <Landmark />, title: "VASP Compliance", desc: "Aligning with FATF Travel Rule requirements for all cross-exchange asset transfers." },
            { icon: <Search />, title: "KYT Analytics", desc: "Know Your Transaction: Deep on-chain behavioral analysis and cluster attribution." },
            { icon: <BookOpen />, title: "Risk Grading", desc: "Every wallet and interaction is assigned a dynamic risk score from 1-100." }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">FATF_PROTOCOL_SYNC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">OFAC_WATCHLIST_LIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 glass-panel border border-white/5 rounded-3xl group">
           <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3">
              <Activity className="text-blue-500" size={18} /> Risk Scoring Algorithm
           </h3>
           <div className="space-y-6">
             {[
               { label: "Entity Association", weight: "40%", score: 12 },
               { label: "Mixer Proximity", weight: "30%", score: 84 },
               { label: "Sanction Distance", weight: "30%", score: 5 }
             ].map((risk, i) => (
               <div key={i}>
                 <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">
                   <span>{risk.label} (WEIGHT: {risk.weight})</span>
                   <span className={risk.score > 50 ? 'text-red-400' : 'text-emerald-400'}>{risk.score > 50 ? 'HIGH' : 'LOW'} ({risk.score}%)</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${risk.score}%` }}
                      className={`h-full ${risk.score > 50 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}
                    />
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="p-8 glass-panel border border-white/5 rounded-3xl relative overflow-hidden bg-blue-500/5">
           <Landmark className="text-blue-500 w-10 h-10 mb-6" />
           <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">VASP Verification Node</h3>
           <p className="text-sm text-slate-400 leading-relaxed mb-8">
             Our AML module connects directly with established VASPs to confirm the source of funds and the identity of depositors across centralized endpoints.
           </p>
           <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
              <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase">LATEST_VERIFICATION</p>
              <p className="text-xs text-white font-mono leading-none">ID: TX_0x82... COMPLETED // STATUS: PASS</p>
           </div>
        </div>
      </div>
    </main>
  );
};
