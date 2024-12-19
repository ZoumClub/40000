"use client";

import { AccessoryCard } from "./AccessoryCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Accessory } from "@/lib/modules/accessories";

interface AccessoryGridProps {
  accessories: Accessory[];
  isLoading?: boolean;
  onAddToCart?: (accessory: Accessory) => void;
}

export function AccessoryGrid({ accessories, isLoading, onAddToCart }: AccessoryGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!accessories.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No accessories available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {accessories.map((accessory) => (
        <AccessoryCard
          key={accessory.id}
          accessory={accessory}
          onAddToCart={() => onAddToCart?.(accessory)}
        />
      ))}
    </div>
  );
}