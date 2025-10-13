"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "@/common/types";
import { formatCurrency } from "@/common/helpers";

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (issueId: string) => Promise<void>;
  onUpdate: () => void;
}

export function IssueCard({ issue, onEdit, onDelete, onUpdate }: IssueCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "resolved":
        return "default";
      case "in-progress":
        return "secondary";
      case "open":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Call parent's onDelete which handles Firebase deletion
      await onDelete(issue.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Error deleting request");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="pt-5 pb-8 h-fit hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{issue.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPriorityColor(issue.priority)}>
                  {issue.priority}
                </Badge>
                <Badge variant={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
                <Badge variant="outline">{issue.category}</Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(issue)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {issue.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Raised:</span>
              <span className="text-sm">
                {formatCurrency(issue.raisedAmount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Needed:</span>
              <span className="text-sm">
                {formatCurrency(issue.estimatedCost)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm">
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className="font-medium">
                {Math.round(
                  (issue.raisedAmount / issue.estimatedCost) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-main-red h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (issue.raisedAmount / issue.estimatedCost) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(issue)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{issue.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
