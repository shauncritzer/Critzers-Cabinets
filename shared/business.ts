/**
 * Single source of truth for Critzer's Cabinet Creations business information.
 *
 * This module is imported by both the client (for UI display) and the server
 * (for structured data / meta tag generation), so it MUST stay free of any
 * browser- or node-specific APIs.
 */

export const BUSINESS = {
  legalName: "Critzer's Cabinet Creations, Inc.",
  name: "Critzer's Cabinet Creations",
  shortName: "Critzer's Cabinets",
  foundedYear: 1986,
  yearsInBusiness: 40,
  tagline: "Serving Charlottesville Since 1986 — 40 Years of Family Craftsmanship",
  phone: "(434) 973-1691",
  phoneHref: "tel:+14349731691",
  phoneE164: "+1-434-973-1691",
  fax: "(434) 973-9712",
  email: "info@critzerscabinets.com",
  address: {
    street: "661 Berkmar Ct",
    streetDisplay: "661 Berkmar Court",
    city: "Charlottesville",
    state: "VA",
    zip: "22901",
    full: "661 Berkmar Ct, Charlottesville, VA 22901",
    country: "US",
    latitude: 38.0850409,
    longitude: -78.4795012,
  },
  hours: {
    weekdays: "Monday - Friday: 10:00 AM - 3:00 PM",
    saturday: "Saturday & Evening appointments available by request",
    sunday: "Sunday: Closed",
    summary:
      "Monday - Friday 10:00 AM - 3:00 PM. Saturday and evening appointments available by request.",
  },
  siteUrl: "https://critzerscabinets.com",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=661+Berkmar+Court+Charlottesville+VA+22901",
  houzzUrl:
    "https://www.houzz.com/professionals/cabinets-and-cabinetry/critzer-s-cabinet-creations-pfvwus-pf~378564984",
  houzzRating: "5.0",
  houzzReviewCount: 3,
  facebookUrl: "https://www.facebook.com/critzerscabinets",
  twitterUrl: "https://twitter.com/critzerscabinets",
  serviceAreas: [
    "Charlottesville",
    "Albemarle County",
    "Greene County",
    "Fluvanna County",
    "Nelson County",
    "Louisa County",
  ],
} as const;

export const SERVICE_AREA_TEXT =
  "Charlottesville, Albemarle County, Greene County, Fluvanna County, Nelson County, and Louisa County, Virginia";
