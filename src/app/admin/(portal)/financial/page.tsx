/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Receipt,
  Wallet,
  ArrowRightLeft,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewDatePicker } from "@/components/ui/datepicker";

import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import {
  InputField,
  TextareaField,
  SelectField,
} from "@/components/ui/form-field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialStats,
  deleteFinancialRecord,
  updateFinancialRecord,
} from "@/firebase/financials";
import type { FinancialRecord } from "@/common/types";
import { formatCurrency } from "@/common/helpers";

// Mock data - in real app, this would come from your database
const mockFinancialRecords = [
  {
    id: "1",
    type: "income" as const,
    category: "Donations",
    description: "Monthly donation from corporate sponsor",
    amount: 50000,
    date: new Date("2024-01-15"),
    receiptURL: "/api/receipts/receipt_1.pdf",
    notes: "ABC Corporation monthly sponsorship",
  },
  {
    id: "2",
    type: "expense" as const,
    category: "Medical Supplies",
    description: "Purchase of medical equipment for Hope Children's Home",
    amount: 15000,
    date: new Date("2024-01-20"),
    receiptURL: "/api/receipts/receipt_2.pdf",
    notes: "Urgent medical supplies for children",
  },
  {
    id: "3",
    type: "income" as const,
    category: "Individual Donations",
    description: "Individual donor contributions",
    amount: 25000,
    date: new Date("2024-01-18"),
    receiptURL: "/api/receipts/receipt_3.pdf",
    notes: "Multiple individual donations",
  },
  {
    id: "4",
    type: "expense" as const,
    category: "Education",
    description: "School supplies and textbooks",
    amount: 8000,
    date: new Date("2024-01-22"),
    receiptURL: "/api/receipts/receipt_4.pdf",
    notes: "Educational materials for 3 orphanages",
  },
  {
    id: "5",
    type: "expense" as const,
    category: "Administrative",
    description: "Office supplies and utilities",
    amount: 3000,
    date: new Date("2024-01-25"),
    receiptURL: "/api/receipts/receipt_5.pdf",
    notes: "Monthly administrative expenses",
  },
  {
    id: "6",
    type: "income" as const,
    category: "Grants",
    description: "Government grant for child welfare",
    amount: 100000,
    date: new Date("2024-01-10"),
    receiptURL: "/api/receipts/receipt_6.pdf",
    notes: "Annual government grant",
  },
];

const incomeCategories = [
  "Donations",
  "Individual Donations",
  "Grants",
  "Fundraising",
  "Other Income",
];
const expenseCategories = [
  "Medical Supplies",
  "Education",
  "Food",
  "Shelter",
  "Administrative",
  "Transportation",
  "Other Expenses",
];

