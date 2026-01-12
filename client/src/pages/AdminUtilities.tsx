import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle, Wrench } from "lucide-react";

export default function AdminUtilities() {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixGallery = trpc.gallery.fixGalleryDuplicates.useMutation({
    onSuccess: (data) => {
      setIsFixing(false);
      setResult(data);
      toast.success(data.message || "Gallery duplicates fixed!");
    },
    onError: (error) => {
      setIsFixing(false);
      toast.error("Failed to fix gallery: " + error.message);
    },
  });

  const handleFixGallery = () => {
    if (confirm("This will remove duplicate gallery items. Continue?")) {
      setIsFixing(true);
      setResult(null);
      fixGallery.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Wrench className="h-8 w-8" />
              Admin Utilities
            </h1>
            <p className="text-muted-foreground">
              Quick tools for managing your website
            </p>
          </div>

          {/* Fix Gallery Duplicates Card */}
          <Card>
            <CardHeader>
              <CardTitle>Fix Gallery Duplicates</CardTitle>
              <CardDescription>
                Remove duplicate images from the gallery page. This will keep only one copy of each image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleFixGallery} 
                disabled={isFixing}
                size="lg"
                className="w-full"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fixing Gallery...
                  </>
                ) : (
                  "Fix Gallery Duplicates"
                )}
              </Button>

              {result && (
                <div className={`p-4 rounded-lg border ${
                  result.success 
                    ? "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100" 
                    : "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100"
                }`}>
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-2">
                      <p className="font-semibold">{result.message}</p>
                      {result.deleted > 0 && (
                        <div className="text-sm space-y-1">
                          <p>✓ Deleted {result.deleted} duplicate items</p>
                          <p>✓ {result.remaining} unique items remaining</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100">
                <p className="font-semibold mb-1">When to use this:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Gallery page shows duplicate images</li>
                  <li>After uploading new gallery items</li>
                  <li>Safe to run multiple times</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Future Tools Placeholder */}
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>More Tools Coming Soon</CardTitle>
              <CardDescription>
                Additional admin utilities will be added here as needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Future tools: Bulk product updates, order management, customer reports, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
