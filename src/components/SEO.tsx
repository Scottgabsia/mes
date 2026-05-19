import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxz_T8aUidvRQbs3A_e-gViEpOyshtgn8rz5RagHcGzm9oZ0KHl_dlJsBS4Z0sByAk5HGYA3JfT-HyQkAIUQecOJ7_1ndRSnslqmeXjUahQo6Orec5X6hjchIFdxpER7lx4HGRJf9qd8nfahsNEyI-obzUfLPscPLspGCvNHUMNPrCQC4lGh5K7p83DbrhDiaF-c9tZk6F1gYsOzOoVyBSYDcg8A1HW2jlvHLLCs-7CYv1P0Chxj0Cooh_QIU7Db1nvPLpGIEIOEs',
  twitterHandle = '@DAForensics'
}) => {
  const siteTitle = 'Digital Assets Forensics';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Professional Crypto Recovery & Blockchain Analysis`;
  const defaultDescription = 'Global leader in professional forensic analysis for digital asset and cryptocurrency recovery. Licensed blockchain investigation services.';
  const metaDescription = description || defaultDescription;
  const url = canonical || 'https://digitalassetsforensiccryptorecovery.com';
  const defaultKeywords = 'crypto recovery service, bitcoin recovery expert, cryptocurrency recovery tool, scammed crypto recovery, hire crypto recovery specialist, blockchain forensics';
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Digital Assets Forensics" />
    </Helmet>
  );
};
