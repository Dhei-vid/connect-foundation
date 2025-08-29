"use client";

import React, { useEffect } from "react";
import { Provider } from "jotai";
import { useAtom } from "jotai";
import { userAtom, isLoadingAtom } from "@/store/auth";
import { onAuthStateChange } from "@/firebase/auth";

function AppProviders({ children }: { children: React.ReactNode }) {
  const [, setUser] = useAtom(userAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <AppProviders>{children}</AppProviders>
    </Provider>
  );
}
