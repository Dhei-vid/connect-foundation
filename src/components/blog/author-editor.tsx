"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Author } from "@/common/types";
import { User, X, Plus } from "lucide-react";
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

interface AuthorEditorProps {
  author: Author;
  onUpdate: (field: keyof Author, value: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const AuthorEditor: React.FC<AuthorEditorProps> = ({
  author,
  onUpdate,
  onRemove,
  showRemove = false,
}) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    }
  };

  const removeAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    onUpdate("avatar", "");
  };

  const handleSocialLinkUpdate = (
    platform: keyof NonNullable<Author["socialLinks"]>,
    value: string
  ) => {
    const currentSocialLinks = author.socialLinks || {};
    const updatedSocialLinks = {
      ...currentSocialLinks,
      [platform]: value,
    };
    // Since onUpdate expects a string, we'll need to handle this differently
    // For now, we'll use JSON.stringify as a workaround
    onUpdate("socialLinks" as keyof Author, JSON.stringify(updatedSocialLinks));
  };

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={avatarPreview || author.avatar || ""}
            alt={author.name || "Author"}
          />
          <AvatarFallback className="bg-main-100 text-main-800 text-lg font-semibold">
            {author.name ? author.name.substring(0, 2).toUpperCase() : "AU"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer text-xs text-center px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
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
          {(avatarPreview || author.avatar) && (
            <button
              type="button"
              onClick={removeAvatar}
              className="text-xs text-center px-2 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Name"
          value={author.name || ""}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="Author name"
          required
        />
        <InputField
          label="Role"
          value={author.role || ""}
          onChange={(e) => onUpdate("role", e.target.value)}
          placeholder="e.g., Content Writer, Editor"
        />
        <InputField
          label="Email"
          type="email"
          value={author.email || ""}
          onChange={(e) => onUpdate("email", e.target.value)}
          placeholder="author@example.com"
        />
        <InputField
          label="Website"
          value={author.socialLinks?.website || ""}
          onChange={(e) => handleSocialLinkUpdate("website", e.target.value)}
          placeholder="https://author-website.com"
        />
        <InputField
          label="Twitter"
          value={author.socialLinks?.twitter || ""}
          onChange={(e) => handleSocialLinkUpdate("twitter", e.target.value)}
          placeholder="@username"
        />
        <InputField
          label="LinkedIn"
          value={author.socialLinks?.linkedin || ""}
          onChange={(e) => handleSocialLinkUpdate("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/username"
        />
        <div className="md:col-span-2">
          <TextareaField
            label="Bio"
            value={author.bio || ""}
            onChange={(e) => onUpdate("bio", e.target.value)}
            placeholder="Brief author biography"
            rows={3}
          />
        </div>
      </div>

      {/* Remove Button */}
      {showRemove && onRemove && (
        <div className="flex items-start pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Author</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this author? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onRemove}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

interface AuthorsEditorProps {
  authors: Author[];
  onUpdate: (index: number, field: keyof Author, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const AuthorsEditor: React.FC<AuthorsEditorProps> = ({
  authors,
  onUpdate,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-main-600" />
          <h2 className="text-xl font-semibold">Authors</h2>
        </div>
        <Button type="button" onClick={onAdd} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Author
        </Button>
      </div>

      {authors.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No authors added yet. Add an author to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {authors.map((author, index) => (
          <AuthorEditor
            key={index}
            author={author}
            onUpdate={(field, value) => onUpdate(index, field, value)}
            onRemove={() => onRemove(index)}
            showRemove={authors.length > 1}
          />
        ))}
      </div>
    </div>
  );
};
