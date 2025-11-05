"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "./providers";
import { WrongPage } from "@/components/error/wrong-screen";
import { toast } from "sonner";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isOrphanage, isOnboardingComplete } =
    useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  // Match the entire word
  const containsSubstring = (target: string, text: string): boolean => {
    const pattern = new RegExp(`\\b${target}\\b`, "i"); // 'i' for case-insensitive
    return pattern.test(text);
  };

  const handleRedirect = (url: string) => {
    setIsLoading(true);
    router.push(url);

    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  };

  if (isAuthenticated) {
    if (isAdmin) {
      if (containsSubstring("orphanage", pathname)) {
        return (
          <WrongPage
            btnLoading={isLoading}
            onNavigate={() => handleRedirect("/admin")}
          />
        );
      }
    }

    if (isOrphanage) {
      if (containsSubstring("admin", pathname)) {
        return (
          <WrongPage
            btnLoading={isLoading}
            onNavigate={() => handleRedirect("/orphanage")}
          />
        );
      }
    }
  }

  return <div>{children}</div>;
};

export default AuthProvider;
