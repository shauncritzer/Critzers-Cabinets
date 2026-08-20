/**
 * Crawler-visible content snapshots.
 *
 * The application is a client-rendered SPA, which historically meant that
 * crawlers (and any request made without JavaScript) received an empty
 * `<div id="root">` on routes such as /gallery and /shop. The Express SEO
 * middleware injects the HTML produced here directly into `#root`, so the
 * initial response always contains real headings, copy, links, and images.
 * React replaces this markup on hydration, so it is never shown twice.
 *
 * Keep the copy here in sync with the corresponding React pages.
 */

import { BUSINESS } from "./business";
import { SERVICE_OFFERINGS } from "./structuredData";
import { normalizePath } from "./seo";

export interface PrerenderImage {
  src: string;
  alt: string;
}

export interface PrerenderSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  images?: PrerenderImage[];
  links?: Array<{ href: string; label: string }>;
}

export interface PrerenderPage {
  h1: string;
  intro: string;
  sections: PrerenderSection[];
}

/** Gallery items mirrored from client/src/pages/Gallery.tsx. */
export const GALLERY_ITEMS = [
  {
    title: "Modern White Kitchen Transformation",
    description:
      "Complete kitchen remodel featuring clean white cabinetry with modern hardware and sleek countertops",
    imageUrl: "/images/gallery/ubBFg9QkproG.jpg",
    alt: "Modern white kitchen in Charlottesville with shaker cabinetry, brushed nickel hardware, and quartz countertops",
  },
  {
    title: "Traditional Cherry Cabinets",
    description:
      "Classic cherry wood cabinetry with ornate details and traditional styling",
    imageUrl: "/images/gallery/3HrP0H3BuW7m.jpg",
    alt: "Traditional cherry wood kitchen cabinets with raised panel doors and decorative crown molding",
  },
  {
    title: "Rustic Farmhouse Kitchen",
    description:
      "Warm farmhouse style with distressed finishes and vintage-inspired hardware",
    imageUrl: "/images/gallery/7nAUkEFBXEaf.jpg",
    alt: "Rustic farmhouse kitchen with distressed painted cabinetry and vintage-style cup pulls",
  },
  {
    title: "Contemporary Gray Kitchen",
    description:
      "Sleek contemporary design with gray cabinetry and minimalist aesthetic",
    imageUrl: "/images/gallery/FbkkkCWXInZS.jpg",
    alt: "Contemporary gray kitchen cabinets with slab doors and long matte bar pulls",
  },
  {
    title: "Classic Oak Cabinetry",
    description:
      "Timeless oak cabinets with natural wood grain and traditional craftsmanship",
    imageUrl: "/images/gallery/KL9ldeZDUcbT.jpg",
    alt: "Classic natural oak kitchen cabinetry showing visible wood grain and framed door construction",
  },
  {
    title: "Shaker Style Kitchen",
    description:
      "Clean-lined Shaker cabinets with simple elegance and functional design",
    imageUrl: "/images/gallery/RHHoKWmplcBC.jpg",
    alt: "Shaker style kitchen cabinets with flat recessed panel doors and simple knobs",
  },
  {
    title: "Custom Bathroom Vanity",
    description:
      "Elegant bathroom vanity with custom storage solutions and premium finishes",
    imageUrl: "/images/gallery/bt6Vi4lpCf4B.jpg",
    alt: "Custom bathroom vanity with drawer storage, stone top, and undermount sink",
  },
  {
    title: "Transitional Kitchen Design",
    description:
      "Perfect blend of traditional and contemporary elements for a timeless look",
    imageUrl: "/images/gallery/53H0NAM0eSvE.webp",
    alt: "Transitional kitchen blending painted perimeter cabinets with a contrasting wood island",
  },
  {
    title: "Luxury Modern Kitchen",
    description:
      "High-end modern kitchen with premium materials and sophisticated design",
    imageUrl: "/images/gallery/luxury-modern-kitchen.webp",
    alt: "Luxury modern kitchen with full-height cabinetry, waterfall quartz island, and integrated lighting",
  },
] as const;

/** Hardware categories mirrored from the shop taxonomy. */
const HARDWARE_CATEGORIES = [
  "Cabinet knobs",
  "Bar pulls",
  "Cup and bin pulls",
  "Appliance pulls",
  "Drop and ring pulls",
  "Cabinet hinges and accessories",
];

