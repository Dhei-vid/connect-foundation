"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import {
  MultiImageUpload,
  ImageFile,
} from "@/components/ui/multi-image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  uploadImage,
  generateImagePath,
  validateImageFile,
} from "@/firebase/storage";
import {
  createSuccessStory,
  updateSuccessStory,
} from "@/firebase/success-stories";
import { getOrphanages } from "@/firebase/orphanages";
import { getIssues } from "@/firebase/issues";
import { toast } from "sonner";
import type { SuccessStory, Orphanage, Issue } from "@/common/types";
import { Spinner } from "@/components/ui/spinner";
import { NewDatePicker } from "../ui/datepicker";

interface AddSuccessStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingStory?: SuccessStory | null;
}

export function AddSuccessStoryModal({
  isOpen,
  onClose,
  onSuccess,
  editingStory,
}: AddSuccessStoryModalProps) {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [localImages, setLocalImages] = useState<ImageFile[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    orphanageId: "",
    issueId: "",
    title: "",
    description: "",
    impact: "",
    beneficiaries: 0,
    cost: 0,
    completedAt: new Date(),
    images: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (editingStory) {
        setFormData({
          orphanageId: editingStory.orphanageId,
          issueId: editingStory.issueId,
          title: editingStory.title,
          description: editingStory.description,
          impact: editingStory.impact,
          beneficiaries: editingStory.beneficiaries,
          cost: editingStory.cost,
          completedAt: editingStory.completedAt,
          images: editingStory.images || [],
        });
      } else {
        // Reset form for new story
        setFormData({
          orphanageId: "",
          issueId: "",
          title: "",
          description: "",
          impact: "",
          beneficiaries: 0,
          cost: 0,
          completedAt: new Date(),
          images: [],
        });
      }
    }
  }, [isOpen, editingStory]);

  const loadData = async () => {
    try {
      const [orphanagesData, issuesData] = await Promise.all([
        getOrphanages(),
        getIssues(),
      ]);
      setOrphanages(orphanagesData);
      setIssues(issuesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load orphanages and issues");
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | string[] | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as string | number | string[] | Date | undefined,
    }));
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || "Invalid file");
          continue;
        }

        // Generate unique path
        const path = generateImagePath("success-stories", file.name);

        // Upload to Firebase Storage
        const url = await uploadImage(file, path);
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload some images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orphanageId || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const selectedOrphanage = orphanages.find(
        (o) => o.id === formData.orphanageId
      );
      const selectedIssue = issues.find((i) => i.id === formData.issueId);

      const successStoryData = {
        orphanageId: formData.orphanageId,
        orphanageName: selectedOrphanage?.name || "Unknown Orphanage",
        issueId: formData.issueId,
        issueTitle: selectedIssue?.title || "General Support",
        title: formData.title,
        description: formData.description,
        impact: formData.impact,
        images: formData.images,
        beneficiaries: formData.beneficiaries,
        cost: formData.cost,
        completedAt: formData.completedAt,
      };

      if (editingStory) {
        await updateSuccessStory(editingStory.id, successStoryData);
        toast.success("Success story updated successfully");
      } else {
        await createSuccessStory(successStoryData);
        toast.success("Success story created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving success story:", error);
      toast.error("Failed to save success story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-width">
        <DialogHeader>
          <DialogTitle>
            {editingStory ? "Edit Success Story" : "Add New Success Story"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="success-story-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Orphanage"
              required
              value={formData.orphanageId}
              onValueChange={(value) => handleInputChange("orphanageId", value)}
            >
              {/* <SelectItem value="">Select an orphanage</SelectItem> */}
              {orphanages.map((orphanage) => (
                <SelectItem key={orphanage.id} value={orphanage.id}>
                  {orphanage.name}
                </SelectItem>
              ))}
            </SelectField>

            <SelectField
              label="Related Issue (Optional)"
              value={formData.issueId}
              onValueChange={(value) => handleInputChange("issueId", value)}
            >
              {/* <SelectItem value="">Select an issue (optional)</SelectItem> */}
              {issues
                .filter((issue) => issue.orphanageId === formData.orphanageId)
                .map((issue) => (
                  <SelectItem key={issue.id} value={issue.id}>
                    {issue.title}
                  </SelectItem>
                ))}
            </SelectField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter success story title"
                required
              />
            </div>

            <NewDatePicker
              label={"Completion Date"}
              date={formData.completedAt}
              setDate={(value) =>
                handleInputChange("completedAt", value as Date)
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what was accomplished..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Impact
            </label>
            <Textarea
              value={formData.impact}
              onChange={(e) => handleInputChange("impact", e.target.value)}
              placeholder="Describe the impact and benefits achieved..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Beneficiaries
              </label>
              <Input
                type="number"
                min="0"
                value={formData.beneficiaries}
                onChange={(e) =>
                  handleInputChange(
                    "beneficiaries",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Number of people helped"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Cost (₦)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) =>
                  handleInputChange("cost", parseFloat(e.target.value) || 0)
                }
                placeholder="Total amount invested"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Success Images
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Upload images showing the successful completion of the project.
              These will be displayed in the success story gallery.
            </p>
            <MultiImageUpload
              value={formData.images}
              onChange={(urls) => handleInputChange("images", urls)}
              localImages={localImages}
              setLocalImages={setLocalImages}
              maxImages={10}
              maxSizeMB={5}
              label=""
              description="Upload images of the completed project"
              disabled={loading || uploadingImages}
            />

            {uploadingImages && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Spinner className="w-4 h-4" />
                Uploading images...
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="flex gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingImages}
            className="flex-1"
            form="success-story-form"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                {editingStory ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingStory ? "Update Story" : "Create Story"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
