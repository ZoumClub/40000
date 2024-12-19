"use client";

import { supabase } from "@/lib/supabase/client";
import { transformCarData } from "../utils";
import type { CarData } from "../types";
import type { DealerCar } from "@/types/dealerCar";

// Fetch all cars for admin view
export async function fetchAllDealerCars(): Promise<{ data: DealerCar[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("dealer_cars")
      .select(`
        *,
        dealer:dealers(name, phone, whatsapp),
        dealer_car_media(
          url,
          media_type,
          position
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data) return { data: null, error: null };

    const transformedData = data
      .filter(car => car && car.dealer)
      .map(car => transformCarData(car as CarData));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error fetching all dealer cars:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Failed to fetch dealer cars") 
    };
  }
}

// Admin can update any car's status
export async function updateCarStatusAdmin(carId: string, status: 'available' | 'sold') {
  try {
    const { data, error } = await supabase
      .from("dealer_cars")
      .update({ status })
      .eq("id", carId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: transformCarData(data as CarData) };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Failed to update car status")
    };
  }
}