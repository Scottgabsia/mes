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
  ogImage = '/logo.png?v=5',
  twitterHandle = '@DAForensics'
}) => {
  const siteTitle = 'Crypto Recovery Assets';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Professional Crypto Recovery & Blockchain Analysis`;
  const defaultDescription = 'Global leader in professional forensic analysis for digital asset and cryptocurrency recovery. Licensed blockchain investigation services.';
  const metaDescription = description || defaultDescription;
  const url = canonical || 'https://cryptorecoveryasset.com';
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
      <meta name="author" content="Crypto Recovery Assets" />
    </Helmet>
  );
};
