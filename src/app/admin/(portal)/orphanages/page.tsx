"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Orphanage } from "@/common/types";
import LoadingSpinner from "@/components/general/spinner";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";

export default function OrphanagesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "pending"
  >("all");
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load orphanages from Firebase
  useEffect(() => {
    loadOrphanages();
  }, []);

  const loadOrphanages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading orphanages from Firebase...");

      const { getOrphanages } = await import("@/firebase/orphanages");
      const orphanagesData = await getOrphanages();
      console.log("Loaded orphanages:", orphanagesData);
      setOrphanages(orphanagesData);
    } catch (error) {
      console.error("Error loading orphanages:", error);
      setError("Failed to load orphanages");
      toast.error("Failed to load orphanages");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (orphanageId: string) => {
    try {
      console.log("Verifying orphanage:", orphanageId);
      const { updateOrphanage } = await import("@/firebase/orphanages");
      await updateOrphanage(orphanageId, { verified: true });
      console.log("Orphanage verified successfully");
      toast.success("Orphanage verified successfully");
      await loadOrphanages(); // Reload the list
    } catch (error) {
      console.error("Error verifying orphanage:", error);
      toast.error("Failed to verify orphanage");
    }
  };

  const handleReject = async (orphanageId: string) => {
    try {
      console.log("Rejecting orphanage:", orphanageId);
      const { updateOrphanage } = await import("@/firebase/orphanages");
      await updateOrphanage(orphanageId, { verified: false });
      console.log("Orphanage rejected successfully");
      toast.success("Orphanage rejected successfully");
      await loadOrphanages(); // Reload the list
    } catch (error) {
      console.error("Error rejecting orphanage:", error);
      toast.error("Failed to reject orphanage");
    }
  };

  const filteredOrphanages = orphanages.filter((orphanage) => {
    const matchesSearch =
      orphanage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphanage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphanage.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && orphanage.verified) ||
      (filterStatus === "pending" && !orphanage.verified);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orphanages Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Orphanages
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={loadOrphanages}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orphanages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and verify orphanage registrations
          </p>
        </div>
        <Button onClick={loadOrphanages} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orphanages
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orphanages.length}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orphanages.filter((o) => o.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orphanages.filter((o) => !o.verified).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 2xl:col-span-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orphanages by name, location, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <SelectField
                value={filterStatus}
                placeholder="Category"
                onValueChange={(value: string) =>
                  setFilterStatus(value as "all" | "verified" | "pending")
                }
              >
                {["all", "verified", "pending"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status}
                  </SelectItem>
                ))}
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orphanages List */}
      {filteredOrphanages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Orphanages Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No orphanages have been registered yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrphanages.map((orphanage) => (
            <Card
              key={orphanage.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {orphanage.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {orphanage.city}, {orphanage.state}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      orphanage.verified
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {orphanage.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {orphanage.description || "No description provided"}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {orphanage.contactEmail}
                  </div>
                  {orphanage.contactPhone && (
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {orphanage.contactPhone}
                    </div>
                  )}
                  {orphanage.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      {orphanage.website}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin/orphanages/${orphanage.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {!orphanage.verified && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleVerify(orphanage.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(orphanage.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
