"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { validateImageFile, validateVideoFile } from "@/lib/utils/validation";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGES = 3;

export function useMediaUpload(form: UseFormReturn<SellCarFormData>) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreviews, videoPreview]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_IMAGES - imagePreviews.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      const validation = validateImageFile(file, MAX_IMAGE_SIZE);
      if (!validation.isValid && validation.error) {
        toast.error(validation.error);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Update form
    const currentFiles = form.getValues("images") || [];
    form.setValue("images", [...currentFiles, ...validFiles], { shouldValidate: true });
  }, [form, imagePreviews.length]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file, MAX_VIDEO_SIZE);
    if (!validation.isValid && validation.error) {
      toast.error(validation.error);
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    form.setValue("video", file, { shouldValidate: true });
  }, [form, videoPreview]);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    const currentFiles = form.getValues("images");
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("images", newFiles, { shouldValidate: true });
  }, [form, imagePreviews]);

  const removeVideo = useCallback(() => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    form.setValue("video", undefined, { shouldValidate: true });
  }, [form, videoPreview]);

  return {
    imagePreviews,
    videoPreview,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
    isMaxImagesReached: imagePreviews.length >= MAX_IMAGES
  };
}