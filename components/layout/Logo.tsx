"use client";

import { Car } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push("/")}
      className="flex items-center gap-2 text-2xl font-bold text-primary"
    >
      <Car className="h-6 w-6" />
      ZoooM
    </button>
  );
}