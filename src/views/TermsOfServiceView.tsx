import React from 'react';
import { FileText, Hammer, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TermsOfServiceView = () => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div className="mb-16">
        <h2 className="text-primary font-fira text-xs font-bold tracking-[0.4em] mb-4 uppercase">
          // BINDING AGREEMENT
        </h2>
        <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-white mb-8">
          TERMS OF <span className="text-primary italic">SERVICE</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          By utilizing the infrastructure of Crypto Recovery Assets Agency, you enter into a legally binding performance-based contract.
        </p>
      </div>

      <div className="space-y-12">
        <section className="glass-panel p-10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">1. Performance-Based Engagement</h3>
              <p className="text-slate-400 leading-relaxed">
                As per our Zero-Upfront policy, the Agency commits its technical and legal resources to your case with the understanding that a success fee (as specified in the Case Engagement Letter) is payable strictly upon the successful recovery of funds to a domicile under your control.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-10 border-l-4 border-amber-500/50">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">2. No Guarantee of Outcome</h3>
              <p className="text-slate-400 leading-relaxed">
                Blockchain forensics is a reactive science. While our success rate is 94.2%, we do not guarantee the recovery of any assets. Factors such as asset liquidation to non-kyc exchanges or conversion to privacy coins may impede recovery efforts.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">3. Client Obligations</h3>
              <p className="text-slate-400 leading-relaxed">
                Clients must provide truthful and exhaustive information regarding the loss. Failure to disclose relevant facts (such as previous knowledge of the attacker) may result in immediate termination of the case and potential legal liability for wasted forensic resources.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">4. Confidentiality & Non-Interference</h3>
              <p className="text-slate-400 leading-relaxed">
                Clients must not attempt to contact suspects or perform independent recovery efforts while the Agency's operations are active. Such actions can compromise deep-cover tracking operations and lead to asset destruction.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-slate-900/80 p-8 border border-white/5 rounded-xl">
          <h4 className="text-xs font-fira text-slate-500 uppercase tracking-widest mb-4">Jurisdiction notice</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            These terms are governed by the laws of International Maritime Jurisdiction and Electronic Commerce Treaties. Any disputes shall be settled through the Agency's private arbitration panel.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-slate-500 text-xs mb-4 uppercase tracking-widest italic">Proceeding with a case lookup or consultation implies full acceptance of these terms.</p>
        </div>
      </div>
    </div>
  );
};