const HARDWARE_COLLECTIONS = [
  "Bar Pulls",
  "Chareau",
  "Cumberland",
  "Lynwood",
  "Mercer",
  "Riverside",
  "Serene",
  "Transcend",
];

const HARDWARE_FINISHES = [
  "Polished Chrome",
  "Brushed Satin Nickel",
  "Flat Black",
  "Honey Bronze",
  "Ash Gray",
  "Polished Nickel",
  "Tuscan Bronze",
  "Brushed Bronze",
];

const HOURS_PARAGRAPH = `Showroom hours are ${BUSINESS.hours.weekdays}. ${BUSINESS.hours.saturday}. Call ${BUSINESS.phone} or visit us at ${BUSINESS.address.full}.`;

export const PRERENDER_PAGES: Record<string, PrerenderPage> = {
  "/": {
    h1: `${BUSINESS.name} — Serving Charlottesville Since 1986`,
    intro:
      "Forty years of family craftsmanship in kitchen and bath design. Custom cabinetry, cabinet refacing, cabinet repair, countertop replacement, hardware upgrades, closet and pantry design, and full remodeling for Charlottesville and Albemarle County homeowners.",
    sections: [
      {
        heading: "What We Do",
        bullets: SERVICE_OFFERINGS.map(s => `${s.name}: ${s.description}`),
        links: SERVICE_OFFERINGS.map(s => ({ href: s.path, label: s.name })),
      },
      {
        heading: "Brands We Represent",
        paragraphs: [
          "Authorized dealer for Top Knobs decorative hardware and Cambria quartz surfaces, with Omega Cabinetry and Wolf Home Products as our preferred cabinet lines.",
        ],
      },
      {
        heading: "What to Expect",
        bullets: [
          "Consultation — we listen to how you use the space and set a realistic budget.",
          "Design — measured drawings and 3D renderings of your new layout.",
          "Selection — door styles, finishes, countertops, and hardware chosen in our showroom.",
          "Installation — our own craftsmen protect your home and set every cabinet true.",
          "Enjoy — final walkthrough, adjustments, and warranty support.",
        ],
      },
      {
        heading: "Visit Our Showroom",
        paragraphs: [HOURS_PARAGRAPH],
      },
    ],
  },
  "/gallery": {
    h1: "Our Work — Charlottesville Kitchen & Bath Project Gallery",
    intro:
      "Explore our portfolio of custom cabinet projects across Charlottesville, Albemarle County, and central Virginia. Four decades of craftsmanship, one satisfied customer at a time.",
    sections: [
      {
        heading: "Featured Projects",
        images: GALLERY_ITEMS.map(item => ({ src: item.imageUrl, alt: item.alt })),
        bullets: GALLERY_ITEMS.map(item => `${item.title} — ${item.description}`),
      },
      {
        heading: "Ready to Create Your Dream Space?",
        paragraphs: [
          `Request a free design consultation or call ${BUSINESS.phone}. ${HOURS_PARAGRAPH}`,
        ],
        links: [
          { href: "/quote", label: "Get your free quote" },
          { href: "/refresh", label: "See quick-turn refresh services" },
        ],
      },
    ],
  },
  "/shop": {
    h1: "Cabinet Hardware Store — Top Knobs Knobs & Pulls",
    intro:
      "Shop premium cabinet knobs, pulls, and hardware from Top Knobs, America's leading decorative hardware manufacturer. Critzer's Cabinet Creations is an authorized dealer with free shipping on orders over $100.",
    sections: [
      {
        heading: "Shop by Category",
        bullets: HARDWARE_CATEGORIES,
      },
      {
        heading: "Top Knobs Collections",
        bullets: HARDWARE_COLLECTIONS,
        images: [
          {
            src: "/images/topknobs/bar-pulls-collection.jpg",
            alt: "Top Knobs Bar Pulls collection of cabinet hardware in multiple finishes",
          },
          {
            src: "/images/topknobs/mercer-collection.jpg",
            alt: "Top Knobs Mercer collection cabinet knobs and pulls",
          },
          {
            src: "/images/topknobs/serene-collection.jpg",
            alt: "Top Knobs Serene collection decorative cabinet hardware",
          },
        ],
      },
      {
        heading: "Available Finishes",
        bullets: HARDWARE_FINISHES,
      },
      {
        heading: "Hardware Help & Installation",
        paragraphs: [
          "Not sure which pull size fits your drawers? Our designers will template your kitchen and can install a full hardware refresh for you.",
          HOURS_PARAGRAPH,
        ],
        links: [
          { href: "/services/hardware-upgrades", label: "Hardware upgrade service" },
          { href: "/refresh", label: "Hardware refresh packages" },
        ],
      },
    ],
  },
  "/refresh": {
    h1: "Kitchen Refresh Services — Transform Your Kitchen in Days, Not Months",
    intro:
      "Not ready for a full remodel? Critzer's quick-turn refresh services update the parts of your kitchen you actually touch — hardware, cabinet doors, countertops, and worn-out mechanisms — usually in under a week.",
    sections: [
      {
        heading: "Refresh Services & Starting Prices",
        bullets: [
          "Hardware refresh packages starting at $450 installed for a typical 30-pull kitchen.",
          "Cabinet refacing starting around $4,500 for a standard 10x10 kitchen.",
          "Countertop swaps starting around $3,200 installed, including quartz and granite options.",
          "Cabinet repair visits starting at $175 for the first hour of labor.",
        ],
      },
      {
        heading: "Why a Refresh Works",
        paragraphs: [
          "Most kitchens do not need to be gutted. If your cabinet boxes are solid and the layout works, refacing and refinishing deliver the visual impact of a remodel at a fraction of the cost and disruption.",
          `Call ${BUSINESS.phone} or use our instant AI estimate tool to see what your refresh would cost. ${HOURS_PARAGRAPH}`,
        ],
        links: [
          { href: "/quote", label: "Get an instant AI estimate" },
          { href: "/services/cabinet-refacing", label: "Cabinet refacing details" },
        ],
      },
    ],
  },
};

