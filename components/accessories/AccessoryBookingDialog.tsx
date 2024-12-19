"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { Accessory } from "@/lib/modules/accessories";
import { formatPrice } from "@/lib/utils";

interface AccessoryBookingDialogProps {
  accessory: Accessory;
  open: boolean;
  onClose: () => void;
}

export function AccessoryBookingDialog({ accessory, open, onClose }: AccessoryBookingDialogProps) {
  const handleCall = () => {
    window.location.href = `tel:${accessory.contact_number}`;
  };

  const handleWhatsApp = () => {
    if (accessory.whatsapp_number) {
      window.location.href = `https://wa.me/${accessory.whatsapp_number}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order {accessory.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Provider</h4>
            <p className="text-lg">{accessory.provider_name}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Price</h4>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(accessory.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCall}
              disabled={!accessory.contact_number}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={handleWhatsApp}
              disabled={!accessory.whatsapp_number}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}