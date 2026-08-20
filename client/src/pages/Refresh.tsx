import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Phone,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  Calculator,
  Star,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import useSeo from "@/hooks/useSeo";
import { BUSINESS } from "@shared/business";

interface RefreshPackage {
  name: string;
  price: string;
  priceNote: string;
  timeline: string;
  description: string;
  includes: string[];
  href: string;
  featured?: boolean;
}

/**
 * Pricing shown here is intentionally presented as a starting range. Actual
 * project pricing is confirmed after an in-home or showroom consultation.
 */
const PACKAGES: RefreshPackage[] = [
  {
    name: "Hardware Refresh",
    price: "Starting at $450",
    priceNote: "installed, typical 30-piece kitchen",
    timeline: "1 day",
    description:
      "New Top Knobs knobs and pulls throughout, templated and jig-drilled so spacing is identical on every door and drawer.",
    includes: [
      "Up to 30 knobs or pulls supplied and installed",
      "Choice from 7,000+ Top Knobs options",
      "Professional templating and drilling",
      "Existing hole reuse where possible",
    ],
    href: "/services/hardware-upgrades",
  },
  {
    name: "Cabinet Refacing",
    price: "Starting at $4,500",
    priceNote: "standard 10x10 kitchen",
    timeline: "3-5 days",
    description:
      "New doors, drawer fronts, and matching veneer over your existing boxes. The single highest-impact refresh available.",
    includes: [
      "New doors and drawer fronts in your chosen style",
      "Matching veneer on face frames and cabinet ends",
      "Soft-close hinge and glide upgrades available",
      "No demolition, no drywall repair",
    ],
    href: "/services/cabinet-refacing",
    featured: true,
  },
  {
    name: "Countertop Swap",
    price: "Starting at $3,200",
    priceNote: "installed, typical kitchen",
    timeline: "~2 weeks, 1 day on site",
    description:
      "Replace laminate or dated stone with quartz, granite, or premium laminate on your existing cabinets.",
    includes: [
      "Digital templating and fabrication",
      "Sink and faucet cutouts included",
      "Old countertop removal and haul-away",
      "Cambria quartz available as authorized dealer",
    ],
    href: "/services/countertop-replacement",
  },
  {
    name: "Cabinet Repair",
    price: "Starting at $175",
    priceNote: "first hour of labor, parts additional",
    timeline: "Same-day in most cases",
    description:
      "Fix the doors, drawers, hinges, and glides that have been annoying you, on cabinetry of any brand or age.",
    includes: [
      "Hinge replacement and door realignment",
      "Drawer glide repair and soft-close upgrades",
      "Water damage and finish touch-up",
      "Rollout and organizer retrofits",
    ],
    href: "/services/cabinet-repair",
  },
];

const COMPARISON = [
  {
    label: "Timeline",
    refresh: "1 day to 1 week",
    remodel: "10 to 16 weeks",
  },
  {
    label: "Typical investment",
    refresh: "$450 to $9,000",
    remodel: "$25,000 and up",
  },
  {
    label: "Kitchen out of service",
    refresh: "Rarely more than a day",
    remodel: "Several weeks",
  },
  {
    label: "Demolition and drywall work",
    refresh: "None",
    remodel: "Expected",
  },
  {
    label: "Best when",
    refresh: "Layout works, boxes are sound",
    remodel: "Layout needs to change",
  },
];

