"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Heart,
  Eye,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse verified orphanages and their specific needs from around the world.",
    color: "from-blue-500 to-cyan-500",
    details: [
      "View orphanage profiles and stories",
      "See detailed needs and costs",
      "Filter by location, cause, or urgency",
    ],
  },
  {
    icon: Heart,
    title: "Donate",
    description:
      "Choose how much to give and where it goes, with complete transparency.",
    color: "from-pink-500 to-rose-500",
    details: [
      "Set your donation amount",
      "Choose specific projects or general support",
      "Add personal messages of encouragement",
    ],
  },
  {
    icon: Eye,
    title: "Track",
    description:
      "Follow your donation's journey and see real-time updates on impact.",
    color: "from-green-500 to-emerald-500",
    details: [
      "Real-time progress updates",
      "Photo and video documentation",
      "Impact metrics and success stories",
    ],
  },
  {
    icon: Users,
    title: "Connect",
    description:
      "Build lasting relationships with orphanages and other donors.",
    color: "from-purple-500 to-violet-500",
    details: [
      "Direct communication channels",
      "Volunteer opportunities",
      "Community events and updates",
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30" />

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
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our simple, transparent process ensures your donations make the
            maximum impact while keeping you connected to the children
            you&apos;re helping.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {index + 1}
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                  <ArrowRight className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              <Card className="h-full glass hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${step.color} p-5 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Details */}
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-left">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of donors and start making a real difference in
              children&apos;s lives today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Have Questions?
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
