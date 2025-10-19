"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, Heart, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/common/types";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="block">
        <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {post.featuredImage && (
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt ? formatDate(new Date(post.publishedAt)) : 'Not published'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="block">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
          <div className="relative h-64">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-main-red/20 to-main-blue/20 flex items-center justify-center">
                <div className="text-4xl text-gray-400">📝</div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-main-red text-white">Featured</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.slice(0, 2).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author.name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.publishedAt ? formatDate(new Date(post.publishedAt)) : 'Not published'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
        <div className="relative h-48">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-main-red/20 to-main-blue/20 flex items-center justify-center">
              <div className="text-3xl text-gray-400">📝</div>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.publishedAt ? formatDate(new Date(post.publishedAt)) : 'Not published'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {post.likes}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
