"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Filter,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { 
  getSuccessStories, 
  getSuccessStoriesByOrphanage, 
  getSuccessStoryStats,
  deleteSuccessStory 
} from "@/firebase/success-stories";
import { getOrphanages } from "@/firebase/orphanages";
import { getIssues } from "@/firebase/issues";
import { toast } from "sonner";
import { formatFirebaseDate } from "@/lib/date-utils";
import type { SuccessStory, Orphanage, Issue } from "@/common/types";
import LoadingSpinner from "@/components/general/spinner";

export default function SuccessStoriesPage() {
  const router = useRouter();
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storiesData, orphanagesData, issuesData, statsData] = await Promise.all([
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

  const getIssueTitle = (issueId: string) => {
    const issue = issues.find((i) => i.id === issueId);
    return issue?.title || "Unknown Issue";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-400">
            Loading success stories...
          </p>
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
            Track and manage success stories from resolved issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === "all" ? "by-orphanage" : "all")}
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            {viewMode === "all" ? "Group by Orphanage" : "Show All"}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Story
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
            <CardTitle className="text-sm font-medium">Total Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBeneficiaries}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphanages</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byOrphanage).length}</div>
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
          {filteredStories.map((story) => (
            <Card key={story.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{story.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="w-4 h-4 mr-1" />
                        {story.orphanageName}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Completed
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {story.description}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    <strong>Impact:</strong> {story.impact}
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>Related Issue:</strong> {getIssueTitle(story.issueId)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Beneficiaries:</span>
                    <div className="font-medium">{story.beneficiaries}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Cost:</span>
                    <div className="font-medium">${story.cost.toLocaleString()}</div>
                  </div>
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
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <ConfirmationDialog
                    itemName={story.title}
                    itemType="success story"
                    onConfirm={() => handleDeleteStory(story.id)}
                  >
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </ConfirmationDialog>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    {stories.length} {stories.length === 1 ? "Story" : "Stories"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stories.map((story) => (
                    <Card key={story.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-sm">{story.title}</h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            Completed
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {story.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">Beneficiaries:</span>
                            <div className="font-medium">{story.beneficiaries}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <div className="font-medium">${story.cost.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => setSelectedStory(story)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
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

      {/* Success Story Details Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedStory.title}
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Completed
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    {selectedStory.orphanageName}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStory(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
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

              <div>
                <h3 className="font-semibold mb-2">Related Issue</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getIssueTitle(selectedStory.issueId)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Beneficiaries:</span>
                      <span className="font-medium">{selectedStory.beneficiaries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-medium">${selectedStory.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium">
                        {formatFirebaseDate(selectedStory.completedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {formatFirebaseDate(selectedStory.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {formatFirebaseDate(selectedStory.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedStory.images && selectedStory.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStory.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Story
                </Button>
                <ConfirmationDialog
                  itemName={selectedStory.title}
                  itemType="success story"
                  onConfirm={() => {
                    handleDeleteStory(selectedStory.id);
                    setSelectedStory(null);
                  }}
                  variant="destructive"
                >
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Story
                  </Button>
                </ConfirmationDialog>
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
    </div>
  );
}