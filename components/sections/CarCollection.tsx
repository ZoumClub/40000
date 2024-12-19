"use client";

import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { DUMMY_CARS } from "@/lib/constants/cars";
import { useCarFilters, FilterType } from "@/lib/hooks/useCarFilters";

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Cars' },
  { value: 'new', label: 'New Cars' },
  { value: 'used', label: 'Used Cars' },
];

interface CarCollectionProps {
  selectedBrand: string | null;
}

export default function CarCollection({ selectedBrand }: CarCollectionProps) {
  const { 
    typeFilter, 
    setTypeFilter, 
    filteredCars 
  } = useCarFilters(DUMMY_CARS.map(car => ({
    ...car,
    brand: car.name.split(' ')[0] // Extract brand from car name for demo
  })));

  const displayedCars = selectedBrand
    ? filteredCars.filter(car => car.brand === selectedBrand)
    : filteredCars;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Browse Our Collection</h2>
        
        <div className="flex flex-col items-center gap-8 mb-12">
          {selectedBrand && (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                Showing {selectedBrand} vehicles
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {FILTER_OPTIONS.map(option => (
              <Button 
                key={option.value}
                variant={typeFilter === option.value ? "default" : "outline"}
                onClick={() => setTypeFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {displayedCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No cars found matching your criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}