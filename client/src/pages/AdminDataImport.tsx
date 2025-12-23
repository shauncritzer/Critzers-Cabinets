import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDataImport() {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    products?: number;
    gallery?: number;
    error?: string;
  }>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const importProductsMutation = trpc.admin.importProducts.useMutation();
  const importGalleryMutation = trpc.admin.importGallery.useMutation();
  const clearProductsMutation = trpc.admin.clearProducts.useMutation();

  const handleClearProducts = async () => {
    setImporting(true);
    setResults({});
    try {
      await clearProductsMutation.mutateAsync();
      setResults({ products: 0 });
      setShowClearConfirm(false);
    } catch (error: any) {
      setResults({ error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const handleImportProducts = async () => {
    setImporting(true);
    setResults({});
    try {
      const result = await importProductsMutation.mutateAsync();
      setResults((prev) => ({ ...prev, products: result.count }));
    } catch (error: any) {
      setResults((prev) => ({ ...prev, error: error.message }));
    } finally {
      setImporting(false);
    }
  };

  const handleImportGallery = async () => {
    setImporting(true);
    setResults({});
    try {
      const result = await importGalleryMutation.mutateAsync();
      setResults((prev) => ({ ...prev, gallery: result.count }));
    } catch (error: any) {
      setResults((prev) => ({ ...prev, error: error.message }));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Railway Database Import</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Import Products</h2>
          <p className="text-gray-600 mb-4">
            Import Top Knobs products from the Excel file into the Railway database.
          </p>

          <div className="flex gap-3 mb-4">
            <Button
              onClick={handleImportProducts}
              disabled={importing}
              size="lg"
            >
              {importing ? "Importing..." : "Import Products"}
            </Button>

            <Button
              onClick={() => setShowClearConfirm(true)}
              disabled={importing}
              size="lg"
              variant="destructive"
            >
              Clear All Products
            </Button>
          </div>

          {showClearConfirm && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">⚠️ Are you sure?</p>
              <p className="text-red-700 text-sm mb-3">
                This will delete ALL products from the database. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearProducts}
                  disabled={importing}
                  size="sm"
                  variant="destructive"
                >
                  Yes, Delete All Products
                </Button>
                <Button
                  onClick={() => setShowClearConfirm(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {results.products !== undefined && (
            <div className="mt-4 space-y-2">
              {results.products === 0 ? (
                <p className="text-green-600 font-semibold">
                  ✓ All products cleared from database!
                </p>
              ) : (
                <>
                  <p className="text-green-600 font-semibold">
                    ✓ Imported {results.products} active products successfully!
                  </p>
                  {(results as any).discontinued > 0 && (
                    <p className="text-sm text-gray-600">
                      Skipped {(results as any).discontinued} discontinued items
                    </p>
                  )}
                  {(results as any).noPricing > 0 && (
                    <p className="text-sm text-gray-600">
                      Skipped {(results as any).noPricing} items without pricing
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Total processed: {(results as any).total || 'N/A'} rows
                  </p>
                </>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Import Gallery Images</h2>
          <p className="text-gray-600 mb-4">
            Import 8 Omega Cabinetry gallery items into the Railway database.
          </p>
          <Button
            onClick={handleImportGallery}
            disabled={importing}
            size="lg"
          >
            {importing ? "Importing..." : "Import Gallery"}
          </Button>
          {results.gallery !== undefined && (
            <p className="mt-4 text-green-600">
              ✓ Imported {results.gallery} gallery items successfully!
            </p>
          )}
        </Card>

        {results.error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">Error: {results.error}</p>
          </Card>
        )}

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Import Products" to load all 7,358 Top Knobs products</li>
            <li>Click "Import Gallery" to load the 8 Omega Cabinetry images</li>
            <li>Wait for confirmation messages</li>
            <li>Refresh the Shop Hardware and Gallery pages to verify</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
