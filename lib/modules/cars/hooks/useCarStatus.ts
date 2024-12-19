"use client";

import { useState } from "react";
import { updateCarStatus } from "../api/dealer";
import { toast } from "sonner";
import type { DealerCar } from "@/types/dealerCar";

export function useCarStatus(dealerId: string, onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCarStatus = async (car: DealerCar) => {
    if (!dealerId || isUpdating || car.approval_status !== "approved") {
      return;
    }

    try {
      setIsUpdating(true);
      const newStatus = car.availability_status === 'sold' ? 'available' : 'sold';
      
      const { success, error } = await updateCarStatus(car.id, dealerId, newStatus);

      if (!success || error) throw error;
      
      toast.success(`Car marked as ${newStatus}`);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating car status:", error);
      toast.error("Failed to update car status");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    toggleCarStatus
  };
}