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

/** Public routes — unique titles/descriptions for CTR + indexing (single source of truth) */
export const SEO_ROUTES: SeoRouteConfig[] = [
  {
    path: "/",
    title: "Crypto Recovery Service & Blockchain Forensics",
    description:
      "Hire licensed investigators for stolen Bitcoin, Ethereum, and DeFi losses. Fast case intake, on-chain tracing, and exchange freeze support—no seed phrases required.",
    keywords:
      "crypto recovery service, cryptocurrency recovery, bitcoin recovery expert, blockchain forensics, scammed crypto recovery",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    path: "/services",
    title: "Wallet, Exchange & Scam Recovery Services",
    description:
      "Compare wallet restoration, exchange liaison, scam tracing, and forensic investigation programs. End-to-end digital asset recovery services for individuals and institutions.",
    keywords: "crypto recovery services, wallet recovery, exchange recovery, forensic tracking",
    changefreq: "monthly",
    priority: 0.9,
  },
  {
    path: "/contact",
    title: "Start a Confidential Crypto Recovery Case",
    description:
      "Secure intake for lost wallets, romance scams, phishing drains, and exchange disputes. Submit TxIDs and evidence—never your seed phrase—to begin professional review.",
    keywords: "crypto recovery contact, report crypto scam, hire crypto recovery specialist",
    changefreq: "monthly",
    priority: 0.95,
  },
  {
    path: "/about",
    title: "About Crypto Recovery Assets Investigators",
    description:
      "Meet the blockchain forensics team behind Crypto Recovery Assets. Learn how licensed investigators, analysts, and counsel partners handle global recovery cases.",
    keywords: "crypto recovery company, blockchain investigation firm, about crypto recovery assets",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/faq",
    title: "Crypto Recovery FAQ: Seeds, Wallets & Scams",
    description:
      "Clear answers on MetaMask and Ledger recovery, partial seed phrases, FBI/IC3 reporting, and how to hire a legitimate specialist without falling for secondary scams.",
    keywords: "crypto recovery faq, recover lost crypto, metamask recovery help",
    changefreq: "weekly",
    priority: 0.85,
  },
  {
    path: "/reviews",
    title: "Verified Client Crypto Recovery Reviews",
    description:
      "Read verified Google and Trustpilot-style client reviews covering freezes, partial recoveries, and forensic reporting from real cryptocurrency recovery cases.",
    keywords: "crypto recovery reviews, recovery service testimonials",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/blog",
    title: "Crypto Recovery & Forensics Blog",
    description:
      "In-depth guides on stolen crypto recovery, scam red flags, exchange freezes, and blockchain forensics—written for victims who need actionable next steps.",
    keywords: "crypto recovery blog, blockchain forensics articles",
    changefreq: "weekly",
    priority: 0.75,
  },
  {
    path: "/intelligence",
    title: "Crypto Threat Intelligence Desk",
    description:
      "Monitor emerging drainers, scam desks, and exploit patterns. Use threat intelligence insights to respond faster when digital assets are at risk.",
    keywords: "crypto threat intelligence, blockchain security monitoring",
    changefreq: "weekly",
    priority: 0.75,
  },
  {
    path: "/case-lookup",
    title: "Crypto Recovery Case Status Lookup",
    description:
      "Enter your secure case reference to check recovery milestones, tracing updates, and next actions without sharing private keys.",
    keywords: "crypto recovery case status, case lookup",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/traceability",
    title: "Blockchain Chain Traceability Service",
    description:
      "Multi-chain forensic tracing across Bitcoin, Ethereum, Solana, Tron, and major L2s. Cluster analysis and hop maps built for freeze packages.",
    keywords: "blockchain traceability, crypto transaction tracing",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/recovery",
    title: "Centralized Exchange Crypto Recovery",
    description:
      "VASP liaison for frozen, misdirected, or stolen exchange balances. Compliance-ready evidence packages that support preservation and return workflows.",
    keywords: "exchange crypto recovery, recover funds from exchange",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/legal",
    title: "Crypto Legal & Enforcement Support",
    description:
      "Court-ready forensic reports, subpoena preparation support, and coordination pathways for seizures and counsel-led digital asset cases.",
    keywords: "crypto legal enforcement, asset seizure support",
    changefreq: "monthly",
    priority: 0.75,
  },
  {
    path: "/risk",
    title: "Enterprise Crypto Wallet Risk Monitoring",
    description:
      "Continuous wallet surveillance, exposure scoring, and alert workflows for family offices and institutions that need proactive crypto risk controls.",
    keywords: "crypto risk monitoring, wallet security monitoring",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/tools",
    title: "Free Crypto Forensic Toolkit Online",
    description:
      "Run address risk checks, file integrity hashing, PGP helpers, NFT provenance tests, and DEX liquidity analysis while preparing a recovery case.",
    keywords: "crypto forensic tools, blockchain analysis tools",
    changefreq: "monthly",
    priority: 0.75,
  },
  {
    path: "/privacy",
    title: "Privacy Policy for Recovery Case Data",
    description:
      "How Crypto Recovery Assets collects, stores, and protects personal and case evidence during cryptocurrency investigations.",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    title: "Terms of Service for Recovery Engagements",
    description:
      "Legal terms for using cryptorecoveryasset.com and engaging investigative recovery services, including scope and outcome limitations.",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/iso27001",
    title: "ISO/IEC 27001 Security Practices",
    description:
      "How information-security controls aligned with ISO/IEC 27001 principles protect forensic operations and sensitive client evidence.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/soc2",
    title: "SOC 2 Security Controls Overview",
    description:
      "Overview of SOC 2-oriented security, availability, and confidentiality controls that support trusted crypto recovery case handling.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/gdpr",
    title: "GDPR Data Protection for EU Clients",
    description:
      "GDPR-oriented practices for EU cryptocurrency recovery clients, including purpose limitation and channels for privacy requests.",
    changefreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/amlkyc",
    title: "AML & KYC Standards in Crypto Recovery",
    description:
      "How AML/KYC expectations at exchanges affect freeze and return requests—and how victim evidence packages support compliant reclaim efforts.",
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

  // Aliases → contact
  if (path === "/client-portal" || path === "/btc") {
    const contact = SEO_ROUTES.find((r) => r.path === "/contact")!;
    return {
      ...contact,
      path,
      canonical: `${SITE_URL}/contact`,
      noindex: false,
    };
  }

  const match = SEO_ROUTES.find((r) => r.path === path);
  if (!match) {
    return {
      path,
      title: "Page Not Found",
      description: "This page is not available. Return to Crypto Recovery Assets for crypto recovery services and case intake.",
      canonical: `${SITE_URL}${path}`,
      noindex: true,
      priority: 0.1,
    };
  }

  return {
    ...match,
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
    sameAs: [
      "https://www.facebook.com/share/1D9wkP3Hoz/",
      "https://www.quora.com/profile/Crypto-Recovery-Asset",
      "https://www.tiktok.com/@crypto_recovery_asset",
    ],
  };
}

export function buildBreadcrumbForPath(pathname: string): Record<string, unknown> | null {
  const path = normalizePath(pathname);
  if (path === "/") return null;

  const crumbs: { name: string; path: string }[] = [
    { name: "Home", path: "/" },
  ];

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    crumbs.push({ name: "Blog", path: "/blog" });
    const post = getBlogPostBySlug(blogMatch[1]!);
    crumbs.push({ name: post?.title ?? "Article", path });
  } else {
    const route = SEO_ROUTES.find((r) => r.path === path);
    crumbs.push({ name: route?.title ?? path, path });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  };
}
