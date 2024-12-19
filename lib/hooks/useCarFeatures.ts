"use client";

import { useState, useCallback } from "react";
import {
  getFeaturesList,
  getDealerCarFeatures,
  getUserCarFeatures,
  addDealerCarFeature,
  addUserCarFeature,
  removeDealerCarFeature,
  removeUserCarFeature
} from "@/lib/api/features";
import type { Feature, CarFeature } from "@/lib/api/features";

interface UseCarFeaturesParams {
  carId: string;
  carType: 'dealer_car' | 'user_car';
  initialFeatures?: string[];
}

export function useCarFeatures({ carId, carType, initialFeatures = [] }: UseCarFeaturesParams) {
  const [features, setFeatures] = useState<string[]>(initialFeatures);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addFeature = useCallback(async (featureId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (carType === 'dealer_car') {
        await addDealerCarFeature(carId, featureId);
      } else {
        await addUserCarFeature(carId, featureId);
      }
      
      // Refresh features after adding
      await refreshFeatures();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add feature'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [carId, carType]);

  const removeFeature = useCallback(async (featureId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (carType === 'dealer_car') {
        await removeDealerCarFeature(featureId);
      } else {
        await removeUserCarFeature(featureId);
      }
      
      // Refresh features after removing
      await refreshFeatures();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove feature'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [carId, carType]);

  const refreshFeatures = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const carFeatures = carType === 'dealer_car' 
        ? await getDealerCarFeatures(carId)
        : await getUserCarFeatures(carId);
        
      setFeatures(carFeatures.map(f => f.feature));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch features'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [carId, carType]);

  return {
    features,
    isLoading,
    error,
    addFeature,
    removeFeature,
    refreshFeatures
  };
}