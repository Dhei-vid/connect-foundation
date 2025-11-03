"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Search,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  HandCoins,
  Image as ImageIcon,
  Filter,
  CheckCircle,
  Calendar,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AddSuccessStoryModal } from "@/components/admin/add-success-story-modal";
import {
  getSuccessStories,
  getSuccessStoryStats,
  deleteSuccessStory,
} from "@/firebase/success-stories";
import { getOrphanages } from "@/firebase/orphanages";
import { getIssues } from "@/firebase/issues";
import { toast } from "sonner";
import type { SuccessStory, Orphanage, Issue } from "@/common/types";
import { formatCurrency } from "@/common/helpers";

import ViewSuccessStoryModal from "@/components/admin/success-story/view-modal";

export default function SuccessStoriesPage() {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    totalBeneficiaries: 0,
    totalCost: 0,
    byOrphanage: {} as { [orphanageId: string]: number },
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrphanage, setFilterOrphanage] = useState("all");
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "by-orphanage">("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAViewModal, setShowViewModal] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Use real Firebase data
      const [storiesData, orphanagesData, issuesData, statsData] =
        await Promise.all([
          getSuccessStories(),
          getOrphanages(),
          getIssues(),
          getSuccessStoryStats(),
        ]);
      setSuccessStories(storiesData);
      setOrphanages(orphanagesData);
      setIssues(issuesData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load success stories");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await deleteSuccessStory(storyId);
      await loadData();
      setSelectedStory(null);
      toast.success("Success story deleted successfully");
    } catch (error) {
      console.error("Error deleting success story:", error);
      toast.error("Failed to delete success story");
    }
  };

  const filteredStories = successStories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.orphanageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.impact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrphanage =
      filterOrphanage === "all" || story.orphanageId === filterOrphanage;

    return matchesSearch && matchesOrphanage;
  });

  const getOrphanageName = (orphanageId: string) => {
    const orphanage = orphanages.find((o) => o.id === orphanageId);
    return orphanage?.name || "Unknown Orphanage";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Success Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Showcasing orphanages we&apos;ve helped reach their funding targets
            and the impact created
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Success Story
          </Button>
          <Button
            onClick={() =>
              setViewMode(viewMode === "all" ? "by-orphanage" : "all")
            }
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            {viewMode === "all" ? "Group by Orphanage" : "Show All"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
            <div className="text-2xl font-bold">{stats.totalBeneficiaries}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCost)}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphanages</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.byOrphanage).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search success stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="col-span-1">
              <SelectField
                value={filterOrphanage}
                placeholder="Orphanage"
                onValueChange={(value: string) => setFilterOrphanage(value)}
              >
                <SelectItem value="all">All Orphanages</SelectItem>
                {orphanages.map((orphanage) => (
                  <SelectItem key={orphanage.id} value={orphanage.id}>
                    {orphanage.name}
                  </SelectItem>
                ))}
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories List */}
      {viewMode === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const mainImage =
              story.images && story.images.length > 0
                ? story.images[0]
                : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80";

            return (
              <Card
                key={story.id}
                className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={mainImage}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white border-0 shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>

                  {/* Beneficiaries Count */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 rounded-full px-3 py-1.5 shadow-md">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {story.beneficiaries} beneficiaries
                    </span>
                  </div>

                  {/* Images Count Badge */}
                  {story.images && story.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1 shadow-md">
                      <ImageIcon className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white">
                        {story.images.length}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {story.orphanageName}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                      {story.description}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Cost:
                        </span>
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(story.cost)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Completed:
                        </span>
                        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(story.completedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowViewModal(true);
                        setSelectedStory(story);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingStory(story);
                        setShowAddModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <ConfirmationDialog
                      title={story.title}
                      description={`Are you sure you want to delete "${story.title}"? This action cannot be undone.`}
                      variant="destructive"
                      onConfirm={() => handleDeleteStory(story.id)}
                    >
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </ConfirmationDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            filteredStories.reduce((acc, story) => {
              if (!acc[story.orphanageId]) {
                acc[story.orphanageId] = [];
              }
              acc[story.orphanageId].push(story);
              return acc;
            }, {} as { [key: string]: SuccessStory[] })
          ).map(([orphanageId, stories]) => (
            <Card key={orphanageId} className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {getOrphanageName(orphanageId)}
                  <Badge className="ml-2">
                    {stories.length}{" "}
                    {stories.length === 1 ? "Story" : "Stories"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stories.map((story) => (
                    <Card
                      key={story.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-sm">
                            {story.title}
                          </h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            Completed
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {story.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">
                              Beneficiaries:
                            </span>
                            <div className="font-medium">
                              {story.beneficiaries}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <div className="font-medium">
                              {formatCurrency(story.cost)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedStory(story);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              setEditingStory(story);
                              setShowAddModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Success story Modal */}
      <ViewSuccessStoryModal
        isOpen={showAViewModal}
        sucessData={selectedStory}
        issues={issues}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStory(null);
        }}
        onEdit={() => {
          const currentSelected = selectedStory;
          setSelectedStory(null);
          setShowViewModal(false);
          setEditingStory(currentSelected);
          setShowAddModal(true);
        }}
        onDelete={(id: string) => {
          handleDeleteStory(id);
          setSelectedStory(null);
        }}
      />

      {/* Add/Edit Success Story Modal */}
      <AddSuccessStoryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStory(null);
        }}
        onSuccess={() => {
          loadData();
          setSelectedStory(null);
        }}
        editingStory={editingStory}
      />
    </div>
  );
}
