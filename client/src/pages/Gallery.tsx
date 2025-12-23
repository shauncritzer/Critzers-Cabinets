import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Gallery() {
  const { data: galleryItems, isLoading } = trpc.gallery.getAll.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Critzer's Cabinets Logo" className="h-10 w-10" />
              <span className="text-xl font-bold">Critzer's Cabinets</span>
            </a>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container py-12">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Our Work</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of custom cabinet projects. Four decades of craftsmanship, 
              one satisfied customer at a time.
            </p>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : galleryItems && galleryItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative aspect-square bg-muted">
                    {item.afterImageUrl ? (
                      <img
                        src={item.afterImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image available
                      </div>
                    )}
                    {item.beforeImageUrl && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Before/After
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {item.roomType && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {item.roomType}
                        </span>
                      )}
                      {item.style && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {item.style}
                        </span>
                      )}
                      {item.cabinetType && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {item.cabinetType}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-20 text-center">
                <h3 className="text-lg font-semibold mb-2">Gallery Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  We're currently building our project gallery. Check back soon to see our work!
                </p>
                <Link href="/quote">
                  <Button>Start Your Project</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground mt-12">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Create Your Dream Space?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Let's bring your vision to life with custom cabinets designed and built just for you.
              </p>
              <Link href="/quote">
                <Button size="lg" variant="secondary">
                  Get Your Free Quote
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
