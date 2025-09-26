"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Heart,
  MessageCircle,
  DollarSign,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userAtom, isAuthenticatedAtom } from "@/store/auth";
import { signOutUser } from "@/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "About Us", href: "/about-us" },
  { icon: Heart, label: "Impact", href: "/impact" },
  { icon: MessageCircle, label: "Contact", href: "/contact" },
  { icon: DollarSign, label: "Donate", href: "/donate" },
  { icon: BarChart3, label: "Transparency", href: "/transparency" },
];

const adminItems = [
  { icon: Users, label: "Orphanages", href: "/admin/orphanages" },
  { icon: Heart, label: "Issues", href: "/admin/issues" },
  { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
];

const orphanageItems = [
  { icon: Heart, label: "My Issues", href: "/orphanage/issues" },
  { icon: Users, label: "Profile", href: "/orphanage/profile" },
  { icon: BarChart3, label: "Analytics", href: "/orphanage/analytics" },
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getNavItems = () => {
    if (user?.role === "ADMIN") {
      return [...navItems, ...adminItems];
    } else if (user?.role === "ORPHANAGE") {
      return [...navItems, ...orphanageItems];
    }
    return navItems;
  };

  const currentItems = getNavItems();

  return (
    <>
      {/* Theme Toggle */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        <ThemeToggle />
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-2xl hover:shadow-3xl"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Radial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            {/* Menu Items */}
            <div className="relative">
              {currentItems.map((item, index) => {
                const angle = (index * 360) / currentItems.length;
                const radius = 120;
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

                return (
                  <motion.div
                    key={item.href}
                    className="absolute"
                    style={{
                      left: x + 120,
                      top: y + 120,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: x,
                      y: y,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <Link href={item.href}>
                      <Button
                        size="icon"
                        className={`h-12 w-12 rounded-full ${
                          pathname === item.href
                            ? "ring-2 ring-white ring-offset-2 ring-offset-background"
                            : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu */}
      {isAuthenticated && (
        <motion.div
          className="fixed top-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="relative">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <User className="h-5 w-5" />
            </Button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="absolute right-0 top-16 w-48 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-2 shadow-xl"
                  initial={{ scale: 0.95, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-white">
                      {user?.displayName || user?.email}
                    </div>
                    <div className="px-3 py-1 text-xs text-white/70">
                      {user?.role}
                    </div>
                    <div className="h-px bg-white/20 my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </>
  );
}
