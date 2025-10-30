"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Users,
  Shield,
  CheckCircle,
  Clock,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { TopNav } from "@/components/navigation/top-nav";
import ImpactCard from "@/components/general/impact-card";
import FAQ from "@/components/general/faq";
import { impactInfo, faqData } from "@/common/data";
import MasonryGrid from "@/components/general/masonry-grid";
import { Spinner } from "@/components/ui/spinner";

import { useToast } from "@/hooks/use-toast";
import {
  initializeTransaction,
  generateReference,
} from "@/payment/transaction";
import { createDonation } from "@/firebase/donations";

export default function Page() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Selecting Amount
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    // Clear amount error when user selects
    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  // Custom amount selection
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    // Clear amount error when user types
    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!donorInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!donorInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!donorInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    const amount = selectedAmount || parseFloat(customAmount) || 0;
    if (amount <= 0) {
      errors.amount = "Please select or enter a valid donation amount";
    } else if (amount < 100) {
      errors.amount = "Minimum donation amount is ₦100";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize payment using Paystack transaction directly
  const handlePayment = async () => {
    // Validate form first
    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount) || 0;
    setIsProcessing(true);

    try {
      // Convert amount to kobo (Paystack expects amount in kobo)
      const amountInKobo = Math.round(amount * 100);

      // Generate unique reference
      const reference = await generateReference();

      // Create pending donation record
      const donationData = {
        donorName: `${donorInfo.firstName} ${donorInfo.lastName}`,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone || "",
        amount: amount,
        currency: "NGN",
        message: `Donation from ${donorInfo.firstName} ${donorInfo.lastName}`,
        anonymous: isAnonymous,
        isRecurring,
        status: "pending" as const,
        transactionReference: reference,
      };

      const donationId = await createDonation(donationData);

      // Initialize payment with Paystack
      const paystackParams = {
        email: donorInfo.email,
        amount: amountInKobo.toString(),
        currency: "NGN",
        reference: reference,
        metadata: {
          donationId,
          donorName: `${donorInfo.firstName} ${donorInfo.lastName}`,
          isRecurring,
          isAnonymous,
        },
        callback_url: `${
          process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"
        }/payment/callback`,
      };

      // Check if environment variables are properly set
      if (!process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY) {
        throw new Error(
          "Payment service is not configured. Please check your environment variables. See ENVIRONMENT_SETUP.md for details."
        );
      }

      const paystackResponse = await initializeTransaction(paystackParams);

      if (paystackResponse.status && paystackResponse.data) {
        // Show success message
        setShowSuccess(true);
        toast({
          title: "Payment Initialized",
          description: "Redirecting to payment page...",
        });

        // Small delay to show the success message, then redirect
        setTimeout(() => {
          window.location.href = paystackResponse.data.authorization_url;
        }, 2000);
      } else {
        throw new Error(
          paystackResponse.message || "Payment initialization failed"
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error initializing the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav menuStyle="bg-main-red" donateStyle="bg-main-red" />

      {/* Hero section */}
      <div className="px-4 2xl:px-10">
        <div
          className={
            "overflow-hidden relative bg-cover bg-no-repeat bg-center h-[40rem] lg:h-[34rem] 2xl:h-[55rem] 3xl:h-[60rem] p-6 2xl:p-8 3xl:p-12 rounded-[3rem] bg-[url('https://images.pexels.com/photos/5789276/pexels-photo-5789276.jpeg')]"
          }
        >
          {/* Gradient behind content */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-slate-800/50 to-gray-700/90 z-0 rounded-b-[3rem]"></div>

          {/* Content */}
          <div className="w-full flex mb-auto relative z-10 h-[32rem] lg:h-[30rem] 2xl:h-[50rem] 3xl:h-[60rem]">
            <div className="grid grid-cols-3 items-end w-full">
              <div className="col-span-2 flex flex-row items-end">
                <div>
                  <p className="tracking-wide text-white font-bold text-2xl lg:text-9xl 2xl:text-[15rem]">
                    Donate
                  </p>
                </div>
                <div className="mb-3">
                  <p className="font-bold text-main-red lg:text-3xl 2xl:text-6xl">
                    Help
                  </p>
                  <p className="font-bold text-main-red lg:text-3xl 2xl:text-6xl">
                    Others
                  </p>
                </div>
              </div>
              <div className={"justify-self-end col-span-1"}>
                <button
                  className={
                    "ease-in-out transition-all duration-200 group cursor-pointer text-white rounded-full p-3 px-5 bg-main-red hover:bg-main-red/90 flex flex-row items-center gap-1 2xl:gap-3"
                  }
                >
                  <p className={"font-semibold 2xl:text-3xl"}>Start Donating</p>
                  <div
                    className={
                      "group-hover:bg-white/10 bg-white/7 p-2 rounded-full"
                    }
                  >
                    <ArrowDown className="2xl:w-12 2xl:h-12" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Orphanages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Support Orphanages, Transform Lives
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl">
              Make a lasting impact on children&apos;s lives! Support orphanages
              with essential resources, education, and care through our secure
              donation platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {impactInfo.map((impact, index) => (
              <ImpactCard key={index} {...impact} />
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Orphanage Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Urgent Orphanage Support!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Children in orphanages need your help NOW! Join our mission to
              provide immediate support and care. Every donation makes a
              difference!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Education Support Campaign */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Education Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Education Fund: School Supplies
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ₦2,500,000
                    </span>
                    <span className="text-sm text-gray-500">raised</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      7 days left
                    </span>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Support Now
                </Button>
              </CardContent>
            </Card>

            {/* Healthcare Support Campaign */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Healthcare</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Health Fund: Medical Care
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ₦1,200,000
                    </span>
                    <span className="text-sm text-gray-500">raised</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      15 days left
                    </span>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Support Now
                </Button>
              </CardContent>
            </Card>

            {/* Basic Needs Campaign */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-purple-800">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Basic Needs</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Basic Needs: Food & Shelter
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      ₦800,000
                    </span>
                    <span className="text-sm text-gray-500">raised</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      25 days left
                    </span>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Support Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <MasonryGrid />
      </section>

      {/* Comprehensive Donation Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Support Orphanages Today
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Help provide essential care, education, and hope to children in
              orphanages through our secure and transparent donation platform
            </p>
          </div>

          <div className="">
            {/* Donation Form */}
            <Card className="p-8 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Support Orphanage Children
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Choose Your Support Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[50000, 100000, 200000, 300000].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedAmount === amount ? "default" : "outline"
                        }
                        className={`h-12 transition-all duration-200 ${
                          selectedAmount === amount
                            ? "bg-main-red hover:bg-main-blue text-white"
                            : "hover:border-main-red hover:text-main-red"
                        }`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ₦{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter your support amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className={`pl-8 h-12 text-lg ${
                        formErrors.amount ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.amount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Supporter Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your first name"
                        value={donorInfo.firstName}
                        onChange={(e) => {
                          setDonorInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }));
                          // Clear error when user types
                          if (formErrors.firstName) {
                            setFormErrors((prev) => ({
                              ...prev,
                              firstName: "",
                            }));
                          }
                        }}
                        className={`w-full ${
                          formErrors.firstName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your last name"
                        value={donorInfo.lastName}
                        onChange={(e) => {
                          setDonorInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }));
                          // Clear error when user types
                          if (formErrors.lastName) {
                            setFormErrors((prev) => ({
                              ...prev,
                              lastName: "",
                            }));
                          }
                        }}
                        className={`w-full ${
                          formErrors.lastName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={donorInfo.email}
                      onChange={(e) => {
                        setDonorInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                        // Clear error when user types
                        if (formErrors.email) {
                          setFormErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                      className={`w-full ${
                        formErrors.email ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={donorInfo.phone}
                      onChange={(e) =>
                        setDonorInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Donation Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Support Options
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4 text-green-600"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Make this a recurring monthly support
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4 text-green-600"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Make this support anonymous
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Send me updates about this support
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="button"
                  className="w-full h-12 text-lg bg-main-red hover:bg-main-blue transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="w-5 h-5 mr-2" />
                      Processing payment...
                    </>
                  ) : (
                    "Support Orphanages"
                  )}
                </Button>

                <div>
                  <p className={"text-xs font-light"}>
                    Powered by{" "}
                    <span className={"text-main-blue font-bold"}>Paystack</span>
                  </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">
                        Support initialized successfully! You will be redirected
                        to complete your payment.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Frequently Asked Questions
          </h2>

          <FAQ items={faqData} className="space-y-4" allowMultiple={false} />
        </div>
      </section>
    </div>
  );
}
