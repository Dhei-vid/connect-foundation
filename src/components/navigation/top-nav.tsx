"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { animate } from "framer-motion";

const aboutUsNavItems = [
  {
    label: "Founding Story",
    href: "",
  },
  {
    label: "The Team",
    href: "",
  },
];

const impactNavItems = [
  {
    label: "Financials",
    href: "",
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us", content: aboutUsNavItems },
  { label: "Impact", href: "/impact", content: impactNavItems },
  { label: "Report", href: "/report" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="mx-auto p-3 sm:p-4 md:p-5 w-full 2xl:w-[70%] 3xl:w-[50%]">
      {/* Desktop Navigation - Hidden on mobile and tablet */}
      <div className="hidden xl:grid grid-cols-4 items-center justify-center">
        <Image
          className={"rounded-2xl"}
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
        />

        <div className="col-span-2 flex flex-row items-center justify-between rounded-full bg-main-red/70 backdrop-blur-lg py-4 px-12 w-full">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.content && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href={item.href}>
                <div
                  className={cn(
                    pathname === item.href
                      ? "text-main-blue font-semibold"
                      : "text-white/90",
                    "hover:text-white/50 flex flex-col items-center transition-colors duration-200 transition-all ease-in-out"
                  )}
                >
                  <div className="flex flex-row gap-1 items-center">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item?.content && <ChevronDown size={18} />}
                  </div>
                </div>
              </Link>

              {/* Dropdown Content */}
              {item.content && activeDropdown === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[100%] left-1/2 transform translate-y-1/4 -translate-x-1/2 bg-main-red/70 backdrop-blur-lg rounded-b-2xl border-0 shadow-lg z-50 min-w-full"
                >
                  <ul className="p-4 space-y-2">
                    {item.content.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          href={subItem.href || "#"}
                          className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                        >
                          <span className="text-sm font-medium">
                            {subItem.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="ml-auto">
          <button
            onClick={() => router.push("/donate")}
            className="cursor-pointer rounded-full bg-main-red py-3 px-8 text-white hover:bg-main-red/80 transition-colors duration-200"
          >
            Donate
          </button>
        </div>
      </div>

      {/* Tablet Navigation - Hidden on mobile and desktop */}
      <div className="hidden md:block xl:hidden">
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="Logo" width={55} height={55} />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-main-red/70 backdrop-blur-lg py-3 px-6">
              {navItems.slice(0, 4).map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.content && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex flex-row items-center gap-1 text-white/90 hover:text-white/50 transition-colors duration-200"
                  >
                    <span className="text-xs font-medium">{item.label}</span>
                    {item?.content && <ChevronDown size={15} />}
                  </Link>

                  {/* Dropdown Content for Tablet */}
                  {item.content && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-main-red/70 backdrop-blur-lg rounded-b-2xl border-0 shadow-lg z-50 min-w-[180px]"
                    >
                      <ul className="p-3 space-y-1">
                        {item.content.map((subItem, index) => (
                          <li key={index}>
                            <Link
                              href={subItem.href || "#"}
                              className="block px-2 py-1 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                            >
                              <span className="text-xs font-medium">
                                {subItem.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="rounded-full bg-main-red text-white hover:bg-main-red/80 px-6 py-2 transition-colors duration-200"
              onClick={() => router.push("/donate")}
            >
              Donate
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hidden on tablet and desktop */}
      <div className="md:hidden flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="sm:w-[45px] sm:h-[45px]"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="default"
            className="rounded-full bg-main-red text-white hover:bg-main-red/80 px-5 py-2 text-xs sm:px-3 sm:py-2 transition-colors duration-200"
            onClick={() => router.push("/donate")}
          >
            Donate
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-9 w-9 sm:h-10 sm:w-10 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-6 w-20 sm:h-9 sm:w-15" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div
            ref={mobileMenuRef}
            className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg"
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="sm:w-[45px] sm:h-[45px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                className="text-gray-600 hover:bg-gray-100 h-9 w-9 sm:h-10 sm:w-10 transition-colors duration-200"
                aria-label="Close mobile menu"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block py-2 sm:py-3 px-3 sm:px-4 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:bg-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium">
                        {item.label}
                      </span>
                      {item?.content && <ChevronDown size={16} />}
                    </div>
                  </Link>

                  {/* Mobile Dropdown Content */}
                  {item.content && (
                    <div className="ml-4 space-y-1">
                      {item.content.map((subItem, index) => (
                        <Link
                          key={index}
                          href={subItem.href || "#"}
                          onClick={closeMobileMenu}
                          className="block py-1 px-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <span className="text-sm font-medium">
                            {subItem.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <Button
                  className="w-full rounded-full bg-main-red text-white hover:bg-main-red/80 py-2 sm:py-3 transition-colors duration-200"
                  onClick={() => {
                    closeMobileMenu();
                    router.push("/donate");
                  }}
                >
                  Donate Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
