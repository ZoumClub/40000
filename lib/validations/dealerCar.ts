import { z } from "zod";
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES,
  BODY_TYPES,
  MILEAGE_RANGES,
  COLORS,
  CAR_FEATURES 
} from "@/lib/modules/cars/constants";

export const dealerCarSchema = z.object({
  dealer_id: z.string().uuid("Please select a dealer"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1),
  price: z.number()
    .positive("Price must be greater than 0")
    .max(1000000000, "Price is too high"),
  savings: z.number()
    .min(0, "Savings must be 0 or greater")
    .optional(),
  mileage_range: z.string().min(1, "Mileage range is required"),
  previous_owners: z.number()
    .int()
    .min(0, "Previous owners cannot be negative"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  body_type: z.string().min(1, "Body type is required"),
  exterior_color: z.string().min(1, "Exterior color is required"),
  interior_color: z.string().min(1, "Interior color is required"),
  features: z.array(z.string()).min(1, "Please select at least one feature"),
  type: z.enum(['new', 'used'])
});

export type DealerCarFormData = z.infer<typeof dealerCarSchema>;