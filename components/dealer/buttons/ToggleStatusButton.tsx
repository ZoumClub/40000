"use client";

import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import type { DealerCar } from "@/types/dealerCar";

interface ToggleStatusButtonProps {
  car: DealerCar;
  isUpdating?: boolean;
  onToggle: (car: DealerCar) => void;
}

export function ToggleStatusButton({ car, isUpdating, onToggle }: ToggleStatusButtonProps) {
  const isSold = car.availability_status === "sold";
  const isDisabled = car.approval_status !== "approved" || isUpdating;

  return (
    <Button
      variant={isSold ? "secondary" : "default"}
      size="sm"
      onClick={() => onToggle(car)}
      disabled={isDisabled}
    >
      <DollarSign className="h-4 w-4 mr-2" />
      {isSold ? "Mark Available" : "Mark as Sold"}
    </Button>
  );
}