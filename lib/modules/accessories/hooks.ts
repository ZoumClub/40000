"use client";

import { useState, useEffect } from "react";
import { getAccessories } from "./api";
import type { Accessory } from "./types";

export function useAccessories() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAccessories() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAccessories();
        setAccessories(data);
      } catch (err) {
        console.error("Error fetching accessories:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch accessories"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccessories();
  }, []);

  return {
    accessories,
    isLoading,
    error,
  };
}