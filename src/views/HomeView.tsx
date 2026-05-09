import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BadgeCheck, 
  Gavel, 
  FileCheck, 
  Landmark, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Network, 
  ShieldAlert
} from 'lucide-react';
import { ProgressBar, ForensicAgent } from '../components/Common';
import { CRYPTO_CURRENCIES } from '../constants';
import { ReviewsSection } from '../components/ReviewsSection';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface HomeViewProps {
  onNavigate: (view: any) => void;
}

export const HomeView = ({ onNavigate }: HomeViewProps) => {
  const [balance, setBalance] = React.useState(500000);
  const [traceCount, setTraceCount] = React.useState(2841);
  const [secondsSinceLast, setSecondsSinceLast] = React.useState(12.4);

  React.useEffect(() => {
    const traceInterval = setInterval(() => {
      setTraceCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);

    const secInterval = setInterval(() => {
      setSecondsSinceLast(prev => {
        const next = prev + 0.1;
        return next > 30 ? 0.1 : parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => {
      clearInterval(traceInterval);
      clearInterval(secInterval);
    };
  }, []);

  const [network, setNetwork] = React.useState('Bitcoin (BTC)');
  const [customNetwork, setCustomNetwork] = React.useState('');
  const [isOtherNetwork, setIsOtherNetwork] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    entityId: '',
    service: 'Wallet Recovery'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'OTHER') {
      setIsOtherNetwork(true);
      setNetwork('');
    } else {
      setIsOtherNetwork(false);
      setNetwork(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedEmail = formData.email.trim().toLowerCase();
    const submissionData = {
      operatorAlias: formData.name,
      secureComms: normalizedEmail,
      phone: formData.phone,
      incidentVector: formData.service.toUpperCase().replace(/\s/g, '_'),
      targetNetwork: network === 'Other' ? customNetwork : network,
      transactionHash: formData.entityId || 'HOME_TRIAGE_REF',
      caseNarrative: `Submitted via Home Triage Form. Entity ID: ${formData.entityId || 'N/A'}. Network: ${network}. Service: ${formData.service}.`,
      estimatedValue: parseFloat(balance) || 0,
      createdAt: serverTimestamp(),
      status: 'PENDING',
      formSource: 'Home_Triage_Form',
      name: formData.name,
      email: normalizedEmail,
      entityId: formData.entityId,
      service: formData.service
    };

    // 1. Save to Firestore
    try {
      await addDoc(collection(db, 'recovery_requests'), submissionData);
    } catch (fsError) {
      console.error("Firestore submission error:", fsError);
      // We don't block here because users might have different permission levels, 
      // but the rule should allow this public creation now.
    }

    // 2. Call server API for email notification
    try {
      await fetch('/api/submit-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error("Email API error:", error);
    }

    // Always navigate to confirmation after submit
    onNavigate('recoveryConfirmation');
  };

  return (
    <div className="pt-40 sm:pt-52 pb-20 px-4 sm:px-6 max-w-[1600px] mx-auto w-full">
      {/* Hero & Main Viz */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-16 items-start mb-20 sm:mb-stack-lg">
        <div className="space-y-6 sm:space-y-stack-md xl:sticky xl:top-32">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded bg-blue-600/10 border border-blue-500/20 glass-panel">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-fira text-[11px] text-blue-400 tracking-wider uppercase">SYSTEM ACTIVE: {traceCount.toLocaleString()} TRACES</span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
          >
            THE PREMIER <br/>
            <span className="text-white text-glow-blue uppercase">Crypto Recovery</span><br/>
            <span className="text-blue-500 uppercase">Agency</span>
          </motion.h2>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Military-grade chain analysis and global legal frameworks to track, freeze, and recover misappropriated assets across <span className="text-blue-400 font-fira text-sm">34+ blockchain networks</span>.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6">
            <button 
              onClick={() => onNavigate('clientPortal')}
              className="bg-primary-container text-on-primary-container px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,98,255,0.4)] cursor-pointer"
            >
              Initiate Triage
            </button>
            <div className="flex flex-col">
              <span className="font-fira text-blue-400 text-xl font-bold">$4.2B+</span>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">Total Recovered</span>
            </div>
          </div>

          <div className="mt-12 glass-panel p-6 rounded-sm border-l-4 border-blue-500">
            <h4 className="text-[10px] text-slate-400 mb-6 tracking-widest uppercase font-bold">Recovery Success Rate by Asset</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <ProgressBar label="BTC" value="96.4%" />
              <ProgressBar label="ETH" value="92.1%" />
              <ProgressBar label="SOL" value="88.5%" />
              <ProgressBar label="USDT" value="98.2%" />
            </div>
          </div>

          <div className="glass-panel rounded-sm border border-blue-500/10 overflow-hidden relative group">
            <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-[9px] text-blue-400 tracking-[0.2em] uppercase font-bold">Live Chain Analysis Feed</span>
              <span className="font-fira text-[9px] text-emerald-400/60 uppercase">Realtime Encryption: AES-256</span>
            </div>
            <div className="h-32 overflow-hidden relative scanline-effect bg-black/20">
              <motion.div 
                className="p-4 space-y-2 font-fira text-[10px] text-blue-400/70"
                animate={{ y: [0, -200] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <p>&gt; [SYSTEM] INITIALIZING CROSS-CHAIN TRACE ON TXID: 0x4f...a29</p>
                <p>&gt; [ANALYSIS] HEURISTIC CLUSTER IDENTIFIED: BINANCE_HOT_WALLET_EXPLOITER</p>
                <p>&gt; [GLOBAL] ALERT SENT TO 144 EXCHANGES VIA VASP NETWORK</p>
                <p>&gt; [TRACE] ANALYZING NODE 0x82...F42 (DEPTH: 4)</p>
                <p>&gt; [SUCCESS] SIGNATURE VERIFIED FOR WALLET ADDR: 0x92...3B1</p>
                <p>&gt; [ALERT] SUSPICIOUS MIXER ACTIVITY DETECTED ON TORNADO.CASH</p>
                <p>&gt; [SYSTEM] LATENCY: 14ms | UPTIME: 99.998%</p>
                <p>&gt; [SYSTEM] INITIALIZING CROSS-CHAIN TRACE ON TXID: 0x4f...a29</p>
                <p>&gt; [ANALYSIS] HEURISTIC CLUSTER IDENTIFIED: BINANCE_HOT_WALLET_EXPLOITER</p>
                <p>&gt; [GLOBAL] ALERT SENT TO 144 EXCHANGES VIA VASP NETWORK</p>
                <p>&gt; [TRACE] ANALYZING NODE 0x82...F42 (DEPTH: 4)</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative h-[600px] xl:h-[800px] glass-panel rounded-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img 
              alt="Neural Chain Engine" 
              className="w-full h-full object-cover opacity-60 mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxz_T8aUidvRQbs3A_e-gViEpOyshtgn8rz5RagHcGzm9oZ0KHl_dlJsBS4Z0sByAk5HGYA3JfT-HyQkAIUQecOJ7_1ndRSnslqmeXjUahQo6Orec5X6hjchIFdxpER7lx4HGRJf9qd8nfahsNEyI-obzUfLPscPLspGCvNHUMNPrCQC4lGh5K7p83DbrhDiaF-c9tZk6F1gYsOzOoVyBSYDcg8A1HW2jlvHLLCs-7CYv1P0Chxj0Cooh_QIU7Db1nvPLpGIEIOEs"
              referrerPolicy="no-referrer"
              animate={{ scale: [1.05, 1] }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          
          <div className="absolute top-8 left-8 z-20 space-y-4">
            <div className="glass-panel px-4 py-2 border-l-4 border-blue-500 backdrop-blur-md">
              <p className="font-fira text-[10px] text-blue-400 uppercase">Neural Engine Status</p>
              <p className="font-fira text-sm text-white">OPERATIONAL // CLUSTER_SYNC</p>
            </div>
            <div className="glass-panel px-4 py-2 border-l-4 border-emerald-500 backdrop-blur-md">
              <p className="font-fira text-[10px] text-emerald-400 uppercase">Blockchain Interface</p>
              <p className="font-fira text-sm text-white">34+ ACTIVE NETWORKS</p>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-20 w-64 glass-panel border border-red-500/20 rounded-sm">
            <div className="bg-red-500/10 px-3 py-2 border-b border-red-500/20 flex items-center justify-between">
              <span className="text-[9px] text-red-400 uppercase tracking-widest font-bold">Active Threat Intel</span>
              <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
            </div>
            <div className="p-3 space-y-3">
              <div className="space-y-1">
                <span className="font-fira text-[9px] text-slate-500 uppercase">Malicious Addr</span>
                <p className="font-fira text-[11px] text-slate-300 truncate">0x92...ff21 (Lazarus Group)</p>
              </div>
              <div className="space-y-1">
                <span className="font-fira text-[9px] text-slate-500 uppercase">Current Scam</span>
                <p className="font-fira text-[11px] text-slate-300">Fake Ledger 2.1 Update</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Vuln_Index</span>
                <span className="font-fira text-[11px] text-red-400">CRITICAL</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20 glass-panel p-6 rounded-sm border border-white/10 max-w-xs">
            <p className="text-blue-500 mb-3 text-[10px] tracking-widest uppercase font-black">Neural Chain Engine v4.2</p>
            <div className="space-y-4">
              <ProgressBar label="Clustering Depth" value="94.2%" />
              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
                <span>Target: Obfuscation</span>
                <span>Mode: Heuristic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-stack-lg grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-panel p-6 sm:p-10 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-transparent flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/30">
            <BadgeCheck className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 tracking-tight uppercase">ZERO UPFRONT COSTS</h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
              We operate exclusively on a <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 underline-offset-4">SUCCESS-ONLY FEE STRUCTURE</span>. We do not charge retainers, intake fees, or consultation costs. Our agency only receives a percentage once your lost assets are securely back in your custody.
            </p>
          </div>
        </div>
        <div className="glass-panel p-6 sm:p-10 border-l-4 border-blue-500 flex flex-col justify-center text-center md:text-left">
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mb-4 font-fira">// THE GUARANTEE</p>
          <p className="text-white text-xl font-bold leading-tight">
            If we don't recover your crypto, you don't pay a single cent.
          </p>
          <div className="mt-6 flex items-center gap-3 text-slate-500 font-fira text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>FULLY CONTINGENT MODEL</span>
          </div>
        </div>
      </section>

      <section className="mb-stack-lg grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ISO 27001', code: 'SEC_MGMT_01', icon: BadgeCheck, color: 'text-blue-400', border: 'border-blue-500/50' },
          { label: 'GDPR', code: 'PRIV_COMP_A2', icon: Gavel, color: 'text-indigo-400', border: 'border-indigo-500/50' },
          { label: 'NIST 800-53', code: 'FED_CTRL_STDS', icon: FileCheck, color: 'text-cyan-400', border: 'border-cyan-500/50' },
          { label: 'FINCEN', code: 'MSB_REG_409', icon: Landmark, color: 'text-blue-500', border: 'border-blue-600/50' },
        ].map((cert, idx) => (
          <div key={idx} className={`glass-panel p-6 rounded-sm flex flex-col items-center text-center gap-3 border-b-2 ${cert.border} hover:bg-white/5 transition-colors group cursor-default`}>
            <cert.icon className={`${cert.color} w-8 h-8 group-hover:scale-110 transition-transform`} />
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-widest">{cert.label}</p>
              <p className="text-[10px] text-slate-500 uppercase font-fira">{cert.code}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-stack-lg">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">Forensic Team Verification</h3>
            <p className="text-slate-400 uppercase text-xs tracking-widest mt-2 font-semibold">Certified elite analysts monitoring your recovery 24/7</p>
          </div>
          <div className="flex items-center gap-4 text-emerald-400 font-fira text-[10px]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>12 ANALYSTS ONLINE</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ForensicAgent 
            name="AGENT_ALPHA_01" 
            role="SMART_CONTRACT_SPEC" 
            tags={['EX-INTERPOL', 'ETH_L2']} 
            img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
          />
          <ForensicAgent 
            name="AGENT_SIGMA_09" 
            role="CROSS_CHAIN_ARCHITECT" 
            tags={['ISO_AUDITOR', 'OSINT_PRO']} 
            img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop"
          />
          <ForensicAgent 
            name="AGENT_DELTA_14" 
            role="MIXER_UNWRAPPING_LEAD" 
            tags={['NIST_CERT', 'BTC_CORE']} 
            img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop"
          />
          <ForensicAgent 
            name="AGENT_ZETA_04" 
            role="LEGAL_ASSET_SEIZURE" 
            tags={['JD_LLM', 'KYC_AML']} 
            img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop"
          />
        </div>
      </section>

      <section className="mb-20 sm:mb-stack-lg">
        <div className="glass-panel p-6 sm:p-10 rounded-sm border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-blue-600 to-transparent" />
          <div className="mb-8 sem:mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 w-1 h-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">Initiate Recovery Triage</h3>
            </div>
            <p className="text-sm text-slate-400">Confidential automated scanning of your case parameters. <span className="text-blue-500 font-fira text-xs font-bold md:inline block mt-2 md:mt-0">// SECURE_SOCKET_LOCKED</span></p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Full Name</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none" 
                  placeholder="IDENTIFIER..." 
                  type="text" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Email Address</label>
                <input 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none" 
                  placeholder="UPLINK: EMAIL@DOMAIN.COM" 
                  type="email" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Contact Number</label>
                <input 
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none" 
                  placeholder="+ COUNTRY CODE [NUMBER]" 
                  type="tel" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Entity / ID</label>
                <input 
                  name="entityId"
                  value={formData.entityId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none" 
                  placeholder="ID: 0x..." 
                  type="text" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Asset Network</label>
                <div className="space-y-3">
                  <select 
                    onChange={handleNetworkChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                    <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                    <option value="Solana (SOL)">Solana (SOL)</option>
                    <option value="Polygon (MATIC)">Polygon (MATIC)</option>
                    <option value="Binance Smart Chain (BSC)">Binance Smart Chain (BSC)</option>
                    <option value="Ripple (XRP)">Ripple (XRP)</option>
                    <option value="Cardano (ADA)">Cardano (ADA)</option>
                    <option value="Dogecoin (DOGE)">Dogecoin (DOGE)</option>
                    <option value="Tron (TRX)">Tron (TRX) / USDT-TRC20</option>
                    <option value="Arbitrum">Arbitrum (ARB)</option>
                    <option value="Optimism">Optimism (OP)</option>
                    <option value="Avalanche (AVAX)">Avalanche (AVAX)</option>
                    <option value="OTHER">Other / Custom Network...</option>
                  </select>

                  {isOtherNetwork && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="relative overflow-hidden"
                    >
                      <input 
                        type="text"
                        list="crypto-suggestions"
                        placeholder="SPECIFY_NETWORK_NAME..."
                        value={customNetwork}
                        onChange={(e) => setCustomNetwork(e.target.value.toUpperCase())}
                        className="w-full bg-blue-500/5 border border-blue-500/30 rounded-sm px-4 py-4 text-white placeholder:text-blue-500/30 focus:border-blue-500 transition-all font-fira text-sm outline-none"
                      />
                      <datalist id="crypto-suggestions">
                        {CRYPTO_CURRENCIES.map((crypto, idx) => (
                          <option key={idx} value={crypto} />
                        ))}
                      </datalist>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        <div className="w-1 h-1 bg-blue-500 animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-500 animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-blue-500 animate-pulse delay-150"></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Service Selection</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-sm px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-fira text-sm outline-none appearance-none cursor-pointer"
                >
                  <option>Wallet Recovery</option>
                  <option>Scam & Fraud Assistance</option>
                  <option>Forensic Tracking</option>
                  <option>Exchange Recovery</option>
                  <option>Expert Consultation</option>
                  <option>Custom Protocol</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Wallet Balance (USD Estimate)</label>
                <div className="px-2 pt-4">
                  <input 
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    max="1000000" 
                    min="1000" 
                    step="1000" 
                    type="range"
                    value={balance}
                    onChange={(e) => setBalance(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between mt-3 font-fira text-[10px] text-slate-500 items-center">
                    <span>$1K</span>
                    <div className="flex items-center gap-0.5 text-blue-400 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-500/20">
                      <span>$</span>
                      <input 
                        type="number"
                        min="1000"
                        value={balance}
                        onChange={(e) => setBalance(parseInt(e.target.value) || 0)}
                        className="bg-transparent border-none outline-none focus:ring-0 p-0 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text font-bold"
                      />
                      {balance >= 1000000 && <span>+</span>}
                    </div>
                    <span>$1M+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="w-full md:w-auto bg-blue-600/10 border border-blue-600 text-blue-400 px-16 py-5 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-lg cursor-pointer"
              >
                Submit Forensic Request
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
        {[
          {
            title: "Advanced Chain Analysis",
            description: "Heuristic modeling to trace funds through mixing pools and complex multi-hop obfuscation layers. Utilizing Proprietary_Engine_v4.",
            icon: Network,
            stats: { 'TRACE DEPTH': 'LEVEL 12 (DEEP)', 'SUCCESS RATE': '88.4% RECOVERY' }
          },
          {
            title: "Global Enforcement",
            description: "Direct integration with international task forces to execute freezing orders in 120+ jurisdictions. Verified by INTERPOL_PROTO_X.",
            icon: ShieldAlert,
            stats: { 'RESPONSE TIME': '< 2.4 HOURS', 'JURISDICTIONS': 'GLOBAL (INTERPOL)' }
          }
        ].map((service, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigate('clientPortal')}
            className="glass-panel p-card-padding rounded-sm group hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden cursor-pointer"
          >
            <div className="w-14 h-14 mb-8 rounded-sm bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <service.icon className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">{service.title}</h4>
            <p className="text-slate-400 mb-10 leading-relaxed">
              {service.description.split('Proprietary_Engine_v4').join('')}
              {service.description.includes('Proprietary_Engine_v4') && <span className="text-blue-500 font-fira text-xs font-bold">Proprietary_Engine_v4</span>}
              {service.description.includes('INTERPOL_PROTO_X') && <span className="text-blue-500 font-fira text-xs font-bold">INTERPOL_PROTO_X</span>}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              {Object.entries(service.stats).map(([k, v], i) => (
                <div key={i}>
                  <span className="block text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">{k}</span>
                  <span className="font-fira text-blue-400 text-sm font-bold uppercase">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-stack-lg">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-white">Global Reclamation Network</h3>
            <p className="text-slate-500 font-fira text-xs mt-2 uppercase tracking-widest font-semibold">Real-time asset seizure and return logistics // GLOBAL_NODE_SYNC</p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-fira text-slate-300">NORTH AMERICA</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-[10px] font-fira text-slate-300">EU / ASIA</span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel h-[350px] sm:h-[500px] rounded-sm border border-white/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxz_T8aUidvRQbs3A_e-gViEpOyshtgn8rz5RagHcGzm9oZ0KHl_dlJsBS4Z0sByAk5HGYA3JfT-HyQkAIUQecOJ7_1ndRSnslqmeXjUahQo6Orec5X6hjchIFdxpER7lx4HGRJf9qd8nfahsNEyI-obzUfLPscPLspGCvNHUMNPrCQC4lGh5K7p83DbrhDiaF-c9tZk6F1gYsOzOoVyBSYDcg8A1HW2jlvHLLCs-7CYv1P0Chxj0Cooh_QIU7Db1nvPLpGIEIOEs')] bg-cover bg-center opacity-40 grayscale contrast-125 group-hover:scale-105 transition-transform duration-[20s]" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-color" />
          
          <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-blue-500/60 animate-ping" />
          <div className="absolute top-1/2 left-2/3 w-3 h-3 rounded-full bg-blue-500/60 animate-ping delay-700" />
          <div className="absolute bottom-1/3 left-1/4 w-5 h-5 rounded-full bg-cyan-500/60 animate-ping delay-1000" />

          <div className="absolute bottom-6 left-6 glass-panel p-6 rounded-sm border border-white/10 backdrop-blur-xl">
            <div className="flex gap-10">
              <div>
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">Total Reclamations</p>
                <p className="font-fira text-2xl text-white">41,902 <span className="text-blue-500 text-xs font-bold">↑ 12%</span></p>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div>
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">Avg. Recovery Time</p>
                <p className="font-fira text-2xl text-white">18.4 <span className="text-slate-500 text-xs font-bold">DAYS</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection onSeeMore={() => onNavigate('reviews')} />

      <section className="mb-stack-lg">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-bold text-white">Case Resolution Dossiers</h3>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-sm glass-panel flex items-center justify-center hover:bg-white/10 transition-all border-white/10">
              <ChevronLeft className="text-slate-300 w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-sm glass-panel flex items-center justify-center hover:bg-white/10 transition-all border-white/10">
              <ChevronRight className="text-slate-300 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'H. Vanderbilt', 
              caseId: '992-ALPHA', 
              quote: 'The forensic team identified the bridge hop within minutes. Their technical depth is unparalleled in the industry.',
              value: '14.5 BTC',
              color: 'border-t-blue-500',
              text: 'text-blue-400',
              img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop'
            },
            { 
              name: 'S. Chen', 
              caseId: '104-SIGMA', 
              quote: 'Complex DeFi exploit recovery seemed impossible. Exceptional depth of knowledge regarding smart contract forensics.',
              value: '420 ETH',
              color: 'border-t-cyan-500',
              text: 'text-cyan-400',
              img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop'
            },
            { 
              name: 'Marcus K.', 
              caseId: '812-DELTA', 
              quote: 'Absolute digital sovereignty. Their portal provided real-time tracking across three continents. Truly elite services.',
              value: '2.1M USDC',
              color: 'border-t-indigo-500',
              text: 'text-indigo-400',
              img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop'
            }
          ].map((dossier, i) => (
            <div key={i} className={`glass-panel p-6 rounded-sm border-t-4 ${dossier.color} group relative`}>
              <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="font-fira text-[40px] text-white">0{i + 1}</span>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <img src={dossier.img} alt={dossier.name} referrerPolicy="no-referrer" className={`w-14 h-14 rounded-sm object-cover border-2 ${dossier.color.replace('border-t-', 'border-')}/20`} />
                <div>
                  <p className="text-white font-bold text-sm tracking-tight">{dossier.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-fira">CASE #{dossier.caseId}</p>
                </div>
              </div>
              <p className="text-slate-300 italic mb-8 leading-relaxed font-medium">"{dossier.quote}"</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Reclaimed_Val</span>
                <span className={`font-fira ${dossier.text} text-lg font-bold`}>{dossier.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
