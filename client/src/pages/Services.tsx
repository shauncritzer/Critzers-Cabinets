import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Ruler, Palette, Hammer, Package, Truck, Wrench } from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/images/gallery/KL9ldeZDUcbT.jpg')" }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-bold">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive kitchen and bath solutions from design to installation
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Ruler className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Professional Design</CardTitle>
                <CardDescription>Expert kitchen & bath design services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Free initial consultation</li>
                  <li>✓ 3D computer-aided design</li>
                  <li>✓ Space planning and layout</li>
                  <li>✓ Material and finish selection</li>
                  <li>✓ Budget-conscious options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Custom Cabinetry</CardTitle>
                <CardDescription>Quality cabinets built to your specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Custom, semi-custom, and stock options</li>
                  <li>✓ Multiple wood species and finishes</li>
                  <li>✓ Soft-close hinges and drawer glides</li>
                  <li>✓ Specialty storage solutions</li>
                  <li>✓ Lifetime limited warranty</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Countertop Fabrication</CardTitle>
                <CardDescription>Custom countertops in premium materials</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Granite, marble, and quartz</li>
                  <li>✓ Custom laminate options</li>
                  <li>✓ Precision templating and cutting</li>
                  <li>✓ Edge profile selection</li>
                  <li>✓ Factory warranty included</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Hammer className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Professional Installation</CardTitle>
                <CardDescription>Expert installation by experienced craftsmen</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Licensed and insured installers</li>
                  <li>✓ Precise cabinet installation</li>
                  <li>✓ Countertop installation and sealing</li>
                  <li>✓ Hardware installation</li>
                  <li>✓ Final adjustments and quality check</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Delivery & Logistics</CardTitle>
                <CardDescription>Careful handling and timely delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Scheduled delivery coordination</li>
                  <li>✓ Protected transport</li>
                  <li>✓ On-site inspection</li>
                  <li>✓ Debris removal</li>
                  <li>✓ Project timeline management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Hardware Selection</CardTitle>
                <CardDescription>Perfect finishing touches for your project</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ 7,000+ Top Knobs options</li>
                  <li>✓ In-store samples and displays</li>
                  <li>✓ Online shopping available</li>
                  <li>✓ Style and finish coordination</li>
                  <li>✓ Free shipping on orders $100+</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Our Process</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Consultation & Design</h3>
                <p className="text-muted-foreground">
                  Meet with our designers to discuss your vision, needs, and budget. We'll create detailed 3D designs
                  and provide material samples for your review.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Measurement & Planning</h3>
                <p className="text-muted-foreground">
                  Precise field measurements ensure perfect fit. We'll finalize your design, select materials,
                  and provide a detailed quote with timeline.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fabrication & Ordering</h3>
                <p className="text-muted-foreground">
                  Your cabinets are built to order and countertops are custom fabricated. We coordinate all
                  deliveries and keep you updated on progress.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional Installation</h3>
                <p className="text-muted-foreground">
                  Our experienced installers bring your design to life with precision and care. Final walkthrough
                  ensures everything meets your expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Service Area</h2>
            <p className="text-lg text-muted-foreground">
              Proudly serving Charlottesville and surrounding areas including Albemarle County, 
              Greene County, Fluvanna County, and beyond. Contact us to confirm service availability 
              in your area.
            </p>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6">
              <p className="text-xl font-bold text-emerald-800 mb-2">✨ FREE Design Consultation</p>
              <p className="text-emerald-700 mb-4">
                Schedule your complimentary consultation with our expert designers today!
              </p>
              <Link href="/quote">
                <Button size="lg">Get Your Free Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Critzer's?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>40 Years of Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Since 1986, we've been helping Charlottesville families transform their kitchens and baths
                  with quality craftsmanship and personalized service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family-Owned & Operated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As a local family business, we treat every project as if it were our own home. Your satisfaction
                  is our reputation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authorized Dealer Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Direct partnerships with Omega, Wolf, and Top Knobs ensure competitive pricing and
                  manufacturer warranties on all products.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complete Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From initial design to final installation, we coordinate every detail so you can enjoy
                  a stress-free renovation experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Let's discuss your kitchen or bath project and create a custom solution that fits your style and budget
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="secondary">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
