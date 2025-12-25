import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Search, Filter, Sparkles, TrendingUp, Home, Layers, TreePine, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

type CollectionType = "best-sellers" | "new-arrivals" | "traditional" | "modern" | "transitional" | "rustic";

const COLLECTIONS: { id: CollectionType; name: string; icon: React.ReactNode; description: string }[] = [
  { id: "best-sellers", name: "Best Sellers", icon: <TrendingUp className="h-4 w-4" />, description: "Our most popular hardware" },
  { id: "new-arrivals", name: "New Arrivals", icon: <Sparkles className="h-4 w-4" />, description: "Latest additions" },
  { id: "traditional", name: "Traditional", icon: <Home className="h-4 w-4" />, description: "Classic elegance" },
  { id: "modern", name: "Modern", icon: <Layers className="h-4 w-4" />, description: "Clean & contemporary" },
  { id: "transitional", name: "Transitional", icon: <ArrowRight className="h-4 w-4" />, description: "Best of both worlds" },
  { id: "rustic", name: "Rustic", icon: <TreePine className="h-4 w-4" />, description: "Farmhouse charm" },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState<"collections" | "browse">("collections");
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>("best-sellers");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [finish, setFinish] = useState("all");
  const [sessionId, setSessionId] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch featured products for collections tab
  const { data: featuredData, isLoading: featuredLoading } = trpc.shop.getFeaturedProducts.useQuery(
    { collection: selectedCollection, limit: 50 },
    { enabled: activeTab === "collections" }
  );

  // Fetch all products for browse tab
  const { data: productsData, isLoading: productsLoading } = trpc.shop.getProducts.useQuery(
    {
      search: searchQuery,
      category: category !== "all" ? category : undefined,
      finish: finish !== "all" ? finish : undefined,
      limit,
      offset,
    },
    { enabled: activeTab === "browse" }
  );
  
  const products = activeTab === "collections" 
    ? (featuredData?.products || [])
    : (productsData?.products || []);
  const total = productsData?.total || 0;
  const isLoading = activeTab === "collections" ? featuredLoading : productsLoading;

  // Cart data
  const { data: cartData, refetch: refetchCart } = trpc.cart.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const addToCart = trpc.cart.addToCart.useMutation({
    onSuccess: () => {
      refetchCart();
    },
  });

  const handleAddToCart = (productId: number) => {
    addToCart.mutate({ productId, quantity: 1, sessionId });
  };

  const cartCount = cartData?.count || 0;

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-16"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('/images/gallery/omega-white-transitional.jpg')",
        }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight">
              Top Knobs Cabinet Hardware
            </h1>
            <p className="text-lg opacity-90">
              Premium knobs, pulls, and accessories from America's leading hardware brand.
              Free shipping on orders over $100.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware Showcase Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-white">
              <h2 className="text-3xl font-bold">Premium Cabinet Hardware</h2>
              <p className="text-slate-300">
                Transform your cabinets with Top Knobs - America's leading decorative hardware brand. 
                From sleek modern pulls to classic traditional knobs, find the perfect finishing touch 
                for your kitchen, bathroom, or furniture.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  7,000+ Products
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  Free Shipping $100+
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  Authorized Dealer
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/hardware/topknobs-showcase-1.png" 
                  alt="Top Knobs hardware on white cabinets"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/hardware/topknobs-showcase-2.png" 
                  alt="Top Knobs hardware on green cabinets"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/hardware/topknobs-showcase-3.jpg" 
                  alt="Top Knobs Ellis collection"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/hardware/topknobs-showcase-4.png" 
                  alt="Top Knobs hardware on kitchen island"
                  className="w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "collections" | "browse")} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="collections" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Featured Collections
              </TabsTrigger>
              <TabsTrigger value="browse" className="gap-2">
                <Search className="h-4 w-4" />
                Browse All
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "browse" && (
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${total.toLocaleString()} products available`}
              </div>
            )}
          </div>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            {/* Collection Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COLLECTIONS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedCollection === col.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-1 ${selectedCollection === col.id ? "text-primary" : ""}`}>
                    {col.icon}
                    <span className="font-medium text-sm">{col.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{col.description}</p>
                </button>
              ))}
            </div>

            {/* Collection Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{featuredData?.collectionName || "Featured Products"}</h2>
                <p className="text-muted-foreground">
                  {products.length} products in this collection
                </p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab("browse")}>
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Products Grid */}
            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              onAddToCart={handleAddToCart}
              addToCartPending={addToCart.isPending}
            />
          </TabsContent>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name, SKU, or collection..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOffset(0);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={category} onValueChange={(v) => { setCategory(v); setOffset(0); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Knobs">Knobs</SelectItem>
                  <SelectItem value="Pulls">Pulls</SelectItem>
                  <SelectItem value="Bath Hardware">Bath Hardware</SelectItem>
                  <SelectItem value="Hooks">Hooks</SelectItem>
                  <SelectItem value="Appliance Pulls">Appliance Pulls</SelectItem>
                </SelectContent>
              </Select>
              <Select value={finish} onValueChange={(v) => { setFinish(v); setOffset(0); }}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Finish" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Finishes</SelectItem>
                  <SelectItem value="Polished Nickel">Polished Nickel</SelectItem>
                  <SelectItem value="Brushed Satin Nickel">Brushed Satin Nickel</SelectItem>
                  <SelectItem value="Oil Rubbed Bronze">Oil Rubbed Bronze</SelectItem>
                  <SelectItem value="Polished Chrome">Polished Chrome</SelectItem>
                  <SelectItem value="Flat Black">Flat Black</SelectItem>
                  <SelectItem value="Antique Brass">Antique Brass</SelectItem>
                  <SelectItem value="Honey Bronze">Honey Bronze</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || category !== "all" || finish !== "all") && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("all");
                    setFinish("all");
                    setOffset(0);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Products Grid */}
            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              onAddToCart={handleAddToCart}
              addToCartPending={addToCart.isPending}
            />

            {/* Load More */}
            {products.length > 0 && products.length < total && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setOffset(offset + limit)}
                  disabled={isLoading}
                >
                  Load More Products ({products.length} of {total.toLocaleString()})
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Critzer's" className="h-8" />
                <span className="font-bold">Critzer's Cabinets</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Authorized Top Knobs dealer since 1986
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/shop" className="hover:text-foreground">Shop Hardware</Link></li>
                <li><Link href="/quote" className="hover:text-foreground">Get a Quote</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:4349731691" className="hover:text-foreground">(434) 973-1691</a></li>
                <li><a href="mailto:info@critzerscabinets.com" className="hover:text-foreground">info@critzerscabinets.com</a></li>
                <li>661 Berkmar Court</li>
                <li>Charlottesville, VA 22901</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shipping Info</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="text-primary font-medium">Free shipping over $100</li>
                <li>$9.95 flat rate under $100</li>
                <li>Ships direct from Top Knobs</li>
                <li><Link href="/shipping-policy" className="hover:text-foreground underline">View shipping policy</Link></li>
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

