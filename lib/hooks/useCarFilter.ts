import { useState } from 'react';
import { Car } from '@/types/car';

export type FilterType = 'all' | 'new' | 'used';

export function useCarFilter(cars: Car[]) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredCars = cars.filter(
    car => filter === 'all' || car.type === filter
  );

  return {
    filter,
    setFilter,
    filteredCars,
  };
}