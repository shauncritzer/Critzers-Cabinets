import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center min-h-[600px] flex flex-col"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hero-bg.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        {/* Navigation Bar */}
        <nav className="bg-secondary/95 backdrop-blur-sm border-b border-white/10">
          <div className="container">
            <div className="flex items-center justify-between py-4">
              <Link href="/" className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Critzer's Cabinets Logo" className="h-12 w-12" />
                <span className="text-xl font-bold text-secondary-foreground">Critzer's Cabinets</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/about" className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/shop" className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">
                  Shop Hardware
                </Link>
                <Link href="/gallery" className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">
                  Gallery
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/quote">
                  <Button className="bg-primary hover:bg-primary/90">Get a Quote</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                Critzer's Cabinet Creations
              </h1>
              <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
                Serving Charlottesville and Surrounding Areas Since 1986
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-foreground">Welcome to Critzer's Cabinet Creations</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Critzer's Cabinet Creations, Inc. is family-owned and operated and has been in business since 1986. 
              We try hard to earn and keep our customers respect and trust by offering courteous service at an honest value. 
              With every Critzer "creation" comes the pride of workmanship and dedication to providing unparalleled customer 
              service and satisfaction.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From hand-drawn designs to instant online quotes, Critzer's Cabinet Creations brings four decades of craftsmanship 
              into the digital age. Get your custom cabinet quote in minutes, not days.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/quote">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Your Free Quote
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Kitchen & Bath Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Professional design services to bring your vision to life with expert guidance and modern tools.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Custom Cabinets</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  High-quality, custom-built cabinetry tailored to your space, from wood to laminate, full custom to stock.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Custom Countertops</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  A wide selection of materials including granite, marble, quartz, and custom laminates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Transform Your Space?</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Get an instant preliminary quote with our expert consultation system, or browse our hardware store 
            to find the perfect finishing touches for your project.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="secondary">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Shop Hardware
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Critzer's Cabinet Creations</h3>
              <p className="text-sm text-secondary-foreground/80">
                Family-owned and operated since 1986, serving Charlottesville and surrounding areas with 
                quality craftsmanship and dedication.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm text-secondary-foreground/80">
                <p>661 Berkmar Court</p>
                <p>Charlottesville, VA</p>
                <p>Phone: <a href="tel:+14349731691" className="hover:text-white transition-colors">(434) 973-1691</a></p>
                <p>Fax: <a href="tel:+14349739712" className="hover:text-white transition-colors">(434) 973-9712</a></p>
                <p>Email: <a href="mailto:info@critzerscabinets.com" className="hover:text-white transition-colors">info@critzerscabinets.com</a></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <Link href="/about" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    About Us
                  </Link>
                </div>
                <div>
                  <Link href="/gallery" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    Gallery
                  </Link>
                </div>
                <div>
                  <Link href="/shop" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    Shop Hardware
                  </Link>
                </div>
                <div>
                  <Link href="/quote" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    Get a Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-secondary-foreground/60">
            <p>© 2025 Critzer's Cabinet Creations, Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
