import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  Rocket, 
  Fingerprint, 
  HelpCircle,
  BarChart3,
  Microscope,
  Cpu,
  Mail,
  User as UserIcon,
  Zap,
  Triangle,
  Square,
  Circle,
  Pentagon,
  Hexagon,
  Diamond,
  Octagon,
  Star,
  RefreshCw
} from 'lucide-react';
import { db } from '../lib/firebase';
import { apiPost } from '../lib/api';
import { isEmailJsConfigured, sendIntakeEmailViaEmailJs } from '../lib/emailjs';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CRYPTO_CURRENCIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ReviewsSection } from '../components/ReviewsSection';

const SHAPE_POOL = [
  Triangle,
  Square,
  Circle,
  Pentagon,
  Hexagon,
  Diamond,
  Octagon,
  Star
];

interface ClientPortalViewProps {
  onInitiateRecovery: () => void;
  onNavigate?: (view: any) => void;
}

export const ClientPortalView = ({ onInitiateRecovery, onNavigate }: ClientPortalViewProps) => {
  const [assetValue, setAssetValue] = React.useState<number | string>(42500);
  const [assetCurrency, setAssetCurrency] = React.useState('USD');
  const [buffer, setBuffer] = React.useState(72);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBuffer(prev => {
        const next = prev + (Math.random() > 0.5 ? 0.5 : -0.5);
        return parseFloat(Math.min(95, Math.max(60, next)).toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    operatorAlias: '',
    phone: '',
    secureComms: '',
    incidentVector: 'WALLET_RECOVERY',
    targetNetwork: 'BTC',
    customNetwork: '',
    caseNarrative: ''
  });
  const [isCustomNetwork, setIsCustomNetwork] = React.useState(false);

  // Human Verification State
  const [gridShapes, setGridShapes] = React.useState<{id: number, Icon: any, isTarget: boolean}[]>([]);
  const [targetIconIndex, setTargetIconIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isVerified, setIsVerified] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const generateChallenge = React.useCallback(() => {
    const targetIdx = Math.floor(Math.random() * SHAPE_POOL.length);
    const targetIcon = SHAPE_POOL[targetIdx];
    
    // Get other icons
    const otherIcons = SHAPE_POOL.filter((_, i) => i !== targetIdx);
    const shuffledOthers = [...otherIcons].sort(() => Math.random() - 0.5);
    
    // Create grid: 3 targets + 5 unique others = 8 total
    const grid = [
      { id: 1, Icon: targetIcon, isTarget: true },
      { id: 2, Icon: targetIcon, isTarget: true },
      { id: 3, Icon: targetIcon, isTarget: true },
      ...shuffledOthers.slice(0, 5).map((Icon, i) => ({ id: i + 4, Icon, isTarget: false }))
    ].sort(() => Math.random() - 0.5);

    setGridShapes(grid);
    setTargetIconIndex(targetIdx);
    setSelectedIds([]);
    setIsVerified(false);
  }, []);

  // Initial and Periodic Refresh
  React.useEffect(() => {
    generateChallenge();
    const interval = setInterval(generateChallenge, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [generateChallenge, refreshKey]);

  // Visibility Refresh
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        generateChallenge();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [generateChallenge]);

  const handleShapeClick = (id: number) => {
    if (isVerified) return;

    setSelectedIds(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id];
      
      // Check if correct 3 are selected
      if (newSelection.length === 3) {
        const correctIds = gridShapes.filter(s => s.isTarget).map(s => s.id);
        const isCorrect = newSelection.every(id => correctIds.includes(id));
        if (isCorrect) {
          setIsVerified(true);
        } else {
          // Pulse red and reset after delay if wrong
          setTimeout(() => setSelectedIds([]), 500);
        }
      } else if (newSelection.length > 3) {
        return [id];
      }
      
      return newSelection;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please complete the human verification process.");
      return;
    }
    setIsSubmitting(true);

    const normalizedEmail = formData.secureComms.trim().toLowerCase();
    const submissionData = {
      ...formData,
      secureComms: normalizedEmail,
      targetNetwork: isCustomNetwork ? formData.customNetwork : formData.targetNetwork,
      transactionHash: 'NOT_PROVIDED',
      estimatedValue: typeof assetValue === 'number' ? assetValue : 0,
      estimatedCurrency: assetCurrency,
      createdAt: serverTimestamp(),
      status: 'PENDING',
      formSource: 'INTAKE_INITIALIZATION',
    };

    try {
      const { 
        createdAt,
        ...apiData 
      } = submissionData;

      // 1. Save to Firestore (best effort — do not block confirmation page)
      try {
        await addDoc(collection(db, 'recovery_requests'), submissionData);
      } catch (fsError) {
        console.error('Firestore save failed:', fsError);
      }

      // 2. Email notification (best effort)
      const payload = { ...apiData, timestamp: new Date().toISOString() };

      // Prefer EmailJS on static hosting (works without a server)
      if (isEmailJsConfigured()) {
        try {
          await sendIntakeEmailViaEmailJs(payload);
        } catch (err) {
          console.warn("EmailJS send failed:", err);
        }
      }

      // Keep API attempt as backup when a server exists
      try {
        const { data, error } = await apiPost<{ emailSent?: boolean }>(
          '/api/submit-recovery',
          payload
        );
        if (error) {
          console.warn('Email API:', error);
        } else if (data && !data.emailSent) {
          console.warn('Form submitted; admin email was not sent (Resend/API not configured).');
        }
      } catch (err) {
        console.warn("Email API request failed:", err);
      }

      onInitiateRecovery();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again or contact us directly at info@cryptorecoveryasset.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setAssetValue('');
      return;
    }
    // Keep numeric characters only and normalize
    const cleaned = val.replace(/[^\d]/g, '');
    const sanitized = cleaned.replace(/^0+/, '');
    const num = parseInt(sanitized || '0');
    if (!isNaN(num)) {
      setAssetValue(Math.min(100000000, num)); // Cap at 100M for stability
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen relative z-10">
      {/* Technical Stepper */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-row items-center justify-between gap-1 xs:gap-2 max-w-4xl mx-auto">
          {/* Stage 01 */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 group relative z-10">
            <div className="w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full glass-panel flex items-center justify-center border-blue-500 border-2 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-4 ring-blue-500/20 bg-blue-500/10">
              <BarChart3 className="text-blue-400 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-center">
              <p className="font-mono text-[7px] xs:text-[8px] md:text-[10px] text-blue-500 font-bold uppercase tracking-widest">ST_01</p>
              <p className="font-manrope text-[6px] xs:text-[7px] md:text-[9px] text-white/60 uppercase tracking-widest hidden xs:block">IDENTIFICATION</p>
            </div>
          </div>
          
          {/* Connector 1 */}
          <div className="flex-grow h-[1px] bg-white/10 self-center mt-[-14px] xs:mt-[-16px] md:mt-[-20px] relative">
            <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/2 shadow-[0_0_10px_#3b82f6]"></div>
          </div>
 
          {/* Stage 02 */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 group opacity-40 z-10">
            <div className="w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full glass-panel flex items-center justify-center border-white/10 border bg-white/5">
              <Microscope className="text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-center">
              <p className="font-mono text-[7px] xs:text-[8px] md:text-[10px] uppercase tracking-widest">ST_02</p>
              <p className="font-manrope text-[6px] xs:text-[7px] md:text-[9px] uppercase tracking-widest hidden xs:block">ANALYSIS</p>
            </div>
          </div>
   
          {/* Connector 2 */}
          <div className="flex-grow h-[1px] bg-white/10 self-center mt-[-14px] xs:mt-[-16px] md:mt-[-20px]"></div>
 
          {/* Stage 03 */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 group opacity-40 z-10">
            <div className="w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full glass-panel flex items-center justify-center border-white/10 border bg-white/5">
              <Cpu className="text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-center">
              <p className="font-mono text-[7px] xs:text-[8px] md:text-[10px] uppercase tracking-widest">ST_03</p>
              <p className="font-manrope text-[6px] xs:text-[7px] md:text-[9px] uppercase tracking-widest hidden xs:block">DEPLOYMENT</p>
            </div>
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Content */}
        <div className="lg:col-span-8">
          <div className="mb-8 border-l-4 border-blue-600 pl-4 md:pl-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-manrope font-extrabold tracking-tight mb-1 uppercase">
              <span className="text-blue-500 opacity-50 font-mono">[</span>
              INTAKE_INITIALIZATION
              <span className="text-blue-500 opacity-50 font-mono">]</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-0.5 bg-red-400/10 border border-red-400/30 text-red-400 font-mono text-[9px] md:text-[10px] tracking-widest rounded flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                CLEARANCE_LVL_02
              </span>
              <span className="text-slate-500 text-[9px] md:text-[10px] font-mono uppercase tracking-tighter">SECURE_CHANNEL: ACTIVE</span>
            </div>
          </div>
 
          <div className="glass-panel rounded-2xl p-5 md:p-8 relative overflow-hidden group border border-white/5">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }}></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent animate-scan"></div>
            
            <form id="recoveryForm" onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Operator Alias */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-blue-500/50"></span> FULL_NAME
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      required
                      name="operatorAlias"
                      value={formData.operatorAlias}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl font-mono text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/10"
                      placeholder="e.g. STEVE ROGERS"
                    />
                  </div>
                </div>
 
                {/* Secure Comms */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-3 bg-blue-500/50"></span> EMAIL_ADDRESS
                    </label>
                    <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/30 px-2 py-0.5 rounded flex items-center gap-1 tracking-widest uppercase">
                      <Lock size={10} /> ENCRYPTED
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      required
                      name="secureComms"
                      value={formData.secureComms}
                      onChange={handleInputChange}
                      type="email"
                      className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl font-mono text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/10"
                      placeholder="UPLINK: EMAIL@DOMAIN.COM"
                    />
                  </div>
                </div>
              </div>

              {/* Phone and Service Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-blue-500/50"></span> CONTACT_NUMBER
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-mono">+</div>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel"
                      className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl font-mono text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/10"
                      placeholder="COUNTRY_CODE + NUMBER"
                    />
                  </div>
                </div>
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-blue-500/50"></span> SERVICE_SELECTION
                  </label>
                  <div className="relative">
                    <select 
                      name="incidentVector"
                      value={formData.incidentVector}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0e16]/60 border border-white/10 text-white px-4 py-4 rounded-xl font-mono text-sm appearance-none focus:border-blue-500/50 outline-none transition-all cursor-pointer"
                    >
                      <option disabled value="VECTOR_SELECT_...">SELECT_SERVICE_...</option>
                      <option value="WALLET_RECOVERY">WALLET_RECOVERY</option>
                      <option value="SCAM_FRAUD_ASSISTANCE">SCAM_FRAUD_ASSISTANCE</option>
                      <option value="FORENSIC_TRACKING">FORENSIC_TRACKING</option>
                      <option value="EXCHANGE_RECOVERY">EXCHANGE_RECOVERY</option>
                      <option value="EXPERT_CONSULTATION">EXPERT_CONSULTATION</option>
                      <option value="CUSTOM_PROTOCOL">CUSTOM_PROTOCOL</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>
 
                {/* Target Network */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-blue-500/50"></span> TARGET_NETWORK
                  </label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['BTC', 'ETH', 'SOL', 'BSC', 'ARB', 'USDT', 'XRP', 'ADA', 'TRX', 'MATIC'].map((net) => (
                        <button 
                          key={net}
                          type="button"
                          onClick={() => {
                            setIsCustomNetwork(false);
                            setFormData(prev => ({ ...prev, targetNetwork: net }));
                          }}
                          className={`px-3 py-2 rounded-lg border-2 font-mono text-xs font-bold transition-all ${
                            formData.targetNetwork === net && !isCustomNetwork
                              ? 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                              : 'border-white/10 bg-white/5 text-slate-500 hover:border-blue-500/50 hover:text-white'
                          }`}
                        >
                          {net}
                        </button>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setIsCustomNetwork(true)}
                        className={`px-3 py-2 rounded-lg border-2 font-mono text-xs font-bold transition-all ${
                          isCustomNetwork
                            ? 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                            : 'border-white/10 bg-white/5 text-slate-500 hover:border-blue-500/50 hover:text-white'
                        }`}
                      >
                        OTHER+
                      </button>
                    </div>
                    
                    {isCustomNetwork && (
                      <div className="relative">
                        <input 
                          required
                          name="customNetwork"
                          list="portal-crypto-suggestions"
                          value={formData.customNetwork}
                          onChange={handleInputChange}
                          type="text"
                          className="w-full bg-[#0a0e16]/60 border border-blue-500/30 text-white px-4 py-4 rounded-xl font-mono text-sm focus:border-blue-500 outline-none transition-all placeholder:text-blue-500/20"
                          placeholder="SPECIFY_CUSTOM_NETWORK (e.g. DOGE, DOT, LINK...)"
                        />
                        <datalist id="portal-crypto-suggestions">
                          {CRYPTO_CURRENCIES.map((crypto, idx) => (
                            <option key={idx} value={crypto} />
                          ))}
                        </datalist>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                          <span className="text-[8px] font-mono text-blue-400/50 uppercase tracking-widest">AWAITING_INPUT</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
 
              {/* Asset Value Estimate */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="w-1 h-3 bg-blue-500/50"></span> ASSET_VALUE_ESTIMATE
                    </label>
                    <div className="flex items-center gap-1 text-2xl md:text-3xl text-white font-mono font-bold tracking-tighter">
                      <span>$</span>
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={assetValue}
                        onChange={handleAssetInputChange}
                        className="bg-transparent border-none outline-none focus:ring-0 p-0 w-32 md:w-64 font-mono text-white placeholder:text-white/5"
                        placeholder="0.00"
                      />
                      <span className="text-[10px] text-blue-400/50 ml-1 font-normal uppercase tracking-widest">USD_EQUIVALENT</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">NODE_CONFIDENCE</span>
                    <span className="text-sm font-bold text-blue-400 font-mono">99.4%</span>
                  </div>
                </div>
                <div className="relative py-4 group/slider">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 pointer-events-none">
                    {[0, 25, 50, 75, 100].map(mark => (
                      <div key={mark} className="w-px h-1.5 bg-white/20"></div>
                    ))}
                  </div>
                  
                  <input 
                    type="range"
                    min="0"
                    max="1000000"
                    step="500"
                    value={typeof assetValue === 'number' ? assetValue : 0}
                    onChange={(e) => setAssetValue(parseInt(e.target.value))}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-8 bg-transparent appearance-none cursor-pointer z-10 accent-blue-500 hover:accent-blue-400"
                  />
                  
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 pointer-events-none rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300" 
                    style={{ width: `${Math.min(100, (Number(assetValue || 0) / 1000000) * 100)}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#3b82f6] border-2 border-blue-600 scale-110 group-hover/slider:scale-125 transition-transform"></div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">MIN_LIMIT: $0</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest">REALTIME_VALUATION_SCALING</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">MAX_SCALE: $1M</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[220px_auto_auto] gap-3 items-center">
                  <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                    OR TYPE AMOUNT (USD)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={1000000}
                    step={100}
                    value={typeof assetValue === 'number' ? assetValue : 0}
                    onChange={(e) => {
                      const next = parseInt(e.target.value || '0', 10);
                      setAssetValue(Number.isNaN(next) ? 0 : Math.min(1000000, Math.max(0, next)));
                    }}
                    className="w-full bg-[#0a0e16]/60 border border-white/10 text-white px-4 py-3 rounded-xl font-mono text-sm focus:border-blue-500/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="ENTER_AMOUNT"
                  />
                  <select
                    value={assetCurrency}
                    onChange={(e) => setAssetCurrency(e.target.value)}
                    className="w-full sm:w-[120px] bg-[#0a0e16]/60 border border-white/10 text-white px-3 py-3 rounded-xl font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
 
              {/* Narrative Log */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-3 bg-blue-500/50"></span> CASE_NARRATIVE_LOG
                </label>
                <textarea 
                  required
                  name="caseNarrative"
                  value={formData.caseNarrative}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0e16]/60 border border-white/10 text-white px-4 py-4 rounded-xl font-manrope text-sm focus:border-blue-500/50 outline-none transition-all resize-none min-h-[120px] placeholder:text-white/10"
                  placeholder="DECRYPTED SEQUENCE: Input event timeline, peer-to-peer interactions, and suspicious metadata..."
                ></textarea>
              </div>
            </form>
          </div>
        </div>
 
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 relative group overflow-hidden">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="text-blue-400 w-4 h-4" />
                  <h3 className="font-mono text-xs text-white font-bold tracking-[0.2em] uppercase">HUMAN_AUTH</h3>
                </div>
                <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase">NEURAL_GRID_VERIFICATION_REQUIRED</p>
              </div>
              <HelpCircle className="w-5 h-5 text-slate-500" />
            </div>
 
            <div className="aspect-square bg-[#05070a] border border-blue-500/30 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
              
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <div className="mb-4">
                  <p className="font-mono text-[9px] text-blue-400 uppercase tracking-widest mb-1">SELECT_ALL_INSTANCES_OF:</p>
                  <div className="flex items-center justify-center gap-2 text-white font-bold">
                    {(() => {
                      const TargetIcon = SHAPE_POOL[targetIconIndex];
                      return <TargetIcon className="w-5 h-5 text-blue-400" />;
                    })()}
                    <span className="font-mono text-xs uppercase tracking-tighter">{SHAPE_POOL[targetIconIndex]?.name || 'SHAPE'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full">
                  {gridShapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => handleShapeClick(shape.id)}
                      className={`aspect-square flex items-center justify-center border-2 rounded-lg transition-all duration-300 relative group/icon ${
                        selectedIds.includes(shape.id)
                          ? isVerified 
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'border-blue-500 bg-blue-500/20 shadow-[0_0_10px_#3b82f644]'
                          : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <shape.Icon className={`w-5 h-5 transition-transform group-hover/icon:scale-110 ${
                        selectedIds.includes(shape.id)
                          ? isVerified ? 'text-emerald-400' : 'text-blue-400'
                          : 'text-slate-600'
                      }`} />
                      {selectedIds.includes(shape.id) && !isVerified && (
                        <motion.div 
                          layoutId="pulse"
                          className="absolute inset-0 border-2 border-blue-500/50 rounded-lg animate-ping pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between w-full">
                   <button 
                    type="button"
                    onClick={() => {
                      setRefreshKey(prev => prev + 1);
                      generateChallenge();
                    }}
                    className="flex items-center gap-1.5 text-[9px] font-mono text-blue-500/60 uppercase hover:text-blue-400 transition-colors"
                   >
                     <RefreshCw className="w-3 h-3" /> REGENERATE
                   </button>

                   <AnimatePresence>
                     {isVerified ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30"
                        >
                           <Zap className="w-3 h-3 text-emerald-400 shadow-[0_0_8px_#10b981]" />
                           <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest">VERIFIED</span>
                        </motion.div>
                     ) : (
                        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                          STATUS: AWAITING_{3 - selectedIds.length}_SAMPLES
                        </div>
                     )}
                   </AnimatePresence>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between px-2 pointer-events-none opacity-30">
                <span className="font-mono text-[8px] text-slate-600 tracking-tighter">SEC_TOKEN: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                <span className="font-mono text-[8px] text-slate-600 tracking-tighter">AES-256_ACTIVE</span>
              </div>
            </div>
          </div>
 
          <div className="space-y-4">
            <button 
              form="recoveryForm"
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 bg-blue-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-full bg-blue-600 text-white font-mono font-black uppercase tracking-[0.3em] py-5 rounded-xl flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-[1px] cursor-pointer">
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    TRANSMITTING...
                  </div>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    INITIATE_RECOVERY
                  </>
                )}
              </div>
            </button>
            <div className="px-4 text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.15em] leading-relaxed">
                TRANSACTION SEALED UNDER FORENSIC_PROTOCOL_7-B.<br/>
                NON-REPUTATION LOGS ACTIVE.
              </p>
            </div>
          </div>

          {/* Case Reference Card */}
          <div className="p-6 glass-panel border-l-2 border-blue-500 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint size={40} />
            </div>
            <p className="font-mono text-[10px] text-blue-500/60 mb-1 tracking-widest uppercase">SYSLOG_ID_ENTRY</p>
            <p className="font-mono text-lg text-white font-bold tracking-tight">#DF-8829-QX-04</p>
            <div className="mt-4 flex gap-4">
              <div className="flex-grow">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_8px_#3b82f6]" 
                    style={{ width: `${buffer}%` }}
                  ></div>
                </div>
                <p className="text-[8px] font-mono text-slate-500 mt-1 uppercase">BUFFER_CAPACITY</p>
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold animate-pulse">LIVE</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section Integration for Trust */}
      <div className="mt-20 border-t border-white/5 pt-20">
        <ReviewsSection onSeeMore={() => onNavigate && onNavigate('reviews')} />
      </div>
    </main>
  );
};
