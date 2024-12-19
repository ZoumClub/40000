"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { Service } from "@/types/service";
import { formatPrice } from "@/lib/utils";

interface ServiceBookingDialogProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

export function ServiceBookingDialog({ service, open, onClose }: ServiceBookingDialogProps) {
  const handleCall = () => {
    window.location.href = `tel:${service.contact_number}`;
  };

  const handleWhatsApp = () => {
    if (service.whatsapp_number) {
      window.location.href = `https://wa.me/${service.whatsapp_number}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Service Provider</h4>
            <p className="text-lg">{service.provider_name}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Service Fee</h4>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(service.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCall}
              disabled={!service.contact_number}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              className="w-full bg-[#25D366] hover:bg-[#128C7E]"
              onClick={handleWhatsApp}
              disabled={!service.whatsapp_number}
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