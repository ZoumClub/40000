"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Dealer } from "@/types/dealer";

export function useDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDealers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("dealers")
        .select("*")
        .order("name");

      if (error) throw error;
      setDealers(data || []);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  return {
    dealers,
    isLoading,
    refresh: fetchDealers,
  };
}