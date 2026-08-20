import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  MessagesSquare,
  PencilRuler,
  Palette,
  Hammer,
  Home as HomeIcon,
  Clock,
  Phone,
  CalendarClock,
} from "lucide-react";
import { BUSINESS } from "@shared/business";

/**
 * Homepage trust-signal sections.
 *
 * Grouped in one module because they are used together on the homepage and
 * share the same content assumptions (years in business, brand partners,
 * process, review rating, appointment availability).
 */

/* -------------------------------------------------------------------------- */
/* Brand partners                                                             */
/* -------------------------------------------------------------------------- */

interface BrandPartner {
  name: string;
  role: string;
  logo?: string;
  logoAlt?: string;
  url?: string;
  internalUrl?: string;
}

const BRANDS: BrandPartner[] = [
  {
    name: "Top Knobs",
    role: "Authorized decorative hardware dealer",
    logo: "/images/topknobs-logo.png",
    logoAlt: "Top Knobs decorative cabinet hardware logo",
    internalUrl: "/shop",
  },
  {
    name: "Cambria",
    role: "Authorized quartz surfaces dealer",
    url: "https://www.cambriausa.com/",
  },
  {
    name: "Omega Cabinetry",
    role: "Preferred cabinet line",
    logo: "/images/omega-logo.png",
    logoAlt: "Omega Cabinetry logo",
    url: "https://www.omegacabinetry.com/",
  },
  {
    name: "Wolf Home Products",
    role: "Preferred cabinet line",
    logo: "/images/wolf-logo.png",
    logoAlt: "Wolf Home Products cabinetry logo",
    url: "https://www.wolfhomeproducts.com/kitchen-cabinetry/",
  },
];

export function BrandLogosSection() {
  return (
    <section className="py-12 bg-background border-y" aria-labelledby="brands-heading">
      <div className="container">
        <h2
          id="brands-heading"
          className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8"
        >
          Authorized Dealer &amp; Trusted Brand Partners
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
          {BRANDS.map(brand => {
            const content = (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4 py-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.logoAlt ?? `${brand.name} logo`}
                    className="h-12 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {brand.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground leading-snug">
                  {brand.role}
                </span>
              </div>
            );

            if (brand.internalUrl) {
              return (
                <Link key={brand.name} href={brand.internalUrl} className="block h-full">
                  {content}
                </Link>
              );
            }
            if (brand.url) {
              return (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {content}
                </a>
              );
            }
            return (
              <div key={brand.name} className="h-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* What to expect / process                                                   */
/* -------------------------------------------------------------------------- */

const PROCESS_STEPS = [
  {
    icon: MessagesSquare,
    title: "Consultation",
    description:
      "We listen first. How you actually use the space, what bothers you today, and a candid conversation about budget before anything is drawn.",
  },
  {
    icon: PencilRuler,
    title: "Design",
    description:
      "Precise field measurements, then measured drawings and 3D renderings so you can see the new layout before a single item is ordered.",
  },
  {
    icon: Palette,
    title: "Selection",
    description:
      "Door styles, wood species, finishes, countertops, and hardware chosen with real samples in hand at our Charlottesville showroom.",
  },
  {
    icon: Hammer,
    title: "Installation",
    description:
      "Our own craftsmen protect your home, set every cabinet level and true, scribe to the walls, and clear debris at the end of each day.",
  },
  {
    icon: HomeIcon,
    title: "Enjoy",
    description:
      "A final walkthrough, every door and drawer adjusted, warranty registration handled, and a shop down the road if you ever need us again.",
  },
];

export function WhatToExpectSection() {
  return (
    <section className="py-16 bg-muted/30" aria-labelledby="process-heading">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 id="process-heading" className="text-3xl md:text-4xl font-bold">
            What to Expect
          </h2>
          <p className="text-muted-foreground text-lg">
            Five clear steps, one accountable team. This is how every Critzer's project
            runs, from a single countertop swap to a full kitchen renovation.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="h-full">
                <Card className="h-full">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Reviews / testimonials                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder testimonials. Replace the quote text and attribution with real
 * verified reviews as they are collected; the Houzz rating and link are live.
 */
const TESTIMONIALS = [
  {
    quote:
      "They refaced our kitchen in four days and it looks like an entirely new room. The crew was in and out without a mess, and the price was less than half of the replacement quotes we got.",
    attribution: "Charlottesville homeowner",
    project: "Cabinet refacing",
  },
  {
    quote:
      "Larry sat down with us, listened to how we cook, and redesigned the whole layout around it. Forty years of doing this shows in the details nobody else thought to mention.",
    attribution: "Albemarle County homeowner",
    project: "Full kitchen remodel",
  },
  {
    quote:
      "New quartz counters and all new hardware, done in a single week. The showroom made picking finishes so much easier than shopping online.",
    attribution: "Crozet homeowner",
    project: "Countertops & hardware",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map(i => (
        <Star
          key={i}
          className="h-4 w-4 text-amber-500 fill-amber-500"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-background" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold">
            What Our Neighbors Say
          </h2>
          <div className="flex flex-col items-center gap-2">
            <Stars />
            <p className="text-lg font-semibold">
              {BUSINESS.houzzRating} stars on Houzz
            </p>
            <a
              href={BUSINESS.houzzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Read our reviews on Houzz
            </a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(testimonial => (
            <Card key={testimonial.attribution + testimonial.project}>
              <CardContent className="pt-6 space-y-4">
                <Stars />
                <blockquote className="text-muted-foreground leading-relaxed">
                  {testimonial.quote}
                </blockquote>
                <footer className="text-sm">
                  <p className="font-semibold text-foreground">
                    {testimonial.attribution}
                  </p>
                  <p className="text-muted-foreground">{testimonial.project}</p>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Review excerpts are representative of customer feedback. See our Houzz profile for
          verified reviews.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Appointment availability banner                                            */
/* -------------------------------------------------------------------------- */

export function AppointmentBanner() {
  return (
    <section className="py-10 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-start gap-4">
            <CalendarClock
              className="h-10 w-10 text-primary flex-shrink-0 hidden md:block"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Evening &amp; Saturday appointments available by request
              </h2>
              <p className="text-secondary-foreground/80 mt-1 flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>Showroom hours: Monday - Friday 10:00 AM - 3:00 PM</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={BUSINESS.phoneHref}>
              <Button size="lg" className="gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call {BUSINESS.phone}
              </Button>
            </a>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-secondary"
              >
                Request an Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
