"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from "lucide-react";
import { verifyTransaction } from "@/payment/transaction";
import { updateDonationStatus } from "@/firebase/donations";
import { updateIssue } from "@/firebase/issues";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/common/helpers";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const hasVerified = useRef(false);

  useEffect(() => {
    // Prevent duplicate verification in React Strict Mode
    if (hasVerified.current) return;
    
    const reference = searchParams.get("reference");
    const donationId = searchParams.get("donationId");
    const issueId = searchParams.get("issueId");

    if (!reference || !donationId) {
      setError("Invalid verification parameters");
      setVerifying(false);
      return;
    }

    hasVerified.current = true;
    verifyPayment(reference, donationId, issueId);
  }, [searchParams]);

  const verifyPayment = async (
    reference: string,
    donationId: string,
    issueId: string | null
  ) => {
    try {
      // First, check if this donation has already been processed
      const { getDonation } = await import("@/firebase/donations");
      const existingDonation = await getDonation(donationId);
      
      if (existingDonation?.status === "completed") {
        // Already processed - just show success
        setAmount(existingDonation.amount);
        setSuccess(true);
        setVerifying(false);
        return;
      }

      // Verify transaction with Paystack
      const response = await verifyTransaction(reference);

      if (response.status && response.data.status === "success") {
        const paidAmount = response.data.amount / 100; // Convert from kobo to naira
        setAmount(paidAmount);

        // Update donation status to completed
        await updateDonationStatus(donationId, "completed");

        // If this was a targeted donation, update the issue's raised amount
        if (issueId) {
          const metadata = response.data.metadata;
          const targetIssueId = metadata?.targetIssueId || issueId;

          // We need to get the current issue to calculate new raised amount
          // Import getIssue dynamically to avoid circular dependencies
          const { getIssue } = await import("@/firebase/issues");
          const currentIssue = await getIssue(targetIssueId);

          if (currentIssue) {
            const newRaisedAmount = currentIssue.raisedAmount + paidAmount;
            await updateIssue(targetIssueId, {
              raisedAmount: newRaisedAmount,
            });
          }
        }

        setSuccess(true);
      } else {
        // Payment failed
        await updateDonationStatus(donationId, "failed");
        setError("Payment verification failed. Please contact support.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during verification"
      );

      // Update donation as failed
      try {
        await updateDonationStatus(donationId, "failed");
      } catch (updateErr) {
        console.error("Failed to update donation status:", updateErr);
      }
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-main-blue" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your donation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md py-4">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-500">
              Thank You for Your Donation!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Donation Amount
              </p>
              <p className="text-3xl font-bold text-main-blue">
                {formatCurrency(amount)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Your generous contribution will make a real difference in the
                lives of children in need.
              </p>
              <p>
                A confirmation email has been sent to your email address with
                the donation details.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => router.push("/help")}
                className="w-full bg-main-blue hover:bg-main-blue/90"
              >
                Help Another Cause
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-500">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            {error || "We couldn't verify your payment. Please try again."}
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => router.push("/donate")}
              className="w-full bg-main-blue hover:bg-main-blue/90"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-16 h-16 animate-spin text-main-blue" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
