"use client";

import { z } from "zod";

export const accessorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Please enter a valid image URL"),
  provider_name: z.string().min(1, "Provider name is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  whatsapp_number: z.string().optional(),
});

export type AccessoryFormData = z.infer<typeof accessorySchema>;