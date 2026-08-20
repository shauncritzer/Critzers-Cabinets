/**
 * Server-side SEO injection.
 *
 * The client is a single-page app, so without this layer every route returned
 * the same generic <head> and an empty `<div id="root">`. Crawlers that do not
 * execute JavaScript (and social/link unfurlers, which never do) therefore saw
 * a blank page on /gallery, /shop, and every other route.
 *
 * `injectSeo` rewrites the index.html string for a specific request path:
 *   1. route-specific <title>, description, keywords, canonical, robots
 *   2. Open Graph + Twitter card tags with a per-route og:image
 *   3. JSON-LD graph (LocalBusiness on every page, plus Service/Breadcrumb)
 *   4. a pre-rendered static content block inside #root
 *
 * React discards the pre-rendered block when it mounts, so users see the normal
 * interactive app while crawlers get real, indexable HTML.
 */

import { BUSINESS } from "../../shared/business";
import { absoluteUrl, getRouteSeo, normalizePath } from "../../shared/seo";
import { buildSchemasForRoute } from "../../shared/structuredData";
import {
  getPrerenderPage,
  type PrerenderPage,
} from "../../shared/prerenderContent";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** JSON-LD must not be able to break out of the script tag. */
function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

function buildHeadTags(pathname: string): string {
  const seo = getRouteSeo(pathname);
  const canonical = absoluteUrl(normalizePath(pathname));
  const image = absoluteUrl(seo.image);
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);

  const tags: string[] = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    seo.keywords
      ? `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`
      : "",
    seo.noindex
      ? `<meta name="robots" content="noindex, nofollow" />`
      : `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="author" content="${escapeHtml(BUSINESS.legalName)}" />`,
    // Open Graph
    `<meta property="og:type" content="${normalizePath(pathname) === "/" ? "website" : "article"}" />`,
    `<meta property="og:site_name" content="${escapeHtml(BUSINESS.name)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    // Twitter
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // Local business signals
    `<meta name="geo.region" content="US-VA" />`,
    `<meta name="geo.placename" content="Charlottesville, Virginia" />`,
    `<meta name="geo.position" content="${BUSINESS.address.latitude};${BUSINESS.address.longitude}" />`,
    `<meta name="ICBM" content="${BUSINESS.address.latitude}, ${BUSINESS.address.longitude}" />`,
  ].filter(Boolean);

  const schemas = buildSchemasForRoute(pathname)
    .map(
      schema =>
        `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(schema))}</script>`
    )
    .join("\n    ");

  return `${tags.join("\n    ")}\n    ${schemas}`;
}

function renderPrerenderPage(page: PrerenderPage): string {
  const sections = page.sections
    .map(section => {
      const parts: string[] = [];
      if (section.heading) parts.push(`<h2>${escapeHtml(section.heading)}</h2>`);
      (section.paragraphs ?? []).forEach(p =>
        parts.push(`<p>${escapeHtml(p)}</p>`)
      );
      if (section.bullets?.length) {
        parts.push(
          `<ul>${section.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        );
      }
      if (section.images?.length) {
        parts.push(
          section.images
            .map(
              img =>
                `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" width="600" height="600" loading="lazy" />`
            )
            .join("")
        );
      }
      if (section.links?.length) {
        parts.push(
          `<ul>${section.links
            .map(
              link =>
                `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`
            )
            .join("")}</ul>`
        );
      }
      return `<section>${parts.join("")}</section>`;
    })
    .join("");

  const nav = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/services/cabinet-refacing", label: "Cabinet Refacing" },
    { href: "/services/cabinet-repair", label: "Cabinet Repair" },
    { href: "/services/countertop-replacement", label: "Countertop Replacement" },
    { href: "/services/hardware-upgrades", label: "Hardware Upgrades" },
    { href: "/services/closet-pantry-design", label: "Closet & Pantry Design" },
    {
      href: "/services/kitchen-bath-remodeling",
      label: "Kitchen & Bath Remodeling",
    },
    { href: "/refresh", label: "Refresh Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/shop", label: "Shop Hardware" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]
    .map(
      link =>
        `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`
    )
    .join("");

  return `<div id="seo-prerender" data-prerender="true">
  <header>
    <a href="/"><img src="/images/logo.png" alt="${escapeHtml(BUSINESS.name)} logo" width="48" height="48" /></a>
    <nav aria-label="Main navigation"><ul>${nav}</ul></nav>
  </header>
  <main>
    <h1>${escapeHtml(page.h1)}</h1>
    <p>${escapeHtml(page.intro)}</p>
    ${sections}
  </main>
  <footer>
    <p>${escapeHtml(BUSINESS.legalName)} — ${escapeHtml(BUSINESS.address.full)}</p>
    <p>Phone: <a href="${BUSINESS.phoneHref}">${escapeHtml(BUSINESS.phone)}</a> — Email: <a href="mailto:${BUSINESS.email}">${escapeHtml(BUSINESS.email)}</a></p>
    <p>${escapeHtml(BUSINESS.hours.weekdays)}</p>
    <p>${escapeHtml(BUSINESS.hours.saturday)}</p>
  </footer>
</div>`;
}

/**
 * Rewrites an index.html document with route-specific SEO data.
 */
export function injectSeo(html: string, pathname: string): string {
  let output = html;

  // Remove the build-time placeholder head so we do not emit duplicates.
  output = output.replace(/<title>[\s\S]*?<\/title>/i, "");
  output = output.replace(
    /<meta\s+name=["'](?:description|keywords)["'][^>]*>\s*/gi,
    ""
  );

  const headTags = buildHeadTags(pathname);
  output = output.replace(/<\/head>/i, `    ${headTags}\n  </head>`);

  const page = getPrerenderPage(pathname);
  if (page) {
    const prerendered = renderPrerenderPage(page);
    output = output.replace(
      /<div id="root"><\/div>/i,
      `<div id="root">${prerendered}</div>`
    );
  }

  return output;
}
