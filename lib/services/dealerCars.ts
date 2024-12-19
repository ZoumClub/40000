"use client";

import { supabase } from "@/lib/supabase/client";
import { uploadCarMedia } from "@/lib/modules/media/storage";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

export async function createDealerCar(data: DealerCarFormData) {
  try {
    // 1. Insert car data
    const { data: carData, error: carError } = await supabase
      .from("dealer_cars")
      .insert({
        dealer_id: data.dealer_id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage_range: data.mileage_range,
        previous_owners: data.previous_owners,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        body_type: data.body_type,
        exterior_color: data.exterior_color,
        interior_color: data.interior_color,
        features: data.features,
        type: data.type,
      })
      .select()
      .single();

    if (carError) throw carError;

    // 2. Upload media
    const uploadPromises = [];

    // Upload images
    if (data.images?.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        uploadPromises.push(
          uploadCarMedia({
            file: data.images[i],
            carId: carData.id,
            type: "image",
            position: i,
          })
        );
      }
    }

    // Upload video if exists
    if (data.video) {
      uploadPromises.push(
        uploadCarMedia({
          file: data.video,
          carId: carData.id,
          type: "video",
          position: 0,
        })
      );
    }

    await Promise.all(uploadPromises);

    return { success: true, carId: carData.id };
  } catch (error) {
    console.error("Error creating dealer car:", error);
    return { success: false, error };
  }
}

export async function updateDealerCar(id: string, data: DealerCarFormData) {
  try {
    // 1. Update car data
    const { error: updateError } = await supabase
      .from("dealer_cars")
      .update({
        dealer_id: data.dealer_id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage_range: data.mileage_range,
        previous_owners: data.previous_owners,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        body_type: data.body_type,
        exterior_color: data.exterior_color,
        interior_color: data.interior_color,
        features: data.features,
        type: data.type,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 2. Handle media updates if needed
    if (data.images?.length > 0 || data.video) {
      // First delete existing media
      await supabase
        .from("dealer_car_media")
        .delete()
        .eq("car_id", id);

      const uploadPromises = [];

      // Upload new images
      if (data.images?.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          uploadPromises.push(
            uploadCarMedia({
              file: data.images[i],
              carId: id,
              type: "image",
              position: i,
            })
          );
        }
      }

      // Upload new video
      if (data.video) {
        uploadPromises.push(
          uploadCarMedia({
            file: data.video,
            carId: id,
            type: "video",
            position: 0,
          })
        );
      }

      await Promise.all(uploadPromises);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating dealer car:", error);
    return { success: false, error };
  }
}

export async function getDealerCar(id: string) {
  try {
    const { data, error } = await supabase
      .from("dealer_cars")
      .select(`
        *,
        dealer:dealers(*),
        media:dealer_car_media(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform media data
    const images = data.media
      ?.filter((m: any) => m.media_type === "image")
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((m: any) => m.url) || [];

    const video = data.media?.find((m: any) => m.media_type === "video")?.url;

    return {
      ...data,
      images,
      video,
    };
  } catch (error) {
    console.error("Error fetching dealer car:", error);
    throw error;
  }
}