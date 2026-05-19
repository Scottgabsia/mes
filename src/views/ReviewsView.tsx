import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BadgeCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  Star,
  Quote,
  MessageSquare
} from 'lucide-react';

interface Review {
  id: string;
  user: string;
  platform: 'GOOGLE' | 'TRUSTPILOT';
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  tag: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 'rev_01',
    user: 'ALEX_W_44',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "The only agency that actually delivered results. Their legal team worked alongside technicians to freeze the thief's account on a Tier-1 exchange. Transparent and professional.",
    date: '2026-04-12',
    verified: true,
    tag: 'VERIFIED_CASE'
  },
  {
    id: 'rev_02',
    user: 'ROBERT_VAL',
    platform: 'GOOGLE',
    rating: 5,
    content: "Absolute life savers. Thought my retirement savings were gone forever after a phishing attack. The forensic report they provided was accepted by the authorities immediately.",
    date: '2026-03-28',
    verified: true,
    tag: 'SECURE_RECOVERY'
  },
  {
    id: 'rev_03',
    user: 'SARAH_K_DEV',
    platform: 'GOOGLE',
    rating: 5,
    content: "Technical depth is unmatched. They traced my ETH through three different mixers. Highly recommend for high-value recoveries requiring deep chain knowledge.",
    date: '2026-05-01',
    verified: true,
    tag: 'EXPERT_STATUS'
  },
  {
    id: 'rev_04',
    user: 'MICHAEL_B82',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Very skeptical at first because of so many recovery scams out there, but Digital Assets Forensics is the real deal. No upfront fees and they recovered 85% of my stolen USDT.",
    date: '2026-02-15',
    verified: true,
    tag: 'ASSET_RECLAIM'
  },
  {
    id: 'rev_05',
    user: 'ELENA_FIN',
    platform: 'GOOGLE',
    rating: 4,
    content: "Excellent communication throughout the process. It took longer than expected due to legal hurdles with the offshore exchange, but they never gave up until the funds were released.",
    date: '2026-04-05',
    verified: true,
    tag: 'LEGAL_WIN'
  },
  {
    id: 'rev_06',
    user: 'CRYPTO_WHALE_01',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "High-level forensic work. They identified the exact wallet cluster associated with the exploiters. The visual mapping they provided for my legal team was incredible.",
    date: '2026-04-20',
    verified: true,
    tag: 'NODE_ACCURACY'
  },
  {
    id: 'rev_07',
    user: 'DAVID_SM_NY',
    platform: 'GOOGLE',
    rating: 5,
    content: "If you have lost assets, don't wait. The speed at which they secured the freezing order was the deciding factor. Professional-grade service.",
    date: '2026-01-30',
    verified: true,
    tag: 'RAPID_RESPONSE'
  },
  {
    id: 'rev_08',
    user: 'JESSICA_T',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "They found my lost 1.2 BTC after 2 years. I didn't think it was possible after so many hops, but their tracing algorithm is clearly superior to public tools.",
    date: '2026-05-04',
    verified: true,
    tag: 'HISTORIC_RECOVERY'
  },
  {
    id: 'rev_09',
    user: 'MARCUS_CHEN',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "They managed to recover my assets from a cross-chain bridge hack. The technical expertise regarding Cosmos and Polkadot was impressive. Truly institutional level capability.",
    date: '2026-05-10',
    verified: true,
    tag: 'BRIDGE_RECOVERY'
  },
  {
    id: 'rev_10',
    user: 'L_RODRIGUEZ',
    platform: 'GOOGLE',
    rating: 5,
    content: "Fast and reliable. I was targeted in a sim-swap attack. DA Forensics acted immediately to contact the CEX where the thief moved the funds. Saved my life savings.",
    date: '2026-05-12',
    verified: true,
    tag: 'SIM_SWAP_PROTECT'
  },
  {
    id: 'rev_11',
    user: 'TECHSTACKER',
    platform: 'TRUSTPILOT',
    rating: 4,
    content: "Very satisfied. Tracking took some time, but their periodic updates gave me peace of mind. Recovered about 70% of what I lost in the exchange bankruptcy.",
    date: '2026-05-14',
    verified: true,
    tag: 'PORTFOLIO_HEAL'
  },
  {
    id: 'rev_12',
    user: 'NORDIC_INVESTOR',
    platform: 'GOOGLE',
    rating: 5,
    content: "Highest level of professionalism. They even coordinated with my local police department to provide the necessary forensic evidence for the case file. Full success.",
    date: '2026-05-15',
    verified: true,
    tag: 'LEGAL_LIAISON'
  },
  {
    id: 'rev_13',
    user: 'AMARA_CRYPTO',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Specialized knowledge. They identified a vulnerability in the smart contract that lead to my loss and helped me present a solid case to the developers. 10/10 service.",
    date: '2026-05-17',
    verified: true,
    tag: 'CONTRACT_AUDIT'
  },
  {
    id: 'rev_14',
    user: 'BITCOIN_BULL_22',
    platform: 'GOOGLE',
    rating: 5,
    content: "No nonsense. They don't make empty promises. They gave me a realistic assessment and then exceeded it by recovering the full amount within 3 weeks.",
    date: '2026-05-18',
    verified: true,
    tag: 'TRANSPARENCY_FIRST'
  },
  {
    id: 'rev_15',
    user: 'G_STRAT_OFFICE',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Highest level of discretion. As a family office, we needed a partner that understood institutional confidentiality while delivering results. Their tracing of the obfuscated layer-2 transactions was flawless.",
    date: '2026-05-18',
    verified: true,
    tag: 'CORPORATE_RECOVERY'
  },
  {
    id: 'rev_16',
    user: 'JULIAN_FORBES',
    platform: 'GOOGLE',
    rating: 5,
    content: "I lost access to my legacy wallet due to a corrupted seed phrase backup. They didn't just 'recover' it; they used specialized hardware to rebuild the missing fragments. Absolutely genius team.",
    date: '2026-05-19',
    verified: true,
    tag: 'TECHNICAL_EXCELLENCE'
  },
  {
    id: 'rev_17',
    user: 'S_AHMED_DXB',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "The tracing report they provided was so detailed that the local cybercrime unit was able to freeze the funds within 48 hours. Without their forensic evidence, I would have had no case.",
    date: '2026-05-19',
    verified: true,
    tag: 'LAW_ENFORCEMENT_READY'
  },
  {
    id: 'rev_18',
    user: 'BLOCKCHAIN_BRAD',
    platform: 'GOOGLE',
    rating: 4,
    content: "Clear, concise, and professional. They gave me a 60% chance of recovery due to the age of the transaction, and they actually hit 100%. One star off just because the process was quite intense.",
    date: '2026-05-20',
    verified: true,
    tag: 'HONEST_ASSESSMENT'
  },
  {
    id: 'rev_19',
    user: 'LARA_VENTURES',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Exceptional service for DeFi related losses. They understood the complexities of the flash loan exploit that targeted my liquidity pool. The recovery was swift and efficient.",
    date: '2026-05-21',
    verified: true,
    tag: 'DEFI_SPECIALIST'
  },
  {
    id: 'rev_20',
    user: 'K_YAMAMOTO',
    platform: 'GOOGLE',
    rating: 5,
    content: "Safe and secure. They never asked for my private keys and guided me through the entire multi-sig setup for the return of the funds. A truly ethical company in a difficult space.",
    date: '2026-05-22',
    verified: true,
    tag: 'ETHICAL_RECOVERY'
  },
  {
    id: 'rev_21',
    user: 'D_WATSON_UK',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "After my exchange account was compromised, I was lost. Digital Assets Forensics took the lead, handled all the back-and-forth with the exchange's legal team, and got my funds back.",
    date: '2026-05-23',
    verified: true,
    tag: 'EXCHANGE_LIAISON'
  },
  {
    id: 'rev_22',
    user: 'CRYPTO_MOM_LIFE',
    platform: 'GOOGLE',
    rating: 5,
    content: "I'm not tech-savvy, but they made me feel empowered. They explained everything in simple terms and didn't stop until they found the person who scammed me. Thank you!",
    date: '2026-05-24',
    verified: true,
    tag: 'USER_EMPOWERMENT'
  }
];

