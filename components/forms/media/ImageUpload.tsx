"use client";

import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SellCarFormData } from "@/lib/validations/sellCar";

interface ImageUploadProps {
  form: UseFormReturn<SellCarFormData>;
  maxFiles?: number;
  maxSizeInMB?: number;
  accept?: string;
}

export default function ImageUpload({ 
  form, 
  maxFiles = 3,
  maxSizeInMB = 5,
  accept = "image/jpeg,image/jpg,image/png,image/webp"
}: ImageUploadProps) {
  const {
    previews,
    handleUpload,
    removeImage,
    isMaxImagesReached
  } = useImageUpload(form, { maxFiles, maxSizeInMB });

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Photos</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add up to {maxFiles} photos. Clear photos from different angles will help attract buyers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-video bg-gray-50">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {!isMaxImagesReached && (
          <label className="aspect-video h-full border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center">
            <ImagePlus className="h-8 w-8 mb-2" />
            <span className="text-sm">Add Image</span>
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e)}
            />
          </label>
        )}
      </div>
    </div>
  );
}