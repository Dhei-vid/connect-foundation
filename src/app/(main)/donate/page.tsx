"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  DollarSign,
  Users,
  Shield,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { TopNav } from "@/components/navigation/top-nav";
import ImpactCard from "@/components/general/impact-card";
import FAQ from "@/components/general/faq";
import { impactInfo, faqData } from "@/common/data";
import MasonryGrid from "@/components/general/masonry-grid";

export default function Page() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  return (
    <div className="min-h-screen">
      <TopNav />

      {/* Hero section */}
      <div className="p-4 2xl:p-10">
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
                    "ease-in-out transition-all duration-200 group cursor-pointer text-white/70 rounded-full p-3 px-5 bg-main-red/70 hover:bg-main-red/90 flex flex-row items-center gap-1 2xl:gap-3"
                  }
                >
                  <p className={"font-semibold 2xl:text-4xl"}>Start Donating</p>
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

      {/* Fund, Fast As Flash Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Fund, Fast As Flash
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl">
              Fundraise at the speed of thought! Elevate your cause in just a
              minute with our lightning-fast fundraising platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {impactInfo.map((impact, index) => (
              <ImpactCard key={index} {...impact} />
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Fundraising Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Urgent Fundraising!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Time is of the essence! Join our mission NOW to make an immediate
              impact. Every second counts!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* GreenFund Campaign */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Environmental Action
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  GreenFund: Sustain Earth Now
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      $50,240.210
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
                  Donate Now
                </Button>
              </CardContent>
            </Card>

            {/* SeniorHealth Campaign */}
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
                  SeniorHealth: Support Campaign
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      $4,240.310
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
                  Donate Now
                </Button>
              </CardContent>
            </Card>

            {/* DisasterCare Campaign */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-purple-800">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Disaster Relief
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  DisasterCare: Urgent Support
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      $2,100.210
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
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Your Donation Means A Lot Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <MasonryGrid />
      </section>

      {/* Comprehensive Donation Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Make Your Donation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Support children in need with a secure and transparent donation
              process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <Card className="p-8 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Donation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[25, 50, 100, 250].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedAmount === amount ? "default" : "outline"
                        }
                        className={`h-12 ${
                          selectedAmount === amount
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => handleAmountSelect(amount)}
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
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="pl-8 h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Information
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
                        onChange={(e) =>
                          setDonorInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your last name"
                        value={donorInfo.lastName}
                        onChange={(e) =>
                          setDonorInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full"
                        required
                      />
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
                      onChange={(e) =>
                        setDonorInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full"
                      required
                    />
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
                    Donation Options
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
                        Make this a recurring monthly donation
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
                        Make this donation anonymous
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4 text-green-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Send me updates about this donation
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="p-8 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      className={`h-12 ${
                        paymentMethod === "card"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit Card
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "bank" ? "default" : "outline"}
                      className={`h-12 ${
                        paymentMethod === "bank"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Bank Transfer
                    </Button>
                  </div>
                </div>

                {paymentMethod === "card" ? (
                  /* Credit Card Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number *
                      </label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date *
                        </label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV *
                        </label>
                        <Input
                          type="text"
                          placeholder="123"
                          className="w-full"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  /* Bank Transfer Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter bank name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Number *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter account number"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Routing Number *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter routing number"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Holder Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Account holder name"
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Security Features */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Secure Payment
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>

                {/* Tax Deduction Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Tax Deductible
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your donation is tax-deductible. You&apos;ll receive a
                    receipt for your records.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Complete Donation
                </Button>
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
