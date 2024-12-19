import { supabase } from "@/lib/supabase/client";
import type { UserCar } from "@/types/userCar";

export async function placeBid(carId: string, amount: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("bids")
      .insert({
        car_id: carId,
        dealer_id: user.id,
        amount: amount
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error placing bid:", error);
    return { data: null, error };
  }
}

export async function getBidsForCar(carId: string) {
  try {
    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("car_id", carId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching bids:", error);
    return { data: null, error };
  }
}