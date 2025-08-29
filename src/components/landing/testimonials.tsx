"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
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
    name: "Michael Chen",
    role: "Volunteer & Donor",
    content:
      "I've been donating for years, but this is the first time I feel truly connected to the children I'm helping. The real-time updates and photos make all the difference.",
    rating: 5,
    avatar: "MC",
    color: "from-blue-500 to-cyan-500",
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
    content:
      "I've supported various charities for decades, but Connect Foundation's approach is revolutionary. The ability to track impact in real-time is game-changing.",
    rating: 5,
    avatar: "JW",
    color: "from-teal-500 to-green-500",
  },
];

export function Testimonials() {
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from donors, volunteers, and orphanage directors about their
            experiences with Connect Foundation.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full glass hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${testimonial.color} p-4 flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {testimonial.avatar}
                    </div>
                    <Quote className="w-8 h-8 text-muted-foreground/30" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <CardTitle className="text-lg font-semibold">
                    {testimonial.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground leading-relaxed italic">
                    {testimonial.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Donor Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">$2.5M+</div>
            <div className="text-muted-foreground">Total Donations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">15,000+</div>
            <div className="text-muted-foreground">Lives Impacted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
            <div className="text-muted-foreground">Funds to Programs</div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-muted-foreground mb-6">
              Be part of the change. Start making a difference today with
              transparent, accountable giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Start Donating
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
              >
                Create Account
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
