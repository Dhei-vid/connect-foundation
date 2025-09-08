/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Receipt,
  Filter,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    notes: "ABC Corporation monthly sponsorship"
  },
  {
    id: "2",
    type: "expense" as const,
    category: "Medical Supplies",
    description: "Purchase of medical equipment for Hope Children's Home",
    amount: 15000,
    date: new Date("2024-01-20"),
    receiptURL: "/api/receipts/receipt_2.pdf",
    notes: "Urgent medical supplies for children"
  },
  {
    id: "3",
    type: "income" as const,
    category: "Individual Donations",
    description: "Individual donor contributions",
    amount: 25000,
    date: new Date("2024-01-18"),
    receiptURL: "/api/receipts/receipt_3.pdf",
    notes: "Multiple individual donations"
  },
  {
    id: "4",
    type: "expense" as const,
    category: "Education",
    description: "School supplies and textbooks",
    amount: 8000,
    date: new Date("2024-01-22"),
    receiptURL: "/api/receipts/receipt_4.pdf",
    notes: "Educational materials for 3 orphanages"
  },
  {
    id: "5",
    type: "expense" as const,
    category: "Administrative",
    description: "Office supplies and utilities",
    amount: 3000,
    date: new Date("2024-01-25"),
    receiptURL: "/api/receipts/receipt_5.pdf",
    notes: "Monthly administrative expenses"
  },
  {
    id: "6",
    type: "income" as const,
    category: "Grants",
    description: "Government grant for child welfare",
    amount: 100000,
    date: new Date("2024-01-10"),
    receiptURL: "/api/receipts/receipt_6.pdf",
    notes: "Annual government grant"
  }
];

const incomeCategories = ["Donations", "Individual Donations", "Grants", "Fundraising", "Other Income"];
const expenseCategories = ["Medical Supplies", "Education", "Food", "Shelter", "Administrative", "Transportation", "Other Expenses"];

export default function FinancialPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate financial summary
  const totalIncome = mockFinancialRecords
    .filter(record => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);
  
  const totalExpenses = mockFinancialRecords
    .filter(record => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;

  // Filter records based on selected filters
  const filteredRecords = mockFinancialRecords.filter(record => {
    if (filterType !== "all" && record.type !== filterType) return false;
    return true;
  });

  // Calculate category breakdown
  const incomeByCategory = incomeCategories.map(category => ({
    category,
    amount: mockFinancialRecords
      .filter(record => record.type === "income" && record.category === category)
      .reduce((sum, record) => sum + record.amount, 0)
  }));

  const expensesByCategory = expenseCategories.map(category => ({
    category,
    amount: mockFinancialRecords
      .filter(record => record.type === "expense" && record.category === category)
      .reduce((sum, record) => sum + record.amount, 0)
  }));

  const handleAddRecord = () => {
    // TODO: Implement add record logic
    console.log("Add financial record");
    setShowAddModal(false);
  };

  const handleEditRecord = (recordId: string) => {
    // TODO: Implement edit record logic
    console.log("Edit record:", recordId);
  };

  const handleDeleteRecord = (recordId: string) => {
    // TODO: Implement delete record logic
    console.log("Delete record:", recordId);
  };

  const handleExport = () => {
    // TODO: Implement export logic
    console.log("Export financial data");
  };

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Ratio</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Funds to programs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
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

      {/* Income vs Expenses Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeByCategory.filter(item => item.amount > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(item.amount / totalIncome) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory.filter(item => item.amount > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(item.amount / totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Records</CardTitle>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Records</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
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
                  <tr key={record.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      {record.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={record.type === "income" ? "default" : "secondary"}>
                        {record.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {record.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">
                        {record.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${record.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {record.type === "income" ? "+" : "-"}${record.amount.toLocaleString()}
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

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Record Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Record Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <Badge variant={selectedRecord.type === "income" ? "default" : "secondary"}>
                        {selectedRecord.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{selectedRecord.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className={`font-medium ${selectedRecord.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {selectedRecord.type === "income" ? "+" : "-"}${selectedRecord.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {selectedRecord.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedRecord.description}
                  </p>
                </div>
              </div>

              {selectedRecord.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}

              {selectedRecord.receiptURL && (
                <div>
                  <h3 className="font-semibold mb-2">Receipt</h3>
                  <Button variant="outline">
                    <Receipt className="w-4 h-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleEditRecord(selectedRecord.id);
                    setSelectedRecord(null);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Record
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Add Financial Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option value="">Select category</option>
                    {incomeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input placeholder="Enter description" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea 
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddRecord} className="flex-1">
                  Add Record
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
