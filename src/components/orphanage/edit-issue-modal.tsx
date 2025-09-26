"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import type { Issue } from "@/common/types";

interface EditIssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditIssueModal({ issue, isOpen, onClose, onUpdate }: EditIssueModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "medical" as Issue["category"],
    priority: "medium" as Issue["priority"],
    estimatedCost: "",
    deadline: undefined as string | Date | undefined,
  });

  // Update form data when issue changes
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        estimatedCost: issue.estimatedCost.toString(),
        deadline: issue.deadline ? new Date(issue.deadline) : undefined,
      });
    }
  }, [issue]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;

    try {
      setIsSubmitting(true);
      const { updateIssue } = await import("@/firebase/impacts");
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        estimatedCost: parseFloat(formData.estimatedCost),
        deadline: formData.deadline ? (formData.deadline instanceof Date ? formData.deadline : new Date(formData.deadline)) : undefined,
      };

      await updateIssue(issue.id, updateData);
      
      toast.success("Request updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating issue:", error);
      toast.error("Error updating request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Request Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Medical supplies for children"
              required
            />
            <SelectField
              label="Category"
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

          <TextareaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the issue and how the funds will be used..."
            rows={4}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Priority"
              value={formData.priority}
              required
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "priority", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              {["low", "medium", "high", "urgent"].map((priority, index) => (
                <SelectItem key={index} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectField>

            <InputField
              label="Estimated Cost (₦)"
              name="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={handleInputChange}
              placeholder="1000"
              min="1"
              required
            />

            <div>
              <DatePicker
                label="Deadline (Optional)"
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
              {isSubmitting ? "Updating..." : "Update Request"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
