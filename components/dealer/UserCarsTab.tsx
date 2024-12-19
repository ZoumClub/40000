"use client";

import { useState } from "react";
import { useUserCars } from "@/lib/hooks/useUserCars";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns/userCarsColumns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { BidDialog } from "./dialogs/BidDialog";
import { CarDetailsDialog } from "@/components/shared/dialogs/CarDetailsDialog";
import type { UserCar } from "@/types/car";

export function UserCarsTab() {
  const [selectedCar, setSelectedCar] = useState<UserCar | null>(null);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { cars, isLoading, error, refresh } = useUserCars();

  const handlePlaceBid = (car: UserCar) => {
    setSelectedCar(car);
    setShowBidDialog(true);
  };

  const handleViewDetails = (car: UserCar) => {
    setSelectedCar(car);
    setShowDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCar(null);
    setShowBidDialog(false);
    setShowDetailsDialog(false);
    refresh();
  };

  if (error) {
    return <ErrorMessage message="Failed to load user cars" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">User Cars</h2>
      
      <DataTable
        columns={columns}
        data={cars}
        isLoading={isLoading}
        onPlaceBid={handlePlaceBid}
        onViewDetails={handleViewDetails}
      />

      <BidDialog
        car={selectedCar}
        open={showBidDialog}
        onClose={handleCloseDialog}
      />

      <CarDetailsDialog
        open={showDetailsDialog}
        onClose={handleCloseDialog}
        car={selectedCar}
      />
    </div>
  );
}