import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Shield } from "lucide-react";
import Link from "next/link";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <HeroLayout>
        <TopNav />
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-primary">Connect Foundation</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              We&apos;re on a mission to bridge the gap between orphanages in
              need and compassionate donors worldwide, creating lasting impact
              in children&apos;s lives through transparency and connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" className="text-lg px-8 py-3">
                  Make a Difference
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                To provide orphanages with a platform to share their needs and
                connect with donors who want to make a real difference. We
                believe every child deserves access to basic necessities,
                education, and care.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                A world where no orphanage struggles alone, and every donor can
                see the direct impact of their generosity through transparent,
                accountable giving.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Image: Team members working together
                  </p>
                  <p className="text-sm">Placeholder for team photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Compassion
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We approach every interaction with empathy and understanding,
                recognizing the unique challenges each orphanage faces.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in complete openness about how funds are used,
                ensuring donors can trust their contributions make a real
                impact.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Global Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We foster connections across borders, bringing together people
                from different cultures and backgrounds united by a common goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600 dark:text-gray-300">
                Orphanages Supported
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                1,000+
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Children Helped
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">
                $500K+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Funds Raised</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Executive Director",
                image: "Sarah Johnson - Executive Director",
              },
              {
                name: "Michael Chen",
                role: "Program Manager",
                image: "Michael Chen - Program Manager",
              },
              {
                name: "Dr. Maria Rodriguez",
                role: "Impact Coordinator",
                image: "Dr. Maria Rodriguez - Impact Coordinator",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Photo</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join our community of donors and help us create lasting change in
            children&apos;s lives around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Donating
              </Button>
            </Link>
            <Link href="/impact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                See Our Impact
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
