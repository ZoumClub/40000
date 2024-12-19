"use client";

import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().url("Please enter a valid logo URL"),
  order_index: z.number().int().min(0, "Order must be a positive number"),
  is_active: z.boolean().default(true),
});

export type BrandFormData = z.infer<typeof brandSchema>;