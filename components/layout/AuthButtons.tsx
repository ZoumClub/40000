"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  name?: string;
  onSignOut: () => void;
}

export function AuthButtons({ isAuthenticated, name, onSignOut }: AuthButtonsProps) {
  const router = useRouter();

  if (isAuthenticated) {
    return (
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
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/user/login")}
    >
      <LogIn className="h-4 w-4 mr-2" />
      User Login
    </Button>
  );
}