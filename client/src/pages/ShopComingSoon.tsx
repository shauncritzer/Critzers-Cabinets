import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Wrench, ArrowLeft } from "lucide-react";

export default function ShopComingSoon() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-20">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Wrench className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">Hardware Shop Coming Soon!</CardTitle>
              <CardDescription className="text-lg">
                We're currently updating our Top Knobs hardware catalog with the latest products and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">What to Expect:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Browse 250+ premium Top Knobs cabinet hardware products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Filter by collection, finish, and style</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>View detailed specifications and pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add items to your cart and checkout securely</span>
                  </li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  In the meantime, feel free to contact us directly for hardware selections and pricing.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button>
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