// Product Grid Component
function ProductGrid({ 
  products, 
  isLoading, 
  onAddToCart,
  addToCartPending 
}: { 
  products: any[]; 
  isLoading: boolean;
  onAddToCart: (id: number) => void;
  addToCartPending: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-secondary/20 animate-pulse"></div>
            <CardContent className="pt-4 space-y-2">
              <div className="h-4 bg-secondary/20 rounded animate-pulse"></div>
              <div className="h-3 bg-secondary/20 rounded w-2/3 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
          <Filter className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center relative overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="text-6xl">🔩</div>
            )}
            {product.featured === "yes" && (
              <Badge className="absolute top-2 right-2">Featured</Badge>
            )}
          </div>
          <CardContent className="pt-4 space-y-3">
            <div>
              <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {product.sku}
              </p>
            </div>
            
            {product.collection && (
              <p className="text-xs text-muted-foreground">
                {product.collection}
              </p>
            )}
            
            {product.finish && (
              <Badge variant="outline" className="text-xs">
                {product.finish}
              </Badge>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div>
                {product.retailPrice && parseFloat(product.retailPrice) > 0 ? (
                  <p className="text-lg font-bold text-primary">
                    ${parseFloat(product.retailPrice).toFixed(2)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Call for pricing
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => onAddToCart(product.id)}
                disabled={addToCartPending}
              >
                {addToCartPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
