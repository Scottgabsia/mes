import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Wallet, 
  Radar, 
  ChevronsRight,
  AlertTriangle,
  Gavel,
  Landmark,
  Network,
  FlaskConical,
  Search,
  Activity,
  Gauge,
  Globe,
  CheckCircle,
  FileText,
  Lock,
  ShieldCheck,
  Radar as R
} from 'lucide-react';

interface ServicesViewProps {
  onServiceClick: () => void;
}

export const ServicesView = ({ onServiceClick }: ServicesViewProps) => {
  const [time, setTime] = React.useState(new Date());
  const [lastIntercept, setLastIntercept] = React.useState(12.4);

  React.useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const interceptInterval = setInterval(() => {
      setLastIntercept(prev => {
        const next = prev + 0.1;
        return next > 60 ? 0.1 : parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => {
      clearInterval(clockInterval);
      clearInterval(interceptInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  return (
    <div className="pt-40 sm:pt-52 pb-32 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-6 sm:mb-stack-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-stack-sm">
            <span className="text-[10px] font-manrope font-bold text-primary uppercase tracking-[0.2em]">Forensics Protocol // V4.0.0</span>
          </div>
          <h2 className="font-manrope text-4xl sm:text-[44px] md:text-[64px] text-on-surface mb-4 sm:mb-stack-sm leading-[1.1] font-extrabold tracking-tight">Technical Forensics <span className="text-primary">Catalog</span></h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-stack-md leading-relaxed max-w-xl opacity-80">
            Deploy multi-jurisdictional blockchain interrogation protocols. Every service is governed by cryptographic forensic standards and high-fidelity decryption sequences.
          </p>
        </div>
      </div>

      <section className="mb-20 sm:mb-stack-lg">
        <div className="glass-card rounded-2xl border-l-4 border-error/50 bg-slate-950/40">
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Emergency Status Column */}
            <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between lg:w-1/3">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded bg-error/10 flex items-center justify-center text-error">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-fira text-error uppercase tracking-[0.2em] font-bold">Protocol: Alpha-9</p>
                    <h3 className="font-manrope text-lg sm:text-xl text-on-surface font-bold uppercase">Rapid Response Shield</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed opacity-70 mb-8">
                  Authorized institutional-grade asset containment. Immediate multi-chain freeze for verified security breaches.
                </p>
              </div>
              <button 
                onClick={onServiceClick}
                className="w-full bg-error text-white h-12 sm:h-14 rounded font-bold text-[10px] sm:text-xs flex items-center justify-center gap-3 hover:bg-error/90 active:scale-[0.98] transition-all tracking-[0.1em] shadow-lg shadow-error/10 cursor-pointer"
              >
                <Lock size={16} />
                INITIATE EMERGENCY LOCK
              </button>
            </div>
            
            {/* Technical Metrics Column */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status / Active Timer</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-lg text-center md:text-left">
                  <p className="text-2xl sm:text-4xl font-fira font-light text-on-surface tabular-nums tracking-wider leading-none">{formatTime(time)}<span className="text-[10px] text-error ml-2 font-bold uppercase">UTC</span></p>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-error/40 w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Validator Consensus</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-900 bg-emerald-500/20"></div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-900 bg-emerald-500/20"></div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-900 bg-emerald-500/20"></div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-900 bg-slate-800"></div>
                    </div>
                    <span className="text-[10px] font-fira text-emerald-400">92% READY</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Last Intercept</p>
                  <p className="text-[10px] sm:text-xs font-fira text-on-surface">0x8F...D92 <span className="text-slate-500 ml-2 whitespace-nowrap">// {lastIntercept.toFixed(1)}s ago</span></p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px]">
                    <span className="font-fira text-slate-500 uppercase">Encryption:</span>
                    <span className="font-fira text-primary font-bold">QUANTUM-RESISTANT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Viz */}
      <section className="mb-20 sm:mb-stack-lg">
        <div className="glass-card rounded-2xl p-6 sm:p-10 border-white/10 relative overflow-hidden group/map">
          <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-fira font-bold text-blue-500 uppercase tracking-widest">Global Status: Active</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-manrope font-black text-white uppercase tracking-tight">Forensic <span className="text-blue-500">Infrastructure</span></h3>
              <p className="text-xs sm:text-sm text-slate-500 font-fira mt-1 uppercase tracking-[0.2em]">Distributed recovery nodes & tracking</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-8 bg-slate-950/50 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-right">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recovered</p>
                <p className="text-xl sm:text-2xl font-black text-white font-manrope flex items-center gap-1 sm:gap-2 justify-end">
                  <span className="text-blue-500">$</span>4.82<span className="text-blue-500/60 text-base sm:text-lg">B</span>
                </p>
              </div>
              <div className="h-8 sm:h-10 w-px bg-white/10"></div>
              <div className="text-right">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nodes</p>
                <p className="text-xl sm:text-2xl font-black text-white font-manrope tracking-tight">84,102</p>
              </div>
            </div>
          </div>
          
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-2xl bg-[#07090e] border border-white/5 overflow-hidden shadow-2xl scanner-line">
            {/* Architectural Background */}
            <div className="absolute inset-0 opacity-20 grid-pattern"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            {/* Stylized World Map SVG */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full opacity-20" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
                <path 
                  fill="currentColor" 
                  className="text-blue-500"
                  d="M210,130 Q220,120 240,110 T280,105 T320,115 T350,140 T380,180 T350,220 T310,240 T260,250 T220,230 T190,180 T210,130 Z 
                     M700,100 Q750,80 800,110 T850,150 T880,220 T840,280 T780,300 T720,260 T680,200 T700,100 Z
                     M450,250 Q480,230 520,240 T560,280 T540,330 T490,350 T440,320 T450,250 Z
                     M150,300 Q180,280 220,310 T250,350 T220,390 T160,380 T140,340 T150,300 Z"
                />
                {/* Data Arcs */}
                <path className="animate-[pulse_4s_infinite]" d="M250 150 Q 500 50 750 180" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="5 5"></path>
                <path className="animate-[pulse_3s_infinite]" d="M220 330 Q 480 250 780 210" fill="none" stroke="rgba(0,219,233,0.3)" strokeWidth="1" strokeDasharray="3 3"></path>
              </svg>
            </div>

            {/* Glowing Nodes */}
            {[
              { top: '35%', left: '26%', color: 'bg-blue-500', label: 'NODE_SEC_1', data: '18.4 TB/s' },
              { top: '22%', left: '78%', color: 'bg-blue-400', label: 'NODE_HUB_0', data: '42.1 TB/s' },
              { top: '68%', left: '52%', color: 'bg-cyan-500', label: 'NODE_BR_9', data: '09.5 TB/s' },
              { top: '75%', left: '20%', color: 'bg-indigo-500', label: 'NODE_LAT_4', data: '12.8 TB/s' },
            ].map((node, i) => (
              <div key={i} className="absolute group/node" style={{ top: node.top, left: node.left }}>
                <div className="relative cursor-pointer">
                  <div className={`w-4 h-4 ${node.color} rounded-full relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]`}>
                    <div className={`absolute inset-0 ${node.color} rounded-full animate-ping opacity-40`}></div>
                    <div className={`absolute inset-[-8px] border border-blue-500/30 rounded-full map-pulse`}></div>
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 opacity-0 group-hover/node:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/node:translate-y-0 z-20">
                    <div className="bg-slate-950/90 backdrop-blur-xl border border-blue-500/30 p-3 rounded-lg shadow-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-fira font-bold text-blue-500 uppercase">{node.label}</span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white font-bold">{node.data}</p>
                        <p className="text-[8px] text-slate-500 font-fira">STATUS: SYNCED</p>
                        <p className="text-[8px] text-slate-500 font-fira">LATENCY: 12ms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Scanning Radar Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full opacity-20"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/5 rounded-full opacity-20"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/5 rounded-full opacity-20"></div>
            </div>
            
            {/* Live Feed Terminal */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl font-fira text-[9px] sm:text-[10px] w-48 sm:w-64 max-h-24 sm:max-h-32 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 border-b border-white/10 pb-2">
                <R size={12} className="text-blue-500 transform rotate-45" />
                <span className="font-bold text-white uppercase tracking-widest text-[8px] sm:text-[9px]">Live Forensic Stream</span>
              </div>
              <div className="space-y-1.5 sm:space-y-2 opacity-80">
                <div className="flex items-start gap-2 text-nowrap overflow-hidden">
                  <span className="text-blue-500/60 font-bold shrink-0">[2.1]</span>
                  <span className="text-slate-400 truncate">103.24.201.88 INTERCEPT</span>
                </div>
                <div className="flex items-start gap-2 text-nowrap overflow-hidden">
                  <span className="text-blue-500/60 font-bold shrink-0">[2.1]</span>
                  <span className="text-slate-400 truncate">BLOCK: 19821.03 SYNC</span>
                </div>
              </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/30 opacity-50"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/30 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/30 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500/30 opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-stack-lg">
        {[
          {
            title: "Wallet Recovery",
            desc: "Advanced seed phrase reconstruction and brute-force key derivation for lost HD wallets. Supported on 120+ asset types.",
            icon: Wallet,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
            stats: { 'Entropy Level': '256-Bit Secure', 'Last Run': '2m ago' },
            points: ['BIP39/44 Reconstruction', 'Multi-Sig Recomposition'],
            action: 'BEGIN PROCESS',
            success: '94.8%'
          },
          {
            title: "Scam & Fraud Assistance",
            desc: "Victim support protocols for phishing, rug pulls, and social engineering. Immediate asset movement freeze and reporting.",
            icon: ShieldAlert,
            color: "text-error",
            bg: "bg-error/10",
            border: "border-error/20",
            stats: { 'Detection Rate': 'Real-time', 'Legal Nexus': 'Interpol API' },
            points: ['Direct Node Intervention', 'Legal Nexus Support'],
            action: 'BEGIN SHIELD',
            success: '< 8m Response'
          },
          {
            title: "Forensic Tracking",
            desc: "Live chain-link analysis and hop-tracking across mixers and cross-chain bridges. Visual forensic mapping included.",
            icon: Radar,
            color: "text-secondary-fixed",
            bg: "bg-secondary-fixed/10",
            border: "border-secondary-fixed/20",
            stats: { 'Chains Mapped': '80+ Layer1s', 'Cluster Size': 'Petabytes' },
            points: ['Cross-Chain Mapping', 'AML/KYC Enrichment'],
            action: 'BEGIN MAP NETWORK',
            success: '1,840+ Active'
          },
          {
            title: "Exchange Recovery",
            desc: "Direct mediation with centralized exchange compliance teams to retrieve held, misrouted, or frozen assets via institutional API channels.",
            icon: Landmark,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
            stats: { 'Exchanges': '25+ Global Tier1', 'SuccessRate': '91.2%' },
            points: ['Law Enforcement Liaison', 'KYC/AML Proxy Filing'],
            action: 'BEGIN API',
            success: 'Institutional'
          },
          {
            title: "Expert Consultation",
            desc: "One-on-one strategic recovery architecture sessions with senior forensic leads and legal counsel for high-value asset retrieval cases.",
            icon: ShieldCheck,
            color: "text-secondary-fixed",
            bg: "bg-secondary-fixed/10",
            border: "border-secondary-fixed/20",
            stats: { 'Consultants': 'Senior Leads', 'Response': '< 12 Hours' },
            points: ['Strategic Blueprinting', 'Legal Compliance Audit'],
            action: 'BOOK SESSION',
            success: 'Reserved'
          },
          {
            title: "Custom Protocol",
            desc: "Tailored smart contract intervention and localized node-level rescue scripts for non-standard DeFi exploits and zero-day vulnerabilities.",
            icon: FlaskConical,
            color: "text-error",
            bg: "bg-error/10",
            border: "border-error/20",
            stats: { 'Compiler': 'Rust / Solidity', 'Codebase': 'Modular' },
            points: ['Private Mempool Rescue', 'Flashloan Mitigation'],
            action: 'BEGIN BUILD',
            success: 'Tailored'
          }
        ].map((s, i) => (
          <div 
            key={i} 
            onClick={onServiceClick}
            className="glass-card p-6 flex flex-col group rounded-xl transition-all duration-500 hover:bg-slate-900/60 cursor-pointer border border-white/5 hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} group-hover:scale-110 transition-all duration-300`}>
                <s.icon className="w-8 h-8 glow-icon" />
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-fira ${s.color} uppercase tracking-widest font-bold`}>Node Active</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {Object.entries(s.stats).map(([k, v], idx) => (
                  <div key={idx} className="p-2 rounded bg-white/5 border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">{k}</p>
                    <p className={`text-[11px] font-fira ${s.color}`}>{v}</p>
                  </div>
                ))}
              </div>
              <ul className="space-y-2">
                {s.points.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-400 uppercase font-fira">
                    <CheckCircle className={`w-3.5 h-3.5 ${s.color}`} /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                <p className={`${s.color} font-fira text-lg font-bold`}>{s.success}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceClick();
                }}
                className="bg-primary text-white h-12 px-6 rounded-lg font-bold text-[10px] flex items-center gap-2 hover:brightness-125 active:scale-95 transition-all cursor-pointer"
              >
                {s.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-20 sm:mb-stack-lg">
        <div className="glass-card p-6 sm:p-10 rounded-sm border border-blue-500/20 relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary glow-icon shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Recovered (24h)</p>
                <p className="text-xl sm:text-2xl font-bold text-white font-manrope tracking-tight">$4.1M <span className="text-primary text-xs sm:text-sm">USD</span></p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 sm:border-l border-white/5 pl-0 sm:pl-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container glow-icon shrink-0">
                <Gauge size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Throughput</p>
                <p className="text-xl sm:text-2xl font-bold text-white font-manrope tracking-tight">28.4 <span className="text-secondary-container text-xs sm:text-sm">TH/s</span></p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:border-l border-white/5 pl-0 lg:pl-8 sm:col-span-2 lg:col-span-1 border-t sm:border-t-0 pt-6 sm:pt-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary glow-icon shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Network State</p>
                <p className="text-xl sm:text-2xl font-bold text-white font-manrope tracking-tight uppercase">ENCRYPTED</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
