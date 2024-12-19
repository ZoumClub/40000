"use client";

import { type CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ToggleStatusButton } from "../../buttons/ToggleStatusButton";
import type { DealerCar } from "@/types/dealerCar";

interface ActionsCellProps {
  row: CellContext<DealerCar, unknown>["row"];
  onViewDetails?: (car: DealerCar) => void;
  onMarkAsSold?: (car: DealerCar) => void;
  isUpdating?: boolean;
}

export function ActionsCell({ row, onViewDetails, onMarkAsSold, isUpdating }: ActionsCellProps) {
  const car = row.original;
  
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails?.(car)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <ToggleStatusButton
        car={car}
        isUpdating={isUpdating}
        onToggle={() => onMarkAsSold?.(car)}
      />
    </div>
  );
}