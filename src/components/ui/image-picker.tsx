"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void; // 👈 new prop to pass selected file up
  progress?: number;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ImagePicker({
  value,
  onChange,
  progress,
  onFileSelect,
  placeholder = "Enter image URL or upload a file",
  showPreview = true,
  className,
  disabled = false,
}: ImagePickerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || disabled) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setImagePreview(blobUrl);
    onChange(blobUrl);
    onFileSelect?.(file); // 👈 pass file up to parent
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;
    handleFile(files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = () => {
    if (value.startsWith("blob:")) URL.revokeObjectURL(value);
    setImagePreview(null);
    onChange("");
    onFileSelect?.(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* URL Input */}
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-main-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Drag & Drop Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-main-500 bg-main-50 dark:bg-main-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-main-600 hover:text-main-500 font-medium"
            >
              Click to select
            </button>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {/* Preview - show when we have a local preview OR an existing value */}
      {showPreview && (imagePreview || value) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Preview</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative w-full h-60 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={imagePreview || value}
              alt="Preview"
              fill
              className="object-cover"
            />
            {/* Hover actions - allow changing the image even when editing an existing URL */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={disabled}
              >
                Change
              </Button>
            </div>
          </div>
        </div>
      )}

      {progress && progress > 0 && (
        <div className="space-y-3">
          <div className="flex flex-row justify-between">
            <p className="text-sm text-main-blue">Uploading Image:</p>
            <p className="text-sm text-main-blue">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  );
}
