"use client";

import { supabase } from "@/lib/supabase/client";

interface UploadResult {
  url: string;
  error?: Error;
}

export async function uploadMedia(
  file: File,
  carId: string,
  type: "image" | "video"
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${carId}-${Date.now()}.${fileExt}`;
    const folder = type === "image" ? "car-images" : "car-videos";
    const filePath = `${folder}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('car-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('car-media')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    return { 
      url: "", 
      error: error instanceof Error ? error : new Error(`Failed to upload ${type}`) 
    };
  }
}

export async function saveMediaRecord(
  carId: string,
  url: string,
  type: "image" | "video",
  position: number
) {
  const { error } = await supabase
    .from('user_car_media')
    .insert({
      car_id: carId,
      media_type: type,
      url,
      position
    });

  if (error) throw error;
}