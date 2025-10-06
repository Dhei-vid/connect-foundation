"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  TrendingUp,
  Target,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
// import Awards from "@/components/impact/awards";
import AccordionComp from "@/components/general/accordion-component";

import StoriesCard from "@/components/stories/stories-card";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { heroLayoutStyle } from "@/common/style";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroLayout bgImage="https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-action-60582.jpeg">
        <TopNav />
        <section
          className={cn(
            heroLayoutStyle,
            "flex flex-col items-center justify-center max-w-6xl mx-auto"
          )}
        >
          <div className="max-w-7xl space-y-5 mx-auto text-center">
            <div className={"space-y-2"}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-[10rem] font-bold text-white/90">
                Our <span className="text-main-red/90">Impact</span>
              </h1>
              <p className="text-xl lg:text-2xl 2xl:text-3xl text-white max-w-3xl mx-auto mb-8">
                See the real difference your support makes in children&apos;s
                lives. From education to healthcare, every donation creates
                lasting positive change.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-main-red hover:bg-main-red/90 text-lg px-8 py-3"
                onClick={() => router.push("/donate")}
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Support Our Work
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 hover:bg-transparent hover:text-white"
              >
                View Success Stories
              </Button>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Impact Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Transforming{" "}
                <span className="text-main-red uppercase">Lives</span> Through
                Connection
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Since our founding, we&apos;ve facilitated connections between
                compassionate donors and orphanages in need, creating a network
                of support that spans continents and cultures.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our platform ensures transparency and accountability, allowing
                donors to see exactly how their contributions are making a
                difference in real-time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 relative">
              <Image
                className={"w-full rounded-2xl object-cover object-center"}
                src={
                  "https://images.unsplash.com/photo-1611183110451-7e156d15581d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhhcHB5JTIwYmxhY2slMjBjaGlsZHJlbnxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt={""}
                width={100}
                height={200}
              />
              <div className="grid grid-rows-2 gap-2">
                <Image
                  className={
                    "w-full h-full rounded-2xl object-cover object-center"
                  }
                  src={
                    "https://images.unsplash.com/photo-1597762117709-859f744b84c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNoYXJpdHklMjB0byUyMGNoaWxkcmVufGVufDB8fDB8fHww"
                  }
                  alt={""}
                  width={200}
                  height={200}
                />
                <Image
                  className={
                    "w-full h-full rounded-2xl object-cover object-center"
                  }
                  src={
                    "https://images.pexels.com/photos/19297742/pexels-photo-19297742.jpeg"
                  }
                  alt={""}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-main-blue dark:text-white mb-12">
            Impact by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: "50+",
                support: "Orphanages Supported",
                medium: "Across 15 countries",
              },
              {
                number: "1,500+",
                support: "Children Helped",
                medium: "Direct beneficiaries",
              },
              {
                number: "$2.5M+",
                support: "Funds Raised",
                medium: "Through our platform",
              },
              {
                number: "95%",
                support: "Efficiency Rate",
                medium: "Funds to programs",
              },
            ].map((items, index) => (
              <div
                key={index}
                className="p-3 text-center border border-main-blue/20 rounded-2xl"
              >
                <div className="text-5xl font-bold text-main-blue mb-2">
                  {items.number}
                </div>
                <p className="text-main-red dark:text-gray-300 text-lg">
                  {items.support}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {items.medium}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Hope Children's Home",
                location: "Nairobi, Kenya",
                achievement: "New school building completed",
                children: 120,
                image:
                  "https://images.unsplash.com/photo-1603998382124-c9835bf50409?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhhcHB5JTIwYmxhY2slMjBjaGlsZHJlbnxlbnwwfHwwfHx8MA%3D%3D",
                description:
                  "Built a modern school facility serving 120 children, providing quality education and a safe learning environment.",
              },
              {
                title: "Bright Future Orphanage",
                location: "Mumbai, India",
                achievement: "Medical clinic established",
                children: 85,
                image:
                  "https://images.unsplash.com/photo-1603998382124-c9835bf50409?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhhcHB5JTIwYmxhY2slMjBjaGlsZHJlbnxlbnwwfHwwfHx8MA%3D%3D",
                description:
                  "Established a fully-equipped medical clinic providing healthcare to 85 children and the local community.",
              },
              {
                title: "Sunshine House",
                location: "Lima, Peru",
                achievement: "Clean water system installed",
                children: 60,
                image:
                  "https://images.unsplash.com/photo-1603998382124-c9835bf50409?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhhcHB5JTIwYmxhY2slMjBjaGlsZHJlbnxlbnwwfHwwfHx8MA%3D%3D",
                description:
                  "Installed a clean water system ensuring safe drinking water for 60 children and staff.",
              },
            ].map((story, index) => (
              <StoriesCard key={index} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* Program Areas */}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-main-blue dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-7xl mx-auto">
          <div>
            <Image
              className="rounded-xl bg-cover bg-contain w-full h-[90%]"
              src={
                "https://images.pexels.com/photos/8432478/pexels-photo-8432478.jpeg"
              }
              alt={""}
              width={400}
              height={500}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-100 dark:text-main-blue">
              Areas of Impact
            </h2>

            <div>
              <AccordionComp
                item={[
                  {
                    trigger: {
                      label: "Education",
                      Icon: Target,
                    },
                    content: [
                      "Building schools, providing supplies, and supporting teachers to ensure every child has access to quality education.",
                      "500+ children enrolled in school",
                    ],
                  },
                  {
                    trigger: {
                      label: "Healthcare",
                      Icon: Heart,
                    },
                    content: [
                      "Establishing medical clinics, providing vaccinations, and ensuring children receive proper medical care.",
                      "200+ children in improved housing",
                    ],
                  },
                  {
                    trigger: {
                      label: "Shelter",
                      Icon: Users,
                    },
                    content: [
                      "Establishing medical clinics, providing vaccinations, and ensuring children receive proper medical care.",
                      "200+ children in improved housing",
                    ],
                  },
                  {
                    trigger: {
                      label: "Nutrition",
                      Icon: Star,
                    },
                    content: [
                      "Providing balanced meals, clean water, and nutritional support to ensure children grow up healthy.",
                      "400+ children with improved nutrition",
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Image: Financial transparency dashboard
                  </p>
                  <p className="text-sm">Placeholder for transparency report</p>
                  <p className="text-sm">Real-time donation tracking</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Transparency
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We believe in complete openness about how your donations are
                used. Our platform provides real-time updates and detailed
                reports on every project and initiative.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Real-time project updates
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Detailed financial reports
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Direct communication with orphanages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      {/* <Awards /> */}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Be Part of Our Impact Story
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of donors who are already making a difference. Your
            contribution can help us reach more children and create even greater
            impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-main-red text-lg w-[20rem]">
                <Heart size={20} className="mr-2" />
                Start Donating
              </Button>
            </Link>
            <Button
              onClick={() => router.push("/about-us")}
              variant="outline"
              size="lg"
              className="text-lg w-[20rem]"
            >
              Learn More About Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