export default function FinancialPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "month" | "quarter" | "year"
  >("month");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recordType, setRecordType] = useState<"income" | "expense">("income");
  const [recordCategory, setRecordCategory] = useState("");
  const [recordDescription, setRecordDescription] = useState("");
  const [recordAmount, setRecordAmount] = useState("");
  const [recordDate, setRecordDate] = useState<Date | undefined>(undefined);
  const [recordNotes, setRecordNotes] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(
    []
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, [useMockData]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      if (useMockData) {
        // Use mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFinancialRecords(mockFinancialRecords as any);
      } else {
        // Load from Firebase
        const records = await getFinancialRecords();
        setFinancialRecords(records);
      }
    } catch (error) {
      console.error("Error loading financial data:", error);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial summary
  const totalIncome = financialRecords
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = financialRecords
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  // Filter records based on selected filters
  const filteredRecords = financialRecords.filter((record) => {
    if (filterType !== "all" && record.type !== filterType) return false;
    return true;
  });

  // Calculate category breakdown
  const incomeByCategory = incomeCategories.map((category) => ({
    category,
    amount: financialRecords
      .filter(
        (record) => record.type === "income" && record.category === category
      )
      .reduce((sum, record) => sum + record.amount, 0),
  }));

  const expensesByCategory = expenseCategories.map((category) => ({
    category,
    amount: financialRecords
      .filter(
        (record) => record.type === "expense" && record.category === category
      )
      .reduce((sum, record) => sum + record.amount, 0),
  }));

  const handleAddRecord = async () => {
    try {
      // Validation
      if (
        !recordCategory ||
        !recordDescription ||
        !recordAmount ||
        !recordDate
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const amount = parseFloat(recordAmount);

      // Check if expense exceeds available funds
      if (recordType === "expense") {
        const availableFunds = totalIncome - totalExpenses;
        
        if (amount > availableFunds) {
          toast.error(
            `Insufficient funds! Available: ${formatCurrency(availableFunds)}. Requested: ${formatCurrency(amount)}`,
            {
              duration: 5000,
              description: "The expense amount exceeds the available balance from donations. Please reduce the amount or wait for more donations.",
            }
          );
          return;
        }

        // Warning if expense uses significant portion of funds
        const percentageOfFunds = (amount / availableFunds) * 100;
        if (percentageOfFunds > 50 && availableFunds > 0) {
          toast.warning(
            `This expense will use ${percentageOfFunds.toFixed(1)}% of available funds`,
            {
              duration: 4000,
            }
          );
        }
      }

      setSubmitting(true);

      const newRecord: Omit<FinancialRecord, "id"> = {
        type: recordType,
        category: recordCategory,
        description: recordDescription,
        amount: amount,
        date: recordDate,
        notes: recordNotes || undefined,
      };

      if (useMockData) {
        // For mock data, just log
        console.log("Mock: Add financial record", newRecord);
        toast.success("Financial record added (mock mode)");
      } else {
        // Save to Firebase
        await createFinancialRecord(newRecord);
        toast.success("Financial record added successfully");
        await loadFinancialData();
      }

      // Reset form
      setRecordType("income");
      setRecordCategory("");
      setRecordDescription("");
      setRecordAmount("");
      setRecordDate(undefined);
      setRecordNotes("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add financial record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRecord = async (recordId: string) => {
    try {
      // TODO: Implement edit form
      console.log("Edit record:", recordId);
      toast.info("Edit functionality coming soon");
    } catch (error) {
      console.error("Error editing record:", error);
      toast.error("Failed to edit record");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      if (useMockData) {
        console.log("Mock: Delete record:", recordId);
        toast.success("Record deleted (mock mode)");
      } else {
        await deleteFinancialRecord(recordId);
        toast.success("Financial record deleted successfully");
        await loadFinancialData();
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log("Export financial data");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="py-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Financial Records Skeleton */}
        <Card className="py-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Financial Transparency
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track income, expenses, and maintain financial transparency
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={useMockData ? "outline" : "default"}
            onClick={() => setUseMockData(!useMockData)}
            size="sm"
          >
            {useMockData ? "Mock Data" : "Live Data"}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netIncome >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {netIncome >= 0 ? "Surplus" : "Deficit"}
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efficiency Ratio
            </CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalIncome > 0
                ? Math.round(
                    ((totalIncome - totalExpenses) / totalIncome) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Funds to programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Flow Visualization */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Financial Flow & Transparency
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Visual Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income */}
            <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl border-2 border-green-200 dark:border-green-800">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                TOTAL INCOME
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                From donations & grants
              </p>
            </div>

            {/* Arrow/Flow Indicator */}
            <div className="flex items-center justify-center">
              <div className="text-center space-y-3">
                <ArrowRightLeft className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Utilization Rate
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalIncome > 0
                      ? Math.round((totalExpenses / totalIncome) * 100)
                      : 0}
                    %
                  </div>
                  <Progress
                    value={
                      totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
                    }
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500">of donations utilized</p>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-xl border-2 border-red-200 dark:border-red-800">
              <TrendingDown className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                TOTAL EXPENSES
              </h3>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Invested in programs
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Balance & Reserves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Available Balance</h3>
                </div>
                <Badge
                  className={netIncome >= 0 ? "bg-green-500" : "bg-red-500"}
                >
                  {netIncome >= 0 ? "Surplus" : "Deficit"}
                </Badge>
              </div>
              <div
                className={`text-4xl font-bold mb-2 ${
                  netIncome >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(netIncome))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {netIncome >= 0
                  ? "Available for future programs and reserves"
                  : "Indicates overspending - review expenses"}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl border">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Efficiency Score</h3>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {totalIncome > 0
                  ? Math.round(
                      ((totalIncome - totalExpenses) / totalIncome) * 100
                    )
                  : 0}
                %
              </div>
              <Progress
                value={
                  totalIncome > 0
                    ? ((totalIncome - totalExpenses) / totalIncome) * 100
                    : 0
                }
                className="h-3 mb-3"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Percentage of funds remaining for programs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === "quarter" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("quarter")}
            >
              This Quarter
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("year")}
            >
              This Year
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Income Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {incomeByCategory
                .filter((item) => item.amount > 0)
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage =
                    totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-sm font-bold text-green-600 min-w-[100px] text-right">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-3 bg-green-100 dark:bg-green-900"
                      />
                    </div>
                  );
                })}
              {incomeByCategory.filter((item) => item.amount > 0).length ===
                0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No income recorded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses Breakdown */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {expensesByCategory
                .filter((item) => item.amount > 0)
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage =
                    totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-sm font-bold text-red-600 min-w-[100px] text-right">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-3 bg-red-100 dark:bg-red-900"
                      />
                    </div>
                  );
                })}
              {expensesByCategory.filter((item) => item.amount > 0).length ===
                0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No expenses recorded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Records */}
      <Card className="py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Records</CardTitle>
            <div className="flex gap-2">
              <SelectField
                value={filterType}
                onValueChange={(value) => setFilterType(value as any)}
              >
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectField>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">
                      {record.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          record.type === "income" ? "default" : "secondary"
                        }
                      >
                        {record.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{record.category}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">
                        {record.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          record.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.type === "income" ? "+" : "-"}{formatCurrency(record.amount).replace(/^₦/, "")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {record.receiptURL ? (
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400">No receipt</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRecord(record.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Record Details Dialog */}
      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Financial Record Details</DialogTitle>
            <DialogDescription>
              View detailed information about this financial record.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase">
                    Record Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Type:</span>
                      <Badge
                        variant={
                          selectedRecord.type === "income"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedRecord.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Category:</span>
                      <span className="font-medium text-sm">
                        {selectedRecord.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Amount:</span>
                      <span
                        className={`font-bold text-lg ${
                          selectedRecord.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(selectedRecord.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Date:</span>
                      <span className="font-medium text-sm">
                        {selectedRecord.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedRecord.description}
                  </p>
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase">
                    Notes
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}

              {selectedRecord.receiptURL && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase">
                    Receipt
                  </h3>
                  <Button variant="outline" size="sm">
                    <Receipt className="w-4 h-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedRecord) {
                  handleEditRecord(selectedRecord.id);
                  setSelectedRecord(null);
                }
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Financial Record</DialogTitle>
            <DialogDescription>
              Add a new income or expense record to maintain financial
              transparency.
            </DialogDescription>
          </DialogHeader>

          {/* Available Funds Alert for Expenses */}
          {recordType === "expense" && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Available Funds
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Expenses cannot exceed this amount
              </p>
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Transaction Type"
                value={recordType}
                onValueChange={(value: string) =>
                  setRecordType(value as "income" | "expense")
                }
              >
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectField>

              <SelectField
                label="Category"
                value={recordCategory}
                onValueChange={setRecordCategory}
              >
                {recordType === "income" ? (
                  <SelectGroup>
                    <SelectLabel>Income Categories</SelectLabel>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  <SelectGroup>
                    <SelectLabel>Expense Categories</SelectLabel>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectField>
            </div>

            <InputField
              label="Description"
              id="description"
              value={recordDescription}
              onChange={(e) => setRecordDescription(e.target.value)}
              placeholder="Enter description"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Amount ($)"
                id="amount"
                type="number"
                value={recordAmount}
                onChange={(e) => setRecordAmount(e.target.value)}
                placeholder="0.00"
              />

              <NewDatePicker
                label={"Date"}
                date={recordDate}
                setDate={setRecordDate}
              />
            </div>

            <TextareaField
              label="Notes (Optional)"
              id="notes"
              rows={3}
              value={recordNotes}
              onChange={(e) => setRecordNotes(e.target.value)}
              placeholder="Additional notes..."
            />

            <InputField
              label="Receipt Upload (Optional)"
              id="receipt"
              type="file"
              accept="image/*,.pdf"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRecord}
              disabled={
                submitting ||
                !recordCategory ||
                !recordDescription ||
                !recordAmount ||
                !recordDate
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {submitting ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
