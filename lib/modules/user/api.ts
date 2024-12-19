"use client";

import { supabase } from "@/lib/supabase/client";

export async function authenticateUser(name: string, pin: string): Promise<boolean> {
  try {
    // Set current PIN for RLS
    await supabase.rpc('set_current_pin', { pin });

    // Check if user exists with given name and PIN
    const { data, error } = await supabase
      .from("user_cars")
      .select("seller_name")
      .eq("seller_name", name)
      .eq("pin", pin)
      .limit(1);

    if (error) throw error;

    // Store credentials if valid
    if (data && data.length > 0) {
      localStorage.setItem("userPin", pin);
      localStorage.setItem("userName", name);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}

export async function getUserCars(pin: string) {
  try {
    // Set current PIN for RLS
    await supabase.rpc('set_current_pin', { pin });

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
            name,
            phone,
            whatsapp
          )
        )
      `)
      .eq("pin", pin)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user cars:", error);
    return { data: null, error };
  }
}