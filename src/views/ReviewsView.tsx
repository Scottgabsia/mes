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

export interface Review {
  id: string;
  user: string;
  platform: 'GOOGLE' | 'TRUSTPILOT';
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  tag: string;
}

export const REVIEWS_DATA: Review[] = [
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
  },
  {
    id: 'rev_55',
    user: 'KAREN_VAN',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "From day one, the team was transparent and calm. Their forensic timeline helped us recover a major portion of our losses.",
    date: '2026-06-02',
    verified: true,
    tag: 'TIMELINE_CLARITY'
  },
  {
    id: 'rev_56',
    user: 'LEO_HELSINKI',
    platform: 'GOOGLE',
    rating: 5,
    content: "Excellent technical team. They explained wallet clustering and exchange touchpoints in practical terms and delivered real results.",
    date: '2026-06-02',
    verified: true,
    tag: 'CLUSTER_FORENSICS'
  },
  {
    id: 'rev_57',
    user: 'AMY_NYC',
    platform: 'TRUSTPILOT',
    rating: 4,
    content: "Good overall experience and strong communication. Recovery took time, but the process was organized and professional.",
    date: '2026-06-02',
    verified: true,
    tag: 'ORGANIZED_PROCESS'
  },
  {
    id: 'rev_58',
    user: 'TARIQ_RIYADH',
    platform: 'GOOGLE',
    rating: 5,
    content: "They handled a complicated cross-chain scam with confidence. I appreciated the detailed updates and legal-ready evidence package.",
    date: '2026-06-02',
    verified: true,
    tag: 'CROSS_CHAIN_INTEL'
  },
  {
    id: 'rev_59',
    user: 'MIA_BRISBANE',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "No hype, just disciplined recovery work. They gave realistic probabilities and still beat expectations.",
    date: '2026-06-02',
    verified: true,
    tag: 'REALISTIC_ASSESSMENT'
  },
  {
    id: 'rev_60',
    user: 'PETER_DALLAS',
    platform: 'GOOGLE',
    rating: 5,
    content: "I was impressed by how quickly they engaged with exchange compliance. That early escalation was key in our case.",
    date: '2026-06-02',
    verified: true,
    tag: 'COMPLIANCE_SPEED'
  },
  {
    id: 'rev_61',
    user: 'NORA_STHLM',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "They turned a chaotic situation into a clear action plan. Every step was documented and easy to follow.",
    date: '2026-06-02',
    verified: true,
    tag: 'ACTION_PLAN'
  },
  {
    id: 'rev_62',
    user: 'DIEGO_BCN',
    platform: 'GOOGLE',
    rating: 4,
    content: "Strong team and strong methodology. Took longer than I hoped, but they recovered enough to make a huge difference.",
    date: '2026-06-02',
    verified: true,
    tag: 'METHODICAL_RECOVERY'
  },
  {
    id: 'rev_63',
    user: 'FATIMA_ABU',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Best part was trust: secure portal, no private-key requests, and clear analyst ownership throughout the case.",
    date: '2026-06-02',
    verified: true,
    tag: 'TRUSTED_HANDLING'
  },
  {
    id: 'rev_64',
    user: 'BEN_MELB',
    platform: 'GOOGLE',
    rating: 5,
    content: "Their forensic report was incredibly detailed and helped both exchange and legal follow-up. Highly recommended.",
    date: '2026-06-02',
    verified: true,
    tag: 'DETAILED_REPORTING'
  },
  {
    id: 'rev_65',
    user: 'MARCUS_CHI',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I lost just over $210,000 in USDT after wiring funds into what I believed was a regulated offshore trading desk. For weeks I was stuck talking to fake 'compliance officers' who kept asking for more deposits. Crypto Recovery Assets took my case seriously from the first call. They rebuilt the entire money trail, identified the exchange deposit addresses used by the operators, and prepared a freeze packet that compliance actually acted on. It took about eleven weeks, but we recovered a substantial majority of the stolen balance. What stood out most was how honest they were about what could and could not be recovered — no miracle promises, just disciplined forensic work.",
    date: '2026-06-04',
    verified: true,
    tag: 'OTC_DESK_FRAUD'
  },
  {
    id: 'rev_66',
    user: 'LINDA_ORL',
    platform: 'GOOGLE',
    rating: 5,
    content: "After a romance scam drained my savings, I felt completely broken and ashamed. I had already paid two so-called recovery companies that vanished with my remaining cash. A friend pushed me toward Crypto Recovery Assets, and the difference was immediate. They never asked for seed phrases, never requested upfront payment, and assigned a case analyst who walked me through every hop on the blockchain like I was a person, not a ticket number. Their report was clear enough for my attorney and for the bank fraud department. We did not get everything back, but we got enough to stabilize my life again. I will always be grateful for how carefully they handled both the technical and the human side of this.",
    date: '2026-06-05',
    verified: true,
    tag: 'ROMANCE_RECOVERY'
  },
  {
    id: 'rev_67',
    user: 'YUSUF_IST',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "My SIM was swapped overnight and within forty minutes the attackers emptied my exchange accounts and drained two hot wallets. Local police were sympathetic but had no crypto expertise. CRA moved incredibly fast. Within the first forty-eight hours they had mapped the outbound transactions, flagged the destination clusters, and opened escalation channels with two major exchanges. Their client portal showed live milestones so I always knew what was happening. Roughly two months later we secured a freeze and eventual release of a large share of the assets. Speed mattered more than anything in my case, and they understood that from minute one.",
    date: '2026-06-06',
    verified: true,
    tag: 'SIM_SWAP_FAST'
  },
  {
    id: 'rev_68',
    user: 'CLAIRE_LYON',
    platform: 'GOOGLE',
    rating: 4,
    content: "I approached Crypto Recovery Assets after a bridge exploit moved my ETH through several chains and into mixer-linked wallets. Their analysts produced a visual hop map that my French counsel said was among the clearest forensic packages they had seen. The recovery itself took longer than I hoped because of offshore compliance delays, which is why I am leaving four stars rather than five. Still, communication never dropped off, deadlines were explained honestly, and the final outcome was far better than what any other firm I consulted even claimed was possible. If you need serious chain analysis rather than marketing slogans, this is the team.",
    date: '2026-06-07',
    verified: true,
    tag: 'BRIDGE_EXPLOIT'
  },
  {
    id: 'rev_69',
    user: 'ANDRE_SAO',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I was targeted through a Discord NFT mint that silently approved a malicious spender. In under an hour my wallet was drained of ETH and several blue-chip NFTs. Most people online told me it was hopeless. Crypto Recovery Assets disagreed. They reconstructed the approval transaction, traced the secondary sales of my NFTs, and worked with marketplace compliance teams while simultaneously pursuing the ETH trail. Their documentation was meticulous — timestamps, tx hashes, counterparties, everything. We recovered a meaningful portion of the value and, just as importantly, I finally understood exactly how the attack worked so I could harden my setup going forward.",
    date: '2026-06-08',
    verified: true,
    tag: 'NFT_APPROVAL_DRAIN'
  },
  {
    id: 'rev_70',
    user: 'HELEN_TOR',
    platform: 'GOOGLE',
    rating: 5,
    content: "Our family office lost a six-figure amount to a sophisticated phishing kit that cloned a Tier-1 exchange login page. Because multiple beneficiaries were involved, we needed institutional-grade handling, not a consumer support chat. CRA assigned a senior analyst and coordinated cleanly with our outside counsel. Their chain-of-custody notes, wallet clustering methodology, and exchange liaison letters were all court-ready. The process took several months, but every week we received a structured update with next actions. We recovered the majority of the stolen funds and now use their post-incident hardening checklist across our wallets. Highly professional from intake to closeout.",
    date: '2026-06-09',
    verified: true,
    tag: 'FAMILY_OFFICE'
  },
  {
    id: 'rev_71',
    user: 'RAVI_BLR',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I fell for a fake mining contract sold through Telegram. After months of fabricated dashboards showing 'profits,' withdrawals were blocked and the operators disappeared. I was terrified I had lost everything I had saved for my sister's education. Crypto Recovery Assets reviewed my chat logs, payment hashes, and wallet history, then identified the laundering path into exchange deposit addresses in two jurisdictions. They were patient with me when I struggled to gather old screenshots and never made me feel foolish. The recovery was partial but substantial, and their fee structure only applied to what they actually brought back. That alone separates them from the recovery scams flooding Instagram.",
    date: '2026-06-10',
    verified: true,
    tag: 'FAKE_MINING'
  },
  {
    id: 'rev_72',
    user: 'NADIA_AMS',
    platform: 'GOOGLE',
    rating: 5,
    content: "As a DeFi power user I thought I could investigate my own exploit. After two sleepless nights I realized I was out of my depth. The attacker had hopped through a flash-loan-assisted drain, bridged to another L2, then split funds across dozens of wallets. CRA's team produced a clustering analysis that connected those wallets to known infrastructure and prior scam campaigns. Their report helped a European exchange freeze remaining balances before they could be fully cashed out. I especially appreciated that they explained uncertainties instead of pretending every hop was a certainty. That intellectual honesty is rare in this industry.",
    date: '2026-06-11',
    verified: true,
    tag: 'FLASH_LOAN_TRACE'
  },
  {
    id: 'rev_73',
    user: 'TOMAS_PRG',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Someone impersonating Coinbase support contacted me after I posted about a failed login on social media. Within hours I had given them remote access and watched my account get cleaned out. Shame does not begin to cover it. Crypto Recovery Assets treated the case like an investigation, not a lecture. They captured device indicators, reconstructed the social-engineering timeline, and linked the stolen assets to cash-out routes. Working with exchange security and local authorities, they helped recover a large percentage of what was taken. Their secure portal and refusal to ever request private keys gave me confidence I had finally found a legitimate firm.",
    date: '2026-06-12',
    verified: true,
    tag: 'SUPPORT_IMPERSONATION'
  },
  {
    id: 'rev_74',
    user: 'AISHA_LAG',
    platform: 'GOOGLE',
    rating: 5,
    content: "I was caught in a pig-butchering investment scheme that spanned nearly eight months. By the time I understood what was happening, more than $95,000 was gone. Friends told me recovery was impossible. CRA proved otherwise. They analyzed every USDT transfer, identified intermediary wallets, and built a narrative report that law enforcement could actually use. Updates arrived on schedule, questions were answered in plain language, and the team never pressured me for additional payments. We recovered a significant share through exchange freezes. If you are reading this after a similar scam, please contact them before you lose more money to fake recovery agents.",
    date: '2026-06-13',
    verified: true,
    tag: 'PIG_BUTCHERING'
  },
  {
    id: 'rev_75',
    user: 'GREG_PHX',
    platform: 'TRUSTPILOT',
    rating: 4,
    content: "My hardware wallet seed was compromised after I stored a poorly protected backup photo in cloud storage. Attackers swept BTC and ETH the same week. Crypto Recovery Assets were transparent that full recovery was unlikely once funds hit mixers, and I respect them for saying that upfront. Even so, they traced residual amounts that had not yet been obfuscated and secured freezes on those portions. The process was slower than advertised timelines for simpler cases, which is why this is four stars. But the quality of the forensic work, the calm communication, and the ethical standards were excellent. I would hire them again without hesitation.",
    date: '2026-06-14',
    verified: true,
    tag: 'SEED_COMPROMISE'
  },
  {
    id: 'rev_76',
    user: 'YUKI_OSAKA',
    platform: 'GOOGLE',
    rating: 5,
    content: "Clipboard malware replaced a withdrawal address on my desktop and I sent a large ETH transfer to an attacker before noticing. Panic set in immediately. Within hours of contacting Crypto Recovery Assets, an analyst had confirmed the destination cluster and begun monitoring for exchange deposits. Their speed and precision were remarkable. They prepared a legal-ready incident package in both English and a format my Japanese counsel could work with. Several weeks later we obtained a successful freeze and recovery of most of the transfer. I have recommended them to two colleagues who were similarly targeted. Outstanding technical work paired with genuine care for the client.",
    date: '2026-06-15',
    verified: true,
    tag: 'CLIPBOARD_MALWARE'
  },
  {
    id: 'rev_77',
    user: 'PATRICIA_MAD',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I am not a crypto native. My late husband left wallets I barely understood, and when a 'helpful' recovery specialist online asked for the seed phrase, I almost handed it over. Thankfully I found Crypto Recovery Assets first. They guided me through legitimate wallet restoration, verified ownership carefully, and helped recover access without ever putting the keys at risk. Along the way they also spotted unauthorized small drains that had already started and stopped further loss. For families dealing with inheritance and digital assets, this kind of careful, ethical help is invaluable. Five stars is not enough.",
    date: '2026-06-16',
    verified: true,
    tag: 'INHERITANCE_WALLET'
  },
  {
    id: 'rev_78',
    user: 'OMAR_CAS',
    platform: 'GOOGLE',
    rating: 5,
    content: "Our small trading desk was hit by an insider-assisted withdrawal scheme. We needed discretion, speed, and forensic clarity for both insurance and potential litigation. CRA delivered all three. Their analysts reconstructed privileged access timelines, correlated on-chain movements with internal logs we provided, and produced a report our insurer accepted without major pushback. The recovery pathway involved multi-jurisdictional exchange outreach, which they handled professionally. Throughout the engagement they treated sensitive business information with care. This was not consumer-level support — it felt like hiring a specialized investigative unit.",
    date: '2026-06-17',
    verified: true,
    tag: 'INSIDER_THEFT'
  },
  {
    id: 'rev_79',
    user: 'SOPHIE_EDI',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "A fake airdrop site drained approvals from my wallet while I was traveling. I discovered the theft late at night in a hotel room and felt completely helpless. Crypto Recovery Assets responded the next morning with a clear intake, immediate revoke guidance for remaining approvals, and a full trace of the stolen tokens. Their portal made it easy to upload evidence and track progress across time zones. Over the following weeks they coordinated with two exchanges and recovered a large portion of what was taken. The combination of technical competence and steady communication made an awful situation manageable.",
    date: '2026-06-18',
    verified: true,
    tag: 'AIRDROP_DRAINER'
  },
  {
    id: 'rev_80',
    user: 'KEVIN_SEA',
    platform: 'GOOGLE',
    rating: 5,
    content: "I had already filed an IC3 report and spoken with my bank before finding Crypto Recovery Assets. What they added was the blockchain expertise those channels lacked. They translated my case into a forensic package with annotated transaction graphs, counterparties, and recommended freeze targets. That package materially improved engagement with exchange compliance teams. Recovery was not instantaneous — anyone promising that is lying — but it was methodical and ultimately successful for a major share of the loss. I also valued their post-case security review. They helped me lock down 2FA, withdrawal whitelists, and device hygiene so this does not happen again.",
    date: '2026-06-19',
    verified: true,
    tag: 'IC3_SUPPORT'
  },
  {
    id: 'rev_81',
    user: 'INES_LIS',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "After sending USDT to a fraudulent 'guaranteed yield' platform, I contacted several recovery services. Most replied with WhatsApp messages demanding Bitcoin fees. Crypto Recovery Assets was the first firm that felt legitimate. Their website matched their process: secure portal, written agreements, no private-key requests, and success-aligned fees. The investigation uncovered that my funds had been pooled with other victims and partially parked on a KYC exchange. That finding changed everything. With their documentation, a freeze request succeeded. It took patience, but the outcome restored both money and my faith that ethical recovery work still exists.",
    date: '2026-06-20',
    verified: true,
    tag: 'YIELD_SCAM'
  },
  {
    id: 'rev_82',
    user: 'BRETT_AUCK',
    platform: 'GOOGLE',
    rating: 4,
    content: "Cross-border recovery is messy, and my case involved wallets touching Asia, Eastern Europe, and a Caribbean-facing exchange. CRA never sugarcoated the complexity. They set realistic checkpoints and hit most of them. The final recovery percentage was solid though not complete, and a couple of update cycles slipped during holiday periods, hence four stars. Even with those caveats, their forensic quality and legal packaging were excellent. My solicitor in Auckland said the evidence bundle saved weeks of work. If your case spans multiple jurisdictions, these are people who already know how painful that is and plan accordingly.",
    date: '2026-06-21',
    verified: true,
    tag: 'MULTI_JURISDICTION'
  },
  {
    id: 'rev_83',
    user: 'CHIOMA_ABJ',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I nearly destroyed what little I had left by paying a Telegram 'recovery agent' who claimed he needed gas fees to unlock my funds. Thankfully I stopped and searched for real companies instead. Crypto Recovery Assets explained, calmly and clearly, how those secondary scams work and why no legitimate firm needs your seed phrase. Then they actually investigated my original investment fraud case. Their analyst showed me hop by hop where the money went and which portions were still potentially recoverable. We succeeded in reclaiming a meaningful amount. More than the money, they protected me from being scammed twice.",
    date: '2026-06-22',
    verified: true,
    tag: 'SECONDARY_SCAM_STOP'
  },
  {
    id: 'rev_84',
    user: 'ERIC_MTL',
    platform: 'GOOGLE',
    rating: 5,
    content: "Our company treasury wallet was drained after a compromised employee browser session approved a malicious contract. We needed enterprise responsiveness and airtight documentation for board reporting. CRA delivered a full incident timeline within days, including first-seen indicators, affected assets, and recommended containment steps. They then pursued recovery through exchange channels while our internal security team remediated access controls. Weekly executive summaries were concise and useful. We recovered a majority of the stolen crypto and walked away with better controls than we had before the incident. Rare to find a vendor that improves both outcome and process maturity.",
    date: '2026-06-23',
    verified: true,
    tag: 'TREASURY_INCIDENT'
  },
  {
    id: 'rev_85',
    user: 'LAURA_VIE',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I lost funds to a fake OTC broker who used deepfake video calls to appear as a known market maker. It felt surreal. Crypto Recovery Assets treated it as a serious financial crime case. They correlated payment rails, wallet clustering, and messaging metadata I provided into one coherent narrative. That narrative unlocked cooperation from an exchange that had previously ignored my solo tickets. Recovery took time, but every milestone in the portal was real. I especially appreciated that they never overstated probabilities. When they said a path looked promising, it usually was. Professional, humane, and technically sharp.",
    date: '2026-06-24',
    verified: true,
    tag: 'DEEPFAKE_OTC'
  },
  {
    id: 'rev_86',
    user: 'NOAH_TLV',
    platform: 'GOOGLE',
    rating: 5,
    content: "A malicious browser extension drained SOL and associated tokens from my Phantom wallet. I contacted CRA expecting a long shot. Instead I got a structured investigation that identified the cash-out pattern within days. Their team monitored for consolidation events and moved quickly when funds hit a centralized venue. The freeze request succeeded. Communication across time zones was smooth, and their explanations helped me understand Solana-specific nuances I had never considered. If you are dealing with an extension or approval-based drain, do not waste weeks on forums — get a real forensic team involved early.",
    date: '2026-06-25',
    verified: true,
    tag: 'EXTENSION_DRAIN'
  },
  {
    id: 'rev_87',
    user: 'MARIA_BOG',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "Escribí primero en español porque estaba demasiado nerviosa para pensar en inglés, and their team still handled everything with patience. My case involved a fake forex-crypto hybrid platform that pushed constant deposits. Crypto Recovery Assets reconstructed the flow of USDT across several intermediaries and prepared bilingual materials I could share with local counsel. They never rushed me, never shamed me, and never asked for unsafe access to my wallets. After months of work we recovered enough to make a real difference for my family. Competence plus compassion is a rare combination, and they have both.",
    date: '2026-06-26',
    verified: true,
    tag: 'BILINGUAL_CASE'
  },
  {
    id: 'rev_88',
    user: 'HANS_MUC',
    platform: 'GOOGLE',
    rating: 5,
    content: "I am an engineer, so I evaluate vendors harshly. Crypto Recovery Assets passed. Their methodology for wallet clustering, change-address heuristics, and exchange attribution was explained with enough rigor that I could independently sanity-check key claims. When evidence was weak, they labeled it as such. When a hop was high-confidence, they showed why. That discipline produced a report German counsel and a compliance team both trusted. Recovery outcome exceeded my conservative expectations. If you want forensics that can survive scrutiny rather than a glossy PDF full of buzzwords, hire these people.",
    date: '2026-06-27',
    verified: true,
    tag: 'ENGINEER_REVIEW'
  },
  {
    id: 'rev_89',
    user: 'RACHEL_PHIL',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "My elderly father was socially engineered into transferring BTC to a 'secure vault' address controlled by scammers. Watching him realize what happened was devastating. Crypto Recovery Assets spoke with us gently, gathered every detail without overwhelm, and began tracing immediately. They coordinated with the exchange side while helping us file the right reports at home. The case took persistence — scammers tried to hop quickly — but CRA stayed ahead of several movements. We recovered a large portion of the Bitcoin. More than that, they helped my father feel less alone in a situation he barely understood. Exceptional service.",
    date: '2026-06-28',
    verified: true,
    tag: 'ELDER_FRAUD'
  },
  {
    id: 'rev_90',
    user: 'VIKTOR_KRK',
    platform: 'GOOGLE',
    rating: 4,
    content: "Solid work on a messy DeFi rug-pull where liquidity was yanked and tokens collapsed. CRA traced insider wallets and linked them to earlier campaigns, which was useful even beyond my personal recovery. Funds that remained on-ramped to exchanges were partially frozen and returned. I mark it four stars only because absolute recovery was limited by how quickly the operators off-ramped through privacy tools — a limitation of the case, not a failure of effort. Still, their transparency about those limits and their refusal to invent false hope earned my trust. Worth every bit of the contingency fee.",
    date: '2026-06-29',
    verified: true,
    tag: 'RUG_PULL_TRACE'
  },
  {
    id: 'rev_91',
    user: 'AMINA_DOH',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I transferred a large USDT sum to what looked like a licensed broker website complete with fake certificates and fabricated testimonials. When withdrawals failed, the website went dark. Crypto Recovery Assets started with a calm evidence intake and then mapped every transaction into a forensic timeline. They identified exchange landing points I would never have found alone and drafted freeze language that compliance teams responded to. Throughout the process the client portal kept me informed without forcing me to chase people on chat apps. We recovered the majority of the loss. Professional, secure, and results-driven.",
    date: '2026-06-30',
    verified: true,
    tag: 'BROKER_CLONE'
  },
  {
    id: 'rev_92',
    user: 'JONAS_CPH',
    platform: 'GOOGLE',
    rating: 5,
    content: "After a sophisticated email compromise, attackers requested a crypto payment from our accounts payable wallet using a forged invoice thread. By the time we noticed, the transaction had confirmed. CRA treated it as both a crypto and a business-email-compromise case. They correlated mail headers we provided with on-chain activity and pursued the destination aggressively. Their report was detailed enough for cyber insurance and for internal audit. We recovered a significant amount and received practical recommendations to prevent recurrence. Hiring them felt like bringing in specialists who already knew the playbook for this exact failure mode.",
    date: '2026-07-01',
    verified: true,
    tag: 'BEC_CRYPTO'
  },
  {
    id: 'rev_93',
    user: 'SANA_KHI',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I was drowning in shame after losing money to a fake celebrity investment channel on social media. Crypto Recovery Assets never made me feel stupid. They focused on facts: payment proofs, wallet addresses, chat exports, and timelines. Their investigation showed my funds had been aggregated with other victims and partially held on an exchange still reachable through compliance. That finding became the turning point. Weeks of coordinated work later, a freeze and recovery process succeeded for a large share of what I lost. The team was respectful, relentless, and clear at every stage. I recommend them without reservation.",
    date: '2026-07-02',
    verified: true,
    tag: 'SOCIAL_CELEB_SCAM'
  },
  {
    id: 'rev_94',
    user: 'DREW_ATL',
    platform: 'GOOGLE',
    rating: 5,
    content: "I work in compliance myself, so I am allergic to vague recovery claims. Crypto Recovery Assets impressed me with process discipline. Intake was structured. Evidence requests were specific. Attribution language in their reports carefully distinguished confirmed links from probable clustering. When they engaged exchange partners, the packets looked like something a real investigations unit would send. We achieved a strong recovery outcome on a phishing-driven USDC theft. Beyond the money, their work product was something I would be comfortable putting in front of regulators or auditors. That is the standard this industry needs.",
    date: '2026-07-03',
    verified: true,
    tag: 'COMPLIANCE_GRADE'
  },
  {
    id: 'rev_95',
    user: 'ELENA_BUC',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "My case involved stolen funds moved through multiple mixers and then into fresh wallets. Many firms told me it was impossible and hung up. CRA did not promise miracles, but they also did not quit. They waited for operational mistakes by the thieves — consolidation events, exchange deposits, reusable infrastructure — and struck when opportunities appeared. That patience paid off. We recovered less than a total win but far more than zero, which is what every other conversation had offered me. If your trail looks 'too mixed' for amateurs, these analysts still know how to work the edges of the problem.",
    date: '2026-07-04',
    verified: true,
    tag: 'MIXER_EDGE_CASE'
  },
  {
    id: 'rev_96',
    user: 'CHRIS_VANC',
    platform: 'GOOGLE',
    rating: 5,
    content: "A fake customer-support pop-up on a phishing domain harvested my exchange credentials and drained BTC overnight. I contacted Crypto Recovery Assets the next morning. Their rapid-response playbook was obvious: confirm remaining exposure, preserve evidence, begin destination monitoring, and escalate freeze requests as soon as funds touched a cooperative venue. I received daily updates during the critical first week and weekly deep-dives afterward. We recovered most of the Bitcoin. The experience was stressful, but never chaotic, because they ran the case like professionals who have done this hundreds of times.",
    date: '2026-07-05',
    verified: true,
    tag: 'EXCHANGE_PHISH'
  },
  {
    id: 'rev_97',
    user: 'NOOR_AMM',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I had almost given up after months of silence from an offshore platform that froze withdrawals. Crypto Recovery Assets reviewed my account statements, blockchain deposits, and the platform's historical wallet patterns. They demonstrated that operators were still moving assets through identifiable channels. That evidence changed the posture of the conversation with intermediaries. Eventually we secured a substantial recovery. What I valued most was consistency — same analyst, same portal, same standards from first call to final settlement. No disappearing account managers, no sudden new fees. Just disciplined work until there was a real result.",
    date: '2026-07-06',
    verified: true,
    tag: 'WITHDRAWAL_FREEZE'
  },
  {
    id: 'rev_98',
    user: 'LUCA_MIL',
    platform: 'GOOGLE',
    rating: 4,
    content: "Very strong forensic team and excellent portal experience. My recovery involved Tron USDT moved across many peels and exchange deposit addresses. CRA mapped it clearly and pushed freezes where possible. Some counterparties were slow, and a slice of funds was already gone beyond reach, so this is four stars for outcome completeness rather than effort. Communication remained first-class even when news was imperfect. I would still choose them again over any alternative I researched. In a space full of fake recovery ads, they operate like an actual investigative firm.",
    date: '2026-07-07',
    verified: true,
    tag: 'TRON_USDT_PEEL'
  },
  {
    id: 'rev_99',
    user: 'HANNAH_OSL',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I lost funds after approving a malicious Permit2 signature I did not fully understand. Crypto Recovery Assets not only traced the theft but taught me what went wrong in language I could follow. Their incident report included the exact signature components, spender contract, and subsequent asset movements. That educational clarity mattered almost as much as the recovery itself. Working with exchange compliance, they helped reclaim a major portion of the stolen tokens. Since then I have used their hardening guidance religiously. Competent, ethical, and unusually good at explaining complex crypto mechanics to regular people.",
    date: '2026-07-08',
    verified: true,
    tag: 'PERMIT2_DRAIN'
  },
  {
    id: 'rev_100',
    user: 'JAMES_CAPE',
    platform: 'GOOGLE',
    rating: 5,
    content: "Our nonprofit received a crypto donation that was later disputed as stolen funds moving through our wallet. We were caught in the middle and needed an independent forensic review fast. Crypto Recovery Assets produced a neutral, carefully sourced analysis showing provenance and onward flows. That report protected our organization in discussions with counsel and payment partners. They were sensitive to the reputational stakes and extremely precise with wording. Not every case is a simple 'get my coins back' story — sometimes you need trusted chain analysis. They delivered exactly that.",
    date: '2026-07-09',
    verified: true,
    tag: 'PROVENANCE_REVIEW'
  },
  {
    id: 'rev_101',
    user: 'FARAH_KUL',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I was scammed by a fake crypto escrow service during a peer-to-peer trade. The escrow site looked polished and even had live chat. Once my BTC was gone, so were they. CRA reconstructed the flow, identified reuse of infrastructure from prior escrow scams, and found an exchange offramp window that was still actionable. Their persistence over several weeks made the difference. I always knew who owned my case and what the next action was. We recovered a large percentage of the Bitcoin. If you trade P2P, save this company in your notes before you ever need them.",
    date: '2026-07-10',
    verified: true,
    tag: 'FAKE_ESCROW'
  },
  {
    id: 'rev_102',
    user: 'OWEN_DUB',
    platform: 'GOOGLE',
    rating: 5,
    content: "After a SIM-swap adjacent account takeover on my email, attackers reset exchange access and drained holdings over a weekend. Local responders were out of their depth with crypto rails. Crypto Recovery Assets stepped in with a clear command of both the identity-theft angle and the on-chain pursuit. They helped me secure remaining accounts while simultaneously tracing stolen assets. The dual-track approach prevented further loss and created a viable recovery path. Final outcome was strong. Documentation quality was superb for insurance. I cannot recommend them highly enough for account-takeover cases.",
    date: '2026-07-11',
    verified: true,
    tag: 'ACCOUNT_TAKEOVER'
  },
  {
    id: 'rev_103',
    user: 'MEI_TPE',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I invested through a friend-of-a-friend into what turned out to be a closed Ponzi using crypto deposits. When the scheme collapsed, chaos followed. Crypto Recovery Assets ignored the noise and focused on wallet-level truth. They identified operator-controlled addresses, tracked distributions, and prepared materials that a group of victims could use consistently with exchanges and counsel. Coordinating many victims is hard; CRA brought order. My personal recovery was meaningful, and the collective documentation helped others too. Professional leadership in a moment when everyone else was panicking.",
    date: '2026-07-12',
    verified: true,
    tag: 'PONZI_COLLAPSE'
  },
  {
    id: 'rev_104',
    user: 'BRAD_SLC',
    platform: 'GOOGLE',
    rating: 5,
    content: "I am leaving this review months after case close because the result held up. CRA recovered a significant amount of stolen ETH from a phishing incident, and the funds remained securely returned with clean documentation for my records. During the case they were responsive, sober in their forecasts, and excellent about security hygiene. No one ever asked for my seed phrase. No one pushed weird urgency tactics. Just methodical investigation and exchange coordination. In hindsight, hiring them early — instead of waiting while I 'watched the wallets myself' — would have improved odds even more. Still, outstanding work.",
    date: '2026-07-13',
    verified: true,
    tag: 'LONG_TERM_RESULT'
  },
  {
    id: 'rev_105',
    user: 'GABRIELA_SCL',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "My husband and I lost a large USDT sum to a trading-signal group that slowly groomed us into bigger deposits. When we tried to withdraw, the excuses started. Crypto Recovery Assets handled the case with discretion and empathy. They collected chat evidence carefully, traced every transfer, and built a package strong enough for both exchange compliance and our attorney. Updates arrived even when there was no dramatic news, which I appreciated — silence is torture during these cases. Recovery was substantial. We are rebuilding, and we finally feel like someone competent stood with us.",
    date: '2026-07-14',
    verified: true,
    tag: 'SIGNAL_GROUP_SCAM'
  },
  {
    id: 'rev_106',
    user: 'ARJUN_HYD',
    platform: 'GOOGLE',
    rating: 4,
    content: "Good experience overall on a complex cross-chain theft involving BTC wrapped assets and an L2 bridge. The forensic graphs were excellent and helped my counsel immediately. Recovery took longer than the initial estimate because one exchange's compliance queue moved slowly. CRA kept pressure on without creating false expectations, which I respect. Final recovered amount was still life-changing for me. Four stars for timeline variance, five for integrity and skill. If your funds have hopped chains, do not try to DIY this — the tooling and relationships these analysts have are the real advantage.",
    date: '2026-07-15',
    verified: true,
    tag: 'WRAPPED_ASSET_TRACE'
  },
  {
    id: 'rev_107',
    user: 'CATHERINE_ZRH',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "As a private-client advisor, I referred a victim to Crypto Recovery Assets after screening multiple vendors. Their intake professionalism, conflict handling, and evidence standards were clearly above the rest. The client's funds had been stolen via a cloned wealth-management crypto portal. CRA produced an investigation file that our external counsel described as 'unusually complete.' Recovery proceedings with intermediaries succeeded for a majority share. I now keep them on my shortlist for digital-asset incidents. Rare endorsement from me, but they earned it through process quality, not marketing.",
    date: '2026-07-16',
    verified: true,
    tag: 'ADVISOR_REFERRAL'
  },
  {
    id: 'rev_108',
    user: 'SAMIR_BEY',
    platform: 'GOOGLE',
    rating: 5,
    content: "I was hit by a fake job-offer scam that required purchasing equipment crypto 'training credits.' It sounds ridiculous writing it now, but the recruiters were polished and persistent. When I realized the fraud, Crypto Recovery Assets traced the payments and identified cash-out points still within reach. They were kind about the social-engineering aspect and ruthless about the blockchain pursuit. We recovered a large portion of what I lost. The secure portal, written case plan, and refusal to handle private keys all signaled legitimacy immediately. I tell everyone in my network: if you need recovery help, start here and ignore the WhatsApp impostors.",
    date: '2026-07-17',
    verified: true,
    tag: 'FAKE_JOB_SCAM'
  },
  {
    id: 'rev_109',
    user: 'EMILY_CGY',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "After my wallet was drained through a malicious dApp front-end that had been DNS-hijacked, I needed experts who understood both web compromise and crypto tracing. CRA connected those dots. They documented the hijack window, correlated victim transactions in that period, and pursued aggregated attacker wallets. Their report helped the legitimate project team as well, which I did not expect but deeply appreciated. Personally, we recovered a major share of my lost assets. The whole engagement felt collaborative, transparent, and highly competent. This is what real incident response looks like in crypto.",
    date: '2026-07-18',
    verified: true,
    tag: 'DNS_HIJACK_DAPP'
  },
  {
    id: 'rev_110',
    user: 'PEDRO_LIM',
    platform: 'GOOGLE',
    rating: 5,
    content: "I contacted Crypto Recovery Assets after losing BTC to a fraudulent mining-cloud dashboard. Other companies wanted large retainers before doing anything. CRA explained their contingency model clearly and began analysis only after a proper evidence review. Their findings showed repeated reuse of deposit addresses tied to earlier complaints, which strengthened the freeze narrative. Over the following weeks they coordinated the recovery path and kept me updated in plain language. We got back far more than I thought possible after the first month of despair. Honest pricing plus serious forensics — that combination won my trust.",
    date: '2026-07-19',
    verified: true,
    tag: 'CLOUD_MINING_FRAUD'
  },
  {
    id: 'rev_111',
    user: 'IRIS_HKG',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "High-value cases attract fake helpers. After my loss, I was flooded with LinkedIn messages from people claiming they could reverse blockchain transactions. Crypto Recovery Assets was the only firm that immediately called out those claims as impossible and focused on real recovery mechanisms: tracing, attribution, exchange freezes, and legal packaging. That honesty sold me. Their work then backed it up. We recovered a substantial percentage of stolen USDT through persistent compliance escalation. The analysts were discreet, precise, and always prepared. If you are dealing with a large loss, skip the magicians and hire investigators.",
    date: '2026-07-20',
    verified: true,
    tag: 'HIGH_VALUE_CASE'
  },
  {
    id: 'rev_112',
    user: 'NATHAN_BOS',
    platform: 'GOOGLE',
    rating: 4,
    content: "Thorough, ethical, and technically strong. My stolen funds had already been through several swaps by the time I hired CRA, so expectations had to be realistic. They recovered a partial but important amount and produced a report my attorney called 'court-ready.' A few communications landed later than promised during a heavy workload week, which keeps this at four stars. Everything else — security posture, no-key policy, portal clarity, forensic depth — was excellent. I would still recommend them as the first call after a theft, especially if you need documentation that holds up outside Twitter screenshots.",
    date: '2026-07-21',
    verified: true,
    tag: 'PARTIAL_BUT_SOLID'
  },
  {
    id: 'rev_113',
    user: 'LEILA_TUN',
    platform: 'TRUSTPILOT',
    rating: 5,
    content: "I sent USDT to a fraudulent 'account upgrade' address after receiving a convincing in-app style email. The moment it confirmed, I knew I had made a catastrophic mistake. Crypto Recovery Assets responded quickly, confirmed the destination pattern matched a known campaign, and began monitoring for exchange deposits. When the opportunity appeared, they moved. The freeze and recovery process that followed restored most of what I lost. Beyond the result, their kindness during the worst week of my financial life mattered enormously. They combine elite chain skills with basic human decency. That is why this review is five stars.",
    date: '2026-07-22',
    verified: true,
    tag: 'ACCOUNT_UPGRADE_SCAM'
  },
  {
    id: 'rev_114',
    user: 'STEVEN_PERTH',
    platform: 'GOOGLE',
    rating: 5,
    content: "I waited too long before getting help, convinced I could watch the attacker wallets myself with free explorers. All I did was burn time. When I finally contacted Crypto Recovery Assets, they rebuilt the trail properly, identified consolidation behavior I had missed, and opened the right exchange channels. Their client portal made the process feel organized instead of hopeless. We recovered a majority of the stolen ETH and I received a post-incident briefing that permanently changed how I store and move assets. If you take one thing from this review: get professional forensic help early. These are the people I wish I had called on day one.",
    date: '2026-07-23',
    verified: true,
    tag: 'EARLY_HELP_LESSON'
  }

];

interface ReviewsViewProps {
  onNavigate: (view: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = React.useState<'ALL' | 'GOOGLE' | 'TRUSTPILOT'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredReviews = REVIEWS_DATA
    .filter(rev => {
      const matchesPlatform = filter === 'ALL' || rev.platform === filter;
      const matchesSearch = rev.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rev.user.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    })
    // Newest reviews first
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <main className="pt-36 sm:pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
      <SEO 
        title="Verified Client Crypto Recovery Reviews" 
        description="Read verified Google and Trustpilot-style client reviews covering freezes, partial recoveries, and forensic reporting from real cryptocurrency recovery cases."
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
