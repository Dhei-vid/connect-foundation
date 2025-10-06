"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive" | "warning" | "success";
  disabled?: boolean;
  loading?: boolean;
  showCancel?: boolean;
}

export function ConfirmationDialog({
  children,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  disabled = false,
  loading = false,
  showCancel = true,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    if (!disabled && !loading) {
      onConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-600 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 text-white";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel disabled={loading}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={disabled || loading}
            className={cn(getVariantStyles())}
          >
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Convenience components for common use cases
export function DeleteConfirmation({
  children,
  itemName,
  itemType = "item",
  onConfirm,
  disabled = false,
  loading = false,
}: {
  children: React.ReactNode;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <ConfirmationDialog
      title={`Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone. This will permanently remove the ${itemType} from the system.`}
      confirmText={`Delete ${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      }`}
      cancelText="Cancel"
      onConfirm={onConfirm}
      variant="destructive"
      disabled={disabled}
      loading={loading}
    >
      {children}
    </ConfirmationDialog>
  );
}

export function ActionConfirmation({
  children,
  title,
  description,
  actionText,
  onConfirm,
  disabled = false,
  loading = false,
  variant = "default",
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "destructive" | "warning" | "success";
}) {
  return (
    <ConfirmationDialog
      title={title}
      description={description}
      confirmText={actionText}
      cancelText="Cancel"
      onConfirm={onConfirm}
      variant={variant}
      disabled={disabled}
      loading={loading}
    >
      {children}
    </ConfirmationDialog>
  );
}