export default function Refresh() {
  useSeo();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-secondary">
        <img
          src="/images/gallery/53H0NAM0eSvE.webp"
          alt="Refreshed transitional kitchen with updated cabinet doors, hardware, and countertops"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/40" />
        <div className="container relative z-10 py-20 md:py-24">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Refresh Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Not ready for a full remodel? We can transform your kitchen in days, not
              months.
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Hardware refresh packages, cabinet refacing, countertop swaps, and cabinet
              repair — quick-turn projects from the Charlottesville family shop that has
              been doing this since {BUSINESS.foundedYear}.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={BUSINESS.phoneHref}>
                <Button size="lg" className="gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call Now: {BUSINESS.phone}
                </Button>
              </a>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white/10 border-white text-white hover:bg-white hover:text-secondary"
                >
                  <Calculator className="h-4 w-4" aria-hidden="true" /> Get an Instant AI
                  Estimate
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/80 flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {BUSINESS.hours.weekdays} &middot; Evening and Saturday appointments available
              by request
            </p>
          </div>
        </div>
      </section>

      {/* Why refresh */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold">Most Kitchens Do Not Need to Be Gutted</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If your cabinet boxes are solid and the layout already works for how you cook,
              tearing the room apart is spending money on things you will never see. The
              visual impact of a kitchen comes from four things: the doors, the countertops,
              the hardware, and whether everything opens and closes the way it should.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our refresh services address exactly those four things. You get the look and
              feel of a renovated kitchen without the demolition, the drywall repair, the
              permits, or the three months of eating takeout. Most of our refresh customers
              are back to normal life the same week we start.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-3xl font-bold">Refresh Packages &amp; Starting Prices</h2>
            <p className="text-muted-foreground">
              Ranges below are typical starting points for a standard Charlottesville
              kitchen. Your exact price depends on size, materials, and condition — call us
              or use the instant estimate tool for a real number.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PACKAGES.map(pkg => (
              <Card
                key={pkg.name}
                className={
                  pkg.featured
                    ? "border-2 border-primary shadow-lg relative"
                    : "border"
                }
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                      <CardDescription className="mt-1">{pkg.description}</CardDescription>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">{pkg.priceNote}</p>
                    <p className="text-sm font-medium mt-2 inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                      Typical timeline: {pkg.timeline}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-2">
                    {pkg.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <Check
                          className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/quote">
                      <Button className="gap-2">
                        Get a Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href={pkg.href}>
                      <Button variant="outline">Learn More</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            Prices shown are starting estimates for planning purposes and are not a formal
            quote. Final pricing is confirmed in writing after we measure your space.
          </p>
        </div>
      </section>

      {/* Refresh vs remodel */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">
            Refresh or Full Remodel?
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Comparison of Critzer's refresh services against a full kitchen remodel
              </caption>
              <thead>
                <tr className="border-b-2">
                  <th scope="col" className="py-4 pr-4 font-semibold"></th>
                  <th scope="col" className="py-4 px-4 font-bold text-primary">
                    Refresh Services
                  </th>
                  <th scope="col" className="py-4 px-4 font-bold">
                    Full Remodel
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(row => (
                  <tr key={row.label} className="border-b">
                    <th scope="row" className="py-4 pr-4 font-medium align-top">
                      {row.label}
                    </th>
                    <td className="py-4 px-4 text-muted-foreground align-top">
                      {row.refresh}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground align-top">
                      {row.remodel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/services/kitchen-bath-remodeling">
              <Button variant="outline" className="gap-2">
                Explore Full Remodeling{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-primary">
                {BUSINESS.yearsInBusiness} Years
              </p>
              <p className="text-muted-foreground mt-1">
                Serving Charlottesville since {BUSINESS.foundedYear}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary inline-flex items-center gap-2">
                <Star className="h-6 w-6 fill-current" aria-hidden="true" />
                {BUSINESS.houzzRating}
              </p>
              <p className="text-muted-foreground mt-1">
                <a
                  href={BUSINESS.houzzUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Rated on Houzz
                </a>
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">Family Owned</p>
              <p className="text-muted-foreground mt-1">
                The same family, the same showroom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Find out what your refresh would cost
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Call {BUSINESS.phone} and talk to an actual designer, or answer a few questions
            in our instant estimate tool and get a number in minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={BUSINESS.phoneHref}>
              <Button size="lg" variant="secondary" className="gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call Now: {BUSINESS.phone}
              </Button>
            </a>
            <Link href="/quote">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" /> Get an Instant AI
                Estimate
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-90">
            {BUSINESS.hours.weekdays} &middot; Evening and Saturday appointments available by
            request
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
