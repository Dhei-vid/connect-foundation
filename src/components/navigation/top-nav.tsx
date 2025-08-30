"use client";

import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Home,
//   Users,
//   Heart,
//   MessageCircle,
//   DollarSign,
//   BarChart3,
//   Menu,
//   X,
//   User,
//   LogOut,
//   Building2,
// } from "lucide-react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useAtom } from "jotai";
// import { userAtom, isAuthenticatedAtom } from "@/store/auth";
// import { signOutUser } from "@/firebase/auth";

// import { toast } from "sonner";

import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Impact", href: "/impact" },
  { label: "Report", href: "/donate" },
  { label: "Volunteer", href: "/transparency" },
  { label: "Contact", href: "/contact" },
];

// const adminItems = [
//   { icon: Building2, label: "Orphanages", href: "/admin/orphanages" },
//   { icon: Heart, label: "Issues", href: "/admin/issues" },
//   { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
// ];

// const orphanageItems = [
//   { icon: Heart, label: "My Issues", href: "/orphanage/issues" },
//   { icon: Users, label: "Profile", href: "/orphanage/profile" },
//   { icon: BarChart3, label: "Analytics", href: "/orphanage/analytics" },
// ];

export function TopNav() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const pathname = usePathname();
  // const [user] = useAtom(userAtom);
  // const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  // const handleSignOut = async () => {
  //   try {
  //     await signOutUser();
  //     setIsUserMenuOpen(false);
  //     toast.success("Signed out successfully", {
  //       description: "You have been signed out of your account.",
  //     });
  //   } catch (error) {
  //     toast.error("Error signing out", {
  //       description: "There was an error signing you out. Please try again.",
  //     });
  //   }
  // };

  // const getNavItems = () => {
  //   if (user?.role === "admin") {
  //     return [...navItems, ...adminItems];
  //   } else if (user?.role === "orphanage") {
  //     return [...navItems, ...orphanageItems];
  //   }
  //   return navItems;
  // };

  // const currentItems = getNavItems();

  return (
    <nav className="mx-auto p-5 mx-auto w-full 2xl:w-[70%] 3xl:w-[50%] ">
      {/* Web Navigation */}
      <div className="grid grid-cols-4 items-center justify-center">
        <Image src="/logo.png" alt="Logo" width={60} height={60} />

        <div
          className={
            "col-span-2 flex flex-row items-center justify-between rounded-full bg-main-red/70 backdrop-blur-lg py-4 px-12"
          }
        >
          {navItems.map((item) => {
            return (
              <Link key={item.label} href={item.href}>
                <div className="text-white/90 hover:text-white/50 flex flex-col items-center">
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto">
          <button className="cursor-pointer rounded-full bg-main-red py-3 px-8 text-white hover:bg-main-red/80">
            Donate
          </button>
        </div>
      </div>
    </nav>
  );
}
