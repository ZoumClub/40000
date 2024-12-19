"use client";

import { supabase } from "@/lib/supabase/client";

export async function updateUserCarApproval(carId: string, approved: boolean) {
  try {
    // First check if the car exists and is not sold
    const { data: car } = await supabase
      .from("user_cars")
      .select("availability_status")
      .eq("id", carId)
      .single();

    if (!car) {
      throw new Error("Car not found");
    }

    if (car.availability_status === "sold") {
      throw new Error("Cannot modify approval status of sold cars");
    }

    // Update approval status
    const { error } = await supabase
      .from("user_cars")
      .update({ 
        approval_status: approved ? "approved" : "pending",
        updated_at: new Date().toISOString()
      })
      .eq("id", carId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating approval status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update approval status" 
    };
  }
}