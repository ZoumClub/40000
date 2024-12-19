"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Verify admin role
          const { data: { role } } = await supabase.rpc('get_user_role');
          if (role === 'admin') {
            setUser(session.user);
          } else {
            await supabase.auth.signOut();
            router.push('/');
          }
        } else {
          setUser(null);
          router.push('/admin/login');
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return {
    user,
    isLoading,
    signOut,
  };
}