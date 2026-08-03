import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { SeoEnrichment } from '../components/SeoEnrichment';

export const ISO27001View = () => {
  return (
    <main className="pt-40 pb-32 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen relative z-10">
      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        <div className="md:w-1/3">
          <div className="p-8 glass-panel border border-blue-500/20 rounded-3xl bg-blue-500/5 text-center">
            <ShieldCheck className="text-blue-500 w-16 h-16 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">ISO/IEC 27001</h2>
            <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-6">Certified Information Security Management</p>
            <div className="pt-6 border-t border-white/10">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Certificate ID: ISMS-7729-QX</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-4xl lg:text-6xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Trust Through <span className="text-blue-500">Rigorous Standards</span>
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed">
            Our platform operates under a strictly audited Information Security Management System (ISMS) compliant with ISO/IEC 27001. This ensures that every byte of forensic data we process is handled with the highest level of care.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {[
          { title: "Risk Management", desc: "Systematic evaluation of information security risks, taking into account the impact of threats and vulnerabilities." },
          { title: "Technical Controls", desc: "Implementation of comprehensive security controls to address identified risks across our entire infrastructure." },
          { title: "Operational Continuity", desc: "Rigorous incident response and business continuity planning to ensure availability during critical recovery ops." },
          { title: "Access Governance", desc: "Zero-trust architecture ensuring that data access is restricted to authorized forensic personnel only." }
        ].map((item, i) => (
          <div key={i} className="p-8 glass-panel border border-white/5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-10 lg:p-16 rounded-3xl border border-white/5 bg-slate-900/40 mb-20">
        <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tight text-center">Audit Specification <span className="text-blue-500">Matrix</span></h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Data Encryption", val: "AES-256-GCM" },
            { label: "Transit Security", val: "TLS 1.3 / mTLS" },
            { label: "Audit Frequency", val: "Quarterly Ext." },
            { label: "Recovery Time", val: "< 4.0 Hours" }
          ].map((spec, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">{spec.label}</p>
              <p className="text-lg font-bold text-white uppercase">{spec.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3">
            <Activity className="text-blue-500" size={18} /> Compliance Roadmap
          </h3>
          <div className="space-y-8 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/5"></div>
            {[
              { year: "2022", title: "Initial ISMS Design", desc: "Foundational architecture alignment with Annex A controls." },
              { year: "2023", title: "Stage 1 Audit Complete", desc: "Rigorous documentation and process verification by external auditors." },
              { year: "2024", title: "Full Certification", desc: "Maintained 100% compliance record through automated enforcement nodes." }
            ].map((step, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <h4 className="text-sm font-bold text-white uppercase mb-1">{step.year}: {step.title}</h4>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 items-center flex flex-col justify-center text-center">
          <ShieldAlert className="text-blue-500 mb-6 w-12 h-12" />
          <h3 className="text-lg font-bold text-white mb-4 uppercase">Threat Detection</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Our ISMS includes a proprietary SIEM integration that monitors for unauthorized access attempts across our node perimeter 24/7.
          </p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: [-100, 300] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
            />
          </div>
          <p className="mt-4 text-[8px] font-mono text-blue-400 uppercase tracking-widest">Scanning Grid Status: ACTIVE</p>
        </div>
      </div>
    
      <SeoEnrichment page="iso27001" />
    </main>
  );
};
