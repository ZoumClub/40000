"use client";

import { supabase } from "@/lib/supabase/client";
import type { UserCar } from "../types";

export async function fetchUserCars() {
  try {
    const pin = localStorage.getItem("userPin");
    if (!pin) {
      throw new Error("No PIN found");
    }

    // Set current PIN for RLS
    await supabase.rpc('set_current_pin', { pin });

    const { data, error } = await supabase
      .from("user_cars")
      .select(`
        *,
        user_car_features!inner(
          feature:features(
            name,
            category
          )
        ),
        user_car_bids(
          id,
          amount,
          created_at,
          dealer:dealers(
            name,
            phone,
            whatsapp
          )
        )
      `)
      .eq("pin", pin)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data
    const transformedData = data?.map(car => ({
      ...car,
      features: car.user_car_features?.map(f => f.feature.name) || [],
      bids: car.user_car_bids || []
    }));

    return { data: transformedData as UserCar[], error: null };
  } catch (error) {
    console.error("Error fetching user cars:", error);
    return { data: null, error };
  }
}