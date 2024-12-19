"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { DealerCar } from "@/types/dealerCar";

interface CarDetailsDialogProps {
  car: DealerCar | null;
  open: boolean;
  onClose: () => void;
}

export function CarDetailsDialog({ car, open, onClose }: CarDetailsDialogProps) {
  if (!car) return null;

  const handleCall = () => {
    if (car.dealer?.phone) {
      window.location.href = `tel:${car.dealer.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (car.dealer?.whatsapp) {
      window.location.href = `https://wa.me/${car.dealer.whatsapp}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {car.brand} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Type Badge */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatPrice(car.price)}
                </span>
                {car.savings && car.savings > 0 && (
                  <span className="text-sm font-medium text-green-600">
                    Save {formatPrice(car.savings)}
                  </span>
                )}
              </div>
              {car.savings && car.savings > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">
                    {formatPrice(car.price + car.savings)}
                  </span>
                </div>
              )}
            </div>
            <Badge variant={car.type === "new" ? "default" : "secondary"}>
              {car.type}
            </Badge>
          </div>

          <Separator />

          {/* Image Gallery */}
          <div className="space-y-4">
            {car.images && car.images.length > 0 && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${car.brand} ${car.model} view ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{car.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{car.mileage_range}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{car.fuel_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p className="font-medium">{car.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Body Type</p>
                <p className="font-medium">{car.body_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Owners</p>
                <p className="font-medium">{car.previous_owners || 0}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {car.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Exterior Color</p>
              <p className="font-medium">{car.exterior_color}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interior Color</p>
              <p className="font-medium">{car.interior_color}</p>
            </div>
          </div>

          {/* Contact Dealer */}
          {car.dealer && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Dealer</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Listed by:</p>
                    <p className="font-medium">{car.dealer.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleCall}
                      disabled={!car.dealer.phone}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      onClick={handleWhatsApp}
                      disabled={!car.dealer.whatsapp}
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}