import React from 'react';
import { motion } from 'motion/react';
import { Eye, ShieldAlert, Bell, Cpu, Radar, Activity, ArrowRight } from 'lucide-react';

export const RiskMonitoringView = () => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="relative mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-amber-600"></span>
            <span className="text-amber-500 font-mono text-xs font-bold tracking-[0.3em] uppercase">Service Protocol 04</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Risk <span className="text-amber-500">Monitoring</span>
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed max-w-2xl">
            Real-time exposure auditing and threat detection. We provide continuous surveillance of your digital footprint to prevent exploits before they occur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="glass-panel p-1 border border-white/5 rounded-3xl group overflow-hidden bg-gradient-to-br from-amber-500/20 via-transparent to-transparent">
          <div className="p-8">
            <Radar className="text-amber-500 w-12 h-12 mb-8 animate-pulse" />
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Active Surveillance</h3>
            <p className="text-slate-400 leading-relaxed">
              Continuous monitoring of specified wallet addresses and ENS domains. Immediate alerts on suspicious interactions with known exploiters or sanctioned entities.
            </p>
          </div>
        </div>

        <div className="glass-panel p-1 border border-white/5 rounded-3xl group overflow-hidden bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent">
          <div className="p-8">
            <ShieldAlert className="text-amber-500 w-12 h-12 mb-8" />
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Threat Intelligence</h3>
            <p className="text-slate-400 leading-relaxed">
              Daily intelligence briefings on emerging zero-day exploits, phishing-as-a-service trends, and darknet chatter targeting your specific asset profile.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          { icon: <Bell />, title: "Instant Alerts", val: "REAL-TIME" },
          { icon: <Cpu />, title: "Protocol Audits", val: "ON-CHAIN" },
          { icon: <Eye />, title: "Wallet Health", val: "CONTINUOUS" },
          { icon: <Activity />, title: "Flow Velocity", val: "MONITORED" }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-amber-500 mb-4 flex justify-center">{item.icon}</div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{item.title}</p>
            <p className="text-sm font-bold text-white uppercase">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-10 lg:p-16 border border-white/5 relative overflow-hidden bg-amber-500/5 mb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tight italic">Enterprise Shield v4.0</h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed font-manrope">
            Tailored risk management frameworks for high-net-worth individuals and crypto-native institutions. Our solution is the difference between an asset and a liability.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest">System Status: Optimal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-3">
            <ShieldAlert className="text-amber-500" size={18} /> Asset Exposure Matrix
          </h3>
          <div className="space-y-6">
            {[
              { label: "Contract Vulnerability", score: 12, status: "LOW" },
              { label: "Ownership Centralization", score: 45, status: "MODERATE" },
              { label: "Phishing Susceptibility", score: 8, status: "MINIMAL" }
            ].map((risk, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-3 uppercase tracking-widest">
                  <span>{risk.label}</span>
                  <span className={risk.status === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}>{risk.status} ({risk.score}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${risk.score}%` }}
                    className={`h-full ${risk.status === 'LOW' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
           <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Top Exploits (24H)</h3>
           <div className="space-y-4">
             {[
               "DEX_LP_DRAINER_V4",
               "METAMASK_FISHING_WAVE",
               "SOLANA_RPC_ATTACK",
               "LEDGER_CONNECT_X"
             ].map((threat, i) => (
               <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex items-center justify-between group">
                 <span className="text-[10px] font-mono text-red-400 tracking-tighter">{threat}</span>
                 <ArrowRight className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="mt-20 glass-panel rounded-3xl p-1 lg:p-12 border border-white/5 bg-slate-950/40 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <Cpu className="text-amber-500 w-8 h-8" />
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">DeFi Protocol Audit Shield</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: "Slippage Protection", desc: "Prevents toxic MEV extraction on large trades." },
             { title: "Sandwich Prevention", desc: "Private RPC routing for all on-chain interactions." },
             { title: "Liquidity Lock Check", desc: "Real-time analysis of LP token distribution." }
           ].map((feat, i) => (
             <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
               <h4 className="text-sm font-bold text-white mb-2 uppercase">{feat.title}</h4>
               <p className="text-xs text-slate-500 mb-4">{feat.desc}</p>
               <div className="flex items-center gap-2 text-[8px] font-mono text-emerald-500">
                  <div className="w-1 h-1 rounded-full bg-emerald-500"></div> ACTIVE_ENFORCEMENT
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
