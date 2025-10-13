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
  DollarSign,
  Image as ImageIcon,
  XCircle,
  Filter,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  getSuccessStories,
  getSuccessStoryStats,
  deleteSuccessStory,
} from "@/firebase/success-stories";
import { getOrphanages } from "@/firebase/orphanages";
import { getIssues } from "@/firebase/issues";
import { toast } from "sonner";
import { formatFirebaseDate } from "@/lib/date-utils";
import type { SuccessStory, Orphanage, Issue } from "@/common/types";

// Mock data for success stories
const getMockSuccessStories = (): SuccessStory[] => {
  const now = new Date();
  return [
    {
      id: "1",
      orphanageId: "orphan-1",
      orphanageName: "Hope Children's Home",
      issueId: "issue-1",
      issueTitle: "New Dormitory Construction",
      title: "New Dormitory Brings Hope to 50 Children",
      description:
        "Thanks to the generous support of our donors, we successfully completed the construction of a new dormitory building. This facility now provides safe, comfortable accommodation for 50 children who previously lived in overcrowded conditions.",
      impact:
        "The new dormitory features modern amenities, individual storage spaces, and proper ventilation. Children report better sleep quality and improved health outcomes. The facility has also enabled us to accept 15 additional children from difficult situations.",
      images: [
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600",
      ],
      beneficiaries: 50,
      cost: 125000,
      completedAt: new Date(now.getFullYear(), now.getMonth() - 2, 15),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 20),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 2, 20),
    },
    {
      id: "2",
      orphanageId: "orphan-2",
      orphanageName: "Sunshine Orphanage",
      issueId: "issue-2",
      issueTitle: "School Supplies and Uniforms",
      title: "Every Child Ready for School",
      description:
        "With community support, we provided complete school supplies and uniforms to all 35 children. This initiative ensures no child misses school due to lack of materials or proper attire.",
      impact:
        "School attendance improved by 98%, and teachers report better student engagement. Children express increased confidence and pride in their appearance. Academic performance has shown a 25% improvement across all grades.",
      images: [
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600",
      ],
      beneficiaries: 35,
      cost: 8500,
      completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 5),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 10),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 10),
    },
    {
      id: "3",
      orphanageId: "orphan-1",
      orphanageName: "Hope Children's Home",
      issueId: "issue-3",
      issueTitle: "Medical Equipment and Healthcare",
      title: "Medical Clinic Saves Lives",
      description:
        "The establishment of an on-site medical clinic with modern equipment has transformed healthcare access for our children. We can now provide immediate medical attention and regular health checkups.",
      impact:
        "Emergency response time reduced from hours to minutes. Regular health screenings detected and treated conditions early. Hospital visits decreased by 60% as preventive care improved. Three children's lives were saved through early intervention.",
      images: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600",
      ],
      beneficiaries: 65,
      cost: 45000,
      completedAt: new Date(now.getFullYear(), now.getMonth() - 3, 20),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 25),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 3, 25),
    },
    {
      id: "4",
      orphanageId: "orphan-3",
      orphanageName: "St. Mary's Children Center",
      issueId: "issue-4",
      issueTitle: "Computer Lab and Internet Access",
      title: "Digital Learning Empowers Future Leaders",
      description:
        "A fully equipped computer lab with 20 workstations and high-speed internet has opened new learning opportunities. Children now have access to online education resources and digital literacy training.",
      impact:
        "All children gained basic computer skills. Five teenagers secured internships through online applications. The facility is used for homework, research, and skill development. Children report increased confidence in technology.",
      images: [
        "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&h=600",
      ],
      beneficiaries: 42,
      cost: 32000,
      completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 12),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      id: "5",
      orphanageId: "orphan-2",
      orphanageName: "Sunshine Orphanage",
      issueId: "issue-5",
      issueTitle: "Kitchen Renovation and Equipment",
      title: "Nutritious Meals for Growing Bodies",
      description:
        "Complete kitchen renovation with modern cooking equipment enables us to prepare nutritious, varied meals. The new facility meets health standards and can serve all children efficiently.",
      impact:
        "Meal quality improved significantly with balanced nutrition. Food waste reduced by 40% through better storage. Children show improved health markers including weight gain and energy levels. Kitchen staff report safer, more efficient working conditions.",
      images: [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600",
      ],
      beneficiaries: 35,
      cost: 28000,
      completedAt: new Date(now.getFullYear(), now.getMonth() - 2, 8),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 12),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 2, 12),
    },
    {
      id: "6",
      orphanageId: "orphan-4",
      orphanageName: "Little Angels Home",
      issueId: "issue-6",
      issueTitle: "Playground and Recreation Area",
      title: "Safe Play Space Brings Joy and Development",
      description:
        "A safe, modern playground with age-appropriate equipment provides children with space for physical activity and social interaction. The facility includes sports equipment and outdoor learning areas.",
      impact:
        "Children's physical fitness improved measurably. Social skills development accelerated through group play. Behavioral issues decreased as children have healthy outlets for energy. The space is used daily by all children.",
      images: [
        "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600",
      ],
      beneficiaries: 48,
      cost: 18000,
      completedAt: new Date(now.getFullYear(), now.getMonth(), 3),
      createdAt: new Date(now.getFullYear(), now.getMonth(), 7),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), 7),
    },
  ];
};

