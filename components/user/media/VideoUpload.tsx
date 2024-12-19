"use client";

import { useState } from "react";
import { VideoPlus } from "lucide-react";
import { useMediaUpload } from "@/lib/modules/media/hooks/useMediaUpload";

interface VideoUploadProps {
  carId: string;
  onSuccess?: () => void;
}

export function VideoUpload({ carId, onSuccess }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { isUploading, handleVideoUpload } = useMediaUpload({
    carId,
    onSuccess
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { url, error } = await handleVideoUpload(file);
    if (!error && url) {
      setPreview(url);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Video</h3>
      <div>
        {preview ? (
          <div className="relative aspect-video bg-gray-50">
            <video
              src={preview}
              controls
              className="w-full h-full rounded-lg"
            />
          </div>
        ) : (
          <label className="aspect-video h-full border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center">
            <VideoPlus className="h-8 w-8 mb-2" />
            <span className="text-sm">Add Video</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}