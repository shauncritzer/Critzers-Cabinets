import type { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Check, ArrowRight, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import useSeo from "@/hooks/useSeo";
import { BUSINESS } from "@shared/business";

export interface ServiceHighlight {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageLayoutProps {
  /** Compelling H1 headline. */
  headline: string;
  /** Short supporting line under the headline. */
  subheadline: string;
  /** Hero background image path. */
  heroImage: string;
  /** Accessible description of the hero image. */
  heroImageAlt: string;
  /** Small eyebrow label above the headline. */
  eyebrow?: string;
  /** The 2-3 paragraphs of SEO body copy. */
  body: string[];
  /** Bullet list of what's included. */
  bullets?: string[];
  /** Feature cards. */
  highlights?: ServiceHighlight[];
  /** Optional FAQ block. */
  faqs?: ServiceFaq[];
  /** Label for the primary CTA button. */
  primaryCtaLabel?: string;
  /** Destination of the primary CTA. */
  primaryCtaHref?: string;
  /** Extra content rendered before the closing CTA. */
  children?: ReactNode;
}

export default function ServicePageLayout({
  headline,
  subheadline,
  heroImage,
  heroImageAlt,
  eyebrow,
  body,
  bullets,
  highlights,
  faqs,
  primaryCtaLabel = "Get a Free Quote",
  primaryCtaHref = "/quote",
  children,
}: ServicePageLayoutProps) {
  useSeo();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-secondary text-secondary-foreground">
        <img
          src={heroImage}
          alt={heroImageAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl space-y-5">
            {eyebrow && (
              <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                {eyebrow}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-white/90">{subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href={primaryCtaHref}>
                <Button size="lg" className="gap-2">
                  {primaryCtaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <a href={BUSINESS.phoneHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white/10 border-white text-white hover:bg-white hover:text-secondary"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call {BUSINESS.phone}
                </Button>
              </a>
            </div>
            <p className="text-sm text-white/80 flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {BUSINESS.hours.weekdays} &middot; Saturday &amp; evening appointments by request
            </p>
          </div>
        </div>
      </section>

      {/* Body copy */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {body.map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {bullets && bullets.length > 0 && (
                <ul className="space-y-3 pt-4">
                  {bullets.map(bullet => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sticky quote card */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-24 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready for a quote?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Design consultations are free. Tell us about your space and we will
                    follow up within one business day.
                  </p>
                  <Link href={primaryCtaHref} className="block">
                    <Button className="w-full gap-2">
                      {primaryCtaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <a href={BUSINESS.phoneHref} className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" aria-hidden="true" /> {BUSINESS.phone}
                    </Button>
                  </a>
                  <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">Showroom</p>
                    <p>{BUSINESS.address.streetDisplay}</p>
                    <p>
                      {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                      {BUSINESS.address.zip}
                    </p>
                    <p className="pt-2">{BUSINESS.hours.weekdays}</p>
                    <p>{BUSINESS.hours.saturday}</p>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-10">What's Included</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map(item => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map(faq => (
                <div key={faq.question} className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Let's talk about your project</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Call {BUSINESS.phone} or request a free quote online. Evening and Saturday
            appointments are available by request for busy schedules.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={primaryCtaHref}>
              <Button size="lg" variant="secondary" className="gap-2">
                {primaryCtaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <a href={BUSINESS.phoneHref}>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Call {BUSINESS.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
