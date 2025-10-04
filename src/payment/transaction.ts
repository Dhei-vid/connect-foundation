/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import https from "https";
import { extractErrorMessage } from "@/common/helpers";

// Environment variable validation
const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
const PAYSTACK_HOSTNAME =
  process.env.NEXT_PUBLIC_PAYSTACK_HOSTNAME || "https://api.paystack.co";

// Types for Paystack API
export interface PaystackInitParams {
  email: string;
  amount: string; // Paystack expects amount in kobo (so 500000 = ₦5000)
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: any;
    customer: any;
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

// Generic function to make HTTPS requests to Paystack
function makePaystackRequest<T>(
  path: string,
  method: "GET" | "POST" = "POST",
  data?: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : "";

    const options: https.RequestOptions = {
      hostname: "api.paystack.co",
      port: 443,
      path: path,
      method: method,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
        ...(data && { "Content-Length": Buffer.byteLength(postData) }),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk: Buffer) => {
        responseData += chunk.toString();
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);

          if (!res.statusCode || res.statusCode >= 400) {
            reject(
              new Error(
                `Paystack API Error: ${parsedData.message || "Unknown error"}`
              )
            );
            return;
          }

          resolve(parsedData);
        } catch (err) {
          reject(new Error(`Failed to parse Paystack response: ${err}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Paystack request failed: ${error.message}`));
    });

    if (data) {
      req.write(postData);
    }

    req.end();
  });
}

// Initialize Paystack transaction
export async function initializeTransaction(
  params: PaystackInitParams
): Promise<PaystackInitResponse> {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Please check your environment variables."
      );
    }

    const response = await makePaystackRequest<PaystackInitResponse>(
      "/transaction/initialize",
      "POST",
      params
    );

    return response;
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error("Paystack initialization error:", errorMessage);
    throw new Error(`Payment initialization failed: ${errorMessage}`);
  }
}

// Verify Paystack transaction
export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  try {
    return await makePaystackRequest<PaystackVerifyResponse>(
      `/transaction/verify/${reference}`,
      "GET"
    );
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error("Paystack verification error:", errorMessage);
    throw new Error(`Payment verification failed: ${errorMessage}`);
  }
}

// Generate unique reference
export async function generateReference(): Promise<string> {
  return `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