/** Build prerender content for the six service pages from a shared template. */
const SERVICE_PRERENDER: Record<string, PrerenderPage> = {
  "/services/cabinet-refacing": {
    h1: "Cabinet Refacing in Charlottesville, VA",
    intro:
      "Keep the cabinet boxes. Replace everything you see. Cabinet refacing gives you new doors, new drawer fronts, and matching veneer on the exposed frames, typically in three to five days.",
    sections: [
      {
        heading: "How Refacing Works",
        paragraphs: [
          "Our craftsmen measure every opening, then order doors and drawer fronts in the door style, wood species, and finish you select from our Charlottesville showroom. Existing face frames and cabinet ends are covered in matching veneer or laminate so the finished kitchen reads as new cabinetry.",
          "Because we are not tearing out boxes, plumbing, or countertops, most refacing projects are complete in under a week and cost a fraction of full cabinet replacement.",
        ],
        links: [
          { href: "/quote", label: "Get a refacing quote" },
          { href: "/refresh", label: "See refresh pricing" },
        ],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
  "/services/cabinet-repair": {
    h1: "Cabinet Repair in Charlottesville, VA",
    intro:
      "Doors that will not close, drawers that stick, hinges that sag, sink bases swollen from a slow leak — we repair cabinetry of every brand and vintage, including cabinets we did not install.",
    sections: [
      {
        heading: "Common Repairs",
        bullets: [
          "Hinge replacement and door realignment",
          "Drawer box rebuilds and soft-close glide upgrades",
          "Water-damaged sink base and toe kick replacement",
          "Finish touch-up, refinishing, and color matching",
          "Shelf, rollout, and organizer retrofits",
        ],
        links: [{ href: "/quote", label: "Request a repair visit" }],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
  "/services/countertop-replacement": {
    h1: "Countertop Replacement — Authorized Cambria Quartz Dealer",
    intro:
      "Replace dated laminate or worn stone with quartz, granite, marble, solid surface, or premium laminate. As an authorized Cambria quartz dealer, we template, fabricate, and install.",
    sections: [
      {
        heading: "Materials We Install",
        bullets: [
          "Cambria quartz — American-made, non-porous, no sealing required",
          "Granite and marble slabs",
          "Solid surface such as Corian",
          "High-definition laminate for budget-conscious projects",
        ],
        links: [{ href: "/quote", label: "Get a countertop quote" }],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
  "/services/hardware-upgrades": {
    h1: "Cabinet Hardware Upgrades",
    intro:
      "New knobs and pulls are the fastest, least expensive way to modernize a kitchen. Shop over 7,000 Top Knobs options online or let our team template and install a whole-kitchen refresh.",
    sections: [
      {
        heading: "What We Offer",
        bullets: [
          "Authorized Top Knobs dealer with 7,000+ knobs, pulls, and appliance handles",
          "In-showroom samples so you can feel the finish before ordering",
          "Professional templating and installation for consistent placement",
          "Free shipping on online hardware orders over $100",
        ],
        links: [
          { href: "/shop", label: "Shop cabinet hardware online" },
          { href: "/refresh", label: "Hardware refresh packages" },
        ],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
  "/services/closet-pantry-design": {
    h1: "Closet & Pantry Design in Charlottesville, VA",
    intro:
      "Custom closets, walk-in pantries, mudroom lockers, and laundry storage designed around how your household actually lives, built from the same furniture-grade cabinetry we use in kitchens.",
    sections: [
      {
        heading: "Spaces We Design",
        bullets: [
          "Primary and reach-in closets with adjustable hanging, drawers, and shoe storage",
          "Walk-in and butler's pantries with rollout shelving and appliance garages",
          "Mudroom lockers, benches, and coat storage",
          "Laundry rooms with folding counters and hamper pullouts",
          "Home office and built-in shelving",
        ],
        links: [{ href: "/quote", label: "Start a storage design" }],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
  "/services/kitchen-bath-remodeling": {
    h1: "Full Kitchen & Bath Remodeling in Charlottesville, VA",
    intro:
      "One team from first sketch to final walkthrough. We manage layout, cabinetry, countertops, hardware, and installation so you have a single point of accountability for your remodel.",
    sections: [
      {
        heading: "Included in a Full Remodel",
        bullets: [
          "Measured existing conditions and 3D design renderings",
          "Cabinetry from Omega, Wolf, and other quality lines",
          "Countertop templating, fabrication, and installation",
          "Hardware, lighting, and accessory selection",
          "Installation by our own craftsmen with debris removal",
        ],
        links: [
          { href: "/quote", label: "Book a design consultation" },
          { href: "/gallery", label: "See completed remodels" },
        ],
      },
      { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
    ],
  },
};

Object.assign(PRERENDER_PAGES, SERVICE_PRERENDER);

export const SERVICES_INDEX_PRERENDER: PrerenderPage = {
  h1: "Cabinet & Remodeling Services in Charlottesville, VA",
  intro:
    "From a single sticking drawer to a complete kitchen renovation, Critzer's Cabinet Creations handles the full range of cabinetry work for central Virginia homeowners.",
  sections: [
    {
      heading: "Our Services",
      bullets: SERVICE_OFFERINGS.map(s => `${s.name}: ${s.description}`),
      links: SERVICE_OFFERINGS.map(s => ({ href: s.path, label: s.name })),
    },
    { heading: "Showroom & Contact", paragraphs: [HOURS_PARAGRAPH] },
  ],
};

PRERENDER_PAGES["/services"] = SERVICES_INDEX_PRERENDER;

PRERENDER_PAGES["/contact"] = {
  h1: "Contact Critzer's Cabinet Creations",
  intro: `Visit our Charlottesville showroom at ${BUSINESS.address.full}, call ${BUSINESS.phone}, or email ${BUSINESS.email}.`,
  sections: [
    {
      heading: "Showroom Hours",
      bullets: [
        BUSINESS.hours.weekdays,
        BUSINESS.hours.saturday,
        BUSINESS.hours.sunday,
      ],
    },
    {
      heading: "Get In Touch",
      paragraphs: [
        `Phone: ${BUSINESS.phone}. Fax: ${BUSINESS.fax}. Email: ${BUSINESS.email}.`,
      ],
      links: [{ href: "/quote", label: "Request a free quote" }],
    },
  ],
};

export function getPrerenderPage(pathname: string): PrerenderPage | null {
  return PRERENDER_PAGES[normalizePath(pathname)] ?? null;
}
