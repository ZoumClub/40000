"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CarDialog } from "./CarDialog";
import { CarImage } from "./CarImage";
import { PriceTag } from "./PriceTag";
import { CarSpecs } from "./CarSpecs";
import { DealerInfo } from "./DealerInfo";
import type { DealerCar } from "@/types/dealerCar";

interface CarCardProps {
  car: DealerCar;
}

export function CarCard({ car }: CarCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isSold = car.availability_status === "sold";

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Main Image with Type Badge */}
          <div className="relative aspect-[16/9]">
            <Badge 
              variant={car.type === "new" ? "default" : "secondary"}
              className="absolute top-4 left-4 z-10 uppercase font-semibold"
            >
              {car.type}
            </Badge>

            {car.images?.[0] ? (
              <CarImage
                src={car.images[0]}
                alt={`${car.brand} ${car.model}`}
                isSold={isSold}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Car Info */}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">
              {car.brand} {car.model}
            </h3>
            
            <CarSpecs 
              year={car.year}
              mileage={car.mileage_range}
              fuelType={car.fuel_type}
            />
            
            <PriceTag price={car.price} savings={car.savings} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 p-6 pt-0">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </Button>
          {car.dealer && <DealerInfo dealer={car.dealer} />}
        </CardFooter>
      </Card>

      <CarDialog
        car={car}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}