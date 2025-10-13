"use client";

import { FC } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { SuccessStory } from "@/common/types";
import { formatCurrency } from "@/common/helpers";

interface IStoriesCard {
  story: SuccessStory;
  onClick?: () => void;
}

const StoriesCard: FC<IStoriesCard> = ({ story, onClick }) => {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const mainImage = story.images?.[0] || "/placeholder.jpg";

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/success-stories#${story.id}`);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={mainImage}
          alt={story.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500 text-white border-0 shadow-lg">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        </div>

        {/* Beneficiaries Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 rounded-full px-3 py-2">
          <Users className="w-4 h-4 text-main-red" />
          <span className="text-sm font-semibold text-main-blue dark:text-white">
            {story.beneficiaries} children
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-main-red transition-colors">
          {story.title}
        </h3>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{story.orphanageName}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {story.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Impact Value
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {formatCurrency(story.cost)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Completed {formatDate(story.completedAt)}</span>
          </div>
        </div>

        <Button
          onClick={handleClick}
          className="w-full text-white group-hover:shadow-lg transition-all"
        >
          Read Full Story
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

export default StoriesCard;
