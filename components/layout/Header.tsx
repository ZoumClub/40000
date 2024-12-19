"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, LogIn, LogOut } from "lucide-react";
import { useUserAuth } from "@/lib/modules/user/hooks/useUserAuth";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, name, signOut } = useUserAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-2xl font-bold text-primary"
          >
            <Car className="h-6 w-6" />
            ZoooM
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {name}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/user")}
                >
                  My Cars
                </Button>
                <Button
                  variant="ghost"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => router.push("/user/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                User Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}