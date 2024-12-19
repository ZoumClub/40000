"use client";

import { supabase } from "@/lib/supabase/client";
import type { SellCarFormData, SubmitCarResponse } from "../types";

export async function submitCarListing(formData: SellCarFormData): Promise<SubmitCarResponse> {
  try {
    // Set current PIN for RLS
    await supabase.rpc('set_current_pin', { pin: formData.pin });

    // Insert car data
    const { data: car, error: carError } = await supabase
      .from("user_cars")
      .insert({
        seller_name: formData.seller_name,
        pin: formData.pin,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price: formData.price,
        mileage_range: formData.mileage_range,
        previous_owners: formData.previous_owners,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        body_type: formData.body_type,
        exterior_color: formData.exterior_color,
        interior_color: formData.interior_color,
        approval_status: 'pending',
        availability_status: 'available'
      })
      .select()
      .single();

    if (carError) {
      console.error("Error creating car:", carError);
      throw new Error(carError.message);
    }

    // Insert features
    if (formData.features.length > 0) {
      const { data: features, error: featuresError } = await supabase
        .from("features")
        .select("id, name")
        .in("name", formData.features);

      if (featuresError) throw featuresError;

      const featureRecords = features?.map(feature => ({
        car_id: car.id,
        feature_id: feature.id
      }));

      if (featureRecords?.length) {
        const { error: linkError } = await supabase
          .from("user_car_features")
          .insert(featureRecords);

        if (linkError) throw linkError;
      }
    }

    // Store credentials in localStorage for dashboard access
    localStorage.setItem("userPin", formData.pin);
    localStorage.setItem("userName", formData.seller_name);

    return { success: true, carId: car.id };
  } catch (error) {
    console.error("Error submitting car listing:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit car listing" 
    };
  }
}