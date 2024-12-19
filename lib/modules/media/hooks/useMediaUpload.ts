"use client";

import { useState } from "react";
import { toast } from "sonner";
import { validateImage, validateVideo } from "../validation";
import { uploadMedia, saveMediaRecord } from "../storage";
import { MAX_IMAGES } from "../constants";
import type { UploadResult } from "../types";

interface UseMediaUploadOptions {
  carId: string;
  onSuccess?: () => void;
}

export function useMediaUpload({ carId, onSuccess }: UseMediaUploadOptions) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = MAX_IMAGES - previews.length;

    if (fileArray.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    try {
      setIsUploading(true);

      for (const file of fileArray) {
        // Validate file
        const validation = validateImage(file);
        if (!validation.isValid) {
          toast.error(validation.error);
          continue;
        }

        // Upload image
        const { url, error } = await uploadMedia(file, carId, "image");
        if (error) throw error;

        // Save to database
        await saveMediaRecord(carId, url, "image", previews.length);

        setPreviews(prev => [...prev, url]);
      }

      toast.success("Images uploaded successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (file: File): Promise<UploadResult> => {
    try {
      setIsUploading(true);

      // Validate file
      const validation = validateVideo(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Upload video
      const result = await uploadMedia(file, carId, "video");
      if (result.error) throw result.error;

      // Save to database
      await saveMediaRecord(carId, result.url, "video", 0);

      toast.success("Video uploaded successfully");
      onSuccess?.();

      return result;
    } catch (error) {
      console.error("Error uploading video:", error);
      const message = error instanceof Error ? error.message : "Failed to upload video";
      toast.error(message);
      return { url: "", error: error instanceof Error ? error : new Error(message) };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    previews,
    isUploading,
    handleImageUpload,
    handleVideoUpload,
    isMaxImagesReached: previews.length >= MAX_IMAGES
  };
}