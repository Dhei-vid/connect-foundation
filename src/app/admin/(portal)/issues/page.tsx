/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockIssues = [
  {
    id: "1",
    orphanageId: "1",
    orphanageName: "Hope Children's Home",
    title: "Urgent Medical Supplies Needed",
    description:
      "We need immediate medical supplies including antibiotics, pain relievers, and first aid materials for our children who are currently sick.",
    category: "medical" as const,
    priority: "urgent" as const,
    status: "open" as const,
    images: ["/api/placeholder/400/300"],
    estimatedCost: 5000,
    raisedAmount: 2500,
    deadline: new Date("2024-02-15"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    resolvedAt: undefined,
  },
  {
    id: "2",
    orphanageId: "2",
    orphanageName: "Sunshine Orphanage",
    title: "Educational Materials Request",
    description:
      "We need textbooks, notebooks, pencils, and other educational materials for our 32 children to continue their studies.",
    category: "education" as const,
    priority: "high" as const,
    status: "in-progress" as const,
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    estimatedCost: 3000,
    raisedAmount: 3000,
    deadline: new Date("2024-02-01"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
    resolvedAt: undefined,
  },
  {
    id: "3",
    orphanageId: "3",
    orphanageName: "Little Angels Home",
    title: "Food Supplies Shortage",
    description:
      "We are running low on food supplies and need immediate assistance to feed our 28 children for the next month.",
    category: "food" as const,
    priority: "high" as const,
    status: "resolved" as const,
    images: ["/api/placeholder/400/300"],
    estimatedCost: 2000,
    raisedAmount: 2000,
    deadline: new Date("2024-01-25"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-22"),
    resolvedAt: new Date("2024-01-22"),
  },
  {
    id: "4",
    orphanageId: "4",
    orphanageName: "Grace Orphanage",
    title: "Roof Repair Needed",
    description:
      "Our main building roof is leaking and needs immediate repair before the rainy season starts.",
    category: "shelter" as const,
    priority: "medium" as const,
    status: "open" as const,
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
    ],
    estimatedCost: 8000,
    raisedAmount: 1200,
    deadline: new Date("2024-03-01"),
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
    resolvedAt: undefined,
  },
  {
    id: "5",
    orphanageId: "1",
    orphanageName: "Hope Children's Home",
    title: "Clothing Donation Request",
    description:
      "Our children need new clothes for the upcoming school year. We need uniforms, casual wear, and shoes.",
    category: "clothing" as const,
    priority: "low" as const,
    status: "closed" as const,
    images: ["/api/placeholder/400/300"],
    estimatedCost: 4000,
    raisedAmount: 4000,
    deadline: new Date("2024-01-30"),
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-28"),
    resolvedAt: new Date("2024-01-28"),
  },
];

const categoryColors = {
  medical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  education: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  shelter:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  clothing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function IssuesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "open" | "in-progress" | "resolved" | "closed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high" | "urgent"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "medical" | "education" | "food" | "shelter" | "clothing" | "other"
  >("all");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.orphanageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || issue.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || issue.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || issue.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    // TODO: Implement status update logic
    console.log("Update status:", issueId, newStatus);
  };

  const handleResolve = (issueId: string) => {
    // TODO: Implement resolve logic
    console.log("Resolve issue:", issueId);
  };

  const totalRaised = mockIssues.reduce(
    (sum, issue) => sum + issue.raisedAmount,
    0
  );
  const totalNeeded = mockIssues.reduce(
    (sum, issue) => sum + issue.estimatedCost,
    0
  );

  // const urgentIssues = mockIssues.filter(
  //   (issue) =>
  //     issue.priority === "urgent" &&
  //     issue.status !== "resolved" &&
  //     issue.status !== "closed"
  // ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Issues & Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage orphanage requests and track their progress
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Issue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIssues.length}</div>
            <p className="text-xs text-muted-foreground">{0} urgent</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockIssues.filter((i) => i.status === "open").length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockIssues.filter((i) => i.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                mockIssues.filter(
                  (i) => i.status === "resolved" || i.status === "closed"
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalRaised.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Raised
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${totalNeeded.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Needed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((totalRaised / totalNeeded) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="medical">Medical</option>
                <option value="education">Education</option>
                <option value="food">Food</option>
                <option value="shelter">Shelter</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <Badge className={categoryColors[issue.category]}>
                      {issue.category}
                    </Badge>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                    <Badge className={statusColors[issue.status]}>
                      {issue.status}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    {issue.orphanageName}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <div className="font-medium">
                        ${issue.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Raised:</span>
                      <div className="font-medium">
                        ${issue.raisedAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <div className="font-medium">
                        {Math.round(
                          (issue.raisedAmount / issue.estimatedCost) * 100
                        )}
                        %
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <div className="font-medium">
                        {issue.deadline?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {issue.status === "open" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(issue.id, "in-progress")
                      }
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {issue.status === "in-progress" && (
                    <Button size="sm" onClick={() => handleResolve(issue.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedIssue.title}
                    <Badge
                      className={
                        categoryColors[
                          selectedIssue.category as keyof typeof categoryColors
                        ]
                      }
                    >
                      {selectedIssue.category}
                    </Badge>
                    <Badge
                      className={
                        priorityColors[
                          selectedIssue.priority as keyof typeof priorityColors
                        ]
                      }
                    >
                      {selectedIssue.priority}
                    </Badge>
                    <Badge
                      className={
                        statusColors[
                          selectedIssue.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {selectedIssue.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    {selectedIssue.orphanageName}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIssue(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedIssue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Financial Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-medium">
                        ${selectedIssue.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Raised Amount:</span>
                      <span className="font-medium">
                        ${selectedIssue.raisedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-medium">
                        $
                        {(
                          selectedIssue.estimatedCost -
                          selectedIssue.raisedAmount
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (selectedIssue.raisedAmount /
                              selectedIssue.estimatedCost) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {selectedIssue.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {selectedIssue.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                    {selectedIssue.deadline && (
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className="font-medium">
                          {selectedIssue.deadline.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedIssue.resolvedAt && (
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-medium">
                          {selectedIssue.resolvedAt.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedIssue.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIssue.images.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                        >
                          <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedIssue.status === "open" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedIssue.id, "in-progress");
                      setSelectedIssue(null);
                    }}
                    className="flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start Working
                  </Button>
                )}
                {selectedIssue.status === "in-progress" && (
                  <Button
                    onClick={() => {
                      handleResolve(selectedIssue.id);
                      setSelectedIssue(null);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
