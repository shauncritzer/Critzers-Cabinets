import { useEffect } from "react";
import { useLocation } from "wouter";
import { BUSINESS } from "@shared/business";
import { absoluteUrl, getRouteSeo, normalizePath } from "@shared/seo";
import { buildSchemasForRoute } from "@shared/structuredData";

/**
 * Keeps the document head in sync during client-side navigation.
 *
 * The Express SEO middleware already renders correct tags for the initial
 * document (which is what crawlers and social unfurlers read). Once React takes
 * over routing, no new HTML document is requested, so this hook rewrites the
 * title, description, canonical, Open Graph, Twitter, and JSON-LD nodes
 * whenever the route changes.
 */

const MANAGED_ATTR = "data-seo-managed";

function upsertMeta(
  selectorAttr: "name" | "property",
  key: string,
  content: string
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${selectorAttr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(selectorAttr, key);
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function replaceJsonLd(schemas: object[]) {
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach(node => node.remove());

  schemas.forEach(schema => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED_ATTR, "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

/**
 * Apply SEO tags for the current route. Optionally override individual fields
 * (used by dynamic pages such as product detail).
 */
export function useSeo(overrides?: {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}) {
  const [location] = useLocation();

  useEffect(() => {
    const path = normalizePath(location);
    const base = getRouteSeo(path);

    const title = overrides?.title ?? base.title;
    const description = overrides?.description ?? base.description;
    const image = absoluteUrl(overrides?.image ?? base.image);
    const noindex = overrides?.noindex ?? base.noindex ?? false;
    const canonical = absoluteUrl(path);

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );
    if (base.keywords) upsertMeta("name", "keywords", base.keywords);

    upsertMeta("property", "og:type", path === "/" ? "website" : "article");
    upsertMeta("property", "og:site_name", BUSINESS.name);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertLink("canonical", canonical);

    replaceJsonLd(buildSchemasForRoute(path));
  }, [
    location,
    overrides?.title,
    overrides?.description,
    overrides?.image,
    overrides?.noindex,
  ]);
}

export default useSeo;
