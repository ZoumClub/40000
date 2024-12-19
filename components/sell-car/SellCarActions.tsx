import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface SellCarActionsProps {
  onSellCar: () => void;
}

export function SellCarActions({ onSellCar }: SellCarActionsProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onSellCar} className="w-full sm:w-auto">
        <Car className="h-4 w-4 mr-2" />
        Start Selling
      </Button>
    </div>
  );
}