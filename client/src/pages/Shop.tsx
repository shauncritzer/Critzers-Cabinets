import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Search, ShoppingCart, Filter, ChevronLeft, ChevronRight, X, SlidersHorizontal, Grid3X3, List, Plus, Package } from "lucide-react";
import { toast } from "sonner";

// Finish code to swatch color mapping for visual finish swatches
const FINISH_SWATCH_COLORS: Record<string, string> = {
  'Polished Chrome': '#D4D4D8',
  'PC': '#D4D4D8',
  'Brushed Satin Nickel': '#A8A8A0',
  'BSN': '#A8A8A0',
  'Flat Black': '#1C1C1C',
  'BLK': '#1C1C1C',
  'Oil Rubbed Bronze': '#3D2B1F',
  'ORB': '#3D2B1F',
  'Oil Rubbed Bronze 2': '#4A3728',
  'ORB2': '#4A3728',
  'Polished Nickel': '#C0C0C0',
  'PN': '#C0C0C0',
  'Polished Brass': '#CFB53B',
  'PB': '#CFB53B',
  'Honey Bronze': '#8B6914',
  'HB': '#8B6914',
  'Ash Gray': '#808080',
  'AG': '#808080',
  'Antique Copper': '#B87333',
  'AC': '#B87333',
  'German Bronze': '#5C4033',
  'GBZ': '#5C4033',
  'Tuscan Bronze': '#6B4226',
  'TB': '#6B4226',
  'Dark Antique Brass': '#8B7D3C',
  'DAB': '#8B7D3C',
  'Pewter': '#96A8A1',
  'PT': '#96A8A1',
  'Pewter Antique': '#7D7F7D',
  'PTA': '#7D7F7D',
  'Pewter Light': '#B0B7B0',
  'PTL': '#B0B7B0',
  'Brass': '#D4AF37',
  'BR': '#D4AF37',
  'Brass Antique': '#9C7A3C',
  'BA': '#9C7A3C',
  'Sable': '#4A3C2A',
  'SAB': '#4A3C2A',
  'Umbrio': '#3C2415',
  'UM': '#3C2415',
  'Rust': '#B7410E',
  'RST': '#B7410E',
  'White': '#F5F5F5',
  'WHT': '#F5F5F5',
  'Aluminum': '#A9ACB6',
  'ALU': '#A9ACB6',
  'Black Iron': '#2C2C2C',
  'BI': '#2C2C2C',
  'Black Nickel': '#353535',
  'BNI': '#353535',
  'Coal Black': '#1A1A1A',
  'CB': '#1A1A1A',
  'Cast Iron': '#3B3B3B',
  'CI': '#3B3B3B',
  'Light Bronze': '#8B7355',
  'LB': '#8B7355',
  'Medium Bronze': '#6B5B3E',
  'MB': '#6B5B3E',
  'Mahogany Bronze': '#4E3524',
  'MCB': '#4E3524',
  'Old English Copper': '#A0522D',
  'OEC': '#A0522D',
  'Patina Antique Brass': '#7D6B3C',
  'PAB': '#7D6B3C',
  'Patina Rouge': '#8B2500',
  'PAR': '#8B2500',
  'Brushed Stainless Steel': '#B8B8B8',
  'PS': '#B8B8B8',
  'Polished Stainless Steel': '#CCCCCC',
  'PSS': '#CCCCCC',
  'Silicon Bronze Light': '#9B7D4A',
  'SBL': '#9B7D4A',
  'Stainless Steel': '#C0C0C0',
  'SS': '#C0C0C0',
};

