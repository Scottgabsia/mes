import React from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "./SEO";
import {
  buildBreadcrumbForPath,
  buildProfessionalServiceSchema,
  buildWebSiteSchema,
  getSeoForPath,
} from "../lib/seoConfig";

/**
 * Default per-route SEO for pages that do not set their own <SEO /> overrides.
 * Helmet merges tags; nested page-level SEO components take precedence when rendered after.
 */
export function RouteSEO() {
  const { pathname } = useLocation();
  const config = getSeoForPath(pathname);

  const jsonLd: Record<string, unknown>[] = [];
  if (config.path === "/") {
    jsonLd.push(buildWebSiteSchema(), buildProfessionalServiceSchema());
  }
  const crumbs = buildBreadcrumbForPath(pathname);
  if (crumbs) jsonLd.push(crumbs);

  return (
    <SEO
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      canonical={config.canonical}
      noindex={config.noindex}
      jsonLd={jsonLd.length ? jsonLd : undefined}
    />
  );
}
