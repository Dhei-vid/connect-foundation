"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChange,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "@/firebase/auth";
import type { User } from "@/common/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  isAdmin: boolean;
  isOrphanage: boolean;
  isOnboardingComplete: boolean | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: "ADMIN" | "ORPHANAGE"
  ) => Promise<User>;
  signOut: () => Promise<void>;
  requireAuth: (requiredRole?: "ADMIN" | "ORPHANAGE") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AppProviders({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = user !== null;
  const userRole = user?.role || null;
  const isAdmin = userRole === "ADMIN";
  const isOrphanage = userRole === "ORPHANAGE";
  const isOnboardingComplete = user?.onboardingCompleted || null;

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmail(email, password);
      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: "ADMIN" | "ORPHANAGE"
  ): Promise<User> => {
    try {
      const user = await signUpWithEmail(email, password, displayName, role);
      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
      toast.success("Signed Out Successfully");
      // Redirect based on user role
      if (isAdmin) {
        router.push("/admin/signin");
      } else if (isOrphanage) {
        router.push("/orphanage/signin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Signed Out Failed!. Please try again later");
    }
  };

  const requireAuth = (requiredRole?: "ADMIN" | "ORPHANAGE"): void => {
    if (!isLoading && !isAuthenticated) {
      // Redirect based on required role or default to admin
      if (requiredRole === "ORPHANAGE") {
        router.push("/orphanage/signin");
      } else {
        router.push("/admin/signin");
      }
    } else if (!isLoading && isAuthenticated && requiredRole) {
      // Check if user has the required role
      if (requiredRole !== userRole) {
        // Redirect to appropriate dashboard based on user role
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "ORPHANAGE") {
          router.push("/orphanage/dashboard");
        }
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    userRole,
    isAdmin,
    isOrphanage,
    signIn,
    signUp,
    signOut,
    requireAuth,
    isOnboardingComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a Providers component");
  }
  return context;
}
