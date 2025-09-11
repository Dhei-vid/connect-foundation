/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Heart,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockSuccessStories = [
  {
    id: "1",
    orphanageId: "1",
    orphanageName: "Hope Children's Home",
    title: "New School Building Completed",
    description:
      "We successfully built a new school building with 6 classrooms, a library, and computer lab for the children.",
    impact:
      "45 children now have access to quality education in a modern facility. The new building includes proper ventilation, electricity, and safety features.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    beneficiaries: 45,
    cost: 150000,
    completedAt: new Date("2024-01-15"),
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "2",
    orphanageId: "2",
    orphanageName: "Sunshine Orphanage",
    title: "Medical Equipment Donation",
    description:
      "Provided essential medical equipment including first aid supplies, basic diagnostic tools, and emergency medical kits.",
    impact:
      "All 32 children now have access to immediate medical care. The equipment has already helped treat 15 cases of minor injuries and illnesses.",
    images: ["/api/placeholder/400/300"],
    beneficiaries: 32,
    cost: 25000,
    completedAt: new Date("2024-01-10"),
    createdAt: new Date("2023-11-20"),
  },
  {
    id: "3",
    orphanageId: "3",
    orphanageName: "Little Angels Home",
    title: "Nutrition Program Implementation",
    description:
      "Established a comprehensive nutrition program with balanced meals, vitamin supplements, and nutrition education.",
    impact:
      "28 children now receive 3 nutritious meals daily. Health improvements observed in 90% of children within 3 months.",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
    ],
    beneficiaries: 28,
    cost: 18000,
    completedAt: new Date("2024-01-05"),
    createdAt: new Date("2023-11-15"),
  },
  {
    id: "4",
    orphanageId: "4",
    orphanageName: "Grace Orphanage",
    title: "Water Well Installation",
    description:
      "Installed a deep water well with purification system to provide clean, safe drinking water for the orphanage.",
    impact:
      "38 children and 9 staff members now have access to clean water 24/7. Reduced water-related illnesses by 80%.",
    images: ["/api/placeholder/400/300"],
    beneficiaries: 47,
    cost: 35000,
    completedAt: new Date("2023-12-20"),
    createdAt: new Date("2023-10-30"),
  },
];

export default function SuccessStoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredStories = mockSuccessStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.orphanageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBeneficiaries = mockSuccessStories.reduce(
    (sum, story) => sum + story.beneficiaries,
    0
  );
  const totalCost = mockSuccessStories.reduce(
    (sum, story) => sum + story.cost,
    0
  );

  const handleEdit = (storyId: string) => {
    // TODO: Implement edit logic
    console.log("Edit story:", storyId);
  };

  const handleDelete = (storyId: string) => {
    // TODO: Implement delete logic
    console.log("Delete story:", storyId);
  };

  const handleCreate = () => {
    // TODO: Implement create logic
    console.log("Create new story");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Success Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and showcase successful projects and their impact
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Success Story
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuccessStories.length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Beneficiaries
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeneficiaries}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCost.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockSuccessStories.filter(
                  (story) =>
                    story.completedAt.getMonth() === new Date().getMonth() &&
                    story.completedAt.getFullYear() === new Date().getFullYear()
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">stories completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search success stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <Card
            key={story.id}
            className="hover:shadow-lg transition-shadow py-4"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-1" />
                    {story.orphanageName}
                  </div>
                </div>
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {story.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    Beneficiaries
                  </span>
                  <span className="font-medium">{story.beneficiaries}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                    Cost
                  </span>
                  <span className="font-medium">
                    ${story.cost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    Completed
                  </span>
                  <span className="font-medium">
                    {story.completedAt.toLocaleDateString()}
                  </span>
                </div>
                {story.images.length > 0 && (
                  <div className="flex items-center text-sm">
                    <ImageIcon className="w-4 h-4 mr-1 text-gray-500" />
                    {story.images.length} image
                    {story.images.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedStory(story)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(story.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(story.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story Details Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedStory.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStory(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Building2 className="w-4 h-4 mr-1" />
                {selectedStory.orphanageName}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedStory.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Impact</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedStory.impact}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Beneficiaries:</span>
                      <span className="font-medium">
                        {selectedStory.beneficiaries}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-medium">
                        ${selectedStory.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium">
                        {selectedStory.completedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStory.images.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleEdit(selectedStory.id);
                    setSelectedStory(null);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Story
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedStory(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Success Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input placeholder="Enter story title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Orphanage
                </label>
                <Input placeholder="Select orphanage" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Describe the project..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Impact</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Describe the impact achieved..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Beneficiaries
                  </label>
                  <Input type="number" placeholder="Number of beneficiaries" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cost</label>
                  <Input type="number" placeholder="Total cost" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Create Story
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
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
