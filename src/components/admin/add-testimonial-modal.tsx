"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputField,
  TextareaField,
  SelectField,
} from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  createTestimonial,
  updateTestimonial,
  TestimonialRecord,
} from "@/firebase/testimonials";
import { uploadFile, generateFilePath, uploadImage } from "@/firebase/storage";
import { toast } from "sonner";
import { extractErrorMessage, UnknownError } from "@/common/helpers";

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(1),
  email: z.string().email().optional(),
  organization: z.string().optional(),
  type: z.enum(["text", "video"]),
  content: z.string().optional(),
  avatarImageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTestimonial?: TestimonialRecord | null;
}

export function AddTestimonialModal({
  isOpen,
  onClose,
  onSuccess,
  editingTestimonial,
}: AddTestimonialModalProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "text",
      published: true,
    },
  });

  useEffect(() => {
    if (editingTestimonial) {
      const { ...rest } = editingTestimonial;
      reset(rest as FormValues);
    } else if (isOpen) {
      reset({ type: "text", published: true });
    }
  }, [editingTestimonial, isOpen, reset]);

  const type = watch("type");

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper function to check if URL is YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarFile(file);
      setAvatarPreview(previewUrl);

      // Update the form field immediately
      reset({ ...watch(), avatarImageUrl: previewUrl });
    }
  };

  const removeAvatar = (): void => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    reset({ ...watch(), avatarImageUrl: "" });
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    try {
      const path = generateFilePath("testimonials/videos", file.name);
      const url = await uploadFile(file, path);
      reset({ ...watch(), videoUrl: url });
      toast.success("Video uploaded");
    } catch (err) {
      const errorMessage = extractErrorMessage(err as UnknownError);
      toast.error(errorMessage ?? "Failed to upload video");
    }
  };

  const removeVideo = (): void => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    reset({ ...watch(), videoUrl: "" });
  };

  const onSubmit = async (values: FormValues): Promise<void> => {
    try {
      const finalValues = { ...values };

      // Upload avatar if new file uploaded
      if (avatarFile) {
        toast.info("Uploading avatar...");
        const fileName = `testimonial-avatar-${Date.now()}.${
          avatarFile.type.split("/")[1] || "jpg"
        }`;
        const avatarUrl = await uploadImage(
          avatarFile,
          `testimonial-avatars/${fileName}`
        );
        finalValues.avatarImageUrl = avatarUrl;
      }

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, finalValues);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(finalValues);
        toast.success("Testimonial created");
      }

      // Clean up preview URLs
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save testimonial");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-width">
        <DialogHeader>
          <DialogTitle>
            {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar and Basic Info Section */}
          <div className="flex gap-4 p-4 border rounded-lg">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {watch("avatarImageUrl") ? (
                  <Image
                    src={watch("avatarImageUrl") || ""}
                    alt="Testimonial avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer text-xs text-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                >
                  Upload
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                {watch("avatarImageUrl") && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-xs text-center px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Name"
                {...register("name")}
                placeholder="Jane Doe"
              />
              <InputField
                label="Role"
                {...register("role")}
                placeholder="Donor"
              />
              <InputField
                label="Email"
                type="email"
                {...register("email")}
                placeholder="jane@example.com"
              />
              <InputField
                label="Organization"
                {...register("organization")}
                placeholder="Company or Orphanage Name"
              />
              <SelectField
                label="Type"
                value={type}
                onValueChange={(v: string) =>
                  reset({ ...watch(), type: v as "text" | "video" })
                }
              >
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectField>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <TextareaField
                label="Content"
                rows={3}
                {...register("content")}
                placeholder="Short quote..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputField
                label="Video URL (YouTube or MP4)"
                {...register("videoUrl")}
                placeholder="https://... (YouTube or MP4)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste a YouTube link or an MP4 URL. You may also upload an MP4
                file below.
              </p>

              {/* Video Preview */}
              {(watch("videoUrl") || videoPreview) && (
                <div className="mt-4">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {videoPreview ? (
                      // Local video preview
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : watch("videoUrl") &&
                      isYouTubeUrl(watch("videoUrl")!) ? (
                      // YouTube embed
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                          watch("videoUrl")!
                        )}`}
                        title="Video preview"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : watch("videoUrl") ? (
                      // Direct video URL
                      <video
                        src={watch("videoUrl")}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  {(watch("videoUrl") || videoPreview) && (
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="mt-2 text-xs text-center px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600"
                    >
                      Remove Video
                    </button>
                  )}
                </div>
              )}

              <div className="mt-2">
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="published" {...register("published")} />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingTestimonial ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
