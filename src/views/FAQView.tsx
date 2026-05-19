import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  Wallet, 
  Lock, 
  ShieldAlert, 
  Search 
} from 'lucide-react';
import { SEO } from '../components/SEO';

const FAQ_DATA = [
  {
    category: 'WALLET_RECOVERY',
    icon: Wallet,
    questions: [
      {
        q: "How to recover lost crypto from a deleted wallet?",
        a: "If the wallet was deleted, recovery depends on whether you have the seed phrase (12-24 words) or if raw data remains on the device's storage. Our specialists use deep-sector scanning to find deleted wallet files or help you reconstruct seed phrases from partial backups.",
        keywords: "recover deleted crypto wallet"
      },
      {
        q: "How to recover 12 word seed phrase if I lost some words?",
        a: "We utilize high-performance computing clusters to 'brute force' missing words in a seed phrase. If you have 11 out of 12 words, or if you know the words but not the order, recovery is 99.9% mathematically certain within minutes.",
        keywords: "how to recover 12 word seed phrase"
      },
      {
        q: "Is it possible to recover Ledger Nano without seed phrase?",
        a: "Recovery without the seed phrase requires physical access to the device and specialized hardware forensic tools. While extremely difficult due to the Secure Element chip, we have proprietary methods for data extraction in specific failure scenarios.",
        keywords: "recover ledger nano without seed phrase"
      },
      {
        q: "How to recover MetaMask wallet after computer reset?",
        a: "If you didn't back up your seed phrase, we can often extract the encrypted 'vault' file from the hard drive's disk image if the sectors haven't been overwritten. This file can then be decrypted with your original password.",
        keywords: "recover metamask wallet"
      }
    ]
  },
  {
    category: 'EXCHANGE_&_SCAMS',
    icon: ShieldAlert,
    questions: [
      {
        q: "Can the FBI recover stolen crypto?",
        a: "The FBI (via IC3) compiles evidence and can execute seizures if the case reaches a federal threshold. We act as the bridge by providing the FBI with professional forensic reports that prove the flow of funds, which significantly increases the chance of agency action.",
        keywords: "can the fbi recover stolen crypto"
      },
      {
        q: "What should I do if I was scammed into sending crypto?",
        a: "Time is the most critical factor. Every minute counts before the scammer moves funds to a mixer or an off-ramp. We can help you 'trace a bitcoin transaction to an exchange' and issue immediate legal notices to freeze those funds before they are cashed out.",
        keywords: "scammed crypto recovery"
      },
      {
        q: "How to recover coinbase wallet assets sent to the wrong address?",
        a: "If assets were sent to a wrong address on the same chain (and it's an exchange-owned address), we can mediate with the compliance team. If sent to a different chain, specialized 'cross-chain rescue' protocols are required.",
        keywords: "recover coinbase wallet"
      }
    ]
  },
  {
    category: 'SECURITY_&_EXPERTISE',
    icon: Lock,
    questions: [
      {
        q: "How to hire a crypto recovery specialist safely?",
        a: "Always look for verifiable credentials, a transparent fee structure (no upfront fees), and a professional company registered in a clear jurisdiction. Never share your private keys or seed phrases with anyone claiming to be an 'expert'.",
        keywords: "hire crypto recovery specialist"
      },
      {
        q: "What are the common recovery scam signs?",
        a: "Red flags include: demanding 'activation fees' or 'tax fees' upfront, claiming to 'hack the blockchain', or guaranteeing results in 1-2 hours. Legitimate firms only charge a percentage AFTER the recovery is successful.",
        keywords: "recovery scam signs"
      }
    ]
  }
];

export const FAQView = () => {
  const [openIndex, setOpenIndex] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main className="pt-32 pb-32 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen">
      <SEO 
        title="FAQ & Recovery Guides | Crypto Specialist Support" 
        description="Frequently asked questions about crypto recovery. Learn how to recover 12 word seed phrases, recover deleted wallets, and handle scammed assets safely."
        keywords="crypto recovery faq, how to recover lost crypto, recover metamask wallet help, trust wallet recovery guide, ledger nano recovery help"
      />

      <div className="mb-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase italic mb-6 font-manrope leading-none">
          Recovery <span className="text-blue-500">Knowledge Base</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Technical answers and operational guides for users facing asset loss. If your question remains unanswered, contact our specialist triage team directly.
        </p>

        <div className="mt-12 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="SEARCH_FAQS_BY_KEYWORDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-mono text-xs uppercase tracking-widest focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-16">
        {FAQ_DATA.map((category, catIdx) => (
          <div key={catIdx}>
            <div className="flex items-center gap-4 mb-8 border-l-4 border-blue-500 pl-6">
              <category.icon className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] font-mono">
                {category.category.replace(/_/g, ' ')}
              </h2>
            </div>

            <div className="grid gap-4">
              {category.questions
                .filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;

                  return (
                    <div 
                      key={id}
                      className={`glass-panel border-white/5 overflow-hidden transition-all duration-300 hover:border-blue-500/20 ${isOpen ? 'bg-blue-600/5 border-blue-500/30' : ''}`}
                    >
                      <button 
                        onClick={() => toggle(id)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left group"
                      >
                        <span className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                          {item.q}
                        </span>
                        <div className={`shrink-0 ml-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 border-blue-600 rotate-180' : ''}`}>
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-8 pb-8 text-slate-400 leading-relaxed text-base">
                              <p className="mb-4">{item.a}</p>
                              {item.keywords && (
                                <div className="pt-4 border-t border-white/5 flex gap-2 overflow-hidden">
                                  <span className="text-[10px] font-mono text-blue-500/50 uppercase tracking-widest shrink-0">Tags:</span>
                                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{item.keywords.replace(/,\s+/g, ' #')}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 glass-panel p-12 text-center border-emerald-500/20 bg-emerald-500/5">
        <HelpCircle className="mx-auto text-emerald-500 mb-6" size={48} />
        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Still Need Direct Assistance?</h3>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-manrope">
          Our specialized agents are available 24/7 for a confidential intake session. No upfront fees are ever required for technical assessment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-emerald-600 text-white px-10 py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all">
            Initiate Crisis Triage
          </button>
          <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            Secure Consult
          </button>
        </div>
      </div>
    </main>
  );
};
