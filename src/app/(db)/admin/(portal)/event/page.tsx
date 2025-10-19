"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Search,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Users,
  Star,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Event } from "@/common/types";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { getAllEvents, deleteEvent, updateEvent } from "@/firebase/events";

export default function AdminEventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "ongoing" | "completed" | "cancelled"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "fundraising" | "volunteer" | "awareness" | "community" | "other"
  >("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events from Firebase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading events from Firebase...");

      const eventsData = await getAllEvents();
      console.log("Loaded events:", eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      setError("Failed to load events");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    if (event.startDate > now) return "upcoming";
    if (event.endDate < now) return "completed";
    return "ongoing";
  };

  const handleTogglePublished = async (
    eventId: string,
    currentStatus: boolean
  ) => {
    try {
      console.log("Toggling published status for event:", eventId);
      await updateEvent(eventId, { published: !currentStatus });
      console.log("Event status updated successfully");
      toast.success(
        `Event ${!currentStatus ? "published" : "unpublished"} successfully`
      );
      await loadEvents(); // Reload the list
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status");
    }
  };

  const handleToggleFeatured = async (
    eventId: string,
    currentStatus: boolean
  ) => {
    try {
      console.log("Toggling featured status for event:", eventId);
      await updateEvent(eventId, { featured: !currentStatus });
      console.log("Event featured status updated successfully");
      toast.success(
        `Event ${!currentStatus ? "featured" : "unfeatured"} successfully`
      );
      await loadEvents(); // Reload the list
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      console.log("Deleting event:", eventId);
      await deleteEvent(eventId);
      console.log("Event deleted successfully");
      toast.success("Event deleted successfully");
      await loadEvents(); // Reload the list
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.city.toLowerCase().includes(searchTerm.toLowerCase());

    const eventStatus = getEventStatus(event);
    const matchesStatus =
      filterStatus === "all" ||
      filterStatus === eventStatus ||
      filterStatus === event.status;

    const matchesCategory =
      filterCategory === "all" || filterCategory === event.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading && events.length === 0) {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="py-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
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
              <div className="flex gap-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage events, activities, and community engagement
          </p>
        </div>
        <Button onClick={() => router.push("/admin/event/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-main-blue dark:text-white">
                  {events.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {
                    events.filter((e) => getEventStatus(e) === "upcoming")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Featured
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {events.filter((e) => e.featured).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Attendees
                </p>
                <p className="text-2xl font-bold text-main-blue">
                  {events.reduce(
                    (sum, event) => sum + event.currentAttendees,
                    0
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-main-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events by title, organizer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <SelectField
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(
                    value as
                      | "all"
                      | "upcoming"
                      | "ongoing"
                      | "completed"
                      | "cancelled"
                  )
                }
                placeholder="Status"
              >
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectField>
              <SelectField
                value={filterCategory}
                onValueChange={(value) =>
                  setFilterCategory(
                    value as
                      | "all"
                      | "fundraising"
                      | "volunteer"
                      | "awareness"
                      | "community"
                      | "other"
                  )
                }
                placeholder="Category"
              >
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const eventStatus = getEventStatus(event);
            return (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Image */}
                    <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                      {event.featuredImage ? (
                        <Image
                          src={event.featuredImage}
                          alt={event.title}
                          width={192}
                          height={96}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.featured && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge className={getStatusColor(eventStatus)}>
                            {eventStatus}
                          </Badge>
                          <Badge
                            variant={event.published ? "default" : "secondary"}
                          >
                            {event.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.currentAttendees}
                          {event.maxAttendees ? `/${event.maxAttendees}` : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {event.cost.free
                            ? "Free"
                            : `${event.cost.amount} ${event.cost.currency}`}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {event.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        {event.registrationRequired && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          >
                            Registration Required
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/event/${event.id}/edit`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleTogglePublished(event.id, event.published)
                          }
                        >
                          {event.published ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleFeatured(event.id, event.featured)
                          }
                        >
                          {event.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ||
                filterStatus !== "all" ||
                filterCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first event"}
              </p>
              <Button onClick={() => router.push("/admin/event/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
