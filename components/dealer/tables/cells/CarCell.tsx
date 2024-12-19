"use client";

import { type CellContext } from "@tanstack/react-table";
import type { DealerCar } from "@/types/dealerCar";

export function CarCell({ row }: CellContext<DealerCar, unknown>) {
  const car = row.original;
  const isSold = car.availability_status === "sold";
  
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        {car.images?.[0] && (
          <div className="relative">
            <img
              src={car.images[0]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold transform -rotate-45">SOLD</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <div className="font-medium">{car.brand} {car.model}</div>
        <div className="text-sm text-muted-foreground">{car.year}</div>
      </div>
    </div>
  );
}