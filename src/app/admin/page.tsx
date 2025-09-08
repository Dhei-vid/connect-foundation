"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Heart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Mock data - in real app, this would come from your database
const mockStats = {
  totalOrphanages: 24,
  verifiedOrphanages: 18,
  pendingVerification: 6,
  totalDonations: 125000,
  successStories: 45,
  activeIssues: 12,
  resolvedIssues: 89,
  totalBeneficiaries: 1200,
};

const recentActivities = [
  {
    id: 1,
    type: "orphanage_verified",
    message: "Hope Children&apos;s Home has been verified",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "donation_received",
    message: "New donation of $2,500 received for medical supplies",
    timestamp: "4 hours ago",
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "issue_resolved",
    message: "Educational materials request resolved for Sunshine Orphanage",
    timestamp: "6 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 4,
    type: "new_issue",
    message: "New urgent request from Little Angels Orphanage",
    timestamp: "8 hours ago",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
];

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      requireAuth();
    }
  }, [isLoading, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the requireAuth function will redirect to sign-in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of your charity foundation&apos;s operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orphanages
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.totalOrphanages}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStats.verifiedOrphanages} verified,{" "}
              {mockStats.pendingVerification} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockStats.totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Stories
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.successStories}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.totalBeneficiaries} beneficiaries helped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeIssues}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.resolvedIssues} resolved this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/admin/orphanages")}
            >
              <Building2 className="h-6 w-6" />
              <span>Manage Orphanages</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/admin/issues")}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Review Issues</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/admin/donations")}
            >
              <DollarSign className="h-6 w-6" />
              <span>View Donations</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}
                  >
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Verifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Sunshine Orphanage</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted 2 days ago
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push("/admin/orphanages")}
                >
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Little Angels Home</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted 1 week ago
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push("/admin/orphanages")}
                >
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Urgent Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Medical Emergency</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hope Children&apos;s Home
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => router.push("/admin/issues")}
                >
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Food Shortage</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Grace Orphanage
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => router.push("/admin/issues")}
                >
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
