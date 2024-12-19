"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";
import { toast } from "sonner";

interface UseImageUploadOptions {
  maxImages: number;
  maxSizeInMB: number;
}

export function useImageUpload(
  form: UseFormReturn<SellCarFormData>,
  options: UseImageUploadOptions
) {
  const [previews, setPreviews] = useState<string[]>([]);
  const isMaxImagesReached = previews.length >= options.maxImages;

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    files.forEach(file => {
      if (file.size > options.maxSizeInMB * 1024 * 1024) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} image(s) exceed the ${options.maxSizeInMB}MB limit`);
    }

    return validFiles;
  };

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = options.maxImages - previews.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    const currentFiles = form.getValues("images") || [];
    form.setValue("images", [...currentFiles, ...validFiles], { shouldValidate: true });
  }, [form, previews.length, options.maxImages, options.maxSizeInMB]);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    
    const currentFiles = form.getValues("images");
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("images", newFiles, { shouldValidate: true });
  }, [form, previews]);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return {
    previews,
    handleUpload,
    removeImage,
    isMaxImagesReached,
  };
}