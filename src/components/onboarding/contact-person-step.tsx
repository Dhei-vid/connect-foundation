"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import type { Orphanage } from "@/common/types";

interface ContactPersonStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
  isLoading: boolean;
}

export default function ContactPersonStep({
  data,
  onUpdate,
  onNext,
  isFirstStep,
  isLastStep,
  onComplete,
  isLoading,
}: ContactPersonStepProps) {
  const [formData, setFormData] = useState({
    contactPersonFirstName: data.contactPersonFirstName || "",
    contactPersonLastName: data.contactPersonLastName || "",
    contactPersonEmail: data.contactPersonEmail || "",
    contactPersonPhone: data.contactPersonPhone || "",
    contactPersonPosition: data.contactPersonPosition || "",
  });

  // Update form data when data prop changes
  useEffect(() => {
    setFormData({
      contactPersonFirstName: data.contactPersonFirstName || "",
      contactPersonLastName: data.contactPersonLastName || "",
      contactPersonEmail: data.contactPersonEmail || "",
      contactPersonPhone: data.contactPersonPhone || "",
      contactPersonPosition: data.contactPersonPosition || "",
    });
  }, [data]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactPersonFirstName.trim()) {
      newErrors.contactPersonFirstName = "First name is required";
    }
    if (!formData.contactPersonLastName.trim()) {
      newErrors.contactPersonLastName = "Last name is required";
    }
    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = "Please enter a valid email";
    }
    if (!formData.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = "Phone number is required";
    }
    if (!formData.contactPersonPosition.trim()) {
      newErrors.contactPersonPosition = "Position is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Contact Person Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about the person who will be the main contact for this orphanage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="contactPersonFirstName"
              value={formData.contactPersonFirstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              className={`pl-10 ${errors.contactPersonFirstName ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.contactPersonFirstName && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPersonFirstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="contactPersonLastName"
              value={formData.contactPersonLastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              className={`pl-10 ${errors.contactPersonLastName ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.contactPersonLastName && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPersonLastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="email"
              name="contactPersonEmail"
              value={formData.contactPersonEmail}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className={`pl-10 ${errors.contactPersonEmail ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.contactPersonEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPersonEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="tel"
              name="contactPersonPhone"
              value={formData.contactPersonPhone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className={`pl-10 ${errors.contactPersonPhone ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.contactPersonPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPersonPhone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Position/Title *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="contactPersonPosition"
              value={formData.contactPersonPosition}
              onChange={handleInputChange}
              placeholder="e.g., Director, Manager, Administrator"
              className={`pl-10 ${errors.contactPersonPosition ? "border-red-500" : ""}`}
              required
            />
          </div>
          {errors.contactPersonPosition && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPersonPosition}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleNext} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}
