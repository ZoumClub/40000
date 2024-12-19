"use client";

import { useState, useEffect } from "react";
import { getFeatures } from "./api";
import type { Feature } from "./types";

export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFeatures();
        setFeatures(data);
      } catch (err) {
        console.error("Error fetching features:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch features"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeatures();
  }, []);

  return {
    features,
    isLoading,
    error,
  };
}