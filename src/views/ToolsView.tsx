import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  FileCheck, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  ArrowRight,
  Fingerprint,
  Lock,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export const ToolsView = () => {
  const [address, setAddress] = React.useState('');
  const [isAuditing, setIsAuditing] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState<null | { score: number, status: string }>(null);
  const [throughput, setThroughput] = React.useState(1.4);
  const [entityTags, setEntityTags] = React.useState(402129);
  const [eps, setEps] = React.useState(12.4);
  const [logs, setLogs] = React.useState([
    { time: '17:24:02', text: 'SOURCE: TOR_NODE_82 // PKT_CAP: 1.2MB' },
    { time: '17:24:03', text: 'ANALYZING_CLUSTER_XJ9... [MATCH_92%]' },
    { time: '17:24:05', text: 'ALERT: SUSPICIOUS_BRIDGE_TX // NET: SOLANA' },
    { time: '17:24:06', text: 'PING: VASP_COMPLIANCE_API // RESPONSE: 200' },
    { time: '17:24:08', text: 'SYNC_COMPLETE // UPDATING_ENTITY_DB...' },
    { time: '17:24:09', text: 'IDLE // STANDBY_MODE_ACTIVE' }
  ]);

  React.useEffect(() => {
    const statInterval = setInterval(() => {
      setThroughput(prev => parseFloat((prev + (Math.random() > 0.5 ? 0.01 : -0.01)).toFixed(2)));
      setEntityTags(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setEps(prev => parseFloat((prev + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1)));
    }, 3000);

    const logInterval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      const timeStr = `${hh}:${mm}:${ss}`;
      
      const actions = [
        'SOURCE: TOR_NODE_' + Math.floor(Math.random() * 99),
        'ANALYZING_CLUSTER_' + Math.random().toString(36).substring(7).toUpperCase(),
        'ALERT: P2P_ANOMALY_DETECTED',
        'PING: COMPLIANCE_NODE_' + Math.floor(Math.random() * 10),
        'SYNC_STATUS: OK // NODES_STABLE',
        'ENCRYPTED_PAYLOAD_RECEIVED // SIZE: ' + (Math.random() * 5).toFixed(1) + 'MB'
      ];

      setLogs(prev => {
        const newLog = { time: timeStr, text: actions[Math.floor(Math.random() * actions.length)] };
        return [newLog, ...prev.slice(0, 5)];
      });
    }, 2000);

    return () => {
      clearInterval(statInterval);
      clearInterval(logInterval);
    };
  }, []);

  const runAudit = () => {
    if (!address) return;
    setIsAuditing(true);
    setAuditResult(null);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        score: Math.floor(Math.random() * 40) + 60,
        status: 'HIGH_RISK_ASSOCIATION'
      });
    }, 2000);
  };

  return (
    <main className="pt-32 pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen relative z-10">
      <div className="mb-12 border-l-4 border-blue-600 pl-6">
        <h1 className="text-4xl font-manrope font-black text-white uppercase tracking-tight mb-2">Forensic <span className="text-blue-500">Toolkit</span></h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Operational Utilities // v4.0.2</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tool 1: Address Risk Auditor */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Search size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Address Risk Auditor</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Cross-referencing 400M+ Labeled Entities</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ENTER WALLET ADDRESS [0x... / bc1...]"
                  className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-6 pr-32 py-5 rounded-2xl font-mono text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                />
                <button 
                  onClick={runAudit}
                  disabled={isAuditing}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-manrope font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? 'AUDITING...' : 'RUN_AUDIT'}
                </button>
              </div>

              {isAuditing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-blue-400">
                    <span>SCANNING_NODES...</span>
                    <span>42% COMPLETE</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              )}

              {auditResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Threat Score</p>
                    <p className="text-3xl font-mono font-bold text-red-400">{auditResult.score}/100</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Status</p>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">{auditResult.status}</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <button className="flex items-center gap-2 text-[10px] font-mono text-blue-400 hover:text-white transition-colors uppercase tracking-widest">
                      View full graph <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Sanctions List', 'Darknet Mixer', 'Exchange Deposit', 'Bridge Hub'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-[10px] font-mono text-slate-500 border border-white/5 p-3 rounded-xl bg-white/5">
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Secondary Tools */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="text-emerald-500 w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Integrity Verifier</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Cryptographic validation of case files and forensic exports.</p>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer">
              <Terminal className="text-slate-700 mb-2" size={24} />
              <p className="text-[10px] font-mono text-slate-500 uppercase">Drop case file to verify</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-purple-500 w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">PGP Payload Encoder</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Encrypt offline messages for secure forensic relay.</p>
            <textarea 
              className="w-full bg-[#0a0e16]/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-white/50 h-24 mb-4 outline-none focus:border-purple-500/50 resize-none"
              placeholder="PLAINTEXT_SEQUENCE_..."
            ></textarea>
            <button className="w-full py-3 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
              Generate Payload
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-950/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="text-blue-500 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">NFT Origin Authenticator</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Validate asset provenance and metadata integrity for high-value digital collectibles. Detect counterfeit contracts.</p>
          <div className="flex gap-4">
            <input type="text" placeholder="CONTRACT_ADDRESS" className="flex-1 bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-blue-500" />
            <button className="px-6 py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Verify</button>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-950/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-amber-500 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">DEX Liquidity Analyzer</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Scan liquidity pools for "Rug Pull" indicators and developer wallet concentration. Real-time LP burn tracking.</p>
          <div className="flex gap-4">
            <input type="text" placeholder="POOL_PAIR_ADDRESS" className="flex-1 bg-[#0a0e16]/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-amber-500" />
            <button className="px-6 py-3 bg-amber-600/10 border border-amber-500/30 text-amber-400 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all">Analyze</button>
          </div>
        </div>
      </div>

      {/* Global Live Feed Section */}
      <div className="mt-12 glass-panel p-8 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
            <Activity className="text-blue-500" size={20} /> Darknet Node Monitor
          </h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Global Sync Active</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'ATTACK_VECTORS', val: '22 Active', icon: <ShieldAlert size={14} /> },
              { label: 'NODE_THROUGHPUT', val: `${throughput.toFixed(2)} PB/day`, icon: <Cpu size={14} /> },
              { label: 'ENTITY_TAGS', val: entityTags.toLocaleString(), icon: <Fingerprint size={14} /> },
              { label: 'RECOVERY_EPS', val: `${eps.toFixed(1)} / hr`, icon: <Zap size={14} /> }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  {stat.icon}
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <p className="text-xl font-mono font-bold text-white tracking-tighter">{stat.val}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 bg-black/40 rounded-xl p-4 border border-white/5 h-[120px] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent z-10"></div>
            <div className="space-y-1 font-mono text-[8px] text-emerald-500/70">
              {logs.map((log, idx) => (
                <p key={idx}>{`[${log.time}] ${log.text}`}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
