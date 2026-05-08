import React from 'react';
import { Fingerprint, ShieldAlert, Database, Scale, Globe, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const GDPRView = () => {
  return (
    <main className="pt-40 pb-32 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen relative z-10">
      <div className="max-w-3xl mb-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-12 h-px bg-purple-500"></span>
          <span className="text-purple-400 font-mono text-xs font-bold tracking-[0.3em] uppercase">Data Privacy Protocol</span>
        </div>
        <h1 className="text-4xl lg:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
          GDPR <span className="text-purple-500">ENFORCEMENT</span>
        </h1>
        <p className="text-xl text-slate-400 font-manrope leading-relaxed">
          Full adherence to EU data protection laws. We provide a sovereign data environment where your right to privacy is built into the source code of our forensic engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-8">
           {[
             { title: "Right to Erasure", desc: "Automated 'forgetting' protocols that purge all forensic traces from our servers upon successful case closure." },
             { title: "Data Portability", desc: "Seamless export of forensic case files in standardized ISO-compliant formats for legal use." },
             { title: "Privacy by Design", desc: "Security isn't a bolt-on; it's the foundation of our engineering architecture from the first line of code." }
           ].map((item, i) => (
             <div key={i} className="flex gap-6">
               <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                 <CheckCircle2 size={18} />
               </div>
               <div>
                 <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">{item.title}</h4>
                 <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
               </div>
             </div>
           ))}
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
            <Globe size={100} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">DPA Status</h3>
          <p className="text-xs font-mono text-slate-500 leading-loose mb-8">
            {"[TRANS_REPORT] // LOCATION: LUX_04_NODE"} <br/>
            {"[SYSTEM_TYPE] // SOVEREIGN_ENCLAVE"} <br/>
            {"[ENCRYPTION_KEY] // RSA_4096_ELIPTIC"} <br/>
            {"[PRIVACY_SYNC] // 100% VERIFIED"}
          </p>
          <div className="p-4 bg-black/40 rounded-xl border border-white/10 flex items-center gap-4">
             <Fingerprint className="text-purple-500" />
             <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Data Protection Officer: <span className="text-white">v.v_forensics</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         <div className="p-8 glass-panel border border-white/5 rounded-2xl text-center">
            <Database className="text-purple-500 mx-auto mb-4" />
            <h5 className="text-white font-bold uppercase mb-2">Zero Logging</h5>
            <p className="text-xs text-slate-600">No storage of PII outside of active investigation windows.</p>
         </div>
         <div className="p-8 glass-panel border border-white/5 rounded-2xl text-center">
            <Scale className="text-purple-500 mx-auto mb-4" />
            <h5 className="text-white font-bold uppercase mb-2">Legal Compliance</h5>
            <p className="text-xs text-slate-600">Fully compliant with the UK Data Protection Act 2018.</p>
         </div>
         <div className="p-8 glass-panel border border-white/5 rounded-2xl text-center">
            <UserCheck className="text-purple-500 mx-auto mb-4" />
            <h5 className="text-white font-bold uppercase mb-2">User Consent</h5>
            <p className="text-xs text-slate-600">Explicit multi-factor consent for every data collection operation.</p>
         </div>
      </div>

      <div className="glass-panel rounded-3xl p-10 border border-white/5 bg-slate-950/40 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Sovereign Cloud Infrastructure</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              All personal data processed by V.V. Forensics is hosted within EU-based, Tier-4 data centers with strict residency requirements. We do not transfer data to third-party jurisdictions without explicit judicial orders.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-[10px] font-mono text-purple-400 uppercase tracking-widest">EU RESIDENCY</div>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-[10px] font-mono text-purple-400 uppercase tracking-widest">ZERO TRANS_FER</div>
            </div>
          </div>
          <div className="p-6 bg-black/40 rounded-2xl border border-white/10">
             <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Compliance Checklist
             </h4>
             <ul className="space-y-3">
                {[
                  "DPO Oversight Protocol",
                  "Breach Notification (<72h)",
                  "Impact Assessment (DPIA)",
                  "Sub-processor Auditing"
                ].map(check => (
                  <li key={check} className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                     <div className="w-1 h-1 rounded-full bg-purple-500"></div> {check}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
