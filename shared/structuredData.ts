/**
 * JSON-LD structured data builders.
 *
 * The LocalBusiness graph is emitted on every page by the server SEO
 * middleware; page-specific Service / BreadcrumbList / ItemList nodes are added
 * on top of it for the routes that warrant them.
 */

import { BUSINESS } from "./business";
import { absoluteUrl, getRouteSeo, normalizePath } from "./seo";

const BUSINESS_ID = `${BUSINESS.siteUrl}/#localbusiness`;

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    alternateName: BUSINESS.shortName,
    description:
      "Family-owned kitchen and bath design center serving Charlottesville, Virginia since 1986. Custom cabinetry, cabinet refacing and repair, countertop replacement, hardware upgrades, closet and pantry design, and full kitchen and bath remodeling.",
    url: BUSINESS.siteUrl,
    telephone: BUSINESS.phoneE164,
    faxNumber: "+1-434-973-9712",
    email: BUSINESS.email,
    foundingDate: String(BUSINESS.foundedYear),
    priceRange: "$$",
    image: absoluteUrl("/images/gallery/luxury-modern-kitchen.webp"),
    logo: absoluteUrl("/images/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.address.latitude,
      longitude: BUSINESS.address.longitude,
    },
    hasMap: BUSINESS.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "10:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "00:00",
        closes: "00:00",
        description: "Saturday and evening appointments available by request.",
      },
    ],
    openingHours: ["Mo-Fr 10:00-15:00", "Sa by appointment"],
    areaServed: BUSINESS.serviceAreas.map(area => ({
      "@type": "AdministrativeArea",
      name: `${area}, Virginia`,
    })),
    sameAs: [BUSINESS.facebookUrl, BUSINESS.twitterUrl, BUSINESS.houzzUrl],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.houzzRating,
      bestRating: "5",
      reviewCount: BUSINESS.houzzReviewCount,
    },
    makesOffer: SERVICE_OFFERINGS.map(service => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: absoluteUrl(service.path),
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cabinet & Remodeling Services",
      itemListElement: SERVICE_OFFERINGS.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: absoluteUrl(service.path),
        },
      })),
    },
  };
}

export const SERVICE_OFFERINGS = [
  {
    name: "Cabinet Refacing",
    path: "/services/cabinet-refacing",
    description:
      "New doors, drawer fronts, and matching veneers installed over your existing cabinet boxes, typically completed in three to five days.",
  },
  {
    name: "Cabinet Repair",
    path: "/services/cabinet-repair",
    description:
      "Repair and restoration of cabinet doors, drawers, hinges, glides, finishes, and water-damaged panels for cabinetry of any brand.",
  },
  {
    name: "Countertop Replacement",
    path: "/services/countertop-replacement",
    description:
      "Templating, fabrication, and installation of quartz, granite, marble, solid surface, and laminate countertops. Authorized Cambria quartz dealer.",
  },
  {
    name: "Cabinet Hardware Upgrades",
    path: "/services/hardware-upgrades",
    description:
      "Whole-kitchen knob and pull replacement using over 7,000 Top Knobs options, available in showroom or through our online hardware store.",
  },
  {
    name: "Closet & Pantry Design",
    path: "/services/closet-pantry-design",
    description:
      "Custom closet systems, walk-in pantries, mudroom lockers, and laundry storage built from furniture-grade cabinetry.",
  },
  {
    name: "Full Kitchen & Bath Remodeling",
    path: "/services/kitchen-bath-remodeling",
    description:
      "End-to-end kitchen and bathroom remodeling including design, cabinetry, countertops, hardware, and professional installation.",
  },
] as const;

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS.siteUrl}/#website`,
    url: BUSINESS.siteUrl,
    name: BUSINESS.name,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BUSINESS.siteUrl}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function buildBreadcrumbSchema(pathname: string) {
  const clean = normalizePath(pathname);
  if (clean === "/") return null;

  const segments = clean.split("/").filter(Boolean);
  const items: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BUSINESS.siteUrl,
    },
  ];

  let accumulated = "";
  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const seo = getRouteSeo(accumulated);
    const name =
      seo.title.split("|")[0].trim() ||
      segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: absoluteUrl(accumulated),
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildServiceSchema(pathname: string) {
  const clean = normalizePath(pathname);
  const service = SERVICE_OFFERINGS.find(entry => entry.path === clean);
  if (!service) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    serviceType: service.name,
    provider: { "@id": BUSINESS_ID },
    areaServed: BUSINESS.serviceAreas.map(area => ({
      "@type": "AdministrativeArea",
      name: `${area}, Virginia`,
    })),
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: {
        "@type": "ContactPoint",
        telephone: BUSINESS.phoneE164,
        contactType: "sales",
      },
      serviceUrl: absoluteUrl(service.path),
    },
  };
}

/**
 * Returns every JSON-LD object that should be rendered for a given route.
 */
export function buildSchemasForRoute(pathname: string): object[] {
  const schemas: object[] = [buildLocalBusinessSchema()];
  const clean = normalizePath(pathname);

  if (clean === "/") {
    schemas.push(buildWebSiteSchema());
  }

  const breadcrumb = buildBreadcrumbSchema(clean);
  if (breadcrumb) schemas.push(breadcrumb);

  const service = buildServiceSchema(clean);
  if (service) schemas.push(service);

  return schemas;
}
