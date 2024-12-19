import { z } from "zod";
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  BODY_TYPES, 
  MILEAGE_RANGES, 
  COLORS,
  CAR_FEATURES 
} from "@/types/sellCar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const sellCarSchema = z.object({
  // Contact Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  pinCode: z.string().length(4, "PIN must be exactly 4 digits").regex(/^\d+$/, "PIN must contain only numbers"),

  // Car Information
  brand: z.string().min(1, "Please select a brand"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive("Price must be greater than 0"),
  mileage: z.string().refine((val) => MILEAGE_RANGES.includes(val), {
    message: "Please select a valid mileage range",
  }),

  // Technical Specifications
  fuelType: z.enum(FUEL_TYPES as [string, ...string[]]),
  transmission: z.enum(TRANSMISSION_TYPES as [string, ...string[]]),
  bodyType: z.enum(BODY_TYPES as [string, ...string[]]),
  exteriorColor: z.enum(COLORS as [string, ...string[]]),
  interiorColor: z.enum(COLORS as [string, ...string[]]),

  // Features
  features: z.array(z.enum(CAR_FEATURES as [string, ...string[]])).min(1, "Please select at least one feature"),

  // Media
  images: z.array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(3, "Maximum 3 images allowed")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each image must be less than 5MB",
    })
    .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),

  video: z.instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_VIDEO_SIZE;
    }, "Video must be less than 100MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_VIDEO_TYPES.includes(file.type);
    }, "Only .mp4, .webm and .mov formats are supported"),
});

export type SellCarFormData = z.infer<typeof sellCarSchema>;