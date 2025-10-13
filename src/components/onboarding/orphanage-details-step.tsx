"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import type { Orphanage } from "@/common/types";

interface OrphanageDetailsStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
  isLoading: boolean;
}

export default function OrphanageDetailsStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: // isFirstStep,
// isLastStep,
// onComplete,
// isLoading,
OrphanageDetailsStepProps) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    description: data.description || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    website: data.website || "",
  });

  // Update form data when data prop changes
  useEffect(() => {
    setFormData({
      name: data.name || "",
      description: data.description || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      contactEmail: data.contactEmail || "",
      contactPhone: data.contactPhone || "",
      website: data.website || "",
    });
  }, [data]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Orphanage name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({
        ...formData,
        location: `${formData.city}, ${formData.state}`,
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Orphanage Details
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your orphanage and its location
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Orphanage Name *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter orphanage name"
            className={errors.name ? "border-red-500" : ""}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your orphanage's mission, activities, and the children you serve"
            rows={4}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Full Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
              className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              City *
            </label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              className={errors.city ? "border-red-500" : ""}
              required
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              State/Province *
            </label>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state or province"
              className={errors.state ? "border-red-500" : ""}
              required
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter contact email"
                className={`pl-10 ${
                  errors.contactEmail ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
            )}
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
                placeholder="Enter contact phone"
                className={`pl-10 ${
                  errors.contactPhone ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            {errors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Website (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://your-orphanage-website.com"
              className="pl-10"
            />
          </div>
        </div>
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
