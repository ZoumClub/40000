"use client";

import { useCallback } from "react";
import { useMediaUpload } from "@/lib/hooks/useMediaUpload";
import { Button } from "@/components/ui/button";
import { ImagePlus, VideoPlus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface MediaUploadProps {
  form: UseFormReturn<any>;
}

export function MediaUpload({ form }: MediaUploadProps) {
  const {
    imagePreviews,
    videoPreview,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
    isMaxImagesReached
  } = useMediaUpload(form);

  const onImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  }, [handleImageUpload]);

  const onVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleVideoUpload(e.target.files[0]);
    }
  }, [handleVideoUpload]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Photos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add up to 3 photos of your car. Clear photos from different angles will help attract buyers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
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
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={onImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Video (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add a short video walkthrough to showcase features.
        </p>

        <div>
          {videoPreview ? (
            <div className="relative aspect-video bg-gray-50">
              <video
                src={videoPreview}
                controls
                className="w-full h-full rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="aspect-video h-full border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center">
              <VideoPlus className="h-8 w-8 mb-2" />
              <span className="text-sm">Add Video</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={onVideoUpload}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}