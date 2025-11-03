"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./providers";
import { WrongPage } from "@/components/error/wrong-screen";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isOrphanage } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const containsSubstring = (target: string, text: string): boolean => {
    return text.toLowerCase().includes(target.toLowerCase());
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
