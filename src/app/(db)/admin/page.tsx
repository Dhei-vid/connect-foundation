"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/providers";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState<{
    signin: boolean;
    dashboard: boolean;
  }>({
    signin: false,
    dashboard: false,
  });
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const role = user?.role;

  const handleRedirect = (type: "signin" | "dashboard") => {
    setLoading((prev) => ({
      ...prev,
      [type]: true,
    }));

    if (type === "signin") {
      if (role === "ADMIN" || pathName === "/admin") {
        router.push("/admin/signin");
      } else {
        router.push("/orphanage/signin");
      }
    } else if (type === "dashboard") {
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/orphanage/dashboard");
      }
    }

    setTimeout(() => {
      setLoading((prev) => ({
        ...prev,
        [type]: false,
      }));
    }, 600);
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Just checking your authenticity...Please wait
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-xl mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Welcome to the Portal
          </h1>
          <h2 className="text-base lg:text2xl font-semibold text-foreground">
            {isAuthenticated ? (
              <span>
                You are Authenticated. Click on{" "}
                <span className="text-main-red font-bold">Go to Dashboard</span>{" "}
                to continue
              </span>
            ) : (
              "You are not authenticated. Go to sign in page"
            )}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={() => handleRedirect("signin")}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading.signin ? (
              <Spinner className="w-4 h-4 mr-2" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            {loading.signin ? "Redirecting..." : "Go to sign in"}
          </Button>

          {isAuthenticated && (
            <Button
              onClick={() => handleRedirect("dashboard")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {loading.dashboard ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <LayoutDashboard className="mr-2 h-4 w-4" />
              )}
              {loading.dashboard ? (
                "Redirecting..."
              ) : (
                <span>
                  Go to {role === "ADMIN" ? "Admin" : "Orphanage"} Dashboard
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
