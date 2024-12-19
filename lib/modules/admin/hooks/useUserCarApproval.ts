"use client";

import { useState } from "react";
import { updateUserCarApproval } from "../api";
import { toast } from "sonner";

export function useUserCarApproval(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleApproval = async (carId: string, approved: boolean) => {
    try {
      setIsUpdating(true);
      const { success, error } = await updateUserCarApproval(carId, approved);

      if (!success) throw new Error(error);
      
      toast.success(`Car ${approved ? "approved" : "unapproved"} successfully`);
      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update approval status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    toggleApproval
  };
}