"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authenticateUser } from "../api";

export function useUserAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    name: undefined,
    pin: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const pin = localStorage.getItem("userPin");
        const name = localStorage.getItem("userName");

        if (!pin || !name) {
          setAuthState({ isAuthenticated: false });
          setIsLoading(false);
          return;
        }

        const isValid = await authenticateUser(name, pin);
        
        setAuthState({
          isAuthenticated: isValid,
          name: isValid ? name : undefined,
          pin: isValid ? pin : undefined,
        });

        if (!isValid) {
          localStorage.removeItem("userPin");
          localStorage.removeItem("userName");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({ isAuthenticated: false });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = () => {
    localStorage.removeItem("userPin");
    localStorage.removeItem("userName");
    setAuthState({ isAuthenticated: false });
    router.push("/");
  };

  return {
    ...authState,
    isLoading,
    signOut,
  };
}