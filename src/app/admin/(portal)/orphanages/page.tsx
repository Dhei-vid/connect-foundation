/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockOrphanages = [
  {
    id: "1",
    name: "Hope Children's Home",
    location: "Lagos, Nigeria",
    description:
      "A loving home for orphaned and abandoned children, providing care, education, and hope for a better future.",
    contactEmail: "info@hopechildrenshome.org",
    contactPhone: "+234-801-234-5678",
    website: "www.hopechildrenshome.org",
    childrenCount: 45,
    staffCount: 12,
    foundedYear: 2015,
    verified: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-10"),
    logoURL: "/api/placeholder/100/100",
    coverImageURL: "/api/placeholder/400/200",
  },
  {
    id: "2",
    name: "Sunshine Orphanage",
    location: "Abuja, Nigeria",
    description:
      "Dedicated to providing quality care and education to children in need.",
    contactEmail: "contact@sunshineorphanage.org",
    contactPhone: "+234-802-345-6789",
    website: "www.sunshineorphanage.org",
    childrenCount: 32,
    staffCount: 8,
    foundedYear: 2018,
    verified: false,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-01-05"),
    logoURL: "/api/placeholder/100/100",
    coverImageURL: "/api/placeholder/400/200",
  },
  {
    id: "3",
    name: "Little Angels Home",
    location: "Port Harcourt, Nigeria",
    description:
      "Creating a nurturing environment where every child can thrive and reach their potential.",
    contactEmail: "info@littleangelshome.org",
    contactPhone: "+234-803-456-7890",
    childrenCount: 28,
    staffCount: 10,
    foundedYear: 2020,
    verified: true,
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-01-08"),
    logoURL: "/api/placeholder/100/100",
    coverImageURL: "/api/placeholder/400/200",
  },
  {
    id: "4",
    name: "Grace Orphanage",
    location: "Kano, Nigeria",
    description:
      "Providing shelter, education, and love to children who need it most.",
    contactEmail: "grace@graceorphanage.org",
    contactPhone: "+234-804-567-8901",
    childrenCount: 38,
    staffCount: 9,
    foundedYear: 2017,
    verified: false,
    createdAt: new Date("2023-07-15"),
    updatedAt: new Date("2024-01-12"),
    logoURL: "/api/placeholder/100/100",
    coverImageURL: "/api/placeholder/400/200",
  },
];

export default function OrphanagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "pending"
  >("all");
  const [selectedOrphanage, setSelectedOrphanage] = useState<any>(null);

  const filteredOrphanages = mockOrphanages.filter((orphanage) => {
    const matchesSearch =
      orphanage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphanage.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "verified" && orphanage.verified) ||
      (filterStatus === "pending" && !orphanage.verified);

    return matchesSearch && matchesFilter;
  });

  const handleVerify = (orphanageId: string) => {
    // TODO: Implement verification logic
    console.log("Verify orphanage:", orphanageId);
  };

  const handleReject = (orphanageId: string) => {
    // TODO: Implement rejection logic
    console.log("Reject orphanage:", orphanageId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orphanages Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and verify orphanage registrations
          </p>
        </div>
        <Button>
          <Building2 className="w-4 h-4 mr-2" />
          Add Orphanage
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orphanages
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrphanages.length}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockOrphanages.filter((o) => o.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockOrphanages.filter((o) => !o.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Children
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrphanages.reduce((sum, o) => sum + o.childrenCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orphanages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "verified" ? "default" : "outline"}
                onClick={() => setFilterStatus("verified")}
              >
                Verified
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orphanages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrphanages.map((orphanage) => (
          <Card
            key={orphanage.id}
            className="hover:shadow-lg transition-shadow py-4"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{orphanage.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {orphanage.location}
                    </div>
                  </div>
                </div>
                <Badge variant={orphanage.verified ? "default" : "secondary"}>
                  {orphanage.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {orphanage.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  {orphanage.childrenCount} children, {orphanage.staffCount}{" "}
                  staff
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Founded {orphanage.foundedYear}
                </div>
                {orphanage.contactPhone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {orphanage.contactPhone}
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {orphanage.contactEmail}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedOrphanage(orphanage)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {!orphanage.verified && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleVerify(orphanage.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(orphanage.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orphanage Details Modal */}
      {selectedOrphanage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedOrphanage.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrphanage(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedOrphanage.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedOrphanage.contactEmail}
                    </div>
                    {selectedOrphanage.contactPhone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {selectedOrphanage.contactPhone}
                      </div>
                    )}
                    {selectedOrphanage.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        {selectedOrphanage.website}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Statistics</h3>
                  <div className="space-y-2">
                    <div>Children: {selectedOrphanage.childrenCount}</div>
                    <div>Staff: {selectedOrphanage.staffCount}</div>
                    <div>Founded: {selectedOrphanage.foundedYear}</div>
                    <div>
                      Status:{" "}
                      {selectedOrphanage.verified ? "Verified" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {!selectedOrphanage.verified && (
                  <>
                    <Button
                      onClick={() => {
                        handleVerify(selectedOrphanage.id);
                        setSelectedOrphanage(null);
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Orphanage
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedOrphanage.id);
                        setSelectedOrphanage(null);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrphanage(null)}
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
