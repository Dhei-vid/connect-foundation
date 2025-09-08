/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  User, 
  Mail, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockDonations = [
  {
    id: "1",
    donorId: "donor_1",
    donorName: "John Smith",
    donorEmail: "john.smith@email.com",
    amount: 5000,
    currency: "USD",
    message: "Hope this helps the children in need. God bless!",
    anonymous: false,
    targetIssueId: "1",
    status: "completed" as const,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "2",
    donorId: "donor_2",
    donorName: "Anonymous",
    donorEmail: "anonymous@email.com",
    amount: 2500,
    currency: "USD",
    message: "For the medical supplies",
    anonymous: true,
    targetIssueId: "1",
    status: "completed" as const,
    createdAt: new Date("2024-01-19")
  },
  {
    id: "3",
    donorId: "donor_3",
    donorName: "Sarah Johnson",
    donorEmail: "sarah.j@email.com",
    amount: 1000,
    currency: "USD",
    message: "Supporting education for children",
    anonymous: false,
    targetIssueId: "2",
    status: "completed" as const,
    createdAt: new Date("2024-01-18")
  },
  {
    id: "4",
    donorId: "donor_4",
    donorName: "Michael Brown",
    donorEmail: "m.brown@email.com",
    amount: 3000,
    currency: "USD",
    message: "",
    anonymous: false,
    targetIssueId: undefined,
    status: "pending" as const,
    createdAt: new Date("2024-01-21")
  },
  {
    id: "5",
    donorId: "donor_5",
    donorName: "Emily Davis",
    donorEmail: "emily.davis@email.com",
    amount: 1500,
    currency: "USD",
    message: "For food supplies",
    anonymous: false,
    targetIssueId: "3",
    status: "failed" as const,
    createdAt: new Date("2024-01-17")
  },
  {
    id: "6",
    donorId: "donor_6",
    donorName: "Anonymous",
    donorEmail: "donor@email.com",
    amount: 7500,
    currency: "USD",
    message: "General donation to help all children",
    anonymous: true,
    targetIssueId: undefined,
    status: "completed" as const,
    createdAt: new Date("2024-01-16")
  }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "failed">("all");
  const [filterTimeframe, setFilterTimeframe] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  const filteredDonations = mockDonations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || donation.status === filterStatus;
    
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

  const handleStatusUpdate = (donationId: string, newStatus: string) => {
    // TODO: Implement status update logic
    console.log("Update donation status:", donationId, newStatus);
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log("Export donations");
  };

  // Calculate statistics
  const totalDonations = mockDonations.length;
  const totalAmount = mockDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedAmount = mockDonations
    .filter(d => d.status === "completed")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const pendingAmount = mockDonations
    .filter(d => d.status === "pending")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const failedAmount = mockDonations
    .filter(d => d.status === "failed")
    .reduce((sum, donation) => sum + donation.amount, 0);

  // Recent donations (last 7 days)
  const recentDonations = mockDonations.filter(donation => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return donation.createdAt >= weekAgo;
  });

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
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              {recentDonations.length} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${completedAmount.toLocaleString()} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDonations.filter(d => d.status === "pending").length} donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${failedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDonations.filter(d => d.status === "failed").length} donations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  <p className="font-semibold">${donation.amount.toLocaleString()}</p>
                  <Badge className={statusColors[donation.status]}>
                    {donation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={filterTimeframe}
                onChange={(e) => setFilterTimeframe(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent>
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
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {donation.anonymous ? "Anonymous" : donation.donorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {donation.donorEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">
                        ${donation.amount.toLocaleString()}
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
                        <span className="text-sm text-blue-600">Issue #{donation.targetIssueId}</span>
                      ) : (
                        <span className="text-sm text-gray-500">General</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {donation.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(donation.id, "completed")}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {donation.status === "pending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(donation.id, "failed")}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donation Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDonation(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Donor Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">
                        {selectedDonation.anonymous ? "Anonymous" : selectedDonation.donorName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{selectedDonation.donorEmail}</span>
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
                        ${selectedDonation.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span className="font-medium">{selectedDonation.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={statusColors[selectedDonation.status as keyof typeof statusColors]}>
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

              {selectedDonation.message && (
                <div>
                  <h3 className="font-semibold mb-2">Message</h3>
                  <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {selectedDonation.message}
                  </p>
                </div>
              )}

              {selectedDonation.targetIssueId && (
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
                        setSelectedDonation(null);
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
                        setSelectedDonation(null);
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
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
