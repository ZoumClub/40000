"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

export function useCarSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCar = async (data: DealerCarFormData, carId?: string) => {
    try {
      setIsSubmitting(true);

      if (carId) {
        // Update existing car
        const { error } = await supabase
          .from("dealer_cars")
          .update(data)
          .eq("id", carId);

        if (error) throw error;
        toast.success("Car listing updated successfully");
      } else {
        // Create new car
        const { error } = await supabase
          .from("dealer_cars")
          .insert([data]);

        if (error) throw error;
        toast.success("Car listing created successfully");
      }

      return true;
    } catch (error) {
      console.error("Error submitting car:", error);
      toast.error("Failed to save car listing");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitCar,
    isSubmitting
  };
}