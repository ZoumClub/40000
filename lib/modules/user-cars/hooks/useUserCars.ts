"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { UserCar } from "../types";

export function useUserCars() {
  const [cars, setCars] = useState<UserCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

        setCars(transformedData || []);
      } catch (err) {
        console.error("Error fetching user cars:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch cars"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  return {
    cars,
    isLoading,
    error
  };
}