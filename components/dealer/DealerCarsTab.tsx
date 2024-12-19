"use client";

import { useState } from "react";
import { useDealerCars } from "@/lib/hooks/useDealerCars";
import { useDealerAuth } from "@/lib/hooks/useDealerAuth";
import { useCarStatus } from "@/lib/modules/cars/hooks/useCarStatus";
import { DealerCarsTable } from "./tables/DealerCarsTable";
import { ErrorMessage } from "@/components/ui/error-message";
import { CarDetailsDialog } from "@/components/shared/dialogs/CarDetailsDialog";
import type { DealerCar } from "@/types/dealerCar";

export function DealerCarsTab() {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<DealerCar | null>(null);
  const { dealer } = useDealerAuth();
  
  const { cars, isLoading, error, refresh } = useDealerCars({
    dealerId: dealer?.id,
    autoFetch: !!dealer?.id
  });

  const { isUpdating, toggleCarStatus } = useCarStatus(dealer?.id || '', refresh);

  const handleViewDetails = (car: DealerCar) => {
    setSelectedCar(car);
    setShowDetailsDialog(true);
  };

  const handleMarkAsSold = async (car: DealerCar) => {
    await toggleCarStatus(car);
    refresh();
  };

  const handleCloseDialog = () => {
    setSelectedCar(null);
    setShowDetailsDialog(false);
  };

  if (error) {
    return <ErrorMessage message="Failed to load your cars" />;
  }

  if (!dealer) {
    return <ErrorMessage message="Please log in to view your cars" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Car Listings</h2>
      </div>

      <DealerCarsTable
        cars={cars}
        isLoading={isLoading}
        isUpdating={isUpdating}
        onViewDetails={handleViewDetails}
        onMarkAsSold={handleMarkAsSold}
      />

      <CarDetailsDialog
        open={showDetailsDialog}
        onClose={handleCloseDialog}
        car={selectedCar}
      />
    </div>
  );
}