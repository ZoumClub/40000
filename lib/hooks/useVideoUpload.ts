"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";
import { toast } from "sonner";

interface UseVideoUploadOptions {
  maxSizeInMB: number;
}

export function useVideoUpload(
  form: UseFormReturn<SellCarFormData>,
  options: UseVideoUploadOptions
) {
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > options.maxSizeInMB * 1024 * 1024) {
      toast.error(`Video must be less than ${options.maxSizeInMB}MB`);
      return false;
    }
    return true;
  };

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    form.setValue("video", file, { shouldValidate: true });
  }, [form, preview, options.maxSizeInMB]);

  const removeVideo = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    form.setValue("video", undefined, { shouldValidate: true });
  }, [form, preview]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return {
    preview,
    handleUpload,
    removeVideo,
  };
}