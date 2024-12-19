"use client";

import { useState, useEffect } from "react";
import { fetchDealerCars } from "@/lib/modules/cars/api/dealer";
import type { DealerCar } from "@/types/dealerCar";

interface UseDealerCarsOptions {
  dealerId?: string;
  status?: 'approved' | 'pending' | 'rejected' | 'sold';
  autoFetch?: boolean;
}

export function useDealerCars(options: UseDealerCarsOptions = {}) {
  const [cars, setCars] = useState<DealerCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await fetchDealerCars(options);
      
      if (error) throw error;
      if (!data) throw new Error("No data received");

      setCars(data);
    } catch (err) {
      console.error("Error fetching dealer cars:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch cars"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchCars();
    }
  }, [options.dealerId, options.status]);

  return {
    cars,
    isLoading,
    error,
    refresh: fetchCars
  };
}