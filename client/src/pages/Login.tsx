import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>

          <h1 className="text-2xl font-bold">Authentication Not Available</h1>

          <p className="text-gray-600">
            This Railway deployment is running without Manus OAuth integration.
            Authentication features are not available in this environment.
          </p>

          <div className="w-full pt-4 space-y-3">
            <p className="text-sm text-gray-500">
              You can still access:
            </p>
            <ul className="text-sm text-left space-y-2 text-gray-600">
              <li>✓ Shop Hardware (7,358 products)</li>
              <li>✓ Gallery (kitchen showcase)</li>
              <li>✓ Shopping Cart</li>
              <li>✓ Quote Request System</li>
              <li>✓ About & Contact Info</li>
            </ul>
          </div>

          <div className="w-full pt-4 space-y-2">
            <Button
              onClick={() => setLocation("/")}
              className="w-full"
              size="lg"
            >
              Go to Homepage
            </Button>
            <Button
              onClick={() => setLocation("/shop")}
              variant="outline"
              className="w-full"
            >
              Browse Hardware Store
            </Button>
          </div>

          <p className="text-xs text-gray-400 pt-4">
            For admin access, contact the site administrator
          </p>
        </div>
      </Card>
    </div>
  );
}
