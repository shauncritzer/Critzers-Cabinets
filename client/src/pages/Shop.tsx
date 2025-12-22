import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [finish, setFinish] = useState("all");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);
  
  // Fetch products from database
  const { data: productsData, isLoading } = trpc.shop.getProducts.useQuery({
    search: searchQuery,
    category: category !== "all" ? category : undefined,
    finish: finish !== "all" ? finish : undefined,
    limit: 50,
  });
  
  const products = productsData?.products || [];
  const total = productsData?.total || 0;

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
      {/* Navigation */}
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <span className="text-xl font-bold text-foreground">Critzer's Cabinets</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
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
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="hidden">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Hardware Store
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our complete selection of Top Knobs cabinet hardware. 
              Premium knobs, pulls, and accessories at competitive prices.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-b bg-card">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name, SKU, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Knobs">Knobs</SelectItem>
                <SelectItem value="Pulls">Pulls</SelectItem>
                <SelectItem value="Bath Hardware">Bath Hardware</SelectItem>
                <SelectItem value="Hooks">Hooks</SelectItem>
              </SelectContent>
            </Select>
            <Select value={finish} onValueChange={setFinish}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Finish" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Finishes</SelectItem>
                <SelectItem value="Polished Nickel">Polished Nickel</SelectItem>
                <SelectItem value="Brushed Satin Nickel">Brushed Satin Nickel</SelectItem>
                <SelectItem value="Oil Rubbed Bronze">Oil Rubbed Bronze</SelectItem>
                <SelectItem value="Polished Chrome">Polished Chrome</SelectItem>
                <SelectItem value="Antique Brass">Antique Brass</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${products.length} of ${total} products`}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container py-12">
        {isLoading ? (
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
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategory("all");
              setFinish("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
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
                      {product.retailPrice && (
                        <p className="text-lg font-bold text-primary">
                          ${parseFloat(product.retailPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addToCart.isPending}
                    >
                      {addToCart.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {products.length > 0 && products.length < total && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
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
                <li><Link href="/shop" className="hover:text-foreground">Shop Hardware</Link></li>
                <li><Link href="/quote" className="hover:text-foreground">Get a Quote</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
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
