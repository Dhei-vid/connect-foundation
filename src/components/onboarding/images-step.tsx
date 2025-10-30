"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageFile,
  MultiImageUpload,
} from "@/components/ui/multi-image-upload";
import { SingleImageUpload } from "@/components/ui/single-image-upload";
import Image from "next/image";
import { Building2, Image as ImageIcon, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Orphanage } from "@/common/types";
import { Button } from "../ui/button";
import { initialImageFile } from "@/common/data";

interface ImagesStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ImagesStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: ImagesStepProps) {
  const [logoURL, setLogoURL] = useState<string | undefined>(data.logoURL);
  const [coverImageURL, setCoverImageURL] = useState<string | undefined>(
    data.coverImageURL
  );
  const [images, setImages] = useState<string[]>(data.images || []);
  const [localImages, setLocalImages] = useState<ImageFile[]>([]);
  const [coverImageFile, setCoverImageFile] =
    useState<ImageFile>(initialImageFile);
  const [logoFile, setLogoFile] = useState<ImageFile>(initialImageFile);

  const [logoSource, setLogoSource] = useState<"upload" | "gallery">("upload");
  const [coverSource, setCoverSource] = useState<"upload" | "gallery">(
    "upload"
  );
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number>(-1);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number>(-1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize selected indices if logo/cover are from gallery
  useEffect(() => {
    if (data.logoURL && images.length > 0) {
      const logoIndex = images.indexOf(data.logoURL);
      if (logoIndex !== -1) {
        setSelectedLogoIndex(logoIndex);
        setLogoSource("gallery");
      }
    }
    if (data.coverImageURL && images.length > 0) {
      const coverIndex = images.indexOf(data.coverImageURL);
      if (coverIndex !== -1) {
        setSelectedCoverIndex(coverIndex);
        setCoverSource("gallery");
      }
    }
  }, [data.logoURL, data.coverImageURL, images]);

  // Update parent component when any image data changes
  useEffect(() => {
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
  }, [
    logoURL,
    coverImageURL,
    images,
    logoSource,
    coverSource,
    selectedLogoIndex,
    selectedCoverIndex,
    onUpdate,
  ]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!coverImageURL) {
      newErrors.name = "Please add a cover image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({
        ...data,
        images: [...localImages.map((item) => item.preview)],
        imageFiles: localImages,
        coverImageFile: coverImageFile,
        logoURLFile: logoFile,
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Images
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add photos to showcase your orphanage, then select your logo and cover
          image from the gallery
        </p>
      </div>

      {/* Logo and Cover Upload - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Upload */}
        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Organization Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your logo (square, 400x400px recommended)
            </p>

            <div className="flex justify-center">
              <div className="w-40 h-40 overflow-hidden">
                <SingleImageUpload
                  value={logoSource === "upload" ? logoURL : undefined}
                  onChange={handleLogoUpload}
                  imageFile={logoFile}
                  setImageFile={setLogoFile}
                  aspectRatio="square"
                  placeholder="Upload logo"
                  maxSizeMB={5}
                />
              </div>
            </div>

            {logoSource === "upload" && logoURL && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-300">
                <Check className="h-4 w-4" />
                Logo uploaded
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Image Upload */}
        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4" />
              Cover Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload cover (landscape, 1200x400px recommended)
            </p>

            <SingleImageUpload
              value={coverSource === "upload" ? coverImageURL : undefined}
              onChange={handleCoverUpload}
              imageFile={coverImageFile}
              setImageFile={setCoverImageFile}
              aspectRatio="video"
              placeholder="Upload cover"
              maxSizeMB={5}
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

      {/* Photo Gallery Upload Section */}
      <Card className="py-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload photos of your orphanage, facilities, children (with
            consent), and activities
          </p>

          <MultiImageUpload
            value={images}
            setLocalImages={setLocalImages}
            localImages={localImages}
            onChange={handleImagesChange}
            maxImages={20}
            maxSizeMB={5}
            label=""
            description="Upload up to 20 images. You can also select images from here to use as your logo or cover."
          />
        </CardContent>
      </Card>

      {/* Alternative: Select Logo from Gallery */}
      {images.length > 0 && (
        <Card className="py-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Or Select Logo from Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  className={cn(
                    "relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105",
                    selectedLogoIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <Image
                    src={image}
                    width={200}
                    height={200}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
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
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-300 dark:border-blue-700 flex-shrink-0">
                  <Image
                    src={images[selectedLogoIndex]}
                    alt="Selected Logo"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
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
          </CardContent>
        </Card>
      )}

      {/* Alternative: Select Cover from Gallery */}
      {images.length > 0 && (
        <Card className="py-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Or Select Cover from Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
                    selectedCoverIndex === index
                      ? "border-green-500 ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <Image
                    src={image}
                    width={400}
                    height={400}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
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
                <div className="w-20 h-12 rounded-md overflow-hidden border border-green-300 dark:border-green-700 flex-shrink-0">
                  <Image
                    src={images[selectedCoverIndex]}
                    width={400}
                    height={400}
                    alt="Selected Cover"
                    className="w-full h-full object-cover"
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
          </CardContent>
        </Card>
      )}

      {/* Helpful Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          📸 Image Upload Tips:
        </p>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
          <li>
            <strong>Two ways to add logo/cover:</strong> Upload directly OR
            select from your gallery
          </li>
          <li>
            Logo: Upload a dedicated logo image or choose a square image from
            gallery
          </li>
          <li>
            Cover: Upload a banner image or choose a landscape image from
            gallery
          </li>
          <li>
            Gallery: Upload multiple photos showcasing your facilities,
            children, and activities
          </li>
          <li>Use high-quality images that clearly show your facilities</li>
          <li>
            Ensure you have proper consent for any photos featuring children
          </li>
          <li>
            Consider including: building exterior, classrooms, dormitories,
            playground, dining area
          </li>
          <li>
            Images help donors connect with your mission and increase trust
          </li>
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
