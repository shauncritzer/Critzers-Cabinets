import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Calculator, Image, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <span className="text-xl font-bold text-foreground">Critzer's Cabinets</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Shop Hardware
            </Link>
            <Link href="/gallery" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Gallery
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/quote">
              <Button>Get a Quote</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              40 Years of Excellence
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Custom Cabinets,
              <br />
              <span className="text-primary">Crafted with Care</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              From hand-drawn designs to AI-powered quotes, Critzer's Cabinet Creations brings 
              four decades of craftsmanship into the digital age. Get your custom cabinet quote 
              in minutes, not days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button size="lg" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Start AI Consultation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl font-bold text-primary">40+</div>
                <div className="text-xl font-semibold">Years of Experience</div>
                <div className="text-muted-foreground">Family-owned & operated since 1986</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered system makes getting a custom cabinet quote faster and easier than ever
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Consultation</CardTitle>
              <CardDescription>
                Chat with our AI assistant to describe your project, room dimensions, and style preferences
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Instant Quote</CardTitle>
              <CardDescription>
                Get a preliminary price estimate instantly based on your specifications and material choices
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Design Review</CardTitle>
              <CardDescription>
                Upload inspiration photos and work with our team to refine your custom design
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Expert Craftsmanship</CardTitle>
              <CardDescription>
                Our experienced team brings your vision to life with quality materials and precision
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Transform Your Space?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Start your custom cabinet project today with our AI-powered consultation. 
              Get a quote in minutes and see why families have trusted us for 40 years.
            </p>
            <Link href="/quote">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Your Free Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded bg-primary"></div>
                <span className="font-bold">Critzer's Cabinets</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Serving Charlottesville and surrounding areas since 1986
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/quote" className="hover:text-foreground">Get a Quote</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Charlottesville, VA</li>
                <li>info@critzerscabinets.com</li>
                <li>40 years of excellence</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Critzer's Cabinet Creations. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
