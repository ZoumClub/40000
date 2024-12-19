"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import type { UserCar } from "@/types/userCar";

interface BidsDialogProps {
  car: UserCar | null;
  open: boolean;
  onClose: () => void;
}

export function BidsDialog({ car, open, onClose }: BidsDialogProps) {
  if (!car) return null;

  const bids = car.user_car_bids || [];
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Bids for {car.brand} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <p className="text-xl font-bold">{formatPrice(car.price)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bids</p>
              <p className="text-xl font-bold text-center">{bids.length}</p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {sortedBids.map((bid) => (
              <div 
                key={bid.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{bid.dealer?.name}</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(bid.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(bid.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  {bid.dealer?.phone && (
                    <p className="text-sm text-muted-foreground">
                      {bid.dealer.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {bids.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bids yet
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}