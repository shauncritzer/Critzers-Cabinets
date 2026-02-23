import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Search, ShoppingCart, Filter, ChevronLeft, ChevronRight, X, SlidersHorizontal, Grid3X3, List, Plus } from "lucide-react";
import { toast } from "sonner";

const PRODUCT_TYPE_ICONS: Record<string, string> = {
  'Pull': '🔲',
  'Knob': '⚫',
  'Backplate': '🔳',
  'Handle': '🔲',
  'Hook': '🪝',
  'Hardware': '🔧',
};

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [selectedFinish, setSelectedFinish] = useState<string | undefined>();
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Session ID for cart
  const [sessionId, setSessionId] = useState<string>("");
  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCollection, selectedFinish, selectedProductType, sortBy]);

  // Fetch products with filters and pagination
  const { data: productsData, isLoading } = trpc.shop.getAllProducts.useQuery({
    category: selectedCategory,
    collection: selectedCollection,
    finish: selectedFinish,
    productType: selectedProductType,
    search: debouncedSearch || undefined,
    sortBy: sortBy as any,
    page: currentPage,
    pageSize,
  });

  // Fetch filter options
  const { data: filters } = trpc.shop.getFilters.useQuery();

  // Add to cart mutation
  const addToCart = trpc.cart.addToCart.useMutation({
    onSuccess: (data) => {
      toast.success(data.action === 'updated' ? 'Cart updated!' : 'Added to cart!', {
        description: 'Item has been added to your shopping cart.',
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart',
        },
      });
    },
    onError: () => {
      toast.error('Failed to add to cart. Please try again.');
    },
  });

  const handleAddToCart = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId, quantity: 1, sessionId });
  };

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCollection(undefined);
    setSelectedFinish(undefined);
    setSelectedProductType(undefined);
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCategory, selectedCollection, selectedFinish, selectedProductType, debouncedSearch].filter(Boolean).length;

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { page: 1, pageSize: 24, totalCount: 0, totalPages: 0 };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-10 border-b">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <div className="flex justify-center mb-3">
              <img 
                src="/images/topknobs-logo.png" 
                alt="Top Knobs" 
                className="h-10 object-contain brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Cabinet Hardware Store
            </h1>
            <p className="text-emerald-100 text-lg">
              Premium cabinet knobs, pulls, and hardware from Top Knobs — America's leading manufacturer
            </p>
          </div>
        </div>
      </section>

      {/* Product Type Quick Filters */}
      <section className="bg-muted/30 border-b py-3">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant={!selectedProductType ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProductType(undefined)}
              className="whitespace-nowrap"
            >
              All Products
            </Button>
            {filters?.productTypes?.map((type) => (
              <Button
                key={type.name}
                variant={selectedProductType === type.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProductType(type.name === selectedProductType ? undefined : type.name)}
                className="whitespace-nowrap"
              >
                {PRODUCT_TYPE_ICONS[type.name] || '🔧'} {type.name}s
                <span className="ml-1 text-xs opacity-70">({type.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs">
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name, SKU, collection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Collection Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Collection</label>
                  <Select value={selectedCollection || "all"} onValueChange={(val) => setSelectedCollection(val === "all" ? undefined : val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Collections" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="all">All Collections</SelectItem>
                      {filters?.collections?.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          {col.name} ({col.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Finish Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Finish</label>
                  <Select value={selectedFinish || "all"} onValueChange={(val) => setSelectedFinish(val === "all" ? undefined : val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Finishes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="all">All Finishes</SelectItem>
                      {filters?.finishes?.map((finish) => (
                        <SelectItem key={finish.name} value={finish.name}>
                          {finish.name} ({finish.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Info */}
                {filters?.priceRange && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Price Range</p>
                    <p>
                      ${filters.priceRange.min != null ? Number(filters.priceRange.min).toFixed(2) : '0.00'}
                      {' — '}
                      ${filters.priceRange.max != null ? Number(filters.priceRange.max).toFixed(2) : '0.00'}
                    </p>
                  </div>
                )}

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Active Filters:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedProductType && (
                        <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setSelectedProductType(undefined)}>
                          {selectedProductType} <X className="ml-1 h-3 w-3" />
                        </Badge>
                      )}
                      {selectedCollection && (
                        <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setSelectedCollection(undefined)}>
                          {selectedCollection} <X className="ml-1 h-3 w-3" />
                        </Badge>
                      )}
                      {selectedFinish && (
                        <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setSelectedFinish(undefined)}>
                          {selectedFinish} <X className="ml-1 h-3 w-3" />
                        </Badge>
                      )}
                      {debouncedSearch && (
                        <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }}>
                          "{debouncedSearch}" <X className="ml-1 h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : (
                    <>
                      <span className="font-medium text-foreground">{pagination.totalCount.toLocaleString()}</span> products
                      {pagination.totalPages > 1 && (
                        <> · Page {pagination.page} of {pagination.totalPages}</>
                      )}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Search */}
                <div className="relative lg:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className={viewMode === 'grid' ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                {[...Array(pageSize > 12 ? 12 : pageSize)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className={viewMode === 'grid' ? "aspect-square bg-muted" : "h-32 bg-muted"} />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Grid View */}
            {!isLoading && products.length > 0 && viewMode === 'grid' && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all overflow-hidden border hover:border-primary/50">
                    <Link href={`/shop/product/${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4 relative">
                        <img 
                          src={product.imageUrl || "/images/topknobs/placeholder-knobs.jpg"} 
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/images/topknobs/placeholder-knobs.jpg";
                          }}
                        />
                        {product.featured === 'yes' && (
                          <Badge className="absolute top-2 left-2 text-xs">Featured</Badge>
                        )}
                        {/* Quick Add Button */}
                        <Button
                          size="sm"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => handleAddToCart(product.id, e)}
                          disabled={product.inStock !== 'yes' || addToCart.isPending}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </Link>
                    <CardContent className="p-4 space-y-2">
                      <Link href={`/shop/product/${product.id}`} className="block">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>SKU: {product.sku}</span>
                        {product.productType && (
                          <>
                            <span>·</span>
                            <span>{product.productType}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 flex-wrap">
                        {product.collection && (
                          <Badge variant="outline" className="text-xs">{product.collection}</Badge>
                        )}
                        {product.finish && (
                          <Badge variant="outline" className="text-xs">{product.finish}</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-lg font-bold text-primary">
                          ${product.retailPrice != null ? Number(product.retailPrice).toFixed(2) : 'N/A'}
                        </p>
                        <Badge variant={product.inStock === 'yes' ? 'default' : 'secondary'} className="text-xs">
                          {product.inStock === 'yes' ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {!isLoading && products.length > 0 && viewMode === 'list' && (
              <div className="space-y-3">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-md transition-all overflow-hidden border hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Link href={`/shop/product/${product.id}`} className="flex-shrink-0">
                          <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
                            <img 
                              src={product.imageUrl || "/images/topknobs/placeholder-knobs.jpg"} 
                              alt={product.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = "/images/topknobs/placeholder-knobs.jpg";
                              }}
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/shop/product/${product.id}`}>
                            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>SKU: {product.sku}</span>
                            {product.collection && <><span>·</span><span>{product.collection}</span></>}
                            {product.finish && <><span>·</span><span>{product.finish}</span></>}
                            {product.productType && <><span>·</span><span>{product.productType}</span></>}
                          </div>
                          {product.centerToCenter && (
                            <p className="text-xs text-muted-foreground mt-1">Center to Center: {product.centerToCenter}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-lg font-bold text-primary">
                            ${product.retailPrice != null ? Number(product.retailPrice).toFixed(2) : 'N/A'}
                          </p>
                          <Button
                            size="sm"
                            onClick={(e) => handleAddToCart(product.id, e)}
                            disabled={product.inStock !== 'yes' || addToCart.isPending}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
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

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button variant="outline" size="sm" className="w-9" onClick={() => setCurrentPage(1)}>1</Button>
                      {currentPage > 4 && <span className="px-1 text-muted-foreground">...</span>}
                    </>
                  )}
                  
                  {/* Page numbers around current */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {/* Last page */}
                  {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {currentPage < pagination.totalPages - 3 && <span className="px-1 text-muted-foreground">...</span>}
                      <Button variant="outline" size="sm" className="w-9" onClick={() => setCurrentPage(pagination.totalPages)}>
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-primary/5 border-t mt-8">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">Need Help Choosing?</h2>
            <p className="text-muted-foreground">
              Our team can help you find the perfect hardware for your project. We offer expert consultation and professional installation.
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
                  View Full Top Knobs Catalog
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
