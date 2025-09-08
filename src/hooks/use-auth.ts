"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Check for authentication state in localStorage
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("admin-auth");
        if (authData) {
          const parsed = JSON.parse(authData);
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: parsed.user,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  const signIn = (email: string, password: string) => {
    // Mock authentication - in real app, this would call your auth API
    if (email && password) {
      const user = {
        name: "Admin User",
        email: email,
        role: "admin",
      };
      
      const authData = {
        user,
        token: "mock-token-" + Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      
      localStorage.setItem("admin-auth", JSON.stringify(authData));
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });
      
      return true;
    }
    return false;
  };

  const signOut = () => {
    localStorage.removeItem("admin-auth");
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    router.push("/admin/signin");
  };

  const requireAuth = () => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/admin/signin");
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    requireAuth,
  };
}
