import { z } from "zod";
import { 
  MAX_IMAGE_SIZE, 
  MAX_VIDEO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES 
} from "@/lib/modules/media/constants";

export const mediaSchema = {
  images: z.array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(3, "Maximum 3 images allowed")
    .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
      message: `Each image must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
    })
    .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),

  video: z.instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_VIDEO_SIZE;
    }, `Video must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`)
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_VIDEO_TYPES.includes(file.type);
    }, "Only .mp4, .webm and .mov formats are supported"),
};