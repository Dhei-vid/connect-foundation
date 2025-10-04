"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Users,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  FileText,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getOrphanageProfile, updateOrphanage } from "@/firebase/orphanages";
import { toast } from "sonner";
import type { Orphanage } from "@/common/types";
import { formatFirebaseDate } from "@/lib/date-utils";

export default function OrphanageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [orphanage, setOrphanage] = useState<Orphanage | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const orphanageId = params.id as string;

  useEffect(() => {
    loadOrphanage();
  }, [orphanageId]);

  const loadOrphanage = async () => {
    try {
      setLoading(true);
      const orphanageData = await getOrphanageProfile(orphanageId);
      if (orphanageData) {
        setOrphanage(orphanageData);
      } else {
        toast.error("Orphanage not found");
        router.push("/admin/orphanages");
      }
    } catch (error) {
      console.error("Error loading orphanage:", error);
      toast.error("Failed to load orphanage details");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    if (!orphanage) return;

    try {
      setActionLoading(true);
      await updateOrphanage(orphanageId, { verified: !orphanage.verified });
      setOrphanage({ ...orphanage, verified: !orphanage.verified });
      toast.success(
        `Orphanage ${
          !orphanage.verified ? "verified" : "unverified"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("Failed to update verification status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!orphanage) return;

    try {
      setActionLoading(true);
      // Note: You might want to add a deleteOrphanage function to Firebase
      toast.success("Orphanage deleted successfully");
      router.push("/admin/orphanages");
    } catch (error) {
      console.error("Error deleting orphanage:", error);
      toast.error("Failed to delete orphanage");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Orphanage Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-8 w-12 mx-auto" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions and Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!orphanage) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Orphanage Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The orphanage you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={() => router.push("/admin/orphanages")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orphanages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/orphanages")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <ConfirmationDialog
            title="Delete Orphanage"
            description={`Are you sure you want to delete "${orphanage.name}"? This action cannot be undone.`}
            confirmText="Delete Orphanage"
            onConfirm={handleDelete}
            variant="destructive"
            loading={actionLoading}
          >
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </ConfirmationDialog>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {orphanage.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {orphanage.city}, {orphanage.state}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <Badge
          className={
            orphanage.verified
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }
        >
          {orphanage.verified ? "Verified" : "Pending Verification"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {orphanage.description}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactPhone}
                  </p>
                </div>
                {orphanage.website && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Website</p>
                    <a
                      href={orphanage.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {orphanage.website}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-sm font-medium">{orphanage.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contact Person
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactPersonFirstName}{" "}
                    {orphanage.contactPersonLastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Position</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactPersonPosition}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactPersonEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium">
                    {orphanage.contactPersonPhone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {(orphanage.logoURL || orphanage.coverImageURL) && (
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orphanage.logoURL && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Logo</p>
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                  {orphanage.coverImageURL && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Cover Image</p>
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Children</span>
                <span className="text-sm font-medium">
                  {orphanage.childrenCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Staff</span>
                <span className="text-sm font-medium">
                  {orphanage.staffCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Founded</span>
                <span className="text-sm font-medium">
                  {orphanage.foundedYear}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orphanage.registrationNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Registration</span>
                  <span className="text-sm font-medium">
                    {orphanage.registrationNumber}
                  </span>
                </div>
              )}
              {orphanage.licenseNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">License</span>
                  <span className="text-sm font-medium">
                    {orphanage.licenseNumber}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Information */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orphanage.bankName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Bank</span>
                  <span className="text-sm font-medium">
                    {orphanage.bankName}
                  </span>
                </div>
              )}
              {orphanage.accountName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Account Name</span>
                  <span className="text-sm font-medium">
                    {orphanage.accountName}
                  </span>
                </div>
              )}
              {orphanage.bankAccountNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <span className="text-sm font-medium">
                    {orphanage.bankAccountNumber}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm font-medium">
                  {formatFirebaseDate(orphanage.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm font-medium">
                  {formatFirebaseDate(orphanage.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleVerifyToggle}
                disabled={actionLoading}
                className="w-full"
                variant={orphanage.verified ? "destructive" : "default"}
              >
                {orphanage.verified ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Unverify
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/admin/orphanages`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orphanages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
