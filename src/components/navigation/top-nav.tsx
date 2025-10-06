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
import { Badge } from "../ui/badge";

// Dynamic dropdown configuration
const dropdownConfig = {
  "About Us": {
    badge: "About Us",
    description: "Learn more about our organization and values.",
    items: [
      { label: "Our Story", href: "/about-us" },
      { label: "Our Team", href: "/about-us#team" },
    ],
  },
  Impact: {
    badge: "Our Impact",
    description: "See how we're making a difference in children's lives.",
    items: [
      { label: "Financial Reports", href: "/report" },
      { label: "Success Stories", href: "/impact" },
    ],
  },
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us", hasDropdown: false },
  { label: "Impact", href: "/impact", hasDropdown: true },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export function TopNav({
  menuStyle,
  donateStyle,
}: {
  menuStyle?: string;
  donateStyle?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDropdown = (itemLabel: string) => {
    setActiveDropdown(activeDropdown === itemLabel ? null : itemLabel);
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const target = event.target as Element;
        // Don't close if clicking on a link inside the dropdown
        if (!target.closest("[data-dropdown]") && !target.closest("a")) {
          setActiveDropdown(null);
        }
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

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
      <div className="hidden md:grid grid-cols-4 items-center justify-center">
        <Image
          className={"rounded-2xl"}
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
        />

        <div className="relative col-span-2">
          <div
            className={cn(
              menuStyle ? menuStyle : "bg-main-red/70 backdrop-blur-lg",
              "flex flex-row items-center justify-between rounded-full py-4 px-12 w-full"
            )}
          >
            {navItems.map((item) => (
              <div key={item.label} className="relative" data-dropdown>
                {item.hasDropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      pathname === item.href
                        ? "text-main-blue font-semibold"
                        : "text-white/90",
                      "hover:text-white/50 flex flex-col items-center transition-colors duration-200 transition-all ease-in-out cursor-pointer"
                    )}
                  >
                    <div className="flex flex-row gap-1 items-center">
                      <span className="text-xs lg:text-sm font-medium">
                        {item.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={cn(
                        pathname === item.href
                          ? "text-main-blue font-semibold"
                          : "text-white/90",
                        "hover:text-white/50 flex flex-col items-center transition-colors duration-200 transition-all ease-in-out"
                      )}
                    >
                      <span className="text-xs lg:text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Dropdown Panel */}
          {activeDropdown &&
            dropdownConfig[activeDropdown as keyof typeof dropdownConfig] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  menuStyle ? menuStyle : "bg-main-red/70",
                  "absolute top-12 w-full rounded-2xl  mt-4 mb-6 z-40"
                )}
              >
                <div className="pt-3 pb-5 px-5">
                  <div className="grid grid-cols-2 gap-4 mt-4 divide-x-1 divide-white/20">
                    <div className="space-y-2">
                      <Badge className="bg-main-blue border-main-blue">
                        {
                          dropdownConfig[
                            activeDropdown as keyof typeof dropdownConfig
                          ].badge
                        }
                      </Badge>

                      <p className="text-white">
                        {
                          dropdownConfig[
                            activeDropdown as keyof typeof dropdownConfig
                          ].description
                        }
                      </p>
                    </div>
                    <div className="w-full">
                      {dropdownConfig[
                        activeDropdown as keyof typeof dropdownConfig
                      ].items.map((item) => (
                        <div
                          key={item.label}
                          className="cursor-pointer p-2 w-full hover:bg-main-blue transition-colors duration-200 rounded-sm"
                        >
                          <Link
                            href={item.href}
                            className="w-full text-white/90 hover:text-white"
                            onClick={() => {
                              // Small delay to ensure navigation completes
                              setTimeout(() => setActiveDropdown(null), 100);
                            }}
                          >
                            {item.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
        </div>

        <div className="ml-auto">
          <button
            onClick={() => router.push("/donate")}
            className={cn(
              donateStyle ? donateStyle : "bg-main-red/70",
              pathname === "/donate"
                ? "bg-main-blue hover:bg-main-red"
                : "hover:bg-main-blue",
              "cursor-pointer rounded-full py-3 px-8 text-white text-xs lg:text-sm transition-colors duration-200"
            )}
          >
            Donate
          </button>
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
                <div key={item.label} data-dropdown>
                  {item.hasDropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="block py-2 sm:py-3 px-3 sm:px-4 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:bg-gray-200 w-full text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium">
                          {item.label}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.label && "rotate-180"
                          )}
                        />
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block py-2 sm:py-3 px-3 sm:px-4 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:bg-gray-200"
                    >
                      <span className="text-sm sm:text-base font-medium">
                        {item.label}
                      </span>
                    </Link>
                  )}

                  {/* Dynamic Mobile Dropdown Content */}
                  {item.hasDropdown && (
                    <div className="ml-4 space-y-1">
                      {dropdownConfig[
                        item.label as keyof typeof dropdownConfig
                      ]?.items.map((subItem, index) => (
                        <Link
                          key={index}
                          href={subItem.href || "#"}
                          onClick={() => {
                            closeMobileMenu();
                            // Small delay to ensure navigation completes
                            setTimeout(() => setActiveDropdown(null), 100);
                          }}
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
                  className="w-full rounded-full bg-main-red/70 text-white hover:bg-main-blue py-2 sm:py-3 transition-colors duration-200"
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
