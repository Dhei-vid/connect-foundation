"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  User,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getDonations,
  getDonationStats,
  updateDonationStatus,
  getRecentDonations,
} from "@/firebase/donations";
import type { Donation } from "@/common/types";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getIssue } from "@/firebase/issues";
import type { Issue } from "@/common/types";

// Loading and error states
interface LoadingState {
  donations: boolean;
  stats: boolean;
  recent: boolean;
}

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    averageAmount: 0,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    anonymousDonations: 0,
    targetedDonations: 0,
    generalDonations: 0,
  });
  const [loading, setLoading] = useState<LoadingState>({
    donations: true,
    stats: true,
    recent: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");
  const [filterTimeframe, setFilterTimeframe] = useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loadingIssue, setLoadingIssue] = useState<boolean>(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);

      // Load donations, stats, and recent donations in parallel
      const [donationsData, statsData, recentData] = await Promise.all([
        getDonations(),
        getDonationStats(),
        getRecentDonations(10),
      ]);

      setDonations(donationsData);
      setStats(statsData);
      setRecentDonations(recentData);

      setLoading({
        donations: false,
        stats: false,
        recent: false,
      });
    } catch (err) {
      console.error("Error loading donations data:", err);
      setError("Failed to load donations data. Please try again.");
      setLoading({
        donations: false,
        stats: false,
        recent: false,
      });
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.message &&
        donation.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || donation.status === filterStatus;

    const now = new Date();
    let matchesTimeframe = true;
    if (filterTimeframe !== "all") {
      const donationDate = donation.createdAt;
      switch (filterTimeframe) {
        case "today":
          matchesTimeframe = donationDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeframe = donationDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTimeframe = donationDate >= monthAgo;
          break;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesTimeframe = donationDate >= yearAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesTimeframe;
  });

  const handleStatusUpdate = async (
    donationId: string,
    newStatus: Donation["status"]
  ) => {
    try {
      await updateDonationStatus(donationId, newStatus);

      // Update local state
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === donationId
            ? { ...donation, status: newStatus }
            : donation
        )
      );

      // Reload stats to reflect changes
      const updatedStats = await getDonationStats();
      setStats(updatedStats);
    } catch (err) {
      console.error("Error updating donation status:", err);
      setError("Failed to update donation status. Please try again.");
    }
  };

  const handleViewDonation = async (donation: Donation) => {
    setSelectedDonation(donation);

    // If the donation has a target issue, fetch the issue details
    if (donation.targetIssueId) {
      try {
        setLoadingIssue(true);
        const issue = await getIssue(donation.targetIssueId);
        setSelectedIssue(issue);
      } catch (error) {
        console.error("Error fetching issue:", error);
        setError("Failed to load issue details");
        setSelectedIssue(null);
      } finally {
        setLoadingIssue(false);
      }
    } else {
      setSelectedIssue(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
    setSelectedIssue(null);
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log("Export donations");
  };

  const handleRefresh = () => {
    loadData();
  };

  // Calculate additional stats for display
  const pendingAmount = donations
    .filter((d) => d.status === "pending")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const failedAmount = donations
    .filter((d) => d.status === "failed")
    .reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Donations Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage all donations received
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={loading.donations || loading.stats}
          >
            {loading.donations || loading.stats ? (
              <Spinner className="w-4 h-4 mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
          <Button
            onClick={() => setError(null)}
            variant="ghost"
            size="sm"
            className="ml-auto"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                stats.totalDonations
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading.recent ? (
                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
              ) : (
                `${recentDonations.length} recent`
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
              ) : (
                `₦${stats.totalAmount.toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
              ) : (
                `₦${stats.averageAmount.toLocaleString()} average`
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : (
                `₦${pendingAmount.toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                `${stats.pendingDonations} donations`
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : (
                `₦${failedAmount.toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading.stats ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                `${stats.failedDonations} donations`
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.recent ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.slice(0, 5).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
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
                    <p className="font-semibold">
                      ₦{donation.amount.toLocaleString()}
                    </p>
                    <Badge className={statusColors[donation.status]}>
                      {donation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <SelectField
                label=""
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(
                    value as "all" | "completed" | "pending" | "failed"
                  )
                }
              >
                {[
                  {
                    label: "All Status",
                    value: "all",
                  },
                  {
                    label: "Completed",
                    value: "completed",
                  },
                  {
                    label: "Pending",
                    value: "pending",
                  },
                  {
                    label: "Failed",
                    value: "failed",
                  },
                ].map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectField>

              <SelectField
                label=""
                value={filterTimeframe}
                onValueChange={(value) =>
                  setFilterTimeframe(
                    value as "all" | "today" | "week" | "month" | "year"
                  )
                }
              >
                {[
                  {
                    label: "All Time",
                    value: "all",
                  },
                  {
                    label: "Today",
                    value: "today",
                  },
                  {
                    label: "This Week",
                    value: "week",
                  },
                  {
                    label: "This Month",
                    value: "month",
                  },
                  {
                    label: "This Year",
                    value: "year",
                  },
                ].map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>All Donations ({filteredDonations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.donations ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Target</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No donations found
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {donation.anonymous
                                ? "Anonymous"
                                : donation.donorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donation.donorEmail}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold">
                            ₦{donation.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.currency}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[donation.status]}>
                            {donation.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {donation.createdAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {donation.targetIssueId ? (
                            <span className="text-sm text-blue-600">
                              Issue #{donation.targetIssueId}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              General
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDonation(donation)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {donation.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(donation.id, "completed")
                                }
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {donation.status === "pending" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleStatusUpdate(donation.id, "failed")
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donation Details Dialog */}
      <Dialog open={!!selectedDonation} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              View detailed information about this donation
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Donor Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">
                        {selectedDonation.anonymous
                          ? "Anonymous"
                          : selectedDonation.donorName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">
                        {selectedDonation.donorEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anonymous:</span>
                      <span className="font-medium">
                        {selectedDonation.anonymous ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Donation Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">
                        ₦{selectedDonation.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span className="font-medium">
                        {selectedDonation.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        className={
                          statusColors[
                            selectedDonation.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {selectedDonation.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {selectedDonation.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orphanage Information */}
              {selectedIssue && (
                <div>
                  <h3 className="font-semibold mb-2">Orphanage Information</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Orphanage Name:</span>
                        <span className="font-medium">
                          {selectedIssue.orphanageName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issue Title:</span>
                        <span className="font-medium">
                          {selectedIssue.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium capitalize">
                          {selectedIssue.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge
                          className={
                            selectedIssue.priority === "urgent"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : selectedIssue.priority === "high"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : selectedIssue.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {selectedIssue.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Cost:</span>
                        <span className="font-medium">
                          ₦{selectedIssue.estimatedCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Raised:</span>
                        <span className="font-medium">
                          ₦{selectedIssue.raisedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state for issue */}
              {loadingIssue && (
                <div className="flex items-center justify-center p-4">
                  <Spinner className="w-6 h-6 mr-2" />
                  <span>Loading orphanage information...</span>
                </div>
              )}

              {selectedDonation.message && (
                <div>
                  <h3 className="font-semibold mb-2">Message</h3>
                  <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {selectedDonation.message}
                  </p>
                </div>
              )}

              {selectedDonation.targetIssueId &&
                !selectedIssue &&
                !loadingIssue && (
                  <div>
                    <h3 className="font-semibold mb-2">Target Issue</h3>
                    <p className="text-blue-600">
                      Issue #{selectedDonation.targetIssueId}
                    </p>
                  </div>
                )}

              <div className="flex gap-2 pt-4">
                {selectedDonation.status === "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedDonation.id, "completed");
                        handleCloseModal();
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleStatusUpdate(selectedDonation.id, "failed");
                        handleCloseModal();
                      }}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark as Failed
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