const getMockOrphanages = (): Orphanage[] => {
  const now = new Date();
  return [
    {
      id: "orphan-1",
      name: "Hope Children's Home",
      location: "Lagos, Nigeria",
      address: "123 Hope Street, Ikeja",
      state: "Lagos",
      city: "Ikeja",
      description:
        "A loving home providing care, education, and opportunities for orphaned and vulnerable children since 2010.",
      contactEmail: "contact@hopechildrenshome.org",
      contactPhone: "+234 123 456 7890",
      website: "https://hopechildrenshome.org",
      logoURL:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop",
      coverImageURL:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600",
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600",
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600",
        "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=600",
      ],
      childrenCount: 65,
      staffCount: 12,
      foundedYear: 2010,
      verified: true,
      contactPersonFirstName: "Adebayo",
      contactPersonLastName: "Okafor",
      contactPersonEmail: "adebayo@hopechildrenshome.org",
      contactPersonPhone: "+234 123 456 7890",
      contactPersonPosition: "Director",
      registrationNumber: "RC123456",
      licenseNumber: "LIC789012",
      createdAt: now,
      updatedAt: now,
    } as Orphanage,
    {
      id: "orphan-2",
      name: "Sunshine Orphanage",
      location: "Abuja, Nigeria",
      address: "456 Sunshine Avenue, Wuse",
      state: "FCT",
      city: "Abuja",
      description:
        "Dedicated to providing quality education and healthcare to underprivileged children since 2012.",
      contactEmail: "info@sunshineorphanage.org",
      contactPhone: "+234 234 567 8901",
      website: "https://sunshineorphanage.org",
      logoURL:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
      coverImageURL:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600",
        "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&h=600",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600",
      ],
      childrenCount: 35,
      staffCount: 8,
      foundedYear: 2012,
      verified: true,
      contactPersonFirstName: "Chioma",
      contactPersonLastName: "Nwankwo",
      contactPersonEmail: "chioma@sunshineorphanage.org",
      contactPersonPhone: "+234 234 567 8901",
      contactPersonPosition: "Administrator",
      registrationNumber: "RC234567",
      licenseNumber: "LIC890123",
      createdAt: now,
      updatedAt: now,
    } as Orphanage,
    {
      id: "orphan-3",
      name: "St. Mary's Children Center",
      location: "Port Harcourt, Nigeria",
      address: "789 St. Mary Road, GRA",
      state: "Rivers",
      city: "Port Harcourt",
      description:
        "A faith-based organization committed to nurturing children's spiritual, academic, and social development since 2008.",
      contactEmail: "contact@stmaryschildren.org",
      contactPhone: "+234 345 678 9012",
      logoURL:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
      coverImageURL:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600",
        "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=600",
      ],
      childrenCount: 42,
      staffCount: 10,
      foundedYear: 2008,
      verified: true,
      contactPersonFirstName: "Emmanuel",
      contactPersonLastName: "Okoro",
      contactPersonEmail: "emmanuel@stmaryschildren.org",
      contactPersonPhone: "+234 345 678 9012",
      contactPersonPosition: "Director",
      registrationNumber: "RC345678",
      licenseNumber: "LIC901234",
      createdAt: now,
      updatedAt: now,
    } as Orphanage,
    {
      id: "orphan-4",
      name: "Little Angels Home",
      location: "Kano, Nigeria",
      address: "321 Angel Street, Nassarawa",
      state: "Kano",
      city: "Kano",
      description:
        "Creating a safe, nurturing environment where every child can thrive and reach their full potential since 2015.",
      contactEmail: "hello@littleangelshome.org",
      contactPhone: "+234 456 789 0123",
      logoURL:
        "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=400&h=400&fit=crop",
      coverImageURL:
        "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=1200&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600",
      ],
      childrenCount: 48,
      staffCount: 9,
      foundedYear: 2015,
      verified: true,
      contactPersonFirstName: "Fatima",
      contactPersonLastName: "Abubakar",
      contactPersonEmail: "fatima@littleangelshome.org",
      contactPersonPhone: "+234 456 789 0123",
      contactPersonPosition: "Coordinator",
      registrationNumber: "RC456789",
      licenseNumber: "LIC012345",
      createdAt: now,
      updatedAt: now,
    } as Orphanage,
  ];
};

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
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data

  useEffect(() => {
    loadData();
  }, [useMockData]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (useMockData) {
        // Use mock data
        const mockStories = getMockSuccessStories();
        const mockOrphanages = getMockOrphanages();

        setSuccessStories(mockStories);
        setOrphanages(mockOrphanages);
        setIssues([]);

        // Calculate stats from mock data
        const byOrphanage = mockStories.reduce((acc, story) => {
          acc[story.orphanageId] = (acc[story.orphanageId] || 0) + 1;
          return acc;
        }, {} as { [orphanageId: string]: number });

        setStats({
          total: mockStories.length,
          totalBeneficiaries: mockStories.reduce(
            (sum, s) => sum + s.beneficiaries,
            0
          ),
          totalCost: mockStories.reduce((sum, s) => sum + s.cost, 0),
          byOrphanage,
        });
      } else {
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
      }
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
          <Button
            onClick={() => setUseMockData(!useMockData)}
            variant={useMockData ? "default" : "outline"}
            size="sm"
          >
            {useMockData ? "Using Mock Data" : "Using Live Data"}
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalCost.toLocaleString()}
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
            const mainImage = story.images && story.images.length > 0
              ? story.images[0]
              : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80";
            
            return (
              <Card key={story.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
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
                      <span className="line-clamp-1">{story.orphanageName}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                      {story.description}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                        <div className="font-bold text-green-600 dark:text-green-400">
                          ${story.cost.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(story.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
                      onClick={() => setSelectedStory(story)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
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
                              ${story.cost.toLocaleString()}
                            </div>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
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
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Images ({selectedStory.images.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedStory.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={image}
                          alt={`${selectedStory.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}/{selectedStory.images.length}
                        </div>
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
                  title="Delete Success Story"
                  description={`Are you sure you want to delete "${selectedStory.title}"? This action cannot be undone.`}
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
