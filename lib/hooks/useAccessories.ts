"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Accessory } from "@/types/accessory";

export function useAccessories() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccessories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("accessories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  return {
    accessories,
    isLoading,
    refresh: fetchAccessories,
  };
}