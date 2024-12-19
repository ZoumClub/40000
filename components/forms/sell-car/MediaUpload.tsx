"use client";

import { ImageUpload } from "../media/ImageUpload";
import { VideoUpload } from "../media/VideoUpload";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";

interface MediaUploadProps {
  form: UseFormReturn<SellCarFormData>;
}

export function MediaUpload({ form }: MediaUploadProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Upload Media</h2>
      <ImageUpload form={form} />
      <VideoUpload form={form} />
    </div>
  );
}