"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, Grid, List } from "lucide-react";
import {
  getAllEvents,
  getFeaturedEvents,
  searchEvents,
} from "@/firebase/events";
import type { Event } from "@/common/types";
import { cn } from "@/lib/utils";
import { heroHeaderStyle } from "@/common/style";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "All",
    "Fundraising",
    "Volunteer",
    "Awareness",
    "Community",
    "Other",
  ];
  const types = ["All", "Online", "Physical", "Hybrid"];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [allEvents, featured] = await Promise.all([
        getAllEvents(),
        getFeaturedEvents(),
      ]);
      setEvents(allEvents);
      setFeaturedEvents(featured);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadEvents();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchEvents(searchTerm);
      setEvents(searchResults);
    } catch (error) {
      console.error("Error searching events:", error);
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

  const filteredEvents = events.filter((event) => {
    const categoryMatch =
      selectedCategory === "All" ||
      event.category === selectedCategory.toLowerCase();
    const typeMatch =
      selectedType === "All" || event.type === selectedType.toLowerCase();
    return categoryMatch && typeMatch;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => getEventStatus(event) === "upcoming"
  );
  const ongoingEvents = filteredEvents.filter(
    (event) => getEventStatus(event) === "ongoing"
  );

  return (
    <>
      <HeroLayout bgImage="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0">
        <TopNav />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className={cn(heroHeaderStyle, "font-bold text-white mb-6")}>
            Events & Activities
          </h1>
          <p className="text-xl md:text-2xl text-grey/70 max-w-3xl mx-auto leading-relaxed">
            Join us in making a difference through community events and
            volunteer activities
          </p>
        </div>
      </HeroLayout>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex flex-1 gap-4 w-full lg:max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-main-red hover:bg-main-red/90"
              >
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category:
              </span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer hover:bg-main-red hover:text-white transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type:
              </span>
              <div className="flex gap-2">
                {types.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    className="cursor-pointer hover:bg-main-red hover:text-white transition-colors"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events by Status */}
        <section>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="h-6 w-6 text-main-red" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Upcoming Events
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {upcomingEvents.length} events
                </Badge>
              </div>

              {loading ? (
                <div
                  className={`grid gap-8 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`grid gap-8 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant={viewMode === "list" ? "compact" : "default"}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ongoing Events */}
          {ongoingEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Happening Now
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {ongoingEvents.length} events
                </Badge>
              </div>

              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {ongoingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Events Found */}
          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or filters"
                  : "No events available at the moment"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    loadEvents();
                  }}
                  variant="outline"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
