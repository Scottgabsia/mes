import React from 'react';
import { FileCheck, Shield, Lock, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { SeoEnrichment } from '../components/SeoEnrichment';

export const SOC2View = () => {
  return (
    <main className="pt-40 pb-32 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen relative z-10">
      <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
        <div className="lg:w-2/3">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-emerald-500"></span>
            <span className="text-emerald-500 font-mono text-xs font-bold tracking-[0.3em] uppercase">Security Excellence</span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            SOC2 <span className="text-emerald-500">TYPE II</span> COMPLIANT
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed max-w-2xl">
            Our Type II certification represents our long-term commitment to operational security, availability, and processing integrity. We don't just meet standards; we sustain them every day.
          </p>
        </div>
        
        <div className="lg:w-1/3 w-full">
           <div className="p-10 glass-panel border border-emerald-500/20 rounded-3xl bg-emerald-500/5 flex flex-col items-center">
             <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_30px_#10b98133]">
                <FileCheck className="text-emerald-500 w-10 h-10" />
             </div>
             <p className="text-white font-manrope font-black text-xl mb-2 text-center uppercase tracking-widest">Aicpa SOC</p>
             <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Service Organization Control</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          { 
            icon: <Shield />, 
            title: "Security", 
            desc: "Protection of system resources against unauthorized access through advanced firewalls and multi-factor authentication." 
          },
          { 
            icon: <Eye />, 
            title: "Confidentiality", 
            desc: "Encryption and rigorous data handling protocols that ensure forensic information remains restricted to the client workspace." 
          },
          { 
            icon: <CheckCircle2 />, 
            title: "Privacy", 
            desc: "Advanced data collection and disposal policies that align with AICPA Trust Services Criteria." 
          }
        ].map((trust, i) => (
          <div key={i} className="p-8 glass-panel border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
            <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform">{trust.icon}</div>
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{trust.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{trust.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-10 glass-panel rounded-3xl border border-white/5 relative overflow-hidden mb-20">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <ShieldAlert size={140} />
        </div>
        <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">The 12-Month Audit Cycle</h3>
        <p className="text-slate-400 mb-10 leading-relaxed max-w-3xl">
          Unlike Type I which only looks at a point in time, our Type II report covers our operational effectiveness over a continuous 12-month period. This report is available to our enterprise partners upon signing a non-disclosure agreement.
        </p>
        <button className="px-8 py-4 bg-emerald-600 text-white font-manrope font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_#10b98144] active:scale-95 cursor-pointer">
          Request SOC 2 Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
        <div className="p-8 glass-panel border border-white/5 rounded-3xl flex flex-col justify-between">
           <div>
             <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Processing Integrity</h4>
             <p className="text-sm text-slate-500 leading-relaxed mb-8">
               Ensuring that system processing is complete, valid, accurate, timely, and authorized. Every forensic calculation on the V.V. Forensics platform is verifiable and deterministic.
             </p>
           </div>
           <div className="space-y-4">
              {[
                { label: "Execution Accuracy", p: "99.999%" },
                { label: "Data Drift", p: "0.000%" }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                   <span className="text-[10px] font-mono text-slate-500 uppercase">{stat.label}</span>
                   <span className="text-sm font-bold text-emerald-400">{stat.p}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="p-8 glass-panel border border-white/5 rounded-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
           <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Availability Protocol</h4>
           <p className="text-sm text-slate-500 leading-relaxed mb-8">
             Our distributed infrastructure across 14 global data centers ensures that our forensic toolkit remains operational even during large-scale network disruptions.
           </p>
           <div className="flex items-center gap-4">
              <div className="flex-1 h-32 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                        className="absolute w-24 h-24 border border-emerald-500 rounded-full"
                      />
                    ))}
                 </div>
                 <span className="text-[10px] font-mono text-emerald-500 uppercase font-black tracking-widest relative z-10">UPTIME_GUARANTEE: 99.9%</span>
              </div>
           </div>
        </div>
      </div>
    
      <SeoEnrichment page="soc2" />
    </main>
  );
};
