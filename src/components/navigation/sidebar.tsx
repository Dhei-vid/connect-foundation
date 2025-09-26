"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/common/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  HeartPulse,
  SmartphoneNfc,
  HandCoins,
  HousePlus,
  NotebookPen,
  ShieldAlert,
  Sparkles,
  // Settings,
  HelpCircle,
  HandHelping,
} from "lucide-react";

interface PortalSidebarProps {
  user: User;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon?: string; // For image icons
  lucideIcon?: React.ComponentType<{ className?: string }>; // For Lucide icons
  roles: string[];
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    lucideIcon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    name: "Orphanages",
    href: "/admin/orphanages",
    lucideIcon: HousePlus,
    roles: ["ADMIN"],
  },
  {
    name: "Success Stories",
    href: "/admin/success-stories",
    lucideIcon: Sparkles,
    roles: ["ADMIN"],
  },
  {
    name: "Donations",
    href: "/admin/donations",
    lucideIcon: HandCoins,
    roles: ["ADMIN"],
  },
  {
    name: "Financial Report",
    href: "/admin/financial",
    lucideIcon: NotebookPen,
    roles: ["ADMIN"],
  },
  {
    name: "Volunteers",
    href: "/admin/volunteers",
    lucideIcon: HeartPulse,
    roles: ["ADMIN"],
  },
  {
    name: "Issues",
    href: "/admin/issues",
    lucideIcon: ShieldAlert,
    roles: ["ADMIN"],
  },
  {
    name: "Enquiries",
    href: "/admin/contact",
    lucideIcon: SmartphoneNfc,
    roles: ["ADMIN"],
  },
  {
    name: "Dashboard",
    href: "/orphanage/dashboard",
    lucideIcon: LayoutDashboard,
    roles: ["ORPHANAGE"],
  },
  {
    name: "Requests",
    href: "/orphanage/request",
    lucideIcon: HandHelping,
    roles: ["ORPHANAGE"],
  },
  // {
  //   name: "Settings",
  //   href: "/portal/settings",
  //   lucideIcon: Settings,
  //   roles: ["ADMIN", "ORPHANAGES"],
  // },
];

export default function PortalSidebar({ user, onClose }: PortalSidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  // Helper function to check if a nav item is active
  const isActiveRoute = (itemHref: string) => {
    // Exact match for dashboard
    if (itemHref === "/portal/dashboard") {
      return pathname === itemHref;
    }
    // For other routes, check if pathname starts with the item href
    // This handles dynamic routes like /portal/teachers/[id]
    return pathname.startsWith(itemHref);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border h-18 bg-background">
        <Link href="/" className="flex items-center gap-2">
          <div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className={"rounded-md"}
            />
          </div>
          <span className="font-bold text-lg">CF</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-width bg-background">
        <div className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                isActiveRoute(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.lucideIcon ? (
                <item.lucideIcon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActiveRoute(item.href)
                      ? "text-primary-foreground group-hover:text-muted-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                />
              ) : item.icon ? (
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={18}
                  height={18}
                  className={cn(
                    "opacity-70",
                    isActiveRoute(item.href) && "brightness-0 invert"
                  )}
                />
              ) : null}
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border bg-background">
        <div className="space-y-2">
          <Link
            href="/portal/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </Link>
        </div>
      </div>
    </div>
  );
}
