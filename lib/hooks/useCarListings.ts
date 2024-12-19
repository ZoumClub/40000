"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Car } from "@/types/car";

export function useCarListings() {
  const [listings, setListings] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_cars")
        .select(`
          *,
          car_features (feature),
          car_media (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching car listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    isLoading,
    refresh: fetchListings,
  };
}