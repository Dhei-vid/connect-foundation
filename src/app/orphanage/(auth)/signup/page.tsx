"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/components/providers";
import { extractErrorMessage } from "@/common/helpers";
import { toast } from "sonner";
import type { Orphanage } from "@/common/types";

import { orphanageDefaultFormValues, OrphanageFormProps } from "@/common/form";
import { Card } from "@/components/ui/card";

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
      };

      // Create orphanage profile
      const { createOrphanageProfile } = await import("@/firebase/auth");
      await createOrphanageProfile(user.uid, orphanageData);

      toast.success(
        "Account created successfully! Let's complete your profile."
      );
      router.push("/orphanage/onboarding");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError("An error occurred during sign up");
      toast.error("Error creating account", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Your Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get started with your orphanage account - we&apos;ll help you complete
          your profile next
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Person Section */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Person Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name *
              </label>
              <Input
                type="text"
                name="contactPersonFirstName"
                value={formData.contactPersonFirstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name *
              </label>
              <Input
                type="text"
                name="contactPersonLastName"
                value={formData.contactPersonLastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="tel"
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Position *
              </label>
              <Input
                type="text"
                name="contactPersonPosition"
                value={formData.contactPersonPosition}
                onChange={handleInputChange}
                placeholder="e.g., Director, Manager, Administrator"
                required
              />
            </div>
          </div>
        </Card>

        {/* Basic Orphanage Information */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Orphanage Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Orphanage Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter orphanage name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="Enter contact phone"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Password Section */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Account Security
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
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
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              <label className="block text-sm font-medium mb-2">
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
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
        </Card>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/orphanage/signin"
            className="text-main-red font-semibold  hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="flex space-x-2 items-center text-sm text-gray-500 hover:underline justify-center"
        >
          <ArrowLeft size={18} />
          <p>Back to main site</p>
        </Link>
      </div>
    </div>
  );
}
