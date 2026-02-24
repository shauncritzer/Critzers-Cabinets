import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, Mail, Home, Loader2, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function CheckoutSuccess() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const stripeSessionId = params.get("session_id") || "";
  const [processed, setProcessed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Get cart session ID for order processing
  const cartSessionId = typeof window !== 'undefined' ? localStorage.getItem("cart_session_id") || "" : "";

  const handleSuccess = trpc.checkout.handleCheckoutSuccess.useMutation({
    onSuccess: (data) => {
      setProcessed(true);
      setOrderNumber(data.orderNumber);
      // Clear cart session after successful order
      localStorage.removeItem("cart_session_id");
    },
    onError: (err) => {
      setError(err.message || "Failed to process order");
      setProcessed(true);
    },
  });

  // Process the checkout on mount
  useEffect(() => {
    if (stripeSessionId && !processed && !handleSuccess.isPending) {
      handleSuccess.mutate({
        stripeSessionId,
        cartSessionId: cartSessionId || undefined,
      });
    }
  }, [stripeSessionId]);

  // Redirect if no session ID
  if (!stripeSessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No checkout session found</p>
              <Link href="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (!processed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="container py-12">
          <div className="max-w-lg mx-auto">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Order Processing Issue</h2>
                <p className="text-muted-foreground mb-4">
                  Your payment was successful, but we encountered an issue processing your order details.
                  Please contact us with your payment confirmation for assistance.
                </p>
                <p className="text-sm text-muted-foreground mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button>Contact Us</Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      {/* Success Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-emerald-100 text-lg mb-2">
            Thank you for your purchase!
          </p>
          {orderNumber && (
            <p className="text-emerald-200">
              Order #{orderNumber}
            </p>
          )}
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-12">
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
                    We've sent a confirmation email with your order details and tracking information (once available).
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
