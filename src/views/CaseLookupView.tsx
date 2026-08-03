
import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { lookupCaseByEmail } from '../lib/caseLookupApi';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { SeoEnrichment } from '../components/SeoEnrichment';

interface CaseLookupViewProps {
  onCaseFound: (caseData: any) => void;
}

export const CaseLookupView = ({ onCaseFound }: CaseLookupViewProps) => {
  const [email, setEmail] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const apiResult = await lookupCaseByEmail(normalizedEmail);
      if (apiResult.ok && apiResult.case) {
        onCaseFound(apiResult.case);
        return;
      }
      if (apiResult.notFound) {
        setError('No active recovery case found for this email address.');
        return;
      }

      const q = query(
        collection(db, 'recovery_requests'),
        where('secureComms', '==', normalizedEmail),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const caseDoc = querySnapshot.docs[0];
        onCaseFound({
          id: caseDoc.id,
          firestoreDocId: caseDoc.id,
          storageSource: 'firestore',
          ...caseDoc.data(),
        });
      } else if (apiResult.error?.toLowerCase().includes('unavailable')) {
        setError(
          'Case lookup service is unavailable. Please try again shortly or contact support.'
        );
      } else {
        setError(
          apiResult.error ||
            'No active recovery case found for this email address.'
        );
      }
    } catch (err) {
      console.error('Lookup error details:', err instanceof Error ? err.message : err);
      if (err instanceof Error && err.message.includes('permission')) {
        setError(
          'No case found for this email. Use the same address you submitted with, or contact support if you just filed a case.'
        );
      } else {
        setError('A system error occurred. Please try again later.');
      }
      handleFirestoreError(err, OperationType.LIST, 'recovery_requests');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="pt-32 sm:pt-48 pb-32 px-4 sm:px-6 lg:px-12 max-w-[800px] mx-auto min-h-screen relative z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/5 blur-[80px] sm:blur-[120px] pointer-events-none rounded-full"></div>
      
      <div className="text-center mb-12 sm:mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-fira font-bold text-blue-500 uppercase tracking-widest">Secure Case Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-manrope font-black text-white uppercase tracking-tight mb-4 sm:mb-6">
          Check Your <span className="text-blue-500">Case Status</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          Enter the secure communication email used during your initial submission to access your private recovery dashboard and live forensic stream.
        </p>
      </div>

      <div className="glass-panel p-1 border-white/5 rounded-3xl group shadow-2xl">
        <div className="bg-[#05070a] rounded-[22px] p-6 sm:p-12 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <form onSubmit={handleLookup} className="space-y-6 sm:space-y-8 relative z-10">
            <div className="space-y-4">
              <label className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500/50"></span> EMAIL_ADDRESS
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="UPLINK: EMAIL@DOMAIN.COM"
                    className="w-full bg-slate-950/80 border border-white/10 text-white pl-12 sm:pl-14 pr-6 py-4 sm:py-5 rounded-2xl font-mono text-sm sm:text-base focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-manrope"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isSearching}
              className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-full bg-blue-600 text-white font-mono font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm sm:text-base">
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    DECRYPTING...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    VERIFY_IDENTITY
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-mono text-[9px] uppercase tracking-widest text-center">
              SYSTEM_SECURED_BY_AES256_GCM // NO_DATA_PERSISTENCE_ON_CLIENT
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 h-3 bg-blue-500/20 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
      <SeoEnrichment page="case-lookup" />
    </main>
  );
};
