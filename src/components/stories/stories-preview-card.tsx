"use client";

import { FC } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import type { SuccessStory } from "@/common/types";
import { useRouter } from "next/navigation";

interface StoriesPreviewCardProps {
  story: SuccessStory;
  index?: number;
}

const StoriesPreviewCard: FC<StoriesPreviewCardProps> = ({ story, index = 0 }) => {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(new Date(date));
  };

  const mainImage = story.images?.[0] || "/placeholder.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={mainImage}
          alt={story.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Completion Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-500 text-white border-0 shadow-lg">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-800 border-0 shadow-lg">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(story.completedAt)}
          </Badge>
        </div>

        {/* Beneficiaries on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 rounded-full px-3 py-1.5">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-gray-900">
            {story.beneficiaries} children
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="font-medium">{story.orphanageName}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {story.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {story.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>Impact Value:</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {formatCurrency(story.cost)}
          </span>
        </div>

        <Button
          onClick={() => router.push(`/success-stories`)}
          size="sm"
          variant="outline"
          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
        >
          View Story
          <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

export default StoriesPreviewCard;
