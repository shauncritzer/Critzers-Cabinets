import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Search, ShoppingCart, Filter } from "lucide-react";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [selectedFinish, setSelectedFinish] = useState<string | undefined>();

  // Fetch products with filters
  const { data: products, isLoading } = trpc.shop.getAllProducts.useQuery({
    category: selectedCategory,
    collection: selectedCollection,
    finish: selectedFinish,
    search: searchQuery || undefined,
  });

  // Fetch filter options
  const { data: filters } = trpc.shop.getFilters.useQuery();

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCollection(undefined);
    setSelectedFinish(undefined);
    setSearchQuery("");
  };

  const activeFiltersCount = [selectedCategory, selectedCollection, selectedFinish, searchQuery].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 border-b">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/topknobs-logo.png" 
                alt="Top Knobs" 
                className="h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Shop Top Knobs Hardware
            </h1>
            <p className="text-muted-foreground">
              Browse our curated selection of premium cabinet hardware
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 bg-muted/30 border-b sticky top-0 z-10 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? undefined : val)}>
              <SelectTrigger className="w-full lg:w-[180px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filters?.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Collection Filter */}
            <Select value={selectedCollection || "all"} onValueChange={(val) => setSelectedCollection(val === "all" ? undefined : val)}>
              <SelectTrigger className="w-full lg:w-[200px] bg-background">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {filters?.collections.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Finish Filter */}
            <Select value={selectedFinish || "all"} onValueChange={(val) => setSelectedFinish(val === "all" ? undefined : val)}>
              <SelectTrigger className="w-full lg:w-[180px] bg-background">
                <SelectValue placeholder="Finish" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Finishes</SelectItem>
                {filters?.finishes.map((finish) => (
                  <SelectItem key={finish} value={finish}>
                    {finish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${products?.length || 0} products found`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && products && products.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all overflow-hidden border hover:border-primary/50">
                  <Link href={`/shop/product/${product.id}`}>
                    <div className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                      <img 
                        src={product.imageUrl || "/images/topknobs/placeholder-knobs.jpg"} 
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/images/topknobs/placeholder-knobs.jpg";
                        }}
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/shop/product/${product.id}`} className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.featured === 'yes' && (
                        <Badge variant="secondary" className="text-xs shrink-0">Featured</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>SKU: {product.sku}</span>
                    </div>
                    
                    {product.collection && (
                      <p className="text-xs text-muted-foreground">{product.collection}</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <p className="text-lg font-bold text-primary">
                          ${Number(product.retailPrice).toFixed(2)}
                        </p>
                        {product.listPrice && Number(product.listPrice) > Number(product.retailPrice) && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${Number(product.listPrice).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Badge variant={product.inStock === 'yes' ? 'default' : 'secondary'} className="text-xs">
                        {product.inStock === 'yes' ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <Link href={`/shop/product/${product.id}`}>
                      <Button className="w-full mt-2" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products && products.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-primary/5 border-t mt-8">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">Need Help Choosing?</h2>
            <p className="text-muted-foreground">
              Our team is here to help you find the perfect hardware for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Us
                </Button>
              </Link>
              <a 
                href="https://www.topknobs.com/view-catalog" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline">
                  View Full Catalog
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
