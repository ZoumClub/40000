"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessoryBookingDialog } from "./AccessoryBookingDialog";
import { formatPrice } from "@/lib/utils";
import type { Accessory } from "@/lib/modules/accessories";

interface AccessoryCardProps {
  accessory: Accessory;
}

export function AccessoryCard({ accessory }: AccessoryCardProps) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img 
            src={accessory.image_url} 
            alt={accessory.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{accessory.name}</h3>
            <p className="text-muted-foreground mb-4">{accessory.description}</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(accessory.price)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => setShowBooking(true)}
          >
            Order Now
          </Button>
        </CardFooter>
      </Card>

      <AccessoryBookingDialog
        accessory={accessory}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
}