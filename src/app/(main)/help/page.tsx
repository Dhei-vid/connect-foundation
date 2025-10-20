"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  DollarSign,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import type { Issue, Orphanage } from "@/common/types";
import { getIssues, updateIssue } from "@/firebase/issues";
import { getOrphanages } from "@/firebase/orphanages";
import { createDonation } from "@/firebase/donations";
import {
  initializeTransaction,
  generateReference,
} from "@/payment/transaction";
import { formatCurrency } from "@/common/helpers";
import { heroLayoutStyle, heroHeaderStyle, paddingStyle } from "@/common/style";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import HeroLayout from "@/components/general/hero-layout";
import { TopNav } from "@/components/navigation/top-nav";

interface DonateDialogProps {
  issue: Issue | null;
  orphanage: Orphanage | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function DonateDialog({
  issue,
  orphanage,
  isOpen,
  onClose,
  onSuccess,
}: DonateDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const suggestedAmounts = [5000, 10000, 25000, 50000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!donorInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!donorInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!donorInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    const amount = selectedAmount || parseFloat(customAmount) || 0;
    if (amount <= 0) {
      errors.amount = "Please select or enter a valid donation amount";
    } else if (amount < 100) {
      errors.amount = "Minimum donation amount is ₦100";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDonate = async () => {
    if (!issue) return;

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    try {
      setIsProcessing(true);

      const amount = selectedAmount || parseFloat(customAmount) || 0;
      const amountInKobo = (amount * 100).toString();

      // Generate reference
      const reference = await generateReference();

      // Create pending donation record
      const donationId = await createDonation({
        donorName: `${donorInfo.firstName} ${donorInfo.lastName}`,
        donorEmail: donorInfo.email,
        amount,
        currency: "NGN",
        message: donorInfo.message,
        anonymous: isAnonymous,
        targetIssueId: issue.id,
        status: "pending",
      });

      // Initialize Paystack transaction
      const response = await initializeTransaction({
        email: donorInfo.email,
        amount: amountInKobo,
        reference,
        metadata: {
          donationId,
          targetIssueId: issue.id,
          targetOrphanageId: issue.orphanageId,
          donorName: `${donorInfo.firstName} ${donorInfo.lastName}`,
          message: donorInfo.message,
          anonymous: isAnonymous,
        },
        callback_url: `${window.location.origin}/donate/verify?reference=${reference}&donationId=${donationId}&issueId=${issue.id}`,
      });

      if (response.status && response.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to process donation. Please try again.");
      setIsProcessing(false);
    }
  };

  const remainingAmount = issue ? issue.estimatedCost - issue.raisedAmount : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Support {orphanage?.name}
          </DialogTitle>
          <DialogDescription>
            Make a difference by contributing to: {issue?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Issue Details */}
          {issue && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{issue.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {issue.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Goal Amount</p>
                  <p className="font-semibold">
                    {formatCurrency(issue.estimatedCost)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className="font-semibold text-main-red">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      (issue.raisedAmount / issue.estimatedCost) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-main-blue h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (issue.raisedAmount / issue.estimatedCost) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Amount
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {suggestedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={cn(
                    selectedAmount === amount &&
                      "bg-main-blue hover:bg-main-blue/90"
                  )}
                  onClick={() => handleAmountSelect(amount)}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
              {formErrors.amount && (
                <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
              )}
            </div>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <Input
                value={donorInfo.firstName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, firstName: e.target.value })
                }
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <Input
                value={donorInfo.lastName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, lastName: e.target.value })
                }
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              value={donorInfo.email}
              onChange={(e) =>
                setDonorInfo({ ...donorInfo, email: e.target.value })
              }
            />
            {formErrors.email && (
              <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Message (Optional)
            </label>
            <Textarea
              placeholder="Leave a message of support..."
              value={donorInfo.message}
              onChange={(e) =>
                setDonorInfo({ ...donorInfo, message: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="anonymous" className="text-sm">
              Make this donation anonymous
            </label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleDonate}
            disabled={isProcessing}
            className="w-full bg-main-blue hover:bg-main-blue/90"
          >
            {isProcessing ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Donate{" "}
                {selectedAmount || customAmount
                  ? formatCurrency(selectedAmount || parseFloat(customAmount))
                  : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface IssueCardProps {
  issue: Issue;
  orphanage: Orphanage | null;
  onDonate: (issue: Issue, orphanage: Orphanage | null) => void;
}

function IssueHelpCard({ issue, orphanage, onDonate }: IssueCardProps) {
  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const progress = (issue.raisedAmount / issue.estimatedCost) * 100;
  const remainingAmount = issue.estimatedCost - issue.raisedAmount;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 py-4">
      {/* Issue Image */}
      {issue.images && issue.images.length > 0 && (
        <div className="relative h-48 w-full">
          <Image
            src={issue.images[0]}
            alt={issue.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge variant={getPriorityColor(issue.priority)}>
              {issue.priority}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{issue.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{orphanage?.name || issue.orphanageName}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
          {issue.description}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <Badge variant="outline">{issue.category}</Badge>
          {issue.deadline && (
            <div className="flex items-center gap-1 text-gray-500 ml-2">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(issue.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="space-y-3 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Goal</p>
              <p className="font-bold text-lg">
                {formatCurrency(issue.estimatedCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Raised</p>
              <p className="font-bold text-lg text-main-blue">
                {formatCurrency(issue.raisedAmount)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% funded
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {formatCurrency(remainingAmount)} remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-main-blue to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Donate Button */}
        <Button
          onClick={() => onDonate(issue, orphanage)}
          className="w-full bg-main-red hover:bg-main-red/90"
        >
          <Heart className="w-4 h-4 mr-2" />
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );
}

export default function HelpPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [orphanages, setOrphanages] = useState<Map<string, Orphanage>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedOrphanage, setSelectedOrphanage] = useState<Orphanage | null>(
    null
  );
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "high">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch issues (only open and in-progress)
      const [fetchedIssues, fetchedOrphanages] = await Promise.all([
        getIssues(),
        getOrphanages(),
      ]);

      // Filter to only show open or in-progress issues
      const activeIssues = fetchedIssues.filter(
        (issue) => issue.status === "open" || issue.status === "in-progress"
      );

      setIssues(activeIssues);

      // Create orphanage map for quick lookup
      const orphanageMap = new Map(
        fetchedOrphanages.map((org) => [org.id, org])
      );
      setOrphanages(orphanageMap);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (issue: Issue, orphanage: Orphanage | null) => {
    setSelectedIssue(issue);
    setSelectedOrphanage(orphanage);
    setIsDonateDialogOpen(true);
  };

  const handleDonationSuccess = () => {
    setIsDonateDialogOpen(false);
    loadData(); // Reload data to show updated amounts
    toast.success("Thank you for your donation!");
  };

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter((issue) => issue.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroLayout bgImage="https://images.pexels.com/photos/9823014/pexels-photo-9823014.jpeg">
        <TopNav />

        <section
          className={cn(
            heroLayoutStyle,
            "flex flex-col items-center justify-center text-center"
          )}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className={cn(heroHeaderStyle, "font-bold mb-6")}>
              Help Make a <span className="text-main-red">Difference</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Support orphanages by donating directly to their most urgent
              needs. Every contribution brings hope and transforms lives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Direct Impact</h3>
                <p className="text-sm text-white/80">100% goes to the cause</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Verified Needs</h3>
                <p className="text-sm text-white/80">All issues are verified</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <DollarSign className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Transparent</h3>
                <p className="text-sm text-white/80">Track your contribution</p>
              </div>
            </div>
          </div>
        </section>
      </HeroLayout>

      {/* Main Content */}
      <section className={cn(paddingStyle, "pb-20")}>
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-main-blue dark:text-white mb-2">
              Active Campaigns
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredIssues.length} campaigns need your support
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={cn(
                filter === "all" && "bg-main-blue hover:bg-main-blue/90"
              )}
            >
              All
            </Button>
            <Button
              variant={filter === "urgent" ? "default" : "outline"}
              onClick={() => setFilter("urgent")}
              className={cn(
                filter === "urgent" && "bg-main-blue hover:bg-main-blue/90"
              )}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Urgent
            </Button>
            <Button
              variant={filter === "high" ? "default" : "outline"}
              onClick={() => setFilter("high")}
              className={cn(
                filter === "high" && "bg-main-blue hover:bg-main-blue/90"
              )}
            >
              High Priority
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Issues Grid */}
        {!loading && filteredIssues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueHelpCard
                key={issue.id}
                issue={issue}
                orphanage={orphanages.get(issue.orphanageId) || null}
                onDonate={handleDonate}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredIssues.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "There are no active campaigns at the moment."
                : `There are no ${filter} priority campaigns at the moment.`}
            </p>
            {filter !== "all" && (
              <Button
                variant="outline"
                onClick={() => setFilter("all")}
                className="mt-4"
              >
                View All Campaigns
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Donate Dialog */}
      <DonateDialog
        issue={selectedIssue}
        orphanage={selectedOrphanage}
        isOpen={isDonateDialogOpen}
        onClose={() => setIsDonateDialogOpen(false)}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
}
