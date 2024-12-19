"use client";

import { useState, useEffect } from "react";
import { getUserCars } from "../api";
import type { UserCar } from "@/lib/modules/cars/types";

export function useUserCars() {
  const [cars, setCars] = useState<UserCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const pin = localStorage.getItem("userPin");
        
        if (!pin) {
          throw new Error("No PIN found");
        }

        const { data, error } = await getUserCars(pin);
        
        if (error) throw error;
        setCars(data || []);
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
    error,
  };
}