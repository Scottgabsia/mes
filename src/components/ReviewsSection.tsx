import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BadgeCheck, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  platform: string;
  rating: number;
  content: string;
  tag: string;
  platformType: 'GOOGLE' | 'TRUSTPILOT';
}

const REVIEWS: Review[] = [
  {
    id: 'rev_01',
    user: 'ALEX_W_44',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "The only agency that actually delivered results. Their legal team worked alongside technicians to freeze the thief's account on a Tier-1 exchange.",
    tag: 'Verified_Case',
    platformType: 'TRUSTPILOT'
  },
  {
    id: 'rev_02',
    user: 'ROBERT_VAL',
    platform: 'GOOGLE_REV',
    rating: 5,
    content: "Absolute life savers. Thought my retirement savings were gone forever after a phishing attack. The forensic report was accepted immediately.",
    tag: 'SECURE_RECOVERY',
    platformType: 'GOOGLE'
  },
  {
    id: 'rev_03',
    user: 'SARAH_K_DEV',
    platform: 'GOOGLE_REV',
    rating: 5,
    content: "Technical depth is unmatched. They traced my ETH through three different mixers. Highly recommend for high-value recoveries.",
    tag: 'EXPERT_STATUS',
    platformType: 'GOOGLE'
  },
  {
    id: 'rev_04',
    user: 'MICHAEL_B82',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Very skeptical at first, but Digital Assets Forensics is the real deal. No upfront fees and they recovered 85% of my stolen USDT.",
    tag: 'ASSET_RECLAIM',
    platformType: 'TRUSTPILOT'
  },
  {
    id: 'rev_05',
    user: 'ELENA_FIN',
    platform: 'GOOGLE_REV',
    rating: 5,
    content: "Excellent communication throughout. It took longer than expected due to legal hurdles, but they never gave up until the funds were released.",
    tag: 'LEGAL_WIN',
    platformType: 'GOOGLE'
  }
];

interface ReviewsSectionProps {
  onSeeMore: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onSeeMore }) => {
  const [activeReviewIndex, setActiveReviewIndex] = React.useState(0);

  // Rotate reviews every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % (REVIEWS.length - 2));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mb-stack-lg">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight uppercase">Global Reputation & Sentiment</h3>
          <p className="text-slate-500 font-fira text-xs mt-2 uppercase tracking-widest font-semibold">// VERIFIED_EXT_PLATFORMS</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded glass-panel border border-blue-500/20">
            <div className="flex items-center -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              ))}
            </div>
            <span className="text-[10px] font-fira text-blue-400 font-bold">4.9/5 RATING</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded glass-panel border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-fira text-emerald-400 font-bold">EXCELLENT</span>
          </div>
        </div>
      </div>

      <div className="relative mb-8 min-h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            {REVIEWS.slice(activeReviewIndex, activeReviewIndex + 3).map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10, position: 'absolute' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`glass-panel p-6 rounded-sm border transition-all group flex flex-col justify-between h-full ${
                  review.platformType === 'GOOGLE' ? 'border-blue-500/10 hover:border-blue-500/30' : 'border-emerald-500/10 hover:border-emerald-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${
                        review.platformType === 'GOOGLE' ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}>
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-white tracking-widest font-mono uppercase">{review.platform}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 ${review.platformType === 'GOOGLE' ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 'bg-emerald-500'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                    "{review.content}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] text-slate-500 font-fira uppercase">USER_ID: {review.user}</span>
                  <span className={`text-[10px] font-bold tracking-tighter uppercase font-fira ${
                    review.platformType === 'GOOGLE' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>{review.tag}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onSeeMore}
          className="px-10 py-4 glass-panel border border-blue-500/30 hover:border-blue-500 bg-blue-500/5 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            See More Reviews
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </section>
  );
};
