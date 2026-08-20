/**
 * Central SEO registry.
 *
 * Every crawlable route has an entry here. The registry is consumed by:
 *  - the Express SEO middleware (`server/_core/seo.ts`), which injects meta
 *    tags, canonical URLs, JSON-LD, and pre-rendered fallback content into
 *    index.html before the HTML is sent to the browser/crawler;
 *  - the client `useSeo` hook, which keeps the document head in sync during
 *    client-side navigation;
 *  - the sitemap generator (`server/_core/sitemap.ts`).
 *
 * Keep this file free of browser/node specific APIs so it can run in both.
 */

import { BUSINESS } from "./business";

export interface RouteSeo {
  /** Route path exactly as registered in the wouter router. */
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative path to the social sharing image. */
  image: string;
  /** Optional keyword list, rendered into <meta name="keywords">. */
  keywords?: string;
  /** Sitemap priority, 0.0 - 1.0. Omit to exclude from the sitemap. */
  priority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  /** Whether crawlers should index this route. */
  noindex?: boolean;
}

const DEFAULT_IMAGE = "/images/gallery/luxury-modern-kitchen.webp";

export const DEFAULT_SEO: RouteSeo = {
  path: "*",
  title: `${BUSINESS.name} | Custom Cabinets, Refacing & Countertops in Charlottesville VA`,
  description:
    "Family-owned Charlottesville cabinet showroom since 1986. Cabinet refacing, repair, countertop replacement, hardware upgrades, closet design, and full kitchen and bath remodeling. Call (434) 973-1691.",
  image: DEFAULT_IMAGE,
  keywords:
    "cabinet refacing Charlottesville, cabinet repair, countertop replacement, Cambria quartz dealer, cabinet hardware, kitchen remodeling Charlottesville VA",
  priority: 0.5,
  changefreq: "monthly",
};

