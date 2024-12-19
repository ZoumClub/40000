"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useDealerAuth } from "@/lib/hooks/useDealerAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dealer, isLoading, signOut } = useDealerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">AutoMarket Dealer Portal</h1>
            {dealer && (
              <p className="text-sm text-muted-foreground">
                Welcome, {dealer.name}
              </p>
            )}
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}