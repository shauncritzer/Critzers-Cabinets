import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, MapPin, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12">
        <div className="container">
          <Link href="/shop">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shipping Policy</h1>
          <p className="text-emerald-100 text-lg">
            Free shipping on orders $100+ | Fast, reliable delivery
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Shipping Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Standard Shipping */}
              <div className="border-l-4 border-emerald-600 pl-4">
                <h3 className="font-semibold text-lg mb-2">
                  Standard Shipping (5-7 Business Days)
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Orders under $100:</strong> $9.95 flat rate
                  </p>
                  <p>
                    <strong className="text-emerald-600">Orders $100+:</strong> FREE SHIPPING! 🎉
                  </p>
                  <p className="text-sm mt-2">
                    Most orders ship within 1-2 business days and arrive within 5-7 business days via USPS or UPS Ground.
                  </p>
                </div>
              </div>

              {/* Expedited Shipping */}
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-lg mb-2">
                  Expedited Shipping (2-3 Business Days)
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Orders under $100:</strong> $19.95
                  </p>
                  <p>
                    <strong className="text-foreground">Orders $100+:</strong> $14.95
                  </p>
                  <p className="text-sm mt-2">
                    Need it faster? Expedited shipping guarantees delivery within 2-3 business days.
                  </p>
                </div>
              </div>

              {/* Express Shipping */}
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-semibold text-lg mb-2">
                  Express Shipping (Next Day)
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">All orders:</strong> $29.95 flat rate
                  </p>
                  <p className="text-sm mt-2">
                    Order by 2pm EST for next business day delivery to most locations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Processing Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Orders are typically processed and shipped within <strong>1-2 business days</strong> of
                receiving your order.
              </p>
              <p>
                You will receive an email confirmation when your order ships, including tracking
                information so you can monitor your delivery.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Processing time does not include shipping time. For example,
                  standard shipping (5-7 days) starts counting after your order has been processed and
                  shipped.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Local Pickup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Local Pickup (Charlottesville Area)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Free local pickup available!</strong>
              </p>
              <p>
                Customers in the Charlottesville, Virginia area can choose to pick up their order at
                our showroom:
              </p>
              <div className="bg-slate-50 border rounded-lg p-4 mt-3">
                <p className="font-semibold mb-1">Critzer's Cabinet Creations</p>
                <p className="text-sm text-muted-foreground">
                  661 Berkmar Court<br />
                  Charlottesville, VA 22901
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Monday-Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: By appointment
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Select "Local Pickup" at checkout and we'll email you when your order is ready
                (usually 1-2 business days).
              </p>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tracking Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Once your order ships, you'll receive an email with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Tracking number</li>
                <li>Link to track your package</li>
                <li>Estimated delivery date</li>
                <li>Carrier information (USPS, UPS, or FedEx)</li>
              </ul>
              <p className="mt-4">
                You can also check your order status by logging into your account or contacting us
                at{" "}
                <a
                  href="mailto:info@critzerscabinets.com"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  info@critzerscabinets.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* International Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>International Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                At this time, we only ship within the <strong>United States</strong>.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                International shipping may be available in the future. If you're outside the US and
                interested in our products, please contact us at{" "}
                <a
                  href="mailto:info@critzerscabinets.com"
                  className="text-emerald-600 hover:underline"
                >
                  info@critzerscabinets.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Questions About Shipping?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is here to help! Contact us with any questions about shipping, delivery, or
                your order.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <a href="mailto:info@critzerscabinets.com">Email Us</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:4349731691">Call (434) 973-1691</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
