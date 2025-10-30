"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TopNav } from "@/components/navigation/top-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/events/event-card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
  Share2,
  ArrowLeft,
  DollarSign,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import {
  getEventBySlug,
  getAllEvents,
  incrementEventViews,
  incrementEventAttendees,
} from "@/firebase/events";
import type { Event } from "@/common/types";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadEvent(params.id as string);
    }
  }, [params?.id]);

  const loadEvent = async (slug: string) => {
    try {
      setLoading(true);
      const [eventData, allEvents] = await Promise.all([
        getEventBySlug(slug),
        getAllEvents(10),
      ]);

      if (eventData) {
        setEvent(eventData);

        // Increment views
        await incrementEventViews(eventData.id);

        // Find related events (same category)
        const related = allEvents
          .filter(
            (e) => e.id !== eventData.id && e.category === eventData.category
          )
          .slice(0, 3);
        setRelatedEvents(related);
      }
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event || registered) return;

    try {
      await incrementEventAttendees(event.id);
      setRegistered(true);
      setEvent((prev) =>
        prev ? { ...prev, currentAttendees: prev.currentAttendees + 1 } : null
      );
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEventStatus = () => {
    if (!event) return "upcoming";
    const now = new Date();
    if (event.startDate > now) return "upcoming";
    if (event.endDate < now) return "completed";
    return "ongoing";
  };

  const status = getEventStatus();
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ongoing:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Skeleton className="h-64 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The event you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/events">
              <Button className="bg-main-red hover:bg-main-red/90">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {event.featuredImage && (
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${statusColors[status]}`}>{status}</Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {event.category}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {event.type}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: event.content || event.description,
                  }}
                />
              </div>

              {/* Event Details */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-main-red" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Date & Time
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formatDate(event.startDate)} at{" "}
                          {formatTime(event.startDate)}
                          {event.endDate &&
                            event.endDate.getTime() !==
                              event.startDate.getTime() && (
                              <span> - {formatTime(event.endDate)}</span>
                            )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-main-red" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Location
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.location.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.location.address}, {event.location.city},{" "}
                          {event.location.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-main-red" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Attendees
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.currentAttendees} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-main-red" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Cost
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.cost.free
                            ? "Free Event"
                            : `${event.cost.amount} ${event.cost.currency}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        Organizer
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.organizer.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          <a
                            href={`mailto:${event.organizer.email}`}
                            className="hover:text-main-red transition-colors"
                          >
                            {event.organizer.email}
                          </a>
                        </div>
                        {event.organizer.phone && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3" />
                            <a
                              href={`tel:${event.organizer.phone}`}
                              className="hover:text-main-red transition-colors"
                            >
                              {event.organizer.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration */}
              {event.registrationRequired && status === "upcoming" && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-main-red/5 border border-main-red/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Registration Required
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This event requires registration.{" "}
                      {event.maxAttendees &&
                        `Only ${
                          event.maxAttendees - event.currentAttendees
                        } spots remaining!`}
                    </p>
                    <div className="flex gap-4">
                      {event.registrationUrl ? (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-main-red hover:bg-main-red/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Register Now
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <Button
                          onClick={handleRegister}
                          disabled={
                            registered ||
                            (event.maxAttendees !== undefined &&
                              event.maxAttendees !== null &&
                              event.currentAttendees >= event?.maxAttendees)
                          }
                          className="bg-main-red hover:bg-main-red/90"
                        >
                          {registered ? "Registered!" : "Register for Event"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Event
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    {event.views} views
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Quick Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <Badge className={`text-xs ${statusColors[status]}`}>
                        {status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Type
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Category
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {event.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Cost
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.cost.free
                          ? "Free"
                          : `${event.cost.amount} ${event.cost.currency}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Related Events */}
                {relatedEvents.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Related Events
                    </h3>
                    <div className="space-y-4">
                      {relatedEvents.map((relatedEvent) => (
                        <EventCard
                          key={relatedEvent.id}
                          event={relatedEvent}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
