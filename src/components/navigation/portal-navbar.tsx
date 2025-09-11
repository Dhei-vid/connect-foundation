"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@/common/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  // MessageCircleMore,
  Menu,
  LogOut,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { PersonAvatar } from "@/components/ui/person-avatar";
import LoadingSpinner from "../general/spinner";
import { toast } from "sonner";
import { useAuthContext } from "../providers";

interface PortalNavbarProps {
  user: User;
  onMenuClick: () => void;
}

export default function PortalNavbar({ user, onMenuClick }: PortalNavbarProps) {
  const { signOut } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [navigationLoading, setNavigationLoading] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialDarkMode =
      savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(initialDarkMode);
    updateTheme(initialDarkMode);
  }, []);

  // Function to update theme classes and localStorage
  const updateTheme = (darkMode: boolean) => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  const dropDownItems = [
    {
      title: "Profile",
      Icon: UserIcon,
      action: () => {
        setNavigationLoading("Profile");
        router.push("/portal/profile");
      },
    },
    {
      title: "Settings",
      Icon: Settings,
      action: () => {
        setNavigationLoading("Settings");
        router.push("/portal/settings");
      },
    },
  ];

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      // trigger logout
      await signOut();
      toast.success("Logged out successfully!");
      router.push("/admin/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but redirecting anyway");
      // Force redirect even if logout fails
      router.push("/admin/signin");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4 h-18">
      <div className="flex flex-row items-center justify-between">
        {/* Left side - Menu button for mobile */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu />
          </Button>

          {/* Breadcrumb or page title can go here */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome,{" "}
              {`${user?.firstName ?? "User"} ${user?.lastName ?? "User"}`}
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex flex-row items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost">
            <Bell />
            {/* <BellRing /> */}
          </Button>

          {/* Messages */}
          {/* <Button variant="ghost">
            <MessageCircleMore />
          </Button> */}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                <PersonAvatar
                  name={`${user?.displayName ?? "User"} ${
                    user?.lastName ?? "User"
                  }`}
                  size="lg"
                  className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {`${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dropDownItems.map(({ title, action, Icon }, index) => (
                <DropdownMenuItem
                  className={"cursor-pointer"}
                  key={index}
                  onClick={action}
                  disabled={navigationLoading === title}
                >
                  {navigationLoading === title ? (
                    <>
                      <LoadingSpinner />
                      {title}...
                    </>
                  ) : (
                    <>
                      <Icon />
                      {title}
                    </>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <>
                    <LoadingSpinner />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut />
                    Log out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
