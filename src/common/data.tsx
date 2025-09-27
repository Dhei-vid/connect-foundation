import { Globe, Zap, Megaphone } from "lucide-react";
import type { FAQItem } from "@/components/general/faq";

export const impactInfo = [
  {
    Icon: Zap,
    label: "Ignite Impact",
    content:
      "Spark joy by sharing your cause and the positive impact it brings.",
  },
  {
    Icon: Megaphone,
    label: "Spread The Word",
    content: "Leverage the speed of social media and online networks.",
  },
  {
    Icon: Globe,
    label: "Connect Globally",
    content: "Build a strong social network around your cause.",
  },
];

export const faqData: FAQItem[] = [
  {
    id: "how-to-donate",
    question: "How Can I Make Donation?",
    answer:
      "You can make a donation using our secure online form above. We accept credit cards, debit cards, and bank transfers. All transactions are encrypted and secure.",
  },
  {
    id: "tax-deductible",
    question: "Is My Donation Tax-Deductible?",
    answer:
      "Yes, all donations to Connect Foundation are tax-deductible. You'll receive a receipt via email for your tax records.",
  },
  {
    id: "honor-memory",
    question: "Can I Donate In Honor Or Memory Of Someone?",
    answer:
      "Absolutely! You can make a donation in honor or memory of someone special. There's an option in the donation form to add a dedication message.",
  },
  {
    id: "donation-usage",
    question: "How Will My Donation Be Used?",
    answer:
      "95% of your donation goes directly to programs and services for children. We maintain complete transparency with detailed reports on how funds are used.",
  },
  {
    id: "recurring-donation",
    question: "Can I Set Up A Recurring Donation?",
    answer:
      "Yes! You can set up monthly recurring donations to provide ongoing support. This option is available in the donation form above.",
  },
];

// Example of FAQ with complex content (ReactNode)
export const advancedFaqData: FAQItem[] = [
  {
    id: "payment-methods",
    question: "What Payment Methods Do You Accept?",
    answer: (
      <div className="space-y-3">
        <p>We accept the following payment methods:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Credit Cards (Visa, MasterCard, American Express)</li>
          <li>Debit Cards</li>
          <li>Bank Transfers</li>
          <li>PayPal</li>
          <li>Apple Pay & Google Pay</li>
        </ul>
        <p className="text-sm text-gray-500">
          All payments are processed securely through our encrypted payment
          gateway.
        </p>
      </div>
    ),
  },
  {
    id: "security",
    question: "How Secure Is My Information?",
    answer: (
      <div className="space-y-3">
        <p>Your security is our top priority:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              SSL Encryption
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              All data is encrypted in transit
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              PCI Compliance
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We meet the highest security standards
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

// Testimonials
export const volunteerTestimonials = [
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
