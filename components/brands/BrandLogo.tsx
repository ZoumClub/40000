"use client";

import { cn } from "@/lib/utils";
import type { Brand } from "@/types/brand";

interface BrandLogoProps {
  brand: Brand;
  isSelected: boolean;
  onClick: () => void;
}

export function BrandLogo({ brand, isSelected, onClick }: BrandLogoProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-24 h-24 p-4 rounded-lg bg-white",
        "flex items-center justify-center",
        "border-2 transition-all duration-200",
        "hover:shadow-lg transform hover:-translate-y-1",
        isSelected 
          ? "border-primary shadow-md scale-105" 
          : "border-transparent hover:border-gray-200"
      )}
      title={brand.name}
    >
      <img
        src={brand.logo_url}
        alt={brand.name}
        className="w-full h-full object-contain"
        loading="lazy"
      />
      <span className="absolute -bottom-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
        {brand.name}
      </span>
    </button>
  );
}