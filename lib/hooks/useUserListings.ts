"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { UserCar } from "@/types/userCar";

export function useUserListings() {
  const [listings, setListings] = useState<UserCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
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
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data
      const transformedData = data?.map(car => ({
        ...car,
        features: car.user_car_features?.map(f => f.feature.name) || [],
        bids: car.user_car_bids || []
      }));

      setListings(transformedData || []);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      toast.error("Failed to load user listings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    refresh: fetchListings
  };
}