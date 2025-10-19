"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isOrphanage, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isAuthenticated && isOrphanage) {
      // If user is an orphanage and hasn't completed onboarding, redirect to onboarding
      if (!user?.onboardingCompleted && pathname !== "/orphanage/onboarding") {
        router.push("/orphanage/onboarding");
      }
      // If user has completed onboarding and is on onboarding page, redirect to main orphanage page
      else if (
        user?.onboardingCompleted &&
        pathname === "/orphanage/onboarding"
      ) {
        router.push("/orphanage/dashboard");
      }
    }
  }, [user, isAuthenticated, isOrphanage, isLoading, pathname, router]);

  return (
    <main>
      <Toaster />
      <div>{children}</div>
    </main>
  );
}
