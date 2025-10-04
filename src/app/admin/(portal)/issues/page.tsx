"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getIssues, getIssueStats, updateIssueStatus } from "@/firebase/issues";
import { toast } from "sonner";
import type { Issue } from "@/common/types";
import { priorityColors, categoryColors, statusColors } from "@/common/style";
import LoadingSpinner from "@/components/general/spinner";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    totalRaised: 0,
    totalNeeded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "open" | "in-progress" | "resolved" | "closed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high" | "urgent"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "medical" | "education" | "food" | "shelter" | "clothing" | "other"
  >("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const [issuesData, statsData] = await Promise.all([
        getIssues(),
        getIssueStats(),
      ]);
      setIssues(issuesData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading issues:", error);
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.orphanageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || issue.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || issue.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || issue.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleStatusUpdate = async (
    issueId: string,
    newStatus: Issue["status"]
  ) => {
    try {
      await updateIssueStatus(issueId, newStatus);
      toast.success(`Issue status updated to ${newStatus}`);
      loadIssues(); // Reload data
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update issue status");
    }
  };

  const handleResolve = async (issueId: string) => {
    try {
      await updateIssueStatus(issueId, "resolved");
      toast.success("Issue marked as resolved");
      loadIssues(); // Reload data
    } catch (error) {
      console.error("Error resolving issue:", error);
      toast.error("Failed to resolve issue");
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
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues List Skeleton */}
        <Card className="py-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Issues & Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage orphanage requests and track their progress
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.urgent} urgent
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.open}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved + stats.closed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full grid grid-cols-3 gap-2">
              <SelectField
                value={filterStatus}
                onValueChange={(value: string) =>
                  setFilterStatus(
                    value as
                      | "open"
                      | "resolved"
                      | "closed"
                      | "all"
                      | "in-progress"
                  )
                }
              >
                {["all", "open", "in-progress", "resolved", "closed"].map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </SelectItem>
                  )
                )}
              </SelectField>

              <SelectField
                value={filterPriority}
                onValueChange={(value: string) =>
                  setFilterPriority(
                    value as "all" | "urgent" | "high" | "medium" | "low"
                  )
                }
              >
                {["all", "urgent", "high", "medium", "low"].map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority === "all" ? "All Priority" : priority}
                  </SelectItem>
                ))}
              </SelectField>

              <SelectField
                value={filterCategory}
                placeholder="Category"
                onValueChange={(value: string) =>
                  setFilterCategory(
                    value as
                      | "all"
                      | "medical"
                      | "education"
                      | "food"
                      | "shelter"
                      | "clothing"
                      | "other"
                  )
                }
              >
                {[
                  "all",
                  "medical",
                  "education",
                  "food",
                  "shelter",
                  "clothing",
                  "other",
                ].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between flex-1">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                  </div>

                  <div className={"flex flex-row gap-2 mb-4"}>
                    <Badge className={categoryColors[issue.category]}>
                      {issue.category}
                    </Badge>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                    <Badge className={statusColors[issue.status]}>
                      {issue.status}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    {issue.orphanageName}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <div className="font-medium">
                        ${issue.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Raised:</span>
                      <div className="font-medium">
                        ${issue.raisedAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <div className="font-medium">
                        {Math.round(
                          (issue.raisedAmount / issue.estimatedCost) * 100
                        )}
                        %
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <div className="font-medium">
                        {issue.deadline?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/issues/${issue.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {issue.status === "open" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(issue.id, "in-progress")
                      }
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {issue.status === "in-progress" && (
                    <Button size="sm" onClick={() => handleResolve(issue.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedIssue.title}
                    <Badge
                      className={
                        categoryColors[
                          selectedIssue.category as keyof typeof categoryColors
                        ]
                      }
                    >
                      {selectedIssue.category}
                    </Badge>
                    <Badge
                      className={
                        priorityColors[
                          selectedIssue.priority as keyof typeof priorityColors
                        ]
                      }
                    >
                      {selectedIssue.priority}
                    </Badge>
                    <Badge
                      className={
                        statusColors[
                          selectedIssue.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {selectedIssue.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    {selectedIssue.orphanageName}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIssue(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedIssue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Financial Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-medium">
                        ${selectedIssue.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Raised Amount:</span>
                      <span className="font-medium">
                        ${selectedIssue.raisedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-medium">
                        $
                        {(
                          selectedIssue.estimatedCost -
                          selectedIssue.raisedAmount
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (selectedIssue.raisedAmount /
                              selectedIssue.estimatedCost) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {selectedIssue.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {selectedIssue.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                    {selectedIssue.deadline && (
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className="font-medium">
                          {selectedIssue.deadline.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedIssue.resolvedAt && (
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-medium">
                          {selectedIssue.resolvedAt.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedIssue.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIssue.images.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                        >
                          <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedIssue.status === "open" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedIssue.id, "in-progress");
                      setSelectedIssue(null);
                    }}
                    className="flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start Working
                  </Button>
                )}
                {selectedIssue.status === "in-progress" && (
                  <Button
                    onClick={() => {
                      handleResolve(selectedIssue.id);
                      setSelectedIssue(null);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedIssue(null)}
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
