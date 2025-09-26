"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trash2,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getIssue, updateIssueStatus, deleteIssue } from "@/firebase/issues";
import { toast } from "sonner";
import type { Issue } from "@/common/types";
import { formatFirebaseDate, formatFirebaseDateRelative } from "@/lib/date-utils";
import LoadingSpinner from "@/components/general/spinner";
import { priorityColors, categoryColors, statusColors } from "@/common/style";

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const issueId = params.id as string;

  useEffect(() => {
    loadIssue();
  }, [issueId]);

  const loadIssue = async () => {
    try {
      setLoading(true);
      const issueData = await getIssue(issueId);
      if (issueData) {
        setIssue(issueData);
      } else {
        toast.error("Issue not found");
        router.push("/admin/issues");
      }
    } catch (error) {
      console.error("Error loading issue:", error);
      toast.error("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Issue["status"]) => {
    if (!issue) return;

    try {
      setActionLoading(true);
      await updateIssueStatus(issueId, newStatus);
      setIssue({ ...issue, status: newStatus, updatedAt: new Date() });
      toast.success(`Issue status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update issue status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!issue) return;

    try {
      setActionLoading(true);
      await deleteIssue(issueId);
      toast.success("Issue deleted successfully");
      router.push("/admin/issues");
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Failed to delete issue");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-400">
            Loading Issue Details...
          </p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Issue Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The issue you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={() => router.push("/admin/issues")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Issues
        </Button>
      </div>
    );
  }

  const progressPercentage = Math.round(
    (issue.raisedAmount / issue.estimatedCost) * 100
  );
  const remainingAmount = issue.estimatedCost - issue.raisedAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/issues")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex gap-2">
          <ConfirmationDialog
            title="Delete Issue"
            description={`Are you sure you want to delete "${issue.title}"? This action cannot be undone.`}
            confirmText="Delete Issue"
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
          {issue.title}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {issue.orphanageName}
          </span>
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex gap-2">
        <Badge className={categoryColors[issue.category]}>
          {issue.category}
        </Badge>
        <Badge className={priorityColors[issue.priority]}>
          {issue.priority}
        </Badge>
        <Badge className={statusColors[issue.status]}>{issue.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {issue.description}
              </p>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimated Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${issue.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Raised Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${issue.raisedAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Remaining Amount</p>
                <p className="text-xl font-semibold text-orange-600">
                  ${remainingAmount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {issue.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm font-medium">
                  {formatFirebaseDate(issue.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm font-medium">
                  {formatFirebaseDate(issue.updatedAt)}
                </span>
              </div>
              {issue.deadline && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Deadline</span>
                  <span className="text-sm font-medium">
                    {formatFirebaseDate(issue.deadline)}
                  </span>
                </div>
              )}
              {issue.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Resolved</span>
                  <span className="text-sm font-medium">
                    {formatFirebaseDate(issue.resolvedAt)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {issue.status === "open" && (
                <Button
                  onClick={() => handleStatusUpdate("in-progress")}
                  disabled={actionLoading}
                  className="w-full"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Working
                </Button>
              )}
              {issue.status === "in-progress" && (
                <Button
                  onClick={() => handleStatusUpdate("resolved")}
                  disabled={actionLoading}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              {issue.status === "resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("closed")}
                  disabled={actionLoading}
                  variant="outline"
                  className="w-full"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Close Issue
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/admin/issues`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Issues
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
