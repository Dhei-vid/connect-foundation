"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  Users,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import type { Orphanage } from "@/common/types";

interface ReviewStepProps {
  data: Partial<Orphanage>;
  onUpdate: (data: Partial<Orphanage>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
  isLoading: boolean;
}

export default function ReviewStep({
  data,
  onPrev,
  onUpdate,
  onNext,
  isFirstStep,
  isLastStep,
  onComplete,
  isLoading,
}: ReviewStepProps) {
  const formatValue = (value: unknown, fallback: string = "Not provided"): string => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return String(value);
  };

  const hasFinancialInfo =
    data.bankName || data.accountName || data.bankAccountNumber;
  const hasLegalInfo = data.registrationNumber || data.licenseNumber;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review Your Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all the information below before completing your profile
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact Person Information */}
        <Card className={"py-4"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Person Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(
                    `${data.contactPersonFirstName} ${data.contactPersonLastName}`
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Position:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.contactPersonPosition)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Email:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.contactPersonEmail)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Phone:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.contactPersonPhone)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orphanage Details */}
        <Card className={"py-4"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Orphanage Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-gray-900 dark:text-white text-lg font-medium">
                {formatValue(data.name)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Description:
              </span>
              <p className="text-gray-900 dark:text-white">
                {formatValue(data.description)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Address:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.address)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Location:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.location)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Contact Email:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.contactEmail)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Contact Phone:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {formatValue(data.contactPhone)}
                </p>
              </div>
            </div>
            {data.website && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Website:
                </span>
                <p className="text-blue-600 dark:text-blue-400">
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.website}
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className={"py-4"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.childrenCount || 0}
                </div>
                <div className="text-sm text-gray-500">Children</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.staffCount || 0}
                </div>
                <div className="text-sm text-gray-500">Staff Members</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.foundedYear || new Date().getFullYear()}
                </div>
                <div className="text-sm text-gray-500">Founded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        {hasLegalInfo && (
          <Card className={"py-4"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.registrationNumber && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Registration Number:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {data.registrationNumber}
                    </p>
                  </div>
                )}
                {data.licenseNumber && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      License Number:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {data.licenseNumber}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Information */}
        {hasFinancialInfo && (
          <Card className={"py-4"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.bankName && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Bank Name:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {data.bankName}
                    </p>
                  </div>
                )}
                {data.accountName && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Account Name:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {data.accountName}
                    </p>
                  </div>
                )}
                {data.bankAccountNumber && (
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      Account Number:
                    </span>
                    <p className="text-gray-900 dark:text-white font-mono">
                      {data.bankAccountNumber.replace(/\d(?=\d{4})/g, "*")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
              Ready to Complete
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Your profile looks complete! Once you submit, our team will review
              your information and verify your organization. You&apos;ll receive
              an email notification once verification is complete.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? "Completing..." : "Complete Profile"}
          <CheckCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
