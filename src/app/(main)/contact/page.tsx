"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroLayoutStyle } from "@/common/style";
import { Spinner } from "@/components/ui/spinner";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { createContactInquiry } from "@/firebase/enquiries";
import { ContactInquiry } from "@/common/types";
import { InputField, TextareaField } from "@/components/ui/form-field";
import { toast } from "sonner";

export default function Page() {
  const [formData, setFormData] = useState<Partial<ContactInquiry>>({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      // Validate required fields
      if (
        !formData.firstname ||
        !formData.lastname ||
        !formData.email ||
        !formData.subject ||
        !formData.message
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      try {
        await createContactInquiry({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });

        toast.success("Message sent successfully! We'll get back to you soon.");

        // Reset form
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        console.error("Error creating contact inquiry:", error);
        toast.error("Failed to send message. Please try again.");
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen ">
      <HeroLayout
        bgImage={
          "https://images.pexels.com/photos/821754/pexels-photo-821754.jpeg"
        }
      >
        <TopNav />
        <section
          className={cn(
            heroLayoutStyle,
            "flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
          )}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-grey dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl lg:text-2xl text-grey dark:text-gray-300 max-w-3xl mx-auto">
              Have questions about our work? Want to learn how you can help?
              We&apos;d love to hear from you and answer any questions you might
              have.
            </p>
          </div>
        </section>
      </HeroLayout>

      {/* Contact Form & Info */}
      <section className="py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-8 bg-white dark:bg-gray-900 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <InputField
                        label={"First Name"}
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="Your first name"
                        className={"w-full"}
                        value={formData.firstname || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <InputField
                        label={"Last Name"}
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="Your last name"
                        className="w-full"
                        value={formData.lastname || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <InputField
                      label={"Email Address"}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <InputField
                      label={"Subject"}
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What is this about?"
                      className="w-full"
                      value={formData.subject || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <TextareaField
                      label={"Message"}
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="w-full"
                      value={formData.message || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-main-red hover:bg-main-red/90"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="px-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  We&apos;re here to help and answer any questions you might
                  have. Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      info@connectfoundation.org
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      support@connectfoundation.org
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +234 (0) 80545234567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      50 Ebitu Ukiwe Street
                      <br />
                      Jabi, Abuja.
                      <br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Office Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM WAT
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Saturday: 10:00 AM - 2:00 PM WAT
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Image Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Office
          </h2>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  Image: Connect Foundation Office Building
                </p>
                <p className="text-sm">Placeholder for office building photo</p>
                <p className="text-sm">
                  Modern office space where our team works
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How can I donate to a specific orphanage?",
                answer:
                  "You can browse our orphanage profiles and select specific issues or needs to donate to. Each donation is tracked and you'll receive updates on how your contribution is being used.",
              },
              {
                question:
                  "What percentage of my donation goes directly to the children?",
                answer:
                  "We maintain a 90%+ efficiency rate, meaning at least 90% of your donation goes directly to the orphanage and children. Administrative costs are kept minimal and transparent.",
              },
              {
                question: "How do you verify orphanages on your platform?",
                answer:
                  "We have a rigorous verification process that includes site visits, documentation review, and ongoing monitoring to ensure all orphanages meet our standards of care and transparency.",
              },
              {
                question:
                  "Can I volunteer at an orphanage through your platform?",
                answer:
                  "Yes! Many of our partner orphanages welcome volunteers. Contact us to learn about current volunteer opportunities and requirements.",
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
