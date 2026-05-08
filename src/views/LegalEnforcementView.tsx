import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Scale, FileSignature, ShieldAlert, BookOpen, UserCheck } from 'lucide-react';

export const LegalEnforcementView = () => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="relative mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-purple-600"></span>
            <span className="text-purple-400 font-mono text-xs font-bold tracking-[0.3em] uppercase">Service Protocol 03</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Legal <span className="text-purple-500">Enforcement</span>
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed max-w-2xl">
            Bridging the gap between blockchain forensics and judicial systems. We provide expert testimony and litigation support to enforce claims against digital asset theft.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="glass-panel p-10 rounded-3xl border border-white/5 relative group overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>
          <Gavel className="text-purple-500 w-12 h-12 mb-8" />
          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Expert Forensic Reports</h3>
          <p className="text-slate-400 leading-relaxed mb-8">
            Admissible court reports detailing the flow of funds, actor signatures, and behavioral patterns. Our documentation is designed to be understood by judges and prosecutors.
          </p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">Global Jurisdictions</div>
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">Notarized Logs</div>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-3xl border border-white/5 relative group overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>
          <Scale className="text-purple-500 w-12 h-12 mb-8" />
          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Litigation Strategy</h3>
          <p className="text-slate-400 leading-relaxed mb-8">
            Working with specialized cryptolawyers to coordinate international Mareva injunctions and freezing orders. We map the technical assets to the legal requirements.
          </p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">Injunction Support</div>
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">Asset Mapping</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 lg:p-16 border border-white/5 bg-slate-950/40 relative mb-20">
        <h3 className="text-3xl font-black text-white mb-12 uppercase text-center tracking-tight">Institutional <span className="text-purple-500">Legal Suite</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <FileSignature />, title: "Subpoena Prep", desc: "Automated subpoena drafting for known VASP deposit endpoints." },
            { icon: <ShieldAlert />, title: "SAR Filings", desc: "Coordinating Suspicious Activity Reports with local FIUs." },
            { icon: <BookOpen />, title: "Discovery Aid", desc: "Technical discovery support for complex multi-jurisdiction cases." },
            { icon: <UserCheck />, title: "Vetting", desc: "Background verification of individuals and corporate entities." }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Expert Witness Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['USA', 'United Kingdom', 'EU (Various)', 'Singapore', 'Hong Kong', 'UAE', 'Switzerland', 'Australia', 'Japan'].map(region => (
              <div key={region} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span className="text-xs font-mono text-slate-400 uppercase">{region}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 flex flex-col items-center justify-center text-center">
          <BookOpen className="text-purple-500 mb-4" />
          <h4 className="text-sm font-bold text-white mb-2 uppercase">Court Ready Documentation</h4>
          <p className="text-[10px] text-slate-500 mb-6">ISO-27001 compliant forensic export formats.</p>
          <button className="w-full py-3 bg-purple-600 text-white font-manrope font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-purple-500 transition-all cursor-pointer">
            Sample Report PDF
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-8 glass-panel border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Chain of Custody Protocols</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            "We maintain strict hash-linked logs for every data retrieval operation. Our forensic images are byte-for-byte identical to the blockchain state at the time of seizure, ensuring they withstand the most rigorous cross-examinations."
          </p>
        </div>
        <div className="p-8 glass-panel border border-white/5 rounded-3xl">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
             <UserCheck className="text-purple-500" size={20} /> Judicial Advisory
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Our experts provide direct advisory to judicial bodies, explaining the mechanics of smart contracts, gas fees, and multi-sig wallet structures in layman's terms.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Judge Briefings', 'Law Enforcement Training', 'Policy Advisory'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[8px] font-mono uppercase tracking-widest rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
