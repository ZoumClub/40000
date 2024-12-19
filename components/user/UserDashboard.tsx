"use client";

import { useUserCars } from "@/lib/modules/user-cars/hooks/useUserCars";
import { UserCarList } from "./UserCarList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export function UserDashboard() {
  const { cars, isLoading, error } = useUserCars();

  if (error) {
    return <ErrorMessage message="Failed to load your cars" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Car Listings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your car listings and view bids from dealers
        </p>
      </div>

      <UserCarList cars={cars} />
    </div>
  );
}