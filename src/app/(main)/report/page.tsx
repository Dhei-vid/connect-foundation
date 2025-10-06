"use client";

import { useState } from "react";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  Download,
  Building2,
  PiggyBank,
  LucideIcon,
  Baby,
  BicepsFlexed,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { heroLayoutStyle, headerStyle, paddingStyle } from "@/common/style";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/common/helpers";

interface FinancialSummary {
  value: number;
  label: string;
  icon: LucideIcon;
}

// Mock financial data grouped by years
const financialData = {
  2024: {
    totalRevenue: 2500000,
    totalExpenses: 1800000,
    netIncome: 700000,
    donations: 2200000,
    grants: 300000,
    programExpenses: 1200000,
    administrativeExpenses: 400000,
    fundraisingExpenses: 200000,
    monthlyData: [
      { month: "Jan", revenue: 180000, expenses: 140000, donations: 160000 },
      { month: "Feb", revenue: 220000, expenses: 160000, donations: 200000 },
      { month: "Mar", revenue: 200000, expenses: 150000, donations: 180000 },
      { month: "Apr", revenue: 250000, expenses: 180000, donations: 230000 },
      { month: "May", revenue: 280000, expenses: 200000, donations: 260000 },
      { month: "Jun", revenue: 300000, expenses: 220000, donations: 280000 },
      { month: "Jul", revenue: 320000, expenses: 240000, donations: 300000 },
      { month: "Aug", revenue: 290000, expenses: 210000, donations: 270000 },
      { month: "Sep", revenue: 260000, expenses: 190000, donations: 240000 },
      { month: "Oct", revenue: 240000, expenses: 170000, donations: 220000 },
      { month: "Nov", revenue: 210000, expenses: 150000, donations: 190000 },
      { month: "Dec", revenue: 200000, expenses: 140000, donations: 180000 },
    ],
    programBreakdown: [
      { name: "Education", value: 600000, color: "#1d3557" },
      {
        name: "Healthcare",
        value: 400000,
        color: "#4a5d79",
      },
      {
        name: "Food & Shelter",
        value: 200000,
        color: "#77869a",
      },
    ],
    impactMetrics: {
      childrenHelped: 1500,
      orphanagesSupported: 25,
      volunteers: 180,
      projectsCompleted: 45,
    },
  },
  2023: {
    totalRevenue: 2100000,
    totalExpenses: 1600000,
    netIncome: 500000,
    donations: 1800000,
    grants: 300000,
    programExpenses: 1000000,
    administrativeExpenses: 400000,
    fundraisingExpenses: 200000,
    monthlyData: [
      { month: "Jan", revenue: 150000, expenses: 120000, donations: 130000 },
      { month: "Feb", revenue: 180000, expenses: 140000, donations: 160000 },
      { month: "Mar", revenue: 170000, expenses: 130000, donations: 150000 },
      { month: "Apr", revenue: 200000, expenses: 160000, donations: 180000 },
      { month: "May", revenue: 220000, expenses: 180000, donations: 200000 },
      { month: "Jun", revenue: 250000, expenses: 200000, donations: 230000 },
      { month: "Jul", revenue: 280000, expenses: 220000, donations: 260000 },
      { month: "Aug", revenue: 260000, expenses: 200000, donations: 240000 },
      { month: "Sep", revenue: 230000, expenses: 180000, donations: 210000 },
      { month: "Oct", revenue: 210000, expenses: 160000, donations: 190000 },
      { month: "Nov", revenue: 190000, expenses: 140000, donations: 170000 },
      { month: "Dec", revenue: 180000, expenses: 130000, donations: 160000 },
    ],
    programBreakdown: [
      { name: "Education", value: 500000, color: "#1d3557" },
      {
        name: "Healthcare",
        value: 350000,
        color: "#4a5d79",
      },
      {
        name: "Food & Shelter",
        value: 150000,
        color: "#77869a",
      },
    ],
    impactMetrics: {
      childrenHelped: 1200,
      orphanagesSupported: 20,
      volunteers: 150,
      projectsCompleted: 38,
    },
  },
  2022: {
    totalRevenue: 1800000,
    totalExpenses: 1400000,
    netIncome: 400000,
    donations: 1500000,
    grants: 300000,
    programExpenses: 900000,
    administrativeExpenses: 350000,
    fundraisingExpenses: 150000,
    monthlyData: [
      { month: "Jan", revenue: 120000, expenses: 100000, donations: 110000 },
      { month: "Feb", revenue: 140000, expenses: 120000, donations: 130000 },
      { month: "Mar", revenue: 130000, expenses: 110000, donations: 120000 },
      { month: "Apr", revenue: 160000, expenses: 140000, donations: 150000 },
      { month: "May", revenue: 180000, expenses: 160000, donations: 170000 },
      { month: "Jun", revenue: 200000, expenses: 180000, donations: 190000 },
      { month: "Jul", revenue: 220000, expenses: 200000, donations: 210000 },
      { month: "Aug", revenue: 200000, expenses: 180000, donations: 190000 },
      { month: "Sep", revenue: 180000, expenses: 160000, donations: 170000 },
      { month: "Oct", revenue: 170000, expenses: 150000, donations: 160000 },
      { month: "Nov", revenue: 160000, expenses: 140000, donations: 150000 },
      { month: "Dec", revenue: 150000, expenses: 130000, donations: 140000 },
    ],
    programBreakdown: [
      { name: "Education", value: 450000, color: "#1d3557" },
      {
        name: "Healthcare",
        value: 300000,
        color: "#4a5d79",
      },
      {
        name: "Food & Shelter",
        value: 150000,
        color: "#77869a",
      },
    ],
    impactMetrics: {
      childrenHelped: 1000,
      orphanagesSupported: 18,
      volunteers: 120,
      projectsCompleted: 32,
    },
  },
};

