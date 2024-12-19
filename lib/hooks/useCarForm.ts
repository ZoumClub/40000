"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealerCarSchema } from "@/lib/validations/dealerCar";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";
import type { DealerCar } from "@/types/dealerCar";

export function useCarForm(car?: DealerCar | null) {
  return useForm<DealerCarFormData>({
    resolver: zodResolver(dealerCarSchema),
    defaultValues: car ? {
      dealer_id: car.dealer_id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage_range: car.mileage_range,
      previous_owners: car.previous_owners,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      body_type: car.body_type,
      exterior_color: car.exterior_color,
      interior_color: car.interior_color,
      features: car.features,
      type: car.type,
      // Don't set images/video as they need to be File objects
      images: [],
      video: undefined,
    } : {
      dealer_id: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage_range: "",
      previous_owners: 0,
      fuel_type: "",
      transmission: "",
      body_type: "",
      exterior_color: "",
      interior_color: "",
      features: [],
      type: "new",
      images: [],
      video: undefined,
    },
  });
}