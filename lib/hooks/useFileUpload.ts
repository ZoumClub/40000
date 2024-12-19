"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";

export function useFileUpload(form: UseFormReturn<SellCarFormData>) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleImageUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const totalFiles = fileArray.length + imagePreviews.length;
    
    if (totalFiles > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const previews = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);

    const currentFiles = form.getValues("images") || [];
    form.setValue("images", [...currentFiles, ...fileArray], { shouldValidate: true });
  };

  const handleVideoUpload = (file: File) => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    form.setValue("video", file, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    const currentFiles = form.getValues("images");
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("images", newFiles, { shouldValidate: true });
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    form.setValue("video", undefined, { shouldValidate: true });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreviews, videoPreview]);

  return {
    imagePreviews,
    videoPreview,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
  };
}