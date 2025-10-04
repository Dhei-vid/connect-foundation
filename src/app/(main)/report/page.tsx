"use client";

import { useState } from "react";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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
  Calendar,
  Download,
  Eye,
  Building2,
  Target,
  BookOpen,
  Stethoscope,
  Home,
  Utensils,
  GraduationCap,
  Baby,
  Smile,
} from "lucide-react";
import Image from "next/image";

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
      { name: "Education", value: 600000, color: "#3B82F6" },
      { name: "Healthcare", value: 400000, color: "#10B981" },
      { name: "Food & Shelter", value: 200000, color: "#F59E0B" },
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
      { name: "Education", value: 500000, color: "#3B82F6" },
      { name: "Healthcare", value: 350000, color: "#10B981" },
      { name: "Food & Shelter", value: 150000, color: "#F59E0B" },
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
      { name: "Education", value: 450000, color: "#3B82F6" },
      { name: "Healthcare", value: 300000, color: "#10B981" },
      { name: "Food & Shelter", value: 150000, color: "#F59E0B" },
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

// Chart configurations with vibrant NGO colors
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10B981", // Emerald green
  },
  expenses: {
    label: "Expenses",
    color: "#EF4444", // Red
  },
  donations: {
    label: "Donations",
    color: "#3B82F6", // Blue
  },
  education: {
    label: "Education",
    color: "#8B5CF6", // Purple
  },
  healthcare: {
    label: "Healthcare",
    color: "#06B6D4", // Cyan
  },
  foodShelter: {
    label: "Food & Shelter",
    color: "#F59E0B", // Amber
  },
};

// Impact images for visual appeal
const impactImages = {
  education:
    "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg",
  healthcare:
    "https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg",
  food: "https://images.pexels.com/photos/6994885/pexels-photo-6994885.jpeg",
  children:
    "https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg",
  orphanage:
    "https://images.pexels.com/photos/5029919/pexels-photo-5029919.jpeg",
  volunteers:
    "https://images.pexels.com/photos/6646852/pexels-photo-6646852.jpeg",
};

