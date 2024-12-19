import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SellCarHeaderProps {
  onClose: () => void;
}

export function SellCarHeader({ onClose }: SellCarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Sell Your Car</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 hover:bg-gray-100 rounded-full"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
}