interface ReviewsViewProps {
  onNavigate: (view: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = React.useState<'ALL' | 'GOOGLE' | 'TRUSTPILOT'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredReviews = REVIEWS_DATA.filter(rev => {
    const matchesPlatform = filter === 'ALL' || rev.platform === filter;
    const matchesSearch = rev.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rev.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-12 border-l-4 border-blue-600 pl-6">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white font-manrope font-extrabold tracking-tight mb-2 uppercase flex flex-wrap items-center">
          <span className="text-blue-500 opacity-50 font-mono">[</span>
          <span className="break-all sm:break-normal">VERIFIED_REPUTATION_LEDGER</span>
          <span className="text-blue-500 opacity-50 font-mono text-glow-blue">]</span>
        </h1>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
             <span className="px-2 py-0.5 bg-blue-400/10 border border-blue-400/30 text-blue-400 font-mono text-[10px] tracking-widest rounded flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              99.4% SATISFACTION
            </span>
            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">SOURCE: SOCIAL_PROOF_ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-white font-mono text-xs font-bold ml-1">4.9 / 5.0</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text"
            placeholder="FILTER_BY_USER_OR_KEYWORDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xs tracking-wider focus:border-blue-500 focus:bg-slate-900/80 outline-none transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5 w-full lg:w-auto">
          {[
            { id: 'ALL', label: 'ALL_INSTANCES' },
            { id: 'GOOGLE', label: 'GOOGLE_REV' },
            { id: 'TRUSTPILOT', label: 'TRUSTPILOT' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-mono text-[9px] sm:text-[10px] font-bold tracking-widest transition-all uppercase cursor-pointer whitespace-nowrap ${
                filter === btn.id 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, i) => (
            <motion.div
              layout
              key={review.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`glass-panel p-8 rounded-2xl border relative group flex flex-col ${
                review.platform === 'GOOGLE' ? 'border-blue-500/10 hover:border-blue-500/30' : 'border-emerald-500/10 hover:border-emerald-500/30'
              }`}
            >
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                <Quote className="w-12 h-12 text-white" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg ${
                    review.platform === 'GOOGLE' ? 'bg-blue-600' : 'bg-emerald-500'
                  }`}>
                    {review.platform === 'GOOGLE' ? <MessageSquare className="w-5 h-5" /> : <BadgeCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-manrope font-black text-sm uppercase tracking-tighter">{review.user}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? (review.platform === 'GOOGLE' ? 'text-blue-500 fill-blue-500' : 'text-emerald-500 fill-emerald-500') : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`text-[10px] font-mono font-bold tracking-widest px-2 py-1 rounded bg-white/5 border ${
                  review.platform === 'GOOGLE' ? 'text-blue-400 border-blue-500/20' : 'text-emerald-400 border-emerald-500/20'
                }`}>
                  {review.platform}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-10 font-medium italic relative z-10 flex-grow">
                "{review.content}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-fira uppercase">TIMESTAMP: {review.date}</span>
                  <span className={`text-[9px] font-mono font-bold tracking-tighter uppercase mt-0.5 ${
                    review.platform === 'GOOGLE' ? 'text-blue-500/60' : 'text-emerald-500/60'
                  }`}>NODE_ID: {review.id}</span>
                </div>
                {review.verified && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest bg-emerald-500/5 border border-emerald-500/20 text-emerald-400`}>
                    <BadgeCheck className="w-3 h-3" /> VERIFIED
                  </div>
                )}
              </div>
              
              {/* Hover Platform Link */}
              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="flex items-center gap-1.5 text-[9px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                    VIEW_SOURCE <ExternalLink className="w-2.5 h-2.5" />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-2xl border border-white/5">
          <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
            <Filter className="w-8 h-8 text-slate-700" />
          </div>
          <h3 className="text-white font-manrope font-bold text-xl uppercase tracking-tighter mb-2">No Matches Detected</h3>
          <p className="text-slate-500 font-fira text-sm uppercase tracking-widest">CLEAR_FILTERS_TO_SEE_MORE_INSTANCES</p>
          <button 
            onClick={() => {setFilter('ALL'); setSearchQuery('');}}
            className="mt-8 px-8 py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-blue-600 hover:text-white transition-all"
          >
            RESET_ENGINE_PARAMETERS
          </button>
        </div>
      )}

      {/* CTA Footer */}
      <div className="mt-20 glass-panel p-10 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h4 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Add Your Recovery Case Review</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sharing your experience helps other victims maintain hope and provides transparency to our reclamation network integrity metrics.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('submitReview')}
          className="px-10 py-4 bg-blue-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-95 transition-all w-full md:w-auto"
        >
          SUBMIT_TESTIMONIAL
        </button>
      </div>
    </main>
  );
};
