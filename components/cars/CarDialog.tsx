"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarGallery } from "./CarGallery";
import { CarSpecs } from "./CarSpecs";
import { CarFeatures } from "./CarFeatures";
import { PriceTag } from "./PriceTag";
import { DealerContact } from "./DealerContact";
import { Car } from "@/types/car";
import { X } from "lucide-react";

interface CarDialogProps {
  car: Car;
  open: boolean;
  onClose: () => void;
}

export function CarDialog({ car, open, onClose }: CarDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-row justify-between items-center space-y-0 pb-4">
          <DialogTitle className="text-2xl">{car.name}</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Section */}
          <div className="flex justify-between items-center">
            <PriceTag price={car.price} savings={car.savings} />
            <Badge variant={car.type === "new" ? "default" : "secondary"}>
              {car.type === "new" ? "New" : "Used"}
            </Badge>
          </div>
          
          <Separator />
          
          {/* Gallery Section */}
          <CarGallery images={car.images} video={car.video} />
          
          <Separator />
          
          {/* Specs Section */}
          <CarSpecs specs={car.specs} />
          
          <Separator />
          
          {/* Features Section */}
          <CarFeatures features={car.features} />
          
          <Separator />
          
          {/* Dealer Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Dealer</h3>
            <DealerContact dealer={car.dealer} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}