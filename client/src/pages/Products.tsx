import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-bold">Our Products</h1>
            <p className="text-xl text-muted-foreground">
              Quality cabinetry, countertops, and hardware from trusted manufacturers
            </p>
          </div>
        </div>
      </section>

      {/* Cabinetry Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Cabinetry</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Authorized dealer for premium cabinet manufacturers offering custom, semi-custom, and stock options
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <div className="text-4xl font-bold text-amber-800">OMEGA</div>
              </div>
              <CardHeader>
                <CardTitle>Omega Cabinetry</CardTitle>
                <CardDescription>Full Custom & Semi-Custom Options</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Wide range of door styles and finishes</li>
                  <li>✓ Multiple wood species available</li>
                  <li>✓ Custom sizing and configurations</li>
                  <li>✓ Quality construction and hardware</li>
                  <li>✓ Lifetime limited warranty</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-4xl font-bold text-white">WOLF</div>
              </div>
              <CardHeader>
                <CardTitle>Wolf Cabinetry</CardTitle>
                <CardDescription>Designer Series & Classic Line</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Contemporary and traditional styles</li>
                  <li>✓ Stock and semi-custom options</li>
                  <li>✓ Quick delivery on stock items</li>
                  <li>✓ Durable finishes and construction</li>
                  <li>✓ Excellent value and quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countertops Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Countertops</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Custom fabrication and installation of premium countertop materials
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Granite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Natural stone with unique patterns. Heat resistant, durable, and timeless.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Marble</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Elegant natural stone perfect for baking areas. Classic luxury appearance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Quartz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Engineered stone that's non-porous and low maintenance. Wide color selection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Laminate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Budget-friendly option with modern patterns and colors. Easy to maintain.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
            <p className="font-bold text-blue-900 mb-2">🛡️ Factory Warranty Included</p>
            <p className="text-sm text-blue-800">
              All countertop installations include manufacturer warranty for your peace of mind
            </p>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Cabinet Hardware</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Premium Top Knobs hardware available for immediate online purchase
          </p>
          
          <Card className="max-w-3xl mx-auto overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-amber-50 to-slate-100 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-slate-800">TOP KNOBS</div>
                <p className="text-lg text-slate-600">Decorative Hardware Collection</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Shop 7,000+ Hardware Options Online</CardTitle>
              <CardDescription>Knobs, pulls, and handles in dozens of finishes and styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Popular Collections:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Devon Collection</li>
                    <li>• Aspen Collection</li>
                    <li>• Nouveau Collection</li>
                    <li>• Tuscany Collection</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Available Finishes:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Brushed Satin Nickel</li>
                    <li>• Polished Chrome</li>
                    <li>• Oil Rubbed Bronze</li>
                    <li>• Flat Black & More</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Link href="/shop">
                  <Button size="lg">Browse Hardware Store</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Schedule a free consultation to discuss your cabinetry, countertop, and hardware needs
          </p>
          <Link href="/quote">
            <Button size="lg" variant="secondary">
              Get Your Free Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
