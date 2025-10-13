"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Heart, ArrowRight } from "lucide-react";
import { headerStyle } from "@/common/style";
import { cn } from "@/lib/utils";
import { paddingStyle } from "@/common/style";
import { useEffect, useState } from "react";
import type { SuccessStory } from "@/common/types";
import StoriesCard from "../stories/stories-card";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { getMockSuccessStories } from "@/common/mock-data";

export const StoriesSection = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Fetch only the latest 3 success stories for the homepage using mock data
      const fetchedStories = getMockSuccessStories({ limitCount: 3 });
      setStories(fetchedStories);
    } catch (error) {
      console.error("Error fetching success stories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(paddingStyle, "space-y-8 bg-gray-50 dark:bg-gray-900")}>
      {/* Header */}
      <div className="w-full items-center justify-center flex flex-col gap-3">
        <div className={"flex flex-row items-center gap-2"}>
          <Heart size={18} className="text-main-red" />
          <p className="text-main-red italic">Success Stories</p>
        </div>
        <p className={cn(headerStyle, "text-main-blue dark:text-white text-center")}>
          Stories of Hope & Transformation
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
          Discover how your support has changed lives and brought hope to orphanages across Nigeria
        </p>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      ) : stories.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Success Stories Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We're working on documenting the amazing impact of your support
          </p>
          <Button
            onClick={() => router.push("/donate")}
            className="bg-main-blue hover:bg-main-blue/90 text-white"
          >
            Make a Donation
            <Heart className="ml-2 w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StoriesCard key={story.id} story={story} />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => router.push("/success-stories")}
              size="lg"
              className="bg-main-blue hover:bg-main-blue/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              View All Success Stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
