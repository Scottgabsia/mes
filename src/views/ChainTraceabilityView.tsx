import React from 'react';
import { motion } from 'motion/react';
import { Search, Share2, Database, Shield, Zap, Activity } from 'lucide-react';
import { SeoEnrichment } from '../components/SeoEnrichment';

type ChainTraceabilityViewProps = {
  onNavigate?: (view: 'clientPortal') => void;
};

export const ChainTraceabilityView = ({ onNavigate }: ChainTraceabilityViewProps) => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="relative mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-blue-600"></span>
            <span className="text-blue-500 font-mono text-xs font-bold tracking-[0.3em] uppercase">Service Protocol 01</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-manrope font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Chain <span className="text-blue-500">Traceability</span>
          </h1>
          <p className="text-xl text-slate-400 font-manrope leading-relaxed max-w-2xl">
            Multi-hop path analysis and attribution across 40+ blockchains. We map the flow of illicit funds from origin to endpoint with mathematical certainty.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: <Search className="w-6 h-6" />,
            title: "Heuristic Attribution",
            desc: "Advanced clustering algorithms that identify exchange deposit addresses and service-linked wallets with 99.9% accuracy."
          },
          {
            icon: <Share2 className="w-6 h-6" />,
            title: "Cross-Chain Mapping",
            desc: "Tracing assets through bridges, atomic swaps, and centralized exchange internal movements to maintain visibility on asset flow."
          },
          {
            icon: <Database className="w-6 h-6" />,
            title: "Entity Database",
            desc: "Access to our private database of over 400 million labeled blockchain entities, including darknet markets and mixers."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl border border-white/5 relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Technical Visualization Placeholder */}
      <div className="glass-panel rounded-3xl p-1 lg:p-12 border border-white/5 relative overflow-hidden bg-slate-950/40 mb-20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">The Forensic <span className="text-blue-500">Node Grid</span></h2>
            <div className="space-y-6">
              {[
                { label: "Processing Speed", val: "1.2M tx/sec" },
                { label: "Active Nodes", val: "14,204 Global" },
                { label: "Data Latency", val: "< 4.2ms" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">
                    <span>{stat.label}</span>
                    <span>{stat.val}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4">Live Network Pulse</p>
              <div className="flex gap-2">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 16, 8, 20, 4] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="w-1 bg-blue-500/40 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="aspect-video rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center relative group overflow-hidden">
               <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1EjSdQ17bRuBNBHfG0N3zcYBXs7iEBtzOa3ZuN97kti7U3KjUEIlwH_cCfk9gFDL6JUqPq1AvEbWCJeCLxCQ0raMwWXbF8EpVpfUz5ldig8GyjnpIzsWmg6Q5YdkF4s2M1twpERTc4CflcWSTATxm0zyifdChfkC1FUntY-6FOr0NH-VoOVKCOIDhZM-REjoVFpjinDoNQwNSU9N5Cs3nIUvmc5sqOQYiFGELzXuCPwMnlNSrEEK90IqyJmISXzKLvayU6b2m3Tk" 
                alt="Network Map" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center animate-pulse">
                  <Activity className="text-blue-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 glass-panel border border-white/5 rounded-xl">
                <p className="text-[8px] font-mono text-blue-400 mb-1 uppercase tracking-widest">Mixer Penetration</p>
                <p className="text-lg font-bold text-white uppercase">Tier 4 Achieved</p>
              </div>
              <div className="p-4 glass-panel border border-white/5 rounded-xl">
                <p className="text-[8px] font-mono text-blue-400 mb-1 uppercase tracking-widest">Attribution Logic</p>
                <p className="text-lg font-bold text-white uppercase">Heuristic v8.2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Coverage Grid */}
      <div className="mb-20">
        <h3 className="text-xl font-bold text-white mb-10 uppercase tracking-widest text-center">Infrastucture Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Bitcoin', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC', 'Base', 'Tron', 'Cardano', 'Cosmos'].map((network) => (
            <div key={network} className="p-4 glass-panel border border-white/5 rounded-xl text-center group hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-mono text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-widest">{network}</p>
              <div className="mt-2 text-[8px] font-mono text-emerald-500">SYNCED</div>
            </div>
          ))}
        </div>
      </div>


      <SeoEnrichment page="traceability" />
      {/* Final CTA */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => onNavigate?.('clientPortal')}
          className="px-10 py-5 bg-blue-600 text-white font-manrope font-black text-sm uppercase tracking-[0.3em] rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_25px_#0062ff66] active:scale-95 cursor-pointer"
        >
          Request Forensic Trace
        </button>
      </div>
    </div>
  );
};
