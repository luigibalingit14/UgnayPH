"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Camera,
  Upload,
  X,
  ImageIcon,
  Smartphone,
  FileImage,
} from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (imageData: string, mimeType: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageUpload({
  onImageSelect,
  onClear,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("Image too large. Maximum size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreview(result);
          // Extract base64 data (remove data:image/...;base64, prefix)
          const base64Data = result.split(",")[1];
          onImageSelect(base64Data, file.type);
        }
      };
      reader.onerror = () => {
        setError("Failed to read image. Please try again.");
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClear = useCallback(() => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onClear();
  }, [onClear]);

  const triggerFileSelect = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  if (preview) {
    return (
      <div className="relative">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-[300px] w-auto object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 bg-muted/50 text-center text-sm text-muted-foreground">
            <FileImage className="h-4 w-4 inline mr-2" />
            Image ready for analysis
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
          }
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
        onClick={triggerFileSelect}
      >
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-4 rounded-full">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <p className="font-medium">
              {isDragging ? "Drop image here!" : "Drag & drop image here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: JPEG, PNG, WebP, GIF (max 10MB)
          </p>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={triggerFileSelect}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={triggerCamera}
          disabled={disabled}
        >
          <Camera className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Take Photo</span>
          <Smartphone className="h-4 w-4 sm:hidden" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tips */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <p className="font-medium mb-1">Best for scanning:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Screenshots ng suspicious messages/chats</li>
          <li>Photos ng documents or IDs</li>
          <li>Social media posts na medyo sus</li>
          <li>Promo flyers o advertisements</li>
        </ul>
      </div>
    </div>
  );
}
