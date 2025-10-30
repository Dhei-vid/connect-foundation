"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Building } from "lucide-react";
import type { Orphanage } from "@/common/types";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface StatisticsStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
  isLoading: boolean;
}

export default function StatisticsStep({
  data,
  onUpdate,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  onComplete,
  isLoading,
}: StatisticsStepProps) {
  const [formData, setFormData] = useState({
    childrenCount: data.childrenCount || 0,
    staffCount: data.staffCount || 0,
    foundedYear: data.foundedYear || new Date().getFullYear(),
    agerange: data.agerange || "",
    specialneeds: data.specialneeds || "",
    periodicMonitoring: data.periodicMonitoring || false,
    communityService: data.communityService || false,
  });

  // Update form data when data prop changes
  useEffect(() => {
    setFormData({
      childrenCount: data.childrenCount || 0,
      staffCount: data.staffCount || 0,
      foundedYear: data.foundedYear || new Date().getFullYear(),
      agerange: data.agerange || "",
      specialneeds: data.specialneeds || "",
      periodicMonitoring: data.periodicMonitoring || false,
      communityService: data.communityService || false,
    });
  }, [data]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Determine if the field should be treated as a number
    const isNumericField = ["foundedYear"].includes(name);
    const parsedValue = isNumericField ? parseInt(value) || 0 : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.childrenCount < 0 || formData.childrenCount === 0) {
      newErrors.childrenCount = "Number of children cannot be zero or less";
    }
    if (formData.staffCount < 0 || formData.staffCount === 0) {
      newErrors.staffCount = "Number of staff cannot be zero or less";
    }
    if (
      formData.foundedYear < 1800 ||
      formData.foundedYear > new Date().getFullYear()
    ) {
      newErrors.foundedYear = "Please enter a valid founding year";
    }

    if (!formData?.periodicMonitoring) {
      newErrors.periodicMonitoring =
        "Please tick yes on periodic monitoring & reporting";
    }

    if (!formData?.agerange) {
      newErrors.agerange = "Please enter the age range of children";
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
          Statistics & Details
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand the scale and history of your orphanage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Number of Children
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="number"
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className={`pl-10 ${
                errors.childrenCount ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.childrenCount && (
            <p className="text-red-500 text-xs mt-1">{errors.childrenCount}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Current number of children in your care
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Number of Staff
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="number"
              name="staffCount"
              value={formData.staffCount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className={`pl-10 ${errors.staffCount ? "border-red-500" : ""}`}
            />
          </div>
          {errors.staffCount && (
            <p className="text-red-500 text-xs mt-1">{errors.staffCount}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Total number of staff members
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Founded Year
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="number"
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleInputChange}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
              className={`pl-10 ${errors.foundedYear ? "border-red-500" : ""}`}
            />
          </div>
          {errors.foundedYear && (
            <p className="text-red-500 text-xs mt-1">{errors.foundedYear}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Year the orphanage was established
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Age range of Children
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="agerange"
              value={formData.agerange}
              onChange={handleInputChange}
              placeholder="5 - 10 years"
              className={`pl-10 ${errors.agerange ? "border-red-500" : ""}`}
            />
          </div>
          {errors.agerange && (
            <p className="text-red-500 text-xs mt-1">{errors.agerange}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Age range of children in your care
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Children with Special Needs?
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              name="specialneeds"
              value={formData.specialneeds}
              onChange={handleInputChange}
              placeholder="5 children with special needs"
              className={`pl-10 ${errors.specialneeds ? "border-red-500" : ""}`}
            />
          </div>
          {errors.specialneeds && (
            <p className="text-red-500 text-xs mt-1">{errors.specialneeds}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Explain the situation of the children with special needs
          </p>
        </div>
      </div>

      {/* Additonal agreement */}
      <div className="space-y-6">
        <Separator />

        <div>
          <p>Routine Checks</p>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id="periodicMonitoring"
              checked={data.periodicMonitoring}
              onCheckedChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  periodicMonitoring: value as boolean,
                }))
              }
            />
            <Label className="text-sm font-light" htmlFor="terms">
              Open to Periodic Monitoring and Reporting
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="communityService"
              checked={data.communityService}
              onCheckedChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  communityService: value as boolean,
                }))
              }
            />
            <Label className="text-sm font-light" htmlFor="terms">
              Willing to participate in community service or outreach events
            </Label>
          </div>
        </div>

        <div>
          {errors.periodicMonitoring && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-xs text-red-800 dark:text-red-200 space-y-1">
                {errors.periodicMonitoring}
              </p>
            </div>
          )}
        </div>

        <Separator />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Why do we need this information?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Helps donors understand the scale of your organization</li>
          <li>• Allows us to match appropriate resources and support</li>
          <li>• Enables better impact tracking and reporting</li>
          <li>• Helps verify the legitimacy of your organization</li>
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
