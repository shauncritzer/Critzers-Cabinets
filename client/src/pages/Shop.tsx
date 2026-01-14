import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";

const PRODUCT_TYPES = [
  {
    name: "Cabinet Pulls",
    image: "/images/topknobs/bar-pulls-collection.jpg",
    description: "Elegant pulls in various lengths and finishes",
    link: "https://www.topknobs.com/collections/pulls"
  },
  {
    name: "Cabinet Knobs",
    image: "/images/topknobs/lynwood-collection.jpg",
    description: "Classic and contemporary knob designs",
    link: "https://www.topknobs.com/collections/knobs"
  },
  {
    name: "Appliance Pulls",
    image: "/images/topknobs/transcend-collection.jpg",
    description: "Oversized pulls for refrigerators and appliances",
    link: "https://www.topknobs.com/collections/appliance-pulls"
  },
];

const COLLECTIONS = [
  {
    name: "Serene Collection",
    image: "/images/topknobs/serene-collection.jpg",
    description: "Flowing organic shapes inspired by nature",
  },
  {
    name: "Bar Pulls Collection",
    image: "/images/topknobs/bar-pulls-collection.jpg",
    description: "Classic bar pulls in multiple finishes",
  },
  {
    name: "Riverside Collection",
    image: "/images/topknobs/riverside-collection.jpg",
    description: "Transitional style with clean lines",
  },
  {
    name: "Transcend Collection",
    image: "/images/topknobs/transcend-collection.jpg",
    description: "Contemporary designs for modern spaces",
  },
  {
    name: "Lynwood Collection",
    image: "/images/topknobs/lynwood-collection.jpg",
    description: "Warm traditional knobs and pulls",
  },
  {
    name: "Mercer Collection",
    image: "/images/topknobs/mercer-collection.jpg",
    description: "Industrial-inspired hardware",
  },
  {
    name: "Chareau Collection",
    image: "/images/topknobs/chareau-collection.jpg",
    description: "Art deco elegance and sophistication",
  },
  {
    name: "Cumberland Collection",
    image: "/images/topknobs/cumberland-collection.jpg",
    description: "Refined traditional styling",
  },
];

const STYLES = [
  {
    name: "Contemporary",
    description: "Clean lines and minimalist design",
  },
  {
    name: "Knurled",
    description: "Textured grip with modern appeal",
  },
  {
    name: "Traditional",
    description: "Timeless classic elegance",
  },
  {
    name: "Transitional",
    description: "Perfect blend of old and new",
  },
];

export default function Shop() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16 border-b">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/images/topknobs-logo.png" 
                alt="Top Knobs" 
                className="h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-4xl font-bold">TOP KNOBS</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Decorative Hardware Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Shop 7,000+ hardware options online. Knobs, pulls, and handles in dozens of finishes and styles.
            </p>
          </div>
        </div>
      </section>

      {/* Browse by Product Type */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Browse Top Knobs</h2>
            <p className="text-muted-foreground">Start by selecting your product type</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRODUCT_TYPES.map((type) => (
              <Card key={type.name} className="group hover:shadow-lg transition-shadow overflow-hidden border-2 hover:border-primary/50">
                <div className="aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={type.image} 
                    alt={type.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact for Pricing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Collections */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Shop by Popular Collections</h2>
            <p className="text-muted-foreground">Explore our most sought-after hardware collections</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((collection) => (
              <Card key={collection.name} className="group hover:shadow-lg transition-all overflow-hidden border hover:border-primary/50">
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-1">{collection.name}</h3>
                  <p className="text-xs text-muted-foreground">{collection.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Styles */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Shop by Trending Styles</h2>
            <p className="text-muted-foreground">Find hardware that matches your design aesthetic</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {STYLES.map((style) => (
              <Card key={style.name} className="group hover:shadow-lg transition-all border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{style.description}</p>
                  <Link href="/contact">
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore Style
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Transform Your Cabinets?</h2>
            <p className="text-lg text-muted-foreground">
              Contact us today to discuss your hardware needs. Our team will help you select the perfect 
              Top Knobs products for your project and provide competitive pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="min-w-[200px]">
                  Get a Quote
                </Button>
              </Link>
              <a 
                href="https://www.topknobs.com/view-catalog" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  View Full Catalog
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Authorized Top Knobs Dealer • 7,000+ Products Available • Expert Design Consultation
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
