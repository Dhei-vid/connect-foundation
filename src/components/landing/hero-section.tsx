"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-15 2xl:pt-35">
      {/* Content */}
      <div className="z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl 2xl:text-8xl font-bold mb-6">
            <span className="text-grey">Connect</span>
            <br />
            <span className="text-grey">Orphanage Foundation</span>
          </h1>
          <p className="text-xl md:text-2xl text-grey/70 max-w-3xl mx-auto leading-relaxed">
            Nurturing Orphans with love and dignity.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/donate">
            <Button
              size="lg"
              className="group rounded-full bg-main-red hover:bg-main-blue/70 overflow-hidden"
            >
              <span className="relative z-10">Start Donating</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about-us">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full hover:bg-white/80 hover:text-main-blue transition-all duration-300"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
