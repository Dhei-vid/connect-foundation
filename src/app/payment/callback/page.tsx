"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyTransaction } from "@/payment/transaction";
import { updateDonationStatusByReference } from "@/firebase/donations";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [donationData, setDonationData] = useState<any>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (!reference && !trxref) {
      setStatus("failed");
      setMessage("No payment reference found");
      return;
    }

    const paymentRef = reference || trxref;
    verifyPaymentCallback(paymentRef);
  }, [searchParams]);

  const verifyPaymentCallback = async (reference: string) => {
    try {
      console.log("Verifying payment with reference:", reference);
      
      // Verify payment with Paystack
      const verificationResponse = await verifyTransaction(reference);
      console.log("Paystack verification response:", verificationResponse);

      if (verificationResponse.data.status === "success") {
        // Update donation status to completed
        await updateDonationStatusByReference(reference, "completed");
        console.log("Donation status updated to completed");

        setStatus("success");
        setMessage("Payment successful! Thank you for your donation.");
        setDonationData({
          amount: verificationResponse.data.amount / 100, // Convert from kobo to naira
          currency: verificationResponse.data.currency,
          reference: verificationResponse.data.reference,
          paidAt: verificationResponse.data.paid_at,
        });
      } else {
        // Update donation status to failed
        await updateDonationStatusByReference(reference, "failed");
        console.log("Donation status updated to failed");

        setStatus("failed");
        setMessage(verificationResponse.data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("failed");
      setMessage("An error occurred while verifying your payment");
    }
  };

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === "failed" && <XCircle className="h-6 w-6 text-red-600" />}
            Payment {status === "loading" ? "Processing" : status === "success" ? "Successful" : "Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          {status === "success" && donationData && (
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold text-green-800 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Amount:</span> ₦{donationData.amount}</p>
                <p><span className="font-medium">Reference:</span> {donationData.reference}</p>
                <p><span className="font-medium">Date:</span> {new Date(donationData.paidAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          <Button onClick={handleContinue} className="w-full">
            Continue to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}