export const ROUTE_SEO: RouteSeo[] = [
  {
    path: "/",
    title: `${BUSINESS.name} | Cabinets, Refacing & Countertops in Charlottesville, VA`,
    description:
      "Serving Charlottesville since 1986 — 40 years of family craftsmanship. Custom cabinetry, cabinet refacing and repair, Cambria quartz countertops, and Top Knobs hardware. Free design consultation: (434) 973-1691.",
    image: DEFAULT_IMAGE,
    keywords:
      "kitchen cabinets Charlottesville, cabinet refacing, custom cabinetry, Cambria quartz, Top Knobs hardware, kitchen remodel Charlottesville VA",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: `About Our Family Cabinet Shop | 40 Years in Charlottesville`,
    description:
      "Meet the Critzer family. Since 1986 we have designed and installed kitchens and baths across Charlottesville and Albemarle County, backed by authorized Omega, Wolf, Cambria, and Top Knobs partnerships.",
    image: "/images/team/larry-critzer.png",
    priority: 0.7,
    changefreq: "yearly",
  },
  {
    path: "/services",
    title: "Cabinet & Remodeling Services | Charlottesville, VA",
    description:
      "Complete kitchen and bath services: cabinet refacing, cabinet repair, countertop replacement, hardware upgrades, closet and pantry design, and full remodeling. Design consultation is free.",
    image: "/service-design.jpg",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/cabinet-refacing",
    title: "Cabinet Refacing in Charlottesville, VA | New Doors in Days",
    description:
      "Keep your cabinet boxes and get a brand-new kitchen. Critzer's cabinet refacing replaces doors, drawer fronts, and veneers in days instead of months, typically for a fraction of full replacement cost.",
    image: "/service-cabinetry.jpg",
    keywords:
      "cabinet refacing Charlottesville, refacing kitchen cabinets, cabinet door replacement, refacing cost Virginia",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/cabinet-repair",
    title: "Cabinet Repair in Charlottesville, VA | Doors, Drawers & Hinges",
    description:
      "Sagging doors, broken drawer glides, water-damaged panels, or worn finishes? Our craftsmen repair and restore cabinetry of every brand and vintage across the Charlottesville area.",
    image: "/service-installation.jpg",
    keywords:
      "cabinet repair Charlottesville, drawer glide replacement, cabinet hinge repair, cabinet restoration Virginia",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/countertop-replacement",
    title: "Countertop Replacement | Authorized Cambria Quartz Dealer",
    description:
      "Replace tired laminate or dated stone with quartz, granite, or marble. As an authorized Cambria quartz dealer, Critzer's templates, fabricates, and installs countertops in about two weeks.",
    image: "/countertop-quartz.jpg",
    keywords:
      "countertop replacement Charlottesville, Cambria quartz dealer Virginia, granite countertops, quartz countertops Charlottesville",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/hardware-upgrades",
    title: "Cabinet Hardware Upgrades | Top Knobs Knobs & Pulls",
    description:
      "The fastest upgrade in any kitchen. Shop 7,000+ Top Knobs knobs, pulls, and appliance handles, or let our team template and install a whole-kitchen hardware refresh for you.",
    image: "/images/hardware/topknobs-showcase-1.png",
    keywords:
      "cabinet hardware Charlottesville, Top Knobs dealer, cabinet knobs and pulls, hardware installation",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/closet-pantry-design",
    title: "Closet & Pantry Design in Charlottesville, VA | Custom Storage",
    description:
      "Custom closets, walk-in pantries, mudrooms, and laundry storage designed around how your family actually lives. Built from the same cabinetry lines we use in our kitchens.",
    image: "/images/gallery/bt6Vi4lpCf4B.jpg",
    keywords:
      "closet design Charlottesville, custom pantry, walk-in closet Virginia, mudroom storage, laundry room cabinets",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/services/kitchen-bath-remodeling",
    title: "Full Kitchen & Bath Remodeling | Charlottesville, VA",
    description:
      "One team from design through final walkthrough. Critzer's manages layout, cabinetry, countertops, hardware, and installation for complete kitchen and bathroom remodels in Charlottesville.",
    image: "/images/gallery/ubBFg9QkproG.jpg",
    keywords:
      "kitchen remodeling Charlottesville, bathroom remodel Virginia, kitchen renovation contractor, bath design Charlottesville",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/refresh",
    title: "Kitchen Refresh Services | Transform Your Kitchen in Days",
    description:
      "Not ready for a full remodel? Hardware refresh packages, cabinet refacing, countertop swaps, and cabinet repair — quick-turn projects that transform your kitchen in days, not months.",
    image: "/images/gallery/53H0NAM0eSvE.webp",
    keywords:
      "kitchen refresh Charlottesville, affordable kitchen update, hardware refresh package, quick kitchen makeover, cabinet refacing cost",
    priority: 0.95,
    changefreq: "weekly",
  },
  {
    path: "/gallery",
    title: "Project Gallery | Charlottesville Kitchens & Baths by Critzer's",
    description:
      "Browse completed Charlottesville kitchen and bath projects: modern white kitchens, traditional cherry cabinetry, farmhouse and Shaker designs, custom vanities, and luxury remodels.",
    image: DEFAULT_IMAGE,
    keywords:
      "kitchen gallery Charlottesville, cabinet project photos, before and after kitchen remodel Virginia",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/products",
    title: "Cabinet Lines & Countertop Materials | Omega, Wolf & Cambria",
    description:
      "Explore the cabinet lines, door styles, wood species, finishes, and countertop materials available through Critzer's Cabinet Creations in Charlottesville, Virginia.",
    image: "/omega-cabinetry-showcase.jpg",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/shop",
    title: "Cabinet Hardware Store | Top Knobs Knobs & Pulls Online",
    description:
      "Shop premium Top Knobs cabinet hardware online: bar pulls, knobs, appliance pulls, and cup pulls in dozens of finishes. Free shipping on orders over $100 from an authorized dealer.",
    image: "/images/hardware/topknobs-showcase-1.png",
    keywords:
      "buy cabinet hardware online, Top Knobs pulls, cabinet knobs, brushed satin nickel pulls, matte black cabinet hardware",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/contact",
    title: "Contact Critzer's Cabinet Creations | Charlottesville Showroom",
    description:
      "Visit our showroom at 661 Berkmar Ct, Charlottesville, VA. Open Monday-Friday 10:00 AM - 3:00 PM, with Saturday and evening appointments available by request. Call (434) 973-1691.",
    image: "/images/welcome.jpeg",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/quote",
    title: "Get a Free Cabinet Quote | Instant Estimate Tool",
    description:
      "Answer a few questions about your kitchen or bath and get an instant preliminary estimate, then a detailed quote from our designers within one business day.",
    image: "/service-design.jpg",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/shipping-policy",
    title: "Shipping Policy | Critzer's Cabinet Creations",
    description:
      "Shipping rates, processing times, and delivery details for cabinet hardware orders placed through the Critzer's Cabinet Creations online store.",
    image: DEFAULT_IMAGE,
    priority: 0.3,
    changefreq: "yearly",
  },
  {
    path: "/return-policy",
    title: "Return Policy | Critzer's Cabinet Creations",
    description:
      "Our 30-day return policy for cabinet hardware purchases, including instructions for exchanges, damaged items, and special orders.",
    image: DEFAULT_IMAGE,
    priority: 0.3,
    changefreq: "yearly",
  },
  // Non-indexable application routes. Present so the middleware can still emit
  // sensible titles and a robots noindex directive.
  { path: "/cart", title: "Your Cart", description: "Review the cabinet hardware in your cart before checkout.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/checkout", title: "Checkout", description: "Securely complete your cabinet hardware order.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/checkout/success", title: "Order Complete", description: "Thank you for your order.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/order-confirmation", title: "Order Confirmation", description: "Your order confirmation details.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/login", title: "Sign In", description: "Sign in to your Critzer's Cabinet Creations account.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/dashboard", title: "Dashboard", description: "Your project dashboard.", image: DEFAULT_IMAGE, noindex: true },
  { path: "/admin", title: "Admin", description: "Administrative tools.", image: DEFAULT_IMAGE, noindex: true },
];

