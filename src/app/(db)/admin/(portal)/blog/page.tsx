"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { BlogPost } from "@/common/types";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import {
  getAllBlogPosts,
  deleteBlogPost,
  updateBlogPost,
} from "@/firebase/blog";

export default function AdminBlogPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [filterFeatured, setFilterFeatured] = useState<
    "all" | "featured" | "regular"
  >("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts from Firebase
  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getAllBlogPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setError("Failed to load blog posts");
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (
    postId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateBlogPost(postId, { published: !currentStatus });
      toast.success(
        `Post ${!currentStatus ? "published" : "unpublished"} successfully`
      );
      await loadBlogPosts(); // Reload the list
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    }
  };

  const handleToggleFeatured = async (
    postId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateBlogPost(postId, { featured: !currentStatus });
      toast.success(
        `Post ${!currentStatus ? "featured" : "unfeatured"} successfully`
      );
      await loadBlogPosts(); // Reload the list
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteBlogPost(postId);
      toast.success("Blog post deleted successfully");
      await loadBlogPosts(); // Reload the list
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.categories.some((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && post.published) ||
      (filterStatus === "draft" && !post.published);

    const matchesFeatured =
      filterFeatured === "all" ||
      (filterFeatured === "featured" && post.featured) ||
      (filterFeatured === "regular" && !post.featured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex gap-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Blog Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage blog posts, create content, and track engagement
          </p>
        </div>
        <Button onClick={() => router.push("/admin/blog/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="text-2xl font-bold text-main-blue dark:text-white">
                  {posts.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {posts.filter((p) => p.published).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Featured
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {posts.filter((p) => p.featured).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {posts.reduce((sum, post) => sum + post.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search posts by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <SelectField
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as "all" | "published" | "draft")
                }
                placeholder="Status"
              >
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectField>
              <SelectField
                value={filterFeatured}
                onValueChange={(value) =>
                  setFilterFeatured(value as "all" | "featured" | "regular")
                }
                placeholder="Featured"
              >
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Post Image */}
                  <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={192}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt
                          ? formatDate(new Date(post.publishedAt))
                          : "Not published"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views} views
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {post.categories.slice(0, 3).map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {post.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.categories.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/blog/${post.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleTogglePublished(post.id, post.published)
                        }
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleFeatured(post.id, post.featured)
                        }
                      >
                        {post.featured ? "Unfeature" : "Feature"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ||
                filterStatus !== "all" ||
                filterFeatured !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first blog post"}
              </p>
              <Button onClick={() => router.push("/admin/blog/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
