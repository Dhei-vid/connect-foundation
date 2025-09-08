"use client";

import React from "react";
// import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function VolunteerSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Volunteer Opportunities Section */}
        <div className="mb-20">
          {/* Section Header */}

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-main-red" />
                  <span className="text-sm font-medium text-main-red italic">
                    Volunteer Opportunities
                  </span>
                </div>
                <h2 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Give Time, Change Lives
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  Join our community of volunteers and make a direct impact in
                  children&apos;s lives.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Connect Foundation is a global platform that bridges the gap
                  between orphanages in need and compassionate volunteers
                  worldwide. We support education, healthcare, cultural
                  programs, and community development across generations.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our vision, shaped by community leaders and child welfare
                  experts, focuses on healing, growth, and sustaining the future
                  of children across the globe through meaningful volunteer
                  engagement.
                </p>
              </div>

              {/* Legacy Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      A Legacy of Global Impact
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Supporting education, healing, and cultural programs
                      across generations and continents.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-main-blue rounded-full"
              >
                Learn More &gt;
              </Button>
            </div>

            {/* Right Images */}
            <div className="relative">
              {/* Top Right Image */}
              <div className="relative mb-6">
                <div className="w-full h-74 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    className={
                      "rounded-[2rem] w-full object-cover object-center"
                    }
                    src={
                      "https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg"
                    }
                    alt={"volunteer"}
                    width={500}
                    height={500}
                  />
                </div>
              </div>

              {/* Bottom Left Image with Overlay */}
              <div className="relative">
                <div className="w-full h-74 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    className={
                      "rounded-[2rem] w-full object-cover object-center"
                    }
                    src={
                      "https://images.pexels.com/photos/5029919/pexels-photo-5029919.jpeg"
                    }
                    alt={"helping hands"}
                    width={500}
                    height={500}
                  />
                </div>

                {/* Overlay Box */}
                <div className="absolute bottom-4 left-4 bg-main-blue text-white rounded-xl p-4 max-w-xs">
                  <p className="font-semibold text-lg mb-2">
                    150+ Projects Completed
                  </p>
                  <Link
                    href="/impact"
                    className="text-green-100 hover:text-white underline text-sm"
                  >
                    Learn & Donate
                  </Link>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}









