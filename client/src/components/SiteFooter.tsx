import { Link } from "wouter";
import { Facebook, Twitter, Clock, MapPin, Phone, Mail } from "lucide-react";
import { BUSINESS } from "@shared/business";
import { SERVICE_OFFERINGS } from "@shared/structuredData";

/**
 * Shared site footer.
 *
 * Previously the footer only existed inside Home.tsx, which meant the NAP
 * (name / address / phone) and hours block — a significant local SEO signal —
 * was missing from every other page. This component is now rendered on all
 * public pages.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 mt-auto">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-bold text-lg mb-4">{BUSINESS.name}</h2>
            <p className="text-sm text-secondary-foreground/80">
              Family-owned and operated since {BUSINESS.foundedYear}, serving Charlottesville
              and surrounding areas with quality craftsmanship and dedication.
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              {BUSINESS.yearsInBusiness} Years of Family Craftsmanship
            </p>
          </div>

          {/* Services */}
          <div>
            <h2 className="font-bold text-lg mb-4">Our Services</h2>
            <ul className="space-y-2 text-sm">
              {SERVICE_OFFERINGS.map(service => (
                <li key={service.path}>
                  <Link
                    href={service.path}
                    className="text-secondary-foreground/80 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/refresh"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Refresh Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + NAP */}
          <div>
            <h2 className="font-bold text-lg mb-4">Contact Us</h2>
            <address className="space-y-2 text-sm text-secondary-foreground/80 not-italic">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  {BUSINESS.address.streetDisplay}
                  <br />
                  {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                  {BUSINESS.address.zip}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a href={BUSINESS.phoneHref} className="hover:text-white transition-colors">
                  {BUSINESS.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-white transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </p>
              <p className="pl-6">Fax: {BUSINESS.fax}</p>
            </address>
          </div>

          {/* Hours + quick links */}
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Showroom Hours
            </h2>
            <div className="space-y-1 text-sm text-secondary-foreground/80">
              <p className="font-semibold text-white">Monday - Friday</p>
              <p>10:00 AM - 3:00 PM</p>
              <p className="pt-2 font-semibold text-white">Saturday &amp; Evenings</p>
              <p>Appointments available by request</p>
              <p className="pt-2">Sunday: Closed</p>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <Link
                  href="/quote"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Shop Hardware
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="text-secondary-foreground/80 hover:text-white transition-colors"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + payment */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-foreground/80">Follow Us:</span>
              <a
                href={BUSINESS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Critzer's Cabinet Creations on Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={BUSINESS.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Critzer's Cabinet Creations on X (Twitter)"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={BUSINESS.houzzUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary-foreground/80 hover:text-white transition-colors underline"
              >
                {BUSINESS.houzzRating} stars on Houzz
              </a>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-foreground/80">We Accept:</span>
              <img
                src="/images/payment-cards.jpg"
                alt="Accepted payment methods: Visa, Mastercard, American Express, and Discover"
                className="h-8 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-secondary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.legalName} All Rights Reserved.
          </p>
          <p className="mt-1">
            Serving Charlottesville, Albemarle County, Greene County, Fluvanna County,
            Nelson County, and Louisa County, Virginia.
          </p>
        </div>
      </div>
    </footer>
  );
}
