"use client";

import { useState } from "react";
import { placeBid } from "@/lib/api/bids";
import { toast } from "sonner";
import type { UserCar } from "@/types/userCar";

export function useBids() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBid = async (car: UserCar, amount: number) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await placeBid(car.id, amount);
      
      if (error) throw error;
      toast.success("Bid placed successfully");
      return true;
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to place bid. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBid,
    isSubmitting
  };
}