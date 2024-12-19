"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellCarSchema } from "../validation";
import type { SellCarFormData } from "../types";

const defaultValues: SellCarFormData = {
  seller_name: "",
  pin: "",
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
};

export function useCarForm() {
  return useForm<SellCarFormData>({
    resolver: zodResolver(sellCarSchema),
    defaultValues,
    mode: "onChange",
  });
}