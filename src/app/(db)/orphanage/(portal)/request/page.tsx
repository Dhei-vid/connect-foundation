"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "@/common/types";
import { DatePicker } from "@/components/ui/date-picker";
import { IssueCard } from "@/components/orphanage/issue-card";
import { EditIssueModal } from "@/components/orphanage/edit-issue-modal";
import {
  SelectField,
  InputField,
  TextareaField,
} from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";

export default function OrphanageRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isOrphanage } = useAuthContext();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Form state for creating new issue
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "medical" as Issue["category"],
    priority: "medium" as Issue["priority"],
    estimatedCost: "",
    deadline: undefined as string | Date | undefined,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/orphanage/signin");
    }
    if (!isLoading && isAuthenticated && !isOrphanage) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, isOrphanage, router]);

  // Load issues for this orphanage
  useEffect(() => {
    const loadIssues = async () => {
      if (!user?.uid) return;

      try {
        setIsDataLoading(true);
        const { getIssues } = await import("@/firebase/issues");
        const orphanageIssues = await getIssues({ orphanageId: user.uid });
        setIssues(orphanageIssues);
      } catch (error) {
        console.error("Error loading issues:", error);
        toast.error("Error loading your requests");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (user?.uid) {
      loadIssues();
    }
  }, [user?.uid]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setIsSubmitting(true);
      const { createIssue } = await import("@/firebase/issues");

      const issueData = {
        orphanageId: user.uid,
        orphanageName: user.displayName || "Unknown Orphanage",
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: "open" as const,
        images: [],
        estimatedCost: parseFloat(formData.estimatedCost),
        raisedAmount: 0,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      };

      await createIssue(issueData);

      // Refresh issues list
      const { getIssues } = await import("@/firebase/issues");
      const updatedIssues = await getIssues({ orphanageId: user.uid });
      setIssues(updatedIssues);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "medical",
        priority: "medium",
        estimatedCost: "",
        deadline: undefined,
      });
      setShowCreateForm(false);

      toast.success("Request created successfully!");
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("Error creating request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setShowEditModal(true);
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      // Delete from Firebase
      const { deleteIssue } = await import("@/firebase/issues");
      await deleteIssue(issueId);
      
      // Update local state
      setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
      
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Failed to delete request");
    }
  };

  const handleUpdateIssues = async () => {
    if (!user?.uid) return;

    try {
      const { getIssues } = await import("@/firebase/issues");
      const updatedIssues = await getIssues({ orphanageId: user.uid });
      setIssues(updatedIssues);
    } catch (error) {
      console.error("Error refreshing issues:", error);
      toast.error("Failed to refresh issues");
    }
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
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

        {/* Create Issue Form Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Issues List Skeleton */}
        <Card>
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

  if (!isAuthenticated || !isOrphanage) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Request for AID
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your requests for assistance
            </p>
          </div>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          )}
        </div>
      </div>

      {/* Create Issue Form */}
      {showCreateForm && (
        <Card className="mb-8 py-6">
          <CardHeader>
            <CardTitle>Create New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    label={"Request Title"}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Medical supplies for children"
                    required
                  />
                </div>
                <div className={"w-full"}>
                  <SelectField
                    label={"Category"}
                    value={formData.category}
                    required
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "category", value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    {[
                      "medical",
                      "education",
                      "food",
                      "shelter",
                      "clothing",
                      "other",
                    ].map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectField>
                </div>
              </div>

              <div>
                <TextareaField
                  label={"Description"}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue and how the funds will be used..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full">
                  <SelectField
                    label={"Priority"}
                    value={formData.priority}
                    required
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "priority", value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    {["low", "medium", "high", "urgent"].map(
                      (priority, index) => (
                        <SelectItem key={index} value={priority}>
                          {priority}
                        </SelectItem>
                      )
                    )}
                  </SelectField>
                </div>

                <div>
                  <InputField
                    label={"Estimated Cost (₦)"}
                    name={"estimatedCost"}
                    type="number"
                    value={formData.estimatedCost}
                    onChange={handleInputChange}
                    placeholder="1000"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <DatePicker
                    label={"Deadline (Optional)"}
                    date={formData.deadline}
                    setDate={(date) => {
                      setFormData({
                        ...formData,
                        deadline: date,
                      });
                    }}
                    open={isDatePickerOpen}
                    setOpen={setIsDatePickerOpen}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Request"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      {!showCreateForm && issues.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No requests yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first request for aid to get started.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onEdit={handleEditIssue}
              onDelete={handleDeleteIssue}
              onUpdate={handleUpdateIssues}
            />
          ))}
        </div>
      )}

      {/* Edit Issue Modal */}
      <EditIssueModal
        issue={editingIssue}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingIssue(null);
        }}
        onUpdate={handleUpdateIssues}
      />
    </div>
  );
}
