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
import { formatPrice } from "@/lib/utils";
import { CarDetails } from "@/components/shared/CarDetails";
import { BidsList } from "./BidsList";
import type { UserCar } from "@/types/userCar";

interface UserListingDialogProps {
  car: UserCar | null;
  open: boolean;
  onClose: () => void;
}

export function UserListingDialog({ car, open, onClose }: UserListingDialogProps) {
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
            <div className="text-3xl font-bold">
              {formatPrice(car.price)}
            </div>
            <Badge
              variant={
                car.approval_status === "approved" ? "success" :
                car.approval_status === "rejected" ? "destructive" :
                "secondary"
              }
            >
              {car.approval_status}
            </Badge>
          </div>

          <Separator />

          {/* Seller Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
            <p className="text-muted-foreground">
              Listed by: {car.seller_name}
            </p>
          </div>

          <Separator />

          {/* Car Details */}
          <CarDetails car={car} />

          <Separator />

          {/* Bids */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dealer Bids</h3>
            <BidsList bids={car.bids || []} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}