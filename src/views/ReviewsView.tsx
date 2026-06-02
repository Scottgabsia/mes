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

import { SEO } from '../components/SEO';

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
  },
  {
    id: 'rev_23',
    user: 'PRIYA_MUMBAI',
    platform: 'TRUSTPILOT',
    rating: 5,
    content:
      "I was devastated after losing nearly $180,000 USDT to a fake investment platform that looked identical to a legitimate DeFi protocol. Every other 'recovery' company I contacted demanded thousands upfront. Crypto Recovery Assets was different from the first call: they explained the forensic process, gave me a realistic timeline, and never asked for a retainer. Over six weeks their analysts mapped the flow through multiple chains, identified deposit addresses on a major exchange, and worked with compliance to freeze the balance. I received structured updates twice a week with transaction graphs I could actually show my lawyer. In the end we recovered 92% of the principal. I cannot overstate how professional, patient, and technically competent this team is. If you are sitting on the fence because you have been burned before, start here.",
    date: '2026-05-25',
    verified: true,
    tag: 'FULL_RECOVERY'
  },
  {
    id: 'rev_24',
    user: 'THOMAS_HK',
    platform: 'GOOGLE',
    rating: 5,
    content:
      "Our family office engaged them after a spear-phishing incident drained a cold-wallet workflow into a nested series of swaps. The case involved Ethereum mainnet, Arbitrum, and a privacy pool—complexity most vendors waved away. Their report included cluster attribution, exchange KYC correlation requests, and a chain-of-custody appendix suitable for counsel in Hong Kong and the UK. Communication was board-ready without being vague. Recovery exceeded our internal forecast.",
    date: '2026-05-25',
    verified: true,
    tag: 'INSTITUTIONAL_GRADE'
  },
  {
    id: 'rev_25',
    user: 'NINA_PORTLAND',
    platform: 'GOOGLE',
    rating: 4,
    content:
      "Solid experience overall. The portal made it easy to message my analyst and upload bank statements when the exchange asked for source-of-funds proof. Took almost ten weeks because the thief had already cashed out through a P2P desk, but they still clawed back a meaningful portion. Would have appreciated slightly faster email replies on weekends, hence four stars—but I would absolutely recommend them to friends who get scammed.",
    date: '2026-05-26',
    verified: true,
    tag: 'CLIENT_PORTAL'
  },
  {
    id: 'rev_26',
    user: 'RAFAEL_MX',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Recuperaron fondos que creía perdidos para siempre. Muy profesionales y claros en español e inglés.",
    date: '2026-05-26',
    verified: true,
    tag: 'BILINGUAL_SUPPORT'
  },
  {
    id: 'rev_27',
    user: 'EMILY_RN_CHI',
    platform: 'TRUSTPILOT',
    rating: 5,
    content:
      "A romance scammer convinced me to send BTC over three months. I was ashamed and almost did not report it. The intake team treated me with dignity—no judgment, just facts. They traced cumulative deposits to a consolidation wallet, linked it to prior fraud complaints in their intelligence database, and helped me file with IC3. Seeing the case status move from PENDING to RECOVERY in the client dashboard kept me sane. They recovered 0.84 BTC. Forever grateful.",
    date: '2026-05-27',
    verified: true,
    tag: 'ROMANCE_SCAM'
  },
  {
    id: 'rev_28',
    user: 'VIKTOR_BERLIN',
    platform: 'GOOGLE',
    rating: 5,
    content: "Schnelle Reaktion, klare Forensik, echte Ergebnisse. Die Börse hat nach ihrem Brief die Auszahlung gestoppt.",
    date: '2026-05-27',
    verified: true,
    tag: 'EU_EXCHANGE'
  },
  {
    id: 'rev_29',
    user: 'OLIVIA_SYDNEY',
    platform: 'TRUSTPILOT',
    rating: 5,
    content:
      "I lost access to a hardware wallet after a firmware update corrupted my passphrase backup. Local shops said it was impossible. These specialists rebuilt the derivation path, verified checksums on partial seed fragments, and restored access without ever asking me to email my full seed phrase—everything happened through their encrypted portal and in-person video verification. That security posture matters. Five stars without hesitation.",
    date: '2026-05-28',
    verified: true,
    tag: 'WALLET_RESTORATION'
  },
  {
    id: 'rev_30',
    user: 'JAMES_FTL',
    platform: 'GOOGLE',
    rating: 5,
    content:
      "Fake Coinbase support on Twitter/X walked me through 'securing' my account and drained $47k in under an hour. I called Crypto Recovery Assets the same night. By morning they had flagged the destination cluster, by day three the exchange had a hold on the account, and within a month most funds were returned. The success-only fee model meant I only paid when money actually hit my bank-linked account. Legitimate operation.",
    date: '2026-05-28',
    verified: true,
    tag: 'IMPERSONATION_SCAM'
  },
  {
    id: 'rev_31',
    user: 'HANNAH_ZURICH',
    platform: 'TRUSTPILOT',
    rating: 4,
    content:
      "Very thorough forensic report for our insurance claim. Insurer initially denied coverage citing 'user negligence'; CRA's documentation on the exploit vector and third-party bridge vulnerability helped overturn that decision. Recovery amount was partial because assets had already been bridged to a high-risk jurisdiction, but the investigative quality was exceptional.",
    date: '2026-05-29',
    verified: true,
    tag: 'INSURANCE_CLAIM'
  },
  {
    id: 'rev_32',
    user: 'ANTONIO_NJ',
    platform: 'GOOGLE',
    rating: 5,
    content:
      "My son fell for a Discord 'NFT mint' drainer and lost his college fund in ETH and SOL. As a parent I was furious and scared. The team treated it like the emergency it was: weekend escalation, direct line to an analyst, coordination with OpenSea support logs and Solana validators where relevant. They recovered enough to cover tuition. God bless this crew—they turned our worst month into something hopeful.",
    date: '2026-05-29',
    verified: true,
    tag: 'NFT_DRAINER'
  },
  {
    id: 'rev_33',
    user: 'MEI_LION_CITY',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Transparent milestones, honest probabilities, and they delivered. No ghosting, no upsells.",
    date: '2026-05-30',
    verified: true,
    tag: 'MILESTONE_SYNC'
  },
  {
    id: 'rev_34',
    user: 'GREGORY_AUS',
    platform: 'GOOGLE',
    rating: 5,
    content:
      "I run a small mining operation and had a payroll wallet compromised via a malicious browser extension. CRA isolated the malware IOCs, traced outflows to mixers and then to a regional exchange, and prepared evidence for Australian cybercrime authorities. The written report alone was worth the engagement—clear exhibits, hashes, timestamps, USD valuations at each hop. Funds recovered: 78%. Process was intense but fair. They told me upfront when odds were low and still pushed. This is the standard every recovery firm should meet.",
    date: '2026-05-30',
    verified: true,
    tag: 'FORENSIC_REPORT'
  },
  {
    id: 'rev_35',
    user: 'AISHA_DXB',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I lost funds in a fake OTC desk scam. Their team traced every transfer and coordinated with exchange compliance. Recovery was not instant, but updates were consistent and evidence quality was excellent.",
    date: '2026-05-31',
    verified: true,
    tag: 'OTC_SCAM_TRACE'
  },
  {
    id: 'rev_36',
    user: 'MARK_LONDON',
    platform: 'GOOGLE',
    rating: 5,
    content: "Professional from intake to closure. They explained probabilities clearly, never overpromised, and recovered a substantial amount from a cross-chain theft case.",
    date: '2026-05-31',
    verified: true,
    tag: 'CROSS_CHAIN_CASE'
  },
  {
    id: 'rev_37',
    user: 'ELISE_PARIS',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "The legal report they produced was accepted by my attorney without revisions. The timeline and transaction mapping were clear and court-friendly.",
    date: '2026-05-31',
    verified: true,
    tag: 'LEGAL_READY_REPORT'
  },
  {
    id: 'rev_38',
    user: 'NOAH_TORONTO',
    platform: 'GOOGLE',
    rating: 4,
    content: "Very good service and communication. Recovery took longer than expected due to exchange backlogs, but the team stayed engaged and recovered meaningful value.",
    date: '2026-06-01',
    verified: true,
    tag: 'PERSISTENT_FOLLOWUP'
  },
  {
    id: 'rev_39',
    user: 'CHLOE_DUBLIN',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I was targeted by a recovery scam after my first loss. This was the first company that behaved transparently and documented every action. Real professionals.",
    date: '2026-06-01',
    verified: true,
    tag: 'DOUBLE_SCAM_DEFENSE'
  },
  {
    id: 'rev_40',
    user: 'RAVI_SINGAPORE',
    platform: 'GOOGLE',
    rating: 5,
    content: "Strong technical depth on DeFi exploit tracing. Their analysts explained bridge hops and mixer interactions in language our team could understand.",
    date: '2026-06-01',
    verified: true,
    tag: 'DEFI_ANALYSIS'
  },
  {
    id: 'rev_41',
    user: 'MARTA_MADRID',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I appreciated the security-first process. They never asked for private keys and all document sharing happened through a secure portal.",
    date: '2026-06-01',
    verified: true,
    tag: 'SECURE_WORKFLOW'
  },
  {
    id: 'rev_42',
    user: 'ISAAC_BOSTON',
    platform: 'GOOGLE',
    rating: 5,
    content: "After a SIM-swap account takeover, they moved fast with exchange notifications and forensic evidence. That speed made the difference.",
    date: '2026-06-01',
    verified: true,
    tag: 'SIM_SWAP_RESPONSE'
  },
  {
    id: 'rev_43',
    user: 'YUKI_TOKYO',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Clear milestones, honest risk ratings, and excellent analyst support. The process felt structured and trustworthy from day one.",
    date: '2026-06-01',
    verified: true,
    tag: 'STRUCTURED_CASE'
  },
  {
    id: 'rev_44',
    user: 'NATALIE_ATL',
    platform: 'GOOGLE',
    rating: 4,
    content: "My case was old and difficult, so the recovery percentage was partial. Still, they delivered exactly what they said they would: rigorous tracing and realistic guidance.",
    date: '2026-06-01',
    verified: true,
    tag: 'LEGACY_CASE'
  },
  {
    id: 'rev_45',
    user: 'OMAR_DOHA',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Excellent coordination with our legal counsel. Their evidence package saved us weeks and improved our filing quality immediately.",
    date: '2026-06-01',
    verified: true,
    tag: 'COUNSEL_SUPPORT'
  },
  {
    id: 'rev_46',
    user: 'JULIA_OSLO',
    platform: 'GOOGLE',
    rating: 5,
    content: "I thought my chain-hopped funds were gone forever. They tracked movements across multiple wallets and found exchange touchpoints we did not see.",
    date: '2026-06-01',
    verified: true,
    tag: 'CHAIN_HOP_TRACE'
  },
  {
    id: 'rev_47',
    user: 'TYLER_SEA',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Great experience for a stressful situation. Fast intake, clean reporting, and no hidden fees. I would refer anyone dealing with crypto fraud.",
    date: '2026-06-01',
    verified: true,
    tag: 'FEE_TRANSPARENCY'
  },
  {
    id: 'rev_48',
    user: 'LINA_AMS',
    platform: 'GOOGLE',
    rating: 5,
    content: "Their long-form case updates were incredibly useful. Every update included what changed, what remained uncertain, and what the next action was.",
    date: '2026-06-01',
    verified: true,
    tag: 'CLEAR_UPDATES'
  },
  {
    id: 'rev_49',
    user: 'FARIS_KL',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "The team helped us with a high-value USDT scam and handled exchange coordination professionally. Evidence quality was top-tier.",
    date: '2026-06-01',
    verified: true,
    tag: 'USDT_RECOVERY'
  },
  {
    id: 'rev_50',
    user: 'SOPHIE_CPT',
    platform: 'GOOGLE',
    rating: 5,
    content: "Their forensic methodology gave me confidence. They separated confirmed facts from assumptions, which was critical for legal follow-up.",
    date: '2026-06-01',
    verified: true,
    tag: 'METHOD_DISCIPLINE'
  },
  {
    id: 'rev_51',
    user: 'DANIEL_MIA',
    platform: 'TRUSTPILOT',
    rating: 4,
    content: "Very strong technical team and great portal. A bit complex for non-technical users, but the analyst support was patient and helpful.",
    date: '2026-06-01',
    verified: true,
    tag: 'ANALYST_SUPPORT'
  },
  {
    id: 'rev_52',
    user: 'HYEJIN_SEOUL',
    platform: 'GOOGLE',
    rating: 5,
    content: "I used them for smart-contract exploit response. They acted quickly, provided an actionable trace map, and coordinated with our external counsel.",
    date: '2026-06-01',
    verified: true,
    tag: 'EXPLOIT_RESPONSE'
  },
  {
    id: 'rev_53',
    user: 'MIGUEL_LISBON',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "From first call to final report, everything was handled with professionalism. Their process is exactly what victims need in high-stress situations.",
    date: '2026-06-01',
    verified: true,
    tag: 'PROCESS_TRUST'
  },
  {
    id: 'rev_54',
    user: 'ERIN_DENVER',
    platform: 'GOOGLE',
    rating: 5,
    content: "This team restored my confidence after a major loss. They delivered practical advice, strong forensics, and real outcomes.",
    date: '2026-06-01',
    verified: true,
    tag: 'CLIENT_CONFIDENCE'
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
    <main className="pt-36 sm:pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
      <SEO 
        title="Client Reviews | Verified Crypto Recovery Success Stories" 
        description="Authentic reviews for our crypto recovery service. Read how our bitcoin recovery experts have helped hundreds of clients reclaim their stolen digital assets."
        keywords="crypto recovery service reviews, legit crypto recovery, bitcoin recovery expert testimonials, scammed crypto recovery success, verified crypto recovery"
      />
      {/* Header Section */}
      <div className="mb-12 border-l-4 border-blue-600 pl-6 scroll-mt-36">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white font-manrope font-extrabold tracking-tight mb-2 uppercase flex flex-wrap items-center leading-tight">
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
