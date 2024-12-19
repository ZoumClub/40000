"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createDealerCar, updateDealerCar } from "@/lib/services/dealerCars";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";
import type { DealerCar } from "@/types/dealerCar";

interface UseCarFormSubmitOptions {
  car?: DealerCar | null;
  onSuccess: () => void;
}

export function useCarFormSubmit({ car, onSuccess }: UseCarFormSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: DealerCarFormData) => {
    try {
      setIsSubmitting(true);

      const result = car?.id
        ? await updateDealerCar(car.id, data)
        : await createDealerCar(data);

      if (!result.success) throw result.error;

      toast.success(car ? "Car updated successfully" : "Car created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving car:", error);
      toast.error("Failed to save car listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}