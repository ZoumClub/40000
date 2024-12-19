"use client";

import { Calendar, Gauge, Fuel } from "lucide-react";

interface CarSpecsProps {
  year: number;
  mileage: string;
  fuelType: string;
}

export function CarSpecs({ year, mileage, fuelType }: CarSpecsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{year}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Gauge className="h-4 w-4" />
        <span>{mileage}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Fuel className="h-4 w-4" />
        <span>{fuelType}</span>
      </div>
    </div>
  );
}