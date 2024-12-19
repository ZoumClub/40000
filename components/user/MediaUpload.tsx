"use client";

import { ImageUpload } from "./media/ImageUpload";
import { VideoUpload } from "./media/VideoUpload";

interface MediaUploadProps {
  carId: string;
  onSuccess?: () => void;
}

export function MediaUpload({ carId, onSuccess }: MediaUploadProps) {
  return (
    <div className="space-y-6">
      <ImageUpload carId={carId} onSuccess={onSuccess} />
      <VideoUpload carId={carId} onSuccess={onSuccess} />
    </div>
  );
}