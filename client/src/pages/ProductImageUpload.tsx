import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface UploadResult {
  filename: string;
  sku: string;
  status: "success" | "error" | "no_match";
  message: string;
}

export default function ProductImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  const uploadImage = trpc.admin.uploadProductImage.useMutation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (files: FileList) => {
    setUploading(true);
    setResults([]);
    const newResults: UploadResult[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        newResults.push({
          filename: file.name,
          sku: "",
          status: "error",
          message: "Not an image file",
        });
        continue;
      }

      // Extract SKU from filename (e.g., "TK123.jpg" -> "TK123")
      const sku = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").toUpperCase();

      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // Remove data:image/...;base64, prefix
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const result = await uploadImage.mutateAsync({
          sku,
          imageData: base64,
          mimeType: file.type,
        });

        newResults.push({
          filename: file.name,
          sku,
          status: result.success ? "success" : result.matched ? "error" : "no_match",
          message: result.message,
        });
      } catch (error) {
        newResults.push({
          filename: file.name,
          sku,
          status: "error",
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    setResults(newResults);
    setUploading(false);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFiles(files);
    }
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const noMatchCount = results.filter((r) => r.status === "no_match").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Product Image Upload</h1>
          <p className="text-muted-foreground">
            Upload product images and automatically match them to products by SKU
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Instructions</CardTitle>
            <CardDescription>
              Name your image files with the product SKU (e.g., "TK123.jpg", "M1234.png")
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-colors
                ${isDragging ? "border-primary bg-primary/5" : "border-border"}
                ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">Uploading images...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Drag & drop images here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Button>Select Files</Button>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
                disabled={uploading}
              />
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Results</CardTitle>
              <CardDescription>
                {successCount} successful, {noMatchCount} no match, {errorCount} errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {result.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.message}
                      </p>
                    </div>
                    {result.sku && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {result.sku}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
