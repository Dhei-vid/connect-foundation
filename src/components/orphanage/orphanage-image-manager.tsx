"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { SingleImageUpload } from "@/components/ui/single-image-upload";
import { Image as ImageIcon, Building2, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Orphanage } from "@/common/types";

interface OrphanageImageManagerProps {
  orphanage: Partial<Orphanage>;
  onUpdate: (updates: Partial<Orphanage>) => void;
  disabled?: boolean;
}

export function OrphanageImageManager({
  orphanage,
  onUpdate,
  disabled = false,
}: OrphanageImageManagerProps) {
  const [logoURL, setLogoURL] = useState<string | undefined>(orphanage.logoURL);
  const [coverImageURL, setCoverImageURL] = useState<string | undefined>(
    orphanage.coverImageURL
  );
  const [images, setImages] = useState<string[]>(orphanage.images || []);
  const [logoSource, setLogoSource] = useState<"upload" | "gallery">("upload");
  const [coverSource, setCoverSource] = useState<"upload" | "gallery">(
    "upload"
  );
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number>(-1);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number>(-1);

  // Initialize selected indices if logo/cover are from gallery
  useEffect(() => {
    if (orphanage.logoURL && images.length > 0) {
      const logoIndex = images.indexOf(orphanage.logoURL);
      if (logoIndex !== -1) {
        setSelectedLogoIndex(logoIndex);
        setLogoSource("gallery");
      }
    }
    if (orphanage.coverImageURL && images.length > 0) {
      const coverIndex = images.indexOf(orphanage.coverImageURL);
      if (coverIndex !== -1) {
        setSelectedCoverIndex(coverIndex);
        setCoverSource("gallery");
      }
    }
  }, [orphanage.logoURL, orphanage.coverImageURL, images]);

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);

    // Reset gallery selections if the selected image was removed
    if (
      logoSource === "gallery" &&
      selectedLogoIndex >= 0 &&
      !newImages.includes(images[selectedLogoIndex])
    ) {
      setSelectedLogoIndex(-1);
    }
    if (
      coverSource === "gallery" &&
      selectedCoverIndex >= 0 &&
      !newImages.includes(images[selectedCoverIndex])
    ) {
      setSelectedCoverIndex(-1);
    }
  };

  const handleSelectLogo = (index: number) => {
    setSelectedLogoIndex(selectedLogoIndex === index ? -1 : index);
    if (selectedLogoIndex !== index) {
      setLogoSource("gallery");
    }
  };

  const handleSelectCover = (index: number) => {
    setSelectedCoverIndex(selectedCoverIndex === index ? -1 : index);
    if (selectedCoverIndex !== index) {
      setCoverSource("gallery");
    }
  };

  const handleLogoUpload = (url: string | undefined) => {
    setLogoURL(url);
    setLogoSource("upload");
    setSelectedLogoIndex(-1); // Clear gallery selection
  };

  const handleCoverUpload = (url: string | undefined) => {
    setCoverImageURL(url);
    setCoverSource("upload");
    setSelectedCoverIndex(-1); // Clear gallery selection
  };

  const handleSave = () => {
    const finalLogoURL =
      logoSource === "gallery" && selectedLogoIndex >= 0
        ? images[selectedLogoIndex]
        : logoURL;

    const finalCoverURL =
      coverSource === "gallery" && selectedCoverIndex >= 0
        ? images[selectedCoverIndex]
        : coverImageURL;

    onUpdate({
      logoURL: finalLogoURL,
      coverImageURL: finalCoverURL,
      images,
    });
    toast.success("Images updated successfully");
  };

  const handleReset = () => {
    setLogoURL(orphanage.logoURL);
    setCoverImageURL(orphanage.coverImageURL);
    setImages(orphanage.images || []);
    setLogoSource("upload");
    setCoverSource("upload");
    setSelectedLogoIndex(-1);
    setSelectedCoverIndex(-1);
    toast.info("Changes reset");
  };

  const hasChanges =
    logoURL !== orphanage.logoURL ||
    coverImageURL !== orphanage.coverImageURL ||
    JSON.stringify(images) !== JSON.stringify(orphanage.images || []) ||
    (logoSource === "gallery" &&
      selectedLogoIndex >= 0 &&
      images[selectedLogoIndex] !== orphanage.logoURL) ||
    (coverSource === "gallery" &&
      selectedCoverIndex >= 0 &&
      images[selectedCoverIndex] !== orphanage.coverImageURL);

  return (
    <div className="space-y-6">
      {/* Logo and Cover Upload - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Organization Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload logo (square, 400x400px)
            </p>

            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden">
                <SingleImageUpload
                  value={logoSource === "upload" ? logoURL : undefined}
                  onChange={handleLogoUpload}
                  aspectRatio="square"
                  placeholder="Upload logo"
                  maxSizeMB={5}
                  disabled={disabled}
                />
              </div>
            </div>

            {logoSource === "upload" && logoURL && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Check className="h-4 w-4" />
                Logo uploaded
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Image Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4" />
              Cover Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload cover (landscape, 1200x400px)
            </p>

            <SingleImageUpload
              value={coverSource === "upload" ? coverImageURL : undefined}
              onChange={handleCoverUpload}
              aspectRatio="video"
              placeholder="Upload cover"
              maxSizeMB={5}
              disabled={disabled}
            />

            {coverSource === "upload" && coverImageURL && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-300">
                <Check className="h-4 w-4" />
                Cover uploaded
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gallery Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload photos of your orphanage, facilities, and activities. You
              can also select images from here to use as logo or cover.
            </p>
            <MultiImageUpload
              value={images}
              onChange={handleImagesChange}
              maxImages={20}
              maxSizeMB={5}
              label=""
              description="Upload up to 20 images to showcase your orphanage."
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Select Logo from Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Or Select Logo from Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Already uploaded to gallery? Click an image below to use it as
                  your logo instead.
                </p>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectLogo(index)}
                    disabled={disabled}
                    className={cn(
                      "relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105",
                      selectedLogoIndex === index
                        ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedLogoIndex === index && (
                      <>
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 text-white rounded-full p-1.5">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {selectedLogoIndex >= 0 && logoSource === "gallery" && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-300 dark:border-blue-700 flex-shrink-0 relative">
                    <Image
                      src={images[selectedLogoIndex]}
                      alt="Selected Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Logo Selected from Gallery
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      This image will be used as your organization&apos;s logo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Select Cover Image from Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Or Select Cover from Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Already uploaded to gallery? Click an image below to use it as
                  your cover instead.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectCover(index)}
                    disabled={disabled}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
                      selectedCoverIndex === index
                        ? "border-green-500 ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedCoverIndex === index && (
                      <>
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-green-500 text-white rounded-full p-1.5">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {selectedCoverIndex >= 0 && coverSource === "gallery" && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-20 h-12 rounded-md overflow-hidden border border-green-300 dark:border-green-700 flex-shrink-0 relative">
                    <Image
                      src={images[selectedCoverIndex]}
                      alt="Selected Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Cover Image Selected from Gallery
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      This will be displayed as your profile banner
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex justify-end gap-3 sticky bottom-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <Button variant="outline" onClick={handleReset} disabled={disabled}>
            Reset Changes
          </Button>
          <Button onClick={handleSave} disabled={disabled}>
            Save Images
          </Button>
        </div>
      )}
    </div>
  );
}
