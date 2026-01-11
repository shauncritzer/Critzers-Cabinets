import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import { Facebook, Twitter } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shared Navigation */}
      <Navigation transparent />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Welcome Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full font-semibold mb-4">
              Family-Owned & Operated Since 1986
            </div>
            <h2 className="text-4xl font-bold text-foreground">Welcome to Critzer's Cabinet Creations</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For <strong>40 years</strong>, Critzer's Cabinet Creations has been Charlottesville's trusted kitchen and bath design center.
              We offer a wide selection of quality cabinet lines, with <a href="https://www.omegacabinetry.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Omega Cabinetry</a> and <a href="https://www.wolfhomeproducts.com/kitchen-cabinetry/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Wolf Home Products</a> as our preferred brands. We're also an authorized dealer for <a href="https://www.topknobs.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Top Knobs</a> decorative hardware.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From professional design consultations to instant online hardware shopping, we bring four decades of experience
              into the digital age. Get your custom cabinet design quote in minutes, not days.
            </p>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 my-8">
              <p className="text-xl font-bold text-emerald-800 mb-2">FREE Design Consultation</p>
              <p className="text-emerald-700">Schedule your complimentary consultation with our expert designers today!</p>
            </div>
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

      {/* Commercial Video Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">See Our Craftsmanship in Action</h2>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                controls
                autoPlay
                muted
                loop
              >
                <source src="https://files.manuscdn.com/user_upload_by_module/session_file/96788853/rrbxjupqbtreOPuY.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Watch our 30-second commercial showcasing 40 years of quality craftsmanship
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-4 gap-8">
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
                <CardTitle className="text-2xl">Quality Cabinetry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Authorized dealer for Omega and Wolf cabinetry - offering everything from full custom to stock options
                  in a wide range of wood species and finishes.
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
            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl">Hardware Store</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Shop premium Top Knobs cabinet hardware online. Free shipping on orders $100+, with fast delivery.
                </CardDescription>
                <Link href="/shop">
                  <Button className="mt-4">Shop Now</Button>
                </Link>
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
                <div>
                  <Link href="/shipping-policy" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </div>
                <div>
                  <Link href="/return-policy" className="text-secondary-foreground/80 hover:text-white transition-colors">
                    Return Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Social Media & Payment Methods */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary-foreground/80">Follow Us:</span>
                <a 
                  href="https://www.facebook.com/critzerscabinets" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/critzerscabinets" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Twitter/X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary-foreground/80">We Accept:</span>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white rounded text-xs font-bold text-slate-800">VISA</div>
                  <div className="px-3 py-1 bg-white rounded text-xs font-bold text-slate-800">MC</div>
                  <div className="px-3 py-1 bg-white rounded text-xs font-bold text-slate-800">AMEX</div>
                  <div className="px-3 py-1 bg-white rounded text-xs font-bold text-slate-800">DISC</div>
                  <div className="px-3 py-1 bg-white/10 border border-white/30 rounded text-xs font-bold">CASH</div>
                  <div className="px-3 py-1 bg-white/10 border border-white/30 rounded text-xs font-bold">CHECK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-secondary-foreground/60">
            <p>© 2025 Critzer's Cabinet Creations, Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
