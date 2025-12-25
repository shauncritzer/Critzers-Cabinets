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

      {/* Hero Section with Kitchen Background */}
      <section className="relative bg-gradient-to-b from-secondary/30 to-background py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/images/gallery/omega-classic-white-kitchen.jpg')" }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
              Serving Charlottesville Since 1986
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About Critzer's Cabinet Creations
            </h1>
            <p className="text-lg text-muted-foreground">
              A family-owned business bringing four decades of expertise, 
              dedication, and unparalleled customer service to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section - MOVED TO TOP */}
      <section className="bg-secondary/20 py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three generations of the Critzer family working together to bring your cabinet dreams to life
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Larry Critzer - WITH REAL PHOTO */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/team/larry-critzer.png" 
                    alt="Larry Critzer"
                    className="w-full h-full object-cover object-top"
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

              {/* Dana Quick - WITH REAL PHOTO */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/team/dana-quick.png" 
                    alt="Dana Quick"
                    className="w-full h-full object-cover object-top"
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

              {/* Shaun Critzer - WITH REAL PHOTO */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/team/shaun-critzer.png" 
                    alt="Shaun Critzer"
                    className="w-full h-full object-cover object-top"
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

      {/* Cabinetry Showcase Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Craftsmanship You Can Trust</h2>
              <p className="text-muted-foreground">
                Every kitchen we design reflects our commitment to quality and attention to detail. 
                From traditional to contemporary styles, we work with you to create spaces that 
                are both beautiful and functional.
              </p>
              <Link href="/gallery">
                <Button variant="outline" className="gap-2">
                  View Our Gallery <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/gallery/omega-traditional-cherry.jpg" 
                alt="Traditional cherry kitchen cabinets"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Story with Image */}
      <section className="bg-secondary/10 py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                <img 
                  src="/images/gallery/omega-modern-gray.jpg" 
                  alt="Modern gray kitchen design"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-3xl font-bold">Who We Are</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p>
                    Critzer's Cabinet Creations, Inc. is family-owned and operated and has been in business since 1986. 
                    We try hard to earn and keep our customers' respect and trust by offering courteous service at an 
                    honest value.
                  </p>
                  <p>
                    With every Critzer "creation" comes the pride of workmanship and dedication to providing 
                    unparalleled customer service and satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services with Cabinetry Image */}
      <section className="container py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">What We Offer</h2>
              <p className="text-muted-foreground">
                As authorized dealers for <strong>Omega Cabinetry</strong> and <strong>Wolf Cabinetry</strong>, we offer 
                semi-custom and stock cabinet options for any room in your home or office. We also provide a wide selection 
                of countertops including granite, marble, quartz, soapstone, and solid surface options.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/gallery/omega-transitional-white.jpg" 
                alt="Transitional white kitchen"
                className="w-full h-80 object-cover"
              />
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
                <h3 className="font-semibold mb-2">Omega & Wolf Cabinetry</h3>
                <p className="text-sm text-muted-foreground">
                  Authorized dealer of premium semi-custom and stock cabinets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Stone Countertops</h3>
                <p className="text-sm text-muted-foreground">
                  Granite, marble, quartz, soapstone, and solid surface options
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
                <h3 className="font-semibold mb-2">Top Knobs Hardware</h3>
                <p className="text-sm text-muted-foreground">
                  Over 7,000 premium knobs, pulls, and accessories online
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">40+ Years Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Four decades of proven expertise and reliability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Partners with Images */}
      <section className="bg-secondary/10 py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Our Partners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We proudly partner with industry-leading manufacturers to bring you the best products
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/gallery/omega-farmhouse-rustic.jpg" 
                    alt="Omega Cabinetry example"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 text-center space-y-4">
                  <h3 className="text-2xl font-bold">Omega Cabinetry</h3>
                  <p className="text-muted-foreground">
                    We are an authorized dealer of Omega Cabinetry from Waterloo, Iowa. 
                    Omega offers semi-custom and stock cabinet options with exceptional quality 
                    and endless customization possibilities for every room in your home.
                  </p>
                  <a href="https://www.omegacabinetry.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-block">
                    Visit Omega Cabinetry →
                  </a>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/gallery/omega-coastal-blue.jpg" 
                    alt="Top Knobs hardware on cabinets"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 text-center space-y-4">
                  <h3 className="text-2xl font-bold">Top Knobs</h3>
                  <p className="text-muted-foreground">
                    As an authorized Top Knobs dealer, we offer their complete line of 
                    premium cabinet hardware including knobs, pulls, hinges, and accessories. 
                    Browse our online store for over 7,000 products.
                  </p>
                  <Link href="/shop" className="text-primary hover:underline inline-block">
                    Shop Hardware →
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Visit Our Showroom</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop by to see cabinet samples, browse countertop options, and discuss your project with our team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-left">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>661 Berkmar Court, Charlottesville, VA</span>
                </div>
                <a href="tel:+14349731691" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>(434) 973-1691</span>
                </a>
                <a href="mailto:critzerscabinets@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>critzerscabinets@gmail.com</span>
                </a>
              </div>

              <p className="text-sm text-muted-foreground">
                <strong>Hours:</strong> Monday - Friday: 10AM - 3PM | Saturday & Sunday: Closed
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/quote">
                  <Button size="lg" className="gap-2">
                    Get Your Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="tel:+14349731691">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" /> Call Us
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
