import React from 'react';
import { 
  Shield, 
  Globe, 
  Users, 
  Zap, 
  Award, 
  Lock,
  Cpu,
  Target,
  BadgeCheck
} from 'lucide-react';
import { ReviewsSection } from '../components/ReviewsSection';

interface AboutViewProps {
  onContactClick: () => void;
  onNavigate?: (view: string) => void;
}

export const AboutView = ({ onContactClick, onNavigate }: AboutViewProps) => {
  return (
    <div className="pt-24 sm:pt-40 pb-32 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <div className="mb-12 sm:mb-24">
        <h2 className="text-slate-500 font-fira text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 uppercase">
          // THE ORGANIZATION
        </h2>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-sans font-bold tracking-tight text-white mb-6 sm:mb-8 border-l-4 border-primary pl-4 sm:pl-8">
          DIGITAL ASSETS FORENSICS <br/>
          <span className="text-primary italic text-2xl sm:text-4xl md:text-5xl">CRYPTO RECOVERY AGENCY</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-xl max-w-3xl leading-relaxed font-light">
          We are a global network of forensic analysts, blockchain engineers, and legal experts dedicated to the integrity of the digital economy. Founded on the principle that code is law, but justice is human.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-20 sm:mb-32">
        <div className="glass-panel p-8 sm:p-12 border-primary/20">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 sm:mb-8">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Our Mission</h3>
          <p className="text-slate-400 leading-relaxed text-base sm:text-lg italic">
            "To restore confidence in decentralized finance by providing the most advanced recovery infrastructure and investigative expertise available to private and institutional entities."
          </p>
        </div>
        <div className="glass-panel p-8 sm:p-12 border-secondary-fixed/20">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed mb-6 sm:mb-8">
            <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Global Reach</h3>
          <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
            Operating across 45 jurisdictions with real-time links to major exchange compliance units and international law enforcement agencies including Interpol and Europol.
          </p>
        </div>
      </div>

      {/* Stats Counter (Design Only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 sm:mb-32">
        {[
          { label: 'ASSETS TRACED', value: '$2.4B+' },
          { label: 'CASES SOLVED', value: '14,800+' },
          { label: 'NODES MONITORED', value: '1.2M' },
          { label: 'LEGAL PARTNERS', value: '140+' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 sm:p-8 text-center">
            <p className="text-slate-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-xl sm:text-3xl font-fira font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance-Based Recovery Section */}
      <div className="mb-20 sm:mb-32">
        <div className="glass-panel p-8 sm:p-16 border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
            <BadgeCheck className="w-64 h-64 text-emerald-500" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 tracking-tighter uppercase">
              RECOVERY-FIRST <span className="text-emerald-400">FEE MODEL</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <p className="text-slate-300 text-base sm:text-xl leading-relaxed font-light mb-6">
                  The primary reason clients choose <span className="text-white font-bold">DIGITAL ASSETS FORENSICS</span> is our alignment of interests. Unlike traditional law firms or technical consultancies, we take all the operational risk.
                </p>
                <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 sm:p-6">
                  <p className="text-emerald-300 font-bold italic text-sm sm:text-base">"We earn nothing unless you recover everything."</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'NO UPFRONT RETAINER', desc: 'Starting a digital forensic investigation requires zero initial capital from your side.' },
                  { title: 'NO HIDDEN CONSULTATION FEES', desc: 'Initial triage, case assessment, and strategy development are strictly pro-bono.' },
                  { title: 'PERFORMANCE CONTINGENCY', desc: 'Our fee is a pre-agreed percentage of the successfully returned assets, deducted only after they are back in your wallet.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-none pt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-1">{item.title}</h5>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="mb-32">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-white/10" />
          <h3 className="text-slate-500 font-bold text-sm tracking-[0.3em] uppercase">Core Competencies</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: "Proprietary Triage AI",
              desc: "Our neural networks scan mempools and block explorers in real-time, identifying malicious patterns before the txs even finalize."
            },
            {
              icon: Target,
              title: "Precision Tracing",
              desc: "Deep-level hop analysis that tracks assets through cross-chain bridges, mixers, and obfuscation layers with 99.8% accuracy."
            },
            {
              icon: Lock,
              title: "Institutional Custody",
              desc: "Providing military-grade multisig recovery environments for high-net-worth individuals and corporate treasuries."
            }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-all duration-500 bg-slate-900/40 text-left">
              <item.icon className="w-12 h-12 text-primary/40 group-hover:text-primary mb-6 transition-colors" />
              <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-tighter">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight underline decoration-primary decoration-4 underline-offset-8">
              GUIDED BY <br/>
              UNWAVERING <br/>
              PRINCIPLES
            </h2>
            <p className="text-slate-500 text-sm font-fira uppercase tracking-widest">
              // NO COMPROMISE. NO RETREAT.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'RADICAL TRANSPARENCY', desc: 'Every step of our investigation is logged on a privateimmutable ledger, accessible to the client in real-time.' },
              { title: 'ABSOLUTE CONFIDENTIALITY', desc: 'Operating under strict NDAs and utilizing air-gapped environments for sensitive data handling.' },
              { title: 'UNRELENTING INNOVATION', desc: 'We don\'t just follow the technology; we build the tools that the industry uses for recovery.' },
              { title: 'ETHICAL ENFORCEMENT', desc: 'All recovery operations are conducted within the strict bounds of international cyber-law.' },
            ].map((value, i) => (
              <div key={i} className="border-l-2 border-white/5 pl-8 hover:border-primary/50 transition-colors py-4">
                <h4 className="text-white font-bold mb-3 tracking-widest text-xs">{value.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Methodology */}
      <div className="mb-20 sm:mb-32">
        <div className="glass-panel p-8 sm:p-16 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
            <Zap className="w-64 h-64 text-primary" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 uppercase tracking-[0.1em] sm:tracking-[0.2em] border-b border-white/10 pb-6 sm:pb-8 flex items-center gap-4">
              <span className="text-primary font-fira">01 //</span> THE PROTOCOL X METHODOLOGY
            </h2>
            
            <div className="space-y-8 sm:space-y-12 max-w-4xl">
              {[
                { step: 'RAPID INTAKE', content: 'Immediate triage within 15 minutes of contact. Assets are flagged across 140+ exchanges globally.' },
                { step: 'DEEP-SURFACE TRACING', content: 'Our agents utilize non-public datasets and dark-web monitoring to identify the human actors behind the wallet addresses.' },
                { step: 'LEGAL NEXUS ENFORCEMENT', content: 'Simultaneous filing of Mareva Injunctions and Law Enforcement notifications through our integrated legal partners.' },
                { step: 'ASSET SECURED RECOVERY', content: 'Coordinated retrieval through exchange compliance units or direct negotiation with tracked entities.' }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 sm:gap-12 group">
                  <div className="flex-none">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary font-fira text-xs sm:text-sm group-hover:bg-primary group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-lg sm:text-xl mb-2 tracking-tight">{item.step}</h5>
                    <p className="text-slate-500 leading-relaxed italic text-sm sm:text-base">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Infrastructure Overlay */}
      <div className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-3 text-secondary-fixed mb-6 font-fira text-xs font-bold uppercase tracking-widest">
            <Lock className="w-4 h-4" /> SECURE INFRASTRUCTURE
          </div>
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
            MILITARY-GRADE <br/>
            OPERATIONAL SECURITY
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Our data centers are sovereign, air-gapped facilities located in neutral jurisdictions. Every investigation is sandboxed to prevent lateral data leakage.
          </p>
          <ul className="space-y-4">
            {['Quantum-Resistant Encryption', 'HSM-Backed Key Management', '24/7 Physical Perimeter Security', 'Multi-Jurisdictional Data Redundancy'].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-medium tracking-wide text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-video glass-panel rounded-2xl border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="text-center z-20">
            <div className="flex justify-center mb-4">
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1 h-8 bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
            <p className="text-slate-500 font-fira text-[10px] tracking-widest">ENCRYPTED FEED ACTIVE</p>
          </div>
          {/* Animated Background Placeholder */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="h-px w-full bg-primary/30 absolute top-1/4 animate-scan" />
             <div className="h-px w-full bg-primary/30 absolute top-2/4 animate-scan-delayed" />
             <div className="h-px w-full bg-primary/30 absolute top-3/4 animate-scan-more-delayed" />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-panel p-8 sm:p-16 text-center bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Ready to Secure Your Future?</h3>
        <p className="text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Whether you are an institution requiring a full security audit or an individual seeking asset recovery, our agents are standing by.
        </p>
        <button 
          onClick={onContactClick}
          className="bg-primary text-white w-full sm:w-auto px-12 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer"
        >
          Begin Consultation
        </button>
      </div>
      
      {/* Reviews Section */}
      <ReviewsSection onSeeMore={() => onNavigate && onNavigate('reviews')} />
    </div>
  );
};
