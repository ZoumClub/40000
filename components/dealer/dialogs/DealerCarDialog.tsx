"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CarListingForm } from "../forms/CarListingForm";
import type { DealerCar } from "@/types/dealerCar";

interface DealerCarDialogProps {
  open: boolean;
  onClose: () => void;
  car?: DealerCar | null;
  dealerId: string;
}

export function DealerCarDialog({ open, onClose, car, dealerId }: DealerCarDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {car ? "Edit Car Listing" : "Add New Car Listing"}
          </DialogTitle>
        </DialogHeader>

        <CarListingForm 
          car={car} 
          onSuccess={onClose} 
          dealerId={dealerId}
        />
      </DialogContent>
    </Dialog>
  );
}