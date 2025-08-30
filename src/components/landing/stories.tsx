import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { headerStyle } from "@/common/style";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const StoriesSection = () => {
  return (
    <div className="space-y-8 bg-gray-50 py-20 px-5 lg:px-8 2xl:px-12">
      {/* Header */}
      <div className="w-full items-center justify-center flex flex-col gap-3">
        <div className={"flex flex-row items-center gap-2"}>
          <Heart size={18} className="text-main-red" />
          <p className="text-main-red italic">Spotlight Stories</p>
        </div>
        <p className={cn(headerStyle, "text-main-blue")}>
          Foundations in need of Support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            title: "Revitalizing Education Through Technology",
            description:
              "A youth group in Kenya reconnects with learning through digital education programs.",
            progress: 75,
            progressLabel: "Digital Literacy Progress",
            image: "Children using tablets for learning",
          },
          {
            title: "Healing Circles in South Africa",
            description:
              "Community-led healing circles bring together families to share traditions and support mental well-being.",
            progress: 80,
            progressLabel: "Community Healing Engagement",
            image: "People sitting in healing circle",
          },
          {
            title: "Cultural Food Project in India",
            description:
              "Families plant ancestral seeds, promoting food sovereignty through community gardens.",
            progress: 80,
            progressLabel: "Cultural Garden Completion",
            image: "Hands working with seeds and plants",
          },
          {
            title: "Music and Arts Revival",
            description:
              "A women-led program revives traditional songs and strengthens bonds across generations.",
            progress: 75,
            progressLabel: "Tradition Revival Through Music",
            image: "Women in traditional ceremony",
          },
        ].map((story, index) => (
          <div className="relative" key={index}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Progress Badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-main-blue p-2 px-4">
                  {story.progress}%
                </Badge>
              </div>

              <div className="h-full grid grid-cols-2">
                {/* Image */}
                <Image
                  className={"w-full h-full object-cover object-contain"}
                  src={
                    "https://images.pexels.com/photos/9823013/pexels-photo-9823013.jpeg"
                  }
                  alt={""}
                  width={700}
                  height={500}
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {story.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-main-blue font-semibold dark:text-gray-400">
                        {story.progressLabel}
                      </span>
                      <span className="text-main-blue dark:text-grey font-medium">
                        {story.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-main-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${story.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button className="w-full bg-main-blue hover:bg-main-blue/90 text-white">
                    Donate Now &gt;
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
