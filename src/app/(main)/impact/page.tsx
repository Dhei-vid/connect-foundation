import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Users,
  TrendingUp,
  Target,
  Award,
  Globe,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Our <span className="text-primary">Impact</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            See the real difference your support makes in children&apos;s lives.
            From education to healthcare, every donation creates lasting
            positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="text-lg px-8 py-3">
                <Heart className="w-5 h-5 mr-2" />
                Support Our Work
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Transforming Lives Through Connection
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
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Image: World map showing our global reach
                  </p>
                  <p className="text-sm">
                    Placeholder for global impact visualization
                  </p>
                  <p className="text-sm">
                    Interactive map of supported orphanages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Impact by the Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Orphanages Supported
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Across 15 countries
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">
                1,500+
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Children Helped
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Direct beneficiaries
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-2">
                $2.5M+
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Funds Raised
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Through our platform
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-500 mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Efficiency Rate
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Funds to programs
              </p>
            </div>
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
                image: "Hope Children's Home - New school building",
                description:
                  "Built a modern school facility serving 120 children, providing quality education and a safe learning environment.",
              },
              {
                title: "Bright Future Orphanage",
                location: "Mumbai, India",
                achievement: "Medical clinic established",
                children: 85,
                image: "Bright Future Orphanage - Medical clinic",
                description:
                  "Established a fully-equipped medical clinic providing healthcare to 85 children and the local community.",
              },
              {
                title: "Sunshine House",
                location: "Lima, Peru",
                achievement: "Clean water system installed",
                children: 60,
                image: "Sunshine House - Clean water system",
                description:
                  "Installed a clean water system ensuring safe drinking water for 60 children and staff.",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{story.image}</p>
                    <p className="text-xs">
                      Placeholder for success story photo
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {story.location}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {story.achievement}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {story.children} children helped
                    </span>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Areas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Areas of Impact
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Education",
                description:
                  "Building schools, providing supplies, and supporting teachers to ensure every child has access to quality education.",
                impact: "500+ children enrolled in school",
              },
              {
                icon: Heart,
                title: "Healthcare",
                description:
                  "Establishing medical clinics, providing vaccinations, and ensuring children receive proper medical care.",
                impact: "300+ children receiving healthcare",
              },
              {
                icon: Users,
                title: "Shelter",
                description:
                  "Improving living conditions, building safe housing, and creating comfortable environments for children.",
                impact: "200+ children in improved housing",
              },
              {
                icon: Star,
                title: "Nutrition",
                description:
                  "Providing balanced meals, clean water, and nutritional support to ensure children grow up healthy.",
                impact: "400+ children with improved nutrition",
              },
            ].map((area, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <area.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {area.description}
                </p>
                <div className="text-sm font-medium text-primary">
                  {area.impact}
                </div>
              </div>
            ))}
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
                    Photo and video documentation
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Recognition & Awards
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2023",
                award: "Excellence in Transparency",
                organization: "Charity Navigator",
                description:
                  "Recognized for our commitment to complete transparency in all operations.",
              },
              {
                year: "2022",
                award: "Innovation in Philanthropy",
                organization: "Global Giving Foundation",
                description:
                  "Awarded for our innovative platform connecting donors directly with orphanages.",
              },
              {
                year: "2021",
                award: "Community Impact",
                organization: "International Aid Network",
                description:
                  "Honored for our significant positive impact on communities worldwide.",
              },
            ].map((recognition, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">
                  {recognition.year}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {recognition.award}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {recognition.organization}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {recognition.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <Button size="lg" className="text-lg px-8 py-3">
                <Heart className="w-5 h-5 mr-2" />
                Start Donating
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More About Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
