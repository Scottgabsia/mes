import React from 'react';
import { BadgeCheck, ChevronRight } from 'lucide-react';
import { HOME_CAROUSEL_REVIEWS } from '../data/homeReviews';

interface CarouselReview {
  id: string;
  user: string;
  platform: string;
  rating: number;
  content: string;
  tag: string;
  platformType: 'GOOGLE' | 'TRUSTPILOT';
}

const REVIEWS: CarouselReview[] = HOME_CAROUSEL_REVIEWS;
const WINDOW = 3;
const SLIDE_MS = 6000;
const FADE_MS = 280;

interface ReviewsSectionProps {
  onSeeMore: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onSeeMore }) => {
  const [activeReviewIndex, setActiveReviewIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [opaque, setOpaque] = React.useState(true);
  const maxIndex = Math.max(1, REVIEWS.length - WINDOW + 1);

  React.useEffect(() => {
    if (paused) return;
    let fadeIn: number | undefined;
    const timer = window.setInterval(() => {
      setOpaque(false);
      fadeIn = window.setTimeout(() => {
        setActiveReviewIndex((prev) => (prev + 1) % maxIndex);
        setOpaque(true);
      }, FADE_MS);
    }, SLIDE_MS);
    return () => {
      window.clearInterval(timer);
      if (fadeIn) window.clearTimeout(fadeIn);
    };
  }, [paused, maxIndex]);

  const visible = REVIEWS.slice(activeReviewIndex, activeReviewIndex + WINDOW);

  return (
    <section className="mb-stack-lg" style={{ overflowAnchor: 'none' }}>
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

      <div
        className="relative mb-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {visible.map((review, slot) => (
            <div
              key={slot}
              className={`glass-panel p-6 rounded-sm border flex flex-col justify-between min-h-[240px] md:min-h-[260px] ${
                review.platformType === 'GOOGLE'
                  ? 'border-blue-500/10'
                  : 'border-emerald-500/10'
              }`}
            >
              <div
                className="flex flex-col h-full justify-between transition-opacity duration-300 ease-out"
                style={{ opacity: opaque ? 1 : 0 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center text-white ${
                          review.platformType === 'GOOGLE' ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                      >
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-white tracking-widest font-mono uppercase">
                        {review.platform}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${
                            review.platformType === 'GOOGLE'
                              ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'
                              : 'bg-emerald-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic h-[7.125rem] overflow-hidden">
                    "{review.content}"
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] text-slate-500 font-fira uppercase truncate">
                    USER_ID: {review.user}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-tighter uppercase font-fira shrink-0 ${
                      review.platformType === 'GOOGLE' ? 'text-blue-400' : 'text-emerald-400'
                    }`}
                  >
                    {review.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
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
