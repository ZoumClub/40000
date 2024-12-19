"use client";

import { supabase } from "@/lib/supabase/client";
import { transformCarData } from "./utils";
import type { CarData } from "./types";
import type { DealerCar } from "@/types/dealerCar";

export async function fetchDealerCars(): Promise<{ data: DealerCar[] | null; error: Error | null }> {
  try {
    // Get current dealer's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

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
      .eq('dealer_id', session.user.id) // Filter by current dealer's ID
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Transform and validate the data
    const transformedData = data
      .filter(car => car && car.dealer)
      .map(car => transformCarData(car as CarData));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error fetching dealer cars:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Failed to fetch dealer cars") 
    };
  }
}

export async function updateCarStatus(carId: string, status: 'available' | 'sold') {
  try {
    // Get current dealer's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    if (!carId) {
      throw new Error("Car ID is required");
    }

    const { data, error } = await supabase
      .from("dealer_cars")
      .update({ status })
      .eq("id", carId)
      .eq("dealer_id", session.user.id) // Ensure dealer can only update their own cars
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: transformCarData(data as CarData) };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Failed to update car status")
    };
  }
}