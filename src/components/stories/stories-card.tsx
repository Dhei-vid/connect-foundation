"use client";

import { FC } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface IStoriesCard {
  title: string;
  location: string;
  achievement: string;
  children: number;
  image: string;
  description: string;
}

const StoriesCard: FC<IStoriesCard> = ({
  title,
  location,
  achievement,
  children,
  image,
  description,
}) => {
  const router = useRouter();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Image
        className="w-full object-cover object-center"
        src={image}
        alt={title}
        width={300}
        height={150}
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{location}</p>
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            {achievement}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {children} children helped
          </span>
          <Button onClick={() => router.push("")} variant="outline" size="sm">
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StoriesCard;
