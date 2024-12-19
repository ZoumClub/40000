"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface DealerStats {
  activeListings: number;
  carsSold: number;
  totalRevenue: number;
  activeBids: number;
  listingsTrend: number;
  salesTrend: number;
  revenueTrend: number;
  bidsTrend: number;
}

export function useDealerStats() {
  const [stats, setStats] = useState<DealerStats>({
    activeListings: 0,
    carsSold: 0,
    totalRevenue: 0,
    activeBids: 0,
    listingsTrend: 0,
    salesTrend: 0,
    revenueTrend: 0,
    bidsTrend: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get active listings
        const { data: activeListings } = await supabase
          .from("dealer_cars")
          .select("id")
          .eq("dealer_id", user.id)
          .eq("status", "approved");

        // Get sold cars
        const { data: soldCars } = await supabase
          .from("dealer_cars")
          .select("price, savings")
          .eq("dealer_id", user.id)
          .eq("status", "sold");

        // Get active bids
        const { data: activeBids } = await supabase
          .from("bids")
          .select("id")
          .eq("dealer_id", user.id)
          .eq("status", "pending");

        // Calculate revenue
        const totalRevenue = soldCars?.reduce((sum, car) => 
          sum + (car.price - (car.savings || 0)), 0) || 0;

        // Calculate trends (mock data for now)
        setStats({
          activeListings: activeListings?.length || 0,
          carsSold: soldCars?.length || 0,
          totalRevenue,
          activeBids: activeBids?.length || 0,
          listingsTrend: 5,
          salesTrend: 12,
          revenueTrend: 8,
          bidsTrend: -3,
        });
      } catch (error) {
        console.error("Error fetching dealer stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}