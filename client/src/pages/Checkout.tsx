import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

// Initialize Stripe - In production, this will use the STRIPE_PUBLISHABLE_KEY env var
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51QaLLuCpNXd5ZEKBvF4kq7v3K8qnWvxWYPZYr8p8p8p8p8p8p8p8p8p8p8p8p8p8p8p8"
);

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");
  const [step, setStep] = useState<"info" | "payment">("info");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "expedited" | "express">("standard");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "VA",
    zip: "",
  });

  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const { data: cartData, isLoading: cartLoading } = trpc.cart.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const { data: totalsData, isLoading: totalsLoading } = trpc.checkout.calculateTotals.useQuery(
    { sessionId, shippingMethod },
    { enabled: !!sessionId }
  );

  const createPaymentIntent = trpc.checkout.createPaymentIntent.useMutation();

  const items = cartData?.items || [];
  const subtotal = parseFloat(totalsData?.subtotal || "0");
  const shipping = parseFloat(totalsData?.shipping || "0");
  const tax = parseFloat(totalsData?.tax || "0");
  const total = parseFloat(totalsData?.total || "0");

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      setLocation("/cart");
    }
  }, [cartLoading, items, setLocation]);

  const handleContinueToPayment = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.city || !customerInfo.zip) {
      alert("Please fill in all required fields");
      return;
    }

    // Create payment intent
    try {
      const result = await createPaymentIntent.mutateAsync({
        sessionId,
        customerEmail: customerInfo.email,
        shippingMethod,
      });

      setClientSecret(result.clientSecret || "");
      setOrderNumber(result.orderNumber);
      setStep("payment");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (cartLoading || totalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12">
        <div className="container">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => setLocation("/cart")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-emerald-100 text-lg">
            {step === "info" ? "Enter your shipping information" : "Complete your payment"}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === "info" ? (
              <>
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="(434) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          placeholder="Charlottesville"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={customerInfo.state}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                          placeholder="VA"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input
                          id="zip"
                          value={customerInfo.zip}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                          placeholder="22901"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as any)}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-muted-foreground">5-7 business days</p>
                            </div>
                            <p className="font-medium">
                              {subtotal >= 100 ? "FREE" : "$9.95"}
                            </p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer mt-2">
                        <RadioGroupItem value="expedited" id="expedited" />
                        <Label htmlFor="expedited" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Expedited Shipping</p>
                              <p className="text-sm text-muted-foreground">2-3 business days</p>
                            </div>
                            <p className="font-medium">
                              ${subtotal >= 100 ? "14.95" : "19.95"}
                            </p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer mt-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Express Shipping</p>
                              <p className="text-sm text-muted-foreground">Next day delivery</p>
                            </div>
                            <p className="font-medium">$29.95</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinueToPayment}
                  disabled={createPaymentIntent.isPending}
                >
                  {createPaymentIntent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  customerInfo={customerInfo}
                  orderNumber={orderNumber}
                  sessionId={sessionId}
                  shippingMethod={shippingMethod}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 border-b pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName || ""}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(parseFloat(item.retailPrice || "0") * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (VA 5.3%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {subtotal >= 100 && shippingMethod === "standard" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-sm text-emerald-800 font-medium">
                      🎉 You qualify for FREE standard shipping!
                    </p>
                  </div>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
