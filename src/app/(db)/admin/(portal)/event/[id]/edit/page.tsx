/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Calendar, Save, Eye, MapPin, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getEventById, updateEvent } from "@/firebase/events";
import type { Event } from "@/common/types";
import { NewDatePicker } from "@/components/ui/datepicker";
import { Spinner } from "@/components/ui/spinner";
import { ImagePicker } from "@/components/ui/image-picker";
import { uploadImage } from "@/firebase/storage";

const CATEGORIES = [
  "fundraising",
  "volunteer",
  "awareness",
  "community",
  "other",
];

const TYPES = ["online", "physical", "hybrid"];

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "CAD", "AUD"];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Load event data
  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const event = await getEventById(eventId);

      if (event) {
        const startDate = event.startDate
          ? new Date(event.startDate)
          : undefined;
        const endDate = event.endDate ? new Date(event.endDate) : undefined;
        const registrationDeadline = event.registrationDeadline
          ? new Date(event.registrationDeadline)
          : undefined;

        setFormData({
          title: event.title,
          description: event.description,
          content: event.content || "",
          featuredImage: event.featuredImage || "",
          startDate: startDate,
          startTime: startDate ? startDate.toTimeString().slice(0, 5) : "",
          endDate: endDate,
          endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",
          location: {
            name: event.location.name,
            address: event.location.address,
            city: event.location.city,
            state: event.location.state,
          },
          organizer: {
            name: event.organizer.name,
            email: event.organizer.email,
            phone: event.organizer.phone || "",
          },
          category: event.category,
          type: event.type,
          maxAttendees: event.maxAttendees?.toString() || "",
          registrationRequired: event.registrationRequired,
          registrationDeadline: registrationDeadline,
          registrationDeadlineTime: registrationDeadline
            ? registrationDeadline.toTimeString().slice(0, 5)
            : "",
          registrationUrl: event.registrationUrl || "",
          cost: {
            amount: event.cost.amount.toString(),
            currency: event.cost.currency,
            free: event.cost.free,
          },
          published: event.published,
          featured: event.featured,
        });
      } else {
        toast.error("Event not found");
        router.push("/admin/event");
      }
    } catch (error) {
      console.error("Error loading event:", error);
      toast.error("Failed to load event");
      router.push("/admin/event");
    } finally {
      setLoading(false);
    }
  };

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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();

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

    setSaving(true);

    try {
      let uploadedImageUrl = formData.featuredImage;

      // Handle image upload first if file was selected
      if (selectedFile) {
        const fileName = `events/${Date.now()}-${selectedFile.name}`;

        uploadedImageUrl = await uploadImage(
          selectedFile,
          fileName,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        toast.success("Image uploaded successfully!");
      }

      // Helper function to remove undefined values (Firebase doesn't accept undefined)
      const removeUndefined = (obj: any): any => {
        if (obj === null || typeof obj !== "object") {
          return obj;
        }
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        }
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [
              key,
              typeof value === "object" && value !== null
                ? removeUndefined(value)
                : value,
            ])
        );
      };

      const updateData = removeUndefined({
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        description: formData.description.trim(),
        content: formData.content.trim(),
        featuredImage: uploadedImageUrl,
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
          : null,
        registrationRequired: formData.registrationRequired,
        registrationDeadline:
          formData.registrationDeadline && formData.registrationDeadlineTime
            ? new Date(
                `${formData.registrationDeadline.toDateString()} ${
                  formData.registrationDeadlineTime
                }`
              )
            : null,
        registrationUrl: formData.registrationUrl.trim(),
        cost: {
          amount: formData.cost.free
            ? 0
            : parseFloat(formData.cost.amount) || 0,
          currency: formData.cost.currency,
          free: formData.cost.free,
        },
        updatedAt: new Date(),
        published: formData.published,
        featured: formData.featured,
      });

      await updateEvent(eventId, updateData);
      toast.success("Event updated successfully!");
      router.push("/admin/event");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-40 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Edit Event
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update your event details and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-event-form" disabled={saving}>
            {saving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(url) => {
                      handleInputChange("featuredImage", url);
                    }}
                    progress={uploadProgress}
                    onFileSelect={setSelectedFile}
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
                        date={formData.startDate}
                        setDate={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: date as Date | undefined,
                          }))
                        }
                      />
                    </div>
                    <InputField
                      id="startTime"
                      label="Start Time"
                      required
                      type="time"
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
                        date={formData.endDate}
                        setDate={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: date as Date | undefined,
                          }))
                        }
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
                    label={"Category"}
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
                    label={"EventType"}
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
                  label={"Maximum Attendees"}
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                <CardContent className="space-y-4">
                  <InputField
                    label="Venue Name"
                    id="locationName"
                    value={formData.location.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleLocationChange("name", e.target.value)
                    }
                    placeholder="Event venue name"
                    required={formData.type === "physical"}
                  />

                  <InputField
                    label="Address"
                    id="locationAddress"
                    value={formData.location.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleLocationChange("address", e.target.value)
                    }
                    placeholder="Street address"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label={"City"}
                      id="locationCity"
                      value={formData.location.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleLocationChange("city", e.target.value)
                      }
                      placeholder="City"
                    />

                    <InputField
                      label={"State/Province"}
                      id="locationState"
                      value={formData.location.state}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organizerName">Organizer Name</Label>
                  <Input
                    id="organizerName"
                    value={formData.organizer.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOrganizerChange("name", e.target.value)
                    }
                    placeholder="Organizer name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Defaults to &quot;Connect Foundation&quot; if empty
                  </p>
                </div>

                <div>
                  <Label htmlFor="organizerEmail">Contact Email</Label>
                  <Input
                    id="organizerEmail"
                    type="email"
                    value={formData.organizer.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOrganizerChange("email", e.target.value)
                    }
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="organizerPhone">Contact Phone</Label>
                  <Input
                    id="organizerPhone"
                    type="tel"
                    value={formData.organizer.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOrganizerChange("phone", e.target.value)
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
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
              <CardContent className="space-y-4">
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
                          date={formData.registrationDeadline}
                          setDate={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              registrationDeadline: date as Date | undefined,
                            }))
                          }
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

                    <div>
                      <InputField
                        label="Registration URL"
                        id="registrationUrl"
                        type="url"
                        value={formData.registrationUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("registrationUrl", e.target.value)
                        }
                        placeholder="https://example.com/register"
                      />
                    </div>
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
                      label="Cost Amount"
                      id="costAmount"
                      type="number"
                      value={formData.cost.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              <CardContent className="space-y-4">
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
