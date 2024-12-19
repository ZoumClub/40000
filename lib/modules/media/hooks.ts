"use client";

import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

interface MediaFile {
  file: File;
  preview: string;
}

interface UseMediaUploadConfig {
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export function useMediaUpload(
  form: UseFormReturn<DealerCarFormData>,
  fieldName: "images" | "video",
  config: UseMediaUploadConfig
) {
  const {
    maxFiles = 1,
    maxSizeInMB = 5,
    acceptedTypes = ["*/*"]
  } = config;

  const [files, setFiles] = useState<MediaFile[]>([]);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File must be less than ${maxSizeInMB}MB`);
      return false;
    }

    if (!acceptedTypes.includes("*/*") && !acceptedTypes.includes(file.type)) {
      toast.error(`Only ${acceptedTypes.join(", ")} formats are supported`);
      return false;
    }

    return true;
  };

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;

    if (selectedFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more file(s)`);
      return;
    }

    const validFiles: MediaFile[] = [];

    selectedFiles.forEach(file => {
      if (validateFile(file)) {
        validFiles.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
    });

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      
      form.setValue(fieldName, fieldName === "video" ? validFiles[0].file : newFiles.map(f => f.file), {
        shouldValidate: true
      });
    }
  }, [form, fieldName, files, maxFiles, maxSizeInMB, acceptedTypes]);

  const removeFile = useCallback((index: number) => {
    URL.revokeObjectURL(files[index].preview);
    
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    form.setValue(fieldName, fieldName === "video" ? undefined : newFiles.map(f => f.file), {
      shouldValidate: true
    });
  }, [form, fieldName, files]);

  return {
    files,
    handleUpload,
    removeFile,
    isMaxFilesReached: files.length >= maxFiles
  };
}