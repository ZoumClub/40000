"use client";

import { z } from "zod";

export const bidSchema = z.object({
  amount: z.number()
    .positive("Bid amount must be greater than 0")
    .refine((val) => val >= 100, "Minimum bid amount is £100"),
});

export type BidFormData = z.infer<typeof bidSchema>;