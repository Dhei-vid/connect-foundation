"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/components/providers";
import { extractErrorMessage, type UnknownError } from "@/common/helpers";
import { toast } from "sonner";
import type { Orphanage } from "@/common/types";

import { orphanageDefaultFormValues, OrphanageFormProps } from "@/common/form";
import { Card, CardContent } from "@/components/ui/card";

export default function OrphanageSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { isAuthenticated, signUp } = useAuthContext();

  // Form state
  const [formData, setFormData] = useState<OrphanageFormProps>(
    orphanageDefaultFormValues
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/orphanage");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.contactPersonEmail || !formData.contactEmail) {
      setError("Email addresses are required");
      return false;
    }
    if (!formData.name) {
      setError("Orphanage name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const user = await signUp(
        formData.contactPersonEmail,
        formData.password,
        `${formData.contactPersonFirstName} ${formData.contactPersonLastName}`,
        "ORPHANAGE"
      );

      // Create basic orphanage profile for onboarding
      const orphanageData: Omit<Orphanage, "id" | "createdAt" | "updatedAt"> = {
        name: formData.name,
        location: "", // Will be filled in onboarding
        address: "", // Will be filled in onboarding
        state: "", // Will be filled in onboarding
        city: "", // Will be filled in onboarding
        description: "", // Will be filled in onboarding
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        childrenCount: 0,
        staffCount: 0,
        foundedYear: new Date().getFullYear(),
        verified: false,
        contactPersonFirstName: formData.contactPersonFirstName,
        contactPersonLastName: formData.contactPersonLastName,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPhone: formData.contactPersonPhone,
        contactPersonPosition: formData.contactPersonPosition,
        images: [], // Default value for images
      };

      // Create orphanage profile
      const { createOrphanageProfile } = await import("@/firebase/auth");
      await createOrphanageProfile(user.uid, orphanageData);

      toast.success(
        "Account created successfully! Let's complete your profile."
      );
      router.push("/orphanage/onboarding");
    } catch (error) {
      const errorMessage = extractErrorMessage(error as UnknownError);
      setError("An error occurred during sign up");
      toast.error("Error creating account", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Your Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Get started with your orphanage account - we&apos;ll help you complete
          your profile next
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Person Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Person Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tell us about the main contact person for your orphanage
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    name="contactPersonFirstName"
                    value={formData.contactPersonFirstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    name="contactPersonLastName"
                    value={formData.contactPersonLastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      name="contactPersonEmail"
                      value={formData.contactPersonEmail}
                      onChange={handleInputChange}
                      placeholder="contact@orphanage.com"
                      className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="tel"
                      name="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={handleInputChange}
                      placeholder="+234 801 234 5678"
                      className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Position *
                  </label>
                  <Input
                    type="text"
                    name="contactPersonPosition"
                    value={formData.contactPersonPosition}
                    onChange={handleInputChange}
                    placeholder="e.g., Director, Manager, Administrator"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Basic Orphanage Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Orphanage Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Basic information about your orphanage
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Orphanage Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Hope Children's Home"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="info@orphanage.com"
                      className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+234 801 234 5678"
                      className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Security
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create a secure password for your account
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-main-red hover:bg-main-red/90 text-white font-medium text-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/orphanage/signin"
                className="text-main-red font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
