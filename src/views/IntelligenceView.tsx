import React from 'react';
import { 
import { SeoEnrichment } from '../components/SeoEnrichment';
  ShieldCheck, 
  Network, 
  Info, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Upload,
  LayoutDashboard,
  Layers,
  Search,
  Users
} from 'lucide-react';

const INTELLIGENCE_MAILTO = (() => {
  const email = 'info@cryptorecoveryasset.com';
  const subject = 'Intelligence Submission — Crypto Recovery Assets';
  const body = [
    'Please share your intelligence report below.',
    '',
    'Summary:',
    '',
    '',
    'Source / reference:',
    '',
    '',
    'Additional details:',
    '',
  ].join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
})();

export const IntelligenceView = () => {
  const [riskIndex, setRiskIndex] = React.useState(89.4);
  const [exploitVectors, setExploitVectors] = React.useState(402);
  const [threatActors, setThreatActors] = React.useState(12041);
  const [threats, setThreats] = React.useState([
    { id: '#INC-8821', title: 'DEX Liquidity Drain via Reentrancy', status: 'CRITICAL', priority: 'PRIORITY_01', color: 'border-l-red-400', textColor: 'text-red-400', bg: 'bg-red-400/10', secondsAgo: 0.2, detail: '0x8a...2e1c' },
    { id: '#INC-8820', title: 'Suspicious Token Mint Event', status: 'WARNING', priority: 'PRIORITY_02', color: 'border-l-yellow-400', textColor: 'text-yellow-400', bg: 'bg-yellow-400/10', secondsAgo: 12, detail: '0x4f...99ab' },
    { id: '#INC-8819', title: 'Phishing Site URL Expansion', status: 'MONITOR', priority: 'PRIORITY_03', color: 'border-l-blue-400', textColor: 'text-blue-400', bg: 'bg-blue-400/10', secondsAgo: 60, detail: 'trust-wallet.xyz' }
  ]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRiskIndex(prev => {
        const next = prev + (Math.random() > 0.5 ? 0.1 : -0.1);
        return parseFloat(next.toFixed(1));
      });
      setExploitVectors(prev => prev + (Math.random() > 0.8 ? 1 : Math.random() > 0.2 ? 0 : -1));
      setThreatActors(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? 0 : -1));
      
      setThreats(prev => prev.map(t => ({
        ...t,
        secondsAgo: t.secondsAgo + 0.1
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const formatAgo = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s AGO`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m AGO`;
  };

  return (
    <main className="pt-40 sm:pt-52 pb-32 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen relative overflow-hidden">
      {/* Background Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Header Section */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-mono text-blue-400 uppercase tracking-widest">System Status: Nominal</span>
            <span className="text-slate-600">/</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Session: #D822-04</span>
          </div>
          <h1 className="text-4xl lg:text-5xl text-white mb-3 tracking-tighter font-manrope font-extrabold uppercase">
            INTELLIGENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">COMMAND</span>
          </h1>
          <p className="text-slate-400 max-w-2xl font-manrope text-base leading-relaxed">
            Real-time interrogation of cross-chain digital asset vulnerabilities and malicious entity profiling.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="glass-panel px-5 py-3 rounded-xl flex items-center gap-3 border-red-400/20 bg-red-400/5 group">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-red-400 opacity-60 uppercase tracking-widest">BROADCAST</span>
              <span className="text-xs font-bold text-red-400 tracking-widest uppercase">LIVE THREATS</span>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 rounded-xl flex items-center gap-3 border-blue-400/20 bg-blue-400/5">
            <Activity className="text-blue-400 animate-spin-slow" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-400 opacity-60 uppercase tracking-widest">DISTRIBUTED</span>
              <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">12 NODES ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 relative z-10">
        {/* 1. Global Threat Level */}
        <section className="col-span-12 lg:col-span-4 glass-panel p-6 flex flex-col items-center group relative overflow-hidden rounded-xl border border-white/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-scan"></div>
          
          <div className="w-full flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">CRYPTO NETWORK RISK</h3>
            <Info className="text-slate-700 w-4 h-4" />
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            {/* SVG Gauge */}
            <svg className="w-full h-full -rotate-90">
              <circle cx="128" cy="128" fill="transparent" r="118" stroke="rgba(255,255,255,0.02)" strokeWidth="2"></circle>
              <circle cx="128" cy="128" fill="transparent" r="105" stroke="rgba(255,255,255,0.05)" strokeWidth="15"></circle>
              <circle 
                className="transition-all duration-1000 ease-out"
                cx="128" cy="128" fill="transparent" r="105" 
                stroke="#ffb4ab" 
                strokeDasharray="660" 
                strokeDashoffset="120" 
                strokeLinecap="round" 
                strokeWidth="15"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 180, 171, 0.6))' }}
              ></circle>
              <circle cx="128" cy="128" fill="transparent" r="85" stroke="rgba(255,180,171,0.1)" strokeDasharray="4 8" strokeWidth="1"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-widest">RISK INDEX</span>
              <span className="text-5xl text-white mb-1 font-bold">{riskIndex.toFixed(1)}<span className="text-xl opacity-50">%</span></span>
              <div className="px-3 py-1 bg-red-400/20 border border-red-400/40 rounded-full">
                <span className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-widest">CRITICAL STATE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full border-t border-white/5 pt-8 bg-gradient-to-b from-transparent to-red-400/5 -mx-6 px-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">EXPLOIT VECTORS</p>
              <div className="flex items-end gap-2">
                <p className="font-mono text-2xl text-white leading-none">{exploitVectors.toLocaleString()}</p>
                <span className="text-[10px] text-red-400 font-mono mb-0.5">+12.4%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">THREAT ACTORS</p>
              <div className="flex items-end gap-2">
                <p className="font-mono text-2xl text-white leading-none">{threatActors.toLocaleString()}</p>
                <span className="text-[10px] text-red-400 font-mono mb-0.5">+241</span>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white/5 mt-8 pt-8">
            <h3 className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-4">THREAT CLUSTER VISUALIZATION</h3>
            <div className="relative h-40 flex items-center justify-center">
              {/* Visualization Placeholder/SVG */}
              <svg className="w-full h-full opacity-70" viewBox="0 0 200 100">
                <line stroke="#0062ff" strokeDasharray="2 2" strokeWidth="0.5" x1="40" x2="100" y1="20" y2="50"></line>
                <line stroke="#0062ff" strokeWidth="0.5" x1="100" x2="140" y1="50" y2="30"></line>
                <line stroke="#ffb4ab" strokeWidth="0.8" x1="100" x2="160" y1="50" y2="75"></line>
                <line stroke="#0062ff" strokeWidth="0.5" x1="100" x2="60" y1="50" y2="85"></line>
                <circle cx="100" cy="50" fill="#0062ff" r="3"></circle>
                <circle cx="40" cy="20" fill="#0062ff" r="1.5"></circle>
                <circle cx="140" cy="30" fill="#0062ff" r="1.5"></circle>
                <circle className="animate-pulse" cx="160" cy="75" fill="#ffb4ab" r="2.5"></circle>
                <circle cx="60" cy="85" fill="#0062ff" r="1.5"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex justify-between items-start">
                  <span className="text-[7px] font-mono text-blue-500 bg-blue-500/10 px-1 rounded">ON-CORE-01</span>
                  <span className="text-[7px] font-mono text-slate-500">SIG_INT_RELAY_04</span>
                </div>
                <div className="flex justify-end items-center mr-8">
                  <span className="text-[7px] font-mono text-red-400 bg-red-400/10 px-1 rounded animate-pulse">MALICIOUS_RELAY_B8</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[7px] font-mono text-slate-600">SECURE_TUNNEL_08</span>
                  <span className="text-[7px] font-mono text-blue-400">UPLINK_PRIMARY</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-2 bg-blue-500/5 rounded border border-blue-500/10">
              <p className="text-[8px] font-mono text-blue-400 uppercase tracking-widest">CLUSTER DENSITY: HIGH (0.84)</p>
            </div>
          </div>
        </section>

        {/* 2. Live Threat Feed */}
        <section className="col-span-12 lg:col-span-8 glass-panel p-6 flex flex-col h-[520px] rounded-xl border border-white/5 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-1">LIVE THREAT FEED</h3>
              <p className="text-[9px] text-slate-600 font-mono uppercase">STREAMING_REALTIME_FORENSICS.LOG</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <div className="h-1 w-8 bg-blue-500/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-blue-500/70">ACTIVE</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {/* Threat Entry High */}
            {threats.map((threat, i) => (
              <div key={i} className={`group relative bg-white/[0.02] hover:bg-white/[0.05] p-5 border border-white/5 border-l-4 ${threat.color} rounded-r-xl transition-all duration-300 overflow-hidden`}>
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex gap-5">
                    <div className="mt-1 flex flex-col items-center gap-1">
                      <span className={`font-mono ${threat.textColor} text-[10px] ${threat.bg} px-1.5 py-0.5 rounded`}>{threat.id}</span>
                      <div className={`w-[1px] h-full bg-gradient-to-b from-${threat.textColor}/50 to-transparent`}></div>
                    </div>
                    <div>
                      <h4 className="font-manrope text-sm text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{threat.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><span className={`w-1 h-1 rounded-full ${threat.bg.replace('bg-', 'bg-opacity-50 ')}`}></span> DETECTED: {formatAgo(threat.secondsAgo)}</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-700"></span> SOURCE: {threat.detail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 ${threat.bg} ${threat.textColor} text-[9px] font-bold tracking-widest border border-white/10 rounded-full`}>{threat.status}</span>
                    <span className="text-[8px] font-mono text-slate-600 mt-2 uppercase tracking-tighter">{threat.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Malicious Entity Tracker */}
        <section className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">MALICIOUS ENTITY TRACKER</h3>
            <div className="flex flex-col items-end mr-4">
              <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">24H SEIZURE VELOCITY</span>
              <svg className="w-16 h-4 opacity-70" viewBox="0 0 100 20">
                <polyline fill="none" points="0,18 10,15 20,17 30,12 40,14 50,8 60,10 70,3 80,6 90,2 100,5" stroke="#ffb4ab" strokeWidth="1.5"></polyline>
              </svg>
            </div>
            <div className="px-2 py-1 bg-white/5 rounded flex gap-1 items-center">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              <span className="text-[8px] font-mono text-slate-400">SYNCING_DB</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="text-[9px] text-slate-600 border-b border-white/10 uppercase tracking-widest">
                  <th className="pb-4 font-bold">ENTITY / ADDRESS</th>
                  <th className="pb-4 font-bold text-center">THREAT_LEVEL</th>
                  <th className="pb-4 font-bold text-right">NODE_ID</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { addr: '0xde0b...9a12', level: 98, node: 'Node-Alpha', color: 'text-red-400', bg: 'bg-red-400' },
                  { addr: 'eth-mixer.onion', level: 72, node: 'Node-Gamma', color: 'text-yellow-400', bg: 'bg-yellow-400' },
                  { addr: '0x5511...ff22', level: 94, node: 'Sentinel-V', color: 'text-red-400', bg: 'bg-red-400' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors cursor-crosshair">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-2 h-2 rounded-full ${row.bg}`}></div>
                          <div className={`absolute inset-0 ${row.bg} animate-ping opacity-40`}></div>
                        </div>
                        <span className="text-white font-bold group-hover:text-blue-400 transition-colors uppercase">{row.addr}</span>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`${row.color} font-black`}>{row.level}</span>
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${row.bg} transition-all duration-1000`} style={{ width: `${row.level}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-right text-slate-500 uppercase">{row.node}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="text-[9px] font-mono text-blue-500/70 hover:text-blue-400 transition-colors uppercase tracking-[0.3em] cursor-pointer">
              -- EXPAND FORENSIC DATABASE --
            </button>
          </div>
        </section>

        {/* 5. Interrogation Nodes */}
        <section className="col-span-12 lg:col-span-6 glass-panel p-6 flex flex-col rounded-xl border border-white/5 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">INTERROGATION NODES</h3>
            <span className="font-mono text-[9px] text-blue-500 flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> SCANNING ACTIVE
            </span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-3 bg-black/40 rounded-xl p-4 border border-white/5 relative overflow-hidden">
            {/* Grid background pattern */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0062ff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            {[
              { id: 'BTC-01', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'ETH-Main', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'SOL-Threat', status: 'VULN', perf: 'VULN_DETECT', color: 'text-red-400', bg: 'bg-red-400/5', border: 'border-red-400/40', alert: true },
              { id: 'ARB-Scan', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'BSC-09', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'AVAX-W', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'BASE-X', status: 'UP', perf: '99.9%', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { id: 'L2-OFF', status: 'OFFLINE', perf: 'OFFLINE', color: 'text-slate-500', bg: 'bg-white/5', border: 'border-white/10', offline: true }
            ].map((node, i) => (
              <div key={i} className={`relative group cursor-pointer ${node.offline ? 'grayscale opacity-40' : ''}`}>
                {node.alert && <div className="absolute inset-0 bg-red-400/20 blur-xl opacity-20 animate-pulse"></div>}
                <div className={`relative flex flex-col items-center justify-center h-24 border ${node.border} rounded-lg ${node.bg} hover:border-blue-500 transition-all active:scale-95`}>
                  <Network className={`${node.color} mb-2 ${node.alert ? 'animate-bounce' : ''}`} size={20} />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">{node.id}</span>
                  <span className={`text-[7px] ${node.color} mt-1 font-mono uppercase tracking-tighter`}>{node.perf}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-blue-500/40 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-500/40 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-500/40 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">Global Forensic Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-500 font-mono">99.9%</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
          </div>
        </section>

        {/* 4. Deep Dive Reports */}
        <section className="col-span-12 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">FORENSIC INTELLIGENCE REPORTS</h3>
              <div className="h-px w-24 bg-white/5"></div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center hover:bg-white/10 text-slate-400 transition-all hover:text-white group border border-white/10">
                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center hover:bg-white/10 text-slate-400 transition-all hover:text-white group border border-white/10">
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tag: 'CRITICAL BRIEF',
                tagColor: 'bg-red-500',
                title: 'Lazarus Group: Chain Hopping Vectors',
                desc: 'Detailed analysis of North Korean asset laundering techniques across decentralized bridges.',
                date: '22.05.2024',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1EjSdQ17bRuBNBHfG0N3zcYBXs7iEBtzOa3ZuN97kti7U3KjUEIlwH_cCfk9gFDL6JUqPq1AvEbWCJeCLxCQ0raMwWXbF8EpVpfUz5ldig8GyjnpIzsWmg6Q5YdkF4s2M1twpERTc4CflcWSTATxm0zyifdChfkC1FUntY-6FOr0NH-VoOVKCOIDhZM-REjoVFpjinDoNQwNSU9N5Cs3nIUvmc5sqOQYiFGELzXuCPwMnlNSrEEK90IqyJmISXzKLvayU6b2m3Tk'
              },
              {
                tag: 'NEW ANALYSIS',
                tagColor: 'bg-yellow-500',
                title: 'DeFi Bridge Zero-Day: Analysis',
                desc: 'Forensic breakdown of the recent $400M exploit targeting cross-chain liquidity providers.',
                date: '20.05.2024',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh6MTN7HgI6Pmu3qmfpklUQ3f4eRGIM3J9VpMtG90vZRzQ0cGDUqLtzblnWn0-Kv15TdaE6PowHI6Q9fBqPQExow4RDnxbya2Zoi0lMwHNH3ZTGvKWcjmI-dMtuoR-NGDMYQZCy0SnPWIf4lVpyrkfUKpOE9FOt20R7MwaIy9wEGdZNgoCFbkw-fuW35IwDGKTaU2rPZfk4VAy8ZaviPhQUQHNsu7Zbh8toLdTKeBfCLvptcnGmlMZJlhx8FOPUvrGka4vrvi8rmw'
              },
              {
                tag: 'MARKET INTEL',
                tagColor: 'bg-blue-500',
                title: 'Phishing-as-a-Service Trends',
                desc: 'Monitoring the proliferation of automated drainer kits in darknet forums and Telegram channels.',
                date: '18.05.2024',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj0KAEFHTThAGj3TVm5-Gg9t_NJ9hHMENmX44jp6DP7oBSCFprmJJu550TKPj9Og4YPRn0t-4VW0D0mdtrE_QWmp_YjyjwqTfJ1Kilox9meNiEZRcqU98e6E8MX-3HbHZuPHzJDsu02zKaLTerlvKfKVDpgj1_tGnPV4nSrMco1aAF7FC8-SbBYc8gpW-9XEhF7N7dB8U_GuhFsURnjTHOqIZq_sYVvH73lsSwUwiTrv261KqQ9upPuSroIEHlwlsMBLvGLOjqIE'
              }
            ].map((report, i) => (
              <div key={i} className="glass-panel overflow-hidden group cursor-pointer transition-all hover:-translate-y-2 rounded-xl border border-white/5">
                <div className="h-56 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={report.title} 
                    src={report.img}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`${report.tagColor} px-2.5 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-widest shadow-lg shadow-black/20`}>{report.tag}</span>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded w-fit mb-2 border border-blue-500/20">
                      <span>SECURE ACCESS</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-manrope text-xl text-white mb-3 group-hover:text-blue-400 transition-colors uppercase font-bold tracking-tight">{report.title}</h4>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed font-manrope">{report.desc}</p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest border-t border-white/5 pt-6 group-hover:text-blue-500 transition-colors">
                    <span>PUBLISHED: {report.date}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-24 py-20 relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl border border-white/5 rounded-3xl"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-blue-500/30"></div>
            <span className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em]">Secure Communication Channel</span>
            <div className="h-px w-8 bg-blue-500/30"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold font-manrope text-white mb-8 max-w-2xl uppercase tracking-tighter">SECURE YOUR ASSETS WITH ADVANCED INTERROGATION</h2>
          <div className="flex justify-center">
            <a
              href={INTELLIGENCE_MAILTO}
              className="bg-blue-600 text-white px-12 py-5 rounded-lg font-manrope font-extrabold uppercase tracking-widest flex items-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_#0062ff44] group no-underline"
            >
              <Upload className="group-hover:rotate-12 transition-transform" size={20} />
              Submit Intelligence
            </a>
          </div>
          <p className="mt-10 text-slate-500 font-mono text-[10px] uppercase tracking-widest">ESTABLISHED SECURE P2P CONNECTION: 256-BIT ENCRYPTION ACTIVE</p>
        </div>
      </div>
    
      <SeoEnrichment page="intelligence" />
    </main>
  );
};
