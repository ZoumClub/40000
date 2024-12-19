"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { UserCar } from "../types";

export function useBids() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBid = async (car: UserCar, amount: number) => {
    try {
      setIsSubmitting(true);

      // Validate car is available for bidding
      if (car.availability_status !== "available" || car.approval_status !== "approved") {
        throw new Error("Car is not available for bidding");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_car_bids")
        .insert({
          car_id: car.id,
          dealer_id: user.id,
          amount,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Bid placed successfully");
      return true;
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error(error instanceof Error ? error.message : "Failed to place bid");
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