import React from 'react';
import { motion } from 'motion/react';
import {
  BadgeCheck,
  Building2,
  FileCheck,
  Gavel,
  Handshake,
  Landmark,
  Scale,
  Shield,
  ShieldCheck,
} from 'lucide-react';

type NavView =
  | 'iso27001'
  | 'soc2'
  | 'gdpr'
  | 'amlkyc'
  | 'about'
  | 'legalEnforcement';

interface CertificationsPartnershipsSectionProps {
  onNavigate: (view: NavView | string) => void;
}

const CERTIFICATIONS = [
  {
    id: 'iso27001',
    label: 'ISO/IEC 27001',
    subtitle: 'Information Security Management',
    code: 'ISMS-7729-QX',
    icon: BadgeCheck,
    accent: 'text-blue-400',
    border: 'border-blue-500/40',
    bg: 'from-blue-600/10',
    navigable: true,
  },
  {
    id: 'soc2',
    label: 'SOC 2 Type II',
    subtitle: 'Trust Services Criteria',
    code: 'AICPA-TSC-12M',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'from-emerald-600/10',
    navigable: true,
  },
  {
    id: 'gdpr',
    label: 'GDPR',
    subtitle: 'EU Data Protection',
    code: 'PRIV-EU-2016',
    icon: Gavel,
    accent: 'text-indigo-400',
    border: 'border-indigo-500/40',
    bg: 'from-indigo-600/10',
    navigable: true,
  },
  {
    id: 'amlkyc',
    label: 'AML / KYC',
    subtitle: 'Compliance Framework',
    code: 'FIN-TRACE-AML',
    icon: Scale,
    accent: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bg: 'from-cyan-600/10',
    navigable: true,
  },
  {
    id: null,
    label: 'NIST 800-53',
    subtitle: 'Security Controls',
    code: 'FED_CTRL_STDS',
    icon: FileCheck,
    accent: 'text-slate-300',
    border: 'border-white/20',
    bg: 'from-slate-600/10',
    navigable: false,
  },
  {
    id: null,
    label: 'FinCEN MSB',
    subtitle: 'Regulatory Alignment',
    code: 'MSB_REG_409',
    icon: Landmark,
    accent: 'text-blue-500',
    border: 'border-blue-600/40',
    bg: 'from-blue-600/10',
    navigable: false,
  },
] as const;

const PARTNERSHIP_CATEGORIES = [
  {
    title: 'VASP & Exchange Liaison',
    description:
      'Preservation letters and recovery coordination with major centralized exchanges worldwide.',
    partners: ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Bitfinex'],
    icon: Building2,
    color: 'text-blue-400',
  },
  {
    title: 'Blockchain Intelligence',
    description:
      'Enterprise-grade tracing, clustering, and attribution across multi-chain environments.',
    partners: ['Chainalysis', 'Elliptic', 'TRM Labs', 'CipherTrace'],
    icon: Shield,
    color: 'text-cyan-400',
  },
  {
    title: 'Legal & Compliance',
    description:
      'Cross-border counsel for asset freezes, Mareva injunctions, and civil recovery actions.',
    partners: ['140+ Law Firms', 'EU Counsel', 'US Federal Liaison', 'APAC Desk'],
    icon: Scale,
    color: 'text-indigo-400',
  },
  {
    title: 'Law Enforcement',
    description:
      'Structured reporting and evidence packages aligned with IC3, Europol, and national FIUs.',
    partners: ['INTERPOL', 'FBI IC3', 'NCA', 'Europol EC3'],
    icon: Handshake,
    color: 'text-emerald-400',
  },
];

export const CertificationsPartnershipsSection: React.FC<
  CertificationsPartnershipsSectionProps
> = ({ onNavigate }) => {
  return (
    <section className="mb-stack-lg space-y-12 sm:space-y-16">
      <div className="text-center max-w-3xl mx-auto px-2">
        <p className="text-[10px] font-fira text-blue-400 uppercase tracking-[0.35em] mb-3">
          // TRUST_LAYER_VERIFIED
        </p>
        <h2 className="text-3xl sm:text-4xl font-manrope font-black text-white uppercase tracking-tight">
          Certifications &{' '}
          <span className="text-blue-500">Strategic Partnerships</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-manrope">
          Audited security standards and an institutional partner network power every
          recovery case—from exchange liaison to courtroom-ready forensic exports.
        </p>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              Compliance Certifications
            </h3>
            <p className="text-slate-500 font-fira text-[10px] uppercase tracking-widest mt-2">
              Independently audited controls // click to view standards
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-[10px] font-fira text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors cursor-pointer"
          >
            View agency credentials →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CERTIFICATIONS.map((cert, idx) => {
            const Icon = cert.icon;
            const inner = (
              <>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.bg} to-transparent border ${cert.border} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${cert.accent}`} />
                </div>
                <p className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                  {cert.label}
                </p>
                <p className="text-slate-500 text-[10px] sm:text-xs mt-1 font-manrope">
                  {cert.subtitle}
                </p>
                <p className="text-[9px] font-fira text-slate-600 uppercase tracking-widest mt-3">
                  {cert.code}
                </p>
                {cert.navigable && (
                  <span className="inline-block mt-4 text-[9px] font-fira text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View standard →
                  </span>
                )}
              </>
            );

            if (cert.navigable && cert.id) {
              return (
                <motion.button
                  key={cert.label}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onNavigate(cert.id!)}
                  className={`group glass-panel p-5 sm:p-6 rounded-sm text-left border ${cert.border} hover:bg-white/5 hover:border-blue-500/50 transition-all cursor-pointer w-full`}
                >
                  {inner}
                </motion.button>
              );
            }

            return (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-panel p-5 sm:p-6 rounded-sm border ${cert.border}`}
              >
                {inner}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-sm border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                Institutional Partnerships
              </h3>
              <p className="text-slate-500 font-fira text-[10px] uppercase tracking-widest mt-2">
                Global reclamation network // vasp & legal nexus
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('legalEnforcement')}
              className="text-[10px] font-fira text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Law enforcement desk →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {PARTNERSHIP_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-5 sm:p-6 rounded-xl border border-white/5 bg-slate-950/40 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-manrope font-black text-white uppercase tracking-wide">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.partners.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-fira text-slate-300 uppercase tracking-wider"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 pt-6 border-t border-white/5 text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center leading-relaxed">
            Partner names reflect categories of institutions we coordinate with during
            active recovery matters. No endorsement implied.
          </p>
        </div>
      </div>
    </section>
  );
};