const years = Object.keys(financialData).sort((a, b) => Number(b) - Number(a));

// Chart configurations with main blue color scheme
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#1d3557", // Main blue
  },
  expenses: {
    label: "Expenses",
    color: "#d2d7dd", // Light blue
  },
};

export default function Page() {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(
    new Set(["2024"])
  );

  const financialStats: Array<FinancialSummary> = [
    { value: 50000, label: "Total revenue generated", icon: PiggyBank },
    { value: 50000, label: "Children helped", icon: Baby },
    { value: 50000, label: "Orphanages supported", icon: Building2 },
    {
      value: 50000,
      label: "Program Efficiency",
      icon: BicepsFlexed,
    },
  ];

  const toggleYearExpansion = (year: string) => {
    setExpandedYears((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  const isYearExpanded = (year: string) => expandedYears.has(year);

  return (
    <div className="min-h-screen">
      <HeroLayout bgImage="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg">
        <TopNav />
        <section
          className={cn(
            heroLayoutStyle,
            "flex flex-col items-center justify-center text-center"
          )}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className={cn(headerStyle, "font-bold text-white mb-6")}>
              Financial <span className="text-main-red">Reports</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Transparency in Action - See how your donations transform lives in
              orphanages
            </p>
          </div>
        </section>
      </HeroLayout>

      <section className={cn(paddingStyle, "grid md:grid-cols-3 gap-4")}>
        <div className="md:col-span-2">
          <p className={cn(headerStyle, "text-main-blue")}>
            We Make Every Contribution{" "}
            <span className="text-main-red uppercase">Count!</span>
          </p>
          <div className="lg:pt-5 2xl:pt-8 space-y-5 lg:w-3xl 2xl:w-5xl">
            <p className={"lg:text-lg 2xl:text-xl"}>
              Every contribution tells a story — a story of compassion, shared
              humanity, and a commitment to making the world gentler for
              children who deserve every chance at life.
            </p>

            <p className={"lg:text-lg 2xl:text-xl"}>
              Each naira, each donation, each gesture of kindness becomes a
              bridge — connecting those who can help with those who need it
              most. Whether it&apos;s a monthly donor giving consistently or a
              one-time gift from a caring heart, every contribution counts.
            </p>

            <p className={"lg:text-lg 2xl:text-xl"}>
              Over the past year, our community of donors has helped us reach
              more orphanages, feed more children, fund their education, and
              restore hope to many who had almost given up. Your giving
              isn&apos;t just a number in a report — it&apos;s the reason a
              child smiles again, eats a proper meal, or sleeps under a safe
              roof tonight.
            </p>
          </div>
        </div>

        <div className="md:col-span-1 space-y-2">
          <div>
            <Image
              className={
                "object-cover object-center rounded-2xl w-full lg:[12rem] 2xl:h-[15rem]"
              }
              src={
                "https://images.pexels.com/photos/12448839/pexels-photo-12448839.jpeg"
              }
              alt={"children in class"}
              width={400}
              height={400}
            />
          </div>
          <div className={"grid grid-cols-2 gap-2"}>
            <Image
              className={"object-cover object-center rounded-2xl"}
              src={
                "https://images.pexels.com/photos/2113709/pexels-photo-2113709.jpeg"
              }
              alt={"black child"}
              width={400}
              height={400}
            />
            <Image
              className={"object-cover object-center rounded-2xl"}
              src={
                "https://images.pexels.com/photos/2305192/pexels-photo-2305192.jpeg"
              }
              alt={"children"}
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Summary section */}
      <section className={cn(paddingStyle)}>
        <div className="grid grid-cols-3 rounded-2xl bg-main-blue p-5">
          <div className={"col-span-1 m-auto"}>
            <p className={cn(headerStyle, "text-main-red py-3")}>In Summary</p>
          </div>
          <div className={"col-span-2 grid grid-cols-2 p-5 gap-5 w-full"}>
            {financialStats.map((item, index) => (
              <div
                className="flex flex-row justify-between bg-white rounded-2xl p-5 text-main-blue"
                key={index}
              >
                <div>
                  <p className="font-bold text-main-red text-xl lg:text-3xl 2xl:text-4xl">
                    {item.value}
                  </p>
                  <p className="text-left text-main-blue">{item.label}</p>
                </div>
                <div className="bg-main-red/10 rounded-full flex items-center justify-center w-10 h-10">
                  <item.icon size={18} className="text-main-red " />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grouping financial reports */}
      <section className={cn("pb-20")}>
        {years.map((year) => (
          <div key={year}>
            {/* Section Header */}
            <div
              className={cn(
                paddingStyle,
                "z-40 sticky top-0 bg-gray-50 hover:bg-main-blue flex flex-row justify-between text-main-blue hover:text-gray-50 cursor-pointer group border border-main-blue/50 transition-all ease-in-out duration-300 shadow-sm hover:shadow-md"
              )}
              onClick={() => toggleYearExpansion(year)}
            >
              <div className="flex items-center gap-4">
                <p className="text-5xl font-bold">{year}</p>
                <div className="text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {isYearExpanded(year)
                    ? "Click to collapse"
                    : "Click to expand"}
                </div>
              </div>
              <div
                className={cn(
                  "rounded-full flex items-center justify-center w-12 h-12 border border-main-blue group-hover:bg-main-blue group-hover:border-gray-50 transition-all duration-300 hover:scale-110",
                  isYearExpanded(year) && "rotate-180"
                )}
              >
                <ChevronDown
                  className={
                    "group-hover:text-gray-50 transition-colors duration-300"
                  }
                />
              </div>
            </div>

            {/* Financial Content - Only show if year is expanded */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isYearExpanded(year)
                  ? "max-h-[9999px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <section className={cn(paddingStyle)}>
                <div className="mx-auto">
                  {/* Get data for the specific year */}
                  {(() => {
                    const yearData =
                      financialData[
                        year as unknown as keyof typeof financialData
                      ];
                    return (
                      <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-main-blue dark:text-main-blue/80">
                                Total Revenue
                              </CardTitle>
                              <div className="w-10 h-10 bg-main-blue rounded-full flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-white" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-main-blue dark:text-main-blue/90">
                                {formatCurrency(yearData.totalRevenue)}
                              </div>
                              <p className="text-xs text-main-blue/70 dark:text-main-blue/60">
                                +12% from last year
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-main-blue dark:text-main-blue/80">
                                Total Expenses
                              </CardTitle>
                              <div className="w-10 h-10 bg-main-blue rounded-full flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-white" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-main-blue dark:text-main-blue/90">
                                {formatCurrency(yearData.totalExpenses)}
                              </div>
                              <p className="text-xs text-main-blue/70 dark:text-main-blue/60">
                                +8% from last year
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-main-blue dark:text-main-blue/80">
                                Net Income
                              </CardTitle>
                              <div className="w-10 h-10 bg-main-blue rounded-full flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-main-blue dark:text-main-blue/90">
                                {formatCurrency(yearData.netIncome)}
                              </div>
                              <p className="text-xs text-main-blue/70 dark:text-main-blue/60">
                                +20% from last year
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-main-blue dark:text-main-blue/80">
                                Children Helped
                              </CardTitle>
                              <div className="w-10 h-10 bg-main-blue rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-white" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-main-blue dark:text-main-blue/90">
                                {formatNumber(
                                  yearData.impactMetrics.childrenHelped
                                )}
                              </div>
                              <p className="text-xs text-main-blue/70 dark:text-main-blue/60">
                                +25% from last year
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Financial Summary Table */}
                        <Card className="py-6 mb-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/30 border-gray-200 dark:border-gray-800">
                          <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
                              Financial Summary Report - {year}
                            </CardTitle>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                              Comprehensive breakdown of all financial
                              activities and program expenditures
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-main-blue text-white">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                      Category
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                      Amount (NGN)
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                      Percentage
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Revenue Section */}
                                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td
                                      colSpan={4}
                                      className="border border-gray-300 px-4 py-2 font-bold text-main-blue dark:text-main-blue/80"
                                    >
                                      REVENUE SOURCES
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                      Individual Donations
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                      {formatCurrency(yearData.donations)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                      {Math.round(
                                        (yearData.donations /
                                          yearData.totalRevenue) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Active
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                      Foundation Grants
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                      {formatCurrency(yearData.grants)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                      {Math.round(
                                        (yearData.grants /
                                          yearData.totalRevenue) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Active
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr className="bg-main-blue/10 dark:bg-main-blue/20 font-bold">
                                    <td className="border border-gray-300 px-4 py-3 text-main-blue dark:text-main-blue/90">
                                      TOTAL REVENUE
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono text-main-blue dark:text-main-blue/90">
                                      {formatCurrency(yearData.totalRevenue)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right text-main-blue dark:text-main-blue/90">
                                      100%
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Complete
                                      </Badge>
                                    </td>
                                  </tr>

                                  {/* Expenses Section */}
                                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td
                                      colSpan={4}
                                      className="border border-gray-300 px-4 py-2 font-bold text-main-blue dark:text-main-blue/80"
                                    >
                                      EXPENDITURES
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                      Program Expenses
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                      {formatCurrency(yearData.programExpenses)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                      {Math.round(
                                        (yearData.programExpenses /
                                          yearData.totalExpenses) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Excellent
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                      Administrative Costs
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                      {formatCurrency(
                                        yearData.administrativeExpenses
                                      )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                      {Math.round(
                                        (yearData.administrativeExpenses /
                                          yearData.totalExpenses) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Good
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                      Fundraising Costs
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                      {formatCurrency(
                                        yearData.fundraisingExpenses
                                      )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right">
                                      {Math.round(
                                        (yearData.fundraisingExpenses /
                                          yearData.totalExpenses) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Efficient
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr className="bg-main-blue/10 dark:bg-main-blue/20 font-bold">
                                    <td className="border border-gray-300 px-4 py-3 text-main-blue dark:text-main-blue/90">
                                      TOTAL EXPENSES
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono text-main-blue dark:text-main-blue/90">
                                      {formatCurrency(yearData.totalExpenses)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right text-main-blue dark:text-main-blue/90">
                                      100%
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Complete
                                      </Badge>
                                    </td>
                                  </tr>

                                  {/* Net Income */}
                                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td
                                      colSpan={4}
                                      className="border border-gray-300 px-4 py-2 font-bold text-main-blue dark:text-main-blue/80"
                                    >
                                      NET RESULTS
                                    </td>
                                  </tr>
                                  <tr className="bg-main-blue/10 dark:bg-main-blue/20 font-bold">
                                    <td className="border border-gray-300 px-4 py-3 text-main-blue dark:text-main-blue/90">
                                      NET INCOME
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-mono text-main-blue dark:text-main-blue/90">
                                      {formatCurrency(yearData.netIncome)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right text-main-blue dark:text-main-blue/90">
                                      {Math.round(
                                        (yearData.netIncome /
                                          yearData.totalRevenue) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                      <Badge className="bg-main-blue text-white">
                                        Surplus
                                      </Badge>
                                    </td>
                                  </tr>

                                  {/* Program Breakdown */}
                                  <tr className="bg-main-blue/10 dark:bg-main-blue/20">
                                    <td
                                      colSpan={4}
                                      className="border border-gray-300 px-4 py-2 font-bold text-main-blue dark:text-main-blue/80"
                                    >
                                      PROGRAM ALLOCATION
                                    </td>
                                  </tr>
                                  {yearData.programBreakdown.map(
                                    (program, index) => (
                                      <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                      >
                                        <td className="border border-gray-300 px-4 py-3 font-medium">
                                          {program.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">
                                          {formatCurrency(program.value)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">
                                          {Math.round(
                                            (program.value /
                                              yearData.programExpenses) *
                                              100
                                          )}
                                          %
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center">
                                          <Badge className="bg-main-blue text-white">
                                            Active
                                          </Badge>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                          {/* Monthly Revenue vs Expenses */}
                          <Card className="py-6">
                            <CardHeader>
                              <CardTitle>Monthly Revenue vs Expenses</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ChartContainer config={chartConfig}>
                                <BarChart data={yearData.monthlyData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <ChartTooltip
                                    content={
                                      <ChartTooltipContent
                                        formatter={(value) =>
                                          formatCurrency(Number(value))
                                        }
                                      />
                                    }
                                  />
                                  <Bar
                                    dataKey="revenue"
                                    fill={chartConfig.revenue.color}
                                    name="Revenue"
                                  />
                                  <Bar
                                    dataKey="expenses"
                                    fill={chartConfig.expenses.color}
                                    name="Expenses"
                                  />
                                </BarChart>
                              </ChartContainer>
                            </CardContent>
                          </Card>

                          {/* Program Breakdown */}
                          <Card className="py-6">
                            <CardHeader>
                              <CardTitle>
                                Program Expenditure Breakdown
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ChartContainer config={chartConfig}>
                                <PieChart>
                                  <Pie
                                    data={yearData.programBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                      `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    dataKey="value"
                                  >
                                    {yearData.programBreakdown.map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={entry.color}
                                        />
                                      )
                                    )}
                                  </Pie>
                                  <ChartTooltip
                                    content={
                                      <ChartTooltipContent
                                        formatter={(value) =>
                                          formatCurrency(Number(value))
                                        }
                                      />
                                    }
                                  />
                                </PieChart>
                              </ChartContainer>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Compliance Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader>
                              <CardTitle className="text-main-blue dark:text-main-blue/90 flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Tax-Exempt Status
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <span className="font-medium text-main-blue dark:text-main-blue/80">
                                    IRS Letter of Determination
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-main-blue text-main-blue hover:bg-main-blue hover:text-white"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <span className="font-medium text-main-blue dark:text-main-blue/80">
                                    Form 1023
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-main-blue text-main-blue hover:bg-main-blue hover:text-white"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="py-6 bg-main-blue/10 dark:bg-main-blue/20 border-main-blue/20 dark:border-main-blue">
                            <CardHeader>
                              <CardTitle className="text-main-blue dark:text-main-blue/90 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Financial Compliance
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <div className="w-3 h-3 bg-main-blue rounded-full"></div>
                                  <span className="text-sm text-main-blue dark:text-main-blue/80">
                                    Annual financial statements audited
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <div className="w-3 h-3 bg-main-blue rounded-full"></div>
                                  <span className="text-sm text-main-blue dark:text-main-blue/80">
                                    IRS Form 990 filed annually
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <div className="w-3 h-3 bg-main-blue rounded-full"></div>
                                  <span className="text-sm text-main-blue dark:text-main-blue/80">
                                    State charity registration current
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <div className="w-3 h-3 bg-main-blue rounded-full"></div>
                                  <span className="text-sm text-main-blue dark:text-main-blue/80">
                                    Board governance policies in place
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </section>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
