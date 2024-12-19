"use client";

import { ImagePlus } from "lucide-react";
import { useMediaUpload } from "@/lib/modules/media/hooks/useMediaUpload";
import { MAX_IMAGES } from "@/lib/modules/media/constants";

interface ImageUploadProps {
  carId: string;
  onSuccess?: () => void;
}

export function ImageUpload({ carId, onSuccess }: ImageUploadProps) {
  const { previews, isUploading, handleImageUpload, isMaxImagesReached } = useMediaUpload({
    carId,
    onSuccess
  });

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Photos ({previews.length}/{MAX_IMAGES})</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-video bg-gray-50">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
        {!isMaxImagesReached && (
          <label className="aspect-video h-full border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center">
            <ImagePlus className="h-8 w-8 mb-2" />
            <span className="text-sm">Add Image</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}