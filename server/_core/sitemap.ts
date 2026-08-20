/**
 * Dynamic sitemap.xml and robots.txt.
 *
 * Both are generated from the shared SEO registry so adding a route in
 * `shared/seo.ts` automatically publishes it to search engines. A static file
 * would drift out of date the moment a page is added.
 */

import type { Express } from "express";
import { BUSINESS } from "../../shared/business";
import { absoluteUrl, getSitemapRoutes, normalizePath } from "../../shared/seo";
import { GALLERY_ITEMS } from "../../shared/prerenderContent";

function buildSitemapXml(): string {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = getSitemapRoutes()
    .map(route => {
      const loc = absoluteUrl(normalizePath(route.path));
      const images =
        normalizePath(route.path) === "/gallery"
          ? GALLERY_ITEMS.map(
              item => `
    <image:image>
      <image:loc>${absoluteUrl(item.imageUrl)}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(item.description)}</image:caption>
    </image:image>`
            ).join("")
          : `
    <image:image>
      <image:loc>${absoluteUrl(route.image)}</image:loc>
      <image:title>${escapeXml(route.title)}</image:title>
    </image:image>`;

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq ?? "monthly"}</changefreq>
    <priority>${(route.priority ?? 0.5).toFixed(1)}</priority>${images}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRobotsTxt(): string {
  return `# robots.txt for ${BUSINESS.name}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /admin-utilities
Disallow: /dashboard
Disallow: /cart
Disallow: /checkout
Disallow: /order-confirmation
Disallow: /login
Disallow: /api/

Sitemap: ${BUSINESS.siteUrl}/sitemap.xml
`;
}

export function registerSeoRoutes(app: Express) {
  app.get("/sitemap.xml", (_req, res) => {
    res
      .status(200)
      .set({
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      })
      .send(buildSitemapXml());
  });

  app.get("/robots.txt", (_req, res) => {
    res
      .status(200)
      .set({
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      })
      .send(buildRobotsTxt());
  });
}