export default function Page() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [activeTab, setActiveTab] = useState("overview");

  const currentData = financialData[selectedYear as keyof typeof financialData];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-NG").format(num);
  };

  return (
    <div className="min-h-screen">
      <HeroLayout bgImage="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg">
        <TopNav />
        <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Financial <span className="text-yellow-300">Reports</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Transparency in Action - See how your donations transform lives in
              orphanages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Impact Stories
              </Button>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Report Navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Financial Year {selectedYear}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive financial transparency report
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["overview", "financials", "programs", "impact", "audit"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                      : "bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-green-300"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(financialData[selectedYear].totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Program Efficiency</p>
                  <p className="text-xl font-bold text-blue-600">
                    {Math.round((financialData[selectedYear].programExpenses / financialData[selectedYear].totalExpenses) * 100)}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Children Helped</p>
                  <p className="text-xl font-bold text-purple-600">{formatNumber(financialData[selectedYear].impactMetrics.childrenHelped)}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orphanages Supported</p>
                  <p className="text-xl font-bold text-orange-600">{financialData[selectedYear].impactMetrics.orphanagesSupported}</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="py-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                    Total Revenue
                  </CardTitle>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(currentData.totalRevenue)}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +12% from last year
                  </p>
                </CardContent>
              </Card>

              <Card className="py-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Total Expenses
                  </CardTitle>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(currentData.totalExpenses)}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    +8% from last year
                  </p>
                </CardContent>
              </Card>

              <Card className="py-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Net Income
                  </CardTitle>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {formatCurrency(currentData.netIncome)}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    +20% from last year
                  </p>
                </CardContent>
              </Card>

              <Card className="py-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30 border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Children Helped
                  </CardTitle>
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {formatNumber(currentData.impactMetrics.childrenHelped)}
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    +25% from last year
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary Table */}
            <Card className="py-6 mb-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/30 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
                  Financial Summary Report - {selectedYear}
                </CardTitle>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Comprehensive breakdown of all financial activities and program expenditures
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount (NGN)</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Percentage</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Revenue Section */}
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <td colSpan={4} className="border border-gray-300 px-4 py-2 font-bold text-green-800 dark:text-green-200">
                          REVENUE SOURCES
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Individual Donations</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.donations)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.donations / currentData.totalRevenue) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Foundation Grants</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.grants)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.grants / currentData.totalRevenue) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </td>
                      </tr>
                      <tr className="bg-green-100 dark:bg-green-900/30 font-bold">
                        <td className="border border-gray-300 px-4 py-3">TOTAL REVENUE</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.totalRevenue)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">100%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-green-600 text-white">Complete</Badge>
                        </td>
                      </tr>

                      {/* Expenses Section */}
                      <tr className="bg-red-50 dark:bg-red-900/20">
                        <td colSpan={4} className="border border-gray-300 px-4 py-2 font-bold text-red-800 dark:text-red-200">
                          EXPENDITURES
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Program Expenses</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.programExpenses)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.programExpenses / currentData.totalExpenses) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-blue-500 text-white">Excellent</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Administrative Costs</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.administrativeExpenses)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.administrativeExpenses / currentData.totalExpenses) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-yellow-500 text-white">Good</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">Fundraising Costs</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.fundraisingExpenses)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.fundraisingExpenses / currentData.totalExpenses) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-green-500 text-white">Efficient</Badge>
                        </td>
                      </tr>
                      <tr className="bg-red-100 dark:bg-red-900/30 font-bold">
                        <td className="border border-gray-300 px-4 py-3">TOTAL EXPENSES</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(currentData.totalExpenses)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">100%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-red-600 text-white">Complete</Badge>
                        </td>
                      </tr>

                      {/* Net Income */}
                      <tr className="bg-purple-50 dark:bg-purple-900/20">
                        <td colSpan={4} className="border border-gray-300 px-4 py-2 font-bold text-purple-800 dark:text-purple-200">
                          NET RESULTS
                        </td>
                      </tr>
                      <tr className="bg-purple-100 dark:bg-purple-900/30 font-bold">
                        <td className="border border-gray-300 px-4 py-3">NET INCOME</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-mono text-purple-700 dark:text-purple-300">{formatCurrency(currentData.netIncome)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((currentData.netIncome / currentData.totalRevenue) * 100)}%</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge className="bg-purple-600 text-white">Surplus</Badge>
                        </td>
                      </tr>

                      {/* Program Breakdown */}
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <td colSpan={4} className="border border-gray-300 px-4 py-2 font-bold text-blue-800 dark:text-blue-200">
                          PROGRAM ALLOCATION
                        </td>
                      </tr>
                      {currentData.programBreakdown.map((program, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">{program.name}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right font-mono">{formatCurrency(program.value)}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right">{Math.round((program.value / currentData.programExpenses) * 100)}%</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <Badge className="bg-blue-500 text-white">Active</Badge>
                          </td>
                        </tr>
                      ))}
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
                    <BarChart data={currentData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Bar
                        dataKey="revenue"
                        fill="var(--color-revenue)"
                        name="Revenue"
                      />
                      <Bar
                        dataKey="expenses"
                        fill="var(--color-expenses)"
                        name="Expenses"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Program Breakdown */}
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Program Expenditure Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={currentData.programBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {currentData.programBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center py-6 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/30 border-indigo-200 dark:border-indigo-800">
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Image
                      src={impactImages.orphanage}
                      alt="Orphanage"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {currentData.impactMetrics.orphanagesSupported}
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Orphanages Supported
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center py-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/30 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Image
                      src={impactImages.volunteers}
                      alt="Volunteers"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {currentData.impactMetrics.volunteers}
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Active Volunteers
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center py-6 bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/30 border-violet-200 dark:border-violet-800">
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Image
                      src={impactImages.education}
                      alt="Projects"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                    {currentData.impactMetrics.projectsCompleted}
                  </div>
                  <p className="text-sm text-violet-600 dark:text-violet-400">
                    Projects Completed
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center py-6 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/30 border-rose-200 dark:border-rose-800">
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Image
                      src={impactImages.children}
                      alt="Children"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                    {formatNumber(currentData.impactMetrics.childrenHelped)}
                  </div>
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    Children Helped
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Financials Tab */}
      {activeTab === "financials" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="py-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Donations</span>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        {formatCurrency(currentData.donations)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Grants</span>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        {formatCurrency(currentData.grants)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-700" />
                        <span className="font-bold text-green-800">
                          Total Revenue
                        </span>
                      </div>
                      <Badge className="bg-green-600 text-white font-bold">
                        {formatCurrency(currentData.totalRevenue)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Monthly Donations Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart data={currentData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="donations"
                        stroke="var(--color-donations)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Programs Tab */}
      {activeTab === "programs" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="py-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Program Expenses</span>
                      </div>
                      <Badge className="bg-purple-500 text-white">
                        {formatCurrency(currentData.programExpenses)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Administrative</span>
                      </div>
                      <Badge className="bg-gray-500 text-white">
                        {formatCurrency(currentData.administrativeExpenses)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Fundraising</span>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        {formatCurrency(currentData.fundraisingExpenses)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-300">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-700" />
                        <span className="font-bold text-blue-800">
                          Total Expenses
                        </span>
                      </div>
                      <Badge className="bg-blue-600 text-white font-bold">
                        {formatCurrency(currentData.totalExpenses)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Expense Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Program Expenses</span>
                        <span>
                          {Math.round(
                            (currentData.programExpenses /
                              currentData.totalExpenses) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (currentData.programExpenses /
                                currentData.totalExpenses) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Administrative</span>
                        <span>
                          {Math.round(
                            (currentData.administrativeExpenses /
                              currentData.totalExpenses) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (currentData.administrativeExpenses /
                                currentData.totalExpenses) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fundraising</span>
                        <span>
                          {Math.round(
                            (currentData.fundraisingExpenses /
                              currentData.totalExpenses) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (currentData.fundraisingExpenses /
                                currentData.totalExpenses) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Impact Tab */}
      {activeTab === "impact" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(currentData.impactMetrics).map(
                ([key, value], index) => {
                  const colors = [
                    "from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/30 border-rose-200 dark:border-rose-800",
                    "from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/30 border-emerald-200 dark:border-emerald-800",
                    "from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/30 border-violet-200 dark:border-violet-800",
                    "from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/30 border-indigo-200 dark:border-indigo-800",
                  ];
                  const textColors = [
                    "text-rose-700 dark:text-rose-300",
                    "text-emerald-700 dark:text-emerald-300",
                    "text-violet-700 dark:text-violet-300",
                    "text-indigo-700 dark:text-indigo-300",
                  ];
                  const iconColors = [
                    "bg-rose-500",
                    "bg-emerald-500",
                    "bg-violet-500",
                    "bg-indigo-500",
                  ];
                  const icons = [Heart, Users, Target, Building2];
                  const Icon = icons[index];

                  return (
                    <Card
                      key={key}
                      className={`text-center py-6 bg-gradient-to-br ${colors[index]}`}
                    >
                      <CardHeader>
                        <CardTitle
                          className={`capitalize ${textColors[index]} flex items-center justify-center gap-2`}
                        >
                          <Icon className="h-5 w-5" />
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-3xl font-bold ${textColors[index]} mb-2`}
                        >
                          {typeof value === "number"
                            ? formatNumber(value)
                            : value}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {key === "childrenHelped" &&
                            "Lives touched through our programs"}
                          {key === "orphanagesSupported" &&
                            "Partner organizations"}
                          {key === "volunteers" && "Dedicated volunteers"}
                          {key === "projectsCompleted" &&
                            "Successful initiatives"}
                        </p>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Audited Financial Statements
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Independent audits ensure financial transparency and accountability. 
                All our financial statements are audited by certified public accountants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {years.map((year) => (
                <Card key={year} className="py-6 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-indigo-800 dark:text-indigo-200">
                      Fiscal Year {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Revenue</p>
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        {formatCurrency(financialData[year].totalRevenue)}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        PDF Report
                      </Button>
                      <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Online
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="py-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Tax-Exempt Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <span className="font-medium">IRS Letter of Determination</span>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                      <span className="font-medium">Form 1023</span>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="py-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Financial Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Annual financial statements audited</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">IRS Form 990 filed annually</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">State charity registration current</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Board governance policies in place</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="mt-8 py-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/30 border-gray-200 dark:border-gray-800">
              <CardContent className="text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Questions About Our Financials?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We're committed to transparency. Contact us for any questions about our financial reports.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Contact Financial Team
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
