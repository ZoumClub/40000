"use client";

import { z } from "zod";
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES,
  BODY_TYPES,
  MILEAGE_RANGES,
  COLORS,
  CAR_FEATURES 
} from "@/lib/modules/cars/constants";

export const sellCarSchema = z.object({
  // Contact Information
  seller_name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  pin: z.string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d+$/, "PIN must contain only numbers"),

  // Car Information
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1),
  price: z.number()
    .positive("Price must be greater than 0")
    .max(1000000000, "Price is too high"),
  mileage_range: z.enum(MILEAGE_RANGES as [string, ...string[]]),
  previous_owners: z.number()
    .int()
    .min(0, "Previous owners cannot be negative")
    .max(100, "Too many previous owners"),

  // Technical Specifications
  fuel_type: z.enum(FUEL_TYPES as [string, ...string[]]),
  transmission: z.enum(TRANSMISSION_TYPES as [string, ...string[]]),
  body_type: z.enum(BODY_TYPES as [string, ...string[]]),
  exterior_color: z.enum(COLORS as [string, ...string[]]),
  interior_color: z.enum(COLORS as [string, ...string[]]),

  // Features
  features: z.array(z.string())
    .min(1, "Please select at least one feature")
}).transform(data => ({
  ...data,
  pin: data.pin.padStart(4, '0'), // Ensure 4 digits
  seller_name: data.seller_name.trim(),
  model: data.model.trim()
}));