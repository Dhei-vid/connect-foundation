"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
  uploaded?: boolean;
  url?: string;
}

interface MultiImageUploadProps {
  value: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
  label = "Upload Images",
  description,
  className,
  disabled = false,
}: MultiImageUploadProps) {
  const [localImages, setLocalImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const remainingSlots = maxImages - (value.length + localImages.length);
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImages: ImageFile[] = [];

    filesToAdd.forEach((file) => {
      // Validate file size
      if (file.size > maxSizeBytes) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} is not an image`);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);

      newImages.push({
        id,
        file,
        preview,
        uploading: false,
        uploaded: false,
      });
    });

    setLocalImages((prev) => [...prev, ...newImages]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeLocalImage = (id: string) => {
    setLocalImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const removeUploadedImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const totalImages = value.length + localImages.length;
  const canAddMore = totalImages < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label and Description */}
      {label && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PNG, JPG, GIF up to {maxSizeMB}MB ({maxImages - totalImages}{" "}
            remaining)
          </p>
        </div>
      )}

      {/* Image Grid */}
      {(value.length > 0 || localImages.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {value.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUploadedImage(url);
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Uploaded
              </div>
            </div>
          ))}

          {/* Local Images (Not yet uploaded) */}
          {localImages.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={image.preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocalImage(image.id);
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-main-blue text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Local
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Message */}
      {!canAddMore && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Maximum of {maxImages} images reached
        </p>
      )}

      {/* Helper Text */}
      {localImages.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> {localImages.length} image(s) selected but
            not uploaded yet. These will be stored locally until you implement
            Firebase Storage upload.
          </p>
        </div>
      )}
    </div>
  );
}
