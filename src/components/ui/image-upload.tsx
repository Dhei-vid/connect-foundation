"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage, generateImagePath, validateImageFile } from "@/firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
  placeholder = "Upload an image",
  className,
  disabled = false,
  required = false,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Generate unique path
      const imagePath = generateImagePath(folder, file.name);
      
      // Upload image
      const imageUrl = await uploadImage(file, imagePath);
      
      // Update state
      setPreview(imageUrl);
      onChange(imageUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          "hover:border-primary/50 cursor-pointer",
          preview ? "border-primary" : "border-gray-300 dark:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uploading image...
            </p>
          </div>
        ) : preview ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag and drop or click to select
              </p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supports JPEG, PNG, WebP up to 5MB
      </p>
    </div>
  );
}
