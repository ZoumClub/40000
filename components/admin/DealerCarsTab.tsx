"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useDealerCars } from "@/lib/hooks/useDealerCars";
import { DealerCarDialog } from "./dialogs/DealerCarDialog";
import { columns } from "./columns/dealerCarsColumns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function DealerCarsTab() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const { cars, isLoading, refresh } = useDealerCars();

  const handleEdit = (car) => {
    setSelectedCar(car);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("dealer_cars")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Car listing deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car listing");
    }
  };

  const handleClose = () => {
    setSelectedCar(null);
    setShowDialog(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dealer Car Listings</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Listing</Button>
      </div>

      <DataTable
        columns={columns}
        data={cars}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DealerCarDialog
        open={showDialog}
        onClose={handleClose}
        car={selectedCar}
      />
    </div>
  );
}