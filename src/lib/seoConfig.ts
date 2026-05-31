import { SITE_URL } from "../constants";
import { FAQ_ITEMS } from "../data/faq";
import { getBlogPostBySlug } from "../data/blogPosts";

export type SeoRouteConfig = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  noindex?: boolean;
};

/** Public routes — used for default meta and sitemap generation */
export const SEO_ROUTES: SeoRouteConfig[] = [
  {
    path: "/",
    title: "Crypto Recovery Service & Blockchain Forensics",
    description:
      "Professional cryptocurrency recovery and blockchain forensics for stolen or lost digital assets. Bitcoin, Ethereum, and DeFi case intake with licensed investigators.",
    keywords:
      "crypto recovery service, cryptocurrency recovery, bitcoin recovery expert, blockchain forensics, scammed crypto recovery",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    path: "/services",
    title: "Crypto Recovery Services",
    description:
      "Wallet recovery, exchange recovery, forensic tracking, and scam assistance. End-to-end digital asset investigation services worldwide.",
    keywords: "crypto recovery services, wallet recovery, exchange recovery, forensic tracking",
    changefreq: "monthly",
    priority: 0.9,
  },
  {
    path: "/contact",
    title: "Contact & Case Intake",
    description:
      "Submit a confidential crypto recovery case. Secure intake form for lost wallets, scams, and exchange disputes.",
    keywords: "crypto recovery contact, report crypto scam, hire crypto recovery specialist",
    changefreq: "monthly",
    priority: 0.95,
  },
  {
    path: "/about",
    title: "About Our Forensic Team",
    description:
      "Licensed blockchain investigators and recovery specialists. Learn about Crypto Recovery Assets and our global enforcement network.",
    keywords: "crypto recovery company, blockchain investigation firm, about crypto recovery assets",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/faq",
    title: "Crypto Recovery FAQ",
    description:
      "Answers on seed phrase recovery, MetaMask and Ledger issues, scam response, and how to hire a legitimate crypto recovery specialist.",
    keywords: "crypto recovery faq, recover lost crypto, metamask recovery help",
    changefreq: "weekly",
    priority: 0.85,
  },
  {
    path: "/reviews",
    title: "Client Reviews",
    description:
      "Verified client experiences with our cryptocurrency recovery and forensic investigation services.",
    keywords: "crypto recovery reviews, recovery service testimonials",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/blog",
    title: "Recovery Intelligence Blog",
    description:
      "Expert guides on blockchain forensics, scam prevention, and cryptocurrency recovery best practices.",
    keywords: "crypto recovery blog, blockchain forensics articles",
    changefreq: "weekly",
    priority: 0.75,
  },
  {
    path: "/intelligence",
    title: "Threat Intelligence",
    description:
      "Live blockchain threat intelligence, exploit monitoring, and secure reporting for digital asset incidents.",
    keywords: "crypto threat intelligence, blockchain security monitoring",
    changefreq: "weekly",
    priority: 0.75,
  },
  {
    path: "/case-lookup",
    title: "Case Status Lookup",
    description:
      "Check the status of your crypto recovery case with your secure case reference ID.",
    keywords: "crypto recovery case status, case lookup",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/traceability",
    title: "Chain Traceability",
    description:
      "On-chain forensic tracing across Bitcoin, Ethereum, Solana, and major L2 networks for asset recovery cases.",
    keywords: "blockchain traceability, crypto transaction tracing",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/recovery",
    title: "Exchange Recovery",
    description:
      "Exchange account recovery and VASP liaison for frozen or misdirected centralized exchange assets.",
    keywords: "exchange crypto recovery, recover funds from exchange",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/legal",
    title: "Legal & Enforcement Support",
    description:
      "Forensic evidence, subpoena preparation, and coordination with law enforcement for crypto asset seizures.",
    keywords: "crypto legal enforcement, asset seizure support",
    changefreq: "monthly",
    priority: 0.75,
  },
  {
    path: "/risk",
    title: "Risk Monitoring",
    description:
      "Enterprise crypto risk monitoring, wallet health scoring, and proactive threat alerts for institutions.",
    keywords: "crypto risk monitoring, wallet security monitoring",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/tools",
    title: "Forensic Toolkit",
    description:
      "Free forensic utilities: address risk audit, integrity verification, PGP encoding, NFT provenance, and DEX liquidity analysis.",
    keywords: "crypto forensic tools, blockchain analysis tools",
    changefreq: "monthly",
    priority: 0.75,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "How Crypto Recovery Assets collects, uses, and protects your personal and case data.",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description: "Terms governing use of Crypto Recovery Assets website and professional services.",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/iso27001",
    title: "ISO/IEC 27001",
    description: "Information security management standards alignment for forensic operations.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/soc2",
    title: "SOC 2 Type II",
    description: "SOC 2 compliance overview for Crypto Recovery Assets security controls.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/gdpr",
    title: "GDPR Protocol",
    description: "GDPR data protection practices for EU clients and case subjects.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/amlkyc",
    title: "AML/KYC Standards",
    description: "Anti-money laundering and KYC standards for cryptocurrency recovery investigations.",
    changefreq: "yearly",
    priority: 0.4,
  },
];

const NOINDEX_PATHS = new Set([
  "/admin/login",
  "/admin/dashboard",
  "/reviews/submit",
]);

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return trimmed;
}

export function getSeoForPath(pathname: string): SeoRouteConfig & { canonical: string; noindex: boolean } {
  const path = normalizePath(pathname);

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPostBySlug(blogMatch[1]);
    if (post) {
      return {
        path,
        title: post.title,
        description: post.excerpt,
        keywords: post.keywords.join(", "),
        changefreq: "monthly",
        priority: 0.72,
        canonical: `${SITE_URL}${path}`,
        noindex: false,
      };
    }
  }

  const match = SEO_ROUTES.find((r) => r.path === path);

  const fallback = SEO_ROUTES[0]!;
  const config = match ?? fallback;

  return {
    ...config,
    canonical: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    noindex: NOINDEX_PATHS.has(path) || path.startsWith("/admin"),
  };
}

export function buildFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Crypto Recovery Assets",
    url: `${SITE_URL}/`,
    description:
      "Professional cryptocurrency recovery, blockchain forensics, and digital asset investigation services.",
    publisher: {
      "@type": "Organization",
      name: "Crypto Recovery Assets",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand-icon-512.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/faq?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Crypto Recovery Assets",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-image.png`,
    telephone: "+1-401-684-4683",
    email: "info@cryptorecoveryasset.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "One World Trade Center, Suite 850",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10007",
      addressCountry: "US",
    },
    areaServed: "Worldwide",
    priceRange: "$$",
    serviceType: [
      "Cryptocurrency recovery",
      "Blockchain forensics",
      "Wallet recovery",
      "Exchange recovery",
    ],
  };
}
