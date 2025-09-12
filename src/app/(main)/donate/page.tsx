import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Heart,
  DollarSign,
  Gift,
  Users,
  Target,
  Shield,
  TrendingUp,
} from "lucide-react";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeroLayout>
        <TopNav />

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Make a <span className="text-primary">Difference</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Your donation can change a child&apos;s life forever. Every dollar
              counts and goes directly to providing food, shelter, education,
              and care for children in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn How It Works
              </Button>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Impact Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2.5M+</div>
              <p className="text-gray-600 dark:text-gray-300">Total Raised</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                15,000+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Donors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">50+</div>
              <p className="text-gray-600 dark:text-gray-300">Orphanages</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300">
                Efficiency Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Choose How You Want to Help
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                General Fund
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Support our overall mission and help us reach more orphanages in
                need.
              </p>
              <Button className="w-full">Donate to General Fund</Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Specific Issue
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Choose a specific need or project to support directly.
              </p>
              <Button className="w-full">Browse Issues</Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Orphanage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Support a specific orphanage and see your impact directly.
              </p>
              <Button className="w-full">Choose Orphanage</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white dark:bg-gray-900 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Make Your Donation
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Donation Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[25, 50, 100, 250].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      className="h-12"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    className="pl-8 h-12 text-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Your last name"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Make this donation anonymous
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Send me updates about this donation
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <DollarSign className="w-5 h-5 mr-2" />
                Complete Donation
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Your Impact in Action
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    New School Building
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thanks to donor contributions, we built a new school
                    building for 200 children in rural Kenya. The children now
                    have access to quality education.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Medical Care Program
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your donations funded a comprehensive medical care program
                    for 150 children, providing regular check-ups and emergency
                    care.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Image: Children in new school building
                  </p>
                  <p className="text-sm">Placeholder for success story photo</p>
                  <p className="text-sm">
                    Children learning in their new classroom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer1-curves border border-red-500">
        <svg
          viewBox="0 0 1440 122"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="rotate-180 top-0 left-0 w-full h-full"
        >
          <path
            d="M0,40 C480,160 960,-80 1440,50 L1440,122 L0,122 Z"
            fill="#007a4850"
          />
        </svg>

        <svg
          viewBox="0 0 1440 122"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="rotate-180 top-0 left-0 w-full h-full"
        >
          <path
            d="M0,70 C480,170 960,-30 1440,70 L1440,122 L0,122 Z"
            fill="#007a48"
          />
        </svg>
      </div>

      {/* Trust & Security */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Your Trust is Our Priority
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Secure Donations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All donations are processed securely with bank-level encryption
                and fraud protection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Transparent Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See exactly how your donation is used with detailed reports and
                updates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Maximum Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                95% of your donation goes directly to programs and services for
                children.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
