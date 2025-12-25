import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Shared Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
              Serving Charlottesville Since 1986
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About Critzer's Cabinet Creations
            </h1>
            <p className="text-lg text-muted-foreground">
              A family-owned business bringing four decades of craftsmanship, 
              dedication, and unparalleled customer service to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Who We Are</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Critzer's Cabinet Creations, Inc. is family-owned and operated and has been in business since 1986. 
                We try hard to earn and keep our customers' respect and trust by offering courteous service at an 
                honest value. With every Critzer "creation" comes the pride of workmanship and dedication to providing 
                unparalleled customer service and satisfaction.
              </p>
              <p>
                We offer cabinetry for any room in your home or office in all price ranges from wood to laminate, 
                full custom to stock. We offer many different styles of countertops, from custom laminates to solid 
                surfaces as well as granite, marbles and soapstone. Whether you are planning to build a new home or 
                remodel, we can supply cabinetry for any room in your home or office. Our line of quality cabinets 
                and countertops offers you choice and convenience all to suit your budget.
              </p>
            </div>
          </div>

          {/* Services Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Professional Design</h3>
                <p className="text-sm text-muted-foreground">
                  Expert kitchen and bath design services tailored to your vision
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Omega Cabinetry</h3>
                <p className="text-sm text-muted-foreground">
                  Authorized dealer of Omega semi-custom and stock cabinets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Custom Countertops</h3>
                <p className="text-sm text-muted-foreground">
                  Laminate, solid surface, granite, marble, and soapstone
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Installation Coordination</h3>
                <p className="text-sm text-muted-foreground">
                  We coordinate professional installation for your project
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  For commercial, residential contractors, and DIY'ers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">40+ Years Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Four decades of proven craftsmanship and reliability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-secondary/20 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three generations of the Critzer family working together to bring your cabinet dreams to life
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Larry Critzer */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <img 
                    src="https://critzerscabinets.com/images/team/larry_critzer.jpg" 
                    alt="Larry Critzer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">👨‍💼</div>';
                    }}
                  />
                </div>
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-xl">Larry Critzer</h3>
                  <p className="text-sm font-medium text-primary">Owner & President</p>
                  <p className="text-sm text-muted-foreground">
                    Founded the company in 1986 with 45+ years of experience in sales and design. 
                    Born and raised in Charlottesville, Larry's passion is working with clients to 
                    design their projects and make them a reality.
                  </p>
                </CardContent>
              </Card>

              {/* Dana Quick */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <img 
                    src="https://critzerscabinets.com/images/team/dana_quick.jpg" 
                    alt="Dana Quick"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">👩‍💼</div>';
                    }}
                  />
                </div>
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-xl">Dana Quick</h3>
                  <p className="text-sm font-medium text-primary">Sales & Design</p>
                  <p className="text-sm text-muted-foreground">
                    Working alongside her family since 1997, Dana brings a people-first approach to design. 
                    She's fascinated by Charlottesville's history and architecture, creating lifetime designs 
                    that accommodate everyone's unique needs.
                  </p>
                </CardContent>
              </Card>

              {/* Shaun Critzer */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <img 
                    src="https://critzerscabinets.com/images/team/shaun_critzer.jpg" 
                    alt="Shaun Critzer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">👨‍💼</div>';
                    }}
                  />
                </div>
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold text-xl">Shaun Critzer</h3>
                  <p className="text-sm font-medium text-primary">Sales, Design & Business Development</p>
                  <p className="text-sm text-muted-foreground">
                    Growing up in the family business since 1985, Shaun officially joined in 2002. 
                    He combines traditional craftsmanship with modern technology, helping clients turn 
                    ideas into reality while developing innovative business solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="container py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We proudly partner with industry-leading manufacturers to bring you the best products
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Omega Cabinetry</h3>
                <p className="text-muted-foreground">
                  We are an authorized dealer of Omega Cabinetry from Waterloo, Iowa. 
                  Omega offers semi-custom and stock cabinet options with exceptional quality 
                  and endless customization possibilities for every room in your home.
                </p>
                <a href="https://www.omegacabinetry.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Visit Omega Cabinetry →
                </a>
              </div>
            </Card>
            <Card className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Top Knobs</h3>
                <p className="text-muted-foreground">
                  As an authorized Top Knobs dealer, we offer their complete line of 
                  premium cabinet hardware including knobs, pulls, hinges, and accessories. 
                  Browse our online store for over 7,000 products.
                </p>
                <Link href="/shop" className="text-primary hover:underline">
                  Shop Hardware →
                </Link>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Visit our showroom at <strong>661 Berkmar Court, Charlottesville, VA</strong> to see samples and discuss your project
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get an instant quote with our online consultation system, or contact us directly 
                to discuss your custom cabinet needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quote">
                  <Button size="lg" className="gap-2">
                    Get Your Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="tel:+14349731691">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" /> (434) 973-1691
                  </Button>
                </a>
              </div>
              <div className="pt-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>661 Berkmar Court, Charlottesville, VA</span>
                </div>
                <a href="mailto:info@critzerscabinets.com" className="flex items-center justify-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>info@critzerscabinets.com</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary"></div>
                <span className="font-bold">Critzer's Cabinets</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Family-owned & operated since 1986
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/quote" className="hover:text-foreground">Get a Quote</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>(434) 973-1691</li>
                <li>info@critzerscabinets.com</li>
                <li>661 Berkmar Court</li>
                <li>Charlottesville, VA</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hours</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Monday - Friday: 9AM - 5PM</li>
                <li>Saturday: By Appointment</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Critzer's Cabinet Creations, Inc. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
