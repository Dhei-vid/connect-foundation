"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Save,
  Eye,
  ArrowLeft,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { createEvent } from "@/firebase/events";
import type { Event } from "@/common/types";
import { Label } from "@/components/ui/label";
import { NewDatePicker } from "@/components/ui/datepicker";
import { ImagePicker } from "@/components/ui/image-picker";
import { Spinner } from "@/components/ui/spinner";

const CATEGORIES = [
  "fundraising",
  "volunteer",
  "awareness",
  "community",
  "other",
];

const TYPES = ["online", "physical", "hybrid"];

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "CAD", "AUD"];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    featuredImage: "",
    startDate: undefined as Date | undefined,
    startTime: "",
    endDate: undefined as Date | undefined,
    endTime: "",
    location: {
      name: "",
      address: "",
      city: "",
      state: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    organizer: {
      name: "",
      email: "",
      phone: "",
    },
    category: "community" as Event["category"],
    type: "physical" as Event["type"],
    maxAttendees: "",
    registrationRequired: false,
    registrationDeadline: undefined as Date | undefined,
    registrationDeadlineTime: "",
    registrationUrl: "",
    cost: {
      amount: "",
      currency: "USD",
      free: true,
    },
    published: false,
    featured: false,
  });

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [registrationDeadline, setRegistrationDeadline] = useState<
    Date | undefined
  >(undefined);

  const handleInputChange = (
    field: string,
    value: string | boolean | number | string[] | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleOrganizerChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizer: {
        ...prev.organizer,
        [field]: value,
      },
    }));
  };

  const handleCostChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      cost: {
        ...prev.cost,
        [field]: value,
      },
    }));
  };

  // Sync date states with formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, startDate }));
  }, [startDate]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, endDate }));
  }, [endDate]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, registrationDeadline }));
  }, [registrationDeadline]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!formData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (!formData.startTime) {
      toast.error("Please select a start time");
      return;
    }

    if (formData.type === "physical" && !formData.location.name.trim()) {
      toast.error("Please provide location information for physical events");
      return;
    }

    setLoading(true);

    try {
      const eventData: Omit<
        Event,
        "id" | "createdAt" | "updatedAt" | "views" | "currentAttendees"
      > = {
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        description: formData.description.trim(),
        content: formData.content.trim(),
        featuredImage: formData.featuredImage.trim(),
        startDate: new Date(
          `${formData.startDate?.toDateString()} ${formData.startTime}`
        ),
        endDate:
          formData.endDate && formData.endTime
            ? new Date(`${formData.endDate.toDateString()} ${formData.endTime}`)
            : new Date(
                `${formData.startDate?.toDateString()} ${formData.startTime}`
              ),
        location: {
          name: formData.location.name.trim(),
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          coordinates:
            formData.location.coordinates.lat &&
            formData.location.coordinates.lng
              ? formData.location.coordinates
              : undefined,
        },
        organizer: {
          name: formData.organizer.name.trim() || "Connect Foundation",
          email: formData.organizer.email.trim(),
          phone: formData.organizer.phone.trim(),
        },
        category: formData.category,
        type: formData.type,
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : undefined,
        registrationRequired: formData.registrationRequired,
        registrationDeadline:
          formData.registrationDeadline && formData.registrationDeadlineTime
            ? new Date(
                `${formData.registrationDeadline.toDateString()} ${
                  formData.registrationDeadlineTime
                }`
              )
            : undefined,
        registrationUrl: formData.registrationUrl.trim(),
        cost: {
          amount: formData.cost.free
            ? 0
            : parseFloat(formData.cost.amount) || 0,
          currency: formData.cost.currency,
          free: formData.cost.free,
        },
        status: "upcoming",
        published: formData.published,
        featured: formData.featured,
      };

      await createEvent({
        ...eventData,
        views: 0,
        currentAttendees: 0,
      });
      toast.success("Event created successfully!");
      router.push("/admin/event");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Event
              </>
            )}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Create Event
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a new event to engage with your community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InputField
                  id="title"
                  label="Event Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                />

                <TextareaField
                  id="description"
                  label="Description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the event"
                  rows={4}
                />

                <TextareaField
                  id="content"
                  label="Detailed Content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Detailed event information, agenda, etc."
                  rows={8}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <ImagePicker
                    value={formData.featuredImage}
                    onChange={(imageUrl) =>
                      handleInputChange("featuredImage", imageUrl)
                    }
                    placeholder="Enter image URL or upload a file"
                    showPreview
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <NewDatePicker
                        label="Start Date"
                        date={startDate}
                        setDate={setStartDate}
                      />
                    </div>
                    <InputField
                      id="startTime"
                      label="Start Time"
                      required
                      type="time"
                      step="1"
                      defaultValue="10:30:00"
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <NewDatePicker
                        label="End Date"
                        date={endDate}
                        setDate={setEndDate}
                      />
                    </div>
                    <InputField
                      id="endTime"
                      label="End Time"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    required
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectField>

                  <SelectField
                    label="Event Type"
                    required
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    {TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectField>
                </div>

                <InputField
                  id="maxAttendees"
                  label="Maximum Attendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) =>
                    handleInputChange("maxAttendees", e.target.value)
                  }
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </CardContent>
            </Card>

            {/* Location Information */}
            {formData.type === "physical" && (
              <Card className="py-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InputField
                    id="locationName"
                    label="Venue Name"
                    required
                    value={formData.location.name}
                    onChange={(e) =>
                      handleLocationChange("name", e.target.value)
                    }
                    placeholder="Event venue name"
                  />

                  <InputField
                    id="locationAddress"
                    label="Address"
                    value={formData.location.address}
                    onChange={(e) =>
                      handleLocationChange("address", e.target.value)
                    }
                    placeholder="Street address"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      id="locationCity"
                      label="City"
                      value={formData.location.city}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                      placeholder="City"
                    />

                    <InputField
                      id="locationState"
                      label="State/Province"
                      value={formData.location.state}
                      onChange={(e) =>
                        handleLocationChange("state", e.target.value)
                      }
                      placeholder="State or Province"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Information */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Organizer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <InputField
                    id="organizerName"
                    label="Organizer Name"
                    Icon={User}
                    value={formData.organizer.name}
                    onChange={(e) =>
                      handleOrganizerChange("name", e.target.value)
                    }
                    placeholder="Organizer name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Defaults to &quot;Connect Foundation&quot; if empty
                  </p>
                </div>

                <InputField
                  id="organizerEmail"
                  label="Contact Email"
                  type="email"
                  value={formData.organizer.email}
                  onChange={(e) =>
                    handleOrganizerChange("email", e.target.value)
                  }
                  placeholder="contact@example.com"
                />

                <InputField
                  id="organizerPhone"
                  label="Contact Phone"
                  type="tel"
                  value={formData.organizer.phone}
                  onChange={(e) =>
                    handleOrganizerChange("phone", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </CardContent>
            </Card>

            {/* Registration & Cost */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registration & Cost
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationRequired">
                      Registration Required
                    </Label>
                    <p className="text-sm text-gray-500">
                      Attendees must register to participate
                    </p>
                  </div>
                  <Switch
                    id="registrationRequired"
                    checked={formData.registrationRequired}
                    onCheckedChange={(checked) =>
                      handleInputChange("registrationRequired", checked)
                    }
                  />
                </div>

                {formData.registrationRequired && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <NewDatePicker
                          label="Registration Deadline Date"
                          date={registrationDeadline}
                          setDate={setRegistrationDeadline}
                        />
                      </div>
                      <InputField
                        id="registrationDeadlineTime"
                        label="Registration Deadline Time"
                        type="time"
                        value={formData.registrationDeadlineTime}
                        onChange={(e) =>
                          handleInputChange(
                            "registrationDeadlineTime",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <InputField
                      id="registrationUrl"
                      label="Registration URL"
                      type="url"
                      value={formData.registrationUrl}
                      onChange={(e) =>
                        handleInputChange("registrationUrl", e.target.value)
                      }
                      placeholder="https://example.com/register"
                    />
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="freeEvent">Free Event</Label>
                    <p className="text-sm text-gray-500">No cost to attend</p>
                  </div>
                  <Switch
                    id="freeEvent"
                    checked={formData.cost.free}
                    onCheckedChange={(checked) =>
                      handleCostChange("free", checked)
                    }
                  />
                </div>

                {!formData.cost.free && (
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      id="costAmount"
                      label="Cost Amount"
                      type="number"
                      value={formData.cost.amount}
                      onChange={(e) =>
                        handleCostChange("amount", e.target.value)
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />

                    <SelectField
                      label="Currency"
                      value={formData.cost.currency}
                      onValueChange={(value) =>
                        handleCostChange("currency", value)
                      }
                    >
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectField>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Publishing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="published">Publish immediately</Label>
                    <p className="text-sm text-gray-500">
                      Make this event visible to the public
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      handleInputChange("published", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Featured event</Label>
                    <p className="text-sm text-gray-500">
                      Highlight this event on the homepage
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug: {generateSlug(formData.title) || "event-slug"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type: {formData.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category: {formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cost:{" "}
                      {formData.cost.free
                        ? "Free"
                        : `${formData.cost.amount} ${formData.cost.currency}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
