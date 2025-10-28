"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers";
import { Spinner } from "@/components/ui/spinner";
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner className={"h-12 w-12 mx-auto"} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isLoading ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 dark:bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 bg-background border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {user && (
          <PortalSidebar user={user} onClose={() => setSidebarOpen(false)} />
        )}
      </aside>

      <div className="flex-1 flex flex-col min-h-0">
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
