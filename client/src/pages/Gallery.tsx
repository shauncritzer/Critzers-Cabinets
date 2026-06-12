import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";

// Simple hardcoded gallery - no database needed
const galleryItems = [
  {
    id: 1,
    title: "Modern White Kitchen Transformation",
    description: "Complete kitchen remodel featuring clean white cabinetry with modern hardware and sleek countertops",
    imageUrl: "/manus-storage/ubBFg9QkproG_6e8e5f9e.jpg",
    tags: ["Kitchen", "modern", "full_kitchen"]
  },
  {
    id: 2,
    title: "Traditional Cherry Cabinets",
    description: "Classic cherry wood cabinetry with ornate details and traditional styling",
    imageUrl: "/manus-storage/3HrP0H3BuW7m_64e8f8f7.jpg",
    tags: ["Kitchen", "traditional", "full_kitchen"]
  },
  {
    id: 3,
    title: "Rustic Farmhouse Kitchen",
    description: "Warm farmhouse style with distressed finishes and vintage-inspired hardware",
    imageUrl: "/manus-storage/7nAUkEFBXEaf_785b0bb9.jpg",
    tags: ["Kitchen", "rustic", "full_kitchen"]
  },
  {
    id: 4,
    title: "Contemporary Gray Kitchen",
    description: "Sleek contemporary design with gray cabinetry and minimalist aesthetic",
    imageUrl: "/manus-storage/FbkkkCWXInZS_8d8f4666.jpg",
    tags: ["Kitchen", "modern", "full_kitchen"]
  },
  {
    id: 5,
    title: "Classic Oak Cabinetry",
    description: "Timeless oak cabinets with natural wood grain and traditional craftsmanship",
    imageUrl: "/manus-storage/KL9ldeZDUcbT_5b827923.jpg",
    tags: ["Kitchen", "traditional", "full_kitchen"]
  },
  {
    id: 6,
    title: "Shaker Style Kitchen",
    description: "Clean-lined Shaker cabinets with simple elegance and functional design",
    imageUrl: "/manus-storage/RHHoKWmplcBC_6685e73b.jpg",
    tags: ["Kitchen", "shaker", "full_kitchen"]
  },
  {
    id: 7,
    title: "Custom Bathroom Vanity",
    description: "Elegant bathroom vanity with custom storage solutions and premium finishes",
    imageUrl: "/manus-storage/bt6Vi4lpCf4B_2a2f6618.jpg",
    tags: ["Bathroom", "modern", "vanity"]
  },
  {
    id: 8,
    title: "Transitional Kitchen Design",
    description: "Perfect blend of traditional and contemporary elements for a timeless look",
    imageUrl: "/manus-storage/53H0NAM0eSvE_b8778d83.webp",
    tags: ["Kitchen", "transitional", "full_kitchen"]
  },
  {
    id: 9,
    title: "Luxury Modern Kitchen",
    description: "High-end modern kitchen with premium materials and sophisticated design",
    imageUrl: "/manus-storage/luxury-modern-kitchen_74adb0fd.webp",
    tags: ["Kitchen", "modern", "full_kitchen"]
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      {/* Shared Navigation */}
      <Navigation />

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

          {/* Gallery Grid - Always shows 9 images */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
