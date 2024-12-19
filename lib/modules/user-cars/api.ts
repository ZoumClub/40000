"use client";

import { supabase } from "@/lib/supabase/client";
import type { UserCar } from "@/types/userCar";

export async function fetchUserCars() {
  try {
    const { data, error } = await supabase
      .from("user_cars")
      .select(`
        *,
        user_car_bids (
          id,
          amount,
          status,
          created_at,
          dealer:dealers (
            id,
            name,
            phone,
            whatsapp
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user cars:", error);
    return { data: null, error };
  }
}

export async function submitBid(carId: string, dealerId: string, amount: number) {
  try {
    // Check if car already has an accepted bid
    const { data: existingBid } = await supabase
      .from("user_car_bids")
      .select("status")
      .eq("car_id", carId)
      .eq("status", "accepted")
      .single();

    if (existingBid) {
      throw new Error("This car has already been sold");
    }

    const { error } = await supabase
      .from("user_car_bids")
      .insert({
        car_id: carId,
        dealer_id: dealerId,
        amount,
        status: "pending"
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting bid:", error);
    return { success: false, error };
  }
}

export async function acceptBid(bidId: string) {
  try {
    const { error } = await supabase
      .from("user_car_bids")
      .update({ status: "accepted" })
      .eq("id", bidId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error accepting bid:", error);
    return { success: false, error };
  }
}