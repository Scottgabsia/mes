import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FAVICON_VERSION, OG_IMAGE_URL, SITE_URL } from '../constants';

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
  ogImage = OG_IMAGE_URL,
  twitterHandle = '@DAForensics'
}) => {
  const siteTitle = 'Crypto Recovery Assets';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Professional Crypto Recovery & Blockchain Analysis`;
  const defaultDescription = 'Global leader in professional forensic analysis for digital asset and cryptocurrency recovery. Licensed blockchain investigation services.';
  const metaDescription = description || defaultDescription;
  const url = canonical || SITE_URL;
  const siteOrigin = url.replace(/\/$/, '');
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteOrigin}${ogImage}`;
  const defaultKeywords = 'crypto recovery service, bitcoin recovery expert, cryptocurrency recovery tool, scammed crypto recovery, hire crypto recovery specialist, blockchain forensics';
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />
      <link rel="icon" href={`/favicon.ico?v=${FAVICON_VERSION}`} sizes="any" />
      <link rel="icon" type="image/png" sizes="48x48" href={`/favicon-48x48.png?v=${FAVICON_VERSION}`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`/favicon-192x192.png?v=${FAVICON_VERSION}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={twitterHandle} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Crypto Recovery Assets" />
    </Helmet>
  );
};
