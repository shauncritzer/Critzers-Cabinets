import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, ChevronDown, Phone, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BUSINESS } from "@shared/business";

interface NavigationProps {
  transparent?: boolean; // For hero sections with background images
}

/** Dedicated service landing pages surfaced in the Services dropdown. */
const SERVICE_LINKS = [
  {
    href: "/services/cabinet-refacing",
    label: "Cabinet Refacing",
    blurb: "New doors in days, not months",
  },
  {
    href: "/services/cabinet-repair",
    label: "Cabinet Repair",
    blurb: "Doors, drawers, hinges, water damage",
  },
  {
    href: "/services/countertop-replacement",
    label: "Countertop Replacement",
    blurb: "Authorized Cambria quartz dealer",
  },
  {
    href: "/services/hardware-upgrades",
    label: "Hardware Upgrades",
    blurb: "7,000+ Top Knobs options",
  },
  {
    href: "/services/closet-pantry-design",
    label: "Closet & Pantry Design",
    blurb: "Custom storage that fits your life",
  },
  {
    href: "/services/kitchen-bath-remodeling",
    label: "Full Kitchen & Bath Remodeling",
    blurb: "One team, start to finish",
  },
];

const PRIMARY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop Hardware" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation({ transparent = false }: NavigationProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get cart count
  const { data: cartData } = trpc.cart.getCart.useQuery(
    {},
    {
      retry: false,
    }
  );
  const cartCount = cartData?.items?.length || 0;

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  // Close the desktop dropdown on outside click or Escape
  useEffect(() => {
    if (!isServicesOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsServicesOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isServicesOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const isActive = (href: string) => location === href;
  const isServicesActive = location.startsWith("/services");

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsServicesOpen(false), 150);
  };

  // Determine background style
  const bgClass =
    transparent && !isScrolled
      ? "bg-secondary/95 backdrop-blur-sm"
      : "bg-secondary shadow-md";

  const linkClass = (active: boolean) =>
    `text-sm font-medium transition-colors ${
      active ? "text-white" : "text-secondary-foreground/80 hover:text-white"
    }`;

  return (
    <>
      {/* Utility bar: hours + click-to-call, a strong local SEO / conversion signal */}
      <div className="bg-primary text-primary-foreground text-xs md:text-sm">
        <div className="container flex flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-1 py-1.5 text-center">
          <p>
            <span className="font-semibold">Mon-Fri 10:00 AM - 3:00 PM</span>
            <span className="hidden sm:inline">
              {" "}
              &middot; Saturday &amp; evening appointments by request
            </span>
          </p>
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {BUSINESS.phone}
          </a>
        </div>
      </div>

      <nav
        className={`${bgClass} border-b border-white/10 sticky top-0 z-50 transition-all duration-300`}
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Critzer's Cabinet Creations logo"
                className="h-10 w-10 md:h-12 md:w-12"
                width="48"
                height="48"
              />
              <span className="text-lg md:text-xl font-bold text-secondary-foreground">
                Critzer's Cabinets
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Services dropdown */}
              <div
                className="relative"
                ref={servicesRef}
                onMouseEnter={openServices}
                onMouseLeave={scheduleCloseServices}
              >
                <button
                  type="button"
                  className={`${linkClass(isServicesActive)} inline-flex items-center gap-1`}
                  onClick={() => setIsServicesOpen(open => !open)}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                >
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isServicesOpen && (
                  <div className="absolute left-0 top-full pt-3 w-80 z-50">
                    <div className="bg-background rounded-lg shadow-xl border overflow-hidden">
                      <Link
                        href="/services"
                        className="block px-4 py-3 border-b bg-muted/40 hover:bg-muted transition-colors"
                      >
                        <span className="font-semibold text-foreground">
                          All Services
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Overview of everything we do
                        </span>
                      </Link>
                      {SERVICE_LINKS.map(service => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="block px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                        >
                          <span className="font-medium text-foreground">
                            {service.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {service.blurb}
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/refresh"
                        className="flex items-start gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Sparkles
                          className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-semibold text-primary">
                            Refresh Services
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Transform your kitchen in days, not months
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/refresh" className={linkClass(isActive("/refresh"))}>
                Refresh
              </Link>
              <Link href="/products" className={linkClass(isActive("/products"))}>
                Products
              </Link>
              {PRIMARY_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(isActive(link.href))}
                >
                  {link.label}
                </Link>
              ))}

              {/* Cart Icon */}
              <Link href="/cart" className="relative" aria-label="Shopping cart">
                <ShoppingCart
                  className="h-5 w-5 text-secondary-foreground/80 hover:text-white transition-colors"
                  aria-hidden="true"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* CTA Button */}
              <Link href="/quote">
                <Button className="bg-primary hover:bg-primary/90">Get a Quote</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
              <a
                href={BUSINESS.phoneHref}
                className="text-secondary-foreground/80 hover:text-white"
                aria-label={`Call ${BUSINESS.phone}`}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
              </a>

              {/* Mobile Cart Icon */}
              <Link href="/cart" className="relative" aria-label="Shopping cart">
                <ShoppingCart
                  className="h-5 w-5 text-secondary-foreground/80"
                  aria-hidden="true"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-secondary-foreground p-2"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-secondary border-t border-white/10 animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
            <div className="container py-4 space-y-1">
              <Link
                href="/"
                className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  location === "/"
                    ? "bg-white/10 text-white"
                    : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                Home
              </Link>

              {/* Collapsible services group */}
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen(open => !open)}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isServicesActive
                    ? "bg-white/10 text-white"
                    : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                }`}
                aria-expanded={isMobileServicesOpen}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isMobileServicesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isMobileServicesOpen && (
                <div className="pl-4 space-y-1 border-l border-white/10 ml-4">
                  <Link
                    href="/services"
                    className="block py-2.5 px-4 rounded-lg text-sm text-secondary-foreground/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    All Services
                  </Link>
                  {SERVICE_LINKS.map(service => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block py-2.5 px-4 rounded-lg text-sm transition-colors ${
                        isActive(service.href)
                          ? "bg-white/10 text-white"
                          : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/refresh"
                className={`block py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  isActive("/refresh")
                    ? "bg-white/10 text-white"
                    : "text-primary hover:bg-white/5"
                }`}
              >
                Refresh Services — days, not months
              </Link>

              {[{ href: "/products", label: "Products" }, ...PRIMARY_LINKS].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/quote"
                className="block py-3 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center mt-4"
              >
                Get a Quote
              </Link>
              <a
                href={BUSINESS.phoneHref}
                className="block py-3 px-4 rounded-lg text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors text-center"
              >
                Call {BUSINESS.phone}
              </a>
              <p className="text-xs text-secondary-foreground/60 text-center pt-3">
                Mon-Fri 10:00 AM - 3:00 PM
                <br />
                Saturday &amp; evening appointments by request
              </p>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
