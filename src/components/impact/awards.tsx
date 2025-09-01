import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const Awards = () => {
  return (
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
  );
};

export default Awards;
