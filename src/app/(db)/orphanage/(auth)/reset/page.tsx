"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractErrorMessage, type UnknownError } from "@/common/helpers";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { resetPassword } from "@/firebase/auth";

export default function OrphanageSignInPage() {
  const [email, setEmail] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      toast.success("Reset email sent");
      setStatus("Reset email sent. Please check your inbox");
    } catch (error) {
      const errorMessage = extractErrorMessage(error as UnknownError);
      setError(
        "An error occurred while resetting password. Please try again later."
      );
      toast.error("Error resetting password", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Rset your password to access your orphanage portal
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && (
            <div className="flex flex-row justify-between mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError("")}
                className="hover:bg-white/50 rounded-md cursor-pointer p-1 transition-all ease-in-out duration-200"
              >
                <X />
              </button>
            </div>
          )}

          {status && (
            <div className="flex flex-row justify-between mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                {status}
              </p>
              <button
                onClick={() => setStatus("")}
                className="hover:bg-white/50 rounded-md cursor-pointer p-1 transition-all ease-in-out duration-200"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orphanage@example.com"
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-main-red focus:border-transparent"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-main-red hover:bg-main-red/90 text-white font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Resetting...
                </div>
              ) : (
                "Reset Passwording"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Have an account?{" "}
              <Link
                href="/orphanage/signin"
                className="text-main-red font-semibold hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
