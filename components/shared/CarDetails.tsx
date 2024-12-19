"use client";

import { CarSpecs } from "@/components/cars/CarSpecs";
import { CarFeatures } from "@/components/cars/CarFeatures";
import { Separator } from "@/components/ui/separator";
import type { BaseCar } from "@/types/car";

interface CarDetailsProps {
  car: BaseCar;
}

export function CarDetails({ car }: CarDetailsProps) {
  const isSold = car.status === "sold";

  return (
    <div className="relative">
      {isSold && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <span className="text-white text-4xl font-bold transform -rotate-45">
            SOLD
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Specs */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Specifications</h3>
          <CarSpecs
            year={car.year}
            mileage={car.mileage_range}
            fuelType={car.fuel_type}
          />
        </div>
        
        <Separator />
        
        {/* Features */}
        <CarFeatures features={car.features || []} />
        
        <Separator />
        
        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Body Type</h4>
            <p>{car.body_type}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Transmission</h4>
            <p>{car.transmission}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Exterior Color</h4>
            <p>{car.exterior_color}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Interior Color</h4>
            <p>{car.interior_color}</p>
          </div>
        </div>
      </div>
    </div>
  );
}