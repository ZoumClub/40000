"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useUserListings } from "@/lib/hooks/useUserListings";
import { columns } from "./columns/userListingsColumns";
import { UserListingDialog } from "./dialogs/UserListingDialog";
import { BidsDialog } from "./dialogs/BidsDialog";
import type { UserCar } from "@/types/userCar";

export function UserListingsTab() {
  const [selectedCar, setSelectedCar] = useState<UserCar | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBids, setShowBids] = useState(false);
  const { listings, isLoading, refresh } = useUserListings();

  const handleViewDetails = (car: UserCar) => {
    setSelectedCar(car);
    setShowDetails(true);
  };

  const handleViewBids = (car: UserCar) => {
    setSelectedCar(car);
    setShowBids(true);
  };

  const handleClose = () => {
    setSelectedCar(null);
    setShowDetails(false);
    setShowBids(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Car Listings</h2>
      </div>

      <DataTable
        columns={columns}
        data={listings}
        isLoading={isLoading}
        meta={{
          onViewDetails: handleViewDetails,
          onViewBids: handleViewBids
        }}
      />

      {selectedCar && (
        <>
          <UserListingDialog
            car={selectedCar}
            open={showDetails}
            onClose={handleClose}
          />

          <BidsDialog
            car={selectedCar}
            open={showBids}
            onClose={handleClose}
          />
        </>
      )}
    </div>
  );
}