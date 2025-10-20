"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface SingleImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string | undefined) => void;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  aspectRatio?: "square" | "video" | "auto";
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function SingleImageUpload({
  value,
  onChange,
  maxSizeMB = 5,
  label,
  description,
  aspectRatio = "auto",
  className,
  disabled = false,
  placeholder = "Click to upload or drag and drop",
}: SingleImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  const handleFile = (file: File) => {
    if (disabled) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Validate file size
    if (file.size > maxSizeBytes) {
      alert(`File is too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File is not an image");
      return;
    }

    // Create local preview
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);

    // For now, just store the preview URL
    // When Firebase Storage is implemented, this will upload and return the URL
    onChange(preview);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    onChange(undefined);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = value || localPreview;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative rounded-lg overflow-hidden cursor-pointer transition-all w-full h-full",
          aspectClasses[aspectRatio],
          displayImage ? "border-2 border-gray-200 dark:border-gray-700" : "",
          !displayImage && "border-2 border-dashed",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {displayImage ? (
          <>
            <Image
              src={displayImage}
              width={400}
              height={400}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {localPreview && (
              <div className="absolute top-2 right-[30%] bg-main-blue text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Upload className="h-3 w-3" />
                Local
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Spinner className="h-8 w-8 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[160px] p-4">
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {localPreview && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Image selected locally. Will be uploaded when
            you save changes.
          </p>
        </div>
      )}
    </div>
  );
}
