
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarSpecs } from "@/components/cars/CarSpecs";
import { CarFeatures } from "@/components/cars/CarFeatures";
import { PriceTag } from "@/components/cars/PriceTag";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DealerCar } from "@/types/dealerCar";

interface CarDetailsDialogProps {
  car: DealerCar | null;
  open: boolean;
  onClose: () => void;
}

export function CarDetailsDialog({ car, open, onClose }: CarDetailsDialogProps) {
  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {car.brand} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Status */}
          <div className="flex justify-between items-center">
            <PriceTag price={car.price} savings={car.savings} />
            <Badge variant={car.status === "approved" ? "success" : "secondary"}>
              {car.status}
            </Badge>
          </div>
          
          <Separator />
          
          {/* Gallery */}
          <CarGallery images={car.images || []} video={car.video} />
          
          <Separator />
          
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
      </DialogContent>
    </Dialog>
  );
}
