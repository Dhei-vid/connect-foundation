"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Banknote,
  Heart,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Orphanage, Issue, Donation } from "@/common/types";
import LoadingSpinner from "@/components/general/spinner";

export default function OrphanageDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isOrphanage } = useAuthContext();
  const [orphanageData, setOrphanageData] = useState<Orphanage | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/orphanage/signin");
    }
    if (!isLoading && isAuthenticated && !isOrphanage) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, isOrphanage, router]);

  // Load orphanage data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;

      try {
        setIsDataLoading(true);

        // Load orphanage profile
        const { getOrphanageProfile } = await import("@/firebase/orphanages");
        const orphanage = await getOrphanageProfile(user.uid);
        setOrphanageData(orphanage);

        // Load issues for this orphanage
        const { getIssues } = await import("@/firebase/impacts");
        const orphanageIssues = await getIssues({ orphanageId: user.uid });
        setIssues(orphanageIssues);

        // Load donations for this orphanage
        const { getDonations } = await import("@/firebase/donations");
        const orphanageDonations = await getDonations({
          targetIssueId: orphanageIssues.map((i) => i.id),
        });
        setDonations(orphanageDonations);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (user?.uid) {
      loadData();
    }
  }, [user?.uid]);

  if (isLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOrphanage) {
    return null;
  }

  // Calculate statistics
  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const completedDonations = donations.filter((d) => d.status === "completed");
  const totalRaised = completedDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const openIssues = issues.filter((i) => i.status === "open").length;
  const resolvedIssues = issues.filter((i) => i.status === "resolved").length;
  const urgentIssues = issues.filter((i) => i.priority === "urgent").length;

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your orphanage and track your impact
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orphanageData?.childrenCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently in care</p>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orphanageData?.staffCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active staff members
              </p>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Founded</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orphanageData?.foundedYear || new Date().getFullYear()}
              </div>
              <p className="text-xs text-muted-foreground">Years of service</p>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Raised
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{totalRaised.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">From all issues</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {openIssues}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting funding</p>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {resolvedIssues}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully funded
              </p>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {urgentIssues}
              </div>
              <p className="text-xs text-muted-foreground">
                Need immediate help
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Issues and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={"py-4"}>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No issues created yet. Create your first request for aid.
                  </p>
                ) : (
                  issues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{issue.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${issue.raisedAmount.toLocaleString()} / $
                          {issue.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          issue.status === "resolved"
                            ? "default"
                            : issue.priority === "urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {issue.status}
                      </Badge>
                    </div>
                  ))
                )}
                <Button
                  className="w-full"
                  onClick={() => router.push("/orphanage/request")}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Create New Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={"py-4"}>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Verification Status
                  </span>
                  <Badge
                    variant={orphanageData?.verified ? "default" : "secondary"}
                  >
                    {orphanageData?.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Type</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Orphanage
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Issues</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {issues.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8 py-4">
          <CardHeader>
            <CardTitle>Welcome to Connect Foundation!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for joining our platform. Your account is currently
              under review. Once verified, you&apos;ll be able to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Create and manage issues that need funding</li>
              <li>Receive donations from generous supporters</li>
              <li>Share success stories and impact reports</li>
              <li>Connect with volunteers and other organizations</li>
              <li>Track your financial records and transparency</li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              We&apos;ll notify you once your account is verified and ready to
              use.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
