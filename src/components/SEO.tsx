import React from "react";
import { Helmet } from "react-helmet-async";
import { BRAND_ICON_URL, FAVICON_VERSION, OG_IMAGE_URL, SITE_URL } from "../constants";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  ogType = "website",
  ogImage = OG_IMAGE_URL,
  twitterHandle = "@DAForensics",
  noindex = false,
  jsonLd,
}) => {
  const siteTitle = "Crypto Recovery Assets";
  const fullTitle = title
    ? `${title} | ${siteTitle}`
    : `${siteTitle} | Professional Crypto Recovery & Blockchain Forensics`;
  const defaultDescription =
    "Professional cryptocurrency recovery and blockchain forensics for stolen or lost digital assets. Licensed investigators worldwide.";
  const metaDescription = description || defaultDescription;
  const url = canonical || `${SITE_URL}/`;
  const siteOrigin = url.replace(/\/$/, "") || SITE_URL;
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${siteOrigin}${ogImage}`;
  const defaultKeywords =
    "crypto recovery service, bitcoin recovery expert, cryptocurrency recovery, scammed crypto recovery, blockchain forensics";
  const metaKeywords = keywords || defaultKeywords;
  const robots = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />

      <link rel="icon" href={`/favicon.ico?v=${FAVICON_VERSION}`} sizes="any" />
      <link rel="icon" type="image/png" sizes="48x48" href={`/favicon-48x48.png?v=${FAVICON_VERSION}`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`/favicon-192x192.png?v=${FAVICON_VERSION}`} />

      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={twitterHandle} />

      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="language" content="English" />
      <meta name="author" content="Crypto Recovery Assets" />
      <meta name="geo.region" content="US-NY" />
      <meta name="geo.placename" content="New York" />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

/** BreadcrumbList JSON-LD helper */
export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export { BRAND_ICON_URL };