/** Routes that are dynamic but should still be indexable, matched by prefix. */
export const DYNAMIC_SEO_PREFIXES: Array<{
  prefix: string;
  seo: Omit<RouteSeo, "path">;
}> = [
  {
    prefix: "/shop/product/",
    seo: {
      title: "Cabinet Hardware Detail | Top Knobs at Critzer's",
      description:
        "View specifications, finishes, and pricing for this Top Knobs cabinet hardware item, available online from authorized dealer Critzer's Cabinet Creations.",
      image: "/images/hardware/topknobs-showcase-1.png",
    },
  },
];

export function getRouteSeo(pathname: string): RouteSeo {
  const clean = normalizePath(pathname);

  const exact = ROUTE_SEO.find(route => normalizePath(route.path) === clean);
  if (exact) return exact;

  const dynamic = DYNAMIC_SEO_PREFIXES.find(entry => clean.startsWith(entry.prefix));
  if (dynamic) return { path: clean, ...dynamic.seo };

  // Unknown /admin/* style routes should never be indexed.
  if (clean.startsWith("/admin")) {
    return { ...DEFAULT_SEO, path: clean, noindex: true };
  }

  return { ...DEFAULT_SEO, path: clean };
}

export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const withoutQuery = pathname.split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.replace(/\/+$/, "");
  }
  return withoutQuery || "/";
}

/** Routes eligible for the XML sitemap. */
export function getSitemapRoutes(): RouteSeo[] {
  return ROUTE_SEO.filter(route => !route.noindex && route.priority !== undefined);
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BUSINESS.siteUrl}${path}`;
}
