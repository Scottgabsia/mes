import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants';

export const PrivacyPolicyView = () => {
  return (
    <div className="pt-36 sm:pt-40 pb-32 px-6 md:px-12 max-w-[1200px] mx-auto scroll-mt-28">
      <div className="mb-16">
        <h2 className="text-primary font-fira text-xs font-bold tracking-[0.4em] mb-4 uppercase">
          // LEGAL PROTOCOL
        </h2>
        <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-white mb-8">
          PRIVACY <span className="text-primary italic">POLICY</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          Last Updated: May 2026. This document outlines how Crypto Recovery Assets Agency ("the Agency", "we", "us") handles data during high-stakes recovery operations.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <Lock className="text-primary w-6 h-6" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">1. Data Sovereignty</h3>
          </div>
          <div className="glass-panel p-8 space-y-4">
            <p className="text-slate-300 leading-relaxed">
              We operate on the principle of data minimality. We only collect information strictly necessary for the tracing and recovery of digital assets. Unlike standard fintech platforms, your data is stored in air-gapped, sovereign infrastructure in neutral jurisdictions.
            </p>
            <p className="text-slate-400 text-sm italic">
              * Note: For cross-border legal enforcement, data may be encrypted and stored across multiple jurisdictions to prevent single-point seizure.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <Database className="text-primary w-6 h-6" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">2. Information We Collect</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 border-l-2 border-primary/30">
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Case Metadata</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• Transaction hashes and wallet addresses</li>
                <li>• Communication logs with suspected entities</li>
                <li>• Evidence of ownership (CEX logs, signed messages)</li>
              </ul>
            </div>
            <div className="glass-panel p-8 border-l-2 border-primary/30">
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Client Identity</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• KYC/AML verified documentation</li>
                <li>• Secure contact vector (PGP/Signal/Session)</li>
                <li>• Legal representation details if applicable</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <Eye className="text-primary w-6 h-6" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">3. Use of Intelligence</h3>
          </div>
          <div className="glass-panel p-8">
            <p className="text-slate-300 leading-relaxed mb-4">
              Intelligence gathered during investigations is used exclusively for asset recovery and legal enforcement. We do not sell analytics or data to third-party marketing firms.
            </p>
            <div className="bg-slate-900/50 p-6 rounded-lg border border-white/5">
              <p className="text-slate-400 text-sm">
                Disclosure is strictly limited to:
                <br/> - Integrated Legal Partners (under NDA)
                <br/> - Exchange Compliance Units (for freezing operations)
                <br/> - Law Enforcement (via Interpol/Europol nexus when required by treaty)
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="text-primary w-6 h-6" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">4. Security Infrastructure</h3>
          </div>
          <div className="glass-panel p-10 border-emerald-500/20 bg-emerald-500/5">
            <p className="text-slate-200 font-medium mb-4">Our security protocols exceed military standards (AES-256-GCM + Quantum Readiness).</p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Clients are issued a unique 'Vault ID' for all communications. We never ask for private keys, seed phrases, or sensitive passwords via non-encrypted channels. All staff undergo rigorous multi-step background checks and security clearance assessments.
            </p>
          </div>
        </section>

        <div className="pt-16 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs font-fira uppercase tracking-widest mb-8">Questions regarding data handled?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Privacy inquiry — Crypto Recovery Assets')}&body=${encodeURIComponent('Please describe your privacy question.\n\n')}`}
            className="inline-block border border-primary/30 text-primary px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer"
          >
            Contact Privacy Officer
          </a>
          <p className="text-slate-600 text-[10px] font-mono mt-4 uppercase tracking-wider">
            {CONTACT_EMAIL}
          </p>
        </div>
      </div>
    </div>
  );
};
