"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarSpecs } from "@/components/cars/CarSpecs";
import { PriceTag } from "@/components/ui/price-tag";
import { BidsList } from "./BidsList";
import type { UserCar } from "@/lib/modules/user-cars/types";

interface UserCarCardProps {
  car: UserCar;
}

export function UserCarCard({ car }: UserCarCardProps) {
  const [showBids, setShowBids] = useState(false);
  const bids = car.user_car_bids || [];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Car Info */}
        <h3 className="text-2xl font-bold mb-4">
          {car.brand} {car.model}
        </h3>
        
        <CarSpecs 
          year={car.year}
          mileage={car.mileage_range}
          fuelType={car.fuel_type}
        />
        
        <PriceTag price={car.price} />

        {/* Bids Count */}
        {bids.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {bids.length} bid{bids.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full"
          variant={showBids ? "outline" : "default"}
          onClick={() => setShowBids(!showBids)}
        >
          {showBids ? "Hide Bids" : "View Bids"}
        </Button>
      </CardFooter>

      {showBids && (
        <div className="px-6 pb-6">
          <BidsList bids={bids} />
        </div>
      )}
    </Card>
  );
}