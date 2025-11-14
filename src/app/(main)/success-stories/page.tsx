"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  HandCoins,
  Sparkles,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import HeroLayout from "@/components/general/hero-layout";
import { TopNav } from "@/components/navigation/top-nav";
import type { SuccessStory, Orphanage } from "@/common/types";
import { cn } from "@/lib/utils";
import { paddingStyle } from "@/common/style";
import { Skeleton } from "@/components/ui/skeleton";
import {
  mockSuccessStories,
  mockSuccessStoryStats,
  getMockOrphanageById,
} from "@/common/mock-data";
import StoriesCard from "@/components/stories/stories-card";
import { formatCurrency } from "@/common/helpers";

interface SuccessStoryWithOrphanage extends SuccessStory {
  orphanage?: Omit<
    Orphanage,
    "logoURLFile" | "coverImageFile" | "imageFiles"
  > | null;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStoryWithOrphanage[]>([]);
  const [filteredStories, setFilteredStories] = useState<
    SuccessStoryWithOrphanage[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStory, setSelectedStory] =
    useState<SuccessStoryWithOrphanage | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    totalBeneficiaries: 0,
    totalCost: 0,
    byOrphanage: {} as { [key: string]: number },
  });

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  useEffect(() => {
    // Filter stories based on search term
    if (searchTerm.trim() === "") {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.orphanageName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          story.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  }, [searchTerm, stories]);

  const fetchSuccessStories = async () => {
    try {
      setLoading(true);

      // Simulate API delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use mock data
      const fetchedStories = mockSuccessStories;
      const fetchedStats = mockSuccessStoryStats;

      // Enrich stories with orphanage details
      const storiesWithOrphanages = fetchedStories.map((story) => {
        const orphanage = getMockOrphanageById(story.orphanageId);
        return { ...story, orphanage };
      });

      setStories(storiesWithOrphanages);
      setFilteredStories(storiesWithOrphanages);
      setStats(fetchedStats);
    } catch (error) {
      console.error("Error fetching success stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <HeroLayout bgImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80">
        <TopNav />

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <p>Stories of</p>{" "}
              <span className="text-main-red">Hope & Transformation</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover how your support has changed lives and brought hope to
              orphanages across Nigeria
            </p>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 text-main-red" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {loading ? "..." : stats.total}
                </div>
                <div className="text-sm text-gray-300">Success Stories</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-main-red" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {loading ? "..." : stats.totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Lives Impacted</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-center mb-2">
                  <HandCoins className="w-8 h-8 text-main-red" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {loading
                    ? "..."
                    : formatCurrency(stats.totalCost).split(".")[0]}
                </div>
                <div className="text-sm text-gray-300">Total Impact Value</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </HeroLayout>

      {/* Search and Filter Section */}
      <div className={cn(paddingStyle, "bg-gray-50 dark:bg-gray-900")}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search success stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-6 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredStories.length}{" "}
                {filteredStories.length === 1 ? "story" : "stories"} found
              </span>
            </div>
          </div>

          {/* Stories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No stories found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back soon for inspiring success stories!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => (
                <StoriesCard
                  key={story.id}
                  story={story}
                  onClick={() => setSelectedStory(story)}
                />
              ))}
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-gradient-to-r from-main-blue to-main-blue/90 rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <Heart className="w-16 h-16 mx-auto mb-6 text-main-red" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of the Next Success Story
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Your donation can create the next transformation story. Support an
              orphanage today and make a lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="border bg-white text-main-blue hover:text-white text-lg px-8 py-6 rounded-full"
                onClick={() => (window.location.href = "/donate")}
              >
                Donate Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border text-white bg-transparent text-lg px-8 py-6 rounded-full"
                onClick={() => (window.location.href = "/volunteer")}
              >
                Volunteer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <StoryDetailModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </>
  );
}

// Story Detail Modal Component
interface StoryDetailModalProps {
  story: SuccessStoryWithOrphanage;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

function StoryDetailModal({
  story,
  onClose,
  formatCurrency,
  formatDate,
}: StoryDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    story.images?.length > 0
      ? story.images
      : story.orphanage?.images || [
          story.orphanage?.coverImageURL || "/placeholder.jpg",
        ];

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        <div className="relative h-96 bg-gray-100 dark:bg-gray-800">
          <Image
            src={images[currentImageIndex] || "/placeholder.jpg"}
            alt={story.title}
            fill
            className="object-cover"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                />
              ))}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <Badge className="bg-green-500 text-white border-0 mb-4">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed Project
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {story.title}
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{story.orphanageName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Completed {formatDate(story.completedAt)}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {story.beneficiaries}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Children Benefited
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
              <HandCoins className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatCurrency(story.cost)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Investment
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Goal Achieved
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              About This Project
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {story.description}
            </p>
          </div>

          {/* Impact */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Impact & Outcomes
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {story.impact}
              </p>
            </div>
          </div>

          {/* Orphanage Info */}
          {story.orphanage && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About {story.orphanageName}
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                {story.orphanage.logoURL && (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                      src={story.orphanage.logoURL}
                      alt={story.orphanageName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {story.orphanage.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{story.orphanage.childrenCount} children</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{story.orphanage.location}</span>
                    </div>
                    {story.orphanage.foundedYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Founded {story.orphanage.foundedYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => (window.location.href = "/donate")}
            >
              Support Another Project
              <Heart className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
