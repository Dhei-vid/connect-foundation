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
    if (isLoading) return; // Don’t run until auth state is known
    if (!isAuthenticated || !isOrphanage) return; // Only run for orphanages

    const onboardingIncomplete = !user?.onboardingCompleted;
    const isOnboardingPage = pathname === "/orphanage/onboarding";
    const isDashboardPage = pathname === "/orphanage/dashboard";

    // 1️⃣ If onboarding not complete and not already on onboarding page
    if (onboardingIncomplete && !isOnboardingPage) {
      router.replace("/orphanage/onboarding");
      return;
    }

    // 2️⃣ If onboarding complete but currently on onboarding page
    if (!onboardingIncomplete && isOnboardingPage) {
      router.replace("/orphanage/dashboard");
    }
  }, []);

  return (
    <main>
      <Toaster />
      <div>{children}</div>
    </main>
  );
}
