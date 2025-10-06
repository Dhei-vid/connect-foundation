"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Gender } from "@/common/enums";
import { VolunteerOpportunity } from "@/common/types";
import { createVolunteer } from "@/firebase/volunteers";
import { InputField, TextareaField } from "../ui/form-field";
import { UserCheck, Heart, Users, Award, Siren } from "lucide-react";

interface VolunteerRegistrationFormProps {
  selectedOpportunities: string[];
  volunteerOpportunities: VolunteerOpportunity[];
}

const VolunteerRegistrationForm = ({
  selectedOpportunities,
  volunteerOpportunities,
}: VolunteerRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    age: "",
    location: "",
    availability: "",
    experience: "",
    motivation: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("start");

    if (selectedOpportunities.length === 0) {
      return;
    }

    startTransition(async () => {
      try {
        // Create volunteer record
        const volunteerData = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age, 10),
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

        toast.success("Volunteer application submitted successfully!");

        // Reset form
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          age: "",
          location: "",
          availability: "",
          experience: "",
          motivation: "",
        });
      } catch (error) {
        console.error("Error submitting volunteer application:", error);
        toast.error(
          "Failed to submit volunteer application. Please try again."
        );
      }
    });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 items-start">
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
                    <InputField
                      type="text"
                      label={"First Name"}
                      name={"firstname"}
                      placeholder="Your first name"
                      value={formData.firstname}
                      onChange={(e) =>
                        handleInputChange("firstname", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label={"Last Name"}
                      name={"lastname"}
                      placeholder="Your last name"
                      value={formData.lastname}
                      onChange={(e) =>
                        handleInputChange("lastname", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label="Email Address"
                      name="email"
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
                    <InputField
                      label={"Phone Number"}
                      name={"phone"}
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
                    <InputField
                      label={"Age"}
                      name={"age"}
                      type="number"
                      placeholder="25"
                      min="18"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <InputField
                      label="Location"
                      name="location"
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
                  <InputField
                    label="Availability"
                    name="availability"
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
                  <TextareaField
                    label="Relevant Experience"
                    name="experience"
                    placeholder="Tell us about your relevant experience, skills, or background..."
                    rows={3}
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                  />
                </div>

                <div>
                  <TextareaField
                    label="Why do you want to volunteer with us?"
                    name="motivation"
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
                    <input type="checkbox" className="rounded mt-1" required />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the volunteer terms and conditions and
                      understand that this is a volunteer position.
                    </span>
                  </label>
                  <label className="flex items-start space-x-2">
                    <input type="checkbox" className="rounded mt-1" required />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I consent to background checks and reference verification
                      as part of the volunteer application process.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  {isPending ? "Submitting..." : "Submit Volunteer Application"}
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
              <div className={"space-y-2"}>
                <div>
                  <Image
                    src={
                      "https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg"
                    }
                    alt={"volunteers image"}
                    width={400}
                    height={200}
                    className={
                      "w-full lg:h-[15rem] 2xl:h-[18rem] object-cover object-center rounded-2xl shadow-sm"
                    }
                  />
                </div>
                <div className={"grid grid-cols-2 gap-2"}>
                  <div
                    className={
                      "flex flex-col justify-between rounded-2xl bg-main-red p-4"
                    }
                  >
                    <div
                      className={"p-2 rounded-full border-1 border-gray-300"}
                    >
                      <Siren className={"text-white"} />
                    </div>
                    <div className="self-baseline">
                      <p className={"text-white font-bold 2xl:text-6xl"}>
                        1 in 8
                      </p>
                      <p className={"text-white"}>
                        Children is living on the streets in Nigeria.
                      </p>
                    </div>
                  </div>
                  <div>
                    <Image
                      src={"/volunteering_group.jpg"}
                      alt={"volunteers image"}
                      width={400}
                      height={200}
                      className={
                        "w-full object-cover object-center rounded-2xl"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-main-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-main-blue" />
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
                <div className="w-8 h-8 bg-main-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white/90" />
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
                <div className="w-8 h-8 bg-main-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-main-blue" />
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
  );
};

export default VolunteerRegistrationForm;
