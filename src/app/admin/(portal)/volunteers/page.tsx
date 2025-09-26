"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Shield,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Ban,
  Target,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getVolunteers,
  getVolunteerStats,
  searchVolunteers,
  approveVolunteer,
  rejectVolunteer,
  suspendVolunteer,
  deleteVolunteer,
} from "@/firebase/volunteers";
import {
  getVolunteerOpportunities,
  getVolunteerOpportunityStats,
  deleteVolunteerOpportunity,
  toggleVolunteerOpportunityStatus,
} from "@/firebase/volunteer-opportunities";
import { getOrphanages } from "@/firebase/orphanages";
import { AddVolunteerOpportunityModal } from "@/components/admin/add-volunteer-opportunity-modal";
import { EditVolunteerOpportunityModal } from "@/components/admin/edit-volunteer-opportunity-modal";
import { DeleteConfirmation } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import type {
  Volunteer,
  Orphanage,
  VolunteerOpportunity,
} from "@/common/types";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";

type StatusFilterProps =
  | "all"
  | "none"
  | "beginner"
  | "intermediate"
  | "advanced";
type ExperienceFilterType =
  | "all"
  | "none"
  | "beginner"
  | "intermediate"
  | "advanced";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<
    VolunteerOpportunity[]
  >([]);
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    withBackgroundCheck: number;
    assigned: number;
  } | null>(null);
  const [opportunityStats, setOpportunityStats] = useState<{
    total: number;
    active: number;
    inactive: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<{
    status: StatusFilterProps;
    experience: ExperienceFilterType;
  }>({
    status: "all",
    experience: "all",
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"volunteers" | "opportunities">(
    "volunteers"
  );

  useEffect(() => {
    loadVolunteersData();
  }, []);

  const loadVolunteersData = async () => {
    try {
      setLoading(true);
      const [
        volunteersData,
        opportunitiesData,
        orphanagesData,
        statsData,
        opportunityStatsData,
      ] = await Promise.all([
        getVolunteers(),
        getVolunteerOpportunities(),
        getOrphanages(),
        getVolunteerStats(),
        getVolunteerOpportunityStats(),
      ]);
      setVolunteers(volunteersData);
      setVolunteerOpportunities(opportunitiesData);
      setOrphanages(orphanagesData);
      setStats(statsData);
      setOpportunityStats(opportunityStatsData);
    } catch (error) {
      console.error("Error loading volunteers data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const searchResults = await searchVolunteers(searchTerm);
        setVolunteers(searchResults);
      } catch (error) {
        console.error("Error searching volunteers:", error);
      }
    } else {
      loadVolunteersData();
    }
  };

  const handleApprove = async (
    volunteerId: string,
    assignedOrphanageId?: string
  ) => {
    try {
      const orphanage = orphanages.find((o) => o.id === assignedOrphanageId);
      await approveVolunteer(
        volunteerId,
        assignedOrphanageId,
        orphanage?.name,
        "Approved by admin"
      );
      await loadVolunteersData();
      setSelectedVolunteer(null);
    } catch (error) {
      console.error("Error approving volunteer:", error);
    }
  };

  const handleReject = async (volunteerId: string) => {
    try {
      await rejectVolunteer(volunteerId, "Rejected by admin");
      await loadVolunteersData();
      setSelectedVolunteer(null);
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
    }
  };

  const handleSuspend = async (volunteerId: string) => {
    try {
      await suspendVolunteer(volunteerId, "Suspended by admin");
      await loadVolunteersData();
      setSelectedVolunteer(null);
    } catch (error) {
      console.error("Error suspending volunteer:", error);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    try {
      await deleteVolunteerOpportunity(opportunityId);
      await loadVolunteersData();
    } catch (error) {
      console.error("Error deleting volunteer opportunity:", error);
    }
  };

  const handleToggleOpportunityStatus = async (opportunityId: string) => {
    try {
      await toggleVolunteerOpportunityStatus(opportunityId);
      await loadVolunteersData();
    } catch (error) {
      console.error("Error toggling volunteer opportunity status:", error);
    }
  };

  const handleDeleteVolunteer = async (volunteerId: string) => {
    try {
      await deleteVolunteer(volunteerId);
      await loadVolunteersData();
      setSelectedVolunteer(null);
      toast.success("Volunteer deleted successfully");
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      toast.error("Failed to delete volunteer");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "suspended":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "none":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Volunteers Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage volunteers and volunteer opportunities
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === "volunteers" ? (
            <></>
          ) : (
            <AddVolunteerOpportunityModal onSuccess={loadVolunteersData}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </AddVolunteerOpportunityModal>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("volunteers")}
          className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "volunteers"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Volunteers
        </button>
        <button
          onClick={() => setActiveTab("opportunities")}
          className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "opportunities"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Opportunities
        </button>
      </div>

      {/* Stats Cards */}
      {activeTab === "volunteers" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volunteers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.withBackgroundCheck} with background check
              </p>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.assigned} assigned to orphanages
              </p>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <Ban className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.suspended}
              </div>
              <p className="text-xs text-muted-foreground">
                Temporarily inactive
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "opportunities" && opportunityStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Opportunities
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunityStats.total}</div>
              <p className="text-xs text-muted-foreground">
                All volunteer opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {opportunityStats.active}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently available
              </p>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <Ban className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {opportunityStats.inactive}
              </div>
              <p className="text-xs text-muted-foreground">
                Temporarily disabled
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search volunteers by name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button onClick={loadVolunteersData} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <SelectField
                    value={filter.status}
                    label={"Status"}
                    placeholder="Status"
                    onValueChange={(value: string) =>
                      setFilter({
                        ...filter,
                        status: value as StatusFilterProps,
                      })
                    }
                  >
                    {[
                      "all",
                      "pending",
                      "approved",
                      "rejected",
                      "suspended",
                    ].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </SelectItem>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <SelectField
                    value={filter.experience}
                    label={"Experience"}
                    placeholder="Experience"
                    onValueChange={(value: string) =>
                      setFilter({
                        ...filter,
                        experience: value as ExperienceFilterType,
                      })
                    }
                  >
                    {[
                      "all",
                      "none",
                      "beginner",
                      "intermediate",
                      "advanced",
                    ].map((experience) => (
                      <SelectItem key={experience} value={experience}>
                        {experience === "all" ? "All Experiences" : experience}
                      </SelectItem>
                    ))}
                  </SelectField>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      {activeTab === "volunteers" && (
        <Card className="py-4">
          <CardHeader>
            <CardTitle>All Volunteers ({volunteers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Volunteer</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-left py-3 px-4">Experience</th>
                    <th className="text-left py-3 px-4">Skills</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Background Check</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((volunteer) => (
                    <tr
                      key={volunteer.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {volunteer.firstname} {volunteer.lastname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {volunteer.city}, {volunteer.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-2" />
                            {volunteer.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-2" />
                            {volunteer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={getExperienceColor(volunteer.experience)}
                        >
                          {volunteer.experience}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {/* {volunteer.skills.slice(0, 2).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{volunteer.skills.length - 2}
                            </Badge>
                          )} */}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(volunteer.status)}>
                          {volunteer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {volunteer.backgroundCheckCompleted ? (
                            <Shield className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                          )}
                          <span className="text-sm">
                            {volunteer.backgroundCheckCompleted
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVolunteer(volunteer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {volunteer.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(volunteer.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(volunteer.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {volunteer.status === "approved" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSuspend(volunteer.id)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                          <DeleteConfirmation
                            itemName={`${volunteer.firstname} ${volunteer.lastname}`}
                            itemType="volunteer"
                            onConfirm={() =>
                              handleDeleteVolunteer(volunteer.id)
                            }
                          >
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DeleteConfirmation>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Table */}
      {activeTab === "opportunities" && (
        <Card className="py-4">
          <CardHeader>
            <CardTitle>
              Volunteer Opportunities ({volunteerOpportunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Time Commitment</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerOpportunities.map((opportunity) => (
                    <tr
                      key={opportunity.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{opportunity.title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {opportunity.description}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {opportunity.timeCommitment}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{opportunity.location}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            opportunity.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }
                        >
                          {opportunity.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <EditVolunteerOpportunityModal
                            opportunity={opportunity}
                            onSuccess={loadVolunteersData}
                          >
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </EditVolunteerOpportunityModal>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleToggleOpportunityStatus(opportunity.id)
                            }
                          >
                            {opportunity.isActive ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <DeleteConfirmation
                            itemName={opportunity.title}
                            itemType="volunteer opportunity"
                            onConfirm={() =>
                              handleDeleteOpportunity(opportunity.id)
                            }
                          >
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DeleteConfirmation>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Volunteer Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVolunteer(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">
                        {selectedVolunteer.firstname}{" "}
                        {selectedVolunteer.lastname}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">
                        {selectedVolunteer.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium">
                        {selectedVolunteer.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date of Birth:</span>
                      <span className="font-medium">
                        {selectedVolunteer.dateOfBirth.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Volunteer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <Badge
                        className={getExperienceColor(
                          selectedVolunteer.experience
                        )}
                      >
                        {selectedVolunteer.experience}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className="font-medium">
                        {selectedVolunteer.availability}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        className={getStatusColor(selectedVolunteer.status)}
                      >
                        {selectedVolunteer.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="font-semibold mb-3">Emergency Contact</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">
                      {selectedVolunteer.emergencyContactName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">
                      {selectedVolunteer.emergencyContactPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Relation:</span>
                    <span className="font-medium">
                      {selectedVolunteer.emergencyContactRelation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedVolunteer.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedVolunteer.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedVolunteer.id)}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedVolunteer.status === "approved" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleSuspend(selectedVolunteer.id)}
                    className="flex-1"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedVolunteer(null)}
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
