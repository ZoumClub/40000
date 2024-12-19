"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { UserCar } from "@/types/userCar";

export function useUserCars() {
  const [cars, setCars] = useState<UserCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current dealer's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_cars")
        .select(`
          *,
          bids(*)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter bids to only show current dealer's bids
      const carsWithBids = data?.map(car => ({
        ...car,
        bids: car.bids?.filter(bid => bid.dealer_id === user.id)
      }));

      setCars(carsWithBids || []);
    } catch (err) {
      console.error("Error fetching user cars:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch cars"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    isLoading,
    error,
    refresh: fetchCars
  };
}