"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users, Eye, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/common/types";

interface EventCardProps {
  event: Event;
  variant?: "default" | "featured" | "compact";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEventStatus = () => {
    const now = new Date();
    if (event.startDate > now) return "upcoming";
    if (event.endDate < now) return "completed";
    return "ongoing";
  };

  const status = getEventStatus();
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ongoing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  if (variant === "compact") {
    return (
      <Link href={`/events/${event.slug}`} className="block">
        <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {event.featuredImage && (
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={event.featuredImage}
                    alt={event.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs ${statusColors[status]}`}>
                    {status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {event.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.startDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location.city}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/events/${event.slug}`} className="block">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
          <div className="relative h-64">
            {event.featuredImage ? (
              <Image
                src={event.featuredImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-main-red/20 to-main-blue/20 flex items-center justify-center">
                <div className="text-4xl text-gray-400">🎉</div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-main-red text-white">Featured</Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className={`${statusColors[status]}`}>
                {status}
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{event.category}</Badge>
              <Badge variant="outline">{event.type}</Badge>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {event.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {event.description}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(event.startDate)} at {formatTime(event.startDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{event.location.name}, {event.location.city}</span>
              </div>
              {event.cost.free ? (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Free Event</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{event.cost.amount} {event.cost.currency}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.currentAttendees}{event.maxAttendees ? `/${event.maxAttendees}` : ""}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {event.views}
                </div>
              </div>
              {event.registrationRequired && status === "upcoming" && (
                <Button size="sm" className="bg-main-red hover:bg-main-red/90">
                  Register
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
        <div className="relative h-48">
          {event.featuredImage ? (
            <Image
              src={event.featuredImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-main-red/20 to-main-blue/20 flex items-center justify-center">
              <div className="text-3xl text-gray-400">🎉</div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`text-xs ${statusColors[status]}`}>
              {status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">{event.category}</Badge>
            <Badge variant="outline" className="text-xs">{event.type}</Badge>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
            {event.description}
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3" />
              <span>{event.location.city}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-3 w-3" />
              <span>{event.currentAttendees}</span>
              <Eye className="h-3 w-3 ml-2" />
              <span>{event.views}</span>
            </div>
            {event.cost.free ? (
              <Badge variant="secondary" className="text-xs">Free</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                {event.cost.amount} {event.cost.currency}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
