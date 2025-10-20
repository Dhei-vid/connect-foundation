"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  BookOpen,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  X,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getBlogPostById, updateBlogPost } from "@/firebase/blog";
import type { BlogPost } from "@/common/types";
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

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    author: {
      name: "",
      avatar: "",
      bio: "",
    },
    categories: [] as string[],
    tags: [] as string[],
    published: false,
    featured: false,
    readingTime: 5,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Load blog post data
  useEffect(() => {
    if (postId) {
      loadBlogPost();
    }
  }, [postId]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      const post = await getBlogPostById(postId);
      
      if (post) {
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: typeof post.content === 'string' ? post.content : 'Content editing not supported for this format',
          featuredImage: post.featuredImage || "",
          author: {
            name: post.author.name,
            avatar: post.author.avatar || "",
            bio: post.author.bio || "",
          },
          categories: post.categories,
          tags: post.tags,
          published: post.published,
          featured: post.featured,
          readingTime: post.readingTime,
        });
      } else {
        toast.error("Blog post not found");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
      toast.error("Failed to load blog post");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number | string[] | Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAuthorChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
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

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
  };

  const handleContentChange = (content: string) => {
    const readingTime = calculateReadingTime(content);
    setFormData((prev) => ({
      ...prev,
      content,
      readingTime,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("Please add at least one category");
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + "...",
        content: formData.content.trim().split('\n\n').map((text, index) => ({
          id: `block-${index}`,
          type: 'paragraph' as const,
          order: index,
          text: text.trim()
        })),
        featuredImage: formData.featuredImage.trim(),
        author: {
          name: formData.author.name.trim() || "Admin",
          avatar: formData.author.avatar.trim(),
          bio: formData.author.bio.trim(),
        },
        categories: formData.categories,
        tags: formData.tags,
        published: formData.published,
        featured: formData.featured,
        readingTime: formData.readingTime,
        updatedAt: new Date(),
      };

      await updateBlogPost(postId, updateData);
      toast.success("Blog post updated successfully!");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-40 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-main-red" />
              Edit Blog Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update your blog post content and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit({} as React.FormEvent)}
            disabled={saving}
            className="bg-main-red hover:bg-main-red/90"
          >
            {saving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="py-6">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 py-6">
                <InputField
                  id="title"
                  label="Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter blog post title"
                />

                <div>
                  <TextareaField
                    id="excerpt"
                    label="Excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Brief description of the blog post"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If left empty, will be generated from content
                  </p>
                </div>

                <div>
                  <TextareaField
                    id="content"
                    label="Content"
                    required
                    value={formData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={15}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Reading time: {formData.readingTime} minute{formData.readingTime !== 1 ? 's' : ''}
                  </p>
                </div>

                <InputField
                  id="featuredImage"
                  label="Featured Image URL"
                  value={formData.featuredImage}
                  onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </CardContent>
            </Card>

            {/* Categories and Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Categories & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <Label>Categories *</Label>
                  <div className="flex gap-2 mt-2">
                    <SelectField
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                      placeholder="Select a category"
                    >
                      {CATEGORIES.filter(category => !formData.categories.includes(category)).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectField>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="flex items-center gap-1">
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
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <SelectField
                      value={selectedTag}
                      onValueChange={handleTagChange}
                      placeholder="Select a tag"
                    >
                      {TAGS.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectField>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Author Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.author.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAuthorChange("name", e.target.value)}
                    placeholder="Author name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Defaults to &quot;Admin&quot; if empty
                  </p>
                </div>

                <div>
                  <Label htmlFor="authorAvatar">Author Avatar URL</Label>
                  <Input
                    id="authorAvatar"
                    value={formData.author.avatar}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAuthorChange("avatar", e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="authorBio">Author Bio</Label>
                  <Textarea
                    id="authorBio"
                    value={formData.author.bio}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAuthorChange("bio", e.target.value)}
                    placeholder="Brief author biography"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Publishing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="published">Publish immediately</Label>
                    <p className="text-sm text-gray-500">
                      Make this post visible to the public
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange("published", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Featured post</Label>
                    <p className="text-sm text-gray-500">
                      Highlight this post on the homepage
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug: {generateSlug(formData.title) || "blog-post-slug"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reading Time: {formData.readingTime} minute{formData.readingTime !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categories: {formData.categories.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags: {formData.tags.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
