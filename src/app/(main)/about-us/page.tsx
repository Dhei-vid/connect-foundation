import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Shield, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Matching home page pattern */}
      <HeroLayout bgImage="https://images.pexels.com/photos/18267265/pexels-photo-18267265.jpeg">
        <TopNav />
        <section className="relative flex items-center justify-center overflow-hidden pt-15 2xl:pt-35">
          <div className="z-10 text-center px-4 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl 2xl:text-8xl font-bold mb-6">
              <span className="text-main-red">About</span>
              <br />
              <span className="text-grey">Connect Foundation</span>
            </h1>
            <p className="text-base md:text-lg 2xl:text-xl text-grey/70 max-w-3xl mx-auto leading-relaxed mb-8">
              We&apos;re on a mission to bridge the gap between orphanages in
              need and compassionate donors worldwide, creating lasting impact
              in children&apos;s lives through transparency and connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3 group rounded-full bg-main-red hover:bg-main-blue/70 overflow-hidden"
                >
                  <span className="relative z-10">Make a Difference</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 rounded-full hover:bg-white/80 hover:text-main-blue transition-all duration-300"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Mission & Vision - Using home page section pattern */}
      <section className="py-30 2xl:py-40 px-4">
        <div className="z-10 w-full lg:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-5 2xl:gap-10">
            {/* Left Content */}
            <div className="space-y-5">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={18} className="text-main-red" />
                  <span className="text-sm font-medium text-main-red italic">
                    Our Mission
                  </span>
                </div>
                <h2 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Bridging Orphanages and Donors
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  To provide orphanages with a platform to share their needs and
                  connect with donors who want to make a real difference.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  We believe every child deserves access to basic necessities,
                  education, and care. Our platform ensures transparency and
                  accountability, allowing donors to see exactly how their
                  contributions are making a difference in real-time.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  A world where no orphanage struggles alone, and every donor
                  can see the direct impact of their generosity through
                  transparent, accountable giving.
                </p>
              </div>

              {/* Legacy Section - Matching home page pattern */}
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

            {/* Right Images - Matching home page image pattern */}
            <div className="relative">
              {/* Top Right Image */}
              <div className="relative mb-6">
                <Image
                  className="rounded-[2rem] w-full h-full object-cover object-center"
                  src="https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg"
                  alt="Team collaboration"
                  width={500}
                  height={500}
                />
              </div>

              {/* Bottom Left Image with Overlay */}
              <div className="relative">
                <div className="w-full h-74 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <Image
                    className="rounded-[2rem] w-full object-cover object-center"
                    src="https://images.pexels.com/photos/5029919/pexels-photo-5029919.jpeg"
                    alt="Children learning"
                    width={500}
                    height={500}
                  />
                </div>

                {/* Overlay Box - Matching home page pattern */}
                <div className="absolute bottom-4 left-4 bg-main-blue text-white rounded-xl p-4 max-w-xs">
                  <p className="font-semibold text-lg mb-2">
                    50+ Orphanages Supported
                  </p>
                  <Link
                    href="/impact"
                    className="text-green-100 hover:text-white underline text-sm"
                  >
                    Learn & Donate
                  </Link>
                </div>
              </div>

              {/* Decorative Element - Matching home page */}
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Using home page card pattern */}
      <div className="space-y-8 bg-gray-50 py-20 px-5 lg:px-8 2xl:px-12">
        {/* Header - Matching home page pattern */}
        <div className="w-full items-center justify-center flex flex-col gap-3">
          <div className="flex flex-row items-center gap-2">
            <Heart size={18} className="text-main-red" />
            <p className="text-main-red italic">Core Values</p>
          </div>
          <p className="text-2xl lg:text-4xl 2xl:text-6xl font-bold mb-3 line-clamp-2 text-main-blue">
            What Drives Our Mission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Compassion",
              description:
                "We approach every interaction with empathy and understanding, recognizing the unique challenges each orphanage faces.",
              icon: Heart,
              color: "from-pink-500 to-rose-500",
            },
            {
              title: "Transparency",
              description:
                "We believe in complete openness about how funds are used, ensuring donors can trust their contributions make a real impact.",
              icon: Shield,
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Global Community",
              description:
                "We foster connections across borders, bringing together people from different cultures and backgrounds united by a common goal.",
              icon: Globe,
              color: "from-green-500 to-emerald-500",
            },
          ].map((value, index) => (
            <div className="relative" key={index}>
              <div className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white rounded-2xl p-6">
                <div className="text-center">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${value.color} p-5 mx-auto mb-4`}
                  >
                    <value.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Stats - Using home page stats pattern */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: "50+",
                label: "Orphanages Supported",
                color: "text-main-red",
              },
              {
                number: "1,000+",
                label: "Children Helped",
                color: "text-main-blue",
              },
              {
                number: "$500K+",
                label: "Funds Raised",
                color: "text-blue-500",
              },
              { number: "95%", label: "Success Rate", color: "text-green-500" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Using home page image pattern */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} className="text-main-red" />
                  <span className="text-sm font-medium text-main-red italic">
                    Our Team
                  </span>
                </div>
                <h2 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Meet the People Behind Our Mission
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  Our dedicated team brings together expertise in child welfare,
                  international development, and technology to create lasting
                  change.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  From our Executive Director to our field coordinators, every
                  team member is committed to our mission of connecting
                  orphanages with the resources they need to thrive.
                </p>
              </div>

              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-main-red rounded-full"
              >
                Join Our Team &gt;
              </Button>
            </div>

            {/* Right Team Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "Executive Director",
                    image:
                      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
                  },
                  {
                    name: "Michael Chen",
                    role: "Program Manager",
                    image:
                      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
                  },
                  {
                    name: "Dr. Maria Rodriguez",
                    role: "Impact Coordinator",
                    image:
                      "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg",
                  },
                  {
                    name: "David Thompson",
                    role: "Technology Lead",
                    image:
                      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
                  },
                ].map((member, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 rounded-b-2xl">
                      <h4 className="font-semibold text-sm">{member.name}</h4>
                      <p className="text-xs opacity-90">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Matching home page pattern */}
      <div className="px-5 pb-20 lg:px-32">
        <div className="rounded-lg bg-main-blue p-8 text-center my-12">
          <div className="flex flex-col items-center justify-center space-y-5">
            <h2 className="text-2xl lg:text-4xl 2xl:text-6xl font-bold text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-white w-full md:w-[80%] lg:w-[60%]">
              Join our community of donors and help us create lasting change in
              children&apos;s lives around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button
                  size="lg"
                  className="bg-main-red/70 hover:bg-main-red/50"
                >
                  Start Donating
                </Button>
              </Link>
              <Link href="/impact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-main-blue"
                >
                  See Our Impact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
