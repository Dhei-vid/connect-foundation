"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  HandCoins,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  MessageCircle,
  Building2,
  UserCheck,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/firebase/analytics";
import { getRecentDonations } from "@/firebase/donations";
import { getNewContactInquiries } from "@/firebase/enquiries";
import { getPendingVolunteers } from "@/firebase/volunteers";
import type { Donation, Volunteer, ContactInquiry } from "@/common/types";
import { formatCurrency } from "@/common/helpers";
import { cn } from "@/lib/utils";
import { getStatusVariant } from "@/common/helpers";

interface DashboardStats {
  donations: {
    totalAmount: number;
    totalCount: number;
    thisMonth: number;
    thisWeek: number;
  };
  orphanages: {
    total: number;
    verified: number;
    pending: number;
  };
  issues: {
    total: number;
    open: number;
    resolved: number;
    urgent: number;
  };
  volunteers: {
    total: number;
    approved: number;
    pending: number;
  };
  inquiries: {
    total: number;
    new: number;
    replied: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set some default stats to prevent complete failure
      setStats({
        donations: {
          totalAmount: 0,
          totalCount: 0,
          thisMonth: 0,
          thisWeek: 0,
        },
        orphanages: {
          total: 0,
          verified: 0,
          pending: 0,
        },
        issues: {
          total: 0,
          open: 0,
          resolved: 0,
          urgent: 0,
        },
        volunteers: {
          total: 0,
          approved: 0,
          pending: 0,
        },
        inquiries: {
          total: 0,
          new: 0,
          replied: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity & Quick Actions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 py-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pending Items Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load dashboard data
          </h2>
          <Button onClick={loadDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your
            foundation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDashboardData}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Donations */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.donations.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.donations.totalCount} donations
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">
                ${stats.donations.thisWeek.toLocaleString()} this week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Orphanages */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphanages</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orphanages.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orphanages.verified} verified, {stats.orphanages.pending}{" "}
              pending
            </p>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {(
                  (stats.orphanages.verified / stats.orphanages.total) *
                  100
                ).toFixed(0)}
                % verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Issues */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issues.open}</div>
            <p className="text-xs text-muted-foreground">
              {stats.issues.urgent} urgent, {stats.issues.resolved} resolved
            </p>
            <div className="flex items-center mt-2">
              <Badge
                variant={stats.issues.urgent > 0 ? "destructive" : "secondary"}
                className="text-xs"
              >
                {stats.issues.urgent} urgent
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.volunteers.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.volunteers.approved} approved, {stats.volunteers.pending}{" "}
              pending
            </p>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {(
                  (stats.volunteers.approved / stats.volunteers.total) *
                  100
                ).toFixed(0)}
                % approved
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <Card className="lg:col-span-2 py-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HandCoins className="w-5 h-5 mr-2" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentDonationsList />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Volunteers
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Issues
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Verify Orphanages
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Respond to Inquiries
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Volunteers */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Pending Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PendingVolunteersList />
          </CardContent>
        </Card>

        {/* New Inquiries */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              New Contact Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NewInquiriesList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Recent Donations Component
function RecentDonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentDonations();
  }, []);

  const loadRecentDonations = async () => {
    try {
      const recentDonations = await getRecentDonations(5);
      setDonations(recentDonations);
    } catch (error) {
      console.error("Error loading recent donations:", error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {donations.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No recent donations
        </div>
      ) : (
        donations.map((donation) => (
          <div
            key={donation.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-medium">
                  {donation.anonymous ? "Anonymous" : donation.donorName}
                </p>
                <p className="text-sm text-gray-500">
                  {donation.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(donation.amount)}</p>
              <Badge
                variant={getStatusVariant(donation.status)}
                className={cn("text-xs")}
              >
                {donation.status}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Pending Volunteers Component
function PendingVolunteersList() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingVolunteers();
  }, []);

  const loadPendingVolunteers = async () => {
    try {
      const pendingVolunteers = await getPendingVolunteers();
      setVolunteers(pendingVolunteers.slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error("Error loading pending volunteers:", error);
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {volunteers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No pending volunteers
        </div>
      ) : (
        volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">
                  {volunteer.firstname} {volunteer.lastname}
                </p>
                <p className="text-sm text-gray-500">{volunteer.email}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">
                {volunteer.experience}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                {volunteer.skills.slice(0, 2).join(", ")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// New Inquiries Component
function NewInquiriesList() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewInquiries();
  }, []);

  const loadNewInquiries = async () => {
    try {
      const newInquiries = await getNewContactInquiries();
      setInquiries(newInquiries.slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error("Error loading new inquiries:", error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No new inquiries</div>
      ) : (
        inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">
                  {inquiry.firstname} {inquiry.lastname}
                </p>
                <p className="text-sm text-gray-500">{inquiry.subject}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {inquiry.createdAt.toLocaleDateString()}
              </p>
              <Badge variant="secondary" className="text-xs">
                {inquiry.status}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
