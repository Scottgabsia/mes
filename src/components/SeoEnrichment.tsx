import React from "react";
import { SITE_URL } from "../constants";

type LinkItem = { label: string; href: string };

const linkClass =
  "text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-500/40";

function Links({ items }: { items: LinkItem[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm text-slate-400">
      {items.map((item) => (
        <li key={item.href}>
          <a className={linkClass} href={item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Long-form SEO copy for thin service / utility pages */
export function SeoEnrichment({
  page,
}: {
  page:
    | "traceability"
    | "recovery"
    | "legal"
    | "risk"
    | "tools"
    | "intelligence"
    | "case-lookup"
    | "contact"
    | "privacy"
    | "terms"
    | "iso27001"
    | "soc2"
    | "gdpr"
    | "amlkyc";
}) {
  const blocks: Record<string, React.ReactNode> = {
    traceability: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          How Blockchain Traceability Supports Crypto Recovery
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Chain traceability is the foundation of professional cryptocurrency recovery. When Bitcoin, Ethereum, USDT, or other assets
          move after a scam or hack, investigators reconstruct hop-by-hop paths across wallets, bridges, mixers, and exchange deposit
          addresses. Crypto Recovery Assets maps those flows into compliance-ready packages that help exchanges evaluate freeze and
          preservation requests.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Our analysts combine clustering heuristics, entity labeling, and cross-chain visibility so victims and counsel understand
          what is confirmed versus probable. That honesty matters: thin screenshots from a block explorer rarely move a VASP compliance
          team, while a structured forensic narrative can.
        </p>
        <p className="text-slate-400 leading-relaxed">
          If funds may still sit on a centralized venue, early tracing improves odds. Start intake, preserve TxIDs, and review related
          resources below.
        </p>
        <Links
          items={[
            { label: "Start confidential case intake", href: "/contact" },
            { label: "Exchange recovery & VASP liaison", href: "/recovery" },
            { label: "Legal & enforcement support", href: "/legal" },
            { label: "How blockchain forensics works (blog)", href: "/blog/how-blockchain-forensics-trace-stolen-crypto-across-wallets" },
            { label: "Victim FAQ", href: "/faq" },
          ]}
        />
      </>
    ),
    recovery: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Exchange Recovery: Freezes, Compliance, and Realistic Outcomes
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Many successful crypto recoveries depend on centralized exchanges and other VASPs where stolen assets land before cash-out.
          Exchange recovery is not a magic reversal of blockchain transfers—it is coordinated evidence, timely preservation requests,
          and clear ownership documentation that compliance teams can act on.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Crypto Recovery Assets prepares forensic packets that identify deposit addresses, timelines, and supporting victim evidence.
          We also help clients avoid secondary recovery scams that demand seed phrases or upfront unlock fees.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Whether your case involves account takeover, phishing drains, or scam desk deposits, pair exchange liaison with chain tracing
          and legal channels when needed.
        </p>
        <Links
          items={[
            { label: "Open an exchange recovery case", href: "/contact" },
            { label: "Chain traceability services", href: "/traceability" },
            { label: "Role of exchange compliance (guide)", href: "/blog/role-of-exchange-compliance-in-crypto-recovery" },
            { label: "How exchanges freeze stolen crypto", href: "/blog/how-exchanges-freeze-stolen-crypto-explained" },
            { label: "Client reviews", href: "/reviews" },
          ]}
        />
      </>
    ),
    legal: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Legal Enforcement Support for Digital Asset Theft
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Courts, counsel, and law enforcement need more than explorer screenshots. Legal enforcement support means translating
          on-chain activity into structured evidence: transaction graphs, methodology notes, timelines, and chain-of-custody discipline
          suitable for affidavits, preservation letters, and discovery.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Crypto Recovery Assets collaborates with attorneys and victims to prepare court-ready forensic materials, support subpoena
          targeting of VASP endpoints, and explain technical concepts clearly for judges and investigators.
        </p>
        <Links
          items={[
            { label: "Request legal-ready forensic support", href: "/contact" },
            { label: "Court-ready evidence package guide", href: "/blog/building-court-ready-blockchain-evidence-package" },
            { label: "Working with lawyers on crypto theft", href: "/blog/working-with-lawyers-on-crypto-theft-cases" },
            { label: "Report a crypto scam (FBI IC3 guide)", href: "/blog/report-crypto-scam-fbi-ic3-usa-guide" },
            { label: "About our investigation team", href: "/about" },
          ]}
        />
      </>
    ),
    risk: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Crypto Risk Monitoring for Wallets and Institutions
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Risk monitoring helps families, family offices, and companies detect suspicious wallet interactions before losses compound.
          Continuous surveillance of watchlists, sanctioned entities, and known scam infrastructure reduces response time when threats
          appear.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Our risk workflows complement recovery operations: when an alert fires, clients already have a documented path into forensic
          intake, exchange liaison, and hardening guidance.
        </p>
        <Links
          items={[
            { label: "Discuss risk monitoring options", href: "/contact" },
            { label: "Threat intelligence desk", href: "/intelligence" },
            { label: "Free forensic toolkit", href: "/tools" },
            { label: "Wallet security after a scam", href: "/blog/five-things-to-do-immediately-after-crypto-scam" },
            { label: "Services overview", href: "/services" },
          ]}
        />
      </>
    ),
    tools: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Free Forensic Toolkit — Practical Utilities for Victims and Analysts
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          These utilities help you organize evidence and run lightweight checks while preparing a professional recovery case. They do
          not replace full blockchain forensics or exchange liaison, and they never require your seed phrase or private keys.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Use address risk checks, integrity hashing, and related helpers to strengthen documentation before intake. For active thefts,
          start a confidential case in parallel so tracing can begin while evidence is still fresh.
        </p>
        <Links
          items={[
            { label: "Start a recovery case", href: "/contact" },
            { label: "Chain traceability", href: "/traceability" },
            { label: "Case status lookup", href: "/case-lookup" },
            { label: "Blog: peel chain analysis explained", href: "/blog/peel-chain-analysis-explained-for-victims" },
            { label: "FAQ", href: "/faq" },
          ]}
        />
      </>
    ),
    intelligence: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Threat Intelligence for Digital Asset Incidents
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Threat intelligence connects emerging scam kits, drainer campaigns, and infrastructure reuse to faster victim response.
          Understanding how current campaigns operate helps prioritize evidence collection and recovery pathways.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Pair intelligence monitoring with professional intake when losses occur. Early reporting beats waiting while secondary scammers
          contact you on Telegram or WhatsApp.
        </p>
        <Links
          items={[
            { label: "Report an incident / open a case", href: "/contact" },
            { label: "Risk monitoring", href: "/risk" },
            { label: "Top crypto scams guide", href: "/blog/top-10-crypto-scams-2026" },
            { label: "Telegram fake recovery agent warning", href: "/blog/telegram-crypto-recovery-scam-how-to-spot-fake-agents" },
            { label: "Intelligence blog", href: "/blog" },
          ]}
        />
      </>
    ),
    "case-lookup": (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Check Your Crypto Recovery Case Status Securely
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Use your case reference to review milestones without sharing seed phrases or private keys. Case lookup is designed for
          transparency: you should know whether tracing, exchange outreach, or documentation steps are in progress.
        </p>
        <p className="text-slate-400 leading-relaxed">
          If you do not yet have a case ID, begin confidential intake first. If someone claiming to be “support” asks you to pay unlock
          fees outside official channels, stop and verify through this site only.
        </p>
        <Links
          items={[
            { label: "Start a new case", href: "/contact" },
            { label: "How long recovery can take", href: "/blog/how-long-does-crypto-recovery-take-realistic-timelines" },
            { label: "Spot fake recovery agents", href: "/blog/red-flags-fake-crypto-recovery-websites" },
            { label: "Client reviews", href: "/reviews" },
            { label: "Contact support", href: "/contact" },
          ]}
        />
      </>
    ),
    contact: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Confidential Crypto Recovery Case Intake
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Submit TxIDs, scam URLs, wallet addresses, and a clear timeline so analysts can assess tracing and freeze pathways. We do not
          ask for seed phrases or private keys. Legitimate recovery focuses on evidence, attribution, and cooperative venues—not
          impossible “transaction reversals.”
        </p>
        <p className="text-slate-400 leading-relaxed">
          After submission, keep evidence backups and ignore secondary scammers. You can review educational guides while your case is
          screened.
        </p>
        <Links
          items={[
            { label: "Services overview", href: "/services" },
            { label: "What to do immediately after a scam", href: "/blog/five-things-to-do-immediately-after-crypto-scam" },
            { label: "Fees: success models vs upfront scams", href: "/blog/crypto-recovery-success-fees-vs-upfront-scams" },
            { label: "About Crypto Recovery Assets", href: "/about" },
            { label: "FAQ", href: "/faq" },
          ]}
        />
      </>
    ),
    privacy: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Privacy Practices for Case Data</h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Case materials can include financial and identity-related details. We limit collection to what investigations require, restrict
          access to authorized personnel, and use secure channels for case communication. We never request seed phrases as part of
          standard recovery workflow.
        </p>
        <Links
          items={[
            { label: "Terms of Service", href: "/terms" },
            { label: "GDPR protocol", href: "/gdpr" },
            { label: "Contact privacy questions", href: "/contact" },
          ]}
        />
      </>
    ),
    terms: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Service Terms Overview</h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Engagement terms describe investigative scope, confidentiality expectations, and the reality that recovery depends on asset
          paths and third-party cooperation. No ethical firm can guarantee full recovery in every case.
        </p>
        <Links
          items={[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Start a case", href: "/contact" },
            { label: "How to choose a forensics firm", href: "/blog/how-to-choose-blockchain-forensics-firm-2026" },
          ]}
        />
      </>
    ),
    iso27001: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Information Security Alignment for Forensic Operations
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          ISO/IEC 27001-aligned practices guide how we handle sensitive case evidence, access controls, and operational security during
          cryptocurrency investigations. Strong security controls protect clients from secondary exposure while cases progress.
        </p>
        <Links
          items={[
            { label: "SOC 2 overview", href: "/soc2" },
            { label: "AML/KYC standards", href: "/amlkyc" },
            { label: "About our team", href: "/about" },
          ]}
        />
      </>
    ),
    soc2: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          SOC 2-Oriented Controls for Client Trust
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          SOC 2-oriented control thinking emphasizes security, availability, and confidentiality for systems that process client case
          data. Victims evaluating recovery firms should ask how evidence is stored, who can access it, and how communications are
          authenticated.
        </p>
        <Links
          items={[
            { label: "ISO/IEC 27001 page", href: "/iso27001" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Contact intake", href: "/contact" },
          ]}
        />
      </>
    ),
    gdpr: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          GDPR Considerations for EU Crypto Recovery Clients
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          EU clients may have specific data-subject rights regarding personal information used in investigations. Our GDPR-oriented
          practices focus on purpose limitation, secure handling, and clear channels for privacy requests related to case files.
        </p>
        <Links
          items={[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "EU recovery guides (blog)", href: "/blog/crypto-recovery-services-germany-guide-2026" },
            { label: "Contact", href: "/contact" },
          ]}
        />
      </>
    ),
    amlkyc: (
      <>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          AML/KYC Context in Cryptocurrency Recovery
        </h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Anti-money laundering and KYC frameworks shape how exchanges respond to freeze and return requests. Strong victim evidence
          packages help compliance teams distinguish legitimate reclaim efforts from fraudulent claims.
        </p>
        <Links
          items={[
            { label: "Exchange recovery services", href: "/recovery" },
            { label: "Travel Rule & VASP recovery cases", href: "/blog/travel-rule-vasps-and-crypto-recovery-cases" },
            { label: "Legal enforcement support", href: "/legal" },
          ]}
        />
      </>
    ),
  };

  return (
    <section className="mt-16 mb-8 max-w-3xl glass-panel border border-white/5 rounded-2xl p-8 md:p-10">
      {blocks[page]}
    </section>
  );
}
