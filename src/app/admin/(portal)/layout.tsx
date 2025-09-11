"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers";
import LoadingSpinner from "@/components/general/spinner";
import PortalSidebar from "@/components/navigation/sidebar";
import PortalNavbar from "@/components/navigation/portal-navbar";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/admin/signin");
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 dark:bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-background border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {user && (
          <PortalSidebar user={user} onClose={() => setSidebarOpen(false)} />
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden w-fit">
        {user && (
          <PortalNavbar
            user={user}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-6 scrollbar-width">
          {children}
        </main>
      </div>
    </div>
  );
}
