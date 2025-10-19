"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ImagePicker({
  value,
  onChange,
  placeholder = "Enter image URL or upload a file",
  showPreview = true,
  className,
  disabled = false,
}: ImagePickerProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || disabled) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Create blob URL for preview
    const blobUrl = URL.createObjectURL(file);
    onChange(blobUrl);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;
    const file = files[0];
    handleFile(file);
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
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = () => {
    if (value.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
    onChange("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Input Field */}
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

      {/* Upload Area */}
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
          onChange={handleFileInput}
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
              Click to upload
            </button>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {/* Preview */}
      {showPreview && value && (
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
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                // Handle error if needed
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
