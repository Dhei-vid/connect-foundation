"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TopNav } from "@/components/navigation/top-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/blog/blog-card";
import {
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Tag,
} from "lucide-react";
import {
  getBlogPostBySlug,
  getAllBlogPosts,
  incrementBlogPostViews,
  incrementBlogPostLikes,
} from "@/firebase/blog";
import type { BlogPost } from "@/common/types";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadBlogPost(params.id as string);
    }
  }, [params?.id]);

  const loadBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      const [blogPost, allPosts] = await Promise.all([
        getBlogPostBySlug(slug),
        getAllBlogPosts(10),
      ]);

      if (blogPost) {
        setPost(blogPost);

        // Increment views
        await incrementBlogPostViews(blogPost.id);

        // Find related posts (same categories)
        const related = allPosts
          .filter(
            (p) =>
              p.id !== blogPost.id &&
              p.categories.some((cat) => blogPost.categories.includes(cat))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;

    try {
      await incrementBlogPostLikes(post.id);
      setLiked(true);
      setPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Skeleton className="h-64 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Link href="/blog">
              <Button className="bg-main-red hover:bg-main-red/90">
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt ? formatDate(new Date(post.publishedAt)) : 'Not published'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-main-red hover:text-white transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="outline"
                      onClick={handleLike}
                      disabled={liked}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          liked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {post.likes} {liked ? "Liked" : "Like"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Author Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-main-red rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {post.author.name}
                      </h4>
                    </div>
                  </div>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.author.bio}
                    </p>
                  )}
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Related Posts
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <BlogCard
                          key={relatedPost.id}
                          post={relatedPost}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
