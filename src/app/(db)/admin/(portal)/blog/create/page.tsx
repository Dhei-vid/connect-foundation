"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Eye, X, Calendar, User, Edit, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createBlogPost } from "@/firebase/blog";
import type {
  BlogPost,
  ContentBlock,
  Author,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  QuoteBlock,
  EmbedBlock,
  ListBlock,
  CodeBlock,
} from "@/common/types";
import { ContentBlocksEditor } from "@/components/blog/content-block-editor";
import { ContentBlocksRenderer } from "@/components/blog/content-block-renderer";
import { ImagePicker } from "@/components/ui/image-picker";
import { uploadImage } from "@/firebase/storage";
import {
  isHeadingBlock,
  isParagraphBlock,
  isImageBlock,
  isQuoteBlock,
  isEmbedBlock,
  isListBlock,
  isCodeBlock,
} from "@/components/blog/content-block-renderer";
import { Spinner } from "@/components/ui/spinner";

const CATEGORIES = [
  "Impact",
  "Stories",
  "Updates",
  "Volunteer",
  "Education",
  "Healthcare",
  "Community",
  "Awareness",
  "Success",
  "News",
];

const TAGS = [
  "children",
  "orphanage",
  "donation",
  "volunteer",
  "education",
  "healthcare",
  "community",
  "impact",
  "success",
  "hope",
  "support",
  "care",
  "love",
  "family",
  "future",
];

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  featuredImage: string;
  author: Author;
  categories: string[];
  tags: string[];
  published: boolean;
  featured: boolean;
  readingTime: number;
}

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: [],
    featuredImage: "",
    author: {
      name: "",
      role: "",
      email: "",
      bio: "",
      avatar: "",
      socialLinks: {
        twitter: "",
        linkedin: "",
        website: "",
      },
    },
    categories: [],
    tags: [],
    published: false,
    featured: false,
    readingTime: 5,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const handleInputChange = (
    field: keyof BlogFormData,
    value: string | boolean | ContentBlock[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAuthorChange = (field: keyof Author, value: string) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
  };

  const handleAuthorSocialLinkChange = (
    platform: keyof NonNullable<Author["socialLinks"]>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        socialLinks: {
          ...prev.author.socialLinks,
          [platform]: value,
        },
      },
    }));
  };

  const handleAuthorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setAuthorAvatarFile(file);
      setAuthorAvatarPreview(previewUrl);
    }
  };

  const removeAuthorAvatar = () => {
    if (authorAvatarPreview) {
      URL.revokeObjectURL(authorAvatarPreview);
    }
    setAuthorAvatarFile(null);
    setAuthorAvatarPreview(null);
    handleAuthorChange("avatar", "");
  };

  const handleCategoryChange = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
    setSelectedCategory("");
  };

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const handleTagChange = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setSelectedTag("");
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addContentBlock = (type: ContentBlock["type"]) => {
    let newBlock: ContentBlock;

    switch (type) {
      case "heading":
        newBlock = {
          id: Date.now().toString(),
          type: "heading",
          level: 2,
          text: "",
          order: formData.content.length,
        } as HeadingBlock;
        break;
      case "paragraph":
        newBlock = {
          id: Date.now().toString(),
          type: "paragraph",
          text: "",
          order: formData.content.length,
        } as ParagraphBlock;
        break;
      case "image":
        newBlock = {
          id: Date.now().toString(),
          type: "image",
          image: "",
          caption: "",
          alt: "",
          order: formData.content.length,
        } as ImageBlock;
        break;
      case "quote":
        newBlock = {
          id: Date.now().toString(),
          type: "quote",
          text: "",
          cite: "",
          order: formData.content.length,
        } as QuoteBlock;
        break;
      case "embed":
        newBlock = {
          id: Date.now().toString(),
          type: "embed",
          provider: "youtube",
          src: "",
          title: "",
          order: formData.content.length,
        } as EmbedBlock;
        break;
      case "list":
        newBlock = {
          id: Date.now().toString(),
          type: "list",
          items: [""],
          ordered: false,
          order: formData.content.length,
        } as ListBlock;
        break;
      case "code":
        newBlock = {
          id: Date.now().toString(),
          type: "code",
          code: "",
          language: "javascript",
          order: formData.content.length,
        } as CodeBlock;
        break;
      default:
        return;
    }

    handleInputChange("content", [...formData.content, newBlock]);
  };

  const updateContentBlock = (
    index: number,
    field: string,
    value: string | number | boolean | string[]
  ) => {
    const updatedContent = [...formData.content];
    const block = updatedContent[index];

    // Update the field based on block type with proper type assertions
    if (field === "level" && isHeadingBlock(block)) {
      (block as HeadingBlock).level = value as 1 | 2 | 3 | 4;
    } else if (
      field === "text" &&
      (isHeadingBlock(block) || isParagraphBlock(block) || isQuoteBlock(block))
    ) {
      (block as HeadingBlock | ParagraphBlock | QuoteBlock).text =
        value as string;
    } else if (field === "image" && isImageBlock(block)) {
      (block as ImageBlock).image = value as string;
    } else if (field === "caption" && isImageBlock(block)) {
      (block as ImageBlock).caption = value as string;
    } else if (field === "alt" && isImageBlock(block)) {
      (block as ImageBlock).alt = value as string;
    } else if (field === "cite" && isQuoteBlock(block)) {
      (block as QuoteBlock).cite = value as string;
    } else if (field === "provider" && isEmbedBlock(block)) {
      (block as EmbedBlock).provider = value as "youtube" | "vimeo" | "other";
    } else if (field === "src" && isEmbedBlock(block)) {
      (block as EmbedBlock).src = value as string;
    } else if (field === "title" && isEmbedBlock(block)) {
      (block as EmbedBlock).title = value as string;
    } else if (field === "items" && isListBlock(block)) {
      (block as ListBlock).items = value as string[];
    } else if (field === "ordered" && isListBlock(block)) {
      (block as ListBlock).ordered = value as boolean;
    } else if (field === "code" && isCodeBlock(block)) {
      (block as CodeBlock).code = value as string;
    } else if (field === "language" && isCodeBlock(block)) {
      (block as CodeBlock).language = value as string;
    }

    handleInputChange("content", updatedContent);
  };

  const removeContentBlock = (index: number) => {
    const updatedContent = formData.content.filter((_, i) => i !== index);
    handleInputChange("content", updatedContent);
  };

  const calculateReadingTime = (content: ContentBlock[]) => {
    const wordsPerMinute = 200;
    let totalWords = 0;

    content.forEach((block) => {
      if (isParagraphBlock(block) || isHeadingBlock(block)) {
        totalWords += block.text?.split(/\s+/).length || 0;
      } else if (isListBlock(block)) {
        totalWords +=
          block.items
            ?.filter((item) => item.trim())
            .join(" ")
            .split(/\s+/).length || 0;
      }
    });

    const minutes = Math.ceil(totalWords / wordsPerMinute);
    return Math.max(1, minutes);
  };

  // const generateSlug = (title: string) => {
  //   return title
  //     .toLowerCase()
  //     .replace(/[^a-z0-9 -]/g, "")
  //     .replace(/\s+/g, "-")
  //     .replace(/-+/g, "-");
  // };

  // Helper function to check if URL is a blob URL (local file)
  const isBlobUrl = (url: string): boolean => {
    return url.startsWith("blob:");
  };

  // Helper function to upload blob URL to Firebase
  const uploadBlobToFirebase = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const fileName = `blog-${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
      const file = new File([blob], fileName, { type: blob.type });

      const downloadURL = await uploadImage(file, `blog-images/${fileName}`);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading blob to Firebase:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    if (!formData.excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    if (formData.content.length === 0) {
      toast.error("Please add at least one content block");
      return;
    }

    if (!formData.author.name.trim()) {
      toast.error("Author name is required");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("Please add at least one category");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Upload author avatar if new file uploaded
      let authorAvatarUrl = formData.author.avatar;
      if (authorAvatarFile) {
        toast.info("Uploading author avatar...");
        const fileName = `author-${Date.now()}.${
          authorAvatarFile.type.split("/")[1] || "jpg"
        }`;
        authorAvatarUrl = await uploadImage(
          authorAvatarFile,
          `author-avatars/${fileName}`
        );
      }
      setUploadProgress(20);

      // Handle hero image upload if it's a blob URL
      let heroImageUrl = formData.featuredImage.trim();
      if (heroImageUrl && isBlobUrl(heroImageUrl)) {
        toast.info("Uploading hero image...");
        heroImageUrl = await uploadBlobToFirebase(heroImageUrl);
      } else {
        setUploadProgress(50);
      }

      // Calculate reading time
      const readingTime = calculateReadingTime(formData.content);

      const blogData: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        featuredImage: heroImageUrl,
        author: {
          ...formData.author,
          avatar: authorAvatarUrl,
        },
        categories: formData.categories,
        tags: formData.tags,
        published: formData.published,
        featured: formData.featured,
        readingTime,
        views: 0, // Default value for views
        likes: 0, // Default value for likes
        publishedAt: formData.published ? new Date().toISOString() : null, // Set publishedAt if published
      };

      toast.info("Creating blog post...");
      setUploadProgress(80);
      await createBlogPost(blogData);
      setUploadProgress(100);
      toast.success("Blog post created successfully!");

      // Clean up preview URL
      if (authorAvatarPreview) {
        URL.revokeObjectURL(authorAvatarPreview);
      }

      setTimeout(() => {
        router.push("/admin/blog");
      }, 1000);
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Create Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a blog to engage with your community
        </p>
      </div>

      <Card className="py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            {viewMode === "form" ? (
              <CardTitle>Create Blog Post</CardTitle>
            ) : (
              <CardTitle>Blog Post Preview</CardTitle>
            )}

            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
              <button
                onClick={() => setViewMode("form")}
                className={`flex flex-row items-center cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "form"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Form
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex flex-row items-center cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "preview" ? (
            <div className="space-y-6">
              {/* Blog Preview */}
              <div className="mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {formData.title || "Untitled Blog Post"}
                </h1>

                {formData.excerpt && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                    {formData.excerpt}
                  </p>
                )}

                {formData.featuredImage && (
                  <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100 mb-6">
                    <Image
                      src={formData.featuredImage}
                      alt="Featured image"
                      fill
                      className="object-cover"
                      onError={() => {
                        // Handle error if needed
                      }}
                    />
                  </div>
                )}

                <ContentBlocksRenderer blocks={formData.content} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-main-600" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog post title"
                  />
                  <InputField
                    label="Slug"
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="blog-post-slug"
                  />
                </div>

                <TextareaField
                  label="Excerpt"
                  required
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <ImagePicker
                    value={formData.featuredImage}
                    onChange={(imageUrl) =>
                      handleInputChange("featuredImage", imageUrl)
                    }
                    placeholder="Enter image URL or upload a file"
                    showPreview
                  />
                </div>
              </div>

              <Separator />

              {/* Author Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-main-600" />
                  <h2 className="text-xl font-semibold">Author</h2>
                </div>

                <div className="flex gap-4 p-4 border rounded-lg">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                      {authorAvatarPreview || formData.author.avatar ? (
                        <Image
                          src={
                            authorAvatarPreview || formData.author.avatar || ""
                          }
                          alt="Author avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="author-avatar-upload"
                        className="cursor-pointer text-xs text-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                      >
                        Upload
                      </label>
                      <input
                        id="author-avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAuthorAvatarUpload}
                        className="hidden"
                      />
                      {(authorAvatarPreview || formData.author.avatar) && (
                        <button
                          type="button"
                          onClick={removeAuthorAvatar}
                          className="text-xs text-center px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600"
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
                      required
                      value={formData.author.name}
                      onChange={(e) =>
                        handleAuthorChange("name", e.target.value)
                      }
                      placeholder="Author name"
                    />
                    <InputField
                      label="Role"
                      value={formData.author.role}
                      onChange={(e) =>
                        handleAuthorChange("role", e.target.value)
                      }
                      placeholder="e.g., Content Writer"
                    />
                    <InputField
                      label="Email"
                      type="email"
                      value={formData.author.email}
                      onChange={(e) =>
                        handleAuthorChange("email", e.target.value)
                      }
                      placeholder="author@example.com"
                    />
                    <InputField
                      label="Website"
                      value={formData.author.socialLinks?.website || ""}
                      onChange={(e) =>
                        handleAuthorSocialLinkChange("website", e.target.value)
                      }
                      placeholder="https://author-website.com"
                    />
                    <div className="md:col-span-2">
                      <TextareaField
                        label="Bio"
                        value={formData.author.bio}
                        onChange={(e) =>
                          handleAuthorChange("bio", e.target.value)
                        }
                        placeholder="Brief author biography"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories and Tags Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-main-600" />
                  <h2 className="text-xl font-semibold">Categories & Tags</h2>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SelectField
                        label="Categories"
                        required
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                        placeholder="Select a category"
                      >
                        {CATEGORIES.filter(
                          (category) => !formData.categories.includes(category)
                        ).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectField>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SelectField
                        label="Tags"
                        value={selectedTag}
                        onValueChange={handleTagChange}
                        placeholder="Select a tag"
                      >
                        {TAGS.filter((tag) => !formData.tags.includes(tag)).map(
                          (tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          )
                        )}
                      </SelectField>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content Section */}
              <ContentBlocksEditor
                blocks={formData.content}
                onAddBlock={addContentBlock}
                onUpdateBlock={updateContentBlock}
                onRemoveBlock={removeContentBlock}
              />

              <Separator />

              {/* Publishing Options */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-main-600" />
                  <h2 className="text-xl font-semibold">Publishing Options</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Publish immediately
                      </label>
                      <p className="text-sm text-gray-500">
                        Make this post visible to the public
                      </p>
                    </div>
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        handleInputChange("published", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Featured post
                      </label>
                      <p className="text-sm text-gray-500">
                        Highlight this post on the homepage
                      </p>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleInputChange("featured", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {loading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Upload Progress
                    </label>
                    <span className="text-sm text-gray-500">
                      {uploadProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Post
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/blog")}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
