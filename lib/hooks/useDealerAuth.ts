"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Dealer } from "@/types/dealer";

export function useDealerAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get dealer data
          const { data: dealer } = await supabase
            .from("dealers")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (dealer) {
            setDealer(dealer);
          } else {
            await supabase.auth.signOut();
            router.push("/dealer/login");
          }
        } else {
          router.push("/dealer/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/dealer/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setDealer(null);
        router.push("/dealer/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/dealer/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    dealer,
    isLoading,
    signOut,
  };
}