"use client";

import { supabase } from "@/lib/supabase/client";

export async function validateCarPin(carId: string, pin: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('authenticate_car_owner', {
        car_id: carId,
        pin: pin
      });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Error validating car PIN:", error);
    return false;
  }
}

export async function setCurrentPin(pin: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('set_current_pin', {
        pin: pin
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error setting current PIN:", error);
    return false;
  }
}