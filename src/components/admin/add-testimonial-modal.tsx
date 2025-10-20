"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createTestimonial, updateTestimonial, TestimonialRecord } from "@/firebase/testimonials";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(1),
  type: z.enum(["text", "video"]),
  content: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  avatar: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function AddTestimonialModal({
  isOpen,
  onClose,
  onSuccess,
  editingTestimonial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTestimonial?: TestimonialRecord | null;
}) {
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
      rating: 5,
    },
  });

  useEffect(() => {
    if (editingTestimonial) {
      const { id, createdAt, updatedAt, ...rest } = editingTestimonial;
      reset(rest as any);
    } else if (isOpen) {
      reset({ type: "text", published: true, rating: 5 });
    }
  }, [editingTestimonial, isOpen, reset]);

  const type = watch("type");

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, values);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(values as any);
        toast.success("Testimonial created");
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Jane Doe" />
            </div>
            <div>
              <Label>Role</Label>
              <Input {...register("role")} placeholder="Donor" />
            </div>
            <div>
              <Label>Type</Label>
              <SelectField value={type} onValueChange={(v: any) => reset({ ...watch(), type: v })}>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectField>
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} {...register("rating")} />
            </div>
            <div>
              <Label>Avatar (initials or image URL)</Label>
              <Input {...register("avatar")} placeholder="JD or https://..." />
            </div>
            <div>
              <Label>Gradient Color</Label>
              <Input {...register("color")} placeholder="from-pink-500 to-rose-500" />
            </div>
            <div className="md:col-span-2">
              <Label>Content</Label>
              <Textarea rows={3} {...register("content")} placeholder="Short quote..." />
            </div>
            <div className="md:col-span-2">
              <Label>Image URL (for hero or card background)</Label>
              <Input {...register("imageUrl")} placeholder="https://..." />
            </div>
            {type === "video" && (
              <div className="md:col-span-2">
                <Label>Video URL (MP4)</Label>
                <Input {...register("videoUrl")} placeholder="https://...mp4" />
              </div>
            )}
            <div className="flex items-center gap-2 md:col-span-2">
              <Switch id="published" {...register("published")} />
              <Label htmlFor="published">Published</Label>
            </div>
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


