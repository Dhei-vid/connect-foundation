"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  User,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { extractErrorMessage, type UnknownError } from "@/common/helpers";
import type { Orphanage } from "@/common/types";
import {
  getOrphanageProfile,
  updateOrphanageProfile,
} from "@/firebase/orphanages";
import { updateUserOnboardingStatus } from "@/firebase/auth";
import { uploadImage, uploadMultipleImages } from "@/firebase/storage";

// Import step components
import ContactPersonStep from "@/components/onboarding/contact-person-step";
import OrphanageDetailsStep from "@/components/onboarding/orphanage-details-step";
import StatisticsStep from "@/components/onboarding/statistics-step";
import LegalFinancialStep from "@/components/onboarding/legal-financial-step";
import ImagesStep from "@/components/onboarding/images-step";
import ReviewStep from "@/components/onboarding/review-step";

const steps = [
  { id: 1, title: "Contact Person", icon: User, component: ContactPersonStep },
  {
    id: 2,
    title: "Orphanage Details",
    icon: MapPin,
    component: OrphanageDetailsStep,
  },
  { id: 3, title: "Statistics", icon: FileText, component: StatisticsStep },
  {
    id: 4,
    title: "Legal & Financial",
    icon: CreditCard,
    component: LegalFinancialStep,
  },
  {
    id: 5,
    title: "Images",
    icon: ImageIcon,
    component: ImagesStep,
  },
  { id: 6, title: "Review", icon: CheckCircle, component: ReviewStep },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isOrphanage } = useAuthContext();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<Orphanage>>({});

  // Redirect if not authenticated or not orphanage
  useEffect(() => {
    if (!isAuthenticated || !isOrphanage) {
      router.push("/orphanage/signin");
      return;
    }
    if (user?.onboardingCompleted) {
      router.push("/orphanage");
      return;
    }
  }, [isAuthenticated, isOrphanage, user, router]);

  // Load existing orphanage data
  useEffect(() => {
    const loadOrphanageData = async () => {
      if (!user?.uid) return;

      try {
        setIsLoadingData(true);
        const existingData = await getOrphanageProfile(user.uid);

        if (existingData) {
          setFormData(existingData);
        }
      } catch (error) {
        console.error("Error loading orphanage data:", error);
        toast.error("Error loading your data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user?.uid) {
      loadOrphanageData();
    }
  }, [user?.uid]);

  const updateFormData = useCallback((data: Partial<Orphanage>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submitting orphanage onboarding data
  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Update orphanage profile with complete data
      await getOrphanageProfile(user!.uid);

      // uploading onboarding images
      const images = formData.imageFiles?.map((img) => img.file) ?? [];
      const logo = formData.logoURLFile;
      const cover = formData.coverImageFile;

      if (!cover?.file) {
        toast.error("Please upload cover image");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      toast.info("Uploading images...");
      const imagesURL = images.length
        ? await uploadMultipleImages(
            images,
            `onboarding/${formData.name}/images-${Date.now()}`
          )
        : [];
      const logoImageURL = logo?.file
        ? await uploadImage(
            logo.file,
            `onboarding/${formData.name}/logo-${Date.now()}`
          )
        : undefined;
      const coverURL = cover?.file
        ? await uploadImage(
            cover.file,
            `onboarding/${formData.name}/cover-${Date.now()}`
          )
        : undefined;
      toast.success("Image Uploaded Successfully");

      const { imageFiles, logoURLFile, coverImageFile, ...rest } = formData;

      const onBoardingData = {
        ...rest,
        images: imagesURL,
        logoURL: logoImageURL,
        coverImageURL: coverURL,
      };

      toast.info("Uploading orphanage data...");
      await updateOrphanageProfile(user!.uid, onBoardingData as Orphanage);

      toast.success("Orphanage data created successfully");

      // Update user onboarding status
      await updateUserOnboardingStatus(user!.uid, true);

      toast.success("Profile completed successfully!");
      router.push("/orphanage/dashboard");
    } catch (error) {
      const errorMessage = extractErrorMessage(error as UnknownError);
      toast.error("Error completing profile", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  if (!isAuthenticated || !isOrphanage || user?.onboardingCompleted) {
    return null;
  }

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Help us learn more about your orphanage to provide better support
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> We&apos;ve pre-filled the form with the
              information you provided during signup. You can modify any details
              as needed.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className={"h-2"} />
        </div>

        {/* Step Navigation */}
        <div className="hidden lg:flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-main-blue text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {React.createElement(step.icon, { className: "w-5 h-5" })}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id
                        ? "bg-main-blue"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="py-6 mb-8">
          <CardHeader>
            <CardTitle className="bg-main-blue/10 rounded-full p-2 px-3 w-fit flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-6 h-6",
              })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
              onComplete={completeOnboarding}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {/* <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "Completing..." : "Complete Profile"}
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div> */}
      </div>
    </div>
  );
}
