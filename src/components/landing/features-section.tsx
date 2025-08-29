"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Shield,
  Globe,
  Users,
  BarChart3,
  MessageCircle,
  Eye,
  HandHeart,
} from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Direct Impact",
    description:
      "See exactly how your donations help children in need with real-time updates and progress tracking.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Complete financial transparency with detailed breakdowns of how every dollar is spent.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with orphanages worldwide and make a difference across different cultures and communities.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Join a network of donors and volunteers working together to create lasting change.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track the impact of your contributions with comprehensive reporting and success metrics.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description:
      "Connect directly with orphanages to understand their needs and see your impact firsthand.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Eye,
    title: "Accountability",
    description:
      "Every donation is tracked and verified, ensuring your money goes exactly where it's needed.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: HandHeart,
    title: "Sustainable Support",
    description:
      "Long-term partnerships that create lasting change rather than temporary relief.",
    color: "from-red-500 to-pink-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Connect Foundation</span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re revolutionizing how orphanages and donors connect,
            ensuring transparency, accountability, and maximum impact for every
            contribution.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full glass hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of donors who are already changing lives through
              transparent, accountable giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Start Donating Today
              </a>
              <a
                href="/impact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
              >
                See Our Impact
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