// Finish code to full name mapping
const FINISH_CODE_TO_NAME: Record<string, string> = {
  'AC': 'Antique Copper', 'AG': 'Ash Gray', 'ALU': 'Aluminum',
  'BA': 'Brass Antique', 'BI': 'Black Iron', 'BLK': 'Flat Black',
  'BNI': 'Black Nickel', 'BR': 'Brass', 'BSN': 'Brushed Satin Nickel',
  'CB': 'Coal Black', 'CI': 'Cast Iron', 'DAB': 'Dark Antique Brass',
  'GBZ': 'German Bronze', 'HB': 'Honey Bronze', 'LB': 'Light Bronze',
  'MB': 'Medium Bronze', 'MCB': 'Mahogany Bronze', 'OEC': 'Old English Copper',
  'ORB': 'Oil Rubbed Bronze', 'ORB2': 'Oil Rubbed Bronze 2',
  'PAB': 'Patina Antique Brass', 'PAR': 'Patina Rouge',
  'PB': 'Polished Brass', 'PC': 'Polished Chrome',
  'PN': 'Polished Nickel', 'PS': 'Brushed Stainless Steel',
  'PSS': 'Polished Stainless Steel', 'PT': 'Pewter',
  'PTA': 'Pewter Antique', 'PTL': 'Pewter Light',
  'RST': 'Rust', 'SAB': 'Sable', 'SBL': 'Silicon Bronze Light',
  'SS': 'Stainless Steel', 'TB': 'Tuscan Bronze', 'UM': 'Umbrio',
  'WHT': 'White',
};

function getFinishDisplayName(finish: string | null): string {
  if (!finish) return '';
  return FINISH_CODE_TO_NAME[finish] || finish;
}

function getSwatchColor(finish: string | null): string {
  if (!finish) return '#888888';
  return FINISH_SWATCH_COLORS[finish] || FINISH_SWATCH_COLORS[FINISH_CODE_TO_NAME[finish] || ''] || '#888888';
}

interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  finish: string | null;
  finishCode: string | null;
  retailPrice: string | null;
  listPrice: string | null;
  imageUrl: string | null;
  centerToCenter: string | null;
  dimensions: string | null;
  length: string | null;
  width: string | null;
  projection: string | null;
  material: string | null;
}

interface ProductGroup {
  baseName: string;
  collection: string | null;
  productType: string | null;
  brand: string | null;
  variants: ProductVariant[];
}

function ProductImagePlaceholder({ baseName }: { baseName: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-200 flex items-center justify-center">
          <Package className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-1">{baseName}</p>
        <p className="text-[10px] text-slate-400">Image Coming Soon</p>
      </div>
    </div>
  );
}

