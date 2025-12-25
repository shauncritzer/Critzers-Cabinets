import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, AlertCircle, Package, Mail, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ReturnPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Return Policy</h1>
          <p className="text-emerald-100 text-lg">
            30-day returns | Your satisfaction is our priority
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Return Window */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                30-Day Return Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                We want you to love your purchase! If you're not completely satisfied, you may return
                items within <strong>30 days</strong> of delivery for a refund.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900">
                  <strong>Important:</strong> The 30-day window starts from the date of delivery, not
                  the purchase date. Keep your tracking information as proof of delivery date.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Return Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Return Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To be eligible for a return, items must meet the following conditions:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong className="text-foreground">Unused and in original condition:</strong> Items
                  must be uninstalled, unopened (if sealed), and in resaleable condition
                </li>
                <li>
                  <strong className="text-foreground">Original packaging:</strong> Items must be
                  returned in their original packaging with all hardware and accessories
                </li>
                <li>
                  <strong className="text-foreground">No installation:</strong> Once hardware has been
                  installed, it cannot be returned
                </li>
                <li>
                  <strong className="text-foreground">Order number:</strong> Include your order number
                  with the return package
                </li>
              </ul>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-semibold mb-1">Non-Returnable Items:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Custom or special-order items</li>
                      <li>Items that have been installed or used</li>
                      <li>Items damaged due to customer error or mishandling</li>
                      <li>Clearance or final sale items (marked as such)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restocking Fee */}
          <Card>
            <CardHeader>
              <CardTitle>Restocking Fee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                A <strong>25% restocking fee</strong> applies to all returns. This fee helps cover:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Return processing and inspection</li>
                <li>Repackaging for resale</li>
                <li>Manufacturer restocking charges</li>
                <li>Administrative costs</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-900">
                  <strong>Example:</strong> If you purchased $100 worth of hardware and return it, you
                  will receive a refund of $75 (minus return shipping costs).
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                <strong>Exceptions:</strong> The restocking fee is waived if we shipped the wrong item
                or if the item arrived damaged or defective.
              </p>
            </CardContent>
          </Card>

          {/* Return Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Return Shipping Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Customer is responsible for return shipping costs</strong> unless the item
                arrived damaged or we shipped the wrong item.
              </p>

              <div className="space-y-3 mt-4">
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h4 className="font-semibold mb-1">Free Return Shipping:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                    <li>We shipped the wrong item</li>
                    <li>Item arrived damaged in transit</li>
                    <li>Item is defective or has a manufacturing defect</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold mb-1">Customer Pays Return Shipping:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                    <li>Changed your mind</li>
                    <li>Ordered wrong item</li>
                    <li>No longer need the item</li>
                    <li>Found a better price elsewhere</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                <strong>Tip:</strong> We recommend using a trackable shipping method with insurance for
                your return. We are not responsible for returns lost in transit.
              </p>
            </CardContent>
          </Card>

          {/* How to Initiate a Return */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                How to Initiate a Return
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Follow these steps to return an item:</p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Contact Us</h4>
                    <p className="text-sm text-muted-foreground">
                      Email{" "}
                      <a
                        href="mailto:info@critzerscabinets.com"
                        className="text-emerald-600 hover:underline"
                      >
                        info@critzerscabinets.com
                      </a>{" "}
                      with your order number, item(s) you wish to return, and reason for return.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Receive Authorization</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll review your request and provide a Return Authorization (RA) number within
                      24 hours. Do not ship items without an RA number.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Pack Items Securely</h4>
                    <p className="text-sm text-muted-foreground">
                      Pack items in original packaging with all accessories. Include your RA number
                      inside the box on a piece of paper.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Ship Your Return</h4>
                    <p className="text-sm text-muted-foreground">
                      Ship to the address provided in your RA email. Use a trackable shipping method
                      and keep your tracking number.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Receive Your Refund</h4>
                    <p className="text-sm text-muted-foreground">
                      Once we receive and inspect your return (typically 3-5 business days), we'll
                      process your refund within 7-10 business days to your original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card>
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                We currently do not offer direct exchanges. If you need a different item:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Return the original item following our return process</li>
                <li>Place a new order for the item you want</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-3">
                This ensures you receive your new item as quickly as possible without waiting for the
                return to be processed.
              </p>
            </CardContent>
          </Card>

          {/* Damaged or Defective Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Damaged or Defective Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                If your item arrives damaged or has a manufacturing defect, please contact us
                immediately at{" "}
                <a
                  href="mailto:info@critzerscabinets.com"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  info@critzerscabinets.com
                </a>
                .
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-emerald-900 font-semibold mb-2">
                  We'll Make It Right:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-emerald-900 ml-2">
                  <li>No restocking fee for damaged/defective items</li>
                  <li>Free return shipping (we'll provide a prepaid label)</li>
                  <li>Full refund OR free replacement sent immediately</li>
                  <li>Expedited shipping on replacement at no charge</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mt-3">
                <strong>Please include photos</strong> of the damaged item and packaging to help us
                process your claim quickly. Top Knobs backs their products with a{" "}
                <strong>lifetime warranty</strong> against manufacturing defects.
              </p>
            </CardContent>
          </Card>

          {/* Top Knobs Warranty */}
          <Card>
            <CardHeader>
              <CardTitle>Top Knobs Lifetime Warranty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                All Top Knobs hardware is backed by the manufacturer's <strong>lifetime warranty</strong>{" "}
                against defects in materials and workmanship.
              </p>
              <p className="text-sm text-muted-foreground">
                This warranty covers manufacturing defects but does not cover damage from misuse,
                improper installation, or normal wear and tear. For warranty claims on items you've
                already installed, please contact us and we'll coordinate with Top Knobs for a
                replacement.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Learn more at{" "}
                <a
                  href="https://www.topknobs.com/warranty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  topknobs.com/warranty
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Questions About Returns?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're here to help! If you have questions about our return policy or need to start a
                return, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <a href="mailto:info@critzerscabinets.com">Email Us</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:4349731691">Call (434) 973-1691</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Hours: Monday-Friday 9:00 AM - 5:00 PM EST
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
