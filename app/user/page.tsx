"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserDashboard } from "@/components/user/UserDashboard";
import { useUserAuth } from "@/lib/modules/user/hooks/useUserAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function UserDashboardPage() {
  const { isAuthenticated, isLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/user/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <UserDashboard />;
}