function ProductCard({ group, onAddToCart, isAdding }: { 
  group: ProductGroup; 
  onAddToCart: (productId: number, e: React.MouseEvent) => void;
  isAdding: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const selected = group.variants[selectedIndex] || group.variants[0];
  
  // Reset image error state when selected variant changes
  useEffect(() => {
    setImgError(false);
  }, [selectedIndex]);
  
  if (!selected) return null;

  const finishName = getFinishDisplayName(selected.finish);
  const hasMultipleFinishes = group.variants.length > 1;
  const showPlaceholder = !selected.imageUrl || imgError;

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden border hover:border-primary/30 flex flex-col">
      <Link href={`/shop/product/${selected.id}`}>
        <div className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-6 relative">
          {!showPlaceholder && (
            <img 
              key={`product-img-${selected.id}`}
              src={selected.imageUrl!} 
              alt={selected.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          {showPlaceholder && (
            <ProductImagePlaceholder baseName={group.baseName} />
          )}
          {/* Quick Add Button */}
          <Button
            size="sm"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={(e) => onAddToCart(selected.id, e)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </Link>
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Product Name */}
        <Link href={`/shop/product/${selected.id}`} className="block">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {group.baseName}
          </h3>
        </Link>
        
        {/* SKU and Collection */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>SKU: {selected.sku}</span>
        </div>
        
        {/* Collection and Type badges */}
        <div className="flex items-center gap-1 flex-wrap">
          {group.collection && (
            <Badge variant="outline" className="text-xs">{group.collection}</Badge>
          )}
          {group.productType && (
            <Badge variant="outline" className="text-xs">{group.productType}</Badge>
          )}
        </div>

        {/* Finish Swatches */}
        {hasMultipleFinishes && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              {finishName || selected.finish || 'Select Finish'} 
              <span className="ml-1 opacity-60">({group.variants.length} finishes)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.variants.map((variant, idx) => {
                const color = getSwatchColor(variant.finish);
                const isSelected = idx === selectedIndex;
                const isLight = color === '#F5F5F5' || color === '#FFFFFF';
                return (
                  <button
                    key={variant.id}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                      isSelected 
                        ? 'border-primary ring-2 ring-primary/30 scale-110' 
                        : isLight 
                          ? 'border-gray-300 hover:border-primary/50' 
                          : 'border-transparent hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color }}
                    title={getFinishDisplayName(variant.finish) || variant.finish || 'Unknown'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedIndex(idx);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Single finish display */}
        {!hasMultipleFinishes && finishName && (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300" 
              style={{ backgroundColor: getSwatchColor(selected.finish) }}
            />
            <span className="text-xs text-muted-foreground">{finishName}</span>
          </div>
        )}
        
        {/* Price - pushed to bottom */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <p className="text-lg font-bold text-primary">
            ${selected.retailPrice != null ? Number(selected.retailPrice).toFixed(2) : 'N/A'}
          </p>
          <Badge variant="default" className="text-xs bg-emerald-600 hover:bg-emerald-700">
            Available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [selectedFinish, setSelectedFinish] = useState<string | undefined>();
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24);
  const [showFilters, setShowFilters] = useState(true);

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
  }, [selectedCollection, selectedFinish, selectedProductType, sortBy]);

  // Fetch grouped products
  const { data: groupedData, isLoading } = trpc.shop.getGroupedProducts.useQuery({
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

  // Compute finish display names for filter dropdown
  const finishOptions = useMemo(() => {
    if (!filters?.finishes) return [];
    return filters.finishes.map((f: any) => ({
      ...f,
      displayName: getFinishDisplayName(f.name) || f.name,
    })).sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
  }, [filters?.finishes]);

  // Add to cart mutation
  const addToCart = trpc.cart.addToCart.useMutation({
    onSuccess: (data) => {
      toast.success(data.action === 'updated' ? 'Cart updated!' : 'Added to cart!', {
        description: 'Item has been added to your shopping cart.',
        action: {
          label: 'View Cart',
          onClick: () => setLocation('/cart'),
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
    setSelectedCollection(undefined);
    setSelectedFinish(undefined);
    setSelectedProductType(undefined);
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCollection, selectedFinish, selectedProductType, debouncedSearch].filter(Boolean).length;

  const groups: ProductGroup[] = groupedData?.groups || [];
  const pagination = groupedData?.pagination || { page: 1, pageSize: 24, totalCount: 0, totalPages: 0 };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-10 border-b">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <div className="flex justify-center mb-3">
              <img 
                src="/images/topknobs-logo-transparent.png" 
                alt="Top Knobs" 
                className="h-16 md:h-20 object-contain brightness-0 invert"
                onError={(e) => {
                  // Fallback: hide broken image, the text header below still shows
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
            {filters?.productTypes?.map((type: any) => (
              <Button
                key={type.name}
                variant={selectedProductType === type.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProductType(type.name === selectedProductType ? undefined : type.name)}
                className="whitespace-nowrap"
              >
                {type.name}s
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
                      {filters?.collections?.map((col: any) => (
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
                      {finishOptions.map((finish: any) => (
                        <SelectItem key={finish.name} value={finish.name}>
                          <span className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full border border-gray-300 inline-block" 
                              style={{ backgroundColor: getSwatchColor(finish.name) }}
                            />
                            {finish.displayName} ({finish.count})
                          </span>
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
                          {getFinishDisplayName(selectedFinish) || selectedFinish} <X className="ml-1 h-3 w-3" />
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
                      <span className="font-medium text-foreground">{pagination.totalCount.toLocaleString()}</span> product styles
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
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="w-6 h-6 rounded-full bg-muted" />
                        ))}
                      </div>
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && groups.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <ProductCard
                    key={group.baseName}
                    group={group}
                    onAddToCart={handleAddToCart}
                    isAdding={addToCart.isPending}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && groups.length === 0 && (
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
