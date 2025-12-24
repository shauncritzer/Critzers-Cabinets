import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";


export default function Cart() {

  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const { data: cartData, refetch } = trpc.cart.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch();

    },
  });

  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      refetch();

    },
  });

  const clearCart = trpc.cart.clearCart.useMutation({
    onSuccess: () => {
      refetch();

    },
  });

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    updateQuantity.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleRemove = (cartItemId: number) => {
    removeItem.mutate({ cartItemId });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart.mutate({ sessionId });
    }
  };

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container">
          <p className="text-center text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  const items = cartData.items || [];
  const total = cartData.total || 0;
  const count = cartData.count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="container">
          <Link href="/shop">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-emerald-100 text-lg">
            {count === 0 ? "Your cart is empty" : `${count} item${count !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some hardware to get started!</p>
              <Link href="/shop">
                <Button size="lg">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.productName || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          SKU: {item.productSku}
                        </p>
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={updateQuantity.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updateQuantity.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                            disabled={removeItem.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="font-semibold text-lg">
                          ${parseFloat(item.retailPrice || "0").toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Subtotal: ${(parseFloat(item.retailPrice || "0") * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={clearCart.isPending}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-6">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout powered by Critzer's Cabinets
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
