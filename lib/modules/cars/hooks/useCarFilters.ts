"use client";

import { useState, useMemo } from 'react';
import type { DealerCar } from '../types';

export type FilterType = 'all' | 'new' | 'used';

export function useCarFilters(cars: DealerCar[]) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const filteredCars = useMemo(() => {
    if (typeFilter === 'all') return cars;
    return cars.filter(car => car.type === typeFilter);
  }, [cars, typeFilter]);

  return {
    typeFilter,
    setTypeFilter,
    filteredCars,
  };
}