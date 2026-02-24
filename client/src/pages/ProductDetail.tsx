import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Ruler, Tag, Check, Truck, Phone, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/product/:id");
  const [, setLocation] = useLocation();
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const { data: product, isLoading } = trpc.shop.getProductById.useQuery({ id: productId });

  // Fetch related products from same collection
  const { data: relatedData } = trpc.shop.getAllProducts.useQuery(
    {
      collection: product?.collection || undefined,
      pageSize: 5,
      page: 1,
    },
    { enabled: !!product?.collection }
  );

  // Add to cart mutation
  const addToCart = trpc.cart.addToCart.useMutation({
    onSuccess: (data) => {
      setAddedToCart(true);
      toast.success(`Added ${quantity} × ${product?.name} to cart!`, {
        action: {
          label: 'View Cart',
          onClick: () => setLocation('/cart'),
        },
      });
      setTimeout(() => setAddedToCart(false), 3000);
    },
    onError: () => {
      toast.error('Failed to add to cart. Please try again.');
    },
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({ productId: product.id, quantity, sessionId });
  };

  // Related products excluding current
  const relatedProducts = (relatedData?.products || []).filter(p => p.id !== productId).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-12 bg-muted rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span>/</span>
          {product.productType && (
            <>
              <Link href={`/shop?type=${product.productType}`} className="hover:text-foreground transition-colors">
                {product.productType}s
              </Link>
              <span>/</span>
            </>
          )}
          {product.collection && (
            <>
              <Link href={`/shop?collection=${product.collection}`} className="hover:text-foreground transition-colors">
                {product.collection}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.sku}</span>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-8">
                <img
                  src={product.imageUrl || "/images/topknobs-showcase.jpg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/topknobs-showcase.jpg";
                  }}
                />
              </div>
            </Card>
            {product.featured === 'yes' && (
              <Badge className="w-full justify-center py-2">
                Featured Product
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge variant="default" className="bg-emerald-600">
                  Available
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                {product.brand && <span className="font-medium">{product.brand}</span>}
                {product.collection && (
                  <>
                    <span>·</span>
                    <span>{product.collection} Collection</span>
                  </>
                )}
                {product.productType && (
                  <>
                    <span>·</span>
                    <span>{product.productType}</span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.retailPrice != null ? Number(product.retailPrice).toFixed(2) : 'N/A'}
                </span>
                {product.listPrice && Number(product.listPrice) > Number(product.retailPrice) && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${Number(product.listPrice).toFixed(2)}
                  </span>
                )}
              </div>
              {product.listPrice && product.retailPrice != null && Number(product.listPrice) > Number(product.retailPrice) && (
                <p className="text-sm text-green-600 font-medium">
                  Save ${(Number(product.listPrice) - Number(product.retailPrice)).toFixed(2)} (
                  {Math.round(((Number(product.listPrice) - Number(product.retailPrice)) / Number(product.listPrice)) * 100)}% off)
                </p>
              )}
            </div>

            <Separator />

            {/* Product Specifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                </div>
                
                {product.productType && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{product.productType}</p>
                    </div>
                  </div>
                )}

                {product.finish && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded-full bg-muted border" />
                    <div>
                      <p className="text-muted-foreground">Finish</p>
                      <p className="font-medium">{product.finish}</p>
                    </div>
                  </div>
                )}

                {product.material && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Material</p>
                      <p className="font-medium">{product.material}</p>
                    </div>
                  </div>
                )}

                {product.centerToCenter && (
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Center to Center</p>
                      <p className="font-medium">{product.centerToCenter}</p>
                    </div>
                  </div>
                )}

                {product.length && (
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Length</p>
                      <p className="font-medium">{product.length}</p>
                    </div>
                  </div>
                )}

                {product.width && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Width</p>
                    <p className="font-medium">{product.width}</p>
                  </div>
                )}

                {product.projection && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Projection</p>
                    <p className="font-medium">{product.projection}</p>
                  </div>
                )}

                {product.baseDiameter && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Base Diameter</p>
                    <p className="font-medium">{product.baseDiameter}</p>
                  </div>
                )}

                {product.weight && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{product.weight} lbs</p>
                  </div>
                )}

                {product.upc && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">UPC</p>
                    <p className="font-medium">{product.upc}</p>
                  </div>
                )}
              </div>

              {product.description && product.description !== product.name && (
                <div className="text-sm mt-4">
                  <p className="text-muted-foreground mb-1">Description</p>
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Subtotal: <span className="font-medium text-foreground">${product.retailPrice != null ? (Number(product.retailPrice) * quantity).toFixed(2) : 'N/A'}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                >
                  {addToCart.isPending ? (
                    <>Adding...</>
                  ) : addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart — ${product.retailPrice != null ? (Number(product.retailPrice) * quantity).toFixed(2) : 'N/A'}
                    </>
                  )}
                </Button>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>


            </div>

            {/* Trust Badges */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Authorized Top Knobs Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Free shipping on orders $75+</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>Expert Installation Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <span>Questions? (434) 973-1691</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold mb-6">
              More from {product.collection} Collection
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Card key={related.id} className="group hover:shadow-lg transition-all overflow-hidden border hover:border-primary/50">
                  <Link href={`/shop/product/${related.id}`}>
                    <div className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                      <img 
                        src={related.imageUrl || "/images/topknobs-showcase.jpg"} 
                        alt={related.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/topknobs-showcase.jpg";
                        }}
                      />
                    </div>
                  </Link>
                  <CardContent className="p-3 space-y-1">
                    <Link href={`/shop/product/${related.id}`}>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {related.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">SKU: {related.sku}</p>
                    {related.finish && (
                      <Badge variant="outline" className="text-xs">{related.finish}</Badge>
                    )}
                    <p className="text-lg font-bold text-primary">
                      ${related.retailPrice != null ? Number(related.retailPrice).toFixed(2) : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
