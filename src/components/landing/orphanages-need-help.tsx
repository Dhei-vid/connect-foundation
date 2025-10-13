"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { headerStyle, paddingStyle, categoryColors } from "@/common/style";
import { Skeleton } from "@/components/ui/skeleton";
import { mockOrphanages } from "@/common/mock-data";
import type { Orphanage } from "@/common/types";
import { formatCurrency } from "@/common/helpers";

// Mock issues data for orphanages
const mockOrphanageIssues = [
  {
    orphanageId: "1",
    title: "Emergency Medical Equipment Needed",
    category: "medical" as const,
    priority: "urgent" as const,
    estimatedCost: 1500000,
    raisedAmount: 450000,
    description: "Urgent need for medical equipment to treat sick children.",
  },
  {
    orphanageId: "2",
    title: "Roof Repair and Maintenance",
    category: "shelter" as const,
    priority: "high" as const,
    estimatedCost: 2000000,
    raisedAmount: 800000,
    description: "The building roof is leaking and needs immediate repair.",
  },
  {
    orphanageId: "3",
    title: "Food Supply for 3 Months",
    category: "food" as const,
    priority: "urgent" as const,
    estimatedCost: 900000,
    raisedAmount: 300000,
    description: "Running low on food supplies for the children.",
  },
  {
    orphanageId: "4",
    title: "School Supplies and Books",
    category: "education" as const,
    priority: "medium" as const,
    estimatedCost: 500000,
    raisedAmount: 250000,
    description: "Need educational materials for the new school term.",
  },
];

interface OrphanageWithIssue extends Orphanage {
  currentIssue: {
    title: string;
    category:
      | "medical"
      | "education"
      | "food"
      | "shelter"
      | "clothing"
      | "other";
    priority: "low" | "medium" | "high" | "urgent";
    estimatedCost: number;
    raisedAmount: number;
    description: string;
    percentageRaised: number;
  };
}

export function OrphanagesNeedHelpSection() {
  const router = useRouter();
  const [orphanages, setOrphanages] = useState<OrphanageWithIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrphanagesWithNeeds();
  }, []);

  const fetchOrphanagesWithNeeds = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Combine orphanages with their issues
      const orphanagesWithIssues = mockOrphanages
        .map((orphanage) => {
          const issue = mockOrphanageIssues.find(
            (i) => i.orphanageId === orphanage.id
          );
          if (!issue) return null;

          return {
            ...orphanage,
            currentIssue: {
              ...issue,
              percentageRaised: Math.round(
                (issue.raisedAmount / issue.estimatedCost) * 100
              ),
            },
          };
        })
        .filter((o): o is OrphanageWithIssue => o !== null);

      setOrphanages(orphanagesWithIssues);
    } catch (error) {
      console.error("Error fetching orphanages:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <section className={cn(paddingStyle, "bg-gray-50 dark:bg-gray-900")}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-main-red" />
            <p className="text-main-red italic font-medium">Urgent Needs</p>
          </div>
          <h2
            className={cn(headerStyle, "text-main-blue dark:text-white mb-4")}
          >
            Orphanages That Need Your Help
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            These orphanages have urgent needs. Your donation can make an
            immediate difference in the lives of children.
          </p>
        </div>

        {/* Orphanage Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : orphanages.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Urgent Needs at the Moment
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All orphanages are currently well-supported. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {orphanages.map((orphanage) => (
                <Card
                  key={orphanage.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push("/donate")}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={orphanage.coverImageURL || "/placeholder.jpg"}
                      alt={orphanage.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Priority Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={cn(
                          getPriorityColor(orphanage.currentIssue.priority),
                          "border-0 shadow-lg"
                        )}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {orphanage.currentIssue.priority.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Children Count */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 rounded-full px-3 py-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-gray-900">
                        {orphanage.childrenCount} children
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="font-medium">{orphanage.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {orphanage.name}
                    </h3>

                    {/* Category Badge */}
                    <Badge
                      className={cn(
                        categoryColors[orphanage.currentIssue.category],
                        "mb-3 text-xs"
                      )}
                    >
                      {orphanage.currentIssue.category}
                    </Badge>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                      {orphanage.currentIssue.title}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {orphanage.currentIssue.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-bold text-main-blue dark:text-blue-400">
                          {orphanage.currentIssue.percentageRaised}%
                        </span>
                      </div>
                      <Progress
                        value={orphanage.currentIssue.percentageRaised}
                        className="h-2"
                      />
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatCurrency(orphanage.currentIssue.raisedAmount)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                          {formatCurrency(orphanage.currentIssue.estimatedCost)}
                        </span>
                      </div>
                    </div>

                    {/* Donate Button */}
                    <Button
                      className="w-full bg-main-red hover:bg-main-red/90 text-white group-hover:shadow-lg transition-all"
                      size="sm"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => router.push("/donate")}
                className="bg-main-blue hover:bg-main-blue/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View All Needs & Donate
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
