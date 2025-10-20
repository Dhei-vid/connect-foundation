"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { headerStyle } from "@/common/style";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  role: string;
  content?: string;
  rating: number;
  avatar: string;
  color: string;
  videoUrl?: string; // Optional MP4 video URL
  imageUrl?: string; // Optional image for hero-style card
};

// Source data: includes one hero-style testimonial with image
const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Monthly Donor",
    content:
      "Connect Foundation has completely changed how I think about giving. I can see exactly where my money goes and the real impact it makes. The transparency is incredible!",
    rating: 5,
    avatar: "SJ",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Joyce Abk",
    role: "Volunteer & Donor",
    content:
      "I've been donating for years, but this is the first time I feel truly connected to the children I'm helping. The real-time updates and photos make all the difference.",
    rating: 5,
    avatar: "MC",
    color: "from-blue-500 to-cyan-500",
    imageUrl:
      "https://images.pexels.com/photos/6647021/pexels-photo-6647021.jpeg", // hero image
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    name: "Maria Rodriguez",
    role: "Orphanage Director",
    content:
      "Connect Foundation has transformed how we operate. The direct connection with donors and transparent reporting has increased our funding and accountability significantly.",
    rating: 5,
    avatar: "MR",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "David Thompson",
    role: "Corporate Donor",
    content:
      "As a business, we need to ensure our charitable giving is impactful and transparent. Connect Foundation provides exactly that with detailed reporting and measurable outcomes.",
    rating: 5,
    avatar: "DT",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Lisa Wang",
    role: "First-time Donor",
    content:
      "I was hesitant to donate online, but Connect Foundation's transparency and direct communication made me feel confident. Now I'm a monthly donor!",
    rating: 5,
    avatar: "LW",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "James Wilson",
    role: "Long-term Supporter",
    // Example of a video testimonial; replace with a real MP4 URL if available
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    rating: 5,
    avatar: "JW",
    color: "from-teal-500 to-green-500",
  },
];

export function Testimonials() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>();

  const hero = useMemo(
    () => testimonials.find((t) => t.imageUrl) ?? testimonials[0],
    []
  );
  const gridTestimonials = useMemo(
    () => testimonials.filter((t) => t !== hero).slice(0, 3),
    [hero]
  );

  function openVideo(url?: string) {
    if (!url) return;
    setActiveVideoUrl(url);
    setVideoOpen(true);
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote className="w-6 h-6 text-main-red" />
            <p className="text-main-red italic font-medium">Testimonials</p>
          </div>
          <h2 className={cn(headerStyle, "text-main-blue dark:text-white")}>
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Voices that shape our mission — from the donors who give, the
            volunteers who serve, and the orphanages we support.
          </p>
        </motion.div>

        {/* Top row: stat card + hero image quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stat card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/30" />
            <div className="relative p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-6xl font-extrabold bg-clip-text text-transparent bg-main-red mb-4">
                  83%
                </div>
                <p className="text-muted-foreground text-lg max-w-md">
                  of supporters say Connect helps them give smarter, faster, and
                  more effectively.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild className="bg-main-red hover:bg-main-red/90">
                  <a href="/donate">Support Now</a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Hero image quote */}
          <div className="relative">
            <div
              className="h-full min-h-[260px] w-full rounded-3xl overflow-hidden relative"
              style={{
                backgroundImage: `url(${hero.imageUrl || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative p-6 md:p-8 h-full flex flex-col justify-end">
                <Quote className="w-8 h-8 text-white/80 mb-3" />
                <p className="text-white text-xl md:text-lg font-semibold max-w-2xl">
                  {hero.content || ""}
                </p>
                <p className="text-white/90 mt-2 text-sm">
                  {hero.name} — {hero.role}
                </p>
                {hero.videoUrl ? (
                  <div className="mt-4">
                    <Button
                      onClick={() => openVideo(hero.videoUrl)}
                      className="bg-white/90 text-gray-900 hover:bg-white"
                    >
                      <Play className="w-4 h-4 mr-2" /> Watch video
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: three quote cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridTestimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="w-6 h-6 text-muted-foreground/50" />
                  <p className="mt-3 text-muted-foreground italic leading-relaxed">
                    {t.content}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={`bg-main-blue text-white`}>
                          {t.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                    </div>
                    {t.videoUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openVideo(t.videoUrl)}
                      >
                        <Play className="w-4 h-4 mr-2" /> Watch video
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Video dialog */}
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Testimonial Video</DialogTitle>
            </DialogHeader>
            {activeVideoUrl ? (
              <div className="rounded-lg overflow-hidden">
                <video className="w-full h-auto" controls autoPlay>
                  <source src={activeVideoUrl} type="video/mp4" />
                </video>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
