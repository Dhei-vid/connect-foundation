"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  Calendar,
  Shield,
  Building2,
  Download,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Check,
  Ban,
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
  updateBackgroundCheckStatus,
} from "@/firebase/volunteers";
import { getOrphanages } from "@/firebase/orphanages";
import type { Volunteer } from "@/common/types";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [orphanages, setOrphanages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected" | "suspended"
  >("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVolunteersData();
  }, []);

  const loadVolunteersData = async () => {
    try {
      setLoading(true);
      const [volunteersData, orphanagesData, statsData] = await Promise.all([
        getVolunteers(),
        getOrphanages(),
        getVolunteerStats(),
      ]);
      setVolunteers(volunteersData);
      setOrphanages(orphanagesData);
      setStats(statsData);
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
            Manage and oversee volunteer applications and assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search volunteers by name, email, or skills..."
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
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Experience
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="all">All Experience</option>
                    <option value="none">No Experience</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
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
                            {volunteer.firstName} {volunteer.lastName}
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
                        {volunteer.skills.slice(0, 2).map((skill, index) => (
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
                        )}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
                        {selectedVolunteer.firstName}{" "}
                        {selectedVolunteer.lastName}
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
