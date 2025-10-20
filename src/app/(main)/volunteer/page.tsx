"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Heart,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  Award,
  Target,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { heroLayoutStyle } from "@/common/style";
import { getActiveVolunteerOpportunities } from "@/firebase/volunteer-opportunities";
import type { VolunteerOpportunity } from "@/common/types";
import { volunteerTestimonials } from "@/common/data";
import VolunteerRegistrationForm from "@/components/volunteers/registration-form";
import Image from "next/image";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

export default function Page() {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<
    VolunteerOpportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>(
    []
  );

  const loadVolunteerOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const opportunities = await getActiveVolunteerOpportunities();
      setVolunteerOpportunities(opportunities);
    } catch (error) {
      console.error("Error loading volunteer opportunities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVolunteerOpportunities();
  }, [loadVolunteerOpportunities]);

  const handleOpportunityToggle = (id: string) => {
    setSelectedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((opp) => opp !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      <HeroLayout bgImage="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg">
        <TopNav />
        <section
          className={cn(
            heroLayoutStyle,
            "flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
          )}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Become a <span className="text-main-red">Volunteer</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Join our community of dedicated volunteers making a real
              difference in children&apos;s lives. Your time, skills, and
              compassion can change the world, one child at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-main-red text-white"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Volunteering
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Volunteer Opportunities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={"text-center text-gray-900 dark:text-white mb-12"}>
            <h2 className="text-3xl font-bold">Volunteer Opportunities</h2>
            <p className="font-light text-sm lg:text-base 2xl:text-lg">
              Select interested volunteer Opportunity. Please note only
              available in Abuja.
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-12 w-12" />
            </div>
          ) : volunteerOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No volunteer opportunities available at the moment. Please check
                back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {volunteerOpportunities.map((opportunity) => {
                const isSelected = selectedOpportunities.includes(
                  opportunity.id
                );

                return (
                  <Card
                    key={opportunity.id}
                    className={cn(
                      "p-6 cursor-pointer transition-all duration-300 hover:shadow-lg",
                      isSelected
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:shadow-md"
                    )}
                    onClick={() => handleOpportunityToggle(opportunity.id)}
                  >
                    <div className="relative mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                        <Image
                          src={
                            opportunity?.image ||
                            "https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg"
                          }
                          alt={opportunity.title || "Volunteer Opportunity"}
                          width={400}
                          height={192}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg 2xl:text-2xl font-bold text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        {opportunity.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {opportunity.timeCommitment}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {opportunity.location}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Volunteer Registration Form - Only show when there are active opportunities */}
      {volunteerOpportunities.length > 0 && (
        <VolunteerRegistrationForm
          selectedOpportunities={selectedOpportunities}
          volunteerOpportunities={volunteerOpportunities}
        />
      )}

      {/* Volunteer Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Volunteers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {volunteerTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <p className="text-xs">Photo</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  {testimonial.testimonial}
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {testimonial.role} • {testimonial.duration}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Volunteering */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Benefits of Volunteering
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-main-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-main-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Make a Difference
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Directly impact children&apos;s lives and contribute to
                meaningful change in your community.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-main-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white/90" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Build Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with like-minded individuals and become part of a
                supportive volunteer community.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-main-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white/90" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Gain Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Develop new skills, gain valuable experience, and enhance your
                professional profile.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-main-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-main-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Flexible Commitment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose opportunities that fit your schedule and interests, with
                flexible time commitments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
