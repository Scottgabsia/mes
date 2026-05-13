import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  ChevronRight, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  ArrowUpRight, 
  Fingerprint,
  ShieldAlert
} from 'lucide-react';

export const BlogView = () => {
  const [activeCategory, setActiveCategory] = React.useState('ALL_POSTS');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPost, setSelectedPost] = React.useState<any>(null);
  const [subscriberData, setSubscriberData] = React.useState({ name: '', email: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberData.email || !subscriberData.name) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriberData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setSubscriberData({ name: '', email: '' });
      }
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const posts = [
    {
      id: 1,
      title: "What to do immediately after a crypto hack",
      excerpt: "The first 60 minutes are critical. Learn how to isolate your compromised environment, preserve forensic evidence, and initiate emergency asset recovery procedures to prevent further liquidation.",
      content: `If you're reading this because your wallet was just drained, stop. Do not send more gas fees to the compromised wallet. 

      ### Phase 1: Isolation
      Immediately disconnect your device from the network. If you suspect a browser extension exploit (like a fake MetaMask), remove the extension immediately. Moving your remaining funds to a "Clean Room" environment—a fresh hardware wallet—is the priority.

      ### Phase 2: Evidence Preservation
      Take screenshots of the transaction hash (TxID) on block explorers. These are vital for **crypto asset recovery** and **recovering stolen bitcoin**. Do not delete browser history; forensic analysts use this to identify the phishing vector.

      ### Phase 3: Reporting & Recovery
      Submit your case to our emergency intake. We specialize in **how to get stolen crypto back in 2026** by utilizing immediate exchange blacklisting. Whether you need to **recover crypto from a scammed wallet** or an institutional exploit, the recovery window is closing.

      Key Keywords: Crypto asset recovery, recover stolen bitcoin, ethereum recovery service, how to get stolen crypto back 2026, recover crypto from scammed wallet.`,
      author: "Dr. Aris V.",
      date: "MAY 12, 2026",
      readTime: "06 MIN",
      category: "INTELLIGENCE",
      tags: ["#EMERGENCY", "#RECOVERY_GUIDE", "#ASSET_PROTECTION"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Blockchain Forensics: Tracing Paths with Chainalysis & TRM Labs",
      excerpt: "Go behind the scenes of professional cryptanalysis. We explain how our investigators use industry-leading tools to de-anonymize hackers and trace transaction paths directly to centralized exchanges.",
      content: `The blockchain is public, but the identity of the holder is often hidden behind layers of obfuscation. Our team utilizes the same toolsets as law enforcement—Chainalysis and TRM Labs—to perform deep **blockchain investigations**.

      ### Tracing the Flow
      We track "peeling chains"—small amounts of crypto being systematically removed from a large pile to evade detection. Our **crypto tracing** algorithms identify the common spends that link decentralized burner addresses to KYC-compliant accounts.

      ### Wallet Forensics & Exchange Contact
      The goal of **wallet forensics** is to "trace a bitcoin transaction to an exchange." Once the assets reach a platform like Binance, Coinbase, or Kraken, we work with our legal partners to issue immediate preservation letters. As a **blockchain forensic investigator**, the mission is to make the stolen assets unspendable.

      Key Keywords: Blockchain investigation, crypto tracing, wallet forensics, trace bitcoin transaction to exchange, blockchain forensic investigator.`,
      author: "Sarah Chen",
      date: "MAY 08, 2026",
      readTime: "14 MIN",
      category: "TECHNICAL",
      tags: ["#FORENSICS", "#CHAINALYSIS", "#TRM_LABS"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "The Path to Legal Finality: IC3 and Freezing Orders",
      excerpt: "Navigating the legal nexus of crypto theft. Learn the process of filing reports with the FBI's IC3 and how we secure court-ordered freezing orders against malicious actors globally.",
      content: `When victims ask, "**can the FBI recover stolen crypto?**", the answer is complex. Law enforcement provides the authority, but forensic firms provide the evidence.

      ### Filing with IC3
      Filing a report with the Internet Crime Complaint Center (IC3) is a mandatory first step. It creates a paper trail that **legitimate crypto recovery companies** require to act. 

      ### Obtaining Freezing Orders
      We specialize in the "Legal Tech" of recovery. By combining our forensic reports with jurisdictional expertise, we help victims obtain court-ordered freezing orders. This allows us to lock USDT/USDC in the hacker's wallet by working with the stablecoin issuers. This is the gold standard for **crypto scam recovery**, especially for victims of **pig butchering scams**.

      Key Keywords: Crypto scam recovery, pig butchering scam help, recovery scam signs, can the fbi recover stolen crypto, legitimate crypto recovery companies.`,
      author: "Marcus Thorne",
      date: "MAY 02, 2026",
      readTime: "11 MIN",
      category: "LEGAL",
      tags: ["#IC3", "#FREEZING_ORDER", "#LAW_ENFORCEMENT"],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "Restoring Access: Seed Phrase & Private Key Recovery",
      excerpt: "If you've lost access to your wallet due to a forgotten password or corrupted storage, there is still hope. We explore the technical hurdles of seed phrase restoration and hardware wallet recovery.",
      content: `Technical loss is just as devastating as theft. If you've **forgotten your MetaMask seed phrase** or have a corrupted Ledger device, our secure lab can help.

      ### Seed Phrase Recovery
      We utilize specialized high-computing clusters to perform partial **seed phrase recovery**. If you have 11 out of 12 words, or if the order is scrambled, we can mathematically "brute force" the remaining combinations within a secure, air-gapped environment.

      ### Brute Forcing vs. Forensics
      Unlike malicious tools, our **wallet password recovery** is done in a controlled setting. We do not require you to send us your words; we build the infrastructure for you to finalize the process. Whether it's a **lost private key** or a damaged BIP39 paper backup, we are the bridge back to your wealth.

      Key Keywords: Seed phrase recovery, lost private key, wallet password recovery, forgot MetaMask seed phrase, brute force crypto wallet password.`,
      author: "Elena Rossi",
      date: "APRIL 25, 2026",
      readTime: "09 MIN",
      category: "TECHNICAL",
      tags: ["#SEED_PHRASE", "#WALLET_ACCESS", "#BIP39"],
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      title: "How to Spot a 'Recovery Scam' Helper",
      excerpt: "The most dangerous time for a victim is immediately after the loss. Learn the red flags of 'recovery scammers' who demand upfront fees and promise impossible results via Instagram or Telegram.",
      content: `The "Secondary Victimization" market is a billion-dollar industry. Scammers lurk in comment sections and Telegram groups, claiming they can "hack the hacker."

      ### The Upfront Fee Red Flag
      If a company asks for an "activation fee," "tax fee," or "software license fee" before showing you the recovered assets, it is a scam. **Legitimate crypto recovery companies** operate on a clear, professional contract structure.

      ### The "Impossible Guarantee"
      Blockchain finality is real. No one can simply "reverse" a Bitcoin transaction after it's confirmed. Recovery happens through legal freezes and exchange cooperation. If you see **recovery scam signs** like "100% Guaranteed Recovery in 2 Hours," report the operator. Stay safe and only work with verified, insured forensic firms.

      Key Keywords: Recovery scam signs, pig butchering scam help, fake recovery agents, crypto fraud protection, verified recovery.`,
      author: "Dr. Aris V.",
      date: "APRIL 18, 2026",
      readTime: "07 MIN",
      category: "INTELLIGENCE",
      tags: ["#SCAM_ALERT", "#SAFETY_FIRST", "#SECURE_RECOVERY"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 6,
      title: "Operation Gilded Cage: A $12M Pig Butchering Recovery",
      excerpt: "A deep dive into our most successful recovery of 2026. See how we mapped a cross-border syndicate across three continents to return life savings to victims of a sophisticated romance scam.",
      content: `Pig butchering scams are the most emotionally and financially devastating threats in the space. "Operation Gilded Cage" involved a coordinated response against a syndicate operating out of a high-security compound in Southeast Asia.

      ### The Forensic Breakthrough
      The victim was led to believe they were trading on a legitimate DEX. Our **blockchain investigation** revealed that the "DEX" was a custom-built shadow application that only simulated trades. By using **crypto tracing**, we identified the funnel wallets through which the group moved $12M in USDT.

      ### Recovery & Repatriation
      We utilized a combination of **wallet forensics** and legal pressure on regional exchanges. By proving the connection between the theft and the exchange accounts, we helped the victims **recover crypto from a scammed wallet** that was previously thought to be unreachable. This case proves that with the right **blockchain forensic investigator**, the "untraceable" becomes traceable.

      Key Keywords: Pig butchering scam help, crypto scam recovery, blockchain investigation, recover crypto from scammed wallet, crypto asset recovery.`,
      author: "Marcus Thorne",
      date: "APRIL 10, 2026",
      readTime: "18 MIN",
      category: "CASE_STUDIES",
      tags: ["#ROMANCE_SCAM", "#USDT_RECOVERY", "#SYNDICATE_MAPPING"],
      image: "https://images.unsplash.com/photo-1621416848440-2369dadad157?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 7,
      title: "Hardware Wallet Forensics: When the Chip Fails",
      excerpt: "Exploring the physical layer of crypto security. What happens when your Ledger or Trezor stops responding? Learn about our clean-room techniques for raw data extraction and chip-level recovery.",
      content: `Hardware wallets are the gold standard for security, but they are not immune to hardware failure. If you've **forgotten your MetaMask seed phrase** and your cold storage backup is damaged, raw data extraction may be the only path.

      ### Clean-Room Signal Analysis
      Our lab utilizes non-invasive microscopy to analyze the secure element of damaged hardware wallets. We specialize in **seed phrase recovery** for devices that have suffered water damage, physical crushing, or component decay.

      ### Recovering the Unrecoverable
      This isn't just about **forgotten MetaMask seed phrases**; it's about the physics of storage. We can often reconstruct the encrypted entropy from a partially functional microcontroller. If you are struggling with a **lost private key** due to hardware failure, do not attempt a DIY repair. Professional **wallet password recovery** at the hardware level requires laboratory conditions to avoid permanent data loss.

      Key Keywords: Seed phrase recovery, hardware wallet repair, lost private key, forgot MetaMask seed phrase, recover crypto from scammed wallet.`,
      author: "Elena Rossi",
      date: "MARCH 28, 2026",
      readTime: "12 MIN",
      category: "TECHNICAL",
      tags: ["#HARDWARE_SECURITY", "#COLD_STORAGE", "#PHYSICAL_FORENSICS"],
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 8,
      title: "Is the FBI Actually Recovering Stolen Crypto?",
      excerpt: "Current trends in law enforcement participation. We analyze recent DoJ seizures and explain how private firms like ours bridge the gap between individual victims and federal agencies.",
      content: `One of the most frequent questions we receive is, "**can the FBI recover stolen crypto?**" The answer lies in the partnership between private sector forensics and public sector authority.

      ### The Federal Scope
      Federal agencies typically only intervene in cases where the loss exceeds $500,000 or involves state-sponsored actors. For individual victims, **legitimate crypto recovery companies** act as the primary investigators who "package" the evidence for the FBI's IC3.

      ### How to Get Stolen Crypto Back in 2026
      Success in 2026 requires a "hybrid" approach. We perform the **blockchain investigation** and **crypto tracing** locally, ensuring that by the time a report reaches a desk, the assets are already identified and potentially frozen at the exchange level. This proactive stance is how we achieve **ethereum recovery service** success for our clients.

      Key Keywords: Can the fbi recover stolen crypto, legitimate crypto recovery companies, how to get stolen crypto back 2026, recover stolen bitcoin, asset repatriation.`,
      author: "Dr. Aris V.",
      date: "MARCH 15, 2026",
      readTime: "10 MIN",
      category: "LEGAL",
      tags: ["#FBI", "#IC3", "#GOV_LIAISON"],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const categories = ['ALL_POSTS', 'TECHNICAL', 'LEGAL', 'INTELLIGENCE', 'CASE_STUDIES'];

  const filteredPosts = posts.filter(post => 
    (activeCategory === 'ALL_POSTS' || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedPost) {
    return (
      <main className="pt-24 sm:pt-32 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1000px] mx-auto min-h-screen relative z-10 transition-all">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-white font-mono text-[10px] uppercase tracking-widest mb-12 transition-colors"
        >
          <ChevronRight className="rotate-180 text-blue-500" size={14} /> BACK_TO_INTEL_FEED
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest">
              {selectedPost.category}
            </span>
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <Clock size={12} /> {selectedPost.readTime} READ
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic leading-[1.1] mb-10 font-manrope">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-8 py-8 border-y border-white/5 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <User size={16} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">{selectedPost.author}</span>
                <span className="text-[9px] text-slate-500 font-mono uppercase">SENIOR_ANALYST</span>
              </div>
            </div>
            <div className="text-slate-500 font-mono text-[10px] uppercase">
              DECRYPTED: {selectedPost.date}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/5 mb-16 aspect-video">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-75" 
            />
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="text-slate-300 font-manrope text-lg leading-relaxed space-y-8 whitespace-pre-line">
              {selectedPost.content}
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-6">RECOVERY_KEYWORDS & METADATA</h3>
            <div className="flex flex-wrap gap-3">
              {selectedPost.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-blue-400 font-mono text-[10px] uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-24 sm:pt-32 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen relative z-10">
      {/* Hero Header */}
      <div className="relative mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Newspaper size={20} />
            </div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-blue-500">
              INTEL_FEED_v4.2.0
            </span>
          </div>
          <h1 className="text-[12vw] sm:text-[80px] font-black tracking-tighter text-white uppercase font-manrope leading-[0.85] mb-8">
            Forensic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-manrope max-w-2xl text-base sm:text-lg leading-relaxed">
            Unveiling the clandestine patterns of the blockchain. In-depth analysis of emerging digital threats, global recovery methodologies, and the ever-evolving landscape of security.
          </p>
        </div>

        <div className="hidden lg:block w-64 h-64 border border-white/5 rounded-3xl relative p-6 overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <Fingerprint className="text-blue-500/50" size={40} />
            <div>
              <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">NODE_STATUS</p>
              <p className="text-xs font-mono text-emerald-500 font-bold tracking-widest">ACTIVE_CONNECTED</p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[6px] text-blue-400 p-2 break-all overflow-hidden leading-none">
            {Array.from({length: 200}).map((_, i) => (
              <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="sticky top-20 z-30 bg-[#020408]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 sm:p-4 mb-16 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto p-1">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80 ml-auto group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_OPERATIONAL_INTEL..." 
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[10px] font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 group-hover:border-white/20 transition-all uppercase"
          />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 mb-32">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              layout
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedPost(post)}
              transition={{ 
                duration: 0.4, 
                delay: idx * 0.1,
                layout: { duration: 0.3 }
              }}
              className={`group relative flex flex-col glass-panel border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 cursor-pointer ${
                idx === 0 ? 'xl:col-span-8' : 'xl:col-span-4'
              }`}
            >
              {/* Card Meta Header */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={10} className="text-blue-500" />
                  {post.category}
                </span>
                <span className="bg-blue-600/90 text-white px-2 py-1.5 rounded-lg font-mono text-[9px] font-bold">
                  {post.readTime}
                </span>
              </div>

              {/* Image Section */}
              <div className={`relative overflow-hidden ${idx === 0 ? 'h-[300px] sm:h-[450px]' : 'h-[250px]'}`}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/20 to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-8 sm:p-10 flex-1 flex flex-col px-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                    <Calendar size={12} className="text-blue-500/50" /> {post.date}
                  </div>
                  <div className="flex-1 border-b border-white/5 h-[1px]"></div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                    <User size={12} className="text-blue-500/50" /> {post.author}
                  </div>
                </div>

                <h2 className={`font-manrope font-black text-white uppercase italic leading-[1.1] mb-6 group-hover:text-blue-400 transition-colors ${
                  idx === 0 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'
                }`}>
                  {post.title}
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed font-manrope mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer and Tags */}
                <div className="mt-auto pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-blue-400 opacity-60 uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="flex items-center gap-4 group/btn">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white group-hover/btn:text-blue-400 transition-colors">
                      DECRYPT_FILE
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:border-blue-600 transition-all">
                      <ChevronRight size={16} className="text-white" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.02] transition-colors pointer-events-none"></div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Professional CTA Section */}
      <section className="relative rounded-[40px] overflow-hidden mb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 px-8 py-20 sm:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-manrope uppercase italic mb-6 leading-none">
              Stay Connected to <br /> the Intelligence Stream
            </h2>
            <p className="text-blue-100/80 font-manrope text-base sm:text-lg">
              Receive critical security advisories, breakthrough forensic methodologies, and case study reports directly to your secure node.
            </p>
          </div>
          
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <ArrowUpRight size={32} />
                </div>
                <h3 className="text-xl font-black text-white uppercase font-manrope mb-2">ACCESS_GRANTED</h3>
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Your node has been added to the stream.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  required
                  placeholder="OPERATOR_NAME" 
                  value={subscriberData.name}
                  onChange={(e) => setSubscriberData({ ...subscriberData, name: e.target.value })}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-white/50 transition-all"
                />
                <input 
                  type="email" 
                  required
                  placeholder="OPERATOR@SECURE_NODE.COM" 
                  value={subscriberData.email}
                  onChange={(e) => setSubscriberData({ ...subscriberData, email: e.target.value })}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-white/50 transition-all"
                />
                <button 
                  disabled={submitting}
                  className="w-full bg-white text-slate-950 hover:bg-blue-50 px-8 py-4 rounded-2xl font-mono text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'INITIALIZING...' : 'SUBSCRIBE_INTEL'}
                </button>
              </form>
            )}
            <p className="text-[9px] font-mono text-blue-200/50 uppercase tracking-widest mt-6">
              Encryption Enabled • Zero-Log Policy
            </p>
          </div>
        </div>
      </section>

      {/* Global Intelligence Keywords */}
      <div className="mb-32 border-t border-white/5 pt-16">
        <h3 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-8 text-center sm:text-left">CORE_RECOVERY_KEYWORDS</h3>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 opacity-30 hover:opacity-60 transition-opacity duration-700">
          {[
            'CRYPTO_ASSET_RECOVERY', 'RECOVER_STOLEN_BITCOIN', 'ETHEREUM_RECOVERY_SERVICE', 
            'STOLEN_CRYPTO_BACK_2026', 'RECOVER_SCAMMED_WALLET', 'SEED_PHRASE_RECOVERY',
            'LOST_PRIVATE_KEY', 'WALLET_PASSWORD_RECOVERY', 'METAMASK_SEED_PHRASE',
            'BRUTE_FORCE_WALLET', 'BLOCKCHAIN_INVESTIGATION', 'CRYPTO_TRACING',
            'WALLET_FORENSICS', 'TRACE_BTC_TO_EXCHANGE', 'FORENSIC_INVESTIGATOR',
            'CRYPTO_SCAM_RECOVERY', 'PIG_BUTCHERING_HELP', 'RECOVERY_SCAM_SIGNS',
            'FBI_CRYPTO_RECOVERY', 'LEGITIMATE_RECOVERY_COMPANIES'
          ].map(keyword => (
            <span key={keyword} className="font-mono text-[9px] sm:text-[10px] text-white uppercase tracking-widest">{keyword}</span>
          ))}
        </div>
      </div>

      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-white/5"></div>
        <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-white/5"></div>
      </div>
    </main>
  );
};
