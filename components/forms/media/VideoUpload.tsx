"use client";

import { useVideoUpload } from "@/lib/hooks/useVideoUpload";
import { Button } from "@/components/ui/button";
import { VideoPlus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SellCarFormData } from "@/lib/validations/sellCar";

interface VideoUploadProps {
  form: UseFormReturn<SellCarFormData>;
  maxSizeInMB?: number;
  accept?: string;
}

export default function VideoUpload({ 
  form,
  maxSizeInMB = 100,
  accept = "video/mp4,video/webm,video/quicktime"
}: VideoUploadProps) {
  const {
    preview,
    handleUpload,
    removeVideo
  } = useVideoUpload(form, { maxSizeInMB });

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Video (Optional)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add a short video walkthrough to showcase features.
      </p>

      <div>
        {preview ? (
          <div className="relative aspect-video bg-gray-50">
            <video
              src={preview}
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
              accept={accept}
              className="hidden"
              onChange={(e) => handleUpload(e)}
            />
          </label>
        )}
      </div>
    </div>
  );
}