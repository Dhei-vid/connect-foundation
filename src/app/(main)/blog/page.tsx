"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Grid, List } from "lucide-react";
import { getAllBlogPosts, getFeaturedBlogPosts, searchBlogPosts } from "@/firebase/blog";
import type { BlogPost } from "@/common/types";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", "Impact", "Stories", "Updates", "Volunteer", "Education", "Health"];

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const [allPosts, featured] = await Promise.all([
        getAllBlogPosts(),
        getFeaturedBlogPosts()
      ]);
      setPosts(allPosts);
      setFeaturedPosts(featured);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadBlogPosts();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchBlogPosts(searchTerm);
      setPosts(searchResults);
    } catch (error) {
      console.error("Error searching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      loadBlogPosts();
    } else {
      // Filter posts by category
      const filtered = posts.filter(post => 
        post.categories.includes(category.toLowerCase())
      );
      setPosts(filtered);
    }
  };

  const filteredPosts = selectedCategory && selectedCategory !== "All" 
    ? posts.filter(post => post.categories.includes(selectedCategory.toLowerCase()))
    : posts;

  return (
    <>
      <HeroLayout bgImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0">
        <TopNav />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stories of hope, impact, and transformation from our community
          </p>
        </div>
      </HeroLayout>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} variant="featured" />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex flex-1 gap-4 w-full lg:max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="bg-main-red hover:bg-main-red/90">
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-main-red hover:text-white transition-colors"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredPosts.length} posts found
            </p>
          </div>

          {loading ? (
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  variant={viewMode === "list" ? "compact" : "default"} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? "Try adjusting your search terms" : "No blog posts available at the moment"}
              </p>
              {searchTerm && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    loadBlogPosts();
                  }}
                  variant="outline"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </section>
    </div>
    </>
  );
}
