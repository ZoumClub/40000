"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceBookingDialog } from "./ServiceBookingDialog";
import { Service } from "@/types/service";
import { getServiceIcon } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const Icon = getServiceIcon(service.name);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img 
            src={service.image_url} 
            alt={service.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">{service.name}</h3>
            </div>
            <p className="text-muted-foreground mb-4">{service.description}</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(service.price)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => setShowBooking(true)}
          >
            Book Service
          </Button>
        </CardFooter>
      </Card>

      <ServiceBookingDialog
        service={service}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
}