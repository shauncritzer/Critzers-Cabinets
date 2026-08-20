import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import SiteFooter from "@/components/SiteFooter";
import {
  BrandLogosSection,
  WhatToExpectSection,
  TestimonialsSection,
  AppointmentBanner,
} from "@/components/TrustSignals";
import useSeo from "@/hooks/useSeo";
import { BUSINESS } from "@shared/business";
import { SERVICE_OFFERINGS } from "@shared/structuredData";
import { ArrowRight, Phone, Sparkles, Award, Users, MapPin } from "lucide-react";

/** Short blurbs for the homepage service grid. */
const SERVICE_BLURBS: Record<string, string> = {
  "/services/cabinet-refacing":
    "New doors, drawer fronts, and matching veneer over your existing boxes. Usually complete in three to five days.",
  "/services/cabinet-repair":
    "Hinges, glides, water damage, and worn finishes repaired on cabinetry of any brand or age.",
  "/services/countertop-replacement":
    "Quartz, granite, marble, solid surface, and laminate. Authorized Cambria quartz dealer.",
  "/services/hardware-upgrades":
    "Over 7,000 Top Knobs knobs and pulls, available online or installed by our team.",
  "/services/closet-pantry-design":
    "Custom closets, walk-in pantries, mudrooms, and laundry storage built to fit your home.",
  "/services/kitchen-bath-remodeling":
    "One accountable team handling design, cabinetry, countertops, and installation.",
};

export default function Home() {
  useSeo();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shared Navigation */}
      <Navigation transparent />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <Award className="h-6 w-6" aria-hidden="true" />
              <p className="text-2xl font-bold">
                {BUSINESS.yearsInBusiness} Years
              </p>
              <p className="text-sm opacity-90">
                Serving Charlottesville since {BUSINESS.foundedYear}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-6 w-6" aria-hidden="true" />
              <p className="text-2xl font-bold">Family Owned</p>
              <p className="text-sm opacity-90">
                Three generations of craftsmanship
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MapPin className="h-6 w-6" aria-hidden="true" />
              <p className="text-2xl font-bold">Local Showroom</p>
              <p className="text-sm opacity-90">
                {BUSINESS.address.streetDisplay}, {BUSINESS.address.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full font-semibold">
              Serving Charlottesville Since 1986 — 40 Years of Family Craftsmanship
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome to Critzer's Cabinet Creations
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For <strong>40 years</strong>, Critzer's Cabinet Creations has been
              Charlottesville's trusted kitchen and bath design center. We offer a wide
              selection of quality cabinet lines, with{" "}
              <a
                href="https://www.omegacabinetry.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Omega Cabinetry
              </a>{" "}
              and{" "}
              <a
                href="https://www.wolfhomeproducts.com/kitchen-cabinetry/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Wolf Home Products
              </a>{" "}
              as our preferred brands. We are also an authorized dealer for{" "}
              <a
                href="https://www.topknobs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Top Knobs
              </a>{" "}
              decorative hardware and{" "}
              <a
                href="https://www.cambriausa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Cambria
              </a>{" "}
              quartz surfaces.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you need a full kitchen remodel, a cabinet refacing project that
              finishes in days, a countertop swap, a repair on cabinets we did not build, or
              just a box of new pulls, the same family answers the phone. Free design
              consultations, and evening and Saturday appointments are available by request.
            </p>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 my-8">
              <p className="text-xl font-bold text-emerald-800 mb-2">
                FREE Design Consultation
              </p>
              <p className="text-emerald-700">
                Schedule your complimentary consultation with our expert designers today.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href="/quote">
                <Button size="lg" className="gap-2">
                  Get Your Free Quote{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
              <a href={BUSINESS.phoneHref}>
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {BUSINESS.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Brand logos / authorized dealer signals */}
      <BrandLogosSection />

      {/* Services Section */}
      <section className="py-16 bg-background" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold">
              What We Do
            </h2>
            <p className="text-muted-foreground text-lg">
              Six core services, from a single afternoon repair to a complete kitchen
              renovation.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_OFFERINGS.map(service => (
              <Card key={service.path} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                  <CardDescription className="text-base">
                    {SERVICE_BLURBS[service.path] ?? service.description}
                  </CardDescription>
                  <Link
                    href={service.path}
                    className="text-primary font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Refresh services promo */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <Card className="border-2 border-primary/40 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10 space-y-4">
                <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Sparkles className="h-4 w-4" aria-hidden="true" /> Refresh Services
                </span>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Not ready for a full remodel? We can transform your kitchen in days, not
                  months.
                </h2>
                <p className="text-muted-foreground">
                  Hardware refresh packages, cabinet refacing, countertop swaps, and cabinet
                  repair. Quick-turn projects with clear starting prices, most finished
                  inside a week.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/refresh">
                    <Button size="lg" className="gap-2">
                      See Refresh Options{" "}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <a href={BUSINESS.phoneHref}>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" aria-hidden="true" /> Call Now
                    </Button>
                  </a>
                </div>
              </div>
              <div className="min-h-[260px] bg-muted">
                <img
                  src="/images/gallery/53H0NAM0eSvE.webp"
                  alt="Refreshed transitional kitchen with new cabinet doors, hardware, and countertops"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* What to Expect process */}
      <WhatToExpectSection />

      {/* Commercial Video Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              See Our Craftsmanship in Action
            </h2>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                controls
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/gallery/luxury-modern-kitchen.webp"
                aria-label="Critzer's Cabinet Creations introduction video"
              >
                <source src="/videos/heygen-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Watch our 30-second commercial showcasing 40 years of quality craftsmanship
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials / reviews */}
      <TestimonialsSection />

      {/* Evening & Saturday appointments */}
      <AppointmentBanner />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Transform Your Space?</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Get an instant preliminary quote with our expert consultation system, or browse
            our hardware store to find the perfect finishing touches for your project.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="secondary">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                Shop Hardware
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
