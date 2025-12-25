import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface NavigationProps {
  transparent?: boolean; // For hero sections with background images
}

export default function Navigation({ transparent = false }: NavigationProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get cart count
  const { data: cartData } = trpc.cart.getCart.useQuery({}, {
    retry: false,
  });
  const cartCount = cartData?.items?.length || 0;

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/shop", label: "Shop Hardware" },
    { href: "/gallery", label: "Gallery" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isActive = (href: string) => location === href;

  // Determine background style
  const bgClass = transparent && !isScrolled
    ? "bg-secondary/95 backdrop-blur-sm"
    : "bg-secondary shadow-md";

  return (
    <>
      <nav className={`${bgClass} border-b border-white/10 sticky top-0 z-50 transition-all duration-300`}>
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/logo.png" 
                alt="Critzer's Cabinets Logo" 
                className="h-10 w-10 md:h-12 md:w-12" 
              />
              <span className="text-lg md:text-xl font-bold text-secondary-foreground">
                Critzer's Cabinets
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href) 
                      ? "text-white" 
                      : "text-secondary-foreground/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-secondary-foreground/80 hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* CTA Button */}
              <Link href="/quote">
                <Button className="bg-primary hover:bg-primary/90">
                  Get a Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-4">
              {/* Mobile Cart Icon */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-secondary-foreground/80" />
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
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-white/10 animate-in slide-in-from-top-2">
            <div className="container py-4 space-y-2">
              <Link 
                href="/" 
                className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  location === "/" 
                    ? "bg-white/10 text-white" 
                    : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                🏠 Home
              </Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href) 
                      ? "bg-white/10 text-white" 
                      : "text-secondary-foreground/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label === "About Us" && "ℹ️ "}
                  {link.label === "Shop Hardware" && "🛒 "}
                  {link.label === "Gallery" && "🖼️ "}
                  {link.label === "Dashboard" && "📊 "}
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/quote" 
                className="block py-3 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center mt-4"
              >
                💬 Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
