import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Ruler, Tag } from "lucide-react";
// Toast functionality to be added later

export default function ProductDetail() {
  const [, params] = useRoute("/shop/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  // const { toast } = useToast();

  const { data: product, isLoading } = trpc.shop.getProductById.useQuery({ id: productId });

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Added ${quantity} × ${product?.name} to your cart`);
  };

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
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-8">
                <img
                  src={product.imageUrl || "/images/topknobs/placeholder-knobs.jpg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/topknobs/placeholder-knobs.jpg";
                  }}
                />
              </div>
            </Card>
            {product.featured === 'yes' && (
              <Badge className="w-full justify-center py-2">
                ⭐ Featured Product
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge variant={product.inStock === 'yes' ? 'default' : 'secondary'}>
                  {product.inStock === 'yes' ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              {product.collection && (
                <p className="text-lg text-muted-foreground">{product.collection} Collection</p>
              )}
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${Number(product.retailPrice).toFixed(2)}
                </span>
                {product.listPrice && Number(product.listPrice) > Number(product.retailPrice) && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${Number(product.listPrice).toFixed(2)}
                  </span>
                )}
              </div>
              {product.listPrice && Number(product.listPrice) > Number(product.retailPrice) && (
                <p className="text-sm text-green-600 font-medium">
                  Save ${(Number(product.listPrice) - Number(product.retailPrice)).toFixed(2)} (
                  {Math.round(((Number(product.listPrice) - Number(product.retailPrice)) / Number(product.listPrice)) * 100)}% off)
                </p>
              )}
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                </div>
                
                {product.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">{product.category}</p>
                    </div>
                  </div>
                )}
              </div>

              {product.dimensions && (
                <div className="flex items-start gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="font-medium">{product.dimensions}</p>
                  </div>
                </div>
              )}

              {product.finish && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Finish</p>
                  <Badge variant="outline">{product.finish}</Badge>
                </div>
              )}

              {product.description && product.description !== product.name && (
                <div className="text-sm">
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
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.inStock !== 'yes'}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {product.inStock !== 'yes' && (
                <p className="text-sm text-muted-foreground">
                  This product is currently out of stock. Please contact us for availability.
                </p>
              )}
            </div>

            {/* Additional Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">✓</span>
                  <span>Authorized Top Knobs Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">✓</span>
                  <span>Expert Installation Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">✓</span>
                  <span>Questions? Call (434) 973-1691</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
