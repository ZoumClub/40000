"use client";

import { supabase } from "@/lib/supabase/client";

export async function submitBid(carId: string, dealerId: string, amount: number) {
  try {
    const { error } = await supabase
      .from("user_car_bids")
      .insert({
        car_id: carId,
        dealer_id: dealerId,
        amount
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting bid:", error);
    return { success: false, error };
  }
}