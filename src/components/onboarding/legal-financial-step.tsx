"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Shield, AlertCircle } from "lucide-react";
import type { Orphanage } from "@/common/types";

interface LegalFinancialStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
  isLoading: boolean;
}

export default function LegalFinancialStep({
  data,
  onUpdate,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  onComplete,
  isLoading,
}: LegalFinancialStepProps) {
  const [formData, setFormData] = useState({
    registrationNumber: data.registrationNumber || "",
    licenseNumber: data.licenseNumber || "",
    bankName: data.bankName || "",
    accountName: data.accountName || "",
    bankAccountNumber: data.bankAccountNumber || "",
  });

  // Update form data when data prop changes
  useEffect(() => {
    setFormData({
      registrationNumber: data.registrationNumber || "",
      licenseNumber: data.licenseNumber || "",
      bankName: data.bankName || "",
      accountName: data.accountName || "",
      bankAccountNumber: data.bankAccountNumber || "",
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

    // These fields are optional, but if provided, they should be valid
    if (formData.bankAccountNumber && formData.bankAccountNumber.length < 8) {
      newErrors.bankAccountNumber = "Bank account number should be at least 8 digits";
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
          Legal & Financial Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Provide legal and financial details to help with verification and donations
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
              Privacy & Security Notice
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              All financial information is encrypted and stored securely. This information is only used for:
            </p>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1">
              <li>• Processing donations to your organization</li>
              <li>• Verification purposes by our admin team</li>
              <li>• Compliance with financial regulations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Registration Number
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Enter registration number"
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Official registration number with government
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              License Number
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Enter license number"
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Operating license or permit number
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Banking Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Bank Name
              </label>
              <Input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Account Name
              </label>
              <Input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="Enter account holder name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Bank Account Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter bank account number"
                  className={`pl-10 ${errors.bankAccountNumber ? "border-red-500" : ""}`}
                />
              </div>
              {errors.bankAccountNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                This will be used to process donations to your organization
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Verification Process
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Our team will review your legal and financial information to verify your organization. 
          This process typically takes 1-3 business days. You&apos;ll receive an email notification 
          once verification is complete.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
