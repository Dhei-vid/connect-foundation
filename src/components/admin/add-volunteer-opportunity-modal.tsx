"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createVolunteerOpportunity } from "@/firebase/volunteer-opportunities";
import { toast } from "sonner";

interface AddVolunteerOpportunityModalProps {
  children: React.ReactNode;
  onSuccess: () => void;
}

export function AddVolunteerOpportunityModal({
  children,
  onSuccess,
}: AddVolunteerOpportunityModalProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeCommitment: "",
    location: "",
    image: "",
    icon: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !formData.title ||
      !formData.description ||
      !formData.timeCommitment ||
      !formData.location
    ) {
      toast.error("Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Starting volunteer opportunity creation...");

      console.log("Creating volunteer opportunity with data:", {
        ...formData,
        isActive: true,
      });

      await createVolunteerOpportunity({
        ...formData,
        isActive: true,
      });

      console.log("Volunteer opportunity created successfully!");

      toast("Success", {
        description: "Volunteer opportunity created successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        timeCommitment: "",
        location: "",
        image: "",
        icon: "",
      });

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error creating volunteer opportunity:", error);
      toast.error("Error", {
        description: `Failed to create volunteer opportunity: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Volunteer Opportunity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <Input
              type="text"
              placeholder="e.g., Teaching & Education"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <Textarea
              placeholder="Describe the volunteer opportunity..."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Time Commitment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Commitment *
            </label>
            <Input
              type="text"
              placeholder="e.g., 2-4 hours/week"
              value={formData.timeCommitment}
              onChange={(e) =>
                handleInputChange("timeCommitment", e.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <Input
              type="text"
              placeholder="e.g., On-site, Remote, Flexible"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (Optional)
            </label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon Name (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., BookOpen, Heart, Users"
              value={formData.icon}
              onChange={(e) => handleInputChange("icon", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Opportunity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
