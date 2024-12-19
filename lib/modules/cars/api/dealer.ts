"use client";

import { supabase } from "@/lib/supabase/client";
import { transformCarData } from "../utils";
import type { DealerCar } from "@/types/dealerCar";

interface FetchDealerCarsOptions {
  dealerId?: string;
  status?: string;
}

export async function fetchDealerCars(options?: FetchDealerCarsOptions) {
  try {
    let query = supabase
      .from("dealer_cars")
      .select(`
        *,
        dealer:dealers(name, phone, whatsapp),
        features:dealer_car_features(
          feature:features(
            name,
            category
          )
        ),
        media:dealer_car_media(*)
      `);

    // Apply filters if provided
    if (options?.dealerId) {
      query = query.eq('dealer_id', options.dealerId);
    }

    // Order by most recent first
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data
    const transformedCars = data?.map(car => transformCarData(car)) || [];

    return { data: transformedCars, error: null };
  } catch (error) {
    console.error("Error fetching dealer cars:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Failed to fetch dealer cars") 
    };
  }
}

export async function updateCarStatus(carId: string, dealerId: string, status: 'available' | 'sold') {
  try {
    const { data, error } = await supabase
      .from("dealer_cars")
      .update({ availability_status: status })
      .eq("id", carId)
      .eq("dealer_id", dealerId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: transformCarData(data) };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Failed to update car status")
    };
  }
}