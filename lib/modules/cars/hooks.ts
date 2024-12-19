"use client";

import { useState } from "react";
import { toast } from "sonner";
import { markCarAsSold, updateCarStatus } from "./api";
import type { DealerCar } from "@/types/car";
import type { CarStatus } from "./types";

export function useCarStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsSold = async (car: DealerCar) => {
    try {
      setIsUpdating(true);
      const { success, error } = await markCarAsSold(car.id);

      if (!success) throw error;
      toast.success("Car marked as sold successfully");
      return true;
    } catch (error) {
      console.error("Error marking car as sold:", error);
      toast.error("Failed to mark car as sold");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStatus = async (carId: string, status: CarStatus) => {
    try {
      setIsUpdating(true);
      const { success, error } = await updateCarStatus(carId, status);

      if (!success) throw error;
      toast.success("Car status updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating car status:", error);
      toast.error("Failed to update car status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    handleMarkAsSold,
    updateStatus
  };
}