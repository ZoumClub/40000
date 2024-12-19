import { useState } from 'react';
import { Car } from '@/types/car';

export type FilterType = 'all' | 'new' | 'used';

export function useCarFilters(cars: Car[]) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const filteredCars = cars.filter(car => {
    return typeFilter === 'all' || car.type === typeFilter;
  });

  return {
    typeFilter,
    setTypeFilter,
    filteredCars,
  };
}