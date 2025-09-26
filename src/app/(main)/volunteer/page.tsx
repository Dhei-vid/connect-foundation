"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Heart,
  BookOpen,
  Stethoscope,
  Hammer,
  Camera,
  Music,
  Globe,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  UserCheck,
  Award,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { heroLayoutStyle } from "@/common/style";
import { getActiveVolunteerOpportunities } from "@/firebase/volunteer-opportunities";
import { createVolunteer } from "@/firebase/volunteers";
import { useToast } from "@/hooks/use-toast";
import type { VolunteerOpportunity } from "@/common/types";
import { Gender } from "@/common/enums";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  BookOpen,
  Stethoscope,
  Hammer,
  Camera,
  Music,
  Globe,
  Heart,
  Users,
  Target,
  Award,
};

const volunteerTestimonials = [
  {
    name: "Sarah Johnson",
    role: "Education Volunteer",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    testimonial:
      "Volunteering with Connect Foundation has been life-changing. Seeing the children's faces light up when they understand a new concept makes every moment worth it.",
    rating: 5,
    duration: "6 months",
  },
  {
    name: "Michael Chen",
    role: "Construction Volunteer",
    image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg",
    testimonial:
      "Building a new classroom with my own hands and knowing it will serve hundreds of children for years to come is incredibly rewarding.",
    rating: 5,
    duration: "1 year",
  },
  {
    name: "Emily Rodriguez",
    role: "Medical Volunteer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    testimonial:
      "The medical support I provide helps ensure these children stay healthy and can focus on their education and growth.",
    rating: 5,
    duration: "8 months",
  },
];

export default function Page() {
  const { toast } = useToast();
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<
    VolunteerOpportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>(
    []
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    location: "",
    availability: "",
    experience: "",
    motivation: "",
  });

  const loadVolunteerOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const opportunities = await getActiveVolunteerOpportunities();
      setVolunteerOpportunities(opportunities);
    } catch (error) {
      console.error("Error loading volunteer opportunities:", error);
      toast({
        title: "Error",
        description:
          "Failed to load volunteer opportunities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadVolunteerOpportunities();
  }, [loadVolunteerOpportunities]);

  const handleOpportunityToggle = (id: string) => {
    setSelectedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((opp) => opp !== id) : [...prev, id]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOpportunities.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one volunteer opportunity.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create volunteer record
      const volunteerData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: new Date(2000, 0, 1), // Default date, should be updated with actual date picker
        gender: Gender.OTHER, // Default value, should be updated with actual gender selection
        address: formData.location,
        city: formData.location.split(",")[0] || formData.location,
        state: formData.location.split(",")[1]?.trim() || "",
        country: "Nigeria", // Default country
        skills: [], // No skills field anymore
        interests: selectedOpportunities.flatMap((oppId) => {
          const opportunity = volunteerOpportunities.find(
            (opp) => opp.id === oppId
          );
          return opportunity ? [opportunity.title] : [];
        }),
        availability: formData.availability as
          | "weekdays"
          | "weekends"
          | "both"
          | "flexible",
        experience: formData.experience as
          | "none"
          | "beginner"
          | "intermediate"
          | "advanced",
        emergencyContactName: "N/A", // Default value
        emergencyContactPhone: "N/A", // Default value
        emergencyContactRelation: "Other", // Default value
        backgroundCheckCompleted: false,
      };

      await createVolunteer(volunteerData);

      toast({
        title: "Success",
        description:
          "Your volunteer application has been submitted successfully! We'll review it and get back to you soon.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        location: "",
        availability: "",
        experience: "",
        motivation: "",
      });
      setSelectedOpportunities([]);
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      toast({
        title: "Error",
        description:
          "Failed to submit volunteer application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Volunteer Opportunities
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                const Icon = opportunity.icon
                  ? iconMap[opportunity.icon]
                  : Users;
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
                        {opportunity.image ? (
                          <img
                            src={opportunity.image}
                            alt={opportunity.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              Image: {opportunity.title}
                            </p>
                            <p className="text-xs">
                              Placeholder for volunteer activity photo
                            </p>
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      {opportunity.description}
                    </p>

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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <div>
              <Card className="p-8 bg-white dark:bg-gray-900 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Join Our Volunteer Team
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your first name"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+234 805 123 4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age *
                      </label>
                      <Input
                        type="number"
                        placeholder="25"
                        min="18"
                        value={formData.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location *
                      </label>
                      <Input
                        type="text"
                        placeholder="Lagos, Nigeria"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Selected Opportunities */}
                  {selectedOpportunities.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Volunteer Opportunities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedOpportunities.map((id) => {
                          const opportunity = volunteerOpportunities.find(
                            (opp) => opp.id === id
                          );
                          return opportunity ? (
                            <Badge
                              key={id}
                              variant="default"
                              className="bg-primary text-white"
                            >
                              {opportunity.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Availability *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Weekends, Evenings, Flexible"
                      value={formData.availability}
                      onChange={(e) =>
                        handleInputChange("availability", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relevant Experience
                    </label>
                    <Textarea
                      placeholder="Tell us about your relevant experience, skills, or background..."
                      rows={3}
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Why do you want to volunteer with us? *
                    </label>
                    <Textarea
                      placeholder="Share your motivation and what you hope to contribute..."
                      rows={4}
                      value={formData.motivation}
                      onChange={(e) =>
                        handleInputChange("motivation", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="rounded mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the volunteer terms and conditions and
                        understand that this is a volunteer position.
                      </span>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="rounded mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I consent to background checks and reference
                        verification as part of the volunteer application
                        process.
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    {submitting
                      ? "Submitting..."
                      : "Submit Volunteer Application"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Image Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Volunteer With Us?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Join a community of passionate individuals making a real
                  difference in children&apos;s lives. Your skills and time can
                  create lasting impact.
                </p>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Image: Volunteers in Action</p>
                    <p className="text-sm">
                      Placeholder for volunteer team photo
                    </p>
                    <p className="text-sm">
                      Diverse group of volunteers helping children
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Make a Real Impact
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      See the direct results of your efforts in children&apos;s
                      lives and communities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Join a Supportive Community
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Connect with like-minded volunteers and build lasting
                      friendships.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Develop New Skills
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Gain valuable experience and enhance your professional
                      development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
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
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
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
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-500" />
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
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-500" />
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
