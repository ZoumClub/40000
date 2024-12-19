"use client";

import { z } from "zod";

export const userLoginSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  pin: z.string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d+$/, "PIN must contain only numbers"),
});