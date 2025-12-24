import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, Mail, Home, Loader2 } from "lucide-react";

export default function OrderConfirmation() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const orderNumber = params.get("order") || "";

  const { data: orderData, isLoading } = trpc.checkout.getOrder.useQuery(
    { orderNumber },
    { enabled: !!orderNumber }
  );

  // Clear cart session on successful order
  useEffect(() => {
    if (orderData) {
      localStorage.removeItem("cart_session_id");
    }
  }, [orderData]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No order found</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="container text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-emerald-100 text-lg mb-2">
            Thank you for your purchase, {orderData.customerName}
          </p>
          <p className="text-emerald-200">
            Order #{orderData.orderNumber}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Confirmation Message */}
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    Confirmation email sent
                  </h3>
                  <p className="text-sm text-emerald-800">
                    We've sent a confirmation email to <strong>{orderData.customerEmail}</strong> with
                    your order details and tracking information (once available).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-1">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipment
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-1">Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking info via email
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-1">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Arrives based on your shipping method
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items Ordered</h4>
                <div className="space-y-3">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.subtotal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping ({orderData.shippingMethod})</span>
                  <span>
                    {parseFloat(orderData.shipping || "0") === 0
                      ? "FREE"
                      : `$${orderData.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${orderData.tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">${orderData.total}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {orderData.shippingAddress}<br />
                  {orderData.shippingCity}, {orderData.shippingState} {orderData.shippingZip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Support */}
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Questions about your order?
              </p>
              <p className="text-sm">
                Contact us at{" "}
                <a
                  href="mailto:info@critzerscabinets.com"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  info@critzerscabinets.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:4349731691"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  (434) 973-1691
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
