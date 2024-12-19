"use client";

import { z } from "zod";
import { SERVICE_NAMES } from "@/lib/constants/services";

export const serviceSchema = z.object({
  name: z.enum(SERVICE_NAMES, {
    required_error: "Please select a service",
  }),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Please enter a valid image URL"),
  icon: z.string().min(1, "Icon is required"),
  provider_name: z.string().min(1, "Provider name is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  whatsapp_number: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;