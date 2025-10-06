"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Building2,
  Users,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Filter,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { getOrphanages } from "@/firebase/orphanages";
import { getIssues } from "@/firebase/issues";
import { toast } from "sonner";
import { formatFirebaseDate } from "@/lib/date-utils";
import type { Orphanage, Issue } from "@/common/types";

export default function SuccessStoriesPage() {
  const [successStories, setSuccessStories] = useState<Issue[]>([]);
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    totalBeneficiaries: 0,
    totalCost: 0,
    byOrphanage: {} as { [orphanageId: string]: number },
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrphanage, setFilterOrphanage] = useState("all");
  const [selectedStory, setSelectedStory] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "by-orphanage">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [issuesData, orphanagesData] = await Promise.all([
        getIssues({ status: "resolved" }),
        getOrphanages(),
      ]);
      
      // Filter issues that have been fully funded (raisedAmount >= estimatedCost)
      const fullyFundedIssues = issuesData.filter(issue => issue.raisedAmount >= issue.estimatedCost);
      
      setSuccessStories(fullyFundedIssues);
      setOrphanages(orphanagesData);
      
      // Calculate stats
      const totalBeneficiaries = fullyFundedIssues.reduce((sum, issue) => {
        // Estimate beneficiaries based on orphanage children count
        const orphanage = orphanagesData.find(o => o.id === issue.orphanageId);
        return sum + (orphanage?.childrenCount || 0);
      }, 0);
      
      const totalCost = fullyFundedIssues.reduce((sum, issue) => sum + issue.raisedAmount, 0);
      
      const byOrphanage = fullyFundedIssues.reduce((acc, issue) => {
        acc[issue.orphanageId] = (acc[issue.orphanageId] || 0) + 1;
        return acc;
      }, {} as { [orphanageId: string]: number });
      
      setStats({
        total: fullyFundedIssues.length,
        totalBeneficiaries,
        totalCost,
        byOrphanage,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load success stories");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = (story: Issue) => {
    setSelectedStory(story);
  };

  const filteredStories = successStories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.orphanageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrphanage =
      filterOrphanage === "all" || story.orphanageId === filterOrphanage;

    return matchesSearch && matchesOrphanage;
  });

  const getOrphanageName = (orphanageId: string) => {
    const orphanage = orphanages.find((o) => o.id === orphanageId);
    return orphanage?.name || "Unknown Orphanage";
  };

  const getFundingProgress = (raised: number, estimated: number) => {
    return Math.round((raised / estimated) * 100);
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
            View fully funded orphanage requests that have been successfully resolved
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Stories</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Fully funded requests</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children Helped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBeneficiaries}</div>
            <p className="text-xs text-muted-foreground">Estimated beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully funded</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphanages</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byOrphanage).length}</div>
            <p className="text-xs text-muted-foreground">With success stories</p>
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
                      <CheckCircle className="w-6 h-6 text-green-600" />
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
                    Fully Funded
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {story.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>Category:</strong> {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Funding Progress:</span>
                    <span className="font-medium">{getFundingProgress(story.raisedAmount, story.estimatedCost)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(getFundingProgress(story.raisedAmount, story.estimatedCost), 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Raised:</span>
                    <div className="font-medium">${story.raisedAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Target:</span>
                    <div className="font-medium">${story.estimatedCost.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewStory(story)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
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
            }, {} as { [key: string]: Issue[] })
          ).map(([orphanageId, stories]) => {
            const orphanage = orphanages.find(o => o.id === orphanageId);
            const totalRaised = stories.reduce((sum, story) => sum + story.raisedAmount, 0);
            const totalTarget = stories.reduce((sum, story) => sum + story.estimatedCost, 0);
            
            return (
              <Card key={orphanageId} className="py-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {getOrphanageName(orphanageId)}
                    <Badge className="ml-2">
                      {stories.length} {stories.length === 1 ? "Success Story" : "Success Stories"}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {orphanage?.childrenCount || 0} children
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${totalRaised.toLocaleString()} raised
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {Math.round((totalRaised / totalTarget) * 100)}% funded
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.map((story) => (
                      <Card key={story.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-sm">{story.title}</h4>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              Fully Funded
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {story.description}
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Progress:</span>
                              <span className="font-medium">{getFundingProgress(story.raisedAmount, story.estimatedCost)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-600 h-1.5 rounded-full" 
                                style={{ width: `${Math.min(getFundingProgress(story.raisedAmount, story.estimatedCost), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div>
                              <span className="text-gray-500">Raised:</span>
                              <div className="font-medium">${story.raisedAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Target:</span>
                              <div className="font-medium">${story.estimatedCost.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => handleViewStory(story)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                      Fully Funded
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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Funding Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium capitalize">{selectedStory.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <span className="font-medium capitalize">{selectedStory.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Amount:</span>
                      <span className="font-medium">${selectedStory.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Raised:</span>
                      <span className="font-medium text-green-600">${selectedStory.raisedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Funding Progress:</span>
                      <span className="font-medium">{getFundingProgress(selectedStory.raisedAmount, selectedStory.estimatedCost)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${Math.min(getFundingProgress(selectedStory.raisedAmount, selectedStory.estimatedCost), 100)}%` }}
                    ></div>
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
                    {selectedStory.resolvedAt && (
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-medium">
                          {formatFirebaseDate(selectedStory.resolvedAt)}
                        </span>
                      </div>
                    )}
                    {selectedStory.deadline && (
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className="font-medium">
                          {formatFirebaseDate(selectedStory.deadline)}
                        </span>
                      </div>
                    )}
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