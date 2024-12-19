"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { DealerCar } from "@/types/dealerCar";

interface DealerCarsTableProps {
  cars: DealerCar[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onViewDetails: (car: DealerCar) => void;
  onMarkAsSold: (car: DealerCar) => void;
}

export function DealerCarsTable({
  cars,
  isLoading,
  isUpdating,
  onViewDetails,
  onMarkAsSold,
}: DealerCarsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DataTable
      columns={columns({ onViewDetails, onMarkAsSold, isUpdating })}
      data={cars}
    />
  );
}