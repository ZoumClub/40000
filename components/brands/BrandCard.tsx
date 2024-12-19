import { Card } from "@/components/ui/card";
import { Brand } from "@/types/brand";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  brand: Brand;
  isSelected: boolean;
  onClick: () => void;
}

export function BrandCard({ brand, isSelected, onClick }: BrandCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-6 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="relative w-24 h-24">
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    </Card>
  );
}