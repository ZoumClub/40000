"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Activity {
  id: string;
  type: "sale" | "bid" | "listing";
  description: string;
  amount?: number;
  created_at: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch recent sales
        const { data: sales } = await supabase
          .from("car_sales")
          .select("id, sale_price, created_at, car:dealer_cars(brand, model)")
          .eq("dealer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch recent bids
        const { data: bids } = await supabase
          .from("bids")
          .select("id, amount, created_at, car:user_cars(brand, model)")
          .eq("dealer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Combine and format activities
        const allActivities: Activity[] = [
          ...(sales?.map(sale => ({
            id: sale.id,
            type: "sale" as const,
            description: `Sold ${sale.car.brand} ${sale.car.model}`,
            amount: sale.sale_price,
            created_at: sale.created_at,
          })) || []),
          ...(bids?.map(bid => ({
            id: bid.id,
            type: "bid" as const,
            description: `Placed bid on ${bid.car.brand} ${bid.car.model}`,
            amount: bid.amount,
            created_at: bid.created_at,
          })) || []),
        ].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 10);

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, isLoading };
}