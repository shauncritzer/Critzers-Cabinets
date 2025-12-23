import { useState } from "react";
import { useLocation } from "wouter";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

interface CheckoutFormProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  orderNumber: string;
  sessionId: string;
  shippingMethod: "standard" | "expedited" | "express";
}

export default function CheckoutForm({
  customerInfo,
  orderNumber,
  sessionId,
  shippingMethod,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const completeOrder = trpc.checkout.completeOrder.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful - create order in database
        const result = await completeOrder.mutateAsync({
          sessionId,
          paymentIntentId: paymentIntent.id,
          orderNumber,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          shippingAddress: customerInfo.address,
          shippingCity: customerInfo.city,
          shippingState: customerInfo.state,
          shippingZip: customerInfo.zip,
          shippingMethod,
        });

        // Redirect to confirmation page
        setLocation(`/order-confirmation?order=${result.orderNumber}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentElement />

          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="bg-slate-50 border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Order #{orderNumber}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay Securely
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Lock className="h-3 w-3" />
              <span>Secure SSL encryption</span>
            </div>
            <span className="text-xs">•</span>
            <span className="text-xs">Powered by Stripe</span